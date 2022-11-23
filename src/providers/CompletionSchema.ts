import parseJson from 'parse-json';
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
      return CompletionItemKind.Text;
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

    console.log(prop, this.schema);

    this.schema = this.parse(content);

    if (has('settings', this.schema) && prop === 'settings') {

      const r = this.schema.settings.reduce((item, setting) => {

        if (setting.id === undefined) return item;

        item.push({
          label: setting.id,
          insertText: setting.id,
          documentation: new MarkdownString(setting.info || setting.label),
          kind: getCompletionKind(setting.type)
        });

        return item;

      }, [] as CompletionItem[]);

      console.log(r);

      return r;

    }

    if (has('blocks', this.schema)) {

      if (prop === 'type') {
        return this.schema.blocks.map(block => ({
          label: block.type,
          documentation: new MarkdownString(block.name),
          insertText: block.type,
          kind: CompletionItemKind.TypeParameter
        }));
      }

      if (prop === 'block') {

        const block = this.schema.blocks.find(block => block.type === type);

        if (!block) return [];

        return block.settings.reduce((item, setting) => {

          if (setting.id === undefined) return item;

          item.push({
            label: setting.id,
            documentation: new MarkdownString(setting.info || setting.label),
            kind: getCompletionKind(setting.type),
            insertText: setting.id,
            detail: setting.type
          });

          return item;

        }, [] as CompletionItem[]);

      }

    }

  }

  /**
   * Validates the cursor position, checking to see
   * if changes are being applied within the schema token.
   */
  within (cursor: number) {

    return cursor > this.location.start && cursor < this.location.end;

  }

  /**
   * Looks for the existence of a `{% schema %}` tag
   * within the document. Invoked for every document changes.
   * When no schema is detected within a view, then we skip
   * the regex token search.
   */
  update (content: string) {

    if (isNaN(this.location.start) && isNaN(this.location.end)) return this.update(content);

    if (this.location.start === -1) return;

    this.location.start = content.indexOf(this.tokens.start);
    this.location.end = content.indexOf(this.tokens.end, this.location.start);

  }

  parse (content: string) {

    const begin = content.search(/{%-?\s*\bschema\b\s*-?%}/);

    if (begin > -1) {

      const start = content.indexOf('%}', begin + 2) + 2;
      const ender = content.search(/{%-?\s*\bendschema\b\s*-?%}/);

      if (ender > -1) {
        this.location.start = start;
        this.location.end = ender;
        this.tokens.start = content.slice(begin, start);
        this.tokens.end = content.slice(ender, content.indexOf('%}', this.location.end + 2) + 2);
        return parseJson(content.slice(this.location.start, this.location.end));
      }

    }

  }

}
