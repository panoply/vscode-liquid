/* eslint-disable no-unused-vars */

import prettify, { Options } from '@liquify/prettify';
import { Tester } from 'anymatch';
import { DocumentFormattingEditProvider, EventEmitter, Range, TextDocument, TextEdit } from 'vscode';
import * as u from 'utils';

export enum FormatEventType {
  /**
   * Throws an error, print to output
   */
  ThrowError = 1,
  /**
   * Enable the status bar item.
   */
  EnableStatus = 2
}

export type FormatEvent = FormatEventType.EnableStatus | {
  type: FormatEventType.ThrowError,
  message: string,
  detail: string
}

export class FormattingProvider implements DocumentFormattingEditProvider {

  /* -------------------------------------------- */
  /* STATE                                        */
  /* -------------------------------------------- */

  /**
   * Whether or not to enable
   */
  public enable: boolean = false;
  /**
   * Hard reference to ignored paths
   */
  public ignoreList: string[] = [];
  /**
   * Anymatch pattern for ignored paths
   */
  public ignoreMatch: Tester;
  /**
   * Set list of `fsPath` URI ignored paths
   */
  public ignored: Set<string> = new Set();
  /**
   * Set list of `fsPath` URI paths
   */
  public register: Set<string> = new Set();
  /**
   * The current formatting rules
   */
  public rules: Options;
  /**
   * The current formatting rules
   */
  public hasError: boolean = false;
  /**
   * The current formatting rules
   */
  public error: Error = null;
  /**
   * Error event
   */
  public listen: EventEmitter<FormatEvent> = new EventEmitter();

  reset () {

    this.ignoreList = [];
    this.ignoreMatch = null;
    this.ignored.clear();
    this.hasError = false;
    this.error = null;

  }

  /* -------------------------------------------- */
  /* PROVIDERS                                    */
  /* -------------------------------------------- */

  /**
   * Provide formatting edits for a whole document.
   *
   * @param document The document in which the command was invoked.
   * @param options Options controlling formatting.
   * @param token A cancellation token.
   * @return A set of text edits or a thenable that resolves to such. The lack of a result can be
   * signaled by returning `undefined`, `null`, or an empty array.
   */
  provideDocumentFormattingEdits (textDocument: TextDocument) {

    if (this.enable === false) return [];
    if (this.ignored.has(textDocument.uri.fsPath)) return [];

    const language = u.getLanguage(textDocument.languageId);

    if (language === undefined) return [];

    const findRange = new Range(0, 0, textDocument.lineCount, 0);
    const fullRange = textDocument.validateRange(findRange);
    const source = textDocument.getText();

    try {

      const output = prettify.formatSync(source, { language });

      if (this.hasError) {
        this.hasError = false;
        this.error = null;
        this.listen.fire(FormatEventType.EnableStatus);
      }

      return [ TextEdit.replace(fullRange, output) ];

    } catch (e) {

      if (this.hasError === false || this.error !== e) {
        this.error = e.message;
        this.hasError = true;
        this.listen.fire({
          type: FormatEventType.ThrowError,
          message: 'Parse error occured when formatting document',
          detail: e.message
        });
      }
    }

    return [];

  }

}
