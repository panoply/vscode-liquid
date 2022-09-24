import { window, TextEdit, Range, workspace } from 'vscode';
import prettify, { Options } from '@liquify/prettify';
import { getRange } from 'utils';
import { FSWatch } from 'providers/FileSystemWatcher';

/**
 * Applies formatting to the document
 *
 * @extends {Pattern}
 */
export class CommandPalette extends FSWatch {

  /**
   * Holds a cache copy of an error, typically returned by Prettify
   */
  public errorCache: string = null;

  public getFormatter () {

    prettify.format.after((_, { languageName }) => {
      if (!this.hasError) {
        this.info(`${languageName} formatted in ${prettify.format.stats.time}ms`);
      }
    });

  }

  public async toggleFormatting (enabled: boolean) {

    this.canFormat = enabled;

    await workspace
      .getConfiguration('liquid')
      .update('format.enable', this.canFormat);

  }

  /**
   * Enabled formatting (command)
   */
  public async enableFormatting () {

    await this.toggleFormatting(true);

    this.status.enable();
    this.info('Enabled formatting');

    await window.showInformationMessage('Enabled Liquid\'s Prettify Formatter');

  }

  /**
   * Disable formatting (command)
   */
  public async disableFormatting () {

    await this.toggleFormatting(false);

    this.status.disable();
    this.info('Disabled Formatting');

    await window.showInformationMessage('Disabled Liquid\'s Prettify Formatter');

  }

  /**
   * Disable formatting (command)
   */
  public async doFormat (input: string, options: Options, range?: Range) {

    try {

      const output = await prettify.format(input, options);

      if (this.hasError) {
        this.errorCache = null;
        this.status.enable();
      }

      return [ TextEdit.replace(range, output) ];

    } catch (e) {

      if (this.hasError === false || this.errorCache !== e) {
        this.errorCache = e;
        this.error('Formatting parse error occured in document', e);
      }
    }

  }

  /**
   * Formats the entire document
   */
  public async formatDocument () {

    if (window.activeTextEditor === undefined) return;

    if (this.canFormat === true) {

      const { document } = window.activeTextEditor;
      const { languageId } = document;

      if (this.languages[languageId]) {

        const range = getRange(document);
        const input = document.getText(range);

        await this.doFormat(input, { language: languageId }, range);

      } else {

        this.warn('language id ' + languageId + ' is not enabled');

      }

    }
  }

  /**
   * Formats the document text using command
   */
  public async onCommandDocumentFormat () {

    if (window.activeTextEditor === undefined) return;

    try {
      await this.formatDocument();
      window.showInformationMessage('Document Formatted');
    } catch {
      window.showInformationMessage('Formatting Failed! Failed! The document could not be beautified, see output.');
    }
  }

}
