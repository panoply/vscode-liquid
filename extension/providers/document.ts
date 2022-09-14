import { workspace, languages, commands, TextEdit, ConfigurationChangeEvent, TextDocumentChangeEvent, Uri } from 'vscode';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { Format } from './format';
import prettify from '@liquify/prettify';
import { getLanguage, getRange, Status } from './utilities';
import { JSONLanguageService } from './json';
import { schema } from './schema';

/**
 * Document intializer class
 *
 * @class Document
 * @extends {Format}
 */
export class Document extends Format {

  private service: JSONLanguageService = null;
  private diagnostics = languages.createDiagnosticCollection('Liquid');
  private sections: Map<string, { node: TextDocument; offset: number; uri: Uri; }> = new Map();
  private uriPath: string = null;

  get section () {

    return this.sections.get(this.uriPath);

  }

  onJsonService () {

    if (this.service === null) {
      this.service = new JSONLanguageService(schema);
      this.logOutput('liquid', 'activated json language service');
    }

  }

  /**
   * Executes when configuration settings have changed
   */
  onConfigChanges (config: ConfigurationChangeEvent) {

    if (config.affectsConfiguration('liquid') && this.commandInvoked === false) {

      this.hasError = false;
      this.setConfigSettings();

      if (this.isDisabled) {
        this.disposeAll();
        this.barItem.hide();
      } else {
        this.statusBar(Status.Enabled, true);
        this.onOpenTextDocument();
      }

    }

  }

  onOpenTextDocument () {

    if (this.isDisabled) {
      this.dispose();
      return;
    }

    if (this.liquidSettings.get<boolean>('enable')) {
      this.isLoading = false;
    } else if (this.isLoading) {
      this.barItem.hide();
      this.isLoading = false;
    }

    this.provider = languages.registerDocumentFormattingEditProvider(this.selector, {
      provideDocumentFormattingEdits: async (document) => {

        if (this.isDisabled || this.capability.formatting === false) return null;

        try {

          const range = getRange(document);
          const input = document.getText(range);
          const output = await prettify.format(input, { language: getLanguage(document.languageId) });

          return [ TextEdit.replace(range, output) ];

        } catch (error) {

          console.log(error);
          this.logOutput('error', error);
        }

      }
    });

    return this.provider;

  }

  onChangeTextDocument ({ document }: TextDocumentChangeEvent) {

    if (document.languageId !== 'html' && document.languageId !== 'liquid') return;

    this.uriPath = document.uri.path;

    const section = this.sections.has(document.uri.path);
    const text = document.getText();
    const start = text.search(/{%-?\s*schema\s*-?%}/);

    if (start === -1) {
      if (section) this.sections.delete(this.uriPath);
      return;
    }

    const open = text.indexOf('%}', start) + 2;
    if (open === -1) {
      if (section) this.sections.delete(this.uriPath);
      return;
    }

    const close = text.search(/{%-?\s*endschema\s*-?%}/);
    if (close === -1) {
      if (section) this.sections.delete(this.uriPath);
      return;
    }

    this.diagnostics.clear();

    const offset = document.positionAt(open).line;
    const newText = text.slice(open, close);

    let ref: {
      node: TextDocument;
      offset: number;
      uri: Uri
    };

    if (section) {

      ref = this.sections.get(this.uriPath);
      const range = getRange(ref.node as any);

      ref.node = TextDocument.update(ref.node, [ { range, text: newText } ], ref.node.version + 1);
      ref.offset = offset;
      ref.uri = document.uri;

    } else {

      ref = <any>{};

      ref.offset = offset;
      ref.uri = document.uri;
      ref.node = TextDocument.create(this.uriPath, 'json', 1, newText);

      this.sections.set(this.uriPath, ref);

    }

    if (this.liquidSettings.get<boolean>('validate.schema')) {

      this.diagnostics.clear();

      this.service
        .doValidation(ref.node, ref.offset)
        .then(diagnostics => this.diagnostics.set(document.uri, diagnostics as any))
        .catch(error => console.error(error));

    }
  }

  /**
   * Prepares the opened text document for formatting
   */
  async onEditorStart (subscriptions: { dispose(): any; }[]) {

    await this.getConfigFile();

    this.onJsonService();

    subscriptions.push(
      commands.registerCommand('liquid.generateLiquidrc', this.liquidrc, this),
      commands.registerCommand('liquid.disableExtension', this.liquidrc, this),
      commands.registerCommand('liquid.restartExtension', this.liquidrc, this),
      commands.registerCommand('liquid.toggleOutput', this.openOutput, this),
      commands.registerCommand('liquid.disableFormatter', this.disableFormatting, this),
      commands.registerCommand('liquid.enableFormatter', this.enableFormatting, this),
      commands.registerCommand('liquid.formatSelection', this.formatSelection, this),
      workspace.onDidOpenTextDocument(this.onOpenTextDocument, this),
      workspace.onDidChangeConfiguration(this.onConfigChanges, this),
      workspace.onDidChangeTextDocument(this.onChangeTextDocument, this)
    );

  }

  /**
   * Dispose the most active handler
   */
  dispose () {

    // Disposal of match filename handler
    if (this.hasDocument) this.provider.dispose();
  }

  /**
   * Dispose of all handlers
   */
  disposeAll () {

    for (const key in this.documents) {
      if (key in this.documents) this.documents[key].dispose();
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

}
