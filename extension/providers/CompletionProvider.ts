import { $, Type, q } from '@liquify/specs';
import { Service } from 'services';
import { Char, Token, Complete, Workspace } from 'types';
import { getTokenCursor, getToken, isEmptyOutput, isEmptyTag, getLiquidTokenCursor } from 'parse/tokens';
import { getSectionCompletions, getSectionScope } from 'parse/schema';
import { insertSpace, insertTag, insertTranslate } from 'parse/edits';
import {
  getObjectCompletions,
  getSchemaCompletions,
  getPropertyCompletions,
  getLocaleCompletions,
  getLiquidTagSnippets,
  getLocaleArguments
} from 'parse/complete';
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
    ',',
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
  public enable: Workspace.Completion = {
    tags: true,
    operators: true,
    filters: true,
    objects: true,
    schema: true,
    variables: true,
    frontmatter: true,
    schemas: true,
    locales: false,
    sections: false,
    settings: false,
    snippets: false,
    data: false,
    includes: false
  };

  /**
   * Completion Items
   *
   * The completion items to be provided on resolution
   */
  public items: Complete.Items = new Map();

  /**
   * Completion Files
   *
   * The completion file uri path references
   */
  public files: {
    locales: string;
    settings: string
  } = { locales: null, settings: null };

  /**
   * Completion Variables
   *
   * The completion variables to be provided on resolution
   */
  public vars: Complete.Vars = new Map();

  /**
   * Completion Frontmatter
   *
   * The completion frontmatter to be provided on resolution
   */
  public frontmatter: { offset: number; keys: string[] } = { offset: 0, keys: [] };

  /**
   * Text Edits
   *
   * An additional set of text edits to be provided on resolution
   */
  private textEdits: TextEdit[] = null;

  /* -------------------------------------------- */
  /* PROVIDERS                                    */
  /* -------------------------------------------- */

  /**
   * The completion item provider interface defines the contract between extensions and
   * [IntelliSense](https://code.visualstudio.com/docs/editor/intellisense).
   */
  async provideCompletionItems (
    document: TextDocument,
    position: Position,
    _token: CancellationToken,
    { triggerCharacter, triggerKind }: CompletionContext
  ): Promise<CompletionItem[]> {

    if (document.languageId !== 'liquid') return null;

    this.textEdits = null;

    const content = document.getText();
    const offset = document.offsetAt(position);
    const trigger = CompletionTriggerKind.TriggerCharacter === triggerKind
      ? triggerCharacter.charCodeAt(0)
      : false;

    /* -------------------------------------------- */
    /* SCHEMA PROPERTY                              */
    /* -------------------------------------------- */

    if (trigger === Char.DQO || trigger === Char.COL || triggerKind === CompletionTriggerKind.Invoke) {

      if (!this.enable.schema) return null;

      if (this.json.sections.has(document.uri.fsPath)) {

        q.setType(null);

        const schema = this.json.sections.get(document.uri.fsPath);

        if (offset > schema.begin && offset < schema.ender) {

          const parse = this.json.doParse(document, position, schema);
          const items = await this.json.doCompletions(parse);

          return getSchemaCompletions(trigger === Char.DQO ? 1 : 0, position, items);

        }
      }
    }

    /* -------------------------------------------- */
    /* INTELLISENSE                                 */
    /* -------------------------------------------- */

    const token = getToken(content, offset, document);

    if (token.within === false) {

      /* -------------------------------------------- */
      /* TAG COMPLETIONS                              */
      /* -------------------------------------------- */
      if (trigger === Char.PER) {
        if (!this.enable.tags) return null;
        q.setType(null);

        this.textEdits = insertTag(position);
        return this.items.get('tags');
      }

      return null;

    }

    /* -------------------------------------------- */
    /* EMPTY OUTPUT                                 */
    /* -------------------------------------------- */

    if (isEmptyOutput(token.text)) {

      q.setType(null);

      return this.enable.objects ? getObjectCompletions(
        document,
        this.items.get('objects'),
        this.vars,
        offset
      ) : null;
    }

    /* -------------------------------------------- */
    /* EMPTY TAG                                    */
    /* -------------------------------------------- */

    if (token.type === Token.Tag && isEmptyTag(token.text)) {

      q.setType(null);

      return this.enable.tags ? this.items.get('tags') : null;

    }

    // if (token.type === Token.TagForm && (trigger === Char.DQO || trigger === Char.SQO)) {
    //   if (Tag(token.tagName).test(token.text)) {
    //     const template = document.fileName.match(/([a-z]+\/[a-z_]+)\.liquid$/)[1];
    //     return getTagFormArguments(template);
    //   }
    // }

    const cursor = token.tagName === 'liquid'
      ? getLiquidTokenCursor(token, this.vars)
      : getTokenCursor(token, this.vars);

    /* -------------------------------------------- */
    /* ARGUMENTS                                    */
    /* -------------------------------------------- */

    if (cursor === Token.Argument) {

      if (!this.enable.objects) return null;

      if (token.filter && q.setFilter(token.filter)) {

        q.setType($.liquid.argument.type as Type);

        return getObjectCompletions(
          document,
          this.items.get(`object:${$.liquid.argument.type as any}`),
          this.vars
        );

      } else {

        if (token.filter === 't' && trigger === Char.COL) {
          return getLocaleArguments(token, trigger);
        }

        q.setType(null);

        return getObjectCompletions(
          document,
          this.items.get('objects'),
          this.vars
        );

      }
    }

    /* -------------------------------------------- */
    /* LOCALE ARGUMENT                              */
    /* -------------------------------------------- */

    if (cursor === Token.LocaleArgument && trigger === Char.COM) {
      return getLocaleArguments(token, trigger);
    }

    /* -------------------------------------------- */
    /* FILTERS                                      */
    /* -------------------------------------------- */

    if (cursor === Token.Filter && (
      trigger === Char.PIP ||
      trigger === Char.WSP ||
      triggerKind === CompletionTriggerKind.Invoke
    )) {

      q.setType(null);

      if (!this.enable.filters) return null;

      this.textEdits = insertSpace(position);

      if (token.type === Token.Tag) {
        return q.setTag(token.tagName) ? $.liquid.tag.filters ? this.items.get('filters') : null : null;
      }

      return this.items.get('filters');

    }

    /* -------------------------------------------- */
    /* LOCALES                                      */
    /* -------------------------------------------- */

    if (token.type === Token.Object) {
      if (
        trigger === Char.SQO ||
        trigger === Char.DQO || (
          cursor === Token.Locale &&
          trigger === Char.DOT
        )
      ) {

        return getLocaleCompletions(
          this.files.locales,
          token.locale,
          insertTranslate(position, token.text)
        );

      }
    }

    /* -------------------------------------------- */
    /* OBJECT PROPERTIES                            */
    /* -------------------------------------------- */

    if (trigger === Char.DOT || cursor === Token.Property || cursor === Token.Block) {

      if (!this.enable.objects) return null;

      const props = getPropertyCompletions(token, this.vars);

      if (props !== null && this.enable.schema) {

        const schema = this.json.sections.get(document.uri.fsPath);

        if (props === Token.SchemaSettings) {
          return getSectionCompletions(schema, props);
        }

        if (props === Token.SchemaBlock) {
          const type = getSectionScope(schema, content, offset);
          if (type !== null) {
            return getSectionCompletions(schema, props, type);
          }
        }
      }

      return props as CompletionItem[];

    }

    if (token.type === Token.Tag) {

      /* -------------------------------------------- */
      /* LIQUID TAG                                   */
      /* -------------------------------------------- */

      if (token.tagName === 'liquid') {

        if (cursor === Token.Object) {

          return this.enable.objects ? getObjectCompletions(
            document,
            this.items.get('objects'),
            this.vars,
            offset
          ) : null;

        }

        if ((trigger === Char.DQO || trigger === Char.SQO)) {

          q.setType(null);

          if (cursor === Token.ImportRender) {
            return this.items.get('snippets');
          }

          if (cursor === Token.ImportSection) {
            return this.items.get('sections');
          }

        }

        if (cursor === Token.LiquidTagFilterTag || cursor === Token.LiquidTagFilterObject) {
          return this.items.get('filters');
        }

        if (cursor === Token.LiquidTagToken) {
          return getLiquidTagSnippets();
        }

      }

      /* -------------------------------------------- */
      /* SCHEMA BLOCK TYPE                            */
      /* -------------------------------------------- */

      if (cursor === Token.SchemaBlockType && (trigger === Char.DQO || trigger === Char.SQO)) {

        if (!this.enable.schema) return null;

        const schema = this.json.sections.get(document.uri.fsPath);

        return getSectionCompletions(schema, cursor);

      }

      /* -------------------------------------------- */
      /* FILE IMPORTS                                 */
      /* -------------------------------------------- */

      if (cursor === Token.Import && (trigger === Char.DQO || trigger === Char.SQO)) {

        q.setType(null);

        if (token.tagName === 'render' || token.tagName === 'include') {
          return this.items.get('snippets');
        }

        if (token.tagName === 'section') {
          return this.items.get('sections');
        }

      }

      if (trigger === Char.WSP) {

        /* -------------------------------------------- */
        /* FOR LOOP ARRAY                               */
        /* -------------------------------------------- */

        if (cursor === Token.Array) {

          if (!this.enable.objects) return null;

          q.setType(Type.array);

          return getObjectCompletions(
            document,
            this.items.get(`object:${Type.array}`),
            this.vars,
            offset
          );

        }

        /* -------------------------------------------- */
        /* ASSIGNMENT                                   */
        /* -------------------------------------------- */

        if (cursor === Token.Assignment) {

          if (!this.enable.objects) return null;

          q.setType(null);

          return getObjectCompletions(
            document,
            this.items.get('objects'),
            this.vars,
            offset
          );

        }

        /* -------------------------------------------- */
        /* OPERATORS                                    */
        /* -------------------------------------------- */

        if (token.type === Token.Tag && cursor === Token.Logical) {

          return this.enable.operators
            ? this.items.get('operators')
            : null;

        }

      }

    }

    return null;

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
