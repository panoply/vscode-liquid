import { has } from 'rambdax';
import { entries } from '../utils';
import { basename } from 'node:path';
import {
  CompletionItemKind,
  MarkdownString,
  CompletionItem,
  SnippetString,
  Position,
  TextEdit
} from 'vscode';
import { ICompletionFiles } from '../providers/CompletionProvider';

/**
 * Generates Local description, the provided `type`
 * enum will determine the the text to return.
 *
 * - `1` Returns the _available fields_ type description.
 * - `2` Returns the _value_ of the locale property.
 */
function description (type: 1 | 2, label: string, value: string, uri: string) {

  const filename = basename(uri);
  const heading = `**${label}**\n\n${value}`;
  const linked = `\n\n---\n\n[${filename}](${uri})\n\n`;

  return type === 1
    ? new MarkdownString(`${heading} available fields ${linked}`)
    : new MarkdownString(`${heading} ${linked}`);

}

/**
 * Parse Locale Objects
 *
 * Similar to `parseObject` but instead provides locale file based completions.
 */
export function parseLocale (locales: ICompletionFiles['locales'], content: string, position: Position) {

  /**
   * Set Locale Items
   *
   * Sets the completion items that are passed to the completion resolver.
   * Extracts necessary values from the passed in specification record.
   */
  function ProvideLocales ([ label, props ]): CompletionItem {

    const value = typeof props === 'object'
      ? Object.keys(props).length
      : typeof props[label] === 'object'
        ? Object.keys(props[label]).length
        : props;

    return {
      label,
      kind: CompletionItemKind.Module,
      insertText: new SnippetString(label),
      additionalTextEdits: options.addFilter ? [
        TextEdit.insert(new Position(options.position.line, options.position.character + 2), '| t ')
      ] : [],
      documentation: typeof props === 'object'
        ? description(1, label, value, locales.path)
        : description(2, label, value, locales.path)
    };
  }

  const slice = content.slice(2, offset - 1);
  const match = slice.match(/[^\s"']*?$/);

  if (match === null) return null;

  const props = match[0].split('.').filter(Boolean);

  if (!has(props[0], locales.items)) return entries(locales.items).map(ProvideLocales as any);

  if (props.length === 1) {

    const next = locales.items[props[0]] || null;

    if (next === null) return null;
    return Object.entries(next).map(ProvideLocales as any);
  }

  return (function walk (next: string[], value: object) {

    if (!value) return null;
    if (!has(next[0], value)) return null;

    const object = value[next[0]];

    // We check if we have walked to the last property
    // to which we can then provide properties, if we haven't
    // we continuall walk the values
    return next.length > 1
      ? object && walk(next.slice(1), object)
      : typeof object === 'object' ? entries(object).map(ProvideLocales) : null;

  }(props.slice(1), locales.items[props[0]]));

}
