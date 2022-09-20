/* eslint-disable no-unused-vars */

import { workspace, window, Uri, FileSystemWatcher, env, ConfigurationTarget } from 'vscode';
import prettify from '@liquify/prettify';
import { readFile, writeFile, writeJSON } from 'fs-extra';
import { join } from 'node:path';
import { Editor } from './editor';
import { has, isNil } from 'rambdax';
import { EN } from './i18n';
import { EXTSettings, Config, Workspace, Liquidrc, Status, INLanguageIDs, WatchEvents } from './types';
import parseJSON from 'parse-json';
import {
  getSelectors,
  isBoolean,
  jsonc,
  omitRules,
  recommendedRules,
  hasDeprecatedSettings,
  isObject,
  mergePreferences,
  normalizeRules,
  isString,
  isArray,
  hasPackage,
  hasLiquidrc,
  isPath,
  getLanguagExtensionMap
} from './utilities';

// import anymatch from 'anymatch';

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
  private prettify: Liquidrc = {};
  private watchChange: boolean = false;

  /**
   * Get Settings
   *
   * Walks over the editor settings and determines
   * the configuration defined. Returns an enum that informs
   * upon activation state.
   */
  getSettings () {

    // Using deprecated settings
    if (hasDeprecatedSettings()) return EXTSettings.DeprecatedWorkspaceSettings;

    if (this.commandInvoked) {
      this.commandInvoked = false;
      return null;
    }

    const liquid = workspace.getConfiguration('liquid');
    const enable = liquid.get<boolean>('enable');
    const target = liquid.get<Workspace.Target>('settings.target');
    const validate = liquid.get<Workspace.Validate>('validate');
    const format = liquid.get<Workspace.Format>('format');

    // No configuration defined for the extension
    if (isNil(enable) && isNil(format)) return EXTSettings.WorkspaceUndefined;

    // Whether or not the extension is disabled
    this.isDisabled = enable === false;

    if (isObject(validate)) {
      if (has('json', validate) && isBoolean(validate.json)) {
        this.validate.json = validate.json;
      } else {
        this.validate.json = enable;
      }
    }

    if (isString(target)) {
      if (target === 'user') {
        this.target = ConfigurationTarget.Global;
      } else if (target === 'workspace' && this.target !== ConfigurationTarget.Workspace) {
        this.target = ConfigurationTarget.Workspace;
      }
    }

    if (isObject(format)) {

      let defined: boolean = this.config === Config.Workspace;
      let options: EXTSettings = EXTSettings.WorkspaceUndefined;

      // If first run, we will assert editor settings is being used
      if (isNaN(this.config)) {
        this.config = Config.Workspace;
        defined = true;
      }

      if (isArray(format.ignore)) {
        this.ignored = format.ignore;
        options = EXTSettings.WorkspaceDefined;
      }

      // lets determine if formatting is enabled or not
      if (has('enable', format) && isBoolean(format.enable)) {
        this.feature.format = format.enable;
      }

      // lets determine if formatting is enabled or not
      if (has('languages', format) && isArray(format.languages)) {
        this.languages = new Set(getLanguagExtensionMap(format.languages));
      }

      // if we are using editor settings lets apply prettify rules
      if (defined) this.prettify = mergePreferences(normalizeRules(format));

      return options;
    }

    return EXTSettings.WorkspaceUndefined;

  }

  /**
   * Get Package JSON
   *
   * Checks for the existence of a `package.json` files
   * and then looks for a _prettify_ property. When detected
   * the extension will use the rules provided to the property.
   */
  async getPkgJSON () {

    const path = hasPackage(this.rootPath);

    if (!path) return EXTSettings.PackageJsonUndefined;

    this.uri.package = path;

    try {

      const read = await readFile(this.uri.package);
      const pkg = parseJSON(read.toString());

      if (!has('prettify', pkg)) return EXTSettings.PrettifyFieldUndefined;

      if (!isObject(pkg.prettify)) {

        this.error('Invalid configuration type provided in .liquidrc', [
          'The "prettify" field expects an {} (object) type to be provided but instead recieved',
          `${typeof pkg.prettify} type which is invalid. You need to use the right configuration.`
        ]);

        return EXTSettings.PrettifyFieldInvalid;
      }

      if (has('ignore', pkg.prettify) && isArray(pkg.prettify.ignore)) {
        this.ignored = pkg.prettify.ignore;
      }

      // lets determine if formatting is enabled or not
      if (has('languages', pkg) && isArray(pkg.languages)) {
        this.languages = new Set(getLanguagExtensionMap(pkg.languages));
      }

      this.config = Config.Package;
      this.prettify = normalizeRules(pkg.prettify);

      if (this.feature.format === null) this.feature.format = true;
      if (this.isDisabled === null) this.isDisabled = false;

      return EXTSettings.PrettifyFieldDefined;

    } catch (e) {
      this.error('The package.json file could not be parsed', e);
    }

    return EXTSettings.PackageJsonError;

  }

  /**
   * Update Liquidrc File
   *
   * Updates the .liquidrc file. Returns a boolean indicating whether or not
   * the file was upates successfully,
   */
  async updateLiquidrc (rcfile: string) {

    const { language } = prettify.options.rules;
    const liquidrc = await prettify.format(rcfile, { language: 'json' }).catch((e) => {

      prettify.options({ language });

      this.error('unable to format the .liquidrc file', e);

    });

    if (liquidrc) {

      prettify.options({ language });

      try {
        await writeFile(this.uri.liquidrc, liquidrc);
      } catch (e) {
        this.error('unable to update the .liquidrc file', e);
        return false;
      }

      return true;

    }
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

    const path = hasLiquidrc(this.rootPath);

    if (!path) {
      return {
        rcfile: null,
        setting: EXTSettings.LiquidrcUndefined
      };
    }

    this.config = Config.Liquidrc;
    this.uri.liquidrc = path;

    try {

      const read = await readFile(this.uri.liquidrc);
      const rcfile = read.toString();
      const rules = jsonc(read.toString());

      if (!isObject(rules)) {

        this.error('Invalid configuration type provided in .liquidrc', [
          'The .liquirc file expects an {} (object) type to be provided but instead recieved',
          `${typeof rules} type which is invalid. You can generate a .liquidrc file via the command palette`
        ]);

        return {
          rcfile,
          setting: EXTSettings.LiquidrcInvalidRules
        };
      }

      if (hasDeprecatedSettings(rules)) {
        return {
          rcfile,
          setting: EXTSettings.DeprecatedLiquidrc
        };
      }

      if (has('ignore', rules) && isArray(rules.ignore)) {
        this.ignored = rules.ignore;
      }

      // lets determine if formatting is enabled or not
      if (has('languages', rules) && isArray(rules.languages)) {
        this.languages = new Set(getLanguagExtensionMap(rules.languages));
      }

      this.prettify = normalizeRules(rules);

      if (this.feature.format === null) this.feature.format = true;
      if (this.isDisabled === null) this.isDisabled = false;

      return {
        rcfile,
        setting: EXTSettings.LiquidrcDefined
      };

    } catch (e) {
      this.error('The .liquidrc configuration file could not be parsed', e);
    }

    return {
      setting: EXTSettings.LiquidrcError,
      rcfile: null
    };

  }

  /**
   * Watch Configuration Files
   *
   * Start watching the `.liquidrc` file and `package.json` for changes.
   * Passing a `false` parameter will dispose the watchers.
   */
  watchConfigFiles (startWatching = true) {

    if (startWatching === false) {

      for (const watcher of this.watcher) watcher.dispose();
      this.isWatching = false;

    } else {

      this.watcher.push(
        workspace.createFileSystemWatcher(join(this.rootPath, '.liquidr{c,c.json}')),
        workspace.createFileSystemWatcher(join(this.rootPath, 'package.json'))
      );

      for (const watcher of this.watcher) {
        watcher.onDidChange((uri) => this.setFormattingRules(WatchEvents.Change, uri));
        watcher.onDidDelete((uri) => this.setFormattingRules(WatchEvents.Delete, uri));
        watcher.onDidCreate((uri) => this.setFormattingRules(WatchEvents.Create, uri));
      }

      this.isWatching = true;
    }
  }

  async upgradeExtension () {

    const answer = await window.showErrorMessage(EN.UPDATE_SETTINGS, 'Release Notes');

    if (answer === 'Release Notes') {

      const liquid = workspace.getConfiguration('liquid');
      const config = liquid.inspect('format');

      if (config.globalValue === true) {
        this.doNotStart = true;
        return env.openExternal(Uri.parse('https://github.com/panoply/vscode-liquid/releases/tag/v3.0.0'));
      }

    }
  }

  /**
   * Set Workspace Defaults
   *
   * This function will update the workspace settings `[html]`
   * language identifiers `defaultFormatter` option. It's used
   * to automatically assert Prettify as the formatter.
   */
  async setWorkspaceDefaults (language: INLanguageIDs = '[html]') {

    const config = workspace.getConfiguration();

    if (this.feature.format) {

      /**
       * This letting will determine whether the workspace
       * settings can be updated or not
       */
      let update: boolean = true;

      const html = config.inspect(language);

      // FORMATTER DEFAULTS
      //
      const DEFAULT = 'editor.defaultFormatter';
      const EXTENSION = 'sissel.shopify-liquid';

      if (this.target === ConfigurationTarget.Global) {

        this.logOutput(EN.WARNING_USER_SETTINGS);

        if (isObject(html.globalValue)) {
          if (has(DEFAULT, html.globalValue)) {
            update = false;
            if (html.globalValue[DEFAULT] === EXTENSION) {
              this.logOutput(EN.DEFAULT_IS_PRETTIFY);
            } else {
              this.logOutput(EN.DEFAULT_NOT_PRETTIFY + html.globalValue[DEFAULT]);
            }
          }
        }
      } else {
        if (isObject(html.workspaceValue)) {
          if (has(DEFAULT, html.workspaceValue)) {
            update = false;
            if (html.workspaceValue[DEFAULT] === EXTENSION) {
              this.logOutput(EN.DEFAULT_IS_PRETTIFY);
            } else {
              this.logOutput(EN.DEFAULT_NOT_PRETTIFY + html.workspaceValue[DEFAULT]);
            }
          }
        }
      }

      if (update) {
        await config.update(language, { [DEFAULT]: EXTENSION }, this.target, true);
        this.logOutput(EN.DEFAULT_UPDATED);
      }
    }

    if (this.isReady) {
      if (this.feature.format) {
        this.statusBar(Status.Enabled);
      } else {
        this.statusBar(Status.Disabled);
      }
    }
  }

  /**
   * Get Config File
   *
   * This function is invoked at the runtime activation event.
   * It determines the workspaces configuration and sets up the
   * extension accordingly, assigning all default and requirements.
   */
  async getConfigFile () {

    const settings = this.getSettings();

    if (settings === EXTSettings.DeprecatedWorkspaceSettings) {
      this.isDisabled = true;
      return this.statusBar(Status.Upgrade);
    }

    try {

      await this.getPkgJSON();

      const liquidrc = await this.getLiquidrc();

      if (liquidrc.setting === EXTSettings.DeprecatedLiquidrc) {
        this.isDisabled = true;
        return this.statusBar(Status.Upgrade, true);
      }

      if (this.feature.format) {
        await this.setWorkspaceDefaults();
        prettify.options(this.prettify);
      }

      // setup formatting output to prints everytime the document is formatted
      prettify.format.after((_, { languageName }) => {
        if (!this.hasError) {
          this.logOutput(`${languageName} formatted in ${prettify.format.stats.time}ms`);
        }
      });

      this.watchConfigFiles();

      if (this.config === Config.Workspace) {
        this.logOutput(EN.SETTINGS_WORKSPACE);
      } else if (this.config === Config.Package) {
        this.logOutput(EN.SETTINGS_PKG_PRETTIFY);
      } else if (this.config === Config.Liquidrc) {
        this.logOutput(`${EN.SETTINGS_LIQUIDRC}${this.uri.liquidrc}`);
      }

      this.selector = getSelectors(!this.isDisabled);
      this.isReady = true;

    } catch (e) {
      console.error(e);
    }

  }

  setConfigSettings () {

    // CURRENT SETTINGS
    //
    const isDisabled = this.isDisabled;
    const canFormat = this.feature.format;
    const canValidate = this.validate.json;

    const settings = this.getSettings();

    if (this.isDisabled) {
      this.selector = getSelectors();
      this.logOutput(EN.DISABLED_EXTENSION);
    } else {
      if (this.isDisabled !== isDisabled) {
        this.logOutput(EN.ENABLED_EXTENSION);
      }
    }

    if (this.feature.format === false) {
      this.statusBar(Status.Disabled);
      this.logOutput(EN.DISABLED_FORMAT);
    } else {
      if (this.feature.format !== canFormat) {
        this.statusBar(Status.Enabled);
        this.logOutput(EN.ENABLED_FORMAT);
      }
    }

    if (this.feature.format && this.config === Config.Workspace) {
      prettify.options(this.prettify);
    }

    if (canValidate === true && this.validate.json === false) {
      this.logOutput(EN.DISABLED_SCHEMA_VALIDATE);
    } else if (this.validate.json === true && canValidate === false) {
      this.logOutput(EN.ENABLED_SCHEMA_VALIDATE);
    }

    return settings;

  }

  /**
   * Set Formatting Rules
   *
   * Defines where formatting rules are sourced.
   * Looks for rules defined in a `.liquirc` file and if
   * no file present will default to workspace settings configuration.
   */
  async setFormattingRules (type: WatchEvents, { path }: Uri) {

    // When rcfile changes we want to prevent repeated runs after reading the contents
    if (this.watchChange) {
      this.watchChange = false;
      return null;
    }

    const event = isPath(path, 'package');

    if (type === WatchEvents.Change) {

      if (event.match) {

        if (this.config === Config.Liquidrc) return;

        if (this.config === Config.Package) {

          const pkg = await this.getPkgJSON();

          if (pkg === EXTSettings.PrettifyFieldDefined) {

            prettify.options(this.prettify);

            this.logOutput('updated prettify beautification rules');

          } else if (pkg === EXTSettings.PrettifyFieldUndefined) {

            this.config = Config.Workspace;

            this.setConfigSettings();
            this.logOutput('using workspace settings');

          }

        } else {

          const pkg = await this.getPkgJSON();

          if (pkg === EXTSettings.PrettifyFieldDefined) {

            prettify.options(this.prettify);

            this.logOutput('using prettify field in package.json file');

          }
        }

      } else {

        const liquidrc = await this.getLiquidrc();

        if (liquidrc.setting === EXTSettings.LiquidrcDefined) {

          const update = await this.updateLiquidrc(liquidrc.rcfile);

          if (update) {
            this.logOutput('updated prettify beautification rules');
            this.watchChange = true;
          }
        }

      }
    } else if (type === WatchEvents.Create) {

      if (event.match) {

        if (this.config === Config.Workspace) return;

        const pkg = await this.getPkgJSON();

        if (pkg === EXTSettings.PrettifyFieldDefined) {

          this.config = Config.Package;

          prettify.options(this.prettify);

          this.logOutput('using prettify field in package.json file');

        }

      } else {

        if (this.config === Config.Package) {
          this.logOutput(`${event.fileName} settings override the "prettify" field in package.json files`);
        }
        if (this.config === Config.Workspace) {
          this.logOutput(`${event.fileName} settings override "liquid.format.*" configurations in the workspace`);
        }

        this.logOutput(`using .liquidrc file: ${path}`);

        const liquidrc = await this.getLiquidrc();

        if (liquidrc.setting === EXTSettings.LiquidrcDefined) {

          const update = await this.updateLiquidrc(liquidrc.rcfile);

          if (update) {
            this.statusBar(Status.Enabled);
            this.watchChange = true;
          }
        }
      }

    } else if (type === WatchEvents.Delete) {

      if (event.match) {

        this.config = Config.Workspace;
        this.setConfigSettings();
        this.logOutput('using workspace settings');

      } else {

        const pkg = await this.getPkgJSON();

        if (pkg === EXTSettings.PrettifyFieldDefined) {

          this.config = Config.Package;

          prettify.options(this.prettify);

          this.logOutput('using prettify field in package.json file');

        } else {

          this.config = Config.Workspace;

          this.setConfigSettings();

          this.logOutput('using workspace settings');

        }

      }
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

    if (this.config === Config.Liquidrc) {

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
          ? omitRules() as any
          : recommendedRules();

        try {

          await writeJSON(this.uri.liquidrc, rules, { spaces: rules.indentSize });
          const document = await workspace.openTextDocument(this.uri.liquidrc);

          await window.showTextDocument(document, 1, false);
          return window.showInformationMessage(EN.GENERATE_RESET);

        } catch (e) {
          this.error('failed to generated .liquidrc file', e);
        }
      }

    } else {

      const rules = config === 'defaults'
        ? omitRules() as any
        : recommendedRules();

      try {

        await writeJSON(this.uri.liquidrc, rules, { spaces: rules.indentSize });
        const document = await workspace.openTextDocument(this.uri.liquidrc);
        window.showTextDocument(document, 1, false);

        return window.showInformationMessage(EN.GENERATE_USING);

      } catch (e) {

        this.error(EN.GENERATE_ERROR, e);
      }
    }
  }

}
