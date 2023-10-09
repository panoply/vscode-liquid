import { CancellationToken, Progress, ProgressLocation, window, workspace } from 'vscode';
import { isArray } from '../utils';
import { WorkspaceSettings } from './WorkspaceSettings';

/**
 * Notification Messages
 *
 * Methods for displaying notifications in the editor. The functions
 * here will apply choice invoked notifiers. Choices response are returned in
 * uppercase snake_case format or `null` if no choice made.
 *
 * ---
 *
 * The `FileSystemWatcher` class will extend next.
 */
export class NotificationMessage extends WorkspaceSettings {

  /**
   * Open Document
   *
   * Opens a document at the provided `path` in the editor
   */
  async openDocument (path: string) {

    try {
      const document = await workspace.openTextDocument(path);
      const textDocument = await window.showTextDocument(document, 1, false);
      return textDocument;
    } catch (e) {
      this.catch('Failed to open text document', e);
    }
  }

  /**
   * Progress (notification)
   *
   * A progress notification loading bar, the `task` callback is the progress handler.
   */
  async notifyProgress (title: string, task: (progress: Progress<{
    message?: string;
    increment?: number;
  }>, token: CancellationToken) => Promise<boolean>) {

    try {
      await window.withProgress({ title, location: ProgressLocation.Notification, cancellable: true }, task);
    } catch (e) {
      this.catch('Failed to show information message', e);
    }
  }

  /**
   * Information Message (notification)
   *
   * Displays an information message with choices
   */
  async notifyInfo (choices: string[], text: string | string[], modal = false) {

    const message = isArray(text) ? (text as string[]).join(' ') : text as string;

    try {
      const action = await window.showInformationMessage(message, { modal }, ...choices);
      return action ? action.toUpperCase().replace(/ /g, '_') : null;
    } catch (e) {
      this.catch('Failed to show information message', e);
    }
  }

  /**
   * Error Message (notification)
   *
   * Displays an error message with choices
   */
  async notifyError (choices: string[], text: string | string[], modal = false) {

    const message = isArray(text) ? (text as string[]).join(' ') : text as string;

    try {
      const action = await window.showErrorMessage(message, ...choices);
      return action ? action.toUpperCase().replace(/ /g, '_') : null;
    } catch (e) {
      this.catch('Failed to show error message', e);
    }
  }

}
