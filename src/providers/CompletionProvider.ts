import { q, liquid, Engine, Engines } from '@liquify/liquid-language-specs';
import { Workspace } from 'types';
import { entries } from 'utils';
import { CompletionSection } from './CompletionSection';
import { JSONLanguageService } from 'service/JSONLanguageService';
import { Char, Token } from 'parse/enums';
import { EmptyTag, EmptyOutput } from 'parse/regex';
import {
  getFilterCompletions,
  getObjectCompletions,
  getTagCompletions,
  parseToken,
  prevChar,
  getObjectKind,
  parseObject,
  parseSchema,
  typeToken,
  getLogicalCompletions,
  getSchemaCompletions
} from 'parse/tokens';

import {
  CompletionItem,
  CompletionItemProvider,
  CompletionTriggerKind,
  TextDocument,
  Position,
  CancellationToken,
  TextEdit,
  CompletionItemKind
} from 'vscode';

/**
 * Completion Provider
 *
 * This provides some basic completions. I have extracted some
 * logic from Liquify to make this possible as I feel as if I owe
 * users something worthwhile having them wait so f*cking long.
 *
 * Most of this will be purged and move to the Language Server
 * when Liquify supersedes. It is a shame because the specs can
 * do so much more in the grand scale and folks wont get to see that
 * until Liquify is made available.
 */
export class CompletionProvider implements CompletionItemProvider<CompletionItem> {

  constructor (engine: Engines, enable: Workspace.Completion) {

    for (const active in enable) this.enable[active] = enable[active];

    if (engine === 'shopify') {

      q.setEngine(Engine.shopify);

      this.engine = engine === 'shopify' ? Engine.shopify : Engine.standard;
      this.section = new CompletionSection();

    }

    this.logical = getLogicalCompletions();

    if (this.enable.tags) {
      this.tags = entries(liquid.shopify.tags).map(getTagCompletions);
    }

    if (this.enable.filters) {
      this.filters = entries(liquid.shopify.filters).map(getFilterCompletions);
    }

    if (this.enable.schema) {
      this.schema = new JSONLanguageService();
    }

    if (this.engine === Engine.shopify) {
      this.objects = entries(liquid.shopify.objects).map(getObjectCompletions);
      this.common = getObjectKind(this.objects, [ CompletionItemKind.Module ]);
    } else {
      this.enable.objects = false;
    }
  }

  public update (enable: Workspace.Completion) {

    for (const active in enable) this.enable[active] = enable[active];

  }

  /**
   * Schema Completions
   */
  public schema: JSONLanguageService;

  /**
   * Section Completions
   */
  public section: CompletionSection;

  /**
   * Enabled completion state
   */
  private enable: Workspace.Completion = {
    tags: true,
    filters: true,
    objects: true,
    operators: true,
    section: true,
    schema: true
  };

  /**
   * The variation engine
   */
  private engine: Engine;

  /**
   * An additional text edit to be passed to the resolver
   */
  private textEdit: TextEdit[] = [];

  /**
   * Tag Completions
   */
  private tags: CompletionItem[];

  /**
   * Logical Operator Completions
   */
  private logical: CompletionItem[];

  /**
   * Filter Completions
   */
  private filters: CompletionItem[];

  /**
   * Object Completions
   */
  private objects: CompletionItem[];

  /**
   * Common Objects Completions
   */
  private common: CompletionItem[];

  /**
   * Resolve Completion Item
   *
   * The completion item resolver. In some situations
   * we need to apply additional text edits before resolving,
   * it's here we provide this logic.
   */
  resolveCompletionItem (item: CompletionItem) {

    if (this.textEdit) item.additionalTextEdits = this.textEdit;

    return item;

  }

  async provideCompletionItems (document: TextDocument, position: Position, _: CancellationToken, {
    triggerCharacter,
    triggerKind
  }) {

    const trigger = CompletionTriggerKind.TriggerCharacter === triggerKind
      ? triggerCharacter.charCodeAt(0)
      : false;

    const content = document.getText();
    const offset = document.offsetAt(position);

    this.textEdit = null;

    if (trigger === Char.DQO || trigger === Char.COL) {

      const isSchema = parseSchema(content, offset);

      if (isSchema !== false && isSchema.within) {

        const schema = this.schema.doParse(document, position, isSchema);
        const items = await this.schema.doCompletions(schema);

        return getSchemaCompletions(
          trigger === Char.DQO ? 1 : 0,
          position.line,
          position.character,
          items as any
        );

      }

    }

    if (trigger === Char.PER) {

      if (!this.enable.tags) return null;

      const character = position.character - (trigger === Char.WSP ? 3 : 1);

      this.textEdit = [ TextEdit.insert(new Position(position.line, character), '{') ];

      return this.tags;

    }

    const type = typeToken(content, offset);

    if (type === Token.Object) {

      const object = parseToken(Token.Object, content, offset);

      if (object.within) {

        if (EmptyOutput.test(object.text) && this.enable.objects) return this.objects;

        const prev = prevChar(object.text, object.offset);

        if (trigger === Char.PIP || prev === Token.Filter) {

          return this.enable.filters
            ? this.filters
            : null;

        }

        if (trigger === Char.DOT || prev === Token.Property || prev === Token.Block) {

          const schema = this.enable.objects
            ? parseObject(object.text, object.offset)
            : null;

          if (schema !== null && this.enable.section) {
            if (schema === 'settings') {

              return this.section.completions(
                content,
                offset,
                schema
              );

            } else if (schema === 'block') {

              const type = this.section.scope(content, offset);

              if (type !== null) {

                return this.section.completions(
                  content,
                  offset,
                  schema,
                  type
                );

              }
            }
          }

          return schema;

        }

        if (trigger === Char.COL || prev === Token.Object) {

          return this.enable.objects
            ? this.common
            : null;

        }

        return null;

      }

    } else if (type === Token.Tag) {

      const tag = parseToken(Token.Tag, content, offset);

      if (tag.within) {

        if (EmptyTag.test(tag.text) && this.enable.tags) return this.tags;

        const prev = prevChar(tag.text, tag.offset, tag.tagName);

        if (prev === Token.Block) {
          if (trigger === Char.DQO || trigger === Char.SQO) {

            return this.section.completions(
              content,
              offset,
              'type'
            );

          } else {

            return this.section.completions(
              content,
              offset,
              'type',
              'string'
            );

          }
        }

        if (trigger === Char.PIP || prev === Token.Filter) {

          return this.enable.filters
            ? this.filters
            : null;

        }

        if (trigger === Char.DOT || prev === Token.Property) {

          const schema = this.enable.objects
            ? parseObject(tag.text, tag.offset)
            : null;

          if (schema !== null && this.enable.section) {
            if (schema === 'settings') {

              return this.section.completions(
                content,
                offset,
                schema
              );

            } else if (schema === 'block') {

              const type = this.section.scope(content, offset);

              if (type !== null) {

                return this.section.completions(
                  content,
                  offset,
                  schema,
                  type
                );

              }
            }
          }

          return schema;

        }

        if (trigger === Char.COL || prev === Token.Object) {

          return this.enable.objects
            ? this.common
            : null;

        }

        if (prev === Token.Logical) return this.logical;

        return null;
      }

    }
  }

}
