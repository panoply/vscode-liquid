/* eslint-disable no-unused-vars */
import prettify, { Options } from '@liquify/prettify';
import { Tester } from 'anymatch';
import { Disposable, DocumentSelector, window, workspace } from 'vscode';
import { getRange } from './utilities';
import { Config } from './types';

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
  documents: Map<string, Disposable> = new Map();

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
  get provider () { return this.documents.get(this.fileName); }

  /**
   * Sets a new document to the static `documents` cache
   */
  set provider (disposable) {

    if (!this.documents.has(this.fileName)) {
      this.documents.set(this.fileName, disposable);
    }
  }

  get hasProvider () {

    return this.documents.has(this.fileName);

  }

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

    if (this.editorSettings.has('renderFinalNewline')) {
      rules.endNewline = this.editorSettings.get<boolean>('renderFinalNewline');
    }

    return rules;

  }

  /**
   * Extension feature control
   */
  feature: {

    /**
     * Whether or not formatting is disabled
     */
    format: boolean;
    /**
     * Whether or not schema stores are disabled
     */
    schema: boolean;

  } = { format: null, schema: null };

  /**
   * Validation capbilities
   */
  validate: {
    /**
     * JSON validation
     */
    json: boolean;

  } = { json: null };

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
  doNotStart: boolean = false;
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
   * The extension configuration method being used
   */
  config: Config = NaN;
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
