import { Type } from '@liquify/liquid-language-specs';
import { parseSchema, getSchemaCompletions, typeToken, parseToken, prevChar, parseLocale, applyTranslateFilter, parseObject, getVariableObject } from '../lexical/parse';
import { EmptyOutput, EmptyTag } from '../lexical/regex';
import { getSectionCompletions, getSectionScope } from '../lexical/schema';
import { getVariableCompletions } from '../lexical/variables';
import { Service } from '../services';
import { Char, Token, Completions } from '../types';
import {
  CancellationToken,
  CompletionContext,
  CompletionItem,
  CompletionItemProvider,
  CompletionTriggerKind,
  Position,
  TextDocument,
  TextEdit
} from 'vscode';

/**
 * Liquid Completions
 */
export interface ICompletionEnable {
  /**
   * Whether or not tag completions are enabled
   *
   * - Standard
   * - Shopify
   * - Jekyll
   * - Eleventy
   *
   * @default true
   */
  tags: boolean;
  /**
   * Whether or not operator completions are enabled
   *
   * - Standard
   * - Shopify
   * - Jekyll
   * - Eleventy
   *
   * @default true
   */
  operators: boolean;
  /**
   * Whether or not filter completions are enabled
   *
   * - Standard
   * - Shopify
   * - Jekyll
   * - Eleventy
   *
   * @default true
   */
  filters: boolean;
  /**
   * Whether or not object completions are enabled
   *
   * - Shopify
   * - Jekyll
   * - Eleventy
   *
   * @default true
   */
  objects: boolean;
  /**
   * Whether or not section schema completions are enabled
   *
   * - Shopify
   *
   * @default true
   */
  schema: boolean;
  /**
   * Whether or not locale file completions are enabled
   *
   * - Shopify
   *
   * @default true
   */
  locales: boolean;
  /**
   * Whether or not `settings_data.json` file completions are enabled
   *
   * - Shopify
   *
   * @default true
   */
  settings: boolean;
  /**
   * Whether or not `snippet` file completions are enabled
   *
   * - Shopify
   *
   * @default true
   */
  snippets: boolean;
  /**
   * Whether or not `_include` file completions are enabled
   *
   * - Jekyll
   * - Eleventy
   *
   * @default true
   */
  includes: boolean;
  /**
   * Whether or not `section` file completions are enabled
   *
   * - Shopify
   *
   * @default true
   */
  sections: boolean;
  /**
   * Whether or not data file completions are enabled
   *
   * - Jekyll
   * - Eleventy
   *
   * @default true
   */
  data: boolean;
  /**
   * Whether or not frontmatter completions are enabled
   *
   * - Jekyll
   * - Eleventy
   *
   * @default true
   */
  frontmatter: boolean;
}

export interface ICompletionFiles {
  /**
   * Settings Completions
   */
  settings: {
    /**
     * The settings file path
     */
    path: string;
    /**
     * The settings parsed file
     */
    items: object;
  }
  /**
   * Locale Completions
   */
  locales: {
    /**
     * The locales file path
     */
    path: string;
    /**
     * The locales parsed file
     */
    items: object;
  }
}

export type ICompletionItems = Map<
| 'tags'
| 'operators'
| 'filters'
| 'objects'
| 'common'
| 'snippets'
| 'sections'
| 'settings'
| 'localea', CompletionItem[]>

export class CompletionProvider extends Service implements CompletionItemProvider {

  /**
   * Trigger Characters
   *
   * Used for completions, the following triggers character.
   */
  public triggers: readonly string[] = [
    '%',
    '|',
    ':',
    '.',
    '"',
    "'",
    ' '
  ];

  /* -------------------------------------------- */
  /* STATE                                        */
  /* -------------------------------------------- */

  /**
   * Completion Control
   *
   * Determines whether or not a completion can be shown
   */
  public enable: ICompletionEnable = {
    tags: true,
    operators: true,
    filters: true,
    objects: true,
    schema: true,

    // File References Required
    locales: false,
    sections: false,
    settings: false,
    snippets: false,

    // 11ty & Jekyll
    data: false,
    frontmatter: false,
    includes: false

  };

  /**
   * Completion Variables
   */
  public vars: Map<string, Map<string, {
    start: number,
    ender: number,
    value: string,
    detail: string,
    type: Type,
    keyword: string
  }>> = new Map();

  /**
   * Completion Files
   *
   */
  public files: ICompletionFiles = {
    locales: {
      path: null,
      items: {}
    },
    settings: {
      path: null,
      items: {}
    }
  };

  /**
   * Completion Items
   *
   * The completion items to be provided on resolution
   */
  public items: ICompletionItems = new Map();

  private textEdits: TextEdit[] = null;

  /* -------------------------------------------- */
  /* PROVIDERS                                    */
  /* -------------------------------------------- */

  /**
   * The completion item provider interface defines the contract between extensions and
   * [IntelliSense](https://code.visualstudio.com/docs/editor/intellisense).
   *
   * Providers can delay the computation of the {@linkcode CompletionItem.detail detail}
   * and {@linkcode CompletionItem.documentation documentation} properties by implementing the
   * {@linkcode CompletionItemProvider.resolveCompletionItem resolveCompletionItem}-function. However, properties that
   * are needed for the initial sorting and filtering, like `sortText`, `filterText`, `insertText`, and `range`, must
   * not be changed during resolve.
   *
   * Providers are asked for completions either explicitly by a user gesture or -depending on the configuration-
   * implicitly when typing words or trigger characters.
   */
  async provideCompletionItems (
    document: TextDocument,
    position: Position,
    _token: CancellationToken,
    { triggerCharacter, triggerKind }: CompletionContext
  ): Promise<CompletionItem[]> {

    if (document.languageId !== 'liquid') return null;

    this.textEdits = null;

    const trigger = CompletionTriggerKind.TriggerCharacter === triggerKind
      ? triggerCharacter.charCodeAt(0)
      : false;

    const content = document.getText();
    const offset = document.offsetAt(position);
    const vars = this.vars.get(document.uri.path);

    /* -------------------------------------------- */
    /* SCHEMA PROPERTY                              */
    /* -------------------------------------------- */

    if (trigger === Char.DQO || trigger === Char.COL || triggerKind === CompletionTriggerKind.Invoke) {

      const isSchema = parseSchema(content, offset);

      if (isSchema !== false && isSchema.within === true) {

        const schema = this.json.doParse(document, position, isSchema);
        const items = await this.json.doCompletions(schema);

        return getSchemaCompletions(
          trigger === Char.DQO ? 1 : 0,
          position.line,
          position.character,
          items as any
        );

      }

    }

    /* -------------------------------------------- */
    /* TAG COMPLETIONS                              */
    /* -------------------------------------------- */

    if (trigger === Char.PER) {
      if (!this.enable.tags) return null;
      this.textEdits = [ TextEdit.insert(new Position(position.line, position.character - 1), '{') ];
      return this.items.get('tags');
    }

    const type = typeToken(content, offset);

    if (type === Token.Object) {

      const object = parseToken(Token.Object, content, offset);

      if (object.within) {

        if (EmptyOutput.test(object.text) && this.enable.objects) {

          // Concatenate variables and objects
          return [].concat(getVariableCompletions(vars), this.items.get('objects'));

        }

        const prev = prevChar(object.text, object.offset);

        /* -------------------------------------------- */
        /* LOCALES                                      */
        /* -------------------------------------------- */

        if (trigger === Char.SQO || trigger === Char.DQO || (prev === Token.Locale && trigger === Char.DOT)) {

          const locales = parseLocale(this.files.locales, content, offset, {
            addFilter: applyTranslateFilter(object.text.slice(object.offset)),
            position
          });

          return locales;

        }

        /* -------------------------------------------- */
        /* FILTERS                                      */
        /* -------------------------------------------- */

        if (trigger === Char.PIP || prev === Token.Filter) {

          return this.enable.filters ? this.items.get('filters') : null;

        }

        /* -------------------------------------------- */
        /* LIQUID SCHEMA                                */
        /* -------------------------------------------- */

        if (trigger === Char.DOT || prev === Token.Property || prev === Token.Block) {

          const schema = this.enable.objects
            ? vars.has(object.tagName)
              ? getVariableObject(vars.get(object.tagName), this.items.settings)
              : parseObject(object.text, object.offset)
            : null;

          if (schema !== null && this.enable.schema) {

            if (schema === 'settings') {

              return getSectionCompletions(content, offset, schema);

            } else if (schema === 'block') {

              const type = getSectionScope(content, offset);

              if (type !== null) {
                return getSectionCompletions(content, offset, schema, type);
              }
            }
          }

          return schema;

        }

        /* -------------------------------------------- */
        /* FILTER AFTER COLON                           */
        /* -------------------------------------------- */

        if (trigger === Char.COL || prev === Token.Object) {
          return this.enable.objects
            ? this.items.get('objects')
            : null;
        }

        return null;

      }

    } else if (type === Token.Tag) {

      const tag = parseToken(Token.Tag, content, offset);

      if (tag.within) {

        if (EmptyTag.test(tag.text) && this.enable.tags) return this.items.get('tags');

        const prev = prevChar(tag.text, tag.offset, tag.tagName);

        if (prev === Token.Tag && (trigger === Char.DQO || trigger === Char.SQO)) {
          if (tag.tagName === 'render' || tag.tagName === 'include') {

            return this.items.get('snippets');

          } else if (tag.tagName === 'section') {

            return this.items.get('sections');

          }
        }

        if (prev === Token.Block) {

          if (trigger === Char.DQO || trigger === Char.SQO) {

            return getSectionCompletions(content, offset, 'type');

          } else {

            return getSectionCompletions(content, offset, 'type', 'string');

          }
        }

        if (trigger === Char.PIP || prev === Token.Filter) {
          return this.enable.filters
            ? this.items.get('filters')
            : null;
        }

        if (trigger === Char.DOT || prev === Token.Property) {

          const schema = this.enable.objects
            ? parseObject(tag.text, tag.offset, this.items.settings)
            : null;

          if (schema !== null && this.enable.schema) {
            if (schema === 'settings') {

              return getSectionCompletions(content, offset, schema);

            } else if (schema === 'block') {

              const type = getSectionScope(content, offset);

              if (type !== null) {

                return getSectionCompletions(content, offset, schema, type);

              }
            }
          }

          console.log(schema);

          return schema;

        }

        if (trigger === Char.COL || prev === Token.Object) {

          return this.enable.objects
            ? this.items.common
            : null;

        }

        if (prev === Token.Logical && this.enable.operators) {
          return this.items.get('operators');
        }

        return null;
      }

    }

  }

  /**
   * Resolve Completion Item
   *
   * The completion item resolver. In some situations
   * we need to apply additional text edits before resolving,
   * it's here we provide this logic.
   */
  resolveCompletionItem (item: CompletionItem) {

    if (this.textEdits) item.additionalTextEdits = this.textEdits;

    return item;

  }

}
