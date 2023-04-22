
import { Complete, Tag, Token } from 'types';
import { IToken } from 'parse/tokens';
import { Properties, $, Type, q } from '@liquify/specs';
import { entries, isNumber, isString, keys } from 'utils';
import { basename, join } from 'node:path';
import { mdLines, mdString, detail, kind, objectKind } from 'parse/helpers';
import {
  CompletionItemTag,
  CompletionItem,
  CompletionItemKind,
  Range,
  SnippetString,
  MarkdownString,
  TextDocument,
  Position,
  TextEdit
} from 'vscode';

/* -------------------------------------------- */
/* PRIVATES                                     */
/* -------------------------------------------- */

/**
 * Object Walks
 *
 * Walks over a provided object string and determines
 * the property completions to show.
 */
function walkProps (next: string[], objectProps: Properties) {

  if (next.length > 0 && q.isProperty(next.shift())) {
    return walkProps(next, $.liquid.object.properties);
  } else {
    if (!objectProps) return null;
    return $.liquid.type
      ? entries(objectProps).filter(x => x[1]?.type === $.liquid.type).map(getObjectProperties)
      : entries(objectProps).map(getObjectProperties);
  }

};

/**
 * Locale Walks
 *
 * Walks over locale entries
 */
function walkLocales (next: string[], objectProps: object) {

  if (next.length > 0) {
    return walkLocales(next, objectProps[next.shift()]);
  } else {
    return objectProps;
  }

};

/* -------------------------------------------- */
/* PUBLIC                                       */
/* -------------------------------------------- */

/**
 * Get Locale Completions
 *
 * Generates starting property completions for Shopify locales.
 * Locales are `key > value` objects. This function will prepare
 * the entires for traversal by exposing keys of the locale file.
 */
export function getLocaleCompletions (
  uri: string,
  props?: string,
  additionalTextEdits: TextEdit[] = []
): CompletionItem[] {

  const locales = $.liquid.files.get('locales');
  const items = walkLocales(props.split('.').filter(Boolean), locales);

  if (isString(items)) return null;

  const reference = `[${basename(uri)}](${uri})`;
  const location = uri.split('/');
  const filename = location.pop();
  const dirname = location.pop();
  const detail = join(dirname, filename);

  return entries(items).map(([ label, prop ]): CompletionItem => {

    const object = typeof props === 'object';
    const value = object
      ? keys(prop).length
      : isString(prop) ? prop : keys(prop).length;

    const documentation = isNumber(value)
      ? mdLines(`**${label}**`, `${value} available fields`, reference)
      : mdString('```js\n"' + value + '"\n```', {
        name: basename(uri),
        url: uri
      });

    return {
      label,
      kind: CompletionItemKind.Module,
      detail,
      preselect: true,
      insertText: new SnippetString(label),
      additionalTextEdits,
      documentation
    };

  });
};

/**
 * Property Completions
 *
 * Sets the completion items that are passed to the completion resolver.
 * Extracts necessary values from the passed in specification record.
 */
function getObjectProperties ([ label, spec ]): CompletionItem {

  const settings = spec.scope === 'settings';

  return {
    label,
    insertText: label,
    documentation: mdString(spec.description),
    preselect: true,
    kind: settings
      ? kind(spec.type)
      : objectKind(spec.type),
    tags: spec.deprecated
      ? [ CompletionItemTag.Deprecated ]
      : [],
    detail: settings
      ? spec.summary
      : detail(spec.type)

  };
}

/**
 * Parse Object
 *
 * Parses an object from current content offset location.
 * The resulting logical walks the Liquid Language Specifications.
 */
export function getPropertyCompletions (token: IToken, vars: Complete.Vars) {

  /**
   * Reference of the `token.props` value
   */
  let props: any;

  /**
   * Reference of the first known object name, eg: `object` in `object.prop.foo`
   */
  let vprop: any;

  /**
   * Whether or not we are within an for loop
   */
  let array: boolean = false;

  if (token.object && vars.has(token.object)) {

    const item = vars.get(token.object);

    array = item.kind === Tag.For;

    if (array === true || item.type === Type.object || item.type === Type.keyword) {
      props = item.value;
      vprop = token.tagName;
    } else {
      props = token.tagName;
    }

  } else if (vars.has(token.tagName)) {

    const item = vars.get(token.tagName);
    array = item.kind === Tag.For;

    if (array === true || item.type === Type.object || item.type === Type.keyword) {
      props = item.value;
      vprop = token.object;
    } else {
      props = token.object;
    }

  } else {

    props = token.object;

  }

  props = props.split('.').filter(Boolean);

  if (vprop) {
    vprop = vprop.split('.').filter(Boolean);
    vprop.shift();
    props.push(...vprop);
  }

  if (props.length === 2) {
    if (props[1] === 'settings') {
      if (props[0] === 'section') return Token.SchemaSettings;
      if (props[0] === 'block') return Token.SchemaBlock;
    }
  } else if (props.length === 3) {
    if (props[0] === 'section' && props[1] === 'blocks' && props[2] === 'settings') {
      return Token.SchemaBlock;
    }
  }

  if (q.setObject(props.shift())) return walkProps(props, $.liquid.object.properties);

  return null;
}

/* -------------------------------------------- */
/* PUBLIC                                       */
/* -------------------------------------------- */

/**
 * Complete Variables
 *
 * Generates the completion items for variables.
 */
export function getObjectCompletions (
  textDocument: TextDocument,
  objects: CompletionItem[],
  vars: Complete.Vars,
  offset: number = -1
): CompletionItem[] {

  const items: CompletionItem[] = [];
  const type = $.liquid.type;

  if (vars.size > 0) {

    const endtag = textDocument.getText().indexOf('endfor', offset) > -1;

    vars.forEach(function (item) {

      if (item.kind === Tag.For && !(endtag && offset > item.ender)) return;

      if (type !== null && (type === Type.array || type === Type.object)) {
        if (type !== item.type && Type.keyword !== item.type) return;
      }

      const md = new MarkdownString();
      const begin = textDocument.positionAt(item.begin);
      const range = new Range(begin, textDocument.positionAt(item.ender));

      if (item.kind === Tag.Assign) {
        md.appendCodeblock(textDocument.getText(range), 'liquid');
        md.appendMarkdown(`**Line:** ${begin.line + 1}`);
      } else if (item.kind === Tag.Capture) {
        md.appendCodeblock(textDocument.getText(range), 'liquid');
        md.appendMarkdown(`**Line:** ${begin.line + 1}`);
      }

      items.push({
        label: item.label,
        kind: CompletionItemKind.Variable,
        insertText: new SnippetString(item.label),
        detail: detail(item.type),
        preselect: true,
        sortText: '!',
        documentation: md
      });

    });
  }

  items.push(...objects);

  return items;

}

/**
 * Get Schema Completions
 *
 * Generates the completion items for the `{% schema %}` code block
 * region. The items are cherry picked from the JSON Language Service
 * parsed JSON content.
 */
export function getSchemaCompletions (slice: number, position: Position, items: CompletionItem[]): CompletionItem[] {

  return items.map(({
    label,
    documentation,
    textEdit,
    kind
  }: CompletionItem & { documentation: { value: string } }) => {

    const range = new Range(
      new Position(position.line, position.character),
      new Position(position.line, textEdit.range.end.character)
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

export function setTemplateCompletions () {

}
