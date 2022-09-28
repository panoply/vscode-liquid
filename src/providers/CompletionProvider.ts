import { q, liquid, Engine, Engines } from '@liquify/liquid-language-specs';
import { Char, Token, Words } from 'parse/enums';
import {
  getFilterCompletions,
  getObjectCompletions,
  getTagCompletions,
  parseToken,
  prevChar,
  isEmptyObject,
  isEmptyTag,
  getObjectKind,
  prevWord,
  parseObject
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
      this.engine = engine === 'shopify'
        ? Engine.shopify
        : Engine.standard;
    }

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

  private enable: Workspace.Completion = {
    tags: true,
    filters: true,
    objects: true
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

  provideCompletionItems (document: TextDocument, position: Position, token: CancellationToken, {
    triggerCharacter,
    triggerKind
  }) {

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

    const object = parseToken(Token.Object, content, offset);

    if (object.within) {

      if (isEmptyObject(object.text) && this.enable.objects) return this.objects;

      if (trigger === Char.PIP || prevChar(object.text, object.offset, [ Char.PIP ])) {
        return this.enable.filters ? this.filters : null;
      }

      if (trigger === Char.COL || prevChar(object.text, object.offset, [ Char.COL ])) {
        return this.enable.objects ? this.common : null;
      }

      if (trigger === Char.DOT && this.enable.objects) {
        return parseObject(object.text, object.offset);
      }

      return null;

    }

    const tag = parseToken(Token.Tag, content, offset);

    if (tag.within) {

      if (isEmptyTag(object.text) && this.enable.tags) return this.tags;

      if (this.enable.objects && prevWord(tag.text, tag.offset, [
        Words.AND,
        Words.IN,
        Words.OR,
        Words.CONTAINS
      ])) {
        return this.common;
      }

      // Proceed accordingly, else cancel the completion
      if ((trigger === Char.PIP || prevChar(tag.text, tag.offset, [ Char.PIP ]))) {
        return this.enable.filters ? this.filters : null;
      }

      if (prevChar(tag.text, tag.offset, [ Char.COL, Char.EQL, Char.LAN, Char.RAN ])) {
        return this.enable.objects ? this.common : null;
      }

      if (trigger === Char.DOT && this.enable.objects) {
        return parseObject(tag.text, tag.offset);
      }

      return null;
    }

  }

}
