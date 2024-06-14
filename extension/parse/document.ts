import { Char, Complete, SchemaSectionTag, Tag } from 'types';
import { $, Objects, Type, liquid } from '@liquify/specs';
import { TextDocument } from 'vscode';
import parseJson from 'parse-json';
import parseYaml from 'js-yaml';
import { keys } from 'utils';

/* -------------------------------------------- */
/* PUBLIC                                       */
/* -------------------------------------------- */

export function parseFrontmatter (textContent: string): { offset: number; keys: string[] } {

  const text = textContent.trimStart();
  const none = { offset: 0, keys: [] };

  if (!text.startsWith('---\n')) return none;

  const before = textContent.indexOf('---\n');
  const offset = textContent.indexOf('---', before + 4);

  if (offset < 0) return none;

  const content = textContent.slice(before, offset);

  try {

    const data: any = parseYaml.load(content);
    const objects = liquid.generate<Objects>(data, {});
    liquid.extend($.liquid.engine, { objects });

    return {
      offset,
      keys: keys(objects)
    };

  } catch (e) {

    return none;
  }

}

/**
 * Parse Document
 *
 * Looks for variables within the provided `content` and inserts them into the
 * `vars` set store. The `vars` store exists on the `CompletionProvider` class.
 *
 * The passed in `content` is in accordance with current cursor position.
 *
 */
export function parseDocument (content: string, vars: Complete.Vars) {

  vars.clear();

  /* -------------------------------------------- */
  /* CONSTANTS                                    */
  /* -------------------------------------------- */

  /**
   * The content length reference
   */
  const length = content.length;

  /**
   * Timestamp which will prevent infinate loops or long running parses.
   */
  const ts = Date.now();

  /* -------------------------------------------- */
  /* LEXICAL SCOPES                               */
  /* -------------------------------------------- */

  /**
   * Character Iterator
   */
  let i: number = 0;

  /**
   * Index match reference
   */
  let index: number = 0;

  /**
   * The tag name, ie: `assign` or `capture` etc
   */
  let kind: Tag;

  /**
   * The starting index offset of the token
   */
  let begin: number = -1;

  /**
   * The ending index offset of the token
   */
  let ender: number = -1;

  /**
   * Changeable reference of the logical token
   */
  let logic: number = -1;

  /**
   * The actual token that was captured
   */
  let token: string;

  /**
   * The assignment lable reference, eg: `assign foo` - (`foo`)
   */
  let label: string;

  /**
   * The assignment value, eg: `assign foo = 'bar'` (`bar`)
   */
  let value: string | false;

  /**
   * Whether or not we are within a `{% liquid %}` tag.
   */
  let isliq: number = -1;

  do {

    // 350ms time limit imposed before breaking
    if ((Date.now() - ts) > 350) {

      console.error(
        'Internal Parse Error occured in Liquid Extension\n',
        'Liquid parse took longer than 350ms to complete. Please submit an issue at:',
        'https://github.com/panoply/vscode-liquid\n\n',
        'The parse was cancelled to prevent leaks from occuring, maybe check your',
        'code. If you are working in a large document this could also be the issue.\n\n',
        'The last known sequence handled:\n\n',
        `Index: ${i}\n`,
        `Token: ${token}\n`,
        `Label: ${label}\n`,
        `Value: ${value}`
      );

      break;
    }

    if (getOrder(i) === false) break;

    if (kind === Tag.Liquid && isliq < 0) {
      isliq = content.lastIndexOf('{%', index);
      i = i + index + 6;
      if (getOrder(i) === false) break;
    }

    if (kind === Tag.Capture) {

      if (isliq > -1) {
        begin = content.indexOf('\n', index);
      } else {
        begin = content.indexOf('%}', index) + 2;
      }

      ender = content.indexOf('endcapture', begin);

      if (ender < 0) {
        i = begin;
        continue;
      }

      // Within {% liquid %} tag
      if (isliq > -1) {

        token = content.slice(content.lastIndexOf('\n', index), begin);
        label = content.slice(index + 7, begin).trim();
        value = content.slice(begin, ender);

        vars.set(label, {
          begin,
          ender,
          kind,
          token,
          label,
          value,
          props: [ value ],
          type: Type.string
        });

        if (ender > i) {
          i = isLiquidTagEnd(10);
          continue;
        }

      } else {

        ender = content.lastIndexOf('{%', ender);
        token = content.slice(content.lastIndexOf('{%', index), begin);

        if (content.charCodeAt(begin - 2) === Char.DSH) {
          label = content.slice(index + 7, begin - 3).trim();
        } else {
          label = content.slice(index + 7, begin - 2).trim();
        }

        value = content.slice(begin, ender);

        vars.set(label, {
          begin,
          ender,
          kind,
          token,
          label,
          value,
          props: [ value ],
          type: Type.string
        });

        if (ender > i) {
          i = content.indexOf('%}', ender) + 2;
          continue;
        }

      }

    } else if (kind === Tag.For) {

      if (isliq > -1) {

        begin = content.lastIndexOf('\n', index);
        ender = content.indexOf('\n', index);
        logic = content.lastIndexOf('in', ender);
        token = content.slice(begin, ender);

      } else {

        begin = content.lastIndexOf('{%', index);
        ender = content.indexOf('%}', index) + 2;
        logic = content.lastIndexOf('in', ender - 2);
        token = content.slice(begin, ender);

      }

      label = content.slice(index + 3, logic).trim();
      value = getValue(token.lastIndexOf('in') + 2);

      if (value === false) {
        i = index + 3;
        continue;
      }

      // Lets obtain the array value in the loop

      const prop = value.split('.').filter(Boolean);

      if (prop.length > 1) {
        if (vars.has(prop[0])) {
          prop[0] = vars.get(prop[0]).value;
          value = prop.join('.');
        }
      } else if (prop.length === 1 && vars.has(prop[0])) {
        value = vars.get(prop[0]).value;
      }

      vars.set(label, {
        begin,
        ender,
        kind,
        token,
        label,
        value,
        get props () {
          return getProps(value as string);
        },
        type: Type.array
      });

      if (ender > i) {
        i = ender;
        continue;
      }

    } else if (kind === Tag.Assign) {

      logic = content.indexOf('=', index) + 1;

      if (logic < 0) {

        i = index + 3;
        continue;

      } else {

        if (isliq > -1) {
          begin = content.lastIndexOf('\n', index);
          ender = content.indexOf('\n', index);
        } else {
          begin = content.lastIndexOf('{%', index);
          ender = content.indexOf('%}', index) + 2;
        }

        token = content.slice(begin, ender);
        label = content.slice(index + 6, logic - 1).trim();
        value = getValue(token.indexOf('=') + 1);

        if (value === false) {

          i = index + 3;
          continue;

        } else {

          vars.set(label, {
            begin,
            ender,
            kind,
            token,
            label,
            value,
            get props () {
              return getProps(value as string);
            },
            type: getType(value)
          });

          if (ender > i) {
            i = isliq > -1 ? isLiquidTagEnd(0) : ender;
            continue;
          }
        }
      }
    }

    i = i + 1;
  } while (i < length);

  /**
   * Get Liquid Tag Ender
   *
   * Returns the index of the ending delimiter or a `{% liquid %}` tag
   */
  function isLiquidTagEnd (endTrim: number) {

    const delim = content.slice(ender + endTrim).trim();

    if (delim.startsWith('-%}') || delim.startsWith('%}')) {
      isliq = -1;
      return content.indexOf('%}', ender + endTrim) + 2;
    }

    return ender;

  }

  /**
   * Get First
   *
   * Returns the first occurance match in the document
   */
  function getOrder (from: number) {

    index = -1;

    const regexp = isliq > -1
      ? /\b(?:assign|capture|for)\b/
      : /\b(?:assign|capture|for|liquid)\b/;

    let at = content.slice(from).search(regexp);

    if (at > -1) {

      at = at + from;

      if (content.startsWith('assign', at)) {
        index = at;
        kind = Tag.Assign;
      } else if (content.startsWith('capture', at)) {
        index = at;
        kind = Tag.Capture;
      } else if (content.startsWith('for', at)) {
        index = at;
        kind = Tag.For;
      } else if (content.startsWith('liquid', at)) {
        index = at;
        kind = Tag.Liquid;
      }
    }

    return index > -1;

  }

  /**
   * Get Props
   *
   * Splits an object expression and gracefully handles
   * string brace properties.
   *
   * @todo Handle variable properties
   */
  function getProps (val: string) {

    const props: string[] = val.split('.');

    if (props.length > 1) {

      return props.flatMap(item => {

        const brace = val.indexOf('[');

        if (brace > -1) {

          const prop = item.slice(0, brace);
          const match = item
            .slice(brace + 1)
            .match(/["'][^'"]*['"]/g)
            .map(m => m.slice(1, -1).trim());

          return [ prop, ...match ];

        }

        return item.trim();

      });

    }

    return props;
  }

  /**
   * Get Type
   *
   * Determines the variables resolved type.
   */
  function getType (val: string) {

    let t: Type = null;

    if (/^['"]/.test(val)) t = Type.string;
    else if (/^-?\d[.\d]+?\s/.test(val)) t = Type.number;
    else if (/^\b(?:true|false)\b/.test(val)) t = Type.boolean;
    else if (/^\bnil\b/.test(val)) t = Type.nil;
    else if (/^[a-zA-Z_-]+/i.test(val)) t = Type.keyword;
    else if (/^[a-zA-Z0-9_][.[]/i.test(val)) t = Type.object;

    if (t === Type.keyword || t === Type.object) {

      const filters = token.indexOf('|', logic + 1);

      if (filters > -1) {

        const last = token
          .slice(filters + 1)
          .split(/\|\s*(?=\w+:?)/g)
          .pop()
          .trim();

        if (last === 'split' || last === 'where' || last === 'map') return Type.array;

        return Type.unknown;

      }
    }

    return t === null ? Type.unknown : t;

  }

  /**
   * Get Value
   *
   * Returns the variable assigned value.
   */
  function getValue (from: number) {

    logic = from;

    /**
     * Quotation character index
     */
    let q: number;

    do {

      if (token.charCodeAt(logic) === Char.SQO || token.charCodeAt(logic) === Char.DQO) {
        q = token.indexOf(token[logic], logic + 1);
        return q < 0 ? false : token.slice(from, q + 1).trim();
      }

      if (isliq > -1 && token.charCodeAt(logic + 1) === Char.NWL) {

        return token.slice(from, logic).trim();

      } else if (token.charCodeAt(logic + 1) === Char.PIP || ((
        token.charCodeAt(logic + 1) === Char.DSH &&
        token.charCodeAt(logic + 2) === Char.PER &&
        token.charCodeAt(logic + 3) === Char.RCB
      ) || (
        token.charCodeAt(logic + 1) === Char.PER &&
        token.charCodeAt(logic + 2) === Char.RCB
      ))) {

        return token.slice(from, logic).trim();

      }

      logic = logic + 1;

    } while (logic < ender);

    return false;

  }

}

/**
 * Parse Schema
 *
 * Extracts the the JSON contents from within the `{% schema %}` tag
 * located within the document. This process is executed for every document
 * change as we need to ensure validations align.
 */
export async function parseSchema (textDocument: TextDocument): Promise<false | Complete.ISchema> {

  const content = textDocument.getText();
  const detect = content.indexOf('endschema');

  if (detect === -1) return false;

  const begin = content.lastIndexOf('%}', detect) + 2;
  const opens = content.lastIndexOf('{%', begin - 2) + 2;
  const tname = content.slice(opens, begin - 2).trim();

  if (tname === 'schema' || tname === '-schema') {

    const ender = content.lastIndexOf('{%', detect);

    return {
      begin,
      ender,
      offset: textDocument.positionAt(begin).line,
      content: content.slice(begin, ender),
      parse: () => parseJson(content.slice(begin, ender)) as unknown as SchemaSectionTag
    };

  }

  return false;

}
