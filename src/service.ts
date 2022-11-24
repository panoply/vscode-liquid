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
import prettify from '@liquify/prettify';
import { Config, Setting } from 'types';
import { CommandPalette } from 'providers/CommandPalette';
import { CompletionProvider } from 'providers/CompletionProvider';
import * as u from 'utils';

export class VSCodeLiquid extends CommandPalette {

  private completion: CompletionProvider;

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
    this.configMethod = Config.Workspace;
    this.configTarget = ConfigurationTarget.Workspace;
    this.ignoreList = [];
    this.ignoreMatch = null;
    this.liquidrcPath = null;
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

    this.completion = new CompletionProvider('shopify', this.canComplete);

    try {

      const pkgjson = await this.getPackage();
      const liquidrc = await this.getLiquidrc();

      this.getLanguages();
      this.getWatchers();
      this.getFormatter();

      if (this.configMethod === Config.Workspace) {

        if (config === Setting.DeprecatedWorkspaceSettings) {

          this.canFormat = false;
          this.deprecatedConfig = true;

          this.languageError([
            'Deprecated configuration provided in workspace',
            'You are now using v3.0.0 of the Liquid extension. The old settings are no longer',
            'valid. You need to fix and align with the new configuration.'
          ], {
            command: 'liquid.releaseNotes',
            title: 'Release Notes',
            tooltip: 'Opens the release notes for v' + this.version
          });

          this.status.error('Using deprecated settings');

          this.error('Deprecated configuration provided in workspace', [
            'You are now using v3.0.0 of the Liquid extension. The old settings are no longer',
            'valid. You need to fix and align with the new configuration.'
          ]);

        } else if (config === Setting.WorkspaceDefined) {
          prettify.options(this.prettifyRules);
          this.info('Using workspace settings for configuration');
        }

      } else if (this.configMethod === Config.Package) {

        if (pkgjson === Setting.PrettifyFieldDefined) {
          prettify.options(this.prettifyRules);
          this.info('Using "prettify" field in package.json file');
        }

      //  this.language.configFile('package.json');
      } else if (this.configMethod === Config.Liquidrc) {

        if (liquidrc === Setting.DeprecatedLiquidrc) {

          this.canFormat = false;
          this.deprecatedConfig = true;

          this.status.error('Using deprecated settings');

          this.languageError([
            'Deprecated configuration provided in the .liquidrc file.',
            'You are using v3.0.0 of the Liquid extension and the old configuration is no longer',
            'supported.'
          ], {
            command: 'liquid.releaseNotes',
            title: 'Release Notes',
            tooltip: 'Opens the release notes for v' + this.version
          });

          this.error('Deprecated configuration provided in .liquidrc file', [
            'You are now using v3.0.0 of the Liquid extension and the old configuration is no longer',
            'supported. You need to fix and align with the new configuration.'
          ]);

        } else if (liquidrc === Setting.LiquidrcDefined) {
          prettify.options(this.prettifyRules);
          this.info(`Using .liquidrc file: ${this.liquidrcPath}`);
        }
      }

    } catch (e) {
      this.catch('Failed to activate extension.', e);
    }

    subscriptions.push(
      commands.registerCommand('liquid.liquidrcDefaults', this.liquidrcDefaults, this),
      commands.registerCommand('liquid.liquidrcRecommend', this.liquidrcRecommend, this),
      commands.registerCommand('liquid.openOutput', this.output.show, this),
      commands.registerCommand('liquid.formatDocument', this.formatDocument, this),
      commands.registerCommand('liquid.enableFormatting', this.enableFormatting, this),
      commands.registerCommand('liquid.disableFormatting', this.disableFormatting, this),
      commands.registerCommand('liquid.releaseNotes', this.releaseNotes, this),
      commands.registerCommand('liquid.restartExtension', this.restart(subscriptions)),
      languages.registerCompletionItemProvider(
        this.selector.liquid,
        this.completion,
        ...this.completion.triggers
      )
    );

    workspace.onDidChangeConfiguration(
      this.onDidChangeConfiguration,
      this,
      subscriptions
    );

    workspace.onDidCloseTextDocument(
      this.onDidCloseTextDocument,
      this,
      subscriptions
    );

    window.onDidChangeActiveTextEditor(
      this.onDidChangeActiveTextEditor,
      this,
      subscriptions
    );

    if (this.deprecatedConfig === false) {
      this.onDidChangeActiveTextEditor(window.activeTextEditor);
    }

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
  public onDidChangeActiveTextEditor (textDocument: TextEditor | undefined) {

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

    if (this.canFormat && this.formatHandler && dispose === false) return this.formatHandler;
    if (dispose) this.dispose();

    this.formatHandler = languages.registerDocumentFormattingEditProvider(this.selector.active, {
      provideDocumentFormattingEdits: (textDocument: TextDocument) => {

        if (this.canFormat === false) return [];
        if (this.formatIgnore.has(textDocument.uri.fsPath)) return [];

        const findRange = new Range(0, 0, textDocument.lineCount, 0);
        const fullRange = textDocument.validateRange(findRange);
        const language = u.getLanguage(textDocument.languageId);
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
            this.error('Parse error occured when formatting document', e.message);
          }
        }

        return [];

      }
    });

    return this.formatHandler;

  }

  public onDidChangeConfiguration (config: ConfigurationChangeEvent) {

    if (config.affectsConfiguration('liquid')) {

      const settings = this.getSettings();

      if (settings === Setting.DeprecatedWorkspaceSettings) {
        if (this.deprecatedConfig === false) {

          this.canFormat = false;
          this.deprecatedConfig = true;

          this.languageError([
            'Deprecated configuration provided in workspace',
            'You are now using v3.0.0 of the Liquid extension. The old settings are no longer',
            'valid. You need to fix and align with the new configuration.'
          ], {
            command: 'liquid.releaseNotes',
            title: 'Release Notes',
            tooltip: 'Opens the release notes for v' + this.version
          });

          this.status.error('Using deprecated settings');
        }

        return;
      }

      if (settings === Setting.WorkspaceDefined) {
        if (this.deprecatedConfig === true) {
          this.deprecatedConfig = false;
          this.languageDispose();
        }
      }

      this.completion.update(this.canComplete);

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

      if (this.deprecatedConfig) return;

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
