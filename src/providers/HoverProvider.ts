import { $, Object as IObject } from '@liquify/liquid-language-specs';
import { parseSchema } from 'parse/tokens';
import { JSONLanguageService } from 'service/JSONLanguageService';
import { Workspace } from 'types';

import {
  TextDocument,
  Position,
  CancellationToken,
  Hover,
  MarkdownString
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

  return documentation(cursor.description, cursor.reference);

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

  return documentation(spec.description, root.reference);

}

/**
 * Looks for match within values
 */
export function documentation (
  description: string,
  reference: {
    name: string,
    url: string
  }
): MarkdownString {

  if (!description && !reference?.name) return null;

  if (!reference?.name) return null;

  const contents = description +
    '\n\n' +
    '---' +
    '\n\n' +
    '[' + reference.name + ']' +
    '(' + reference.url + ')' +
    '\n\n';

  return new MarkdownString(contents);

};

/**
 * Hover Provider
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
export function HoverProvider (canHover: Workspace.Hover, service: JSONLanguageService) {

  return {
    async  provideHover (document: TextDocument, position: Position, _: CancellationToken): Promise<Hover> {

      const offset = document.offsetAt(position);

      if (canHover.schema === true) {

        const schema = parseSchema(document.getText(), offset);

        if (schema !== false && schema.within) {
          const parse = service.doParse(document, position, schema);
          const hover = await service.doHover(parse);
          return new Hover(hover as any);
        }
      }

      if (canHover.tags === true) {

        const range = document.getWordRangeAtPosition(position);
        const word = document.getText(range);
        const hover = getTagHover(word);

        if (hover === null) return null;

        return new Hover(hover);
      }

      return null;

    }
  };
}
