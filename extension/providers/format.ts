import { window, TextEdit } from 'vscode';
import prettify from '@liquify/prettify';
import { Settings } from './settings';
import { EN } from './i18n';
import { Status } from './utilities';

/**
 * Applies formatting to the document
 *
 * @extends {Pattern}
 */
export class Format extends Settings {

  async toggleFormatting (enabled: boolean) {

    this.commandInvoked = true;
    this.capability.formatting = enabled;

    await this.liquidSettings.update('format.enable', this.capability.formatting);

  }

  /**
   * Enabled formatting (command)
   */
  async enableFormatting () {

    await this.toggleFormatting(true);

    this.statusBar(Status.Enabled, true);
    this.logOutput('liquid', 'prettify has been enabled ' + this.capability.formatting);

    await window.showInformationMessage(EN.ENABLED.FORMATTING);

  }

  /**
   * Disable formatting (command)
   */
  async disableFormatting () {

    await this.toggleFormatting(false);

    this.statusBar(Status.Disabled, true);
    this.logOutput('liquid', 'prettify has been disabled ');

    await window.showInformationMessage(EN.DISABLED.FORMATTING);

  }

  /**
   * Disable formatting (command)
   */
  async doFormat (input: string, range = this.range) {

    try {
      const output = await prettify.format(input, { language: this.languageId });
      return [ TextEdit.replace(range, output) ]; ;
    } catch (error) {
      return this.logOutput('error', error);
    }

  }

  /**
   * Formats the entire document
   */
  async formatDocument () {

    if (this.textEditor === undefined) return;

    return this.doFormat(this.text);

  }

  /**
   * Format the selected (highlighted) text
   */
  formatSelection () {

    if (this.textEditor === undefined) return;

    const input = this.textDocument.getText(this.textEditor.selection);

    return this.doFormat(input);
  }

  /**
   * Formats a selection of text using command
   */
  async onCommandSelectionFormat () {

    try {
      await this.formatSelection();
      window.showInformationMessage(EN.SUCCESS.SELECTION);
    } catch {
      window.showInformationMessage(EN.ERRORS.SELECTION);
    }
  }

  /**
   * Formats the document text using command
   */
  async onCommandDocumentFormat () {

    if (this.textEditor === undefined) return;

    try {
      await this.formatDocument();
      window.showInformationMessage(EN.SUCCESS.DOCUMENT);
    } catch {
      window.showInformationMessage(EN.ERRORS.DOCUMENT);
    }
  }

}
