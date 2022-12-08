import { languages, Position } from 'vscode';
import { schema } from 'parse/schema';
import {
  getLanguageService,
  DiagnosticSeverity,
  LanguageService,
  Diagnostic,
  TextDocument,
  MarkupKind

} from 'vscode-json-languageservice';

export class JSONLanguageService {

  public service: LanguageService = getLanguageService({
    clientCapabilities: {
      textDocument: {
        hover: {
          contentFormat: [ MarkupKind.Markdown ]
        },
        completion: {
          completionItem: {
            documentationFormat: [ MarkupKind.Markdown ],
            commitCharactersSupport: true
          }
        }
      }
    }
  });

  public diagnostics = languages.createDiagnosticCollection('Liquid Section Schema');

  constructor () {

    this.service.configure({
      validate: true,
      allowComments: false,
      schemas: [
        {
          uri: 'http://json-schema.org/draft-07/schema',
          fileMatch: [ '*' ],
          schema
        }
      ]
    });

  }

  async doCompletions (textDocument: TextDocument, position: Position) {

    const JSONDocument = this.service.parseJSONDocument(textDocument);
    const competionResult = await this.service.doComplete(textDocument, position, JSONDocument);

    return competionResult.items;
  }

  /**
   * JSON Validation
   */
  async doValidation (textDocument: TextDocument, position: Position): Promise<Diagnostic[]> {

    const JSONDocument = this.service.parseJSONDocument(textDocument);
    const diagnostics = await this.service.doValidation(textDocument, JSONDocument);

    if (!diagnostics) return null;

    for (const diagnostic of diagnostics) {

      diagnostic.range.start.line += position.line;
      diagnostic.range.end.line += position.line;

      if (diagnostic.severity !== DiagnosticSeverity.Error) continue;

    }

    return diagnostics;

  }

}
