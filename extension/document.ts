import {
  workspace,
  languages,
  commands,
  TextEdit,
  ConfigurationChangeEvent,
  TextDocumentChangeEvent,
  Uri
} from 'vscode';
import prettify from '@liquify/prettify';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { Format } from './format';
import { getFileNameExtension, getLanguage, getLanguageFromExtension, getRange, isBoolean } from './utilities';
import { JSONLanguageService } from './json';
import { schema } from './schema';
import { EN } from './i18n';
import { EXTSettings, Status } from './types';

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
  private errorCache: string = null;

  get section () {

    return this.sections.get(this.uriPath);

  }

  onJsonService () {

    if (this.service === null && this.validate.json) {
      this.service = new JSONLanguageService(schema);
      this.logOutput(EN.ENABLED_SCHEMA_VALIDATE);
    }

  }

  /**
   * Executes when configuration settings have changed
   */
  onConfigChanges (config: ConfigurationChangeEvent) {

    if (this.commandInvoked === false) {

      if (config.affectsConfiguration('liquid')) {

        const noValidate = this.validate.json;
        const canFormat = this.feature.format;

        this.hasError = false;
        this.setConfigSettings();

        if (this.isDisabled) {
          this.disposeValidations();
          if (this.provider) this.provider.dispose();
          this.barItem.hide();
        } else {
          if (noValidate === false && this.validate.json) this.onJsonService();
          this.onOpenTextDocument();
        }

        if (config.affectsConfiguration('liquid.format')) {
          if (canFormat === true && this.feature.format === true) {
            this.logOutput('updated prettify beautification rules');
          }
        }

      } else if (config.affectsConfiguration('[html]')) {

        const hasConfig = this.getSettings();

        if (hasConfig === EXTSettings.WorkspaceUndefined) {
          this.logOutput('workspace settings ');
          this.feature.format = null;
        }

        this.commandInvoked = true;

      }
    } else {

      this.commandInvoked = false;
    };

  }

  onOpenTextDocument () {

    // this.disposeAll();

    if (this.provider) this.provider.dispose();
    if (this.isDisabled) return null;
    if (this.liquidSettings.get<boolean>('enable')) this.isLoading = false;

    if (this.statusBarActive === false && isBoolean(this.feature.format)) {
      this.statusBarActive = true;
      if (this.feature.format) {
        this.statusBar(Status.Enabled);
      } else {
        this.statusBar(Status.Disabled);
      }
    }

    if (this.feature.format === null) {

      const language = getLanguageFromExtension(this.fileName);

      if (language === 'liquid') {
        this.statusBar(Status.Loading, true);
        this.feature.format = true;
        this.setWorkspaceDefaults();
      }
    }

    this.provider = languages.registerDocumentFormattingEditProvider(this.selector, {
      provideDocumentFormattingEdits: async document => {

        if (this.isDisabled || this.isLoading || this.feature.format === false) return null;

        const ext = getFileNameExtension(document.fileName);

        if (ext === '.html' && this.languages.has(ext) === false) {
          this.statusBar(Status.Ignored);
          return null;
        } else {
          this.statusBar(Status.Enabled);
        }

        const range = getRange(document);
        const input = document.getText(range);
        const language = getLanguage(document.languageId);
        const options = prettify.options.rules.language !== language ? { language } : undefined;

        try {

          const output = await prettify.format(input, options);

          if (this.hasError) {
            this.errorCache = null;
            this.statusBar(Status.Enabled);
          }

          return [ TextEdit.replace(range, output) ];

        } catch (e) {

          if (this.hasError === false || this.errorCache !== e) {
            this.errorCache = e;
            this.error('Formatting parse error occured in document', e);
          }
        }

      }
    });

    return this.provider;

  }

  onChangeTextDocument (change: TextDocumentChangeEvent) {

    if (!change) return null;

    const { document } = change;

    if (document.languageId !== 'html' && document.languageId !== 'liquid') return null;

    this.uriPath = document.uri.path;

    if (this.validate.json === false) return this.disposeValidations();

    const section = this.sections.has(document.uri.path);
    const text = document.getText();
    const start = text.search(/{%-?\s*schema\s*-?%}/);

    if (start === -1) {

      if (section) {
        this.diagnostics.set(document.uri, undefined);
        this.sections.delete(this.uriPath);
      }

      return;

    }

    const open = text.indexOf('%}', start) + 2;
    if (open === -1) {

      if (section) {
        this.diagnostics.set(document.uri, undefined);
        this.sections.delete(this.uriPath);
      }

      return;
    }

    const close = text.search(/{%-?\s*endschema\s*-?%}/);
    if (close === -1) {

      if (section) {
        this.diagnostics.set(document.uri, undefined);
        this.sections.delete(this.uriPath);
      }

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

      this.diagnostics.set(document.uri, undefined);

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

    if (!this.isDisabled) this.onJsonService();

    subscriptions.push(
      commands.registerCommand('liquid.openOutput', this.openOutput, this),
      commands.registerCommand('liquid.generateLiquidrcDefaults', this.liquidrcDefaults, this),
      commands.registerCommand('liquid.generateLiquidrcRecommended', this.liquidrcRecommended, this),
      commands.registerCommand('liquid.disableExtension', this.enableCapabilities, this),
      commands.registerCommand('liquid.enableExtension', this.disableCapabilities, this),
      commands.registerCommand('liquid.enableFormatter', this.enableFormatting, this),
      commands.registerCommand('liquid.disableFormatter', this.disableFormatting, this),
      commands.registerCommand('liquid.upgradeVersion', this.upgradeExtension, this),
      workspace.onDidOpenTextDocument(this.onOpenTextDocument, this),
      workspace.onDidChangeConfiguration(this.onConfigChanges, this),
      workspace.onDidChangeTextDocument(this.onChangeTextDocument, this)
    );

  }

  disposeValidations () {

    if (this.validate.json === false) {

      if (this.sections.size > 0) {
        for (const doc of this.sections) this.diagnostics.set(doc[1].uri, undefined);
        this.diagnostics.dispose();
        this.sections.clear();
      }

    }
  }

  /**
   * Control extension capabilities, Enable from the command palette.
   */
  async enableCapabilities () {

    const enable = this.liquidSettings.get<boolean>('enable');

    if (enable) return;

    await this.liquidSettings.update('enable', true);

  }

  /**
   * Control extension capabilities, Enable from the command palette.
   */
  async disableCapabilities () {

    const enable = this.liquidSettings.get<boolean>('enable');

    if (!enable) return;

    await this.liquidSettings.update('enable', false);

  }

  /**
   * Handles the Generate `.liquidrc` file command for generating
   * recommended formatting rules
   */
  liquidrcRecommended () {

    return this.rcfileGenerate('recommended');

  }

  /**
   * Handles the Generate `.liquidrc` file command for generating
   * default formatting rules.
   */
  liquidrcDefaults () {

    return this.rcfileGenerate('defaults');

  }

}
