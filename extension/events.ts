import { ConfigurationChangeEvent, TextDocument, TextDocumentChangeEvent, TextEditor } from 'vscode';
import { ConfigMethod } from 'types';
import { FormatEvent, FormatEventType } from 'providers/FormattingProvider';
import { Engine } from '@liquify/specs';
import { dirty, isFunction, isObject, setEndRange } from 'utils';
import { CommandPalette } from 'workspace/CommandPalette';
import { parseSchema, parseDocument } from 'parse/document';
import { getObjectCompletions } from 'data/liquid';

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

    if (this.formatting.register.has(uri.fsPath)) this.formatting.register.delete(uri.fsPath);

  }

  /**
   * onDidChangeTextDocument
   *
   * Invoked when a text document has changed. We only care about schema
   * in the event (for now). In Liquify we use LSP so this is just a hot
   * patch for the time being.
   */
  public async onDidChangeTextDocument ({ document, contentChanges }: TextDocumentChangeEvent) {

    const change = contentChanges[contentChanges.length - 1];

    if (isObject(change?.range) && this.completion.enable.variables) {
      await parseDocument(document.getText(setEndRange(change.range.end)), this.completion.vars);
    }

    if (this.completion.enable.schema && this.json.config.validate) {

      const schema = await parseSchema(document);

      if (schema !== false) {

        this.json.schema.set(document.uri.fsPath, schema);
        const diagnostics = await this.json.doValidation(document.uri);

        this.formatting.enable = this.json.canFormat;
        this.json.diagnostics.set(document.uri, diagnostics);

      } else {

        if (this.json.diagnostics.has(document.uri)) {
          this.json.canFormat = true;
          this.json.diagnostics.clear();
        }

        if (this.json.schema.has(document.uri.fsPath)) {
          this.json.schema.delete(document.uri.fsPath);
        }
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
      this.status.hide();

    } else {

      const { uri, languageId } = textDocument.document;

      if (!this.languages.get(languageId)) {

        this.json.diagnostics.clear();
        this.json.canFormat = true;
        this.status.hide();

      } else {

        this.status.show();

        const schema = await parseSchema(textDocument.document);

        if (schema !== false) {

          this.json.schema.set(uri.fsPath, schema);

          const diagnostics = await this.json.doValidation(uri);

          this.formatting.enable = this.json.canFormat;
          this.json.diagnostics.set(uri, diagnostics);

        }

        if (this.completion.enable.objects) {
          getObjectCompletions(uri.fsPath, this.completion.items);
        }

        if (this.isDirty) {
          this.isDirty = await dirty(textDocument.document);
        }

        if (this.formatting.ignored.has(uri.fsPath)) {

          this.status.ignore();

        } else {

          if (isFunction(this.formatting.ignoreMatch) && this.formatting.ignoreMatch(uri.fsPath)) {

            this.status.ignore();
            this.formatting.ignored.add(uri.fsPath);
            this.info(`Ignoring: ${uri.fsPath}`);

          } else {

            if (this.isFormattingOnSave(languageId)) {

              if (!this.formatting.register.has(uri.fsPath)) {
                this.formatting.register.add(uri.fsPath);
              }

              this.formatting.enable = true;
              this.status.enable();

            } else {

              this.formatting.enable = false;
              this.status.disable();

            }
          }
        }
      }
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

    if (!this.languages.get(textDocument.languageId)) return;

    if (this.engine === Engine.shopify) {

      const { fsPath } = textDocument.uri;

      if (this.files.locales.fsPath === fsPath) {

        await this.getExternal([ 'locales' ]);

      } else if (this.files.settings.fsPath === fsPath) {

        await this.getExternal([ 'settings' ]);

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
            this.formatting.ignored.clear();
            this.formatting.register.clear();
            this.info('workspace ignore list changed');
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
              this.selector.push({
                language: id,
                scheme: 'file'
              });
            }
          }

          this.info('The vscode-liquid extension will format ' + id);

        } else if (this.languages[id]) {

          this.languages[id] = false;
          this.selector = this.selector.filter(({ language }) => language.startsWith('liquid') || language !== id);
          this.info('vscode-liquid is no longer formatting ' + id);
        }

      }
    };
  }

}
