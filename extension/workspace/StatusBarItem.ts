/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
import { StatusBarAlignment, ThemeColor, window } from 'vscode';
import { StatusItem } from '../types';
import { mdString } from '../utils';
import { delay } from 'rambdax';

/**
 * Status Bar Item Provider
 *
 * Provider from the status bar item which displays the
 * Liquid 💧 emoji icon in the bottom right hand corner.
 */
export class StatusBarItem {

  /* -------------------------------------------- */
  /* PRIVATE REFERENCES                           */
  /* -------------------------------------------- */

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
  private last: keyof Pick<StatusBarItem, | 'enable' | 'disable' | 'ignore' | 'loading' | 'hide' | 'error'>;

  /* -------------------------------------------- */
  /* PUBLIC EXPORTS                               */
  /* -------------------------------------------- */

  /**
   * The current state of the status bar item
   */
  public state: StatusItem = StatusItem.Hidden;

  /**
   * Show Bar Item - Show
   */
  public show () {

    if (this.state === StatusItem.Hidden) this.item.show();

  }

  /**
   * Status Bar Item - Hide
   */
  public hide () {

    if (this.state !== StatusItem.Hidden) {
      this.item.hide();
      this.state = StatusItem.Hidden;
    }

  }

  /**
   * Status Bar Item - Loading
   */
  public async loading (tooltip = 'Loading Extension', delayed = 1500) {

    this.show();
    this.state = StatusItem.Loading;
    this.item.text = '💧 $(sync~spin)';
    this.item.tooltip = tooltip;
    this.item.command = 'liquid.toggleOutput';
    await delay(delayed);

  }

  /**
   * Status Bar Item - Enabled
   */
  public enable () {

    this.state = StatusItem.Enabled;
    this.item.text = '💧 $(check)';
    this.item.tooltip = 'Disable Liquid Formatting';
    this.item.command = 'liquid.disableFormatting';
    this.item.tooltip = mdString('Press to disable formatting');
    this.item.color = 'white';
    this.show();

  }

  /**
   * Status Bar Item - Ignore
   */
  public ignore () {

    this.state = StatusItem.Ignoring;
    this.item.text = '💧 $(eye-closed)';
    this.item.tooltip = mdString('File is ignored from formatting');
    this.item.command = 'liquid.openOutput';
    this.item.color = 'white';
    this.show();
  }

  /**
   * Status Bar Item - Disabled
   */
  public disable () {

    this.state = StatusItem.Disabled;
    this.item.text = '💧 $(x)';
    this.item.command = 'liquid.enableFormatting';
    this.item.tooltip = mdString('Press to enable formatting');
    this.item.color = 'white';
    this.show();
  }

  /**
   * Status Bar Item - Error
   */
  public error (tooltip = 'Errors! Press to toggle output', command = 'liquid.openOutput') {

    this.state = StatusItem.Error;
    this.item.text = '🩸 ERROR';
    this.item.tooltip = tooltip;
    this.item.command = command;
    this.item.color = new ThemeColor('statusBarItem.errorBackground');
    this.show();

  }

  /**
   * Status Bar Item - Warning
   */
  public warn () {

    this.show();

    if (this.state === StatusItem.Warning) {
      clearTimeout(this.timer);
    } else {
      this.state = StatusItem.Warning;
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
