import { Complete, SchemaBlocks, SchemaSectionTag, SchemaSettings, Token } from 'types';
import { CompletionItem, CompletionItemKind } from 'vscode';
import { $ } from '@liquify/specs';
import { kind, mdSchema, schemaType } from 'parse/helpers';
import { isArray, isObject } from 'utils';

export function getSharedSchemaRef <T = any> (reference: string): {
  file: string;
  prop: string;
  schema: T
} {

  const [ key, prop ] = reference.split('.');

  if (!$.liquid.files.has(key)) return null;

  const file = $.liquid.files.get(key);

  if (!(prop in file)) return null;

  return {
    schema: <T>file[prop],
    file: `${key}.schema`,
    prop
  };

}

type GetShared = ReturnType<typeof getSharedSchemaRef>

function getSharedSchemaSettings ({ file, schema }: GetShared, items: CompletionItem[]) {

  if (isArray(schema)) {

    for (const ref of schema) {

      if (ref.id === undefined) continue;

      items.push({
        label: ref.id,
        insertText: ref.id,
        detail: `${ref.type} (${file})`,
        preselect: true,
        documentation: mdSchema(ref as any),
        kind: kind(ref.type)
      });

    }

  } else if (isObject(schema)) {

    if ('settings' in schema && isArray<SchemaSettings[]>(schema.settings)) {

      for (const ref of schema.settings) {

        if (ref.id === undefined) continue;

        items.push({
          label: ref.id,
          insertText: ref.id,
          detail: `${ref.type} (${file})`,
          preselect: true,
          documentation: mdSchema(ref as any),
          kind: kind(ref.type)
        });
      }

    } else {

      const ref: any = schema;

      if (ref.id === undefined) return;

      items.push({
        label: ref.id,
        insertText: ref.id,
        detail: `${ref.type} (${file})`,
        preselect: true,
        documentation: mdSchema(ref as any),
        kind: kind(ref.type)
      });

    }

  }
}

function getSharedSchemaBlockType ({ file, schema }: GetShared, items: CompletionItem[], type: string) {

  if (isArray<SchemaBlocks[]>(schema)) {

    for (const ref of schema) {
      items.push({
        label: ref.type,
        documentation: ref.name,
        detail: `${ref.type} (${file})`,
        kind: CompletionItemKind.TypeParameter,
        preselect: true,
        insertText: type === 'string' ? `"${ref.type}"` : ref.type
      });
    }
  } else if (isObject<SchemaBlocks>(schema)) {

    items.push({
      label: schema.type,
      documentation: schema.name,
      detail: `${schema.type} (${file})`,
      kind: CompletionItemKind.TypeParameter,
      preselect: true,
      insertText: type === 'string' ? `"${schema.type}"` : schema.type
    });
  }

}

function getSharedBlockSchema (blocks: SchemaBlocks[], type: string) {

  for (const block of blocks) {

    if ('$ref' in block) {

      const ref = getSharedSchemaRef(block.$ref);

      if (ref === null) return false;

      if (isArray<SchemaBlocks[]>(ref.schema)) {

        const setting = ref.schema.find((b) => b.type === type);

        if (setting) return setting;

      } else if (isObject<SchemaBlocks>(ref.schema)) {

        if (ref.schema.type === type) return ref.schema;

      }
    }

  }

  return false;
}

/**
 * Get Schema Block Types
 *
 * Schema block type completions
 */
export function getSchemaBlockTypeCompletions (schema: SchemaSectionTag, type?: string) {

  const items: CompletionItem[] = [];

  for (const block of schema.blocks) {

    if ('$ref' in block) {

      const ref = getSharedSchemaRef(block.$ref);

      if (ref === null) continue;

      getSharedSchemaBlockType(ref, items, type);

    } else {

      items.push({
        label: block.type,
        documentation: block.name,
        kind: CompletionItemKind.TypeParameter,
        preselect: true,
        insertText: type === 'string' ? `"${block.type}"` : block.type
      });

    }
  }

  return items;

}

/**
 * Get Schema Settings
 *
 * Schema settings completions
 */
export function getSchemaSettingsCompletions (schema: SchemaSectionTag) {

  const items: CompletionItem[] = [];

  for (const setting of schema.settings) {

    if ('$ref' in setting) {

      const ref = getSharedSchemaRef(setting.$ref);

      if (ref === null) continue;

      getSharedSchemaSettings(ref, items);

    } else {

      if (setting.id === undefined) continue;

      items.push({
        label: setting.id,
        insertText: setting.id,
        detail: `${setting.type} (settings)`,
        preselect: true,
        documentation: mdSchema(setting as any),
        kind: kind(setting.type)
      });

    }

  }

  return items;
}

/**
 * Get Schema Block Settings
 *
 * Schema blocks completions
 */
export function getSchemaBlockSettingsCompletions (schema: SchemaSectionTag, type: string) {

  const shared = getSharedBlockSchema(schema.blocks, type);
  const block = shared || schema.blocks.find(block => block.type === type);
  const items: CompletionItem[] = [];

  if (!('settings' in block)) return items;

  for (const setting of block.settings) {

    if (shared === false && '$ref' in setting) {

      const ref = getSharedSchemaRef(setting.$ref);

      if (ref === null) continue;

      getSharedSchemaSettings(ref, items);

    } else {

      if (setting.id === undefined) continue;

      items.push({
        label: setting.id,
        insertText: setting.id,
        detail: `${setting.type} (${type})`,
        preselect: true,
        documentation: mdSchema(setting as any),
        kind: kind(setting.type)
      });
    }
  }

  return items;

}

/**
 * Get Section Completions
 *
 * Generates completion items to provided on Liquid tokens
 */
export function getSectionCompletions (schema: Complete.ISchema, prop: Token, type?: string): CompletionItem[] {

  if (!schema) return null;

  const parsed = schema.parse();

  if (prop === Token.SchemaSettings && 'settings' in parsed) {
    return getSchemaSettingsCompletions(parsed);
  }

  if ('blocks' in parsed) {

    if (prop === Token.SchemaBlockType) {
      return getSchemaBlockTypeCompletions(parsed, type);
    }

    if (prop === Token.SchemaBlock) {
      return getSchemaBlockSettingsCompletions(parsed, type);
    }
  }

  return null;

}

/**
 * Get Section Scope
 *
 * Obtains regional based scope, based on the last
 * known schema block type comparison from the current cursor
 * location.
 */
export function getSectionScope (schema: Complete.ISchema, content: string, offset: number) {

  const types = schemaType(schema.parse());

  if (types === false) return null;

  const string = content.slice(0, offset);
  const match = string.match(types);

  if (match === null) return null;

  const type = match.pop().trim();

  return type.slice(type.indexOf(type[type.length - 1]) + 1, -1);

}
