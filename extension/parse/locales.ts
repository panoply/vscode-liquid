import slash, { entries, keys } from 'utils';
import { join } from 'node:path';
import { $ } from '@liquify/specs';
import { mdLines } from 'parse/helpers';
import { path } from 'rambdax';
import { CompletionItemKind, CompletionItem, SnippetString, TextEdit } from 'vscode';

/**
 * Get Locale Schema
 *
 * Obtains locale specific schema
 */
export function LocaleSchema (key: string) {

  return $.liquid.files.has('locales_schema')
    ? path(key.slice(2), $.liquid.files.get('locales_schema'))
    : key;

}

/**
 * Get Locale Completions
 *
 * Generates starting property completions for Shopify locales.
 * Locales are `key > value` objects. This function will prepare
 * the entires for traversal by exposing keys of the locale file.
 */
export function getLocaleCompletions (
  uri: string,
  items: { [key: string]: object },
  additionalTextEdits: TextEdit[] = []
): CompletionItem[] {

  const location = slash(uri).split('/');
  const filename = location.pop();
  const dirname = location.pop();
  const detail = join(dirname, filename);

  return entries(items).map(([ label, props ]): CompletionItem => {

    const object = typeof props === 'object';
    const value = object
      ? keys(props).length
      : typeof props[label] === 'object'
        ? keys(props[label]).length : props;

    const documentation = object
      ? mdLines(`**${label}**`, `${value} available fields`, uri)
      : mdLines(`**${label}**`, `*\`${value}\`*`, uri);

    return {
      label,
      kind: CompletionItemKind.Module,
      detail,
      preselect: true,
      insertText: new SnippetString(label),
      additionalTextEdits,
      documentation
    };

  });
};
