
import { TextDocument } from 'vscode-languageserver-textdocument';
import { getLanguageService, DiagnosticSeverity, LanguageService, Diagnostic } from 'vscode-json-languageservice';

export class JSONLanguageService {

  public service: LanguageService = getLanguageService({
    clientCapabilities: {
      textDocument: {
        completion: {
          completionItem: {
            commitCharactersSupport: false
          }
        }
      }
    }
  });

  constructor (schema: string) {

    this.service.configure({
      validate: true,
      schemas: [
        {
          uri: 'http://json-schema.org/draft-07/schema',
          fileMatch: [ '*' ],
          schema: JSON.parse(schema)
        }
      ]
    });

  }

  /**
   * JSON Validation
   */
  async doValidation (textDocument: TextDocument, offset: number): Promise<Diagnostic[]> {

    const JSONDocument = this.service.parseJSONDocument(textDocument);
    const diagnostics = await this.service.doValidation(textDocument, JSONDocument);

    if (!diagnostics) return null;

    for (const diagnostic of diagnostics) {

      diagnostic.range.start.line += offset;
      diagnostic.range.end.line += offset;

      if (diagnostic.severity !== DiagnosticSeverity.Error) continue;

    }

    return diagnostics;

  }

}
