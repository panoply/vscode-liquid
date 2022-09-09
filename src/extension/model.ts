/* eslint-disable no-unused-vars */
/* eslint-disable quote-props */

import prettify, { Options } from '@liquify/prettify';
import { window, Disposable, DocumentSelector, workspace } from 'vscode';
import { Tester } from 'anymatch';

export const enum ConfigType {
  rcfile = 1,
  pkgjson,
  workspace
}

interface IModel {
  /**
   * The features enabled/disabled
   */
  feature: {
    /**
     * Whether formatting is enabled
     *
     * @default true
     */
    format: boolean;
  };

  /**
   * The languages which allow Prettify to apply formatting
   */
  format: {
    /**
     * Whether `.html` files should be formatted by Prettify
     *
     * @default false
     */
    'html': boolean;
    /**
     * Whether `json` files should be formatted by Prettify
     *
     * @default false
     */
    'json': boolean;
    /**
     * Whether `css` files should be formatted by Prettify
     *
     * @default false
     */
    'css': boolean;
    /**
     * Whether `.liquid` files should be formatted by Prettify
     *
     * @default true
     */
    'liquid': boolean;
    /**
     * Whether `.js.liquid` files should be formatted by Prettify
     *
     * @default true
     */
    'liquid-javascript': boolean;
    /**
     * Whether `.css.liquid` files should be formatted by Prettify
     *
     * @default true
     */
    'liquid-css': boolean;
    /**
     * Whether `.scss.liquid` files should be formatted by Prettify
     *
     * @default true
     */
    'liquid-scss': boolean;
    /**
     * Whether `.js.liquid` files should be formatted by Prettify
     *
     * @default true
     */
    'liquid-json': boolean;
  };
  /**
   * Returns the active documents Language ID
   */
  get languageId (): string
  /**
   * Returns the active documents filename
   */
  get fileName (): string
  /**
   * Whether or not the active document has formatting support
   */
  get formatSupport (): boolean
  /**
   * Sets the active document language id formatting support
   */
  set formatSupport(condition)
  /**
   * Document Handlers
   */
  documents: { [fileName: string]: Disposable };
  /*
   * Paths to exclude from formatting
   */
  exclude: Tester
  /**
   * Whether or not we have encoutered an error
   *
   * @default false
   */
  hasError: boolean;
  /**
   * Liquid workspace settings
   */
  settings: any;
  /**
   * Whether or not the extension should be reset
   *
   * @default false
   */
  reset: boolean;
  /**
   * The rcfile URI location
   */
  rootPath: string;
  /**
   * Whether or not the rcfile is being watched
   *
   * @default false;
   */
  rcwatch: boolean;
  /**
   * The rcfile URI location
   */
  rcfile: string;
  /**
   * The configuration file type being used
   *
   * - `1` Using an `rcfile`
   * - `2` Defining config in `package.json`
   * - `3` Using workspace/user settings,.
   */
  configType: ConfigType;
  /**
   * Prettify beautification rules
   */
  prettify: Options;
  /**
   * Formatting Providers
   */
  formatProviders: DocumentSelector;
  /**
   * Conflict Checks
   */
  conflicts: {
    /**
     * When `true` the user is using prettier and not
     * ignored file extension types.
     */
    prettier: boolean;
    /**
     * When `true` the user has ThemeCheck installed and
     * they should be notified that ThemeCheck is trash.
     */
    themeCheck: boolean;
  }
}

export class Model implements IModel {

  feature = {
    format: true
  };

  format = {
    'html': false,
    'css': false,
    'json': false,
    'liquid': true,
    'liquid-javascript': true,
    'liquid-css': true,
    'liquid-scss': true,
    'liquid-json': true
  };

  get fileName () {
    return window.activeTextEditor.document.fileName;
  }

  get languageId () {
    return window.activeTextEditor.document.languageId;
  }

  get formatSupport () {
    return this.languageId in this.format && this.format[this.languageId];
  }

  set formatSupport (condition) {
    this.format[this.languageId] = condition;
  }

  documents = {};
  exclude = null;
  hasError: boolean = false;
  settings = workspace.getConfiguration('liquid');
  reset = false;
  rootPath = workspace.workspaceFolders[0].uri.fsPath;
  rcwatch = false;
  rcfile = null;
  configType = ConfigType.workspace;
  prettify = prettify.options.rules;

  conflicts = {
    prettier: false,
    themeCheck: false
  };

  formatProviders: DocumentSelector = [
    {
      scheme: 'file',
      language: 'html'
    },
    {
      scheme: 'file',
      language: 'liquid'
    },
    {
      scheme: 'file',
      language: 'liquid-css'
    },
    {
      scheme: 'file',
      language: 'liquid-js'
    },
    {
      scheme: 'file',
      language: 'liquid-json'
    }
  ];

}
