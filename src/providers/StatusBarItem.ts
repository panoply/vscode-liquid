/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
import { StatusBarAlignment, ThemeColor, window } from 'vscode';
import { getStatusBar, mdString } from 'utils';
import { delay } from 'rambdax';

/**
 * Status States
 *
 * An enum which is used to determine the current state
 * of the status bar item. This also informs upon the state
 * at which the extension is running due to the fact the status
 * bar item is reflective of different operations.
 */
export const enum Status {
  /**
   * The status is enabled - Formatting is enabled
   */
  Enabled = 1,
  /**
   * The status is disabled - Formatting is disabled
   */
  Disabled,
  /**
   * The status is ignoring - File is excluded/ignored from formatting
   */
  Ignoring,
  /**
   * The status is error - Formatting or extension error
   */
  Error,
  /**
   * The status is warning - Formatting or extension warning
   */
  Warning,
  /**
   * The status is loading - Some long operation is happening
   */
  Loading,
  /**
   * The status bar item is hidden - Infers a non operational state
   */
  Hidden,
}

/**
 * Status Bar Item Provider
 *
 * Provider from the status bar item which displays the
 * Liquid 💧 emoji icon in the bottom right hand corner.
 */
export class StatusBarItem {

  /**
   * The current state of the status bar item
   */
  public state: Status = Status.Hidden;

  /**
   * The status bar item instance
   */
  private item = window.createStatusBarItem(StatusBarAlignment.Right, 0);

  /**
   * The number of warnings
   */
  private warnings: number = 0;

  /**
   * The setTimeout reference for warnings
   */
  private timer: NodeJS.Timeout;

  /**
   * The last known state of the status bar item before a warning
   */
  public last: keyof Pick<StatusBarItem,
  | 'enable'
  | 'disable'
  | 'ignore'
  | 'loading'
  | 'hide'
  | 'error'
  >;

  /**
   * Show the status bar item
   */
  private show () {
    if (this.state === Status.Hidden) {
      this.item.show();
    }
  }

  /**
   * Status Bar Item - Hide
   */
  public hide () {
    if (this.state !== Status.Hidden) {
      this.item.hide();
      this.state = Status.Hidden;
    }
  }

  /**
   * Status Bar Item - Loading
   */
  public async loading (tooltip = 'Loading Extension', delayed = 1500) {
    this.show();
    this.state = Status.Loading;
    this.item.text = '💧 $(sync~spin)';
    this.item.tooltip = tooltip;
    this.item.command = 'liquid.toggleOutput';
    await delay(delayed);
  }

  /**
   * Status Bar Item - Enabled
   */
  public enable () {
    this.show();
    this.state = Status.Enabled;
    this.item.text = '💧 $(check)';
    this.item.tooltip = 'Disable Liquid Formatting';
    this.item.command = 'liquid.disableFormatting';
    this.item.tooltip = mdString('<i>Press to disable formatting</i>');
    this.item.color = 'white';
  }

  /**
   * Status Bar Item - Ignore
   */
  public ignore () {
    this.show();
    this.state = Status.Ignoring;
    this.item.text = '💧 $(eye-closed)';
    this.item.tooltip = mdString('<i>File is ignored from formatting</i>');
    this.item.command = 'liquid.openOutput';
    this.item.color = 'white';

  }

  /**
   * Status Bar Item - Disabled
   */
  public disable () {
    this.show();
    this.state = Status.Disabled;
    this.item.text = '💧 $(x)';
    this.item.command = 'liquid.enableFormatting';
    this.item.tooltip = mdString('<i>Press to enable formatting</i>');
    this.item.color = 'white';
  }

  /**
   * Status Bar Item - Error
   */
  public error (tooltip = 'Errors! Press to toggle output', command = 'liquid.openOutput') {
    this.show();
    this.state = Status.Error;
    this.item.text = '🩸 $(x)';
    this.item.tooltip = tooltip;
    this.item.command = command;
    this.item.color = new ThemeColor('statusBarItem.errorBackground');
  }

  /**
   * Status Bar Item - Warning
   */
  public warn () {

    this.show();

    if (this.state === Status.Warning) {
      clearTimeout(this.timer);
    } else {
      this.last = getStatusBar(this.state);
      this.state = Status.Warning;
    }

    this.item.tooltip = `${this.warnings > 1 ? 'Warnings' : 'Warnings'}! Toggle output`;
    this.item.command = 'liquid.toggleOutput';
    this.item.backgroundColor = new ThemeColor('statusBarItem.warningBackground');
    this.timer = setTimeout(() => {
      this.timer = undefined;
      this.warnings--;
      this[this.last]();
    }, 3500);
  }

};
