/* eslint-disable no-unused-vars */
import prettify, { Options } from '@liquify/prettify';
import { Tester } from 'anymatch';
import { Disposable, DocumentSelector, window, workspace } from 'vscode';
import { getRange } from './utilities';

/**
 * Configuration Type
 *
 * Informs upon the configuration type being used
 */
export const enum ConfigType {
  /**
   * Liquidrc file is contained in root and is JSON
   */
  RCFile = 1,
  /**
   * Prettify filed in the package.json file
   */
  PackageJSONField,
  /**
   * Workspace setting, ie: `.vscode/settings.json`
   */
  WorkspaceSettings,
  /**
   * Global defined settings, ie: User Preferences
   */
  GlobalSettings
}

/**
 * Extension State
 *
 * Holds references and maintains data which pertain to
 * the extensions operations and features.
 */
export class State {

  /**
   * Document Management
   */
  documents: { [fileName: string]: Disposable } = {};

  /**
   * Returns the active text editor, surgar
   * for `window.activeTextEditor`
   */
  get textEditor () { return window.activeTextEditor; }

  /**
   * Returns the active text document, sugar
   * for `window.activeTextEditor.document`
   */
  get textDocument () { return window.activeTextEditor.document; }

  /**
   * Returns the active document filename, sugar
   * for `window.activeTextEditor.document.fileName`
   */
  get fileName () { return window.activeTextEditor.document.fileName; }

  /**
   * Returns the active document languageId, sugar
   * for `window.activeTextEditor.document.languageId`
   */
  get languageId () { return window.activeTextEditor.document.languageId; }

  /**
   * Returns the active document range
   */
  get range () { return getRange(window.activeTextEditor.document); }

  /**
   * Returns the active documents text
   */
  get text () { return window.activeTextEditor.document.getText(this.range); }

  /**
   * Returns the rootPath of the workspace
   */
  get rootPath () { return workspace.workspaceFolders[0].uri.fsPath; }

  /**
   * Returns the `editor` settings preference
   */
  get editorSettings () { return workspace.getConfiguration('editor'); }

  /**
   * Returns the `liquid` settings preference
   */
  get liquidSettings () { return workspace.getConfiguration('liquid'); }

  /**
   * Returns the current document disposable
   */
  get provider () { return this.documents[this.fileName]; }

  /**
   * Sets a new document to the static `documents` cache
   */
  set provider (disposable) { this.documents[this.fileName] = disposable; }

  /**
   * Whether or not the document has a disposable
   */
  get hasDocument () { return this.fileName in this.documents; }

  /**
   * Merged prettify rule
   */
  get prettifyRules () {

    const { rules } = prettify.options;

    if (this.editorSettings.has('wordWrapColumn')) {
      rules.wrap = this.editorSettings.get<number>('wordWrapColumn');
    }

    if (this.editorSettings.has('tabSize')) {
      rules.indentSize = this.editorSettings.get<number>('tabSize');
    }

    if (this.editorSettings.has('tabSize')) {
      rules.endNewline = this.editorSettings.get<boolean>('renderFinalNewline');
    }

    return rules;

  }

  /**
   * Extension feature control
   */
  capability: {
    /**
     * Whether or not formatting is disabled
     */
    formatting: boolean;
    /**
     * Whether or not schema stores are disabled
     */
    schema: boolean;
  } = {
      formatting: null,
      schema: null
    };

  /**
   * Whether or not a command was invoked
   */
  commandInvoked: boolean = false;
  /**
   * Anymatch pattern for ignored paths
   */
  ignoredGlobs: Tester;
  /**
   * Whether or not the extension is disabled
   */
  isDisabled: boolean = null;
  /**
   * Whether or not the file system watcher is running
   */
  isWatching: boolean = false;
  /**
   * Whether the extension is in a state of loading
   */
  isLoading: boolean = false;
  /**
   * Whether or not the extension has initialized
   */
  isReady: boolean = false;
  /**
   * Whether or not the extension has initialized
   */
  configType: ConfigType = NaN;
  /**
   * Whether or not an error has occured
   */
  hasError: boolean = false;
  /**
   * Whether or not a warning has occured
   */
  hasWarning: boolean = false;
  /**
   * Formatting Providers
   */
  selector: DocumentSelector;
  /**
   * URI File paths to files of interest
   */
  uri: {
    /**
     * URI path to the `.liquidrc` file
     */
    liquidrc?: string;
    /**
     * URI path to the `package.json` file
     */
    package?: string;

  } = {};

}
