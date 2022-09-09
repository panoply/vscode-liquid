/* eslint-disable no-unused-vars */

import { window, StatusBarAlignment } from 'vscode';
import { Model } from './model';
import { Status } from './utils';

/**
 * Utilities frequently used by the extension
 */
export class UI extends Model {

  /**
   * The status bar item
   */
  barItem = window.createStatusBarItem(StatusBarAlignment.Right, -2);
  /**
   * The output channel
   */
  outputChannel = window.createOutputChannel('Liquid');

  /**
   *  The status bar item functionality
   *
   *  @param {"string"} type the type of status bar item to show
   *  @param {"string"} [show] show/hide the status bar item (optional)
   *  @memberof Utils
  */
  statusBarItem (type: Status, show?: boolean) {

    if (type === Status.Enabled) {

      this.barItem.text = '💧 Liquid $(check)';
      this.barItem.tooltip = 'Enable/Disable Liquid Formatting';
      this.barItem.command = 'liquid.disableFormatting';

    } else if (type === Status.Disabled) {

      this.barItem.text = '💧 Liquid $(x)';
      this.barItem.tooltip = 'Enable Liquid Formatting';
      this.barItem.command = 'liquid.enableFormatting';

    } else if (type === Status.Error) {

      this.barItem.text = '⚠️ Liquid $(check)';
      this.barItem.command = 'Errors detected! Toggle output';
      this.barItem.command = 'liquid.toggleOutput';

    }

    if (show !== undefined) return show ? this.barItem.show() : this.barItem.hide();

  }

  outputLog ({ title, message, show = false }:{
    title: string,
    message: string,
    file?: string,
    show?: boolean
  }) {

    const date = new Date().toLocaleString();

    // Apply a date title to the output
    this.outputChannel.appendLine(`[${date}] ${title}: ${message}`);

    if (show) {
      this.hasError = true;
      this.statusBarItem(Status.Error);
      this.outputChannel.show();
    }

  }

}
