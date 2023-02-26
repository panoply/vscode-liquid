import { Char, Complete, Tag } from 'types';
import { Type } from '@liquify/specs';
import { TextDocument } from 'vscode';
import parseJson from 'parse-json';

/* -------------------------------------------- */
/* PUBLIC                                       */
/* -------------------------------------------- */

/**
 * Parse Document
 *
 * Looks for variables within the provided `content` and inserts them into the
 * `vars` set store. The `vars` store exists on the `CompletionProvider` class.
 * The passed in `content` is in accordance with current cursor position.
 *
 * @todo
 * - Support Captures
 * - Handle Filters
 * - Support Liquid Tags
 */
export async function parseDocument (content: string, vars: Complete.Vars) {

  vars.clear();

  /* -------------------------------------------- */
  /* CONSTANTS                                    */
  /* -------------------------------------------- */

  /**
   * The content length reference
   */
  const length = content.length;

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

  do {

    if (getOrder(i) === false) break;

    if (kind === Tag.Capture) {

      begin = content.indexOf('%}', index) + 2;
      ender = content.indexOf('endcapture', begin);

      if (ender < 0) {
        i = begin;
        continue;
      }

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
        type: Type.string
      });

      if (ender > i) {
        i = content.indexOf('%}', ender) + 2;
        continue;
      }

    } else if (kind === Tag.For) {

      begin = content.lastIndexOf('{%', index);
      ender = content.indexOf('%}', index) + 2;
      logic = content.lastIndexOf('in', ender - 2);
      token = content.slice(begin, ender);
      label = content.slice(index + 3, logic).trim();
      value = getValue(token.lastIndexOf('in') + 2);

      if (value === false) {

        i = index + 3;
        continue;

      } else {

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
          type: Type.array
        });

        if (ender > i) {
          i = ender;
          continue;
        }
      }

    } else if (kind === Tag.Assign) {

      logic = content.indexOf('=', index) + 1;

      if (logic < 0) {

        i = index + 3;
        continue;

      } else {

        begin = content.lastIndexOf('{%', index);
        ender = content.indexOf('%}', index) + 2;
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
            type: getType(value)
          });

          if (ender > i) {
            i = ender;
            continue;
          }
        }
      }
    }

    i = i + 1;
  } while (i < length);

  /**
   * Get First
   *
   * Returns the first occurance match in the document
   */
  function getOrder (from: number) {

    index = -1;

    for (const [ tag, ref ] of [
      [ 'assign', Tag.Assign ],
      [ 'capture', Tag.Capture ],
      [ 'for', Tag.For ],
      [ 'liquid', Tag.Liquid ]
    ]) {

      const match = content.indexOf(tag as string, from);

      if ((index < 0 && match > -1) || (match < index && /{%-?/.test(content.slice(match).trimEnd()))) {
        index = match;
        kind = ref as Tag;
      }

    }

    return index > -1;

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

      if (token.charCodeAt(logic + 1) === Char.PIP || ((
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
export async function parseSchema (textDocument: TextDocument) {

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
      parse: () => parseJson(content.slice(begin, ender))
    };

  }

  return false;

}
