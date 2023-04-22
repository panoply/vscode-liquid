import {
  Position,
  TextEdit
} from 'vscode';

/**
 * Insert Tag Delimiters
 *
 * Returns a text edit for inserting a Liquid tag type token.
 * For example:
 *
 * ```liquid
 *
 * {% # User types in percent character %}
 *
 * %
 *
 * {% # User selects the tag and upon resolving %}
 *
 * {% tag %}
 *
 * ```
 */
export function insertTag (position: Position) {

  return [
    TextEdit.insert(new Position(position.line, position.character - 1), '{')
  ];

}

/**
 * Insert Space
 *
 * Inserts a single whitespace character before the applied completion
 */
export function insertSpace (position: Position) {

  return [
    TextEdit.insert(position, ' ')
  ];

}

/**
 * Insert Translate Filter
 *
 * Inserts a translate filter to locale object tags
 */
export function insertTranslate (position: Position, token: string) {

  return (/(""|'')\s*(?=-?}})/).test(token) ? [
    TextEdit.insert(new Position(position.line, position.character + 2), '| t ')
  ] : [];
}
