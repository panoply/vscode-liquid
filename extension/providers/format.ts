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
    this.logOutput(EN.ENABLED_PRETTIFY);

    await window.showInformationMessage(EN.ENABLED_FORMAT);

  }

  /**
   * Disable formatting (command)
   */
  async disableFormatting () {

    await this.toggleFormatting(false);

    this.statusBar(Status.Disabled, true);
    this.logOutput(EN.DISABLED_FORMAT);

    await window.showInformationMessage(EN.DISABLED_PRETTIFY);

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
   * Formats the document text using command
   */
  async onCommandDocumentFormat () {

    if (this.textEditor === undefined) return;

    try {
      await this.formatDocument();
      window.showInformationMessage(EN.DOCUMENT_FORMAT);
    } catch {
      window.showInformationMessage(EN.DOCUMENT_FORMAT_ERROR);
    }
  }

}
