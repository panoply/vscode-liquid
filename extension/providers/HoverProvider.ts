import { mdString } from 'parse/helpers';
import { $, IProperty, q } from '@liquify/specs';
import { Service } from 'services';
import {
  CancellationToken,
  Hover,
  HoverProvider as IHoverProvider,
  Position,
  TextDocument
} from 'vscode';

export function getTagHover (word: string) {

  if (!word) return null;
  if (word.startsWith('end')) word = word.slice(3);

  const cursor = (
    // $.liquid.data.variation?.objects?.[word] ||
    $.liquid.data.variation.tags?.[word] ||
    $.liquid.data.variation.filters?.[word]
  );

  if (!cursor) return null;

  return mdString(cursor.description, cursor.reference);

}

function walkProps (cursor: string, next: string[], object: IProperty) {

  if (next.length > 0 && q.isProperty(next[0])) {

    const prop = next.shift();
    const item = object[prop];

    if (item === cursor) return item;

    return walkProps(cursor, next, object[prop]);

  }

  return object;

}

export function getPropertyHover (cursor: string, token: string, objects: string[]) {

  if (!$.liquid.data.variation?.objects) return null;

  const root = $.liquid.data.variation.objects[token];

  if (!root) return null;

  if (cursor === token) {
    return mdString(root.description, root.reference);
  }

  const prop = objects.shift();
  const spec = walkProps(cursor, objects, root.properties[prop]);

  return mdString(spec.description, root.reference);

}

export interface IHoverEnable {
  /**
   * Whether or not tag hovers are enabled
   *
   * @default true
   */
  tags: boolean;
  /**
   * Whether or not filter hovers are enabled
   *
   * @default true
   */
  filters: boolean;
  /**
   * Whether or not object hovers are enabled
   *
   * @default true
   */
  objects: boolean;
  /**
   * Whether or not schema embedded JSON hovers are enabled
   *
   * @default true
   */
  schema: boolean;
  /**
   * Whether or not section schema completions are enabled
   *
   * **NOT YET AVAILABLE**
   *
   * @default true
   */
  sections?: boolean;
}

export class HoverProvider extends Service implements IHoverProvider {

  /* -------------------------------------------- */
  /* STATE                                        */
  /* -------------------------------------------- */

  public enable: IHoverEnable = {
    filters: true,
    objects: true,
    tags: true,
    schema: true
  };

  /* -------------------------------------------- */
  /* PROVIDERS                                    */
  /* -------------------------------------------- */

  /**
   * Provide a hover for the given position and document. Multiple hovers at the same
   * position will be merged by the editor. A hover can have a range which defaults
   * to the word range at the position when omitted.
   *
   * @param document The document in which the command was invoked.
   * @param position The position at which the command was invoked.
   * @param token A cancellation token.
   * @return A hover or a thenable that resolves to such. The lack of a result can be
   * signaled by returning `undefined` or `null`.
   */
  async provideHover (document: TextDocument, position: Position, _token: CancellationToken): Promise<Hover> {

    if (this.enable.schema === true && this.json.schema.has(document.uri.fsPath)) {

      const offset = document.offsetAt(position);
      const schema = this.json.schema.get(document.uri.fsPath);

      if (offset > schema.begin && offset < schema.ender) {
        const parse = this.json.doParse(document, position, schema);
        const hover = await this.json.doHover(parse);
        return new Hover(hover as any);
      }
    }

    if (this.enable.tags === true) {

      const range = document.getWordRangeAtPosition(position);
      const word = document.getText(range);
      const hover = getTagHover(word);

      if (hover === null) {

        if (this.enable.objects === true) {

          const range = document.getWordRangeAtPosition(position, /[a-zA-Z][\w.]+/);
          const words = document.getText(range).split('.').filter(Boolean);
          const hover = getPropertyHover(word, words.shift(), words);

          if (hover === null) return null;

          return new Hover(hover);

        }

        return null;

      }
      return new Hover(hover);
    }

    return null;

  }

}
