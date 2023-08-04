import slash, { entries, keys } from 'utils';
import { basename, join, dirname } from 'node:path';
import { Filter, Tags, IObject, Type, Types, liquid, IProperty, $, p } from '@liquify/specs';
import { mdString } from 'parse/helpers';
import { has, path } from 'rambdax';
import { Complete, SettingsData } from 'types';
import {
  CompletionItemKind,
  CompletionItem,
  SnippetString,
  CompletionItemTag,
  Position,
  Range,
  TextEdit,
  MarkdownString,
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
export function getItemKind (type: any): CompletionItemKind {

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

export function getDetailName (type: Types.Basic | Type) {

  if (type === Type.array) return 'array';
  else if (type === Type.boolean) return 'boolean';
  else if (type === Type.number) return 'number';
  else if (type === Type.string) return 'start';
  else if (type === Type.object) return 'object';
  else if (type === Type.unknown) return 'unknown';

  return 'any';
}

/**
 * Get Schema Completions
 *
 * Generates the completion items for the `{% schema %}` code block
 * region. The items are cherry picked from the JSON Language Service
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

    const range = new Range(
      new Position(line, character),
      new Position(line, textEdit.range.end.character)
    );

    return {
      label,
      kind,
      insertText: new SnippetString(textEdit.newText.slice(slice)),
      documentation: mdString(documentation.value),
      range: {
        inserting: range,
        replacing: range
      }
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
    const location = slash(fsPath).split('/');
    const filename = location.pop();
    const dirname = location.pop();

    const documentation = new MarkdownString(`[${label}.liquid](./${label}.liquid)`);

    documentation.baseUri = file;
    documentation.supportHtml = true;

    return {
      label,
      kind: CompletionItemKind.File,
      insertText: new SnippetString(label),
      preselect: true,
      detail: join(dirname, filename),
      documentation
    };

  });

}

export function getLocaleSchemaSetting (key: string) {

  const locale: any = null;

  if ($.liquid.files.has('locales_schema')) {
    return path(key.slice(2), $.liquid.files.get('locales_schema'));
  }

  return locale || key;
}

/**
 * Get Settings Completions
 *
 * Generates the `settings_data.json` completions following the
 * `settings.*` object.
 */
export function getSettingsCompletions (uri: string, data: SettingsData[]) {

  const reference = `[${basename(uri)}](${uri})`;
  const objects:{ [prop: string]: IProperty } = {};
  const locale = $.liquid.files.get('locales_schema');

  for (const setting of data) {

    if (setting.name === 'theme_info') continue;
    if (setting.name.startsWith('t:settings_schema.')) {

      const prop = setting.name.slice(18, setting.name.indexOf('.', 18));

      for (const type of setting.settings) {
        if (type?.id && type?.label) {

          const description: string[] = [];

          if (type.label.startsWith('t:')) {
            description.push(`**${path(type.label.slice(2), locale) || type.label}**`, '\n');
          } else {
            description.push(`**${type.label}**`, '\n');
          }

          if (has('info', type)) {
            if (type.info.startsWith('t:')) {
              description.push('\n', path(type.info.slice(2), locale), '\n\n');
            } else {
              description.push('\n', type.info, '\n\n');
            }
          }

          if (type?.default) description.push(`\n\`${type.default}\``, '\n\n');

          description.push('\n---\n\n', reference);

          objects[type.id] = <IProperty>{
            global: true,
            scope: 'settings',
            type: type.type,
            summary: `${prop} (${type.type})`,
            description: description.join('')
          };

        }
      }

    } else {

      for (const type of setting.settings) {

        if (type?.id && type?.label) {

          const description: string[] = [];

          if (type.label.startsWith('t:')) {
            description.push(`**${path(type.label.slice(2), locale) || type.label}**`, '\n');
          } else {
            description.push(`**${type.label}**`, '\n');
          }

          if (has('info', type)) {
            if (type.info.startsWith('t:')) {
              description.push('\n', path(type.info.slice(2), locale), '\n\n');
            } else {
              description.push('\n', type.info, '\n\n');
            }
          }

          if (type?.default) description.push(`\n\`${type.default}\``, '\n\n');

          description.push('\n---\n\n', reference);

          objects[type.id] = <IProperty>{
            global: true,
            type: type.type,
            scope: 'settings',
            summary: `${setting.name} (${type.type})`,
            description: description.join('')
          };

        }
      }
    }
  }

  liquid.shopify.objects.settings.properties = objects;

  return liquid.shopify.objects;
};

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

    const documentation = new MarkdownString();

    documentation.baseUri = Uri.file(uri);
    documentation.supportThemeIcons = true;
    documentation.supportHtml = true;
    documentation.appendMarkdown(`**${label}**\n\n`);

    if (object) {
      documentation.appendMarkdown(`**${value}** available fields\n\n`);
    } else {
      documentation.appendMarkdown(`*\`${value}\`*\n\n`);
    }

    documentation.appendMarkdown(`[${filename}](./${filename})`);

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
export function getObjectCompletions (fsPath: string, items: Complete.Items) {

  let template: string;

  const dirn = dirname(fsPath);
  const base = basename(fsPath, '.liquid');

  if (base === 'gift_card' || base === 'robots.txt') {
    template = base + '.liquid';
  } else if (dirn === 'customers') {
    template = join(dirn, base);
  } else {
    template = base;
  }

  items.delete('objects');
  items.delete('object:template');
  items.delete(`object:${Type.any}`);
  items.delete(`object:${Type.array}`);
  items.delete(`object:${Type.string}`);
  items.delete(`object:${Type.constant}`);
  items.delete(`object:${Type.boolean}`);
  items.delete(`object:${Type.number}`);
  items.delete(`object:${Type.object}`);

  const group = p.ObjectGroups(template, (object: IObject, item: CompletionItem): CompletionItem => {

    if (object.type === Type.object) item.kind = CompletionItemKind.Module;
    if (object.const) item.kind = CompletionItemKind.Constant;

    item.tags = object.deprecated ? [ CompletionItemTag.Deprecated ] : [];
    item.documentation = mdString(object.description) as any;

    return item;

  });

  items.set('objects', group.all as any);
  items.set('object:template', group.template as any);
  items.set(`object:${Type.any}`, group.any as any);
  items.set(`object:${Type.array}`, group.array as any);
  items.set(`object:${Type.string}`, group.string as any);
  items.set(`object:${Type.boolean}`, group.boolean as any);
  items.set(`object:${Type.constant}`, group.constant as any);
  items.set(`object:${Type.number}`, group.number as any);
  items.set(`object:${Type.object}`, group.object as any);

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
      documentation: mdString(description, reference)
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
      singleton = false,
      snippet = '$1'
    }
  ]): CompletionItem => {

    const insertText = label === 'else'
      ? new SnippetString(` ${label} %}$0`)
      : label === 'liquid'
        ? new SnippetString(` ${label} ${snippet} %}$0`)
        : singleton
          ? new SnippetString(` ${label} ${snippet} %}$0`)
          : new SnippetString(` ${label} ${snippet} %} $0 {% end${label} %}`);

    return {
      label,
      kind: CompletionItemKind.Keyword,
      tags: deprecated ? [ CompletionItemTag.Deprecated ] : [],
      insertText,
      preselect: true,
      documentation: mdString(description, reference)
    };

  });

}
