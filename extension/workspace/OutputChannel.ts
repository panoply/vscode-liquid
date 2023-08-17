import { window } from 'vscode';
import * as u from '../utils';
import { StatusBarItem } from './StatusBarItem';
import { has } from 'rambdax';
import { StatusLanguageItem } from './StatusLanguageItem';

/**
 * Output Channel
 *
 * Handler from Liquid output channel logger. This class implements the
 * Liquid status bar item on a private.
 *
 * ---
 *
 * The `NotificationMessage` class will extend next.
 */
export class OutputChannel extends StatusLanguageItem {

  /**
   * Status Bar Item - instance
   */
  public status = new StatusBarItem();

  /**
   * Liquid Output Channel
   */
  private output = window.createOutputChannel(this.meta.displayName, 'log-liquid');

  /**
   * Toggle Output Channel
   */
  public toggleOutput () {

    this.output.show();

  }

  /**
   * Write a blank newline to output
   */
  public nl () {

    this.output.appendLine('────────────────────');

  }

  /**
   * Clear output
   */
  public clear () {

    return this.output.clear();
  }

  /**
   * Info Output
   *
   * General info messages with timestamp.
   */
  public info (...message: string[]) {

    for (const line of message) {

      this.output.appendLine(`${u.getTime()} ${line}`);

    }
  }

  /**
   * Warning Output
   *
   * Message with a `WARNING` and timespace prefix.
   */
  public warn (message: string) {

    this.output.appendLine(`${u.getTime()} WARNING: ${message}`);

  }

  /**
   * Catch Handler
   *
   * Catch error handler which will called in try/catch throws.
   */
  public catch (message: string, error: Error) {

    if (error instanceof Error) {

      this.output.appendLine(`\nERROR: ${message}\n`);

      if (has('message', error)) {

        const json = error.message.indexOf(' while parsing near');

        if (json > -1) error.message = error.message.slice(0, json) + ':';

        this.output.appendLine(error.message);

      }

      const stack = u.parseStack(error);

      if (u.isArray(stack)) {
        for (const line of stack) {
          this.output.appendLine(line);
        }
      }

    } else {

      // TODO: Handle non instance errors

      console.log(message, error);

    }
  }

  /**
   * Error Output
   *
   * General error handling, typically used for known errors.
   * Returns a function which accepts a spread for multilines.
   */
  public error (message: string, indent = '  ') {

    this.status.error();
    this.output.appendLine(`\nERROR: ${message}`);

    return (...context: string[]) => {

      for (const line of context) {

        this.output.appendLine(indent + line); // indent 2 spaces for every line

      }

    };

  };

}
