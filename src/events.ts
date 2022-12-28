import parseJson from 'parse-json';
import { CommandPalette } from './workspace/CommandPalette';
import { ConfigurationChangeEvent, TextDocument, TextDocumentChangeEvent, TextEditor } from 'vscode';
import { ConfigMethod } from './types';
import { FormatEvent, FormatEventType } from 'providers/FormattingProvider';
import { getSchema } from 'lexical/parse';
import { Engine } from '@liquify/liquid-language-specs';
import { dirty, isFunction } from 'utils';
import { FormatStatus } from 'workspace/StatusBarItem';

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

  public onFormattingEvent (data: FormatEvent) {

    if (data === FormatEventType.EnableStatus) {
      this.status.enable();
    } else if (data.type === FormatEventType.ThrowError) {
      this.error(data.message)(data.detail);
    }

  }

  public onDidCloseTextDocument ({ uri }: TextDocument) {

    if (this.formatting.register.has(uri.fsPath)) {

      this.formatting.register.delete(uri.fsPath);

    }

  }

  /**
   * onDidChangeTextDocument
   *
   * Invoked when a text document has changed. We only care about schema
   * in the event (for now). In Liquify we use LSP so this is just a hot
   * patch for us the reason with diagnostics.
   */
  public async onDidChangeTextDocument ({ document }: TextDocumentChangeEvent) {

    if (this.engine === Engine.shopify && this.json.config.validate === true) {

      const schema = getSchema(document);

      if (schema !== false) {

        const diagnostics = await this.json.doValidation(document.uri, schema);

        this.formatting.enable = this.json.canFormat;
        this.json.diagnostics.set(document.uri, diagnostics as any);

        if (!this.formatting.enable) {

          try {

            parseJson(schema.content);

            if (this.hasError) {
              this.hasError = false;
              this.errorCache = null;
              this.status.enable();
            }

          } catch (e) {

            if (this.hasError === false || this.errorCache !== e) {
              this.errorCache = e.message;
              this.hasError = true;
              this.error('Parse error occured when formatting document')(e.message);
            }
          }

        }

      } else if (this.json.diagnostics.has(document.uri)) {
        this.json.canFormat = true;
        this.json.diagnostics.clear();
      }

    }

  }

  /**
   * onDidChangeActiveTextEditor
   *
   * Invoked when a text document is opened or a document
   * has changed (ie: new tab or file).
   */
  async onDidChangeActiveTextEditor (textDocument: TextEditor | undefined) {

    if (this.isDirty) {
      this.isDirty = await dirty(textDocument.document);
    }

    if (!textDocument) {
      this.json.diagnostics.clear();
      this.json.canFormat = true;
      return;
    };

    const { uri, languageId } = textDocument.document;

    this.status.show();

    if (this.formatting.register.has(uri.fsPath)) return;
    if (this.formatting.ignored.has(uri.fsPath)) return;

    if (isFunction(this.formatting.ignoreMatch) && this.formatting.ignoreMatch(uri.fsPath)) {
      this.info(`Ignoring: ${uri.fsPath}`);
      this.formatting.ignored.add(uri.fsPath);
      return this.status.ignore();
    }

    if (this.formatting.enable) {
      if (this.languages[languageId]) {
        this.formatting.enable = true;
        if (this.status.state !== FormatStatus.Enabled) this.status.enable();
      } else {
        this.formatting.enable = false;
        return this.status.hide();
      }
    }

    if (this.formatting.enable) {
      if (this.status.state !== FormatStatus.Enabled) this.status.enable();
    } else {
      if (this.status.state !== FormatStatus.Disabled) this.status.disable();
    }

    this.formatting.register.add(uri.fsPath);

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
            if (this.selector.active.some(({ language }) => language !== id)) {
              this.selector.active.push({ language: id, scheme: 'file' });
            }
          }

          this.info('The vscode-liquid extension will format ' + id);

        } else {
          if (this.languages[id]) {
            this.languages[id] = false;
            this.info('vscode-liquid is no longer formatting ' + id);
            this.selector.active = this.selector.active.filter(({ language }) => {
              if (language.startsWith('liquid')) return true;
              return language !== id;
            });
          }
        }
      }

    };
  }

}
