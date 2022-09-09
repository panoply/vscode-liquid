import { workspace, window } from 'vscode';
import prettify, { Options } from '@liquify/prettify';
import { join } from 'node:path';
import { pathExists, readJSON, writeJSON } from 'fs-extra';
import { UI } from './editor';
import { omitRules } from './utils';
import { has } from 'rambda';
import { ConfigType } from './model';
import anymatch from 'anymatch';

/**
 * Applies custom configuration settings used
 * by the extension.
 *
 * @class Config
 * @extends Utils
 */

export class Config extends UI {

  async getConfigFile () {

    // Lets look for a liquirc file
    for (const fileName of [
      '.liquidrc',
      '.liquid',
      '.liquidrc.json'
    ]) {

      const path = join(this.rootPath, fileName);
      const exists = await pathExists(path);

      if (exists) {
        this.configType = ConfigType.rcfile;
        this.rcfile = path;
        break;
      }
    }

    // if no liquidrc file found, lets check package.json
    if (this.configType === ConfigType.pkgjson) {

      const path = join(this.rootPath, 'package.json');
      const exists = await pathExists(path);

      if (exists) {

        try {

          const read = await readJSON(path, { throws: true });

          if (has('liquify', read)) {
            this.configType = ConfigType.pkgjson;
          }

        } catch (error) {

          console.error(error);

        }

      }

    }

  }

  /**
   * Defines where formatting rules are sourced.
   * Looks for rules defined in a `.liquirc` file and if
   * no file present will default to workspace settings configuration.
   */
  async setFormattingRules () {

    // Look for `liquidrc` file
    if (this.configType === ConfigType.workspace) {

      const exclude = this.settings.get<string[]>('format.ignore');

      if (Array.isArray(exclude)) {
        const files = exclude.map((path: string) => join(this.rootPath, path));
        this.exclude = anymatch(files);
      }

      const config = this.settings.get<Options>('format.rules');

      // Assign custom configuration to options
      prettify.options(config);

    } else {

      try {

        // Read .liquidrc file
        const file = await readJSON(this.rcfile, { throws: true });

        if (has('exclude', file) && Array.isArray(file.exclude)) {
          const exclude = file.exclude.map((path: string) => join(this.rootPath, path));
          this.exclude = anymatch(exclude);
        }

        prettify.options(file.prettify);

        this.outputLog({ title: 'Prettify', message: 'Updated Prettify Rules' });

        console.log(this);

        // Reset Error Condition
        this.hasError = false;

      } catch (error) {

        this.outputLog({
          title: 'Error reading formatting rules',
          file: this.rcfile,
          message: error.message,
          show: true
        });

      } finally {

        this.rcfileWatch();

      }

    }

  }

  /**
   * Watches `.liquidrc` file for changes
   *
   * @memberof Config
   */
  rcfileWatch () {

    if (!this.rcwatch) {

      const watch = workspace.createFileSystemWatcher(this.rcfile, true, false, false);

      watch.onDidDelete(() => this.setFormattingRules());
      watch.onDidChange(() => this.setFormattingRules());

      this.rcwatch = true;

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

    const exists = await pathExists(this.rcfile);

    if (exists) {

      const current = await readJSON(this.rcfile);

      if (has('html', current)) {

        const answer = await window.showErrorMessage('.liquidrc using deprecated configuration', 'Update');

        if (answer === 'Update') {

          try {

            const document = await workspace.openTextDocument(this.rcfile);

            window.showTextDocument(document, 1, false);

          } catch (error) {

            console.error(error);

          }
        }

      } else {

        const answer = await window.showErrorMessage('.liquidrc file already exists!', 'Open', 'Reset');

        if (answer === 'Open') {

          try {

            const document = await workspace.openTextDocument(this.rcfile);

            window.showTextDocument(document, 1, false);

          } catch (error) {

            console.error(error);

          }
        } else if (answer === 'Reset') {
          try {

            const document = await workspace.openTextDocument(this.rcfile);

            window.showTextDocument(document, 1, false);

          } catch (error) {

            console.error(error);

          }
        }
      }

    } else {

      const rules = omitRules();

      try {

        await writeJSON(this.rcfile, rules, { spaces: rules.indentSize });

        const document = await workspace.openTextDocument(this.rcfile);

        window.showTextDocument(document, 1, false);

        this.rcfileWatch();

        return window.showInformationMessage('You are now using a .liquidrc file to define formatting rules 👍');

      } catch (error) {

        return this.outputLog({
          title: 'Error generating rules',
          file: this.rcfile,
          message: error.message,
          show: true
        });
      }
    }
  }

}
