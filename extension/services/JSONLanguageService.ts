import { Complete, SchemaRegion, SharedSchema } from 'types';
import { languages, Position, Range, TextDocument as ITextDocument, Uri, CompletionItem } from 'vscode';
import { schema } from 'data/store';
import {
  getLanguageService,
  DiagnosticSeverity,
  LanguageService,
  Diagnostic,
  TextDocument,
  MarkupKind,
  SchemaDraft,
  JSONSchema,
  DocumentLanguageSettings
} from 'vscode-json-languageservice';
import { getSharedSchema } from 'data/shared';

export class JSONLanguageProvider {

  /**
   * JSON Schema
   *
   * The Schema store specification
   */
  public schema: JSONSchema = schema;

  /**
   * Shared Schema
   *
   * Schema store for shared sections
   */
  public shared: Map<string, string[]> = new Map();

  /**
   * Schema Regions
   *
   * The schema tag regions
   */
  static sections: Complete.Schema = new Map();

  /**
   * Configuration
   */
  public config: { validate?: boolean; } = { validate: true };

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
   * JSON Document Language Settings
   *
   * The language service settings
   */
  private settings: DocumentLanguageSettings = {
    trailingCommas: 'error',
    comments: 'error',
    schemaDraft: SchemaDraft.v7,
    schemaRequest: 'warning',
    schemaValidation: 'error'
  };

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

  constructor () {

    this.configure();
  }

  /* -------------------------------------------- */
  /* METHODS                                      */
  /* -------------------------------------------- */

  configure () {

    this.service.configure({
      validate: true,
      allowComments: false,
      schemas: [
        {
          uri: 'section',
          fileMatch: [ '*.json' ],
          schema: this.schema
        }
      ]
    });

  }

  /**
   * Extend JSON Schema
   */
  extend (uri: Uri, shared: SharedSchema) {

    this.schema = getSharedSchema(uri, shared, this.schema);

  }

  /**
   * Schema Sections Getter
   *
   * Returns the static `schema` Map reference
   */
  get sections () { return JSONLanguageProvider.sections; }

  /**
   * Parse JSON
   *
   * Parses the inner contents of the JSON schema tag
   */
  public doParse (document: ITextDocument, position: Position, schema: Complete.ISchema) {

    const uri = `${document.fileName}.json`;
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

    return hover === null ? null : hover.contents;

  }

  /**
   * Provide Completions
   *
   * Parse the JSON generated content and returns the completion results.
   */
  async doCompletions ({ textDocument, position }: SchemaRegion): Promise<CompletionItem[]> {

    const JSONDocument = this.service.parseJSONDocument(textDocument);
    const competion = await this.service.doComplete(
      textDocument,
      position,
      JSONDocument
    );

    return competion.items;
  }

  /**
   * JSON Validation
   *
   * Applies JSON validation to the Schema code region.
   */
  async doValidation (uri: Uri): Promise<readonly Diagnostic[]> {

    const { content, offset } = this.sections.get(uri.fsPath);
    const textDocument = TextDocument.create(uri, 'json', 1, content);
    const JSONDocument = this.service.parseJSONDocument(textDocument);
    const diagnostics = await this.service.doValidation(
      textDocument,
      JSONDocument,
      this.settings,
      this.schema
    );

    if (!diagnostics) return diagnostics;

    this.canFormat = true;

    for (const diagnostic of diagnostics) {

      diagnostic.range = new Range(
        new Position(diagnostic.range.start.line + offset, diagnostic.range.start.character),
        new Position(diagnostic.range.end.line + offset, diagnostic.range.end.character)
      );

      if (diagnostic.severity === DiagnosticSeverity.Error) {
        this.canFormat = false;
      }

    }

    return diagnostics;

  }

}
