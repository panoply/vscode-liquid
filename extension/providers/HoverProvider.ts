import { mdString } from 'parse/helpers';
import { $, IObject } from '@liquify/specs';
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

export function getPropertyHover (token: string, objects: string[]) {

  if (!$.liquid.data.variation?.objects) return null;

  const prop = objects.indexOf(token);
  const root = $.liquid.data.variation.objects[objects[0]];

  if (!root) return null;

  let spec: IObject = root?.properties;
  let walk: number = 1;

  while (prop < walk) spec = spec.properties?.[objects[walk++]];

  if (!prop) return null;

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

    if (this.enable.schema === true) {

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

      if (hover === null) return null;

      return new Hover(hover);
    }

    return null;

  }

}
