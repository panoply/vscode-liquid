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

  const defaults = has('default', setting) ? `\nDefault: \`${setting.default}\`` : '';

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

/**
 * Parse Object
 *
 * Parses an object from current content offset location.
 * The resulting logical walks the Liquid Language Specifications.
 */
export function parseObject (content: string, offset: number, settings?: SettingsData[]) {

  const slice = content.slice(2, offset - 1);
  const match = slice.match(/[^\s{<=>:]*?$/);

  if (match === null) return null;

  const props = match[0].split('.').filter(Boolean);

  if (props[0] === 'settings') {

    const setting = ProvideSettings(settings);

    return props.length === 1
      ? setting.props
      : props.length === 2 ? setting.items[props[1]] : null;

  }

  if (props[1] === 'settings' && props.length === 2) {
    if (props[0] === 'section') {
      return 'settings';
    } else if (props[0] === 'block') {
      return 'block';
    }
  }

  if (!has(props[0], liquid.shopify.objects)) return null;

  if (props.length === 1) {
    const { properties = null } = liquid.shopify.objects[props[0]];
    if (properties === null) return null;
    return Object.entries(properties).map(ProvideProps as any);
  }

  return (function walk (next: string[], value: Properties) {

    if (!value) return null;
    if (!has(next[0], value)) return null;
    if (!has('properties', value[next[0]])) return null;

    const object = value[next[0]].properties;

    // We check if we have walked to the last property
    // to which we can then provide properties, if we haven't
    // we continuall walk the values
    return next.length > 1
      ? object && walk(next.slice(1), object)
      : object ? Object.entries(object).map(ProvideProps as any) : null;

  }(props.slice(1), liquid.shopify.objects[props[0]].properties));
}
