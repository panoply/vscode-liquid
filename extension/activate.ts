import { ConfigMethod } from './types';
import { Events } from './events';
import { languages, workspace, commands, ConfigurationTarget, ExtensionContext, window } from 'vscode';
import esthetic from 'esthetic';

class VSCodeLiquid extends Events {

  /**
   * Activate Extension
   *
   * Initialize the vscode-liquid extension
   */
  async activate (subscriptions: { dispose(): void; }[]) {

    try {

      await this.getSettings();
      await this.setFeatures();

      this.getWatchers();
      this.getFormatter();
      this.workspace(subscriptions);
      this.register(subscriptions);
      this.commands(subscriptions);
      this.listeners(subscriptions);
      this.windows(subscriptions);

      if (this.config.method === ConfigMethod.Workspace) {

        esthetic.settings({ logColors: false }).rules(this.formatting.rules);

        this.nl();
        this.info('workspace settings used for configuration');

      } else if (this.config.method === ConfigMethod.Liquidrc) {

        esthetic.settings({ logColors: false }).rules(this.formatting.rules);

        this.nl();
        this.info(`.liquidrc file used for settings: ${this.uri.liquidrc.path}`);

      }

      // console.log(subscriptions);

      await this.onDidChangeActiveTextEditor(window.activeTextEditor);

      if (!this.hasActivated) this.hasActivated = true;

    } catch (e) {

      this.status.error('Extension could not be initialized');

      this.catch('Extension could not be initialized', e);

    }

  }

  /**
   * Restart Extension
   *
   * Restart the extension, re-activation applied by calling back to `activate`.
   */
  private restart = (subscriptions: { dispose(): void; }[]) => async () => {

    await this.status.loading('Restarting extension...');

    this.info('RESTARTING EXTENSION');

    this.isReady = false;
    this.canFormat = false;
    this.config.method = ConfigMethod.Workspace;
    this.config.target = ConfigurationTarget.Workspace;
    this.uri.liquidrc = null;
    this.formatting.reset();
    this.getWatchers(false);

    for (const subscription of subscriptions) subscription.dispose();

    await this.activate(subscriptions);

    this.info('EXTENSION RESTARTED');

  };

  private listeners (subscriptions: { dispose(): void; }[]) {

    this.formatting.listen.event(this.onFormattingEvent, this, subscriptions);

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
   * Workspace Events
   *
   * Subscribe all workspace related events of the client.
   */
  private workspace (subscriptions: { dispose(): void; }[]) {

    workspace.onDidRenameFiles(this.onDidRenameFiles, this, subscriptions);
    workspace.onDidDeleteFiles(this.onDidDeleteFiles, this, subscriptions);
    workspace.onDidCreateFiles(this.onDidCreateFiles, this, subscriptions);
    workspace.onDidChangeConfiguration(this.onDidChangeConfiguration, this, subscriptions);
    workspace.onDidCloseTextDocument(this.onDidCloseTextDocument, this, subscriptions);
    workspace.onDidChangeTextDocument(this.onDidChangeTextDocument, this, subscriptions);
    workspace.onDidSaveTextDocument(this.onDidSaveTextDocument, this, subscriptions);

  }

  /**
   * Language Events
   *
   * Subscribe all language related events of the client.
   */
  private register (subscriptions: { dispose(): void; }[]) {

    subscriptions.push(
      languages.registerDocumentLinkProvider(this.selector, this.links),
      languages.registerHoverProvider(this.selector, this.hovers),
      languages.registerCompletionItemProvider(this.selector, this.completion, ...this.completion.triggers),
      languages.registerDocumentFormattingEditProvider(this.selector, this.formatting)
    );

  }

  /**
   * Command Events
   *
   * Subscribe all command related events of the client.
   */
  private commands (subscriptions: { dispose(): void; }[]) {

    subscriptions.push(
      commands.registerCommand('liquid.generateLiquidrc', this.generateLiquidrc, this),
      commands.registerCommand('liquid.openOutput', this.toggleOutput, this),
      commands.registerCommand('liquid.formatDocument', this.formatDocument, this),
      commands.registerCommand('liquid.enableFormatting', this.enableFormatting, this),
      commands.registerCommand('liquid.disableFormatting', this.disableFormatting, this),
      commands.registerCommand('liquid.releaseNotes', this.releaseNotes, this),
      commands.registerCommand('liquid.restartExtension', this.restart(subscriptions))
    );

  }

}

/**
 * vscode-liquid
 *
 * Language features for working with the Liquid Template Language.
 */
export async function activate ({ subscriptions, extension }: ExtensionContext) {

  const liquid = new VSCodeLiquid(extension);

  await liquid.activate(subscriptions);

};
