import { commands, ConfigurationChangeEvent, Disposable, languages, LanguageStatusSeverity, Range, TextDocument, TextDocumentChangeEvent, TextEdit, TextEditor, window, workspace } from 'vscode';
import prettify from '@liquify/prettify';
import { has } from 'rambdax';
import { Config, LanguageIds, Setting } from './types';
import { CommandPalette } from 'providers/CommandPalette';
import * as u from './utils';
import { StatusLanguageItem } from 'providers/StatusLanguageItem';

export class VSCodeLiquid extends CommandPalette {

  /**
   * Returns the current document provider disposable
   */
  private formatHandler: Disposable = null;

  /**
   * Returns the current document provider disposable
   */
  private formatIgnore: Set<string> = new Set();

  /**
   * Returns the current document provider disposable
   */
  private formatRegister: Set<string> = new Set();

  private language = new StatusLanguageItem();

  private dispose () {
    if (this.formatHandler) {
      this.formatHandler.dispose();
    } this.formatHandler = undefined;
  }

  /**
   * onActiveEditor
   *
   * The initializer which invoked upon an active text editor.
   * This will run when the activation event `onStartupFinished`
   * has been triggered. It will determine which capabilities
   * and features should be started.
   */
  public async onActiveEditor (subscriptions: { dispose(): void; }[]) {

    if (this.isReady) return null;

    // Using deprecated settings
    if (u.hasDeprecatedSettings()) {
      this.canFormat = false;
      this.status.error();
    }

    try {

      const config = this.getWorkspace();
      const pkgjson = await this.getPackage();
      const liquidrc = await this.getLiquidrc();

      this.getLanguages();
      this.getWatchers();
      this.getFormatter();

      if (this.configMethod === Config.Workspace) {
        if (config === Setting.WorkspaceDefined) prettify.options(this.prettifyRules);
        this.info('using workspace settings');
      } else if (this.configMethod === Config.Package) {
        if (pkgjson === Setting.PrettifyFieldDefined) prettify.options(this.prettifyRules);
        this.info('using prettify field in package.json file');
        this.language.status('package.json');
      } else if (this.configMethod === Config.Liquidrc) {
        if (liquidrc === Setting.LiquidrcDefined) prettify.options(this.prettifyRules);
        this.info(`using .liquidrc file: ${this.getRelative(this.liquidrcPath)}`);
        this.language.status('.liquidrc');
      }

      this.onDidChangeTextEditor(window.activeTextEditor);

      subscriptions.push(
        //  commands.registerCommand('liquid.liquidrcDefaults', this.liquidrcDefaults, this),
        //  commands.registerCommand('liquid.liquidrcRecommended', this.liquidrcRecommended, this),
        commands.registerCommand('liquid.openOutput', this.output.show, this),
        commands.registerCommand('liquid.enableFormatting', this.enableFormatting, this),
        commands.registerCommand('liquid.disableFormatting', this.disableFormatting, this)

      );

      workspace.onDidChangeConfiguration(this.onConfigChange, this, subscriptions);
      workspace.onDidCloseTextDocument(this.onDidCloseTextDocument, this, subscriptions);

      // workspace.onDidOpenTextDocument(this.onDidChangeTextEditor, this, subscriptions);
      window.onDidChangeActiveTextEditor(this.onDidChangeTextEditor, this, subscriptions);
      // workspace.onDidChangeConfiguration(this.onConfigChange, this, subscriptions);

      this.isReady = true;

    } catch (e) {
      this.catch('failed to initialize extension', e);
    }

  };

  /**
   * onIgnoreFile
   *
   * Checks whether the opened file should be ignored
   * from formatting.
   */
  private onIgnoreFile (uri: string) {

    if (!u.isFunction(this.ignoreMatch)) return false;

    const path = this.getRelative(uri);

    if (this.ignoreMatch(path)) {
      this.info(`Ignoring: ${path}`);
      this.status.ignore();
      return true;
    }

    return false;

  }

  private async onDocumentEdit (edits: {
    range: Range;
    input: string;
    language: LanguageIds;
  }): Promise<TextEdit[]> {

    try {

      const output = await prettify.format(edits.input, { language: edits.language });

      if (this.hasError) {
        this.hasError = false;
        this.errorCache = null;
        this.status.enable();
      }

      return [ TextEdit.replace(edits.range, output) ];

    } catch (e) {
      if (this.hasError === false || this.errorCache !== e) {
        this.errorCache = e;
        this.hasError = true;
        this.error('Parse error occured when formatting document', e);
      }
    }

    return [];

  };

  public onDidCloseTextDocument ({ uri }: TextDocument) {

    if (this.formatRegister.has(uri.fsPath)) {
      this.formatRegister.delete(uri.fsPath);
    }

  }

  /**
   * onDidChanceTextEditor
   *
   * Invoked when the text document is opened.
   */
  public onDidChangeTextEditor (textDocument: TextEditor | undefined) {

    if (!textDocument) return;

    const { uri, languageId } = textDocument.document;

    if (this.formatIgnore.has(uri.fsPath)) return;
    if (this.formatRegister.has(uri.fsPath)) return this.formatHandler;

    if (this.onIgnoreFile(uri.fsPath)) {
      this.formatIgnore.add(uri.fsPath);
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

    console.log(this);

    this.formatRegister.add(uri.fsPath);

    return this.onRegisterProvider();

  }

  /**
   * onRegisterProvider
   *
   * Invoked when the text document is opened.
   */
  public onRegisterProvider (dispose = false) {

    if (this.formatHandler && dispose === false) return this.formatHandler;
    if (dispose) this.dispose();

    this.formatHandler = languages.registerDocumentFormattingEditProvider(this.selector, {
      provideDocumentFormattingEdits: async (document: TextDocument) => {

        if (this.formatIgnore.has(document.uri.fsPath)) return [];

        const range = u.getRange(document);

        return this.onDocumentEdit({
          range,
          input: document.getText(range),
          language: u.getLanguage(document.languageId)
        });

      }
    });

    return this.formatHandler;
  }

  public onConfigChange (config: ConfigurationChangeEvent) {

    if (config.affectsConfiguration('liquid')) {

      this.hasError = false;
      this.getSettings();

      if (config.affectsConfiguration('liquid.format')) {
        if (!this.canFormat) {
          this.dispose();
          this.status.disable();
        }
      }

    } else {

      for (const id in this.languages) {

        if (!config.affectsConfiguration(`[${id}]`)) continue;

        const target = this.getTarget();

        if (u.isDefaultFormatter(`[${id}]`, target)) {

          if (!this.languages[id]) {
            this.languages[id] = true;
            if (this.selector.some(({ language }) => language !== id)) {
              this.selector.push({ language: id, scheme: 'file' });
            }
          }

          this.info('Prettify is now the default formatter of ' + id);

        } else {
          if (this.languages[id]) {
            this.languages[id] = false;
            this.info('Prettify is no longer the default formatter of ' + id);
            this.selector = this.selector.filter(({ language }) => {
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
