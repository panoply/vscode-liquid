import { Complete, SchemaRegion } from 'types';
import { languages, Position, Range, TextDocument as ITextDocument, Uri, CompletionItem } from 'vscode';
import { schema } from 'data/store';
import {
  getLanguageService,
  DiagnosticSeverity,
  LanguageService,
  Diagnostic,
  TextDocument,
  MarkupKind
} from 'vscode-json-languageservice';

export class JSONLanguageProvider {

  /**
   * Schema Regions
   *
   * The schema tag regions
   */
  static schema: Complete.Schema = new Map();

  /**
   * Configuration
   */
  public config: { validate: boolean } = { validate: true };

  /**
   * Can Format
   *
   * A reference for critical errors informing whether schema can be formatted.
   */
  public canFormat: boolean = true;

  /**
   * Schema Diagnostics
   *
   * Persisted and maintained diagnostics collection
   */
  public diagnostics = languages.createDiagnosticCollection('Liquid Section Schema');

  /**
   * JSON Language Service
   *
   * The JSON Language service instance
   */
  private service: LanguageService = getLanguageService({
    clientCapabilities: {
      textDocument: {
        hover: {
          contentFormat: [
            MarkupKind.Markdown
          ]
        },
        completion: {
          completionItem: {
            commitCharactersSupport: true,
            documentationFormat: [
              MarkupKind.Markdown
            ]
          }
        }
      }
    }
  });

  /* -------------------------------------------- */
  /* METHODS                                      */
  /* -------------------------------------------- */

  constructor () {

    this.service.configure({
      validate: true,
      allowComments: false,
      schemas: [
        {
          uri: 'http://json-schema.org/draft-07/schema',
          fileMatch: [ '*.json' ],
          schema
        }
      ]
    });

  }

  /**
   * Schema Getter
   *
   * Returns the static `schema` Map reference
   */
  get schema () { return JSONLanguageProvider.schema; }

  /**
   * Parse JSON
   *
   * Parses the inner contents of the JSON schema tag
   */
  public doParse (document: ITextDocument, position: Position, schema: Complete.ISchema) {

    const uri = document.fileName + '.json';
    const { line } = document.positionAt(schema.begin);

    return {
      get position () {
        return new Position(position.line - line, position.character);
      },
      get textDocument () {
        return TextDocument.create(uri, 'json', 1, schema.content);
      }
    };

  }

  /**
   * Provide Completions
   *
   * Parse the JSON generated content and returns the completion results.
   */
  async doHover ({ textDocument, position }: SchemaRegion) {

    const JSONDocument = this.service.parseJSONDocument(textDocument);
    const hover = await this.service.doHover(textDocument, position, JSONDocument);

    return hover.contents;

  }

  /**
   * Provide Completions
   *
   * Parse the JSON generated content and returns the completion results.
   */
  async doCompletions ({ textDocument, position }: SchemaRegion): Promise<CompletionItem[]> {

    const JSONDocument = this.service.parseJSONDocument(textDocument);
    const competion = await this.service.doComplete(textDocument, position, JSONDocument);

    return competion.items;
  }

  /**
   * JSON Validation
   *
   * Applies JSON validation to the Schema code region.
   */
  async doValidation (uri: Uri): Promise< Diagnostic[]> {

    const { content, offset } = this.schema.get(uri.fsPath);
    const textDocument = TextDocument.create(uri, 'json', 1, content);
    const JSONDocument = this.service.parseJSONDocument(textDocument);
    const diagnostics = await this.service.doValidation(textDocument, JSONDocument, {
      trailingCommas: 'warning',
      comments: 'error',
      schemaValidation: 'warning'
    });

    if (!diagnostics) return diagnostics;

    this.canFormat = true;

    for (const diagnostic of diagnostics) {

      diagnostic.range = new Range(
        new Position(diagnostic.range.start.line + offset, diagnostic.range.start.character),
        new Position(diagnostic.range.end.line + offset, diagnostic.range.end.character)
      );

      if (diagnostic.severity === DiagnosticSeverity.Error) this.canFormat = false;

    }

    return diagnostics;

  }

}
