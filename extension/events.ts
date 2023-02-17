import { ConfigurationChangeEvent, TextDocument, TextDocumentChangeEvent, TextEditor, Position, Range } from 'vscode';
import { ConfigMethod } from './types';
import { FormatEvent, FormatEventType } from './providers/FormattingProvider';
import { getSchema } from './lexical/parse';
import { Engine } from '@liquify/liquid-language-specs';
import { dirty, isFunction, parseJsonFile } from './utils';
import { CommandPalette } from './workspace/CommandPalette';
import { assigns } from './lexical/variables';

/**
 * Workspace Events
 *
 * Event handling for the workspace. Each event is subscribed on activation
 * via the `VSCodeLiquid` class instance. The methods provided here are the
 * standard vscode workspace related events.
 *
 * ---
 *
 * The `VSCodeLiquid` class will extend next.
 */
export class Events extends CommandPalette {

  /**
   * OnFormattingEvent
   *
   * An event dispatched from within the Formatting Provider
   * that handles errors.
   */
  public onFormattingEvent (data: FormatEvent) {

    if (data === FormatEventType.EnableStatus) {
      this.status.enable();
    } else if (data.type === FormatEventType.ThrowError) {
      this.error(data.message)(data.detail);
    }

  }

  /**
   * onDidCloseTextDocument
   *
   * Invoked when an opened document is closed.
   */
  public onDidCloseTextDocument ({ uri }: TextDocument) {

    if (this.formatting.register.has(uri.fsPath)) {
      this.formatting.register.delete(uri.fsPath);
    }

    if (this.completion.vars.has(uri.fsPath)) {
      this.completion.vars.delete(uri.fsPath);
    }

  }

  /**
   * onDidChangeTextDocument
   *
   * Invoked when a text document has changed. We only care about schema
   * in the event (for now). In Liquify we use LSP so this is just a hot
   * patch for us the reason with diagnostics.
   */
  public async onDidChangeTextDocument ({ document, contentChanges }: TextDocumentChangeEvent) {

    const change = contentChanges[contentChanges.length - 1];

    if (change?.range) {

      const range = new Range(new Position(0, 0), change.range.end);
      const content = document.getText(range);
      const vars = this.completion.vars.get(document.uri.fsPath);

      await assigns(content, vars);

    }

    if (this.engine === Engine.shopify && this.json.config.validate === true) {

      const schema = getSchema(document);

      if (schema !== false) {

        const diagnostics = await this.json.doValidation(document.uri, schema);

        this.formatting.enable = this.json.canFormat;
        this.json.diagnostics.set(document.uri, diagnostics);

        // if (!this.formatting.enable) {

        //   try {

        //     parseJson(schema.content);

        //     if (this.hasError) {
        //       this.hasError = false;
        //       this.errorCache = null;
        //       this.status.enable();
        //     }

        //   } catch (e) {

        //     if (this.hasError === false || this.errorCache !== e) {
        //       this.errorCache = e.message;
        //       this.hasError = true;
        //       this.error('Parse error occured when formatting document')(e.message);
        //     }
        //   }

        // }

      } else if (this.json.diagnostics.has(document.uri)) {

        this.json.canFormat = true;
        this.json.diagnostics.clear();

      }

    }

  }

  /**
   * onDidChangeActiveTextEditor
   *
   * Invoked when a text document was opened or a document
   * has changed (ie: new tab or file).
   */
  async onDidChangeActiveTextEditor (textDocument: TextEditor | undefined) {

    if (!textDocument?.document) {
      this.json.diagnostics.clear();
      this.json.canFormat = true;
      this.status.hide();
      return;
    };

    if (!this.languages.get(textDocument.document.languageId)) {
      this.status.hide();
      return;
    }

    this.status.show();

    if (this.isDirty) this.isDirty = await dirty(textDocument.document);

    const { fsPath } = textDocument.document.uri;

    if (!this.completion.vars.has(fsPath)) {
      this.completion.vars.set(fsPath, new Map());
    }

    if (this.formatting.ignored.has(fsPath)) {
      this.status.ignore();
      return;
    }

    if (isFunction(this.formatting.ignoreMatch) && this.formatting.ignoreMatch(fsPath)) {
      this.info(`Ignoring: ${fsPath}`);
      this.formatting.ignored.add(fsPath);
      this.status.ignore();
      return;
    }

    if (this.isFormattingOnSave(textDocument.document.languageId)) {

      if (!this.formatting.register.has(fsPath)) {
        this.formatting.register.add(fsPath);
      }

      this.formatting.enable = true;
      this.status.enable();

    } else {

      this.formatting.enable = false;
      this.status.disable();

    }
  }

  /**
   * OnDidSaveTextDocument
   *
   * Invoked when a text document has been saved. We need context
   * of certain files to provide capabilities like (for example) locale
   * completions. It is here where we keep our store in sync.
   */
  public async onDidSaveTextDocument (textDocument: TextDocument) {

    const uri = textDocument.uri.fsPath;

    if (this.engine === Engine.shopify) {

      const { locales, settings } = this.files;

      if (locales.fsPath === uri) {
        this.completion.files.locales.items = await parseJsonFile(locales);
      } else if (settings.fsPath === uri) {
        this.completion.files.settings.items = await parseJsonFile(locales);
      }

    }

  }

  /**
   * onDidChangeConfiguration
   *
   * Invoked when the configuration has changed. It will determine
   * which settings have changed and apply operations which
   * pertain to the extension functionality.
   */
  public async onDidChangeConfiguration (config: ConfigurationChangeEvent) {

    if (config.affectsConfiguration('liquid')) {

      await this.getSettings();

      if (this.config.method === ConfigMethod.Workspace) {
        if (config.affectsConfiguration('liquid.format')) {
          if (config.affectsConfiguration('liquid.format.ignore')) {
            this.info('workspace ignore list changed');
            this.formatting.ignored.clear();
            this.formatting.register.clear();
          }
        }
      }

    } else {

      for (const id in this.languages) {

        if (!config.affectsConfiguration(id)) continue;

        if (this.isDefaultFormatter(id)) {

          if (!this.languages[id]) {
            this.languages[id] = true;
            if (this.selector.some(({ language }) => language !== id)) {
              this.selector.push({ language: id, scheme: 'file' });
            }
          }

          this.info('The vscode-liquid extension will format ' + id);

        } else {
          if (this.languages[id]) {
            this.languages[id] = false;
            this.info('vscode-liquid is no longer formatting ' + id);
            this.selector = this.selector.filter(({ language }) => {
              if (language.startsWith('liquid')) return true;
              return language !== id;
            });
          }
        }
      }

    };
  }

}
