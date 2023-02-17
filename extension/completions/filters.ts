import { has } from 'rambdax';
import { Completions, SchemaSectionTag, SchemaSettings, SettingsData, Char, Token } from '../types';
import { entries, isString } from '../utils';
import { basename } from 'node:path';
import parseJson from 'parse-json';
import * as r from './regex';
import {
  liquid,
  Tag,
  Filter,
  Object as IObject,
  Type,
  Types as ITypes,
  Properties
} from '@liquify/liquid-language-specs';
import {
  CompletionItemKind,
  MarkdownString,
  CompletionItem,
  SnippetString,
  CompletionItemTag,
  Position,
  Range,
  TextEdit,
  TextDocument
} from 'vscode';
import { getCompletionKind } from './schema';
import { ICompletionFiles } from '../providers/CompletionProvider';

/* -------------------------------------------- */
/* UTILITIES                                    */
/* -------------------------------------------- */

/**
 * Generate Documentation
 *
 * Composes a Markdown string from Liquid Language Specifications.
 */
function documentation (description: string, reference?: { name?: string; url: string; }) {

  if (
    reference &&
    has('name', reference) &&
    has('url', reference)) {

    return new MarkdownString(`${description}\n\n[${reference.name}](${reference.url})`);

  }

  return new MarkdownString(description);

}

/**
 * Generate Section Liquid Documentation
 *
 * Composes documentation for `block.settings.*` and similar Liquid
 * type completions.
 */
export function getSchemaDocumentation (setting: SchemaSettings & { default?: string}) {

  const defaults = has('default', setting)
    ? `\nDefault: \`${setting.default}\``
    : '';

  return new MarkdownString(`${setting.info || setting.label}\n${defaults}`);

}

/**
 * Set Object Type
 *
 * Sets the object completion item kind symbol.
 * This is also used for filtering completions so
 * otherwise invalid items don't show up at certain entries.
 */
function setObjectType (type: Type | ITypes.Basic): CompletionItemKind {

  if (type === Type.array) return CompletionItemKind.Field;
  if (type === Type.object) return CompletionItemKind.Module;

  // @ts-ignore
  if (type === Type.data as any) return CompletionItemKind.Value;

};

/* -------------------------------------------- */
/* EXPORTS                                      */
/* -------------------------------------------- */

/**
 * Get Tag Completions
 *
 * Generates the tag completions to be used. This logic is
 * partially lifted from the specs. It's a temporary solution
 * as this is handled in Liquify.
 */
export function getTagCompletions ([
  label,
  {
    description,
    reference,
    deprecated = false,
    singular = false,
    snippet = '$1'
  }
]: [
  string,
  Tag
]): CompletionItem {

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
    documentation: documentation(description, reference)
  };

}

/**
 * Get Filter Completions
 *
 * Generates the Filter completions to be used. This logic is
 * partially lifted from the specs. It's a temporary solution
 * as this is handled in Liquify.
 */
export function getFilterCompletions ([
  label,
  {
    description,
    deprecated = false,
    reference = null,
    snippet
  }
]: [
  string,
  Filter
]): CompletionItem {

  const insertText = new SnippetString(snippet || label);

  return {
    label,
    kind: CompletionItemKind.Value,
    tags: deprecated ? [ CompletionItemTag.Deprecated ] : [],
    insertText,
    documentation: documentation(
      description,
      reference
    )
  };

}
