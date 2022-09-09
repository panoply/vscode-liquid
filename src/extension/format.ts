import { window } from 'vscode';
import prettify from '@liquify/prettify';
import { Config } from './config';
import { getRange } from './utils';

/**
 * Applies formatting to the document
 *
 * @class Format
 * @extends {Pattern}
 */
export class Format extends Config {

  /**
   * Formats the entire document
   */
  async formatDocument () {

    if (window.activeTextEditor === undefined) return;

    const { activeTextEditor } = window;
    const { document } = activeTextEditor;
    const range = getRange(document);
    const input = document.getText(range);

    try {
      const output = await prettify.format(input, { language: document.languageId });
      return activeTextEditor.edit(code => code.replace(range, output));
    } catch (message) {
      this.outputLog({ title: 'Prettify', message });
    }
  }

  /**
   * Format the selected (highlighted) text
   */
  async formatSelection () {

    if (window.activeTextEditor === undefined) return;

    const { activeTextEditor } = window;
    const { document, selection } = activeTextEditor;
    const input = document.getText(selection);

    try {
      const output = await prettify.format(input);
      return activeTextEditor.edit(code => code.replace(selection, output));
    } catch (message) {
      this.outputLog({ title: 'Prettify', message });
    }
  }

}
