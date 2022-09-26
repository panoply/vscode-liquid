import { q, liquid, Object as IObject,  Engine, Engines } from '@liquify/liquid-language-specs';
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
  prevWord
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
 * users something worthwhile having them wait so fucking long.
 *
 * Most of this will be purged and move to the Language Server
 * when Liquify supersedes. It is a shame because the specs can
 * do so much more in the grand scale and folks wont get to see that
 * until Liquify is made available.
 */
export class CompletionProvider implements CompletionItemProvider<CompletionItem> {

  constructor(engine: Engines) {

    if (engine === 'shopify') {
      q.setEngine(Engine.shopify)
      this.engine = engine === 'shopify' ? Engine.shopify : Engine.standard
    }


    this.tags = Object.entries(liquid.shopify.tags).map(getTagCompletions);
    this.filters = Object.entries(liquid.shopify.filters).map(getFilterCompletions);

    if (this.engine === Engine.shopify) {
      this.objects = Object.entries(liquid.shopify.objects).map(getObjectCompletions)
      this.common = getObjectKind(this.objects, [ CompletionItemKind.Module ])
      this.arrays = getObjectKind(this.objects, [ CompletionItemKind.Field ])
    }
  }

  /**
   * The variation engine
   */
  private engine: Engine;
  private textEdit: TextEdit[] = [];
  private padding: Position
  private delimeter: boolean

  /**
   * Tag Completions
   */
  private tags = Object
    .entries(liquid.shopify.tags)
    .map(getFilterCompletions);

  /**
   * Filter Completions
   */
  private filters = Object
    .entries(liquid.shopify.filters)
    .map(getFilterCompletions)

  /**
   * Object Completions
   */
  private objects: CompletionItem[] = []

  /**
   * Common Objects Completions
   */
  private common: CompletionItem[] = []

  /**
   * Common Objects Completions
   */
  private arrays: CompletionItem[] = []

  public triggers = [
    '%',
    '|',
    ':',
    ' '
  ];

  resolveCompletionItem(item: CompletionItem) {

    if (this.padding) item.label = item.label + ' '

    if (this.delimeter) {
      item.insertText = '{{ ' + item.label + ' }}'
    }

    if (this.textEdit) {
      item.additionalTextEdits = this.textEdit;
    }

    return item;

  }

  provideCompletionItems (document: TextDocument, position: Position, _token: CancellationToken, {
    triggerCharacter,
    triggerKind
  }) {


    const trigger = CompletionTriggerKind.TriggerCharacter === triggerKind
      ? triggerCharacter.charCodeAt(0)
      : false;

    const content = document.getText();
    const offset = document.offsetAt(position);

    q.reset()

    this.padding = null
    this.delimeter = null
    this.textEdit = null


    if (trigger === Char.PER) { // %
      const character = position.character - (trigger === ' ' ? 3 : 1);
      this.textEdit = [ TextEdit.insert(new Position(position.line, character), '{') ];
      return this.tags;
    }



    const object = parseToken(Token.Object, content, offset)

    if (object.within) {

      if (isEmptyObject(object.text)) return this.objects

      if (q.setObject(object.tagName) && q.isAllowed('filters')) {
        if (prevChar(object.text, object.offset, [Char.PIP])) {
          return this.filters
        }
      }

      if (trigger === Char.COL || prevChar(object.text, object.offset, [ Char.COL ])) {
        return this.common
      }

    }

    const tag = parseToken(Token.Tag, content, offset)


    if (tag.within) {


      if (isEmptyTag(object.text)) return this.tags

      if (prevWord(tag.text, tag.offset, Words.IN)) {
        return this.arrays
      }

      if (prevWord(tag.text, tag.offset, Words.AND) || Words.OR) {
        return this.common
      }

      // Proceed accordingly, else cancel the completion
      if ((trigger === Char.PIP || prevChar(tag.text, tag.offset, [ Char.PIP ]))) {
        return this.filters;
      }

      if (prevChar(tag.text, tag.offset, [ Char.COL, Char.EQL, Char.LAN, Char.RAN])) {
        return this.common
      }


    }



   // this.delimeter = true
   // return this.objects;

  }

}
