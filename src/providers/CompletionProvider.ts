import { parseSchema, getSchemaCompletions, typeToken, parseToken, prevChar, parseLocale, applyTranslateFilter, parseObject } from 'lexical/parse';
import { EmptyOutput, EmptyTag } from 'lexical/regex';
import { getSectionCompletions, getSectionScope } from 'lexical/schema';
import { Service } from 'services';
import { Char, Token } from 'types';
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

export interface ICompletionEnable {
  /**
   * Whether or not tag completions are enabled
   *
   * @default true
   */
  tags: boolean;
  /**
   * Whether or not logical completions are enabled
   *
   * @default true
   */
  logical: boolean;
  /**
   * Whether or not filter completions are enabled
   *
   * @default true
   */
  filters: boolean;
  /**
   * Whether or not object completions are enabled
   *
   * @default true
   */
  objects: boolean;
  /**
   * Whether or not section schema completions are enabled
   *
   * @default true
   */
  section: boolean;
}

export interface ICompletionItems {
  /**
   * Tag Completions
   */
  tags: CompletionItem[];
  /**
   * Logical Operator Completions
   */
  logical: CompletionItem[];
  /**
   * Filter Completions
   */
  filters: CompletionItem[];
  /**
   * Object Completions
   */
  objects: CompletionItem[];
  /**
   * Common Objects Completions
   */
  common: CompletionItem[];
  /**
   * Snippet file Completions
   */
  snippets: CompletionItem[];
  /**
   * Sections file Completions
   */
  sections: CompletionItem[];
  /**
   * Settings Completions
   */
  settings: CompletionItem[];
  /**
   * Locale Completions
   */
  locales: CompletionItem[];
}

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
    logical: true,
    filters: true,
    objects: true,
    section: true
  };

  /**
   * Completion Items
   *
   * The completion items to be provided on resolution
   */
  public items: ICompletionItems = {
    tags: [],
    logical: [],
    filters: [],
    objects: [],
    common: [],
    locales: [],
    sections: [],
    settings: [],
    snippets: []
  };

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
    token: CancellationToken,
    { triggerCharacter, triggerKind }: CompletionContext
  ): Promise<CompletionItem[]> {

    this.textEdits = null;

    const trigger = CompletionTriggerKind.TriggerCharacter === triggerKind ? triggerCharacter.charCodeAt(0) : false;
    const content = document.getText();
    const offset = document.offsetAt(position);

    /* -------------------------------------------- */
    /* SCHEMA PROPERTY                              */
    /* -------------------------------------------- */

    if (trigger === Char.DQO || trigger === Char.COL || triggerKind === CompletionTriggerKind.Invoke) {

      if (document.languageId === 'liquid') {

        const isSchema = parseSchema(content, offset);

        if (isSchema !== false && isSchema.within) {

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
    }

    /* -------------------------------------------- */
    /* TAG COMPLETIONS                              */
    /* -------------------------------------------- */

    if (trigger === Char.PER) {

      if (!this.enable.tags) return null;

      const character = position.character - 1;

      this.textEdits = [ TextEdit.insert(new Position(position.line, character), '{') ];

      return this.items.tags;

    }

    const type = typeToken(content, offset);

    if (type === Token.Object) {

      const object = parseToken(Token.Object, content, offset);

      if (object.within) {

        if (EmptyOutput.test(object.text) && this.enable.objects) return this.items.objects;

        const prev = prevChar(object.text, object.offset);

        /* -------------------------------------------- */
        /* LOCALES                                      */
        /* -------------------------------------------- */

        if (
          trigger === Char.SQO ||
        trigger === Char.DQO || (prev === Token.Locale && trigger === Char.DOT)) {

          const locales = parseLocale(this.items.locales, content, offset, {
            addFilter: applyTranslateFilter(object.text.slice(object.offset)),
            position
          });

          return locales;

        }

        /* -------------------------------------------- */
        /* FILTERS                                      */
        /* -------------------------------------------- */

        if (trigger === Char.PIP || prev === Token.Filter) {

          return this.enable.filters ? this.items.filters : null;

        }

        /* -------------------------------------------- */
        /* LIQUID SCHEMA                                */
        /* -------------------------------------------- */

        if (
          trigger === Char.DOT ||
        prev === Token.Property ||
        prev === Token.Block) {

          const schema = this.enable.objects
            ? parseObject(object.text, object.offset, this.items.settings)
            : null;

          if (schema !== null && this.enable.section) {

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

          return this.enable.objects ? this.items.objects : null;

        }

        return null;

      }

    } else if (type === Token.Tag) {

      const tag = parseToken(Token.Tag, content, offset);

      if (tag.within) {

        if (EmptyTag.test(tag.text) && this.enable.tags) return this.items.tags;

        const prev = prevChar(tag.text, tag.offset, tag.tagName);

        console.log(this.items.sections, tag.tagName, prev === Token.Tag);

        if (prev === Token.Tag && tag.tagName === 'render' && (
          trigger === Char.DQO ||
        trigger === Char.SQO
        )) {

          return this.items.sections;

        }

        if (prev === Token.Block) {

          if (
            trigger === Char.DQO ||
          trigger === Char.SQO) {

            return getSectionCompletions(content, offset, 'type');

          } else {

            return getSectionCompletions(content, offset, 'type', 'string');

          }
        }

        if (trigger === Char.PIP || prev === Token.Filter) {
          return this.enable.filters ? this.items.filters : null;
        }

        if (trigger === Char.DOT || prev === Token.Property) {

          const schema = this.enable.objects
            ? parseObject(tag.text, tag.offset, this.items.settings)
            : null;

          if (schema !== null && this.enable.section) {
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

        if (trigger === Char.COL || prev === Token.Object) {

          return this.enable.objects
            ? this.items.common
            : null;

        }

        if (prev === Token.Logical && this.enable.logical) {
          return this.items.logical;
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
