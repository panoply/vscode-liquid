import parseJson from 'parse-json';
import { Char } from 'parse/enums';
import { schemaDocumentation } from 'parse/tokens';
import { has } from 'rambdax';

import { SchemaSectionTag, SchemaSettingTypes } from 'types';
import {
  CompletionItem,
  CompletionItemKind,
  MarkdownString
} from 'vscode';

function getCompletionKind (type: SchemaSettingTypes) {

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

/**
 * Completion Provider
 *
 * This provides some basic completions. I have extracted some
 * logic from Liquify to make this possible as I feel as if I owe
 * users something worthwhile having them wait so fucking long.
 *
 * Most of this will be purged and move to the Language Server
 * when Liquify supersedes. It is a shame because the specs can
 * do so much more in the grand scale and folks wont get to see that
 * until Liquify is made available.
 */
export class CompletionSchema {

  /**
   * Settings Schema
   */
  settings: CompletionItem[] = [];

  /**
   * Block Types
   */
  types: CompletionItem[] = [];

  /**
   * Block Types
   */
  scopes: number[] = [];

  /**
   * Schema Settings Block item
   */
  blocks: {
    /**
     * Block Settings
     */
    [type: string]: CompletionItem[];

  } = {};

  /**
   * The parsed JSON contents of the tag.
   */
  schema: SchemaSectionTag;

  /**
   * Cache store of the actual start/end tokens
   */
  tokens: {
    /**
     * The offset position after, ie: `{% schema %}^`
     */
    start: string;
    /**
      * The offset position before `^{% endschema %}`
      */
    end: string;

  } = { start: null, end: null };

  /**
   * The offset locations of the token contents
   */
  location: {
    /**
     * The offset position after, ie: `{% schema %}^`
     */
    start: number;
    /**
     * The offset position before `^{% endschema %}`
     */
    end: number

  } = { start: NaN, end: NaN };

  /**
   * Generates completion items to provided on Liquid tokens
   */
  completions (content: string, prop: 'settings' | 'block' | 'type', type?: string) {

    this.schema = this.parse(content);

    if (has('settings', this.schema) && prop === 'settings') {

      return this.schema.settings.reduce((item, setting) => {

        if (setting.id === undefined) return item;

        item.push({
          label: setting.id,
          insertText: setting.id,
          detail: `${setting.type} (settings)`,
          documentation: schemaDocumentation(setting as any),
          kind: getCompletionKind(setting.type)
        });

        return item;

      }, [] as CompletionItem[]);

    }

    if (has('blocks', this.schema)) {

      const complete: CompletionItem[] = [];

      if (prop === 'type') {

        for (const block of this.schema.blocks) {
          complete.push({
            label: block.type,
            documentation: new MarkdownString(block.type),
            insertText: type === 'string' ? '"' + block.type + '"' : block.type,
            kind: CompletionItemKind.TypeParameter
          });
        }

        return complete;

      }

      if (prop === 'block') {

        const block = this.schema.blocks.find(block => block.type === type);

        if (!has('settings', block)) return [];

        const complete: CompletionItem[] = [];

        for (const setting of block.settings) {

          if (setting.id === undefined) continue;

          complete.push(
            {
              label: setting.id,
              kind: getCompletionKind(setting.type),
              insertText: setting.id,
              detail: `${setting.type} (${type})`,
              documentation: schemaDocumentation(setting as any)
            }
          );
        }

        return complete;

      }

    }

    console.log(prop, has('blocks', this.schema));

  }

  /**
   * Obtains regional based scope, based on the last
   * known schema block type
   */
  scope (content: string, offset: number) {

    const string = content.slice(0, offset);
    const match = string.match(/\bcase\b\s+\bblock\.type|block\.type\s*==\s*[^"']/g);

    if (match !== null) {

      const type = match.pop();
      const last = string.lastIndexOf(type) + type.length;

      if (type.startsWith('case')) {
        const cond = string.lastIndexOf('when', offset) + 4;
        const when = string.slice(cond).trimStart();
        if (when.charCodeAt(0) !== Char.DQO && when.charCodeAt(0) !== Char.SQO) return null;
        return when.slice(1, when.indexOf(when[0], 1));
      }

      return string.slice(last + 1, string.indexOf(type[type.length - 1], last) - 1);

    }

    return null;

  }

  /**
   * Parses the `{% schema %}` code region
   */
  parse (content: string) {

    const begin = content.search(/{%-?\s*\bschema\b\s*-?%}/);

    if (begin > -1) {
      const start = content.indexOf('%}', begin + 2) + 2;
      const ender = content.search(/{%-?\s*\bendschema\b\s*-?%}/);
      if (ender > -1) return parseJson(content.slice(start, ender));
    }

  }

}
