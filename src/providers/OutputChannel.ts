import { window } from 'vscode';
import * as u from 'utils';
import { StatusBarItem } from 'providers/StatusBarItem';
import { StatusLanguageItem } from 'providers/StatusLanguageItem';
import { has } from 'rambdax';

export class OutputChannel extends StatusLanguageItem {

  /**
   * Status Bar Item - instance
   */
  public status = new StatusBarItem();

  /**
   * Liquid Output Channel
   */
  public output = window.createOutputChannel(this.meta.displayName, 'log-liquid');

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
  public catch (message: string, error: Error) {

    if (error instanceof Error) {

      this.output.appendLine(`\nERROR: ${message}\n`);

      if (has('message', error)) {

        const json = error.message.indexOf(' while parsing near');
        if (json > -1) error.message = error.message.slice(0, json) + ':';

        this.output.appendLine(error.message);

      }

      const stack = u.parseStack(error);

      if (u.isArray(stack)) for (const line of stack) this.output.appendLine(line);

    } else {

      console.log(message, error);

    }
  }

  /**
   * Error Output
   *
   * Error handling printed to output
   */
  public error (message: string) {

    if (this.deprecation.liquidrc === null && this.deprecation.workspace === null) {
      this.status.error();
    }

    this.output.appendLine(`${u.getTime()} ERROR: ${message}`);

    return (...context: string[]) => {

      for (const line of context as string[]) this.output.appendLine('  ' + line);

    };

  };

}
