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
export const enum FormatStatus {
  /**
   * The status is enabled - Formatting is enabled
   */
  Enabled = 1,
  /**
   * The status is disabled - Formatting is disabled
   */
  /**
   * Formatting `formatOnSave` is set to `false`
   */
  Disabled,
  /**
   * Formatter is not the default
   */
  NotDefault,
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
  public state: FormatStatus = FormatStatus.Hidden;

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
    if (this.state === FormatStatus.Hidden) {
      this.item.show();
    }
  }

  /**
   * Status Bar Item - Hide
   */
  public hide () {
    if (this.state !== FormatStatus.Hidden) {
      this.item.hide();
      this.state = FormatStatus.Hidden;
    }
  }

  /**
   * Status Bar Item - Loading
   */
  public async loading (tooltip = 'Loading Extension', delayed = 1500) {
    this.show();
    this.state = FormatStatus.Loading;
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
    this.state = FormatStatus.Enabled;
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
    this.state = FormatStatus.Ignoring;
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
    this.state = FormatStatus.Disabled;
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
    this.state = FormatStatus.Error;
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

    if (this.state === FormatStatus.Warning) {
      clearTimeout(this.timer);
    } else {
      this.last = getStatusBar(this.state);
      this.state = FormatStatus.Warning;
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
