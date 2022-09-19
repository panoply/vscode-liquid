/* eslint-disable no-unused-vars */
import { workspace, window, Uri, FileSystemWatcher, env, ConfigurationTarget } from 'vscode';
import prettify from '@liquify/prettify';
import { readFile, readJSON, writeFile, writeJSON } from 'fs-extra';
import { join } from 'node:path';
import { Editor } from './editor';
import { has, isNil } from 'rambdax';
import { EN } from './i18n';
import { EXTSettings, Config, Workspace, Liquidrc, Status, INLanguageIDs, WatchEvents } from './types';
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
  isPath
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

  hasConfigOption (selector: string, inspect?: any) {

    if (selector.charCodeAt(0) !== 91) return workspace.getConfiguration().has(selector);

    const language = workspace.getConfiguration().inspect(selector);

    if (this.target === ConfigurationTarget.Workspace) {
      return (
        typeof language.workspaceValue === 'object' &&
        has(inspect, language.workspaceValue)
      );
    } else if (this.target === ConfigurationTarget.Global) {
      return (typeof language.globalValue === 'object' && has(inspect, language.globalValue));

    }
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
    if (hasDeprecatedSettings()) {
      return EXTSettings.DeprecatedWorkspaceSettings;
    }

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
   * the extension will use the rules defined there.
   */
  async getPkgJSON () {

    const path = hasPackage(this.rootPath);
    if (!path) return EXTSettings.PackageJsonUndefined;

    this.uri.package = path;

    try {

      const pkg: { prettify: Liquidrc } = await readJSON(this.uri.package, { throws: true });

      if (has('prettify', pkg)) {

        if (isObject(pkg.prettify)) {

          if (has('ignore', pkg.prettify) && isArray(pkg.prettify.ignore)) {
            this.ignored = pkg.prettify.ignore;
          }

          this.config = Config.Package;
          this.prettify = normalizeRules(pkg.prettify);

          if (this.feature.format === null) this.feature.format = true;
          if (this.isDisabled === null) this.isDisabled = false;

          return EXTSettings.PrettifyFieldDefined;

        }

        return EXTSettings.PrettifyFieldInvalid;

      }

      return EXTSettings.PrettifyFieldUndefined;

    } catch (e) {
      console.error(e);
      this.logOutput('error', EN.INVALID_PKG_PARSE);
    }

    return EXTSettings.PackageJsonError;

  }

  async updateLiquidrc (rcfile: string) {

    try {

      const { language } = prettify.options.rules;
      const liquidrc = await prettify.format(rcfile, { language: 'json' });

      await writeFile(this.uri.liquidrc, liquidrc);

      prettify.options({ language });

      this.logOutput(EN.UPDATED_FORMAT_RULES);

    } catch (e) {
      console.error(e);
      this.logOutput('error', e);
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

      if (isObject(rules)) {

        if (hasDeprecatedSettings(rules)) {
          return {
            rcfile,
            setting: EXTSettings.DeprecatedLiquidrc
          };
        }

        if (has('ignore', rules) && isArray(rules.ignore)) {
          this.ignored = rules.ignore;
        }

        this.prettify = normalizeRules(rules);

        if (this.feature.format === null) this.feature.format = true;
        if (this.isDisabled === null) this.isDisabled = false;

        return {
          rcfile,
          setting: EXTSettings.LiquidrcDefined
        };

      }

      this.logOutput('error', EN.INVALID_LIQUIDRC_TYPE);

      return {
        rcfile,
        setting: EXTSettings.LiquidrcInvalidRules
      };

    } catch (e) {
      console.error(e);
      this.logOutput('error', EN.INVALID_LIQUIDRC_PARSE);
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

        await config.update(language, {
          [DEFAULT]: EXTENSION
        }, this.target, true);

        this.logOutput(EN.DEFAULT_UPDATED);
      }
    }

    if (this.feature.format) {
      this.statusBar(Status.Enabled);
    } else {
      this.statusBar(Status.Disabled);
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

      console.log(liquidrc);

      if (liquidrc.setting === EXTSettings.DeprecatedLiquidrc) {
        this.isDisabled = true;
        return this.statusBar(Status.Upgrade, true);
      }

      if (this.feature.format) {
        await this.setWorkspaceDefaults();
        this.statusBar(Status.Enabled);
        prettify.options(this.prettify);
      } else {
        this.statusBar(Status.Disabled);
      }

      // setup formatting output to prints everytime the document is formatted
      prettify.format.after((_, { languageName }) => {
        this.logOutput(`${languageName} formatted in ${prettify.format.stats.time}ms`);
      });

      this.watchConfigFiles();

      if (this.config === Config.Workspace) {
        this.logOutput(EN.SETTINGS_WORKSPACE);
      } else if (this.config === Config.Package) {
        this.logOutput(EN.SETTINGS_PKG_PRETTIFY);
      } else if (this.config === Config.Liquidrc) {
        this.logOutput(`${EN.SETTINGS_LIQUIDRC} ${this.uri.liquidrc}`);
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

    // When rcfile changes we want to prevent repeated
    // runs after reading the contents
    if (this.watchChange) {
      this.watchChange = false;
      return;
    }

    const event = isPath(path, 'package');

    if (type === WatchEvents.Change) {

      if (event.match) {

        // Change was applied to package.json but we can skip
        // processing because user is using an rcfile or workspace
        if (this.config === Config.Liquidrc) return;

        const pkg = await this.getPkgJSON();

        if (this.config === Config.Package) {

          if (pkg === EXTSettings.PrettifyFieldDefined) {

            prettify.options(this.prettify);
            this.logOutput(EN.UPDATED_FORMAT_RULES);

          } else if (pkg === EXTSettings.PrettifyFieldUndefined) {

            this.config = Config.Workspace;
            this.setConfigSettings();
            this.logOutput(EN.SETTINGS_WORKSPACE);

          } else if (pkg === EXTSettings.PrettifyFieldInvalid) {

            this.logOutput(EN.INVALID_SETTINGS + event.fileName);
            this.statusBar(Status.Error);

          } else if (pkg === EXTSettings.PackageJsonError) {

            this.statusBar(Status.Error);

          }

        } else {

          if (pkg === EXTSettings.PrettifyFieldDefined) {

            prettify.options(this.prettify);

            this.logOutput(EN.SETTINGS_PKG_PRETTIFY);
            this.logOutput(EN.UPDATED_FORMAT_RULES);

          } else if (pkg === EXTSettings.PrettifyFieldInvalid) {

            this.logOutput(EN.SETTINGS_PKG_PRETTIFY);
            this.logOutput(EN.INVALID_SETTINGS + event.fileName);
            this.statusBar(Status.Error);

          }
        }

      } else {

        const liquidrc = await this.getLiquidrc();

        if (liquidrc.setting === EXTSettings.LiquidrcDefined) {

          await this.updateLiquidrc(liquidrc.rcfile);

          this.statusBar(Status.Enabled);
          this.watchChange = true;

        } else if (liquidrc.setting === EXTSettings.LiquidrcInvalidRules) {

          this.logOutput(EN.INVALID_SETTINGS + event.fileName);
          this.statusBar(Status.Error);

        } else if (liquidrc.setting === EXTSettings.LiquidrcError) {

          this.statusBar(Status.Error);

        }
      }
    } else if (type === WatchEvents.Create) {

      if (event.match) {

        if (this.config !== Config.Liquidrc) return;

        const pkg = await this.getPkgJSON();

        if (pkg === EXTSettings.PrettifyFieldDefined) {

          prettify.options(this.prettify);

          this.logOutput(EN.SETTINGS_PKG_PRETTIFY);
          this.logOutput(EN.UPDATED_FORMAT_RULES);

        } else if (pkg === EXTSettings.PrettifyFieldInvalid) {

          this.logOutput(EN.SETTINGS_PKG_PRETTIFY);
          this.logOutput(EN.INVALID_SETTINGS + event.fileName);
          this.statusBar(Status.Error);

        }

      } else {

        if (this.config === Config.Package) {
          this.logOutput(event.fileName + EN.OVERRIDE_PRETTIFY);
        }
        if (this.config === Config.Workspace) {
          this.logOutput(event.fileName + EN.OVERRIDE_WORKSPACE);
        }

        this.logOutput(EN.SETTINGS_LIQUIDRC + this.uri.liquidrc);

        const liquidrc = await this.getLiquidrc();

        if (liquidrc.setting === EXTSettings.LiquidrcDefined) {

          await this.updateLiquidrc(liquidrc.rcfile);

          this.statusBar(Status.Enabled);
          this.watchChange = true;

        } else if (liquidrc.setting === EXTSettings.LiquidrcInvalidRules) {

          this.logOutput(EN.INVALID_SETTINGS + event.fileName);
          this.statusBar(Status.Error);

        } else if (liquidrc.setting === EXTSettings.LiquidrcError) {

          this.statusBar(Status.Error);

        }
      }

    } else if (type === WatchEvents.Delete) {

      if (event.match) {

        const liquidrc = await this.getLiquidrc();

        if (liquidrc.setting === EXTSettings.LiquidrcUndefined) {

          this.config = Config.Workspace;
          this.setConfigSettings();

        } else if (liquidrc.setting === EXTSettings.LiquidrcDefined) {

          await this.updateLiquidrc(liquidrc.rcfile);

          this.statusBar(Status.Enabled);
          this.watchChange = true;

        } else if (liquidrc.setting === EXTSettings.LiquidrcInvalidRules) {

          this.logOutput(EN.INVALID_SETTINGS + event.fileName);
          this.statusBar(Status.Error);

        } else if (liquidrc.setting === EXTSettings.LiquidrcError) {

          this.statusBar(Status.Error);

        }

      } else {

        const pkg = await this.getPkgJSON();

        if (pkg === EXTSettings.PrettifyFieldDefined) {

          prettify.options(this.prettify);

          this.logOutput(EN.SETTINGS_PKG_PRETTIFY);
          this.logOutput(EN.UPDATED_FORMAT_RULES);

        } else if (pkg === EXTSettings.PrettifyFieldInvalid) {

          this.logOutput(EN.SETTINGS_PKG_PRETTIFY);
          this.logOutput(EN.INVALID_SETTINGS + event.fileName);
          this.statusBar(Status.Error);

        } else {

          this.config = Config.Workspace;
          this.setConfigSettings();
          this.logOutput(EN.SETTINGS_WORKSPACE);

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
