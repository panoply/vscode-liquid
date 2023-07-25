import { has } from 'rambdax';
import { SchemaSectionTag, SchemaSettings, SchemaSettingTypes } from 'types';
import { MarkdownString, CompletionItemKind } from 'vscode';
import { Type, Types } from '@liquify/specs';

export const Tag = (name: string) => new RegExp(`{%-?\\s*\\b${name}\\b\\s+-?%}`);

/* -------------------------------------------- */
/* EXPRESSIONS                                  */
/* -------------------------------------------- */

/**
 * Schema Start
 */
export const SchemaStart = /{%-?\s*\bschema\b\s*-?%}/;

/**
 * Schema End
 */
export const SchemaEnd = /{%-?\s*\bschema\b\s*-?%}/;

/**
 * Control Names, eg: `if|elsif|case|when|unless`
 */
export const ControlNames = /if|elsif|case|when|unless/;

/**
 * If Control Names, eg:`if|elsif|unless`
 */
export const IfControlNames = /if|elsif|unless/;

/**
 * Case Control Names, eg:`case|when`
 */
export const CaseControlNames = /case|when/;

/**
 * Operators, eg: `([!=]=|[<>]=?|(?:and|or|contains|in|with)\b)`
 */
export const Operators = /([!=]=|[<>]=?|(?:and|or|contains))/;

/**
 * Empty Output, eg: `/{{-?\s*-?}}/`
 */
export const EmptyOutput = /{{-?\s*-?}}/;

/**
 * Empty Tag, eg: `/{%-?\s*-?%}/`
 */
export const EmptyTag = /{%-?\s*-?%}/;

/**
 * An empty tag ender, eg: `/^\s*-?%}/`
 */
export const EmptyEnder = /^\s*-?%}/;

export function schemaType (schema: SchemaSectionTag) {

  if (has('blocks', schema) && schema.blocks.length > 0) {

    const types = schema.blocks.map(block => block.type).join('|');

    return new RegExp(`(?:\\bwhen\\s+|==\\s*)["']\\b(${types})['"]`, 'g');

  }

  return false;
}

/**
 * Markdown String
 *
 * Returns an instance of `Markdown` to be rendered.
 */
export function mdString (description: string, reference?: {
  name: string;
  url: string;
}) {

  const md = new MarkdownString();

  md.supportThemeIcons = true;
  md.supportHtml = true;
  md.appendMarkdown(description);

  if (
    reference &&
    has('name', reference) &&
    has('url', reference)) md.appendMarkdown(`\n\n[${reference.name}](${reference.url})`);

  return md;

}

/**
 * Markdown String
 *
 * Returns an instance of `Markdown` to be rendered.
 */
export function mdLines (title: string, description: string, url: string) {

  const md = new MarkdownString();

  md.supportThemeIcons = true;
  md.supportHtml = true;
  md.appendMarkdown(title + '\n\n' + description + '\n\n' + url);

  return md;

}

/**
 * Generate Section Liquid Documentation
 *
 * Composes documentation for `block.settings.*` and similar Liquid
 * type completions.
 */
export function mdSchema (setting: SchemaSettings & { default?: string}) {

  const defaults = has('default', setting) ? `\nDefault: \`${setting.default}\`` : '';

  const md = new MarkdownString();

  md.supportThemeIcons = true;
  md.supportHtml = true;
  md.appendMarkdown(`${setting.info || setting.label}\n${defaults}`);

  return md;
}

/**
 * Get Schema Completion Kind
 *
 * Returns the `CompletionItemKind` enum reference that
 * should be applied to the generated completion item.
 */
export function kind (type: SchemaSettingTypes) {

  switch (type) {
    case 'color':
    case 'color_background':
      return CompletionItemKind.Color;
    case 'text':
    case 'textarea':
    case 'richtext':
    case 'inline_richtext':
    case 'html':
    case 'liquid':
    case 'url':
      return CompletionItemKind.Value;
    case 'article':
    case 'blog':
    case 'product':
    case 'product_list':
    case 'page':
    case 'image_picker':
    case 'font_picker':
      return CompletionItemKind.Module;
    case 'checkbox':
    case 'range':
    case 'select':
    case 'number':
    case 'radio':
      return CompletionItemKind.Constant;
    default:
      return CompletionItemKind.Property;
  }

}

export function objectKind (type: Type) {

  switch (type) {
    case Type.string:
    case Type.boolean:
    case Type.number:
      return CompletionItemKind.Field;
    case Type.object:
      return CompletionItemKind.Module;
    case Type.array:
      return CompletionItemKind.Method;
    default:
      return CompletionItemKind.Property;
  }

}

/**
 * Get Completion Detail
 *
 * Returns the `CompletionItemKind` enum reference that
 * should be applied to the generated completion item.
 */
export function detail (type: Types.Basic | Type) {

  switch (type) {
    case Type.string: return 'string';
    case Type.array: return 'array';
    case Type.boolean: return 'boolean';
    case Type.number: return 'number';
    case Type.nil: return 'nil';
    case Type.object: return 'object';
    case Type.unknown: return 'unknown';
    default:
      return 'any';
  }

}

/**
 * Get Completion Type
 *
 * Returns the reversed enum reference
 */
export function isType (detail: string, match: Type | Types.Basic | Types.Argument) {

  if (detail === 'string') return Type.string === match;
  if (detail === 'array') return Type.array === match;
  if (detail === 'boolean') return Type.boolean === match;
  if (detail === 'number') return Type.number === match;
  if (detail === 'object') return Type.object === match;

  return false;

}
