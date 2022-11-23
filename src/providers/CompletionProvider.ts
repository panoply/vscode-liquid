import { q, liquid, Engine, Engines } from '@liquify/liquid-language-specs';
import { Char, Token } from 'parse/enums';
import {
  getFilterCompletions,
  getObjectCompletions,
  getTagCompletions,
  parseToken,
  prevChar,
  isEmptyObject,
  isEmptyTag,
  getObjectKind,
  parseObject,
  determineToken,
  getLogicalCompletions

} from 'parse/tokens';
import { Workspace } from 'types';
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
import { CompletionSchema } from './CompletionSchema';

/**
 * Completion Provider
 *
 * This provides some basic completions. I have extracted some
 * logic from Liquify to make this possible as I feel as if I owe
 * users something worthwhile having them wait so fucking long.
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
      this.schema = new CompletionSchema();
    }

    this.logical = getLogicalCompletions();

    if (this.enable.tags) {
      this.tags = Object.entries(liquid.shopify.tags).map(getTagCompletions);
    }

    if (this.enable.filters) {
      this.filters = Object.entries(liquid.shopify.filters).map(getFilterCompletions);
    }

    if (this.engine === Engine.shopify) {
      this.objects = Object.entries(liquid.shopify.objects).map(getObjectCompletions);
      this.common = getObjectKind(this.objects, [ CompletionItemKind.Module ]);
    } else {
      this.enable.objects = false;
    }
  }

  public update (enable: Workspace.Completion) {
    for (const active in enable) {
      this.enable[active] = enable[active];
    }
  }

  /**
   * Logical Operator Completions
   */
  public schema: CompletionSchema;

  private enable: Workspace.Completion = {
    tags: true,
    filters: true,
    objects: true,
    operators: true
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
   * Trigger Characters
   */
  public triggers = [
    '%',
    '|',
    ':',
    '.',
    ' '
  ];

  resolveCompletionItem (item: CompletionItem) {

    if (this.textEdit) item.additionalTextEdits = this.textEdit;

    return item;

  }

  provideCompletionItems (
    document: TextDocument,
    position: Position,
    token: CancellationToken, {
      triggerCharacter,
      triggerKind
    }
  ) {

    const trigger = CompletionTriggerKind.TriggerCharacter === triggerKind
      ? triggerCharacter.charCodeAt(0)
      : false;

    const content = document.getText();
    const offset = document.offsetAt(position);

    this.textEdit = null;

    if (trigger === Char.PER) { // %
      if (!this.enable.tags) return null;
      const character = position.character - (trigger === ' ' ? 3 : 1);
      this.textEdit = [ TextEdit.insert(new Position(position.line, character), '{') ];
      return this.tags;
    }

    const tokenType = determineToken(content, offset);

    if (tokenType === Token.Object) {

      const object = parseToken(Token.Object, content, offset);

      if (object.within) {

        if (isEmptyObject(object.text) && this.enable.objects) return this.objects;

        const prev = prevChar(object.text, object.offset);

        if (trigger === Char.PIP || prev === Token.Filter) {
          return this.enable.filters ? this.filters : null;
        }

        if (trigger === Char.DOT || prev === Token.Property) {

          const schema = this.enable.objects
            ? parseObject(
              object.text,
              object.offset
            )
            : null;

          if (schema === 'settings') return this.schema.completions(content, schema);

          return schema;
        }

        if (trigger === Char.COL || prev === Token.Object) {
          return this.enable.objects ? this.common : null;
        }

        return null;

      }

    } else if (tokenType === Token.Tag) {

      const tag = parseToken(Token.Tag, content, offset);

      if (tag.within) {

        if (isEmptyTag(tag.text) && this.enable.tags) return this.tags;

        const prev = prevChar(tag.text, tag.offset, tag.tagName);

        if (trigger === Char.PIP || prev === Token.Filter) {
          return this.enable.filters ? this.filters : null;
        }

        if (trigger === Char.DOT || prev === Token.Property) {

          const schema = this.enable.objects
            ? parseObject(tag.text, tag.offset)
            : null;

          if (schema === 'settings') return this.schema.completions(content, schema);

          return schema;
        }

        if (trigger === Char.COL || prev === Token.Object) {
          return this.enable.objects ? this.common : null;
        }

        if (prev === Token.Logical) return this.logical;

        return null;
      }

    }
  }

}
