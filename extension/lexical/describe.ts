import { basename } from 'node:path';
import { has } from 'rambdax';
import { SchemaSettings } from '../types';
import { MarkdownString } from 'vscode';

/* -------------------------------------------- */
/* UTILITIES                                    */
/* -------------------------------------------- */

/**
 * Generate Documentation
 *
 * Composes a Markdown string from Liquid Language Specifications.
 */
export function getTokenDescription (description: string, reference?: { name?: string; url: string; }) {

  if (reference && has('name', reference) && has('url', reference)) {
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
export function getSectionDescription (setting: SchemaSettings & { default?: string}) {

  const defaults = has('default', setting) ? `\nDefault: \`${setting.default}\`` : '';

  return new MarkdownString(`${setting.info || setting.label}\n${defaults}`);

}

/**
 * Generates Local description, the provided `type`
 * enum will determine the the text to return.
 *
 * - `1` Returns the _available fields_ type description.
 * - `2` Returns the _value_ of the locale property.
 */
export function getLocaleDescription (type: 1 | 2, label: string, value: string, uri: string) {

  const filename = basename(uri);

  if (type === 1) {
    return new MarkdownString(`\`${label}\`\n\n${value} available fields\n\n---\n\n[${filename}](${uri})\n\n`);
  }

  return new MarkdownString(`\`${label}\`\n\n${value}\n\n---\n\n[${filename}](${uri})\n\n`);

}

/**
 * Generate Section Liquid Documentation
 *
 * Composes documentation for `block.settings.*` and similar Liquid
 * type completions.
 */
export function getSettingsDescription (setting: SchemaSettings & { default?: string}) {

  const defaults = has('default', setting) ? `\nDefault: \`${setting.default}\`` : '';

  return new MarkdownString(`${setting.info || setting.label}\n${defaults}`);

}
