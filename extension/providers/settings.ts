import { workspace, window, Uri, FileSystemWatcher } from 'vscode';
import prettify from '@liquify/prettify';
import { join } from 'node:path';
import { pathExists, readJSON, writeJSON } from 'fs-extra';
import { Editor } from './editor';
import { ConfigType } from './state';
import { getSelectors, omitRules, Status } from './utilities';
import { has, omit } from 'rambda';

// import anymatch from 'anymatch';

/**
 * Accepted Liquidrc JSON file names
 */
const LIQUIDRC_JSON = [
  '.liquid',
  '.liquid.json',
  '.liquidrc',
  '.liquidrc.json'
];

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
  private prettify: {};

  /**
   * Get Settings
   *
   * Walks over the editor settings and determines
   * the runtime configuration defined.
   */
  getSettings () {

    if (this.commandInvoked) {
      this.commandInvoked = false;
      return;
    }

    let hasConfig: number = 0;

    const enable = this.liquidSettings.inspect<boolean>('enable');
    const format = this.liquidSettings.inspect<any>('format');
    const exclude = omit([ 'ignore', 'enable' ]);

    if (
      enable.globalValue === undefined &&
      enable.workspaceValue === undefined &&
      format.globalValue === undefined &&
      format.workspaceValue === undefined
    ) {

      return hasConfig;

    }

    if (enable.globalValue === true && enable.workspaceValue === false) {
      this.isDisabled = true;
    } else if (enable.globalValue === false && enable.workspaceValue === true) {
      this.isDisabled = false;
    } else if (enable.globalValue === false && enable.workspaceValue === false) {
      this.isDisabled = true;
    } else if (enable.globalValue === true && enable.workspaceValue === true) {
      this.isDisabled = false;
    } else if (enable.globalValue === undefined && enable.workspaceValue === false) {
      this.isDisabled = true;
    } else if (enable.globalValue === true && enable.workspaceValue === undefined) {
      this.isDisabled = false;
    } else if (enable.globalValue === undefined && enable.workspaceValue === true) {
      this.isDisabled = false;
    } else if (enable.globalValue === false && enable.workspaceValue === undefined) {
      this.isDisabled = true;
    }

    if (typeof format.globalValue === 'object') {

      if (isNaN(this.configType) || this.configType > 2) {
        this.configType = ConfigType.GlobalSettings;
      }

      if (Array.isArray(format.globalValue.ignore)) {
        this.ignored = format.globalValue.ignore;
        this.prettify = exclude(format.globalValue);
      }

      if (has('enable', format.globalValue) && typeof format.globalValue.enable === 'boolean') {
        this.capability.formatting = format.globalValue.enable;
        this.prettify = exclude(format.globalValue);
        hasConfig = 1;
      }
    }

    if (typeof format.workspaceValue === 'object') {

      if (isNaN(this.configType) || this.configType > 2) {
        this.configType = ConfigType.GlobalSettings;
      }

      if (Array.isArray(format.workspaceValue.ignore)) {
        this.ignored = format.workspaceValue.ignore;
        this.prettify = exclude(format.workspaceValue);
      }

      if (has('enable', format.workspaceValue) && typeof format.workspaceValue.enable === 'boolean') {
        this.capability.formatting = format.workspaceValue.enable;
        this.prettify = exclude(format.workspaceValue);
        hasConfig = 2;
      }
    }

    return hasConfig;

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

      const pkg = await readJSON(uri, { throws: true });

      if (has('liquid', pkg) && typeof pkg.prettify === 'object') {

        if (has('ignore', pkg.prettify) && Array.isArray(pkg.prettify.ignore)) {
          this.ignored = pkg.prettify.ignore;
        }

        this.prettify = omit('ignore', pkg.prettify);

        // when the prettify config field exists and formatting capability is still null
        // then we will enable it because it is assumed with existence of this field.
        if (this.capability.formatting === null) this.capability.formatting = true;

        // when the prettify config field exists and isDisabled is still null
        // then we will enable it because it is assumed with existence of this field.
        if (this.isDisabled === null) this.isDisabled = false;

        return true;

      }

    } catch (error) {

      console.log(error);
      this.logOutput('error', 'failed to parse the package.json file');

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
   *
   * - `0` _no liquidrc file in project_
   * - `1` _ignore file field exists only_
   * - `2` _prettify field exists only_
   * - `3` _ignore and prettify fields exist_
   */
  async getLiquidrc () {

    let hasUpdated: number = 0;

    for (const fileName of LIQUIDRC_JSON) {

      const path = join(this.rootPath, fileName);
      const exists = await pathExists(path);

      if (!exists) continue;

      this.configType = ConfigType.RCFile;
      this.uri.liquidrc = path;

      try {

        const rcfile = await readJSON(this.uri.liquidrc, { throws: true });

        if (typeof rcfile === 'object') {

          if (has('ignore', rcfile) && Array.isArray(rcfile.ignore)) {
            this.ignored = rcfile.ignore;
            hasUpdated = 1;
          }

          if (has('liquid', rcfile)) {
            this.prettify = rcfile.prettify;
            hasUpdated = hasUpdated === 1 ? 3 : 2;
          }

          // when liquidrc file exists and formatting capability is still null
          // then we will enable it because it is assumed with existence
          // of the liquidrc file being present.
          if (this.capability.formatting === null) this.capability.formatting = true;

          // when liquidrc file exists and isDisabled is still null
          // then we will ensure to enable it because it is assumed with existence
          // of the liquidrc file being present.
          if (this.isDisabled === null) this.isDisabled = false;

          return hasUpdated;
        }

      } catch (error) {

        console.error(error);
        this.logOutput('error', 'Failed to parse liquidrc file: ' + error.message);

      }

      return hasUpdated;

    }
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
        watcher.onDidDelete((uri) => this.setFormattingRules('delete', uri));
        watcher.onDidChange((uri) => this.setFormattingRules('change', uri));
        watcher.onDidCreate((uri) => this.setFormattingRules('create', uri));
      }

      this.isWatching = true;
    }
  }

  async getConfigFile () {

    try {

      await Promise.all([
        this.getSettings(),
        this.getPkgJSON(),
        this.getLiquidrc(),
        this.watchConfigFiles()
      ]);

      prettify.format.after((_, { language }) => {
        this.logOutput('liquid', `${language} formatted in ${prettify.format.stats.time}ms`);
      });

      if (this.configType === ConfigType.GlobalSettings) {
        this.logOutput('liquid', 'using user settings');
      } else if (this.configType === ConfigType.WorkspaceSettings) {
        this.logOutput('liquid', 'using workspace settings');
      } else if (this.configType === ConfigType.PackageJSONField) {
        this.logOutput('liquid', 'using package.json prettify field');
      } else if (this.configType < 3) {
        this.logOutput('liquid', 'using config ' + this.uri.liquidrc);
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

    this.getSettings();

    if (this.isDisabled) {
      this.logOutput('liquid', 'extension has been disabled');
    } else {
      this.logOutput('liquid', 'extension has been enabled');
    }

    if (this.configType > 2) prettify.options(this.prettify);

  }

  /**
   * Defines where formatting rules are sourced.
   * Looks for rules defined in a `.liquirc` file and if
   * no file present will default to workspace settings configuration.
   */
  async setFormattingRules (type: 'create' | 'delete' | 'change', { path }: Uri) {

    try {

      const fileName = path.slice(path.lastIndexOf('/') + 1);
      const isPackage = fileName.startsWith('package');

      if (type === 'change') {

        if (isPackage) {

          if (this.configType === ConfigType.PackageJSONField) {
            this.logOutput('liquid', 'change detected in package.json but using rcfile');
            return;
          }

          if (this.getPkgJSON(path)) this.logOutput('liquid', 'updated prettify beautification rules');

        } else {

          const liquidrc = await this.getLiquidrc();

          if (liquidrc > 0) {
            prettify.options(this.prettify);
            this.logOutput('liquid', 'updated prettify beautification rules');
          }

        }

      } else if (type === 'create') {

        if (fileName.endsWith('.json')) {

          if (isPackage === false) {

            if (this.configType === ConfigType.PackageJSONField) {
              this.logOutput('warning', `configuration in ${fileName} will override prettify package.json field`);
            }

            this.logOutput('liquid', 'using config ' + path);
            this.configType = ConfigType.RCFile;

            if (this.uri.liquidrc === null) this.uri.liquidrc = path;

          } else {
            const pkg = await this.getPkgJSON(path);
            if (pkg) this.logOutput('liquid', 'using package.json prettify field');
          }
        }

      } else if (type === 'delete') {

        if (isPackage) {
          if (this.configType !== ConfigType.RCFile) {
            if (this.uri.liquidrc !== null) {
              this.logOutput('liquid', 'using config ' + path);
              this.configType = ConfigType.RCFile;
            }
          }
        } else {
          if (this.configType === ConfigType.RCFile) {
            const pkg = await this.getPkgJSON(path);
            if (pkg) {
              this.logOutput('liquid', 'using package.json prettify field');
            } else {
              const settings = this.getSettings();
              if (settings === 0) {
                this.logOutput('warning', 'no configuration defined, add a liquidrc file to the workspace');
              } else if (settings === 1) {
                this.logOutput('liquid', 'using user settings');
                this.configType = ConfigType.GlobalSettings;
              } else if (settings === 2) {
                this.logOutput('liquid', 'using workspace settings');
                this.configType = ConfigType.WorkspaceSettings;
              }
            }
          }

        }

      }

    } catch (error) {

      this.hasError = true;
      this.logOutput('error', error.message);

    }
    try {

      // Read .liquidrc file
      const file = await readJSON(this.uri.liquidrc, { throws: true });

      if (has('ignore', file) && Array.isArray(file.ignore)) {
        // this.exclude = anymatch(file.ignore);
      }

      prettify.options(file.prettify);

      // Reset Error Condition
      this.hasError = false;

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
  async rcfileGenerate () {

    if (this.configType < 3) {

      const current = await readJSON(this.uri.liquidrc);

      if (has('html', current)) {

        const answer = await window.showErrorMessage('.liquidrc using deprecated configuration', 'Update');

        if (answer.toUpperCase() === 'UPDATE') {

          this.statusBar(Status.Loading, true);

          try {

            const rcfile = await workspace.openTextDocument(this.uri.liquidrc);

            await window.showTextDocument(rcfile, 1, false);

          } catch (error) {
            console.error(error);
            this.logOutput('error', error);

          }
        }

      } else {

        const answer = await window.showErrorMessage('.liquidrc file already exists!', 'Open', 'Reset');

        if (answer.toUpperCase() === 'OPEN') {

          try {

            const document = await workspace.openTextDocument(this.uri.liquidrc);

            await window.showTextDocument(document, 1, false);

          } catch (error) {

            this.logOutput('error', error);

          }
        } else if (answer.toUpperCase() === 'RESET') {

          try {

            const document = await workspace.openTextDocument(this.uri.liquidrc);

            window.showTextDocument(document, 1, false);

          } catch (error) {

            console.error(error);
            this.logOutput('error', error);
          }
        }
      }

    } else {

      const rules = omitRules();

      try {

        await writeJSON(this.uri.liquidrc, rules, { spaces: rules.indentSize });

        const document = await workspace.openTextDocument(this.uri.liquidrc);

        window.showTextDocument(document, 1, false);

        return window.showInformationMessage('You are now using a .liquidrc file 👍');

      } catch (error) {

        console.error(error);
        this.logOutput('error', 'An error occured generating the rcfile');
      }
    }
  }

}
