/* eslint-disable no-unused-vars */

import { window, StatusBarAlignment } from 'vscode';
import { State } from './state';
import { getTime, Status } from './utilities';

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
  barItem = window.createStatusBarItem(StatusBarAlignment.Right, -2);

  /**
   * The output channel instance
   */
  outputChannel = window.createOutputChannel('Liquid');

  /**
   *  The status bar item functionality
   *
   *  @param type The status bar type
   *  @param show Whether or not to show the status bar item
   *  @memberof Utils
  */
  statusBar (type: Status, show?: boolean) {

    if (type === Status.Enabled) {

      this.barItem.text = '💧 $(check)';
      this.barItem.tooltip = 'Disable Liquid Formatting';
      this.barItem.command = 'liquid.disableFormatter';

    } else if (type === Status.Ignored) {

      this.barItem.text = '💧 $(eye-closed)';
      this.barItem.tooltip = 'Ignoring File from Liquid Formatting';
      this.barItem.command = 'liquid.enableFormatting';

    } else if (type === Status.Disabled) {

      this.barItem.text = '💧 $(x)';
      this.barItem.tooltip = 'Enable Liquid Formatting';
      this.barItem.command = 'liquid.enableFormatter';

    } else if (type === Status.Error) {

      this.barItem.text = '💧 $(x)';
      this.barItem.tooltip = 'Errors detected! Toggle output';
      this.barItem.command = 'liquid.toggleOutput';

    } else if (type === Status.Loading) {

      this.barItem.text = '💧 $(sync~spin)';
      this.barItem.tooltip = 'Loading Extension';

    }

    return show ? this.barItem.show() : this.barItem.hide();

  }

  /**
   * Open the output channel
   */
  openOutput () {

    return this.outputChannel.show();

  }

  /**
   * Print something to the Liquid output channel.
   */
  logOutput (title:| 'liquid'| 'error'| 'warning', message: string) {

    this.outputChannel.appendLine(`${getTime()} ${title} ${message}`);

    if (title === 'error') {
      this.hasError = true;
      this.statusBar(Status.Error, true);
      this.openOutput();
    }

  }

}
