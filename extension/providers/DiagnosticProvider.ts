import {
  DiagnosticCollection,
  languages,
  Uri,
  Diagnostic
} from 'vscode';

export class DiagnosticProvider {

  /**
   * Diagnostics Collection
   */
  public diagnostics: DiagnosticCollection = languages.createDiagnosticCollection('liquid');

  /**
   * Set Diagnostic
   */
  public set (uri: Uri, diagnostic: Diagnostic[]) {

    this.diagnostics.set(uri, diagnostic);

  }

  public clear () {

    this.diagnostics.clear();
  }

}
