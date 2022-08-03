import { window, Range, TextDocument } from 'vscode';
import prettify from '@liquify/prettify';
import Config from './config';

/**
 * Applies formatting to the document
 *
 * @class Format
 * @extends {Pattern}
 */
export default class Format extends Config {

  /**
   * Formats the entire document
   */
  async completeDocument () {

    if (window.activeTextEditor === undefined) return;

    const { activeTextEditor } = window;
    const { document } = activeTextEditor;
    const range = Format.range(document);
    const input = document.getText(range);

    try {

      const output = await prettify.format(input, { language: document.languageId });

      await activeTextEditor.edit(code => code.replace(range, output));

    } catch (error) {

      this.outputLog({ title: 'Prettify', message: `${error}` });
    }

  }

  /**
   * Format the selected (highlighted) text
   */
  async selectedText () {

    if (window.activeTextEditor === undefined) return;

    const { activeTextEditor } = window;
    const { document, selection } = activeTextEditor;
    const input = document.getText(selection);

    try {

      const output = await prettify.format(input);
      await activeTextEditor.edit(code => code.replace(selection, output));

    } catch (error) {

      this.outputLog({ title: 'Prettify', message: `${error}` });
    }

  }

  /**
   * Get the formatting range
   */
  static range (document: TextDocument) {

    const range = document.getText().length - 1;
    const first = document.positionAt(0);
    const last = document.positionAt(range);

    return new Range(first, last);

  }

}
