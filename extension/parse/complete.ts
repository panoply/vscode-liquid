import { Char, Complete, Tag, Token } from 'types';
import { IToken } from 'parse/tokens';
import { Properties, $, Type, q, Value, TypeBasic, IProperty, IObject } from '@liquify/specs';
import slash, { entries, isNumber, isObject, isString, keys } from 'utils';
import { join } from 'node:path';
import { mdString, detail, kind, objectKind } from 'parse/helpers';
import {
  CompletionItemTag,
  CompletionItem,
  CompletionItemKind,
  Range,
  SnippetString,
  MarkdownString,
  TextDocument,
  Position,
  Uri
} from 'vscode';

import { has, path } from 'rambdax';

/* -------------------------------------------- */
/* PRIVATES                                     */
/* -------------------------------------------- */

/**
 * Object Walks
 *
 * Walks over a provided object string and determines
 * the property completions to show.
 */
function walkProps (next: string[], objectProps: Properties, inForLoop: boolean) {

  if (next.length > 0 && q.isProperty(next.shift())) {

    if ($.liquid.object.type === TypeBasic.array && inForLoop !== true) return null;

    return walkProps(next, $.liquid.object.properties, inForLoop);

  } else {

    if (!objectProps) return null;

    return $.liquid.type
      ? entries(objectProps).filter(x => x[1]?.type === $.liquid.type as any).map(getObjectProperties)
      : entries(objectProps).map(getObjectProperties);
  }

};

/**
 * Frontmatter Walks
 *
 * Walks over files frontmatter data
 */
function frontmatterProps (next: string[], objectProps: object) {

  if (next.length > 0) {
    return walkLocales(next, objectProps[next.shift()]);
  } else {
    return objectProps;
  }

};

/**
 * Frontmatter Walks
 *
 * Walks over files frontmatter data
 */
function dataFileProps (next: string[], objectProps: object) {

  if (next.length > 0) {
    return walkLocales(next, objectProps[next.shift()]);
  } else {
    return objectProps;
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

/**
 * Setting Walks
 *
 * Walks over locale entries
 */
function walkSettings (props: string[]) {

  if (props.length === 2) return null;

  q.setObject(props.shift());

  return entries($.liquid.object.properties).map(getObjectProperties);

};

/* -------------------------------------------- */
/* PUBLIC                                       */
/* -------------------------------------------- */

export function getLocaleArguments (token: IToken, trigger: Char) {

  const match = token.text.match(/['"].*?['"]/);

  if (match === null) return null;

  const locale = match[0].slice(1, -1);
  const value = path<string>(locale, $.liquid.files.get('locales'));
  const liquid = value.match(/{{.*?}}/g);

  if (liquid === null) return null;

  const completion = Array.from(liquid).map((item) => {

    const label = item.match(/(?<={{-?\s*)\w+/)[0];
    const documentation = new MarkdownString();

    documentation.supportThemeIcons = true;
    documentation.supportHtml = true;

    documentation.appendCodeblock(`\n${value}\n`, 'liquid');

    return {
      label,
      kind: CompletionItemKind.Property,
      detail: locale,
      preselect: true,
      insertText: new SnippetString(` ${label}: $1`),
      documentation
    };

  });

  if (trigger === Char.COM) {

    const prop = token.text.slice(token.text.lastIndexOf('t:', token.offset) + 2);
    const args = prop.match(/[a-zA-Z0-9_]+(?=:)/g);

    if (args === null) return completion;

    const active = Array.from(args);

    return completion.filter(({ label }) => active.includes(label) === false);

  }

  return completion;

}

/**
 * Get Locale Completions
 *
 * Generates starting property completions for Shopify locales.
 * Locales are `key > value` objects. This function will prepare
 * the entires for traversal by exposing keys of the locale file.
 */
export function getLocaleCompletions (
  filePath: string,
  props: string,
  translateFilter: (label: string) => {
    insertText: SnippetString,
    range: {
      inserting: Range;
      replacing: Range;
    }
  }
): CompletionItem[] {

  const locales = $.liquid.files.get('locales');
  const items = walkLocales(props.split('.').filter(Boolean), locales);

  if (isString(items)) return null;

  const path = Uri.file(filePath);
  const location = slash(path.fsPath).split('/');
  const filename = location.pop();
  const dirname = location.pop();
  const detail = join(dirname, filename);

  return entries(items).map(([ label, prop ]): CompletionItem => {

    const object = typeof props === 'object';
    const value = object
      ? keys(prop).length
      : isString(prop) ? prop : keys(prop).length;

    const documentation = new MarkdownString();

    documentation.baseUri = path;
    documentation.supportThemeIcons = true;
    documentation.supportHtml = true;

    if (isNumber(value)) {
      documentation.appendMarkdown(`**${label}**\n\n`);
      documentation.appendMarkdown(`${value} available fields\n\n`);
    } else {
      documentation.appendCodeblock(`${value}`, 'liquid');
    }

    documentation.appendMarkdown(`[${filename}](./${filename})`);

    const translate = translateFilter(label);
    const completion: CompletionItem = {
      label,
      kind: CompletionItemKind.Module,
      detail,
      preselect: true,
      insertText: translate.insertText,
      documentation
    };

    if (translate.range !== null) completion.range = translate.range;

    return completion;

  });
};

/**
 * Property Completions
 *
 * Sets the completion items that are passed to the completion resolver.
 * Extracts necessary values from the passed in specification record.
 */
function getObjectProperties ([ label, spec ]: [ string, IProperty]): CompletionItem {

  const settings = spec.scope === 'settings';

  return {
    label,
    insertText: label,
    documentation: mdString(spec.description),
    preselect: true,
    kind: settings ? kind(spec.type) : objectKind(spec.type),
    tags: spec.deprecated ? [ CompletionItemTag.Deprecated ] : [],
    detail: settings ? spec.summary : detail(spec.type)

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

    if (
      props[0] === 'section' &&
      props[1] === 'blocks' &&
      props[2] === 'settings') {
      return Token.SchemaBlock;
    }

  }

  if (props[0] === 'settings') {

    return walkSettings(props);

  } else {

    if (q.setObject(props.shift())) {
      return walkProps(
        props,
        $.liquid.object.properties,
        array
      );
    }

  }
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

  if (objects) items.push(...objects);

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
    documentation = null,
    textEdit,
    kind
  }: CompletionItem & { documentation: { value?: string } }) => {

    const range = new Range(
      new Position(position.line, position.character),
      new Position(position.line, textEdit.range.end.character)
    );

    return {
      label,
      kind,
      insertText: new SnippetString(textEdit.newText.slice(slice)),
      documentation: documentation === null
        ? mdString(label as string)
        : isObject(documentation)
          ? mdString(documentation.value)
          : isString(documentation)
            ? mdString(documentation)
            : documentation || '',
      range: {
        inserting: range,
        replacing: range
      }
    };

  });

}

export function getLiquidTagSnippets () {

  return entries($.liquid.data.variation.tags)
    .filter(([ label ]) => (
      label !== 'liquid' &&
      label !== 'schema' &&
      label !== 'javascript' &&
      label !== 'style' &&
      label !== 'stylesheet'
    ))
    .map(([ label, spec ]) => {

      let insertText: string;

      if (label === 'if' || label === 'capture' || label === 'unless') {

        insertText = [
        `${label} $1`,
        `${label === 'capture' ? 'echo $0' : '$0'}`,
        `end${label}`
        ].join('\n');

      } else if (label === 'render' || label === 'section') {
        insertText = `${label} $0`;
      } else {

        insertText = spec.singleton
          ? `${label} ${spec.snippet ? spec.snippet : ''}`
          : [
          `${label} ${spec.snippet ? spec.snippet : ''}`,
          `${'$0'}`,
          `end${label}`
          ].join('\n');

      }

      return {
        label,
        kind: CompletionItemKind.Interface,
        insertText: new SnippetString(insertText),
        documentation: mdString(spec.description)
      };
    });
}

export function getTagFormArguments (fileName: string) {

  const args = $.liquid.data.variation.tags.form.arguments[0];
  const items: CompletionItem[] = [];
  const templateItems: CompletionItem[] = [];

  for (const item of (args.value as Value[])) {
    if (has('template', item)) {
      if (item.template === fileName) {
        templateItems.push({
          label: item.value as string,
          kind: CompletionItemKind.Reference,
          preselect: true,
          insertText: new SnippetString(item.value as string),
          documentation: mdString(item.description)
        });
      }
    } else {
      items.push({
        label: item.value as string,
        kind: CompletionItemKind.Reference,
        preselect: true,
        insertText: new SnippetString(item.value as string),
        documentation: mdString(item.description)
      });
    }
  }

  return templateItems.length > 0 ? templateItems : items;

}
