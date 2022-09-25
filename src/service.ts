import {
  commands,
  ConfigurationChangeEvent,
  ConfigurationTarget,
  languages,
  Range,
  TextDocument,
  TextEdit,
  TextEditor,
  window,
  workspace
} from 'vscode';
import prettify, { Options } from '@liquify/prettify';
import { Config, LanguageIds, Setting } from 'types';
import { CommandPalette } from 'providers/CommandPalette';
// import { StatusLanguageItem } from 'providers/StatusLanguageItem';
import { clone, delay } from 'rambdax';
import * as u from 'utils';

export class VSCodeLiquid extends CommandPalette {

  // private language = new StatusLanguageItem();

  /**
   * Restart Extension
   *
   * Invokes a soft restart of the extension. Clears all
   * persisted states and disposes of subscriptions. From here
   * re-activates extension by calling back to `onActiveEditor`.
   */
  private restart = (
    prettifyRules: Options,
    languages: any,
    subscriptions: { dispose(): void; }[]
  ) => async () => {

    this.info('RESTARTING EXTENSION');
    this.status.loading();

    await delay(2000);

    this.isReady = false;
    this.canFormat = false;
    this.configMethod = Config.Workspace;
    this.configTarget = ConfigurationTarget.Workspace;
    this.ignoreList = [];
    this.ignoreMatch = null;
    this.liquidrcPath = null;
    this.prettifyRules = prettify.options(prettifyRules);
    this.languages = languages;
    this.dispose();
    this.getWatchers(false);

    for (const subscription of subscriptions) subscription.dispose();

    await this.onActiveEditor(subscriptions);

    this.info('EXTENSION RESTARTED');

  };

  /**
   * onActiveEditor
   *
   * The initializer which invoked upon an active text editor.
   * This will run when the activation event `onStartupFinished`
   * has been triggered. It will determine which capabilities
   * and features should be started.
   */
  public async onActiveEditor (subscriptions: { dispose(): void; }[]) {

    const config = this.getWorkspace();

    // Using deprecated settings
    if (u.hasDeprecatedSettings()) {
      this.canFormat = false;
      this.status.error();
    }

    const prettifyRules = clone(prettify.options.rules);
    const languages = clone(this.languages);

    try {

      const pkgjson = await this.getPackage();
      const liquidrc = await this.getLiquidrc();

      this.getLanguages();
      this.getWatchers();
      this.getFormatter();

      if (this.configMethod === Config.Workspace) {
        if (config === Setting.WorkspaceDefined) prettify.options(this.prettifyRules);
        this.info('Using workspace settings for configuration');
      } else if (this.configMethod === Config.Package) {
        if (pkgjson === Setting.PrettifyFieldDefined) prettify.options(this.prettifyRules);
        this.info('Using "prettify" field in package.json file');
      //  this.language.configFile('package.json');
      } else if (this.configMethod === Config.Liquidrc) {
        if (liquidrc === Setting.LiquidrcDefined) prettify.options(this.prettifyRules);
        this.info(`Using .liquidrc file: ${this.liquidrcPath}`);
        //   this.language.configFile('.liquidrc');
      }

    } catch (e) {
      this.catch('failed to initialize extension', e);
    }

    subscriptions.push(
      this.onDidChangeTextEditor(window.activeTextEditor),
      commands.registerCommand('liquid.liquidrcDefaults', this.liquidrcDefaults, this),
      commands.registerCommand('liquid.liquidrcRecommend', this.liquidrcRecommend, this),
      commands.registerCommand('liquid.openOutput', this.output.show, this),
      commands.registerCommand('liquid.enableFormatting', this.enableFormatting, this),
      commands.registerCommand('liquid.disableFormatting', this.disableFormatting, this),
      commands.registerCommand('liquid.restartExtension', this.restart(prettifyRules, languages, subscriptions))
    );

    workspace.onDidChangeConfiguration(
      this.onConfigChange,
      this,
      subscriptions
    );

    workspace.onDidCloseTextDocument(
      this.onDidCloseTextDocument,
      this,
      subscriptions
    );

    window.onDidChangeActiveTextEditor(
      this.onDidChangeTextEditor,
      this,
      subscriptions
    );

    this.isReady = true;

  };

  /**
   * onIgnoreFile
   *
   * Checks whether the opened file should be ignored
   * from formatting.
   */
  private onIgnoreFile (uri: string) {

    if (!u.isFunction(this.ignoreMatch)) return false;

    const path = this.relative(uri);

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

    if (!textDocument) {
      this.dispose();
      this.status.hide();
      return;
    };

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

    this.formatRegister.add(uri.fsPath);

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

    if (this.formatHandler && dispose === false) return this.formatHandler;
    if (dispose) this.dispose();

    this.formatHandler = languages.registerDocumentFormattingEditProvider(
      this.selector.active,
      {
        provideDocumentFormattingEdits: async (document: TextDocument) => {

          if (this.formatIgnore.has(document.uri.fsPath)) return [];

          const range = u.getRange(document);

          return this.onDocumentEdit({
            range,
            input: document.getText(range),
            language: u.getLanguage(document.languageId)
          });

        }
      }
    );

    return this.formatHandler;

  }

  public onConfigChange (config: ConfigurationChangeEvent) {

    if (config.affectsConfiguration('liquid')) {

      this.getSettings();

      if (config.affectsConfiguration('liquid.format')) {

        if (config.affectsConfiguration('liquid.format.ignore')) {
          this.info('workspace ignore list changed');
          this.formatIgnore.clear();
          this.formatRegister.clear();
        }

        if (!this.canFormat) {
          this.dispose();
          this.status.disable();
        } else {
          this.onRegisterProvider(true);
        }
      }

    } else {

      const target = this.getTarget();

      for (const id in this.languages) {

        if (!config.affectsConfiguration(`[${id}]`)) continue;

        if (u.isDefaultFormatter(`[${id}]`, target)) {

          if (!this.languages[id]) {
            this.languages[id] = true;
            if (this.selector.active.some(({ language }) => language !== id)) {
              this.selector.active.push({ language: id, scheme: 'file' });
            }
          }

          this.info('Prettify is now the default formatter of ' + id);

        } else {
          if (this.languages[id]) {
            this.languages[id] = false;
            this.info('Prettify is no longer the default formatter of ' + id);
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
