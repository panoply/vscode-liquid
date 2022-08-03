import { workspace, window } from 'vscode';
import prettify, { Options } from '@liquify/prettify';
import path from 'path';
import fs from 'fs';
import Utils from './utils';

/**
 * Applies custom configuration settings used
 * by the extension.
 *
 * @class Config
 * @extends Utils
 */

export default class Config extends Utils {

  liquid = workspace.getConfiguration('liquid');
  config: Options;
  format: boolean = false;
  watch: boolean = false;
  error: boolean = false;
  reset: boolean = false;
  rcfile: string;

  constructor () {

    super();

    // Configuration
    this.config = {};

    // Applied Configuration
    this.liquid = workspace.getConfiguration('liquid');
    this.format = this.liquid.get('format') as boolean;

    if (workspace.workspaceFolders !== undefined) {
      this.rcfile = path.join(workspace.workspaceFolders[0].uri.fsPath, '.liquidrc');
    }
    // Conditional Executors
    this.watch = false;
    this.error = false;
    this.reset = false;

  }

  /**
   * Defines where formatting rules are sourced.
   * Looks for rules defined in a `.liquirc` file and if
   * no file present will default to workspace settings configuration.
   */
  setFormattingRules () {

    // Look for `liquidrc` file
    if (!fs.existsSync(this.rcfile)) {

      // Get latest config option of Liquid
      const liquid = workspace.getConfiguration('liquid');
      const config = liquid.get('rules');

      // Assign custom configuration to options
      prettify.options(config);

      this.config = prettify.options?.rules;

    } else {

      try {

        // Read .liquidrc file
        const file = fs.readFileSync(this.rcfile, 'utf8');
        const json = JSON.parse(file);

        prettify.options(json.prettify);

        this.outputLog({ title: 'Prettify', message: 'Updated Formatting Rules' });

        // Reset Error Condition
        this.error = false;

      } catch (error) {

        this.outputLog({
          title: 'Error reading formatting rules',
          file: this.rcfile,
          message: error.message,
          show: true
        });

      } finally {

        this.rcfileWatcher();

      }

    }

  }

  /**
   * Watches `.liquidrc` file for changes
   *
   * @memberof Config
   */
  rcfileWatcher () {

    if (!this.watch) {

      const watch = workspace.createFileSystemWatcher(this.rcfile, true, false, false);

      watch.onDidDelete(() => this.setFormattingRules());
      watch.onDidChange(() => {
        this.reset = true;
        this.setFormattingRules();
      });

      this.watch = true;

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

    if (fs.existsSync(this.rcfile)) {

      const answer = await window.showErrorMessage('.liquidrc file already exists!', 'Open');

      if (answer === 'Open') {
        workspace.openTextDocument(this.rcfile).then((document) => {
          window.showTextDocument(document, 1, false);
        }, (error) => {
          return console.error(error);
        });
      }

    }

    const liquid = workspace.getConfiguration('liquid');
    const rules = JSON.stringify(liquid.rules, null, 2);

    fs.writeFile(this.rcfile, rules, (error) => {

      if (error) {

        return this.outputLog({
          title: 'Error generating rules',
          file: this.rcfile,
          message: error.message,
          show: true
        });

      }

      workspace.openTextDocument(this.rcfile).then((document) => {

        window.showTextDocument(document, 1, false);

      }, (error) => {

        return console.error(error);

      }).then(() => {

        this.rcfileWatcher();

        return window.showInformationMessage('You are now using a .liquidrc file to define formatting rules 👍');

      });

    });

  }

}
