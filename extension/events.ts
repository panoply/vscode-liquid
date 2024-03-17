import {
  ConfigurationChangeEvent,
  FileCreateEvent,
  FileDeleteEvent,
  FileRenameEvent,
  TextDocument,
  TextDocumentChangeEvent,
  TextEditor
} from 'vscode';
import { ConfigMethod } from 'types';
import { FormatEvent, FormatEventType } from 'providers/FormattingProvider';
import { $, Engine, liquid } from '@liquify/specs';
import { dirty, isFunction, isObject, setEndRange } from 'utils';
import { CommandPalette } from 'workspace/CommandPalette';
import { parseSchema, parseDocument, parseFrontmatter } from 'parse/document';
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

    if (!this.isActive) return;

    if (data === FormatEventType.EnableStatus) {

      this.status.enable();

    } else if (data.type === FormatEventType.ThrowError) {

      this.error(data.message)(data.detail);

    }

  }

  /**
   * onDidDeleteFiles
   *
   * Invoked when file/s are deleted within the workspace
   */
  public async onDidRenameFiles ({ files }: FileRenameEvent) {

    if (!this.isActive) return;

    for (const { oldUri, newUri } of files) {

      const oldFile = oldUri.fsPath.endsWith('.schema');
      const newFile = newUri.fsPath.endsWith('.schema');

      if (oldFile && newFile) {
        await this.getSharedSchema(oldUri, { rename: true });
        await this.getSharedSchema(newUri);
      } else if (oldFile === true && newFile === false) {
        await this.getSharedSchema(oldUri, { remove: true });
      } else if (newFile === true && oldFile === false) {
        await this.getSharedSchema(newUri);
      } else if (newUri.fsPath.endsWith('.liquid')) {
        if (this.engine === 'shopify') {
          await this.getFileCompletions([ 'snippets', 'sections' ]);
          this.resetFeatures();
        }
      }

    }

  }

  /**
   * onDidDeleteFiles
   *
   * Invoked when file/s are created within the workspace
   */
  public async onDidCreateFiles ({ files }: FileCreateEvent) {

    if (!this.isActive) return;

    for (const uri of files) {
      if (uri.fsPath.endsWith('.schema')) {
        await this.getSharedSchema(uri);
      } else if (uri.fsPath.endsWith('.liquid')) {
        if (this.engine === 'shopify') {
          await this.getFileCompletions([ 'snippets', 'sections' ]);
          this.resetFeatures();
        } else if (this.engine === '11ty') {
          await this.getFileCompletions([ 'includes' ]);
          this.resetFeatures();
        }
      }
    }

  }

  /**
   * onDidDeleteFiles
   *
   * Invoked when file/s are deleted within the workspace
   */
  public async onDidDeleteFiles ({ files }: FileDeleteEvent) {

    if (!this.isActive) return;

    for (const uri of files) {
      if (uri.fsPath.endsWith('.schema')) {
        await this.getSharedSchema(uri, { remove: true });
      } else if (uri.fsPath.endsWith('.liquid')) {
        if (this.engine === 'shopify') {
          await this.getFileCompletions([ 'snippets', 'sections' ]);
          this.resetFeatures();
        } else if (this.engine === '11ty') {
          await this.getFileCompletions([ 'includes' ]);
          this.resetFeatures();
        }
      }
    }

  }

  /**
   * onDidCloseTextDocument
   *
   * Invoked when an opened document is closed.
   */
  public onDidCloseTextDocument ({ uri }: TextDocument) {

    if (!this.isActive) return;

    if (this.formatting.register.has(uri.fsPath)) {
      this.formatting.register.delete(uri.fsPath);
    }

  }

  /**
   * onDidChangeTextDocument
   *
   * Invoked when a text document has changed. We only care about schema
   * in the event (for now). In Liquify we use LSP so this is just a hot
   * patch for the time being.
   *
   */
  public async onDidChangeTextDocument ({ document, contentChanges }: TextDocumentChangeEvent) {

    if (!this.isActive) return null;
    if (!this.languages.has(document.languageId)) return null;

    if (document.fileName.endsWith('.schema')) {
      await this.getSharedSchema(document.uri);
    } else if (!this.languages.get(document.languageId)) {
      return null;
    }

    const change = contentChanges[contentChanges.length - 1];

    if (isObject(change?.range)) {

      let content = document.getText(setEndRange(document, change.range.end));

      if (this.completion.enable.frontmatter) {

        const fm = this.completion.frontmatter;

        if (fm.offset > 0 && document.offsetAt(change.range.end) < fm.offset) {

          liquid.purge($.liquid.engine, { objects: this.completion.frontmatter.keys });

          this.completion.frontmatter = parseFrontmatter(content);

          if (this.completion.frontmatter.offset > 0) {
            content = content.slice(this.completion.frontmatter.offset + 3);
          }

        }
      }

      if (this.completion.enable.variables) {
        parseDocument(content, this.completion.vars);
      }

      if (this.completion.enable.objects && (this.engine === 'shopify' || this.engine === '11ty')) {
        getObjectCompletions(document.uri.fsPath, this.completion.items);
      }
    }

    if (this.engine === 'shopify' && this.completion.enable.schema && this.json.config.validate) {

      const schema = await parseSchema(document);

      if (schema !== false) {

        this.json.sections.set(document.uri.fsPath, schema);

        const diagnostics = await this.json.doValidation(document.uri);

        this.formatting.enable = this.json.canFormat;
        this.json.diagnostics.set(document.uri, diagnostics as any);

      } else {

        if (this.json.diagnostics.has(document.uri)) {
          this.json.canFormat = true;
          this.json.diagnostics.clear();
        }

        if (this.json.sections.has(document.uri.fsPath)) {
          this.json.sections.delete(document.uri.fsPath);
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

    if (!this.isActive) return;

    if (!textDocument?.document) {

      this.json.diagnostics.clear();
      this.status.hide();

    } else {

      const { uri, languageId } = textDocument.document;

      if (uri.fsPath.endsWith('.schema')) {
        await this.getSharedSchema(uri);
      }

      if (!this.languages.get(languageId)) {

        this.json.diagnostics.clear();
        this.json.canFormat = true;
        this.status.hide();

      } else {

        this.status.show();

        if (this.completion.enable.frontmatter && this.engine === '11ty') {

          if (this.completion.frontmatter.offset > 0) {
            liquid.purge($.liquid.engine, { objects: this.completion.frontmatter.keys });
          }

          this.completion.frontmatter = parseFrontmatter(textDocument.document.getText());

        }

        const schema = await parseSchema(textDocument.document);

        if (schema !== false) {

          this.json.sections.set(uri.fsPath, schema);

          const diagnostics = await this.json.doValidation(uri);

          this.formatting.enable = this.json.canFormat;
          this.json.diagnostics.set(uri, diagnostics as any);

        }

        if (this.completion.enable.objects && (this.engine === 'shopify' || this.engine === '11ty')) {
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
  public async onDidSaveTextDocument ({ uri }: TextDocument) {

    if (!this.isActive) return;

    if (isFunction(this.formatting.ignoreMatch) && this.formatting.ignoreMatch(uri.fsPath)) {
      this.status.ignore();
      this.formatting.ignored.add(uri.fsPath);
      this.info(`Ignoring: ${uri.fsPath}`);
    }

    if (this.engine === Engine.shopify) {

      if (this.files.locales?.fsPath === uri.fsPath) {

        await this.getLocaleFile();

        this.info(`updated: ${uri.fsPath}`);

      } else if (this.files.settings?.fsPath === uri.fsPath) {

        await this.getSettingsFile();

        this.info(`updated: ${uri.fsPath}`);

      } else if (uri.fsPath.endsWith('.schema')) {

        await this.getSharedSchema(uri);

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

      this.resetFeatures();

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
