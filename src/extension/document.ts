import { workspace, languages, window, ConfigurationTarget, TextEdit, TextDocument, FormattingOptions } from 'vscode';
import { Format } from './format';
import prettify from '@liquify/prettify';
import { getRange, matchLanguage, Status } from './utils';
import { has } from 'rambda';

/**
 * Document intializer class
 *
 * @class Document
 * @extends {Format}
 */
export default class Document extends Format {

  async onConnect () {

    await this.getConfigFile();

    console.log(this);
  }

  /**
   * Executes when configuration settings have changed
   */
  onConfigChanges () {

    // Reset Error Condition
    this.hasError = false;

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

    if (this.hasError) this.statusBarItem(Status.Error, true);

    // Hide status bar item if not HTML and return the provider early
    if (!has(languageId, this.format)) {
      this.dispose();
      this.barItem.hide();
      return;
    }

    // If formatOnSave editor option is false, apply its state to Liquid formatter
    this.format[languageId] = workspace.getConfiguration('editor').get('formatOnSave');

    // Formatter is set to false, skip it
    if (!this.format[languageId]) {
      // Show disabled formatter status bar
      this.dispose();
      this.statusBarItem(Status.Disabled, true);
      return;
    }

    // Disposal of match filename handler
    if (fileName in this.documents) {
      this.documents[fileName].dispose();
    }

    if (!this.hasError && this.format[languageId]) {
      this.statusBarItem(Status.Enabled, true);
    }

    this.documents[fileName] = languages.registerDocumentFormattingEditProvider(
      this.formatProviders,
      { provideDocumentFormattingEdits: this.formatEdits }
    );

  }

  formatEdits = async (document: TextDocument, options: FormattingOptions) => {

    const range = getRange(document);
    const input = document.getText(range);
    const language = matchLanguage(document.languageId);

    try {

      const output = await prettify.format(input, {
        language,
        indentSize: options.tabSize,
        indentChar: options.insertSpaces ? ' ' : '\t'
      });

      return [ TextEdit.replace(range, output) ];

    } catch (error) {

      this.outputLog({ title: 'Prettify', message: `${error}` });
    }

  };

  /**
   * Dispose of formatting handlers
   *
   * @memberof Document
   */
  dispose () {

    for (const key in this.documents) {
      if (key in this.documents) {
        this.documents[key].dispose();
      }
    }
  }

  /**
   * Format the selected text area (command)
   *
   * @memberof Document
   */
  selection () {

    try {

      this.formatSelection();

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

      await this.formatDocument();
      window.showInformationMessage('Document Formatted 💧');

    } catch (error) {

      console.log(error);
      window.showInformationMessage('Document could not be formatted, check your code!');
      this.outputChannel.appendLine(`💧 Liquid ${error}`);

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

    if (this.formatSupport) {
      this.feature.format = true;
      await this.settings.update('feature.format', true, ConfigurationTarget.Global);
      return window.showInformationMessage('Liquid Formatting Enabled 💧');
    } else {
      return window.showInformationMessage(`You need to enable formatting for ${this.languageId.toUpperCase()}`);
    }

  }

  /**
   * Disable formatting (command)
   *
   * @memberof Document
   */
  async disable () {

    if (this.formatSupport) {
      this.feature.format = false;
      await this.settings.update('feature.format', false, ConfigurationTarget.Global);
      return window.showInformationMessage('Liquid Formatting Disabled 💧');
    } else {
      return window.showInformationMessage(`You need to enable formatting for ${this.languageId.toUpperCase()}`);
    }

  }

}
