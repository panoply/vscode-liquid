import { window, StatusBarAlignment } from 'vscode';
import { State } from './state';
import { parseStack, getTime, isArray, isUndefined, isString } from './utilities';
import { Status } from './types';

/**
 * Editor
 *
 * Editor specific operations for the editor, typically
 * pertaining to the user interface (ui).
 */
export class Editor extends State {

  /**
   * The status bar item
   */
  public barItem = window.createStatusBarItem(StatusBarAlignment.Right, -2);

  /**
   * The output channel instance
   */
  public outputChannel = window.createOutputChannel('Liquid', 'log-liquid');

  /**
   *  The status bar item functionality
   *
   *  @param type The status bar type
   *  @param show Whether or not to show the status bar item
   *  @memberof Utils
  */
  statusBar (type: Status, show: boolean = true) {

    if (type === Status.Enabled) {

      if (this.isLoading) this.isLoading = false;
      if (this.hasError) this.hasError = false;

      this.barItem.text = '💧 $(check)';
      this.barItem.tooltip = 'Disable Liquid Formatting';
      this.barItem.command = 'liquid.disableFormatter';

    } else if (type === Status.Ignored) {

      if (this.isLoading) this.isLoading = false;
      this.barItem.text = '💧 $(eye-closed)';
      this.barItem.tooltip = 'Ignoring File from Liquid Formatting';
      this.barItem.command = 'liquid.enableFormatting';

    } else if (type === Status.Disabled) {

      if (this.isLoading) this.isLoading = false;
      this.barItem.text = '💧 $(x)';
      this.barItem.tooltip = 'Enable Liquid Formatting';
      this.barItem.command = 'liquid.enableFormatter';

    } else if (type === Status.Error) {

      if (this.isLoading) this.isLoading = false;
      this.hasError = true;
      this.barItem.text = '💧 $(warning)';
      this.barItem.tooltip = 'Errors detected! Toggle output';
      this.barItem.command = 'liquid.toggleOutput';

    } else if (type === Status.Loading) {

      this.isLoading = true;
      this.barItem.text = '💧 $(sync~spin)';
      this.barItem.tooltip = 'Loading Extension';

    } else if (type === Status.Upgrade) {

      if (this.isLoading) this.isLoading = false;
      this.barItem.text = '💧 $(warning)';
      this.barItem.tooltip = 'Using deprecated settings';
      this.barItem.command = 'liquid.upgradeVersion';

    }

    return show ? this.barItem.show() : this.barItem.hide();

  }

  /**
   * Open the output channel
   */
  openOutput () {

    return this.outputChannel.show();

  }

  error (message: string, context?: Error | string[] | string) {

    this.statusBar(Status.Error);

    if (context instanceof Error) {

      const stack = parseStack(context);

      this.outputChannel.appendLine(`\nERROR: ${message}\n`);

      const json = context.message.indexOf(' while parsing near');

      if (json > -1) context.message = context.message.slice(0, json) + ':';

      this.outputChannel.appendLine(context.message);

      for (const line of stack) this.outputChannel.appendLine(line);

    } else if (isUndefined(context)) {

      this.outputChannel.appendLine(`${getTime()} ERROR: ${message}`);

    } else if (isArray(context)) {

      this.outputChannel.appendLine(`ERROR: ${message}\n`);

      (context as string[]).push('');

      for (const line of context as string[]) this.outputChannel.appendLine('  ' + line);

    } else if (isString(context)) {

      this.outputChannel.appendLine(`ERROR: ${message}\n`);
      this.outputChannel.appendLine(context as string + '\n');

    }

  }

  /**
   * Print something to the Liquid output channel.
   */
  logOutput (...params: string[]) {

    const message = params[0];
    const title = params[1] || null;

    this.outputChannel.appendLine(`${getTime()} ${message}`);

    if (title === 'error') {
      this.hasError = true;
      this.statusBar(Status.Error, true);
      this.openOutput();
    }

  }

}
