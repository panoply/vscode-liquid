import { window, workspace } from 'vscode';
import { WorkspaceSettings } from 'providers/WorkspaceSettings';
import { isArray } from 'utils';

export class FSUtils extends WorkspaceSettings {

  async openDocument (path: string) {

    try {
      const document = await workspace.openTextDocument(path);
      const textDocument = await window.showTextDocument(document, 1, false);
      return textDocument;
    } catch (e) {
      this.catch('Failed to open text document', e);
    }
  }

  async infoMessage (choices: string[], text: string | string[]) {

    const message = isArray(text) ? (text as string[]).join(' ') : text as string;

    try {
      const action = await window.showInformationMessage(message, ...choices);
      return action ? action.toUpperCase().replace(/ /g, '_') : null;
    } catch (e) {
      this.catch('Failed to show information message', e);
    }
  }

  async errorMessage (choices: string[], text: string | string[]) {

    const message = isArray(text) ? (text as string[]).join(' ') : text as string;

    try {
      const action = await window.showErrorMessage(message, ...choices);
      return action ? action.toUpperCase().replace(/ /g, '_') : null;
    } catch (e) {
      this.catch('Failed to show error message', e);
    }
  }

}
