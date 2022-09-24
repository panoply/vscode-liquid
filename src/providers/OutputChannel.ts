import { window } from 'vscode';
import * as u from 'utils';
import { StatusBarItem } from 'providers/StatusBarItem';
import { State } from 'state';

export class OutputChannel extends State {

  /**
   * Status Bar Item - instance
   */
  public status = new StatusBarItem({
    displayName: this.displayName,
    version: this.version,
    prettifyVersion: this.prettifyVersion,
    repository: this.repository
  });

  /**
   * Liquid Output Channel
   */
  public output = window.createOutputChannel(this.displayName, 'log-liquid');

  /**
   * Info Output
   *
   * General messages with timestamp.
   */
  public info (message: string) {

    this.output.appendLine(`${u.getTime()} ${message}`);

  }

  /**
   * Warning Output
   *
   * General messages with timestamp.
   */
  public warn (message: string) {

    this.output.appendLine(`${u.getTime()} WARNING: ${message}`);

  }

  /**
   * Catch Handler
   *
   * Ensures throws are handled correctly
   */
  public catch (message: string, error?: Error) {

    if (error instanceof Error) {

      const stack = u.parseStack(error);

      this.output.appendLine(`\nERROR: ${message}\n`);

      const json = error.message.indexOf(' while parsing near');

      if (json > -1) error.message = error.message.slice(0, json) + ':';

      this.output.appendLine(error.message);

      for (const line of stack) this.output.appendLine(line);

    }

  }

  /**
   * Error Output
   *
   * Error handling printed to output
   */
  public error (message: string, context?: string[] | string) {

    this.status.error();

    if (u.isUndefined(context)) {

      this.output.appendLine(`${u.getTime()} ERROR: ${message}`);

    } else if (u.isArray(context)) {

      this.output.appendLine(`ERROR: ${message}\n`);

      (context as string[]).push('');

      for (const line of context as string[]) this.output.appendLine('  ' + line);

    } else if (u.isString(context)) {

      this.output.appendLine(`ERROR: ${message}\n`);
      this.output.appendLine(context as string + '\n');

    }

  };

}
