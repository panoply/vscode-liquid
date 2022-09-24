/* eslint-disable no-useless-constructor */

import { TextEdit, Range, DocumentFormattingEditProvider, TextDocument } from 'vscode';
import { LanguageIds } from '../types';
import { getRange, getLanguage } from '../utils';

/**
 * Formatting Provider
 *
 * Register parameter for the `language.registerDocumentFormattingEditProvider`
 * capability. The instance is used for formatting documents.
 */
export class FormattingProvider implements DocumentFormattingEditProvider {

  constructor (private doFormat: (
    document: TextDocument,
    edits: {
      range: Range;
      input: string;
      language: LanguageIds
    }
  ) => Promise<TextEdit[]>) {}

  public async provideDocumentFormattingEdits (document: TextDocument) {

    const range = getRange(document);

    return this.doFormat(document, {
      range,
      input: document.getText(range),
      language: getLanguage(document.languageId)
    });

  }

}
