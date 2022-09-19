/* eslint-disable no-unused-vars */
import { workspace, window, Uri, FileSystemWatcher, env, languages, ConfigurationTarget } from 'vscode';
import prettify, { Options } from '@liquify/prettify';
import { join } from 'node:path';
import { pathExists, readFile, readJSON, writeFile, writeJSON } from 'fs-extra';
import { Editor } from './editor';
import { ConfigType } from './state';
import { getSelectors, jsonc, omitRules, recommendedRules, Status } from './utilities';
import { has, omit } from 'rambda';
import { EN } from './i18n';
// import anymatch from 'anymatch';

/**
 * Extension Settings
 *
 * This enum is used to determine how configuration
 * files are setup in the users workspace.
 */
export const enum EXTSettings {
  /**
   * Using Deprecated Workspace settings
   */
  DeprecatedWorkspaceSettings = 1,
  /**
   * Using Deprecated Liquidrc settings
   */
  DeprecatedLiquidrcSettings,
  /**
   * Workspace Settings are not defined
   */
  WorkspaceUndefined,
  /**
   * Workspace Settings are defined
   */
  WorkspaceDefined,
  /**
   * No Liquidrc file is present
   */
  LiquidrcUndefined,
  /**
   * Liquidrc file is present
   */
  LiquidrcDefined,
  /**
   * Prettify Field in package.json is defined
   */
  PrettifyFieldDefined,
  /**
   * No configuration is defined
   */
  ConfigurationUndefined,
}

/**
 * Applies custom configuration settings used
 * by the extension.
 *
 * @class Config
 * @extends Utils
 */

export class Settings extends Editor {

  private watcher: FileSystemWatcher[] = [];
  private ignored: string[] = [];
  private target: ConfigurationTarget = ConfigurationTarget.Workspace;
  private prettify: {};
  private watchChange: boolean = false;

  hasConfigOption (selector: string, inspect?: any) {

    if (selector.charCodeAt(0) !== 91) return workspace.getConfiguration().has(selector);

    const language = workspace.getConfiguration().inspect(selector);

    if (this.target === ConfigurationTarget.Workspace) {
      return (
        typeof language.workspaceValue === 'object' &&
        has(inspect, language.workspaceValue)
      );
    } else if (this.target === ConfigurationTarget.Global) {
      return (
        typeof language.globalValue === 'object' &&
        has(inspect, language.globalValue)
      );

    }

  }

  usingDeprecatedConfig (rcfile: any = undefined) {

    if (rcfile === undefined) {
      if (this.liquidSettings.has('format')) {
        const inuse = this.liquidSettings.get('format');
        if (typeof inuse === 'boolean' && inuse === true) return true;
      } else {
        return false;
      }
    }

    return rcfile && (
      has('html', rcfile) ||
      has('js', rcfile) ||
      has('css', rcfile) ||
      has('scss', rcfile)
    );

  }

  /**
   * Get Settings
   *
   * Walks over the editor settings and determines
   * the configuration defined. Returns an enum that informs
   * upon activation state.
   */
  getSettings () {

    // Using deprecated settings
    if (this.usingDeprecatedConfig()) {
      return EXTSettings.DeprecatedWorkspaceSettings;
    }

    if (this.commandInvoked) {
      this.commandInvoked = false;
      return;
    }

    const enable = this.liquidSettings.get<boolean>('enable');
    const target = this.liquidSettings.get<'workspace' | 'user'>('settings.target');
    const validate = this.liquidSettings.get<{ json: boolean }>('validate');
    const format = this.liquidSettings.get<Options & { ignore: string[]; enable: boolean; }>('format');
    const exclude = omit([ 'ignore', 'enable' ]);

    console.log('in settings', this.capability);

    // No configuration defined for the extension
    if (enable === undefined && format === undefined) {
      return EXTSettings.WorkspaceUndefined;
    }

    // Whether or not the extension is disabled
    this.isDisabled = enable === false;

    if (validate && typeof validate === 'object') {
      if (has('json', validate) && typeof validate.json === 'boolean') {
        this.capability.shopifySchemaValidate = validate.json;
      } else {
        this.capability.shopifySchemaValidate = enable;
      }
    }

    if (target && typeof target === 'string') {
      if (target === 'user') {
        this.target = ConfigurationTarget.Global;
      } else if (target === 'workspace' && this.target !== ConfigurationTarget.Workspace) {
        this.target = ConfigurationTarget.Workspace;
      }
    }

    if (format && typeof format === 'object') {

      let defined: boolean = this.configType === ConfigType.EditorSettings;
      let options: EXTSettings = EXTSettings.WorkspaceUndefined;

      // If first run, we will assert editor settings is being used
      if (isNaN(this.configType)) {
        this.configType = ConfigType.EditorSettings;
        defined = true;
      }

      if (defined && Array.isArray(format.ignore)) {
        this.ignored = format.ignore;
        options = EXTSettings.WorkspaceDefined;
      }

      // lets determine if formatting is enabled or not
      if (has('enable', format) && typeof format.enable === 'boolean') {
        this.capability.formatting = format.enable;
      }

      // if we are using editor settings lets apply prettify rules
      if (defined) {
        this.prettify = exclude(format);
      }

      return options;

    }

    return EXTSettings.WorkspaceUndefined;

  }

  /**
   * Get Package JSON
   *
   * Checks for the existence of a `package.json` files
   * and then looks for a _prettify_ property. When detected
   * the extension will use the rules defined there.
   */
  async getPkgJSON (uri?: string) {

    const path = uri || join(this.rootPath, 'package.json');
    const exists = await pathExists(path);

    if (!exists) return;

    this.uri.package = path;

    try {

      const pkg = await readJSON(this.uri.package, { throws: true });

      if (has('prettify', pkg) && typeof pkg.prettify === 'object') {

        if (has('ignore', pkg.prettify) && Array.isArray(pkg.prettify.ignore)) {
          this.ignored = pkg.prettify.ignore;
        }

        this.prettify = omit('ignore', pkg.prettify);
        this.configType = ConfigType.PackageJSONField;

        // when the prettify config field exists and formatting capability is still null
        // then we will enable it because it is assumed with existence of this field.
        if (this.capability.formatting === null) {
          this.capability.formatting = true;
        }

        // when the prettify config field exists and isDisabled is still null
        // then we will enable it because it is assumed with existence of this field.
        if (this.isDisabled === null) {
          this.isDisabled = false;
        }

        return true;
      }

    } catch (error) {
      console.log(error);
      this.logOutput('error', EN.INVALID_PKG_PARSE);
    }

    return false;
  }

  /**
   * Get Liquidrc
   *
   * Checks for the existence of a `.liquirc` file and parses it.
   * Determines the _type_ of file and reasons with it accordingly.
   * When a `liquidrc` file is detected then it will run precedence over
   * all over configuration options.
   *
   * Returns a number based value which indicated what occured in the parse:
   */
  async getLiquidrc () {

    let setting: EXTSettings = EXTSettings.LiquidrcUndefined;
    let path = join(this.rootPath, '.liquidrc');

    const exclude = omit('ignore');
    const exists = await pathExists(path);

    if (exists === false) {

      path = join(this.rootPath, '.liquidrc.json');

      const exists = await pathExists(path);

      if (exists === false) return { setting, rcfile: null };
    }

    this.configType = ConfigType.RCFile;
    this.uri.liquidrc = path;

    try {

      const read = await readFile(this.uri.liquidrc);
      const rcfile = jsonc(read.toString());

      if (typeof rcfile === 'object') {

        setting = EXTSettings.LiquidrcDefined;

        if (this.usingDeprecatedConfig(rcfile)) {
          return {
            setting: EXTSettings.DeprecatedLiquidrcSettings,
            rcfile: read.toString()
          };
        }

        if (has('ignore', rcfile) && Array.isArray(rcfile.ignore)) {
          this.ignored = rcfile.ignore;
        }

        this.prettify = exclude(rcfile);

        // when liquidrc file exists and formatting capability is still null
        // then we will enable it because it is assumed with existence
        // of the liquidrc file being present.
        if (this.capability.formatting === null) {
          this.capability.formatting = true;
        }

        // when liquidrc file exists and isDisabled is still null
        // then we will ensure to enable it because it is assumed with existence
        // of the liquidrc file being present.
        if (this.isDisabled === null) {
          this.isDisabled = false;
        }

        return {
          setting,
          rcfile: read.toString()
        };

      } else {
        this.logOutput('error', EN.INVALID_LIQUIDRC_TYPE);
      }

    } catch (error) {
      console.error(error);
      this.logOutput('error', EN.INVALID_LIQUIDRC_PARSE);
    }

    return {
      setting,
      rcfile: null
    };

  }

  /**
   * Start watching the `.liquidrc` file and `package.json` for changes.
   * Passing a `false` parameter will dispose the watchers.
   */
  watchConfigFiles (startWatching = true) {

    if (startWatching === false) {

      for (const watcher of this.watcher) watcher.dispose();

      this.isWatching = false;

    } else {

      this.watcher.push(
        workspace.createFileSystemWatcher('**/.liquidr{c,c.json}'),
        workspace.createFileSystemWatcher('**/package.json')
      );

      for (const watcher of this.watcher) {
        watcher.onDidChange((uri) => this.setFormattingRules('change', uri));
        watcher.onDidDelete((uri) => this.setFormattingRules('delete', uri));
        watcher.onDidCreate((uri) => this.setFormattingRules('create', uri));
      }

      this.isWatching = true;
    }
  }

  async upgradeExtension () {

    const answer = await window.showErrorMessage(EN.UPDATE_SETTINGS, 'Release Notes');

    if (answer === 'Release Notes') {

      const config = this.liquidSettings.inspect('format');

      if (config.globalValue === true) {
        this.doNotStart = true;
        return env.openExternal(Uri.parse('https://github.com/panoply/vscode-liquid/releases/tag/v3.0.0'));
      }

    }
  }

  async setWorkspaceDefaults () {

    const config = workspace.getConfiguration();

    if (this.capability.formatting === true) {

      const html = config.inspect('[html]');
      const value = { 'editor.defaultFormatter': 'sissel.shopify-liquid' };

      if (typeof html.workspaceValue !== 'object' || !has('editor.defaultFormatter', html.workspaceValue)) {
        await config.update('[html]', value, this.target, true);
        this.logOutput('assigned default formatter');
      } else {
        if (
          typeof html.workspaceValue === 'object' &&
          has('editor.defaultFormatter', html.workspaceValue) &&
          html.workspaceValue['editor.defaultFormatter'] !== 'sissel.shopify-liquid'
        ) {
          this.logOutput('unable to assign default formatter, record already exists');
        }
      }
    }

    if (this.target === ConfigurationTarget.Workspace) {

      const ws = config.inspect('html.validate');

      if (!has('scripts', ws)) {
        await config.update('html.validate.scripts', false, this.target);
        this.logOutput('disabled html script validations for workspace');
      }

      if (!has('styles', ws)) {
        await config.update('html.validate.styles', false, this.target);
        this.logOutput('disabled html style validations for workspace');
      }
    }

    if (this.isLoading) this.isLoading = false;

    if (this.capability.formatting) {
      this.statusBar(Status.Enabled, true);
    } else {
      this.statusBar(Status.Disabled, true);
    }
  }

  async getConfigFile () {

    const settings = this.getSettings();

    if (settings === EXTSettings.DeprecatedWorkspaceSettings) {
      this.statusBar(Status.Upgrade, true);
      this.isDisabled = true;
      return;
    }

    try {

      await this.getPkgJSON();

      const liquidrc = await this.getLiquidrc();

      if (liquidrc.setting === EXTSettings.DeprecatedLiquidrcSettings) {
        this.statusBar(Status.Upgrade, true);
        this.isDisabled = true;
        return;
      }

      if (this.capability.formatting === true) {
        await this.setWorkspaceDefaults();
      }

      // setup formatting output
      // prints everytime the document is formatted
      prettify.format.after((_, { language }) => {
        this.logOutput(`${language} formatted in ${prettify.format.stats.time}ms`);
      });

      this.watchConfigFiles();

      if (this.configType === ConfigType.EditorSettings) {
        this.logOutput(EN.SETTINGS_WORKSPACE);
      } else if (this.configType === ConfigType.PackageJSONField) {
        this.logOutput(EN.SETTINGS_PKG_PRETTIFY);
      } else if (this.configType === ConfigType.RCFile) {
        this.logOutput(`${EN.SETTINGS_LIQUIDRC} ${this.uri.liquidrc}`);
      }

      if (this.capability.formatting) {
        this.statusBar(Status.Enabled, true);
        prettify.options(this.prettify);
      } else {
        this.statusBar(Status.Disabled, true);
      }

      this.selector = getSelectors(!this.isDisabled);
      this.isReady = true;

    } catch (error) {

      console.error(error);
    }

  }

  setConfigSettings () {

    const isDisabled = this.isDisabled;
    const canFormat = this.capability.formatting;
    const canValidate = this.capability.shopifySchemaValidate;

    this.getSettings();

    if (this.isDisabled) {
      this.selector = getSelectors();
      this.logOutput(EN.DISABLED_EXTENSION);
    } else {
      if (this.isDisabled !== isDisabled) {
        this.logOutput(EN.ENABLED_EXTENSION);
      }
    }

    if (this.capability.formatting === false) {
      this.statusBar(Status.Disabled, true);
      this.logOutput(EN.DISABLED_FORMAT);
    } else {
      if (this.capability.formatting !== canFormat) {
        this.statusBar(Status.Enabled, true);
        this.logOutput(EN.ENABLED_FORMAT);
      }
    }

    if (this.capability.formatting && this.configType === ConfigType.EditorSettings) {
      prettify.options(this.prettify);
    }

    if (canValidate === true && this.capability.shopifySchemaValidate === false) {
      this.logOutput(EN.DISABLED_SCHEMA_VALIDATE);
    } else if (this.capability.shopifySchemaValidate === true && canValidate === false) {
      this.logOutput(EN.ENABLED_SCHEMA_VALIDATE);
    }

  }

  /**
   * Defines where formatting rules are sourced.
   * Looks for rules defined in a `.liquirc` file and if
   * no file present will default to workspace settings configuration.
   */
  async setFormattingRules (type: 'create' | 'delete' | 'change', { path }: Uri) {

    // When rcfile changes we want to prevent repeated
    // runs after reading the contents
    if (this.watchChange) {
      this.watchChange = false;
      return;
    }

    try {

      // Determine which file was changed, we only watch
      // for changes to package.json and liquidrc file.
      const fileName = path.slice(path.lastIndexOf('/') + 1);
      const isPackage = fileName.startsWith('package');

      if (type === 'change') {

        if (isPackage) {

          // change was applied to package.json but we can skip
          // processing because user is using an rcfile
          if (this.configType !== ConfigType.PackageJSONField) return;

          const pkg = await this.getPkgJSON(path);

          if (pkg) {
            console.log(this.prettify);
            prettify.options(this.prettify);
            this.logOutput(EN.UPDATED_FORMAT_RULES);
          }

        } else {

          const { setting, rcfile } = await this.getLiquidrc();

          if (setting === EXTSettings.LiquidrcDefined) {

            prettify.options(this.prettify);

            const liquidrc = await prettify.format(rcfile, {
              ...this.prettify,
              language: 'json'
            });

            await writeFile(this.uri.liquidrc, liquidrc);

            prettify.options(this.prettify);

            this.watchChange = true;
            this.logOutput(EN.UPDATED_FORMAT_RULES);

          }
        }

      } else if (type === 'create') {

        if (isPackage === false) {

          if (this.configType === ConfigType.PackageJSONField) {
            this.logOutput(`settings in ${fileName} override prettify field in package.json`);
          }

          if (this.configType === ConfigType.EditorSettings) {
            this.logOutput(`settings in ${fileName} override the liquid.format workspace options`);
          }

          this.configType = ConfigType.RCFile;
          this.uri.liquidrc = path;
          this.logOutput(`${EN.SETTINGS_LIQUIDRC} ${this.uri.liquidrc}`);

        } else {

          const pkg = await this.getPkgJSON(path);

          if (pkg) {
            this.logOutput(EN.SETTINGS_PKG_PRETTIFY);
          }

        }

      } else if (type === 'delete') {

        if (isPackage) {

          if (this.configType !== ConfigType.RCFile) {
            if (this.uri.liquidrc !== null) {
              this.configType = ConfigType.RCFile;
              this.logOutput(`${EN.SETTINGS_LIQUIDRC} ${this.uri.liquidrc}`);
            }
          }

        } else {

          if (this.configType === ConfigType.RCFile) {

            const pkg = await this.getPkgJSON(path);

            if (pkg) {

              this.logOutput(EN.SETTINGS_PKG_PRETTIFY);

            } else {

              this.prettify = {};
              const settings = this.getSettings();

              if (settings === EXTSettings.WorkspaceUndefined) {

                const pkg = await this.getPkgJSON(path);

                if (pkg) {
                  this.logOutput(EN.SETTINGS_PKG_PRETTIFY);
                } else {
                  this.logOutput(EN.SETTINGS_MISSING);
                }

              } else if (settings === EXTSettings.WorkspaceDefined) {

                this.configType = ConfigType.EditorSettings;
                prettify.options(this.prettify);
                this.logOutput(EN.SETTINGS_WORKSPACE);
              }
            }
          }
        }
      }

    } catch (error) {

      this.hasError = true;
      this.logOutput('error', error.message);

    }

  }

  /**
   * Generates a `.liquidrc` file to root of the projects
   * directory.
   *
   * @returns
   * @memberof Config
   */
  async rcfileGenerate (config: 'recommended' | 'defaults') {

    if (this.configType === ConfigType.RCFile) {

      const answer = await window.showErrorMessage(EN.GENERATE_EXISTS, 'Reset', 'Open');

      if (answer === 'Open') {

        try {
          const document = await workspace.openTextDocument(this.uri.liquidrc);
          await window.showTextDocument(document, 1, false);
        } catch (error) {
          this.logOutput('error', error);
        }

      } else if (answer === 'Reset') {

        const rules = config === 'defaults'
          ? omitRules()
          : recommendedRules();

        try {

          await writeJSON(this.uri.liquidrc, rules, { spaces: rules.indentSize });
          const document = await workspace.openTextDocument(this.uri.liquidrc);

          await window.showTextDocument(document, 1, false);
          return window.showInformationMessage(EN.GENERATE_RESET);

        } catch (error) {
          console.error(error);
          this.logOutput('error', error);
        }
      }

    } else {

      const rules = config === 'defaults'
        ? omitRules()
        : recommendedRules();

      try {

        await writeJSON(this.uri.liquidrc, rules, { spaces: rules.indentSize });
        const document = await workspace.openTextDocument(this.uri.liquidrc);
        window.showTextDocument(document, 1, false);

        return window.showInformationMessage(EN.GENERATE_USING);

      } catch (error) {

        console.error(error);
        this.logOutput('error', EN.GENERATE_ERROR);
      }
    }
  }

}
