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
import { getCompletionKind } from './schema';
import { SettingsData } from '../types';

export function ProvideSettings (settings: SettingsData[]) {

  const props: CompletionItem[] = [];
  const items: { [prop: string]: CompletionItem[] } = {};

  for (const setting of settings) {
    if (setting.name === 'theme_info') continue;
    if (setting.name.startsWith('t:settings_schema.')) {

      const prop = setting.name.slice(18, setting.name.indexOf('.', 18));

      items[prop] = [];

      for (const type of setting.settings) {
        if (type.id) {
          items[prop].push({
            label: type.id,
            insertText: type.id,
            detail: `${type.type} (settings_data.json)`,
            kind: getCompletionKind(type.type)
          });
        }
      }

      props.push({
        label: prop,
        insertText: prop,
        detail: `${prop} (settings_data.json)`,
        kind: CompletionItemKind.Method,
        documentation: new MarkdownString(`${items[prop].length} fields`)
      });

    } else {

      items[setting.name] = [];

      for (const type of setting.settings) {
        if (type.id) {
          items[setting.name].push({
            label: type.id,
            insertText: type.id,
            detail: `${type.type} (settings_data.json)`,
            kind: getCompletionKind(type.type)
          });
        }
      }

      props.push({
        label: setting.name,
        insertText: setting.name,
        detail: `${setting.name} (settings_data.json)`,
        kind: CompletionItemKind.Method,
        documentation: new MarkdownString(`${items[setting.name].length} fields`)
      });

    }
  }

  return { props, items };

}

/**
 * Parse Locale Objects
 *
 * Similar to `parseObject` but instead provides locale file based completions.
 */
export function parseSettings (
  locales: Completions['settings'],
  content: string,
  offset: number
) {

  const slice = content.slice(2, offset - 1);
  const match = slice.match(/[^\s"']*?$/);

  if (match === null) return null;

  const props = match[0].split('.').filter(Boolean);

  if (!has(props[0], locales.items)) return entries(locales.items).map(ProvideSettings as any);

  if (props.length === 1) {

    const next = locales.items[props[0]] || null;

    if (next === null) return null;
    return Object.entries(next).map(ProvideSettings as any);
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
      : typeof object === 'object' ? entries(object).map(ProvideSettings) : null;

  }(props.slice(1), locales.items[props[0]]));

}
