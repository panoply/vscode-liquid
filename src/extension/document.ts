import { workspace, languages, window, ConfigurationTarget, Disposable, TextEdit } from 'vscode';
import Format from './format';
import prettify from '@liquify/prettify';

/**
 * Document intializer class
 *
 * @class Document
 * @extends {Format}
 */
export default class Document extends Format {

  format: boolean;
  handler: { [filename: string]: Disposable };

  constructor () {

    super();

    this.handler = {};
    this.setFormattingRules();

  }

  /**
   * Executes when configuration settings have changed
   */
  onConfigChanges () {

    // Reset Error Condition
    this.error = false;

    // Common Initializes
    this.dispose();
    this.setFormattingRules();
    this.onOpenTextDocument();

  }

  /**
   * Prepares the opened text document for formatting
   */
  onOpenTextDocument () {

    if (window.activeTextEditor === undefined) return;

    const { fileName, languageId } = window.activeTextEditor.document;

    if (this.error) this.statusBarItem('error', true);

    // Hide status bar item if not HTML and return the provider early
    if (languageId !== 'html') {
      this.dispose();
      this.barItem.hide();
      return;
    }

    // If formatOnSave editor option is false, apply its state to Liquid formatter
    if (!workspace.getConfiguration('editor').formatOnSave) {
      this.format = false;
    }

    // Formatter is set to false, skip it
    if (!this.format) {

      // Show disabled formatter status bar
      this.dispose();
      this.statusBarItem('disabled', true);
      return;
    }

    // Disposal of match filename handler
    if (fileName in this.handler) this.handler[fileName].dispose();

    if (!this.error && this.format) this.statusBarItem('enabled', true);

    this.handler[fileName] = languages.registerDocumentFormattingEditProvider({
      scheme: 'file',
      language: 'html'
    }, {
      async provideDocumentFormattingEdits (document, options, provider) {

        const range = Format.range(document);
        const input = document.getText(range);

        try {

          const output = await prettify.format(input, { language: document.languageId });

          return [
            TextEdit.replace(range, output)
          ];

        } catch (error) {

          this.outputLog({ title: 'Prettify', message: `${error}` });
        }

      }
    });

  }

  /**
   * Dispose of formatting handlers
   *
   * @memberof Document
   */
  dispose () {

    for (const key in this.handler) if (key in this.handler) this.handler[key].dispose();

  }

  /**
   * Format the selected text area (command)
   *
   * @memberof Document
   */
  selection () {

    try {

      this.selectedText();
      window.showInformationMessage('Selection Formatted 💧');

    } catch (error) {

      window.showInformationMessage('Format Failed! The selection is invalid or incomplete!');
      this.outputChannel.appendLine(`💧 Liquid: ${error}`);

    }

  }

  /**
   * Handles the Generate `.liquidrc` file command
   *
   * @memberof Document
   */
  liquidrc () {

    return this.rcfileGenerate();

  }

  /**
   * Format the entire document (command)
   *
   * @memberof Document
   */
  async document () {

    try {

      await this.completeDocument();
      window.showInformationMessage('Document Formatted 💧');

    } catch (error) {

      console.log(error);
      window.showInformationMessage('Document could not be formatted, check your code!');
      this.outputChannel.appendLine(`💧 Liquid: ${error}`);

    }

  }

  /**
   * Toggle the output panel
   *
   * @memberof Document
   */
  output () {

    return this.outputChannel.show();

  }

  /**
   * Enabled formatting (command)
   *
   * @memberof Document
   */
  async enable () {

    this.format = true;

    await this.liquid.update('format', this.format, ConfigurationTarget.Global);
    return await window.showInformationMessage('Liquid Formatting Enabled 💧');

  }

  /**
   * Disable formatting (command)
   *
   * @memberof Document
   */
  async disable () {

    this.format = false;
    await this.liquid.update('format', this.format, ConfigurationTarget.Global);
    return await window.showInformationMessage('Liquid Formatting Disabled 💧');

  }

}
