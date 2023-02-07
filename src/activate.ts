import { ConfigMethod } from 'types';
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
      await this.getContext();

      this.getWatchers();
      this.getFormatter();
      this.workspace(subscriptions);
      this.register(subscriptions);
      this.commands(subscriptions);
      this.listeners(subscriptions);
      this.windows(subscriptions);

      if (this.config.method === ConfigMethod.Workspace) {

        esthetic.rules(this.formatting.rules);

        this.info('Using workspace settings for configuration');

      } else if (this.config.method === ConfigMethod.Liquidrc) {

        esthetic.rules(this.formatting.rules);

        this.info(`Using .liquidrc file: ${this.uri.liquidrc.path}`);

      }

    } catch (e) {

      this.status.error('Extension failed to activate');

      this.catch('Failed to activate extension.', e);

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
    this.dispose();
    this.formatting.reset();
    this.getWatchers(false);

    for (const subscription of subscriptions) {
      subscription.dispose();
    }

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

    workspace.onDidChangeConfiguration(this.onDidChangeConfiguration, this, subscriptions);
    workspace.onDidCloseTextDocument(this.onDidCloseTextDocument, this, subscriptions);
    workspace.onDidChangeTextDocument(this.onDidChangeTextDocument, this, subscriptions);

  }

  /**
   * Language Events
   *
   * Subscribe all language related events of the client.
   */
  private register (subscriptions: { dispose(): void; }[]) {

    subscriptions.push(
      languages.registerHoverProvider(this.selector, this.hovers),
      languages.registerCompletionItemProvider(this.selector, this.completion, ...this.completion.triggers),
      languages.registerDocumentLinkProvider(this.selector, this.links),
      languages.registerDocumentFormattingEditProvider(this.selector, this.formatting)
      // languages.registerCodeLensProvider(this.selector, this.codelens)
    );

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

  return liquid.activate(subscriptions);

};
