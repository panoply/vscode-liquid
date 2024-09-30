import { Token, Char, Complete } from 'types';
import { isString } from 'utils';
import * as r from 'parse/helpers';
import { $, q } from '@liquify/specs';
import { Diagnostic, Range, TextDocument } from 'vscode';

export interface IToken {
  /**
   * Whether or not the passed in offset is position
   * within the tag token
   */
  within: boolean;
  /**
   * The starting offset location of the tag, ie: `^{{ }}`
   */
  begin: number;
  /**
   * The Token type
   */
  type: Token;
  /**
   * The ender offset location of the tag, ie: `{% %}^`
   */
  ender: number;
  /**
   * The actual token captured as a string.
   */
  text: string;
  /**
   * The offset location relative to the token text, meaning the
   * index of the cursor minus the document text length.
   */
  offset: number;
  /**
   * A Diagnostic to apply for this token
   */
  diagnostic: Diagnostic[]
  /**
   * The tag or output token name
   */
  get tagName(): string;
  /**
   * The last known locale reference, defaults to `null` if no locale object
   */
  get locale(): string;
  /**
   * The last known filter (if any) on the token, defaults to `null`
   */
  get filter(): string;
  /**
   * The last known object property (if any) on the token, defaults to `null`
   */
  get object(): string;
  /**
   * Returns the range of the token
   */
  get range(): Range;
}

/* -------------------------------------------- */
/* PRIVATES                                     */
/* -------------------------------------------- */

function getTokenSpecificCursor (text: string, tagName: string, prev: string, offset: number) {

  switch (tagName) {

    case 'if':
    case 'elsif':
    case 'unless':

      if (r.Tag(tagName).test(text)) return Token.Object;
      if (r.EmptyEnder.test(text.slice(offset))) return Token.Logical;

      break;

    case 'case':
    case 'when':

      if (r.Tag(tagName).test(text)) return Token.Object;

      break;

    case 'render':
    case 'include':
    case 'section':

      return Token.Import;

    case 'form':

      return Token.TagForm;

    case 'assign':

      if (prev.charCodeAt(prev.length - 1) === Char.EQL) return Token.Assignment;

      break;

    case 'echo':

      return Token.Echo;

    case 'for':

      if (
        prev[prev.length - 3].toLowerCase() === ' ' &&
        prev[prev.length - 2].toLowerCase() === 'i' &&
        prev[prev.length - 1].toLowerCase() === 'n') {

        return Token.Array;

      }

  }

}

/**
 * Empty Object
 *
 * Detect whether the completion is invoked within an empty output
 * expression.
 */
export function isEmptyOutput (token: string) {

  return /{{-?\s*-?}}/.test(token);

}

/**
 * Empty Object
 *
 * Detect whether the completion is invoked within an empty output
 * expression.
 */
export function isEmptyTag (token: string) {

  return /{%-?\s*-?%}/.test(token);

}

/**
 * Get Token Scope
 *
 * Determines the containment of the token. This is used to keep start/end
 * accessible tokens out of global scope.
 */
export function getTokenScope () {

}

export function getLiquidTokenCursor ({ text, offset, filter }: IToken, vars: Complete.Vars): Token {

  /**
   * Obtain the text portion
   */
  const portion = text.slice(0, offset);

  /**
   * Retrives whether or not to show tag completion list
   */
  const showTag = portion.slice(portion.lastIndexOf('\n', offset));

  /**
   * Provide tag completions
   */
  if (/^\n\s+[a-z]+$/.test(showTag)) return Token.LiquidTagToken;

  /**
   * Split token by newline
   */
  const lines = portion.trim().split('\n').filter(Boolean).slice(1);

  /**
   * The last known token input
   */
  const prev = lines.pop().trim();

  /**
   * Tag Name
   */
  const tagName = prev.slice(0, prev.indexOf(' ') + 1).trim();

  /**
   * The character code of `prev`
   */
  const last = prev.charCodeAt(prev.length - 1);

  // if not null, we have a match
  if (last === Char.PIP) {

    if (q.setTag(tagName)) {

      if ($.liquid.tag.filters) return Token.LiquidTagFilterTag;

    } else {

      return Token.LiquidTagFilterObject;

    }

  } else if (last === Char.COL) {

    return Token.LiquidTagArgument;

  } else if (last === Char.DOT) {

    return /["'][^'"]*?$/.test(text.slice(2, offset - 1))
      ? Token.Locale
      : Token.Property;
  }

  let tagMatch: string;
  let wsp: number;

  // Last Character is quotation
  if (last === Char.SQO || last === Char.DQO) {

    wsp = text.slice(0, offset - 1).trimEnd().lastIndexOf(' ');

    tagMatch = prev.slice(0, prev.length - 2).trim();

    if (tagMatch === tagName) {

      if (tagName === 'render' || tagName === 'include') {
        return Token.ImportRender;
      } else if (tagName === 'section') {
        return Token.ImportSection;
      } else if (tagName === 'form') {
        return Token.TagForm;
      }

    }

  } else {
    tagMatch = prev.slice(0, prev.indexOf(' ') + 1).trim();
    wsp = prev.lastIndexOf(' ');
  }

  if (wsp > -1) {

    const logic = prev.slice(wsp).trim();

    if (tagName === 'if' || tagName === 'elsif' || tagName === 'unless') {

      if (r.Operators.test(logic)) return Token.Object;

      return Token.Logical;

    }

  }

  if (isString(tagName)) {

    return getTokenSpecificCursor(text, tagName, prev, offset);
  }

  return null;

}

/**
 * Get Token Cursor
 *
 * Determines the previous character from the current cursor location.
 * This is a series of validation checks which is used to control the
 * type of completion to be provided based on the surrounding content.
 */
export function getTokenCursor ({ text, offset, tagName, filter }: IToken, vars: Complete.Vars): Token {

  /**
   * Previous character excluding whitespace
   */
  const prev = text.slice(0, offset).trim();

  /**
   * The character code of `prev`
   */
  const last = prev.charCodeAt(prev.length - 1);

  if (last === Char.PIP) {
    return Token.Filter;
  } else if (last === Char.COL) {
    return Token.Argument;
  } else if (last === Char.DOT) {
    return /["'][^'"]*?$/.test(text.slice(2, offset - 1)) ? Token.Locale : Token.Property;
  } else if (filter === 't' && last === Char.COM) {
    return Token.LocaleArgument;
  }

  /**
   * Object Properties expression, eg: `object['']`
   */
  if (prev.charCodeAt(prev.length - 2) === Char.LSB && (last === Char.SQO || last === Char.DQO)) {
    return Token.Property;
  }

  let wsp: number;

  if (last === Char.SQO || last === Char.DQO) {
    wsp = text.slice(0, offset - 1).trimEnd().lastIndexOf(' ');
  } else {
    wsp = prev.lastIndexOf(' ');
  }

  if (wsp > -1) {

    const word = prev.slice(wsp);

    if (r.Operators.test(word)) {

      if ((tagName === 'if' || tagName === 'elsif') && /==/.test(word)) {

        const token = text.indexOf(tagName, 2) + tagName.length;
        const condition = text.slice(token).trimLeft();
        const logical = condition.slice(0, condition.indexOf(word)).trim().split('.');

        if (logical[0] === 'block' && logical[1] === 'type') {

          return Token.SchemaBlockType;

        } else if (vars.has(logical[0])) {

          const { props } = vars.get(logical[0]);

          if (props[0] === 'block') {
            if (props.length === 1 && logical.length > 1 && logical[1] === 'type') {
              return Token.SchemaBlockType;
            } else if (props.length === 2 && props[1] === 'type') {
              return Token.SchemaBlockType;
            }
          } else if (
            props.length === 2 &&
            props[0] === 'section' &&
            props[1] === 'blocks' &&
            logical.length > 1 &&
            logical[1] === 'type'
          ) {
            return Token.SchemaBlockType;
          }
        }
      }

      return Token.Object;
    }
  }

  if (isString(tagName)) {
    return getTokenSpecificCursor(text, tagName, prev, offset);
  }

  return null;

}

/**
 * Determine Token
 *
 * Determines the type of token we a dealing with, meaning
 * whether we are within an tag type or output type. If `null`
 * is returned, then cursor is not within a a Liquid token.
 */
export function getTokenType (content: string, offset: number) {

  const begin = content.slice(0, offset).lastIndexOf('{');
  const token = content.slice(begin, offset);

  if (token.charCodeAt(1) === Char.PER) return Token.Tag;
  if (content.charCodeAt(begin - 1) === Char.LCB) return Token.Object;

  return null;

}

/**
 * Parse Token
 *
 * Extract the Liquid token from an offset position. This is used to determine which completions
 * should be shown and provided via the completion provider. The returned object can be used to
 * determine the token and reason about with it.
 */
export function getToken (content: string, index: number, document: TextDocument): IToken {

  const output = content.lastIndexOf('{{', index);
  const tag = content.lastIndexOf('{%', index);
  const begin = output > tag ? output : tag;

  const type = content.charCodeAt(begin + 1) === Char.PER ? Token.Tag : Token.Object;
  const ender = content.indexOf(type === Token.Tag ? '%}' : '}}', begin) + 2;
  const text = content.slice(begin, ender);
  const offset = text.length - Math.abs(ender - index);

  return {
    within: index >= (begin + 2) && index <= (ender - 2),
    begin,
    type,
    ender,
    text,
    offset,
    diagnostic: [],
    get locale () {

      if (type !== Token.Object) return null;

      const before = text.search(/(?<=^{{-?\s*["'])/);

      if (before > -1) {
        const object = text.slice(before, offset).trim();
        return object.endsWith('.') ? object.slice(0, -1) : object.slice(1);
      }

      return null;

    },
    get object () {

      let object: string = '';
      let before = text.lastIndexOf(' ', offset - 1);

      if (before > -1) {

        object = text.slice(before, offset).trim();

      } else if (type === Token.Object) {

        // Check for locale
        before = text.search(/(?<=^{{-?["'])/);

        if (before - 1) object = text.slice(before, offset).trim();

      }

      return object.charCodeAt(0) === Char.DQO || object.charCodeAt(0) === Char.SQO
        ? object.slice(1)
        : object.endsWith('.') ? object.slice(0, -1) : object;

    },
    get tagName () {

      const token = text.slice(text.charCodeAt(2) === Char.DSH ? 3 : 2).match(/\w+/);

      return token ? token[0] : null;

    },
    get filter () {

      const pipe = text.lastIndexOf('|', offset) + 1;

      if (pipe > -1) {
        const colon = text.indexOf(':', pipe);
        if (colon > -1) return text.slice(pipe, colon).trim();
      }

      return null;

    },
    get range () {

      return new Range(document.positionAt(begin), document.positionAt(ender));
    }
  };
}
