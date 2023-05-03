import { Token, Char, Complete } from 'types';
import { isString } from 'utils';
import * as r from 'parse/helpers';

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
   * The tag or output token name
   */
  get tagName(): string;
  /**
   * The last known filter (if any) on the token, defaults to `null`
   */
  get filter(): string;
  /**
   * The last known filter (if any) on the token, defaults to `null`
   */
  get object(): string;
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

/**
 * Get Token Cursor
 *
 * Determines the previous character from the current cursor location.
 * This is a series of validation checks which is used to control the
 * type of completion to be provided based on the surrounding content.
 */
export function getTokenCursor ({ text, offset, tagName }: IToken, vars: Complete.Vars): Token {

  /**
   * Previous character excluding whitespace
   */
  const prev = text.slice(0, offset).trim();

  /**
   * The character code of `prev`
   */
  const last = prev.charCodeAt(prev.length - 1);

  if (last === Char.PIP) return Token.Filter;
  if (last === Char.COL) return Token.Argument;
  if (last === Char.DOT) return /["'][^'"]*?$/.test(text.slice(2, offset - 1)) ? Token.Locale : Token.Property;

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

      case 'assign':

        if (prev.charCodeAt(prev.length - 1) === Char.EQL) return Token.Assignment;

        break;

      case 'for':

        if (
          prev[prev.length - 3].toLowerCase() === ' ' &&
          prev[prev.length - 2].toLowerCase() === 'i' &&
          prev[prev.length - 1].toLowerCase() === 'n') {

          return Token.Array;

        }
    }
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
export function getToken (content: string, index: number): IToken {

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
    get object () {

      const object = text.slice(text.lastIndexOf(' ', offset - 1), offset).trim();

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

    }
  };
}
