import { Type } from '@liquify/liquid-language-specs';
import { CompletionItemKind, MarkdownString, CompletionItem, SnippetString } from 'vscode';

export function captures () {

}

export function getVariableCompletions (vars: Map<string, {
  start: number,
  ender: number,
  value: string,
  detail: string,
  type: Type,
  keyword: string
}>): CompletionItem[] {

  const items: CompletionItem[] = [];

  for (const item of vars.values()) {

    items.push({
      label: item.keyword,
      kind: CompletionItemKind.Variable,
      insertText: new SnippetString(item.keyword),
      detail: item.detail,
      documentation: new MarkdownString(`${item.value}`)
    });

  }

  return items;

}
/**
 * Parse Token
 *
 * Extract the Liquid token from an offset position. This is used to determine which completions
 * should be shown and provided via the completion provider. The returned object can be used to
 * determine the token and reason about with it.
 */
export async function assigns (content: string, store: Map<string, {
  start: number,
  ender: number,
  value: string,
  detail: string,
  type: Type,
  keyword: string
}>) {

  if (!store) return;

  // First, we clear the current assignment stores
  store.clear();

  // Lets grab the content length for perf reasons
  const size = content.length;

  let i = 0;

  do {

    const tag = content.indexOf('assign', i);

    // Skip traversal, no more assignments exist
    //
    if (tag < 0) break;

    // Begin tag analysis for the starting point
    //
    if (/{%-?$/.test(content.slice(0, tag).trimEnd())) {

      const close = content.indexOf('%}', tag);
      const equal = content.indexOf('=', tag + 6) + 1;

      let value = content.slice(equal).trimStart();

      if (!value) continue;

      let type: Type;
      let detail: string;

      if (value[0] === '"' || value[0] === "'") {

        const quote = content.indexOf(value[0], equal);

        type = Type.string;
        value = content.slice(quote + 1, content.indexOf(value[0], quote + 1)).trim();
        detail = 'string';

      } else {

        if (/^-?\d[.\d]+?\s/.test(value)) {

          type = Type.number;
          detail = 'number';

        } else if (/^\b(true|false|nil)\b\s/.test(value)) {

          type = Type.boolean;
          detail = 'boolean';

        } else if (/^[a-z_-]+\s/i.test(value)) {

          type = Type.keyword;
          detail = 'keyword or object';

        } else if (/[a-z0-9_-]+[.['"]+/i.test(value)) {

          type = Type.object;
          detail = 'object';

        } else {

          type = Type.unknown;
          detail = 'unknown';

        }

        value = value.match(/.*?(?=[|\s])/)[0];

      }

      const keyword = content.slice(tag + 6, equal - 1).trim();

      store.set(keyword, {
        start: tag,
        ender: close,
        keyword: content.slice(tag + 6, equal - 1).trim(),
        value,
        detail,
        type
      });

      i = close + 2;

    }

    i = i + 1;

  } while (i < size);
}
