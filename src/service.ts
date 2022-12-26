import {
  commands,
  ConfigurationChangeEvent,
  ConfigurationTarget,
  env,
  languages,
  Range,
  TextDocument,
  TextDocumentChangeEvent,
  TextEdit,
  TextEditor,
  window,
  workspace
} from 'vscode';
import { join } from 'node:path';
import prettify from '@liquify/prettify';
import { ConfigMethod } from 'types';
// import { HoverProvider } from 'providers/HoverProvider';
import * as u from 'utils';
import { getSchema } from 'parse/tokens';
import parseJson from 'parse-json';
import { CommandPalette } from 'providers/CommandPalette';

/**
 * VSCode Liquid Service
 *
 * This class is responsible for controlling the extension.
 * It's from the generated instance all extension features will operate.
 */
export class VSCodeLiquid extends CommandPalette {

  /**
   * Restart Extension
   *
   * Invokes a soft restart of the extension. Clears all
   * persisted states and disposes of subscriptions. From here
   * re-activates extension by calling back to `onActiveEditor`.
   */
  private restart = (subscriptions: { dispose(): void; }[]) => async () => {

    await this.status.loading('Restarting extension...');

    this.info('RESTARTING EXTENSION');

    this.isReady = false;
    this.canFormat = false;
    this.config.method = ConfigMethod.Workspace;
    this.config.target = ConfigurationTarget.Workspace;
    this.format.ignoreList = [];
    this.format.ignoreMatch = null;
    this.uri.liquidrc = null;
    this.dispose();
    this.getWatchers(false);

    for (const subscription of subscriptions) subscription.dispose();

    await this.onActiveEditor(subscriptions);

    this.info('EXTENSION RESTARTED');

  };

  get textDocument () {

    return window.activeTextEditor;

  }

  /**
   * onActivate
   *
   * This function will quickly check configuration defined and
   * present a configuration option to the user. When they autofix
   * their configuration will be updated to the latest structure.
   */
  public async onActivate (subscriptions: { dispose(): void; }[]) {

    if (subscriptions.length > 0) subscriptions.forEach(subscribed => subscribed.dispose());

    const deprecated = await this.getDeprecations();

    if (deprecated.config !== null || deprecated.rcfile !== null) {

      const action = await this.errorMessage([
        'Autofix',
        'Release Notes'
      ], [
        'You are now using v3.4.0 of the vscode-liquid extension.',
        'This version has breaking changes. Pressing Autofix will',
        'update your existing configurations.'
      ]);

      if (action === 'AUTOFIX') {

        return this.onActiveEditor(subscriptions);

      } else {

        if (action === 'RELEASE_NOTES') {

          await env.openExternal(this.meta.releaseNotes);

        }

        subscriptions.push(commands.registerCommand('liquid.deprecations', () => this.onActivate(subscriptions)));

        this.error('Deprecated Settings')(
          'The workspace and .liquidrc settings as of verson 3.4.0 use new and refined structure.',
          'The old structure is now considered invalid and in order to continue using the',
          'extension, you need to align and update your configuration. This can be done automatically',
          'by choosing the "Autofix" option in the popup dialog. You can also manually fix this (see below):',
          '',
          'Upgrade Instructions:',
          'https://gist.github.com/panoply/c371a90df35171f341b6cc5d7dccc312',
          '',
          'Release Notes:',
          this.meta.releaseNotes.fsPath
        );

        this.status.error('Deprecated Settings', 'liquid.deprecations');

      }

    } else {

      return this.onActiveEditor(subscriptions);

    }

  };

  public async onActiveEditor (subscriptions: { dispose(): void; }[]) {

    try {

      await this.getWorkspace({ fixDeprecated: true });

      this.setService();
      this.setHovers();
      this.setCompletions();
      this.getLanguages();
      this.addWatchers();
      this.getWatchers();
      this.getFormatter();

      if (this.config.method === ConfigMethod.Workspace) {
        if (this.deprecation.workspace === null) {

          prettify.options(this.format.rules);

          this.info('Using workspace settings for configuration');

          if (window.activeTextEditor) {

            if (this.isFormattingOnSave(window.activeTextEditor.document.languageId)) {
              this.canFormat = true;
            } else {
              this.status.disable();
            }

          }
        }
      } else if (this.config.method === ConfigMethod.Liquidrc) {

        if (this.deprecation.liquidrc === null) {

          prettify.options(this.format.rules);

          this.info(`Using .liquidrc file: ${this.uri.liquidrc.path}`);

          if (window.activeTextEditor) {
            if (this.isFormattingOnSave(window.activeTextEditor.document.languageId)) {
              this.canFormat = true;
            } else {
              this.status.disable();
            }
          }

        }
      }

    } catch (e) {

      this.catch('Failed to activate extension.', e);

    }

    this.commands(subscriptions);
    this.language(subscriptions);
    this.workspace(subscriptions);
    this.windows(subscriptions);

    if (this.deprecation.liquidrc === null && this.deprecation.workspace === null) {

      if (window.activeTextEditor) {
        this.onDidChangeActiveTextEditor(window.activeTextEditor);
      }

      this.isReady = true;

    } else {

      this.status.error('Deprecated Settings');

      this.error('Deprecated settings defined')(
        'You are using deprecated settings that are now considered invalid',
        'You will need to update and align to use the latest version.'
      );

    }

  }

  /**
   * Window Events
   *
   * Subscribe all window related events of the client.
   */
  private windows (subscriptions: { dispose(): void; }[]) {

    window.onDidChangeActiveTextEditor(this.onDidChangeActiveTextEditor, this, subscriptions);

  }

  /**
   * Command Events
   *
   * Subscribe all command related events of the client.
   */
  private commands (subscriptions: { dispose(): void; }[]) {

    subscriptions.push(
      commands.registerCommand('liquid.liquidrcDefaults', this.liquidrcDefaults, this),
      commands.registerCommand('liquid.liquidrcRecommend', this.liquidrcRecommend, this),
      commands.registerCommand('liquid.openOutput', this.output.show, this),
      commands.registerCommand('liquid.formatDocument', this.formatDocument, this),
      commands.registerCommand('liquid.enableFormatting', this.enableFormatting, this),
      commands.registerCommand('liquid.disableFormatting', this.disableFormatting, this),
      commands.registerCommand('liquid.releaseNotes', this.releaseNotes, this),
      commands.registerCommand('liquid.restartExtension', this.restart(subscriptions))
    );

  }

  /**
   * Language Events
   *
   * Subscribe all language related events of the client.
   */
  private language (subscriptions: { dispose(): void; }[]) {

    subscriptions.push(
      languages.registerHoverProvider(this.selector.liquid, this.hovers),
      languages.registerCompletionItemProvider(this.selector.liquid, this.completions, ...this.triggers)
    );

  }

  /**
   * Workspace Events
   *
   * Subscribe all workspace related events of the client.
   */
  private workspace (subscriptions: { dispose(): void; }[]) {

    workspace.onDidChangeConfiguration(this.onDidChangeConfiguration, this, subscriptions);
    workspace.onDidCloseTextDocument(this.onDidCloseTextDocument, this, subscriptions);
    workspace.onDidChangeTextDocument(this.onDidChangeTextDocument, this, subscriptions);

  }

  /**
   * onIgnoreFile
   *
   * Checks whether the opened file should be ignored
   * from formatting.
   */
  private onIgnoreFile (uri: string) {

    if (!u.isFunction(this.format.ignoreMatch)) return false;

    const path = join(this.uri.root.fsPath, uri);

    if (this.format.ignoreMatch(path)) {
      this.info(`Ignoring: ${path}`);
      this.status.ignore();
      return true;
    }

    return false;

  }

  public onDidCloseTextDocument ({ uri }: TextDocument) {

    if (this.format.register.has(uri.fsPath)) {
      this.format.register.delete(uri.fsPath);
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

    if (this.engine === 'shopify' && this.canValidate.schema === true && document.languageId === 'liquid') {

      const schema = getSchema(document);

      if (schema !== false) {

        const diagnostics = await this.jsonService.doValidation(document.uri, schema);

        this.canFormat = this.jsonService.canFormat;
        this.jsonService.diagnostics.set(document.uri, diagnostics as any);

        if (!this.canFormat) {
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

      } else if (this.jsonService.diagnostics.has(document.uri)) {
        this.jsonService.canFormat = true;
        this.jsonService.diagnostics.clear();
      }

    }

  }

  /**
   * onDidChangeActiveTextEditor
   *
   * Invoked when a text document is opened or a document
   * has changed (ie: new tab or file).
   */
  public onDidChangeActiveTextEditor (textDocument: TextEditor | undefined) {

    if (!textDocument) {
      this.dispose();
      this.status.hide();
      this.jsonService.diagnostics.clear();
      this.jsonService.canFormat = true;
      return;
    };

    const { uri, languageId } = textDocument.document;

    if (this.format.ignored.has(uri.fsPath)) return;
    if (this.format.register.has(uri.fsPath)) return this.format.handler;

    if (this.onIgnoreFile(uri.fsPath)) {
      this.format.ignored.add(uri.fsPath);
      return;
    }

    if (this.languages[languageId]) {
      if (this.canFormat) {
        this.status.enable();
      } else if (this.canFormat === null) {
        this.canFormat = true;
      }
    } else {
      this.status.hide();
      return;
    }

    if (this.canFormat) {
      this.status.enable();
    } else {
      this.status.disable();
    }

    this.format.register.add(uri.fsPath);

    return this.onRegisterProvider();

  }

  /**
   * onRegisterProvider
   *
   * Invoked when the text document is opened. Accepts a `boolean`
   * disposal parameter. When `true` the `formatHandler` will be disposed
   * before being re-registered.
   *
   * @param dispose
   */
  public onRegisterProvider (dispose = false) {

    if (this.canFormat && this.format.handler && dispose === false) return this.format.handler;

    if (dispose) this.dispose();

    this.format.handler = languages.registerDocumentFormattingEditProvider(this.selector.active, {

      provideDocumentFormattingEdits: (textDocument: TextDocument) => {

        if (this.canFormat === false) return [];

        if (this.format.ignored.has(textDocument.uri.fsPath)) return [];

        const findRange = new Range(0, 0, textDocument.lineCount, 0);
        const fullRange = textDocument.validateRange(findRange);
        const language = u.getLanguage(textDocument.languageId);

        if (language === undefined) return [];

        const source = textDocument.getText();

        try {

          const output = prettify.formatSync(source, { language });

          if (this.hasError) {
            this.hasError = false;
            this.errorCache = null;
            this.status.enable();
          }

          return [ TextEdit.replace(fullRange, output) ];

        } catch (e) {

          if (this.hasError === false || this.errorCache !== e) {
            this.errorCache = e.message;
            this.hasError = true;
            this.error('Parse error occured when formatting document')(e.message);
          }
        }

        return [];

      }
    });

    return this.format.handler;

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

      await this.getWorkspace();

      if (this.config.method === ConfigMethod.Workspace) {
        if (config.affectsConfiguration('liquid.format')) {
          if (config.affectsConfiguration('liquid.format.ignore')) {
            this.info('workspace ignore list changed');
            this.format.ignored.clear();
            this.format.register.clear();
          }
        }
      }

      this.onRegisterProvider(true);

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

      this.onRegisterProvider(true);

    };
  }

}
