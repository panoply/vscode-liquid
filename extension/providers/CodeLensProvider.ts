import {
  CodeLensProvider as ICodeLensProvider,
  CodeLens,
  EventEmitter,
  Event,
  workspace,
  CancellationToken,
  Position,
  TextDocument
} from 'vscode';

export class CodeLensProvider implements ICodeLensProvider {

  private codeLenses: CodeLens[] = [];
  private _onDidChangeCodeLenses: EventEmitter<void> = new EventEmitter<void>();
  public readonly onDidChangeCodeLenses: Event<void> = this._onDidChangeCodeLenses.event;

  public regex = /{%-?\s*\b(render)\b.*?-?%}/g;

  public provideCodeLenses (
    document: TextDocument,
    token: CancellationToken
  ): CodeLens[] | Thenable<CodeLens[]> {

    this.codeLenses = [];

    const regex = new RegExp(this.regex);
    const text = document.getText();
    let matches;

    while ((matches = regex.exec(text)) !== null) {

      const line = document.lineAt(document.positionAt(matches.index).line);
      const indexOf = line.text.indexOf(matches[0]);
      const position = new Position(line.lineNumber, indexOf);
      const range = document.getWordRangeAtPosition(position, new RegExp(this.regex));
      if (range) {
        this.codeLenses.push(new CodeLens(range));
      }
    }

    return this.codeLenses;

  }

  public command () {

  }

  public resolveCodeLens (codeLens: CodeLens, token: CancellationToken) {
    if (workspace.getConfiguration('codelens-sample').get('enableCodeLens', true)) {
      codeLens.command = {
        title: 'Codelens provided by sample extension',
        tooltip: 'Tooltip provided by sample extension',
        command: 'liquid.codelensAction',
        arguments: [ 'Argument 1', false ]
      };
      return codeLens;
    }
    return null;
  }

}
