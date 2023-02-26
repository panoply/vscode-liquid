import { getCSSLanguageService, DiagnosticSeverity, LanguageService, TextDocument } from 'vscode-css-languageservice';
import { languages, Position, Range, TextDocument as ITextDocument, Uri, CompletionItem } from 'vscode';
export class CSSLanguageService {

  /**
   * Style Regions
   *
   * The schema tag regions
   */
  static style = new Map();

  public service: LanguageService = getCSSLanguageService();

  get style () {

    return CSSLanguageService.style;

  }

  /**
   * Parse JSON
   *
   * Parses the inner contents of the JSON schema tag
   */
  public doParse (document: ITextDocument, position: Position) {

    const uri = document.fileName + '.css';
    const { begin, content } = this.style.get(document.uri.fsPath);
    const { line } = document.positionAt(begin);

    return {
      get position () {
        return new Position(position.line - line, position.character);
      },
      get textDocument () {
        return TextDocument.create(uri, 'css', 1, content);
      }
    };

  }

  /**
   * CSS Validation
   */
  doValidation (document: IAST, node: IEmbed): Diagnostic[] | null {

    const CSSDocument = this.service.parseStylesheet(node.textDocument);
    const diagnostics = this.service.doValidation(node.textDocument, CSSDocument);

    if (!diagnostics) return null;

    diagnostics.forEach(diagnostic => {

      diagnostic.range.start.line += node.regionOffset;
      diagnostic.range.end.line += node.regionOffset;
      diagnostic.source = `Liquid ${node.tag} tag`;

      if (diagnostic.severity !== DiagnosticSeverity.Error) return;
      if (document.format) {
        document.format.enable = false;
        document.format.error = diagnostic;
      }

    });

    return diagnostics;

  }

  /**
   * CSS Hovers
   */
  doHover (node: IEmbed, { line, character }: Position): Hover {

    const CSSDocument = this.service.parseStylesheet(node.textDocument);
    const position = { character, line: line - node.regionOffset };
    const hovers = this.service.doHover(node.textDocument, position, CSSDocument);

    if (!hovers) return null;

    hovers.range.start.line = line;
    hovers.range.end.line = line;

    return hovers;

  }

  /**
   * CSS Completions
   */
  doComplete (node: IEmbed, { character, line }: Position): CompletionList {

    const position = { character, line: line - node.regionOffset };
    const CSSDocument = this.service.parseStylesheet(node.textDocument);
    const completions = this.service.doComplete(node.textDocument, position, CSSDocument);

    for (const complete of completions.items) {
      (complete.textEdit as TextEdit).range.start.line = line;
      (complete.textEdit as TextEdit).range.end.line = line;
      complete.data = {
        token: NodeLanguage.css,
        languageId: node.languageId
      };
    }

    return completions;
  }

}
