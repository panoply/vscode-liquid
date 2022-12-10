import { Char } from 'parse/enums';
import { getSchemaDocumentation, getCompletionKind, parseSchema } from 'parse/tokens';
import { has } from 'rambdax';
import { SchemaSectionTag } from 'types';
import { CompletionItem, CompletionItemKind } from 'vscode';

/**
 * Schema block type completions
 */
function getSchemaBlockTypes (schema: SchemaSectionTag, type: string) {

  const items: CompletionItem[] = [];

  for (const block of schema.blocks) {

    items.push({
      label: block.type,
      documentation: getSchemaDocumentation(block as any),
      kind: CompletionItemKind.TypeParameter,
      insertText: type === 'string' ? `"${block.type}"` : block.type
    });
  }

  return items;

}

/**
 * Schema settings completions
 */
function getSchemaSettings (schema: SchemaSectionTag) {

  const items: CompletionItem[] = [];

  for (const setting of schema.settings) {

    if (setting.id === undefined) continue;

    items.push({
      label: setting.id,
      insertText: setting.id,
      detail: `${setting.type} (settings)`,
      documentation: getSchemaDocumentation(setting as any),
      kind: getCompletionKind(setting.type)
    });

  }

  return items;
}

/**
 * Schema blocks completions
 */
function getSchemaBlockSettings (schema: SchemaSectionTag, type: string) {

  const block = schema.blocks.find(block => block.type === type);
  const item: CompletionItem[] = [];

  if (!has('settings', block)) return item;

  for (const setting of block.settings) {

    if (setting.id === undefined) continue;

    item.push({
      label: setting.id,
      insertText: setting.id,
      detail: `${setting.type} (${type})`,
      documentation: getSchemaDocumentation(setting as any),
      kind: getCompletionKind(setting.type)
    });

  }

  return item;

}

/**
 * Generates completion items to provided on Liquid tokens
 */
export function getSectionCompletions (
  content: string,
  offset: number,
  prop: 'settings' | 'block' | 'type',
  type?: string
) {

  const schema = parseSchema(content, offset);

  if (!schema) return null;

  const parsed = schema.parsed();

  if (has('settings', parsed) && prop === 'settings') return getSchemaSettings(parsed);

  if (has('blocks', parsed)) {
    if (prop === 'type') return getSchemaBlockTypes(parsed, type);
    if (prop === 'block') return getSchemaBlockSettings(parsed, type);
  }

  return null;

}

/**
 * Obtains regional based scope, based on the last
 * known schema block type
 */
export function getSectionScope (content: string, offset: number) {

  const string = content.slice(0, offset);
  const match = string.match(/\bcase\b\s+\bblock\.type|block\.type\s*==\s*[^"']/g);

  if (match === null) return null;

  const type = match.pop();
  const last = string.lastIndexOf(type) + type.length;

  if (type.startsWith('case')) {

    const cond = string.lastIndexOf('when', offset) + 4;
    const when = string.slice(cond).trimStart();

    return (when.charCodeAt(0) !== Char.DQO && when.charCodeAt(0) !== Char.SQO)
      ? null
      : when.slice(1, when.indexOf(when[0], 1));

  }

  return string.slice(last + 1, string.indexOf(type[type.length - 1], last) - 1);

}
