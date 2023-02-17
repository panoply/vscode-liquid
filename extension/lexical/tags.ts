import { entries, keys } from '../utils';
import { basename, join } from 'node:path';
import { Filter, Tags, Object as IObject, Type } from '@liquify/liquid-language-specs';
import * as md from '../completions/helpers/markdown';
import {
  CompletionItemKind,
  CompletionItem,
  SnippetString,
  CompletionItemTag,
  Position,
  Range,
  TextEdit,
  Uri
} from 'vscode';

/**
 * Get Logical Completions
 *
 * Generates the logical conditional based completion
 * items used within control type tokens.
 */
export function getOperatorCompletions (items: CompletionItem[]): CompletionItem[] {

  return items;

}

/**
 * Set Object Type
 *
 * Sets the object completion item kind symbol.
 * This is also used for filtering completions so
 * otherwise invalid items don't show up at certain entries.
 */
export function getItemKind (type: Type): CompletionItemKind {

  if (type === Type.constant) {
    return CompletionItemKind.Constant;
  }

  if (type === Type.array) {
    return CompletionItemKind.Field;
  }

  if (type === Type.object) {
    return CompletionItemKind.Module;
  }

  // @ts-ignore
  if (type === Type.data) return CompletionItemKind.Value;

};

/**
 * Get Schema Completions
 *
 * Generates the completion items for the `{% schema %}` code block
 * region. The items and cherry picked from the JSON Language Service
 * parsed JSON content.
 */
export function getSchemaCompletions (
  slice: number,
  line: number,
  character: number,
  items: CompletionItem[]
): CompletionItem[] {

  return items.map(({
    label,
    documentation,
    textEdit,
    kind
  }: CompletionItem & { documentation: { value: string } }) => {

    const range = {
      inserting: new Range(
        new Position(line, character),
        new Position(line, textEdit.range.end.character)
      ),
      replacing: new Range(
        new Position(line, character),
        new Position(line, textEdit.range.end.character)
      )
    };

    return {
      label,
      kind,
      insertText: new SnippetString(textEdit.newText.slice(slice)),
      documentation: md.string(documentation.value),
      range
    };

  });

}

/**
 * Get File Completions
 *
 * Generates file names of snippets when referencing them via
 * `{% render %}` type tags.
 */
export function getFileCompletions (files: Set<Uri>): CompletionItem[] {

  return Array.from(files).map((file): CompletionItem => {

    const { fsPath } = file;
    const label = basename(fsPath, '.liquid');
    const location = fsPath.split('/');
    const filename = location.pop();
    const dirname = location.pop();

    return {
      label,
      kind: CompletionItemKind.File,
      insertText: new SnippetString(label),
      preselect: true,
      detail: join(dirname, filename),
      documentation: md.string(`[${label}.liquid](${file.fsPath})`)
    };

  });

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

  const reference = `[${basename(uri)}](${uri})`;
  const location = uri.split('/');
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
      ? md.lines(`**${label}**`, `${value} available fields`, reference)
      : md.lines(`**${label}**`, `*\`${value}\`*`, reference);

    return {
      label,
      kind: CompletionItemKind.Module,
      detail,
      insertText: new SnippetString(label),
      additionalTextEdits,
      documentation
    };

  });
};

/**
 * Get Object Completions
 *
 * Generates the object completions to be used. This logic is
 * partially lifted from the specs. It's a temporary solution
 * as this is handled in Liquify.
 */
export function getObjectCompletions (items: IObject): CompletionItem[] {

  return entries(items).map(([ label, object ]): CompletionItem => {

    return {
      label,
      tags: object.deprecated
        ? [ CompletionItemTag.Deprecated ]
        : [],
      kind: object.const
        ? CompletionItemKind.Constant
        : getItemKind(object.type),
      documentation: md.string(object.description, object.reference)
    };

  });
};

/**
 * Get Filter Completions
 *
 * Generates the Filter completions to be used. This logic is
 * partially lifted from the specs. It's a temporary solution
 * as this is handled in Liquify.
 */
export function getFilterCompletions (items: Filter): CompletionItem[] {

  return entries(items).map(([
    label,
    {
      description,
      deprecated = false,
      reference = null,
      snippet
    }
  ]): CompletionItem => {

    const insertText = new SnippetString(snippet || label);

    return {
      label,
      kind: CompletionItemKind.Value,
      tags: deprecated ? [ CompletionItemTag.Deprecated ] : [],
      insertText,
      preselect: true,
      documentation: md.string(description, reference)
    };
  });
}

/**
 * Get Tag Completions
 *
 * Generates the tag completions to be used. This tag completions
 * are generated at runtime and the `items` parameter expects a Liquid
 * specification reference structure.
 */
export function getTagCompletions (items: Tags): CompletionItem[] {

  return entries(items).map(([
    label,
    {
      description,
      reference,
      deprecated = false,
      singular = false,
      snippet = '$1'
    }
  ]): CompletionItem => {

    const insertText = label === 'else'
      ? new SnippetString(` ${label} %}$0`)
      : label === 'liquid'
        ? new SnippetString(` ${label} ${snippet} %}$0`)
        : singular
          ? new SnippetString(` ${label} ${snippet} %}$0`)
          : new SnippetString(` ${label} ${snippet} %} $0 {% end${label} %}`);

    return {
      label,
      kind: CompletionItemKind.Keyword,
      tags: deprecated ? [ CompletionItemTag.Deprecated ] : [],
      insertText,
      preselect: true,
      documentation: md.string(description, reference)
    };

  });

}
