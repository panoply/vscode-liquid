import { has } from 'rambdax';
import { Completions, SchemaSectionTag, SchemaSettings, SettingsData, Char, Token } from '../types';
import { entries, isString } from '../utils';
import { basename } from 'node:path';
import parseJson from 'parse-json';
import * as r from './regex';
import {
  liquid,
  Tag,
  Filter,
  Object as IObject,
  Type,
  Types as ITypes,
  Properties
} from '@liquify/liquid-language-specs';
import {
  CompletionItemKind,
  MarkdownString,
  CompletionItem,
  SnippetString,
  CompletionItemTag,
  Position,
  Range,
  TextEdit,
  TextDocument
} from 'vscode';
import { getCompletionKind } from './schema';
import { ICompletionFiles } from '../providers/CompletionProvider';

/* -------------------------------------------- */
/* UTILITIES                                    */
/* -------------------------------------------- */

/**
 * Generate Documentation
 *
 * Composes a Markdown string from Liquid Language Specifications.
 */
function documentation (description: string, reference?: { name?: string; url: string; }) {

  if (reference && has('name', reference) && has('url', reference)) {
    return new MarkdownString(`${description}\n\n[${reference.name}](${reference.url})`);
  }

  return new MarkdownString(description);

}

/**
 * Generate Section Liquid Documentation
 *
 * Composes documentation for `block.settings.*` and similar Liquid
 * type completions.
 */
export function getSchemaDocumentation (setting: SchemaSettings & { default?: string}) {

  const defaults = has('default', setting)
    ? `\nDefault: \`${setting.default}\``
    : '';

  return new MarkdownString(`${setting.info || setting.label}\n${defaults}`);

}

/**
 * Set Object Type
 *
 * Sets the object completion item kind symbol.
 * This is also used for filtering completions so
 * otherwise invalid items don't show up at certain entries.
 */
function setObjectType (type: Type | ITypes.Basic): CompletionItemKind {

  if (type === Type.array) return CompletionItemKind.Field;
  if (type === Type.object) return CompletionItemKind.Module;

  // @ts-ignore
  if (type === Type.data as any) return CompletionItemKind.Value;

};

/* -------------------------------------------- */
/* EXPORTS                                      */
/* -------------------------------------------- */

/**
 * Get Tag Completions
 *
 * Generates the tag completions to be used. This logic is
 * partially lifted from the specs. It's a temporary solution
 * as this is handled in Liquify.
 */
export function getTagCompletions ([
  label,
  {
    description,
    reference,
    deprecated = false,
    singular = false,
    snippet = '$1'
  }
]: [
  string,
  Tag
]): CompletionItem {

  const insertText = label === 'else'
    ? new SnippetString(` ${label} %}$0`)
    : label === 'liquid'
      ? new SnippetString(` ${label} ${snippet} %}$0`)
      : singular
        ? new SnippetString(` ${label} ${snippet} %}$0`)
        : new SnippetString(` ${label} ${snippet} %} $0 {% end${label} %}`);

  return {
    label,
    kind: CompletionItemKind.Keyword,
    tags: deprecated ? [ CompletionItemTag.Deprecated ] : [],
    insertText,
    documentation: documentation(description, reference)
  };

}

/**
 * Get Filter Completions
 *
 * Generates the Filter completions to be used. This logic is
 * partially lifted from the specs. It's a temporary solution
 * as this is handled in Liquify.
 */
export function getFilterCompletions ([
  label,
  {
    description,
    deprecated = false,
    reference = null,
    snippet
  }
]: [
  string,
  Filter
]): CompletionItem {

  const insertText = new SnippetString(snippet || label);

  return {
    label,
    kind: CompletionItemKind.Value,
    tags: deprecated ? [ CompletionItemTag.Deprecated ] : [],
    insertText,
    documentation: documentation(
      description,
      reference
    )
  };

}

/**
 * Get Schema Completions
 *
 * Generates the completion items for the `{% schema %}` code block
 * region. The items and cherry picked from the JSON Language Service
 * parsed JSON content.
 */
export function getSchemaCompletions (
  slice: number,
  line: number,
  character: number,
  items: CompletionItem[]
): CompletionItem[] {

  return items.map((item: CompletionItem) => {

    return {
      label: item.label,
      kind: item.kind,
      insertText: new SnippetString(item.textEdit.newText.slice(slice)),
      documentation: new MarkdownString((item.documentation as any).value),
      preselect: true,
      range: {
        inserting: new Range(
          new Position(line, character),
          new Position(line, item.textEdit.range.end.character)
        ),
        replacing: new Range(
          new Position(line, character),
          new Position(line, item.textEdit.range.end.character)
        )
      }
    };

  });

}

export function getSnippetCompletions (file: string): CompletionItem {

  const label = basename(file, '.liquid');

  return {
    label,
    kind: CompletionItemKind.File,
    insertText: new SnippetString(label),
    preselect: true,
    documentation: new MarkdownString(`**Snippet [${label}.liquid](${file})**`)
  };

}

/**
 * Get Logical Completions
 *
 * Generates the logical conditional based completion
 * items used within control type tokens.
 */
export function getLogicalCompletions (): CompletionItem[] {

  return [
    {
      label: '==',
      kind: CompletionItemKind.Operator,
      insertText: new SnippetString('=='),
      documentation: new MarkdownString('Equals')
    },
    {
      label: '!=',
      kind: CompletionItemKind.Operator,
      insertText: new SnippetString('!='),
      documentation: new MarkdownString('Does not equal')
    },
    {
      label: '>',
      kind: CompletionItemKind.Operator,
      insertText: new SnippetString('>'),
      documentation: new MarkdownString('Greater than')
    },
    {
      label: '<',
      kind: CompletionItemKind.Operator,
      insertText: new SnippetString('<'),
      documentation: new MarkdownString('Less than')
    },
    {
      label: '>=',
      kind: CompletionItemKind.Operator,
      insertText: new SnippetString('>='),
      documentation: new MarkdownString('Greater than or equal to')
    },
    {
      label: '<=',
      kind: CompletionItemKind.Operator,
      insertText: new SnippetString('<='),
      documentation: new MarkdownString('Less than or equal to')
    },
    {
      label: 'and',
      kind: CompletionItemKind.Operator,
      insertText: new SnippetString('and'),
      documentation: new MarkdownString('Logical and')
    },
    {
      label: 'or',
      kind: CompletionItemKind.Operator,
      insertText: new SnippetString('or'),
      documentation: new MarkdownString('Logical or')
    },
    {
      label: 'contains',
      kind: CompletionItemKind.Operator,
      insertText: new SnippetString('contains'),
      documentation: new MarkdownString('contains checks for the presence of a substring inside a string and can also check for the presence of a string in an array of strings.\n\n**You cannot use it to check for an object in an array of objects.**')
    }
  ];
}

/**
 * Get Array Object Completion
 *
 * Generates the object completions to be used. This logic is
 * partially lifted from the specs. It's a temporary solution
 * as this is handled in Liquify.
 */
export function getObjectKind (items: CompletionItem[], kind: CompletionItemKind[]): CompletionItem[] {

  return items.filter(item => kind.includes(item.kind));

};

/**
 * Get Object Completions
 *
 * Generates the object completions to be used. This logic is
 * partially lifted from the specs. It's a temporary solution
 * as this is handled in Liquify.
 */
export function getObjectCompletions ([ label, spec ]: [ string, IObject ]): CompletionItem {

  return {
    label,
    tags: spec.deprecated ? [ CompletionItemTag.Deprecated ] : [],
    kind: spec.const ? CompletionItemKind.Constant : setObjectType(spec.type),
    preselect: true,
    documentation: documentation(spec.description, spec.reference)
  };

};

function isSchemaBlockType (content: string, operator: string, tagName: string) {

  if ((tagName === 'if' || tagName === 'elsif') && /==/.test(operator)) {

    const token = content.indexOf(tagName, 2) + tagName.length;
    const condition = content.slice(token).trimLeft();
    const logical = condition.slice(0, condition.indexOf(operator)).trim().split('.');

    return logical[0] === 'block' && logical[1] === 'type';

  }

  return false;
}

/**
 * Previous Character
 *
 * Determines the previous character from the current cursor location.
 * This is a series of validation checks which is used to infer the
 * type of completion to be provided.
 */
export function prevChar (content: string, offset: number, tagName?: string): Token {

  const prev = content.slice(0, offset).trimEnd();
  const last = prev.charCodeAt(prev.length - 1);

  if (last === Char.PIP) {
    return Token.Filter;
  }

  if (last === Char.COL) {
    return Token.Object;
  }

  if (last === Char.DOT) {
    if (/["'][^'"]*?$/.test(content.slice(2, offset - 1))) {
      return Token.Locale;
    } else {
      return Token.Property;
    }
  }

  if (prev.charCodeAt(prev.length - 2) === Char.LSB && (
    last === Char.SQO ||
    last === Char.DQO
  )) {

    return Token.Property;

  }

  let wsp: number;

  if (last === Char.SQO || last === Char.DQO) {
    wsp = content.slice(0, offset - 1).trimEnd().lastIndexOf(' ');
  } else {
    wsp = prev.lastIndexOf(' ');
  }

  if (wsp > -1) {

    const word = prev.slice(wsp);

    if (r.Operators.test(word)) {
      return isSchemaBlockType(content, word, tagName) ? Token.Block : Token.Object;
    }
  }

  if (isString(tagName)) {

    if (tagName === 'if' || tagName === 'elsif' || tagName === 'unless') {

      if (r.Tag(tagName).test(content)) return Token.Object;
      if (r.EmptyEnder.test(content.slice(offset))) return Token.Logical;

    } else if (tagName === 'case' || tagName === 'when') {

      if (r.Tag(tagName).test(content)) return Token.Object;

    } else if (tagName === 'render' || tagName === 'include' || tagName === 'section') {

      return Token.Tag;

    }
  }

  return null;

}

export function prevChars (content: string, offset: number, code: Char[]) {

  const char = content.slice(0, offset).replace(/\s+$/, '').length - 1;

  if (!content[char]) return null;

  return code.includes(content[char].charCodeAt(0));

}

export function applyTranslateFilter (text: string) {

  return (/['"]\s*(?=-?}})/).test(text);

}

/**
 * Set Completion Items
 *
 * Sets the completion items that are passed to the completion resolver.
 * Extracts necessary values from the passed in specification record.
 */
export function ProvideProps ([ label, { description, snippet = label } ]) {

  return {
    label,
    kind: CompletionItemKind.Property,
    insertText: snippet,
    documentation: new MarkdownString(description)
  };
}

/**
 * Determine Token
 *
 * Determines the type of token we a dealing with, meaning
 * whether we are within an tag type or output type. If `null`
 * is returned, then cursor is not within a a Liquid token.
 */
export function typeToken (content: string, offset: number) {

  const begin = content.slice(0, offset).lastIndexOf('{');
  const token = content.slice(begin, offset);

  if (token.charCodeAt(1) === Char.PER) return Token.Tag;
  if (content.charCodeAt(begin - 1) === Char.LCB) return Token.Object;

  return null;

}

export function getSchema (textDocument: TextDocument) {

  const content = textDocument.getText();
  const detect = content.indexOf('endschema');

  if (detect === -1) return false;

  const start = content.lastIndexOf('%}', detect) + 2;
  const ender = content.lastIndexOf('{%', detect);
  const offset = textDocument.positionAt(start);

  return {
    offset: offset.line,
    content: content.slice(start, ender)
  };

}

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

  if (!has(props[0], locales.items)) return entries(locales.items).map(ProvideLocales as any);

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
      : typeof object === 'object' ? entries(object).map(ProvideLocales) : null;

  }(props.slice(1), locales.items[props[0]]));

}

/**
 * Generates Local description, the provided `type`
 * enum will determine the the text to return.
 *
 * - `1` Returns the _available fields_ type description.
 * - `2` Returns the _value_ of the locale property.
 */
function getLocaleDescription (
  type: 1 | 2,
  label: string,
  value: string,
  uri: string
) {

  const filename = basename(uri);

  if (type === 1) {
    return new MarkdownString(`\`${label}\`\n\n${value} available fields\n\n---\n\n[${filename}](${uri})\n\n`);
  } else {
    return new MarkdownString(`\`${label}\`\n\n${value}\n\n---\n\n[${filename}](${uri})\n\n`);
  }

}

/**
 * Parse Locale Objects
 *
 * Similar to `parseObject` but instead provides locale file based completions.
 */
export function parseLocale (
  locales: ICompletionFiles['locales'],
  content: string,
  offset: number,
  options: {
    addFilter: boolean,
    position: Position
  }
) {

  /**
   * Set Locale Items
   *
   * Sets the completion items that are passed to the completion resolver.
   * Extracts necessary values from the passed in specification record.
   */
  function ProvideLocales ([ label, props ]): CompletionItem {

    const value = typeof props === 'object'
      ? Object.keys(props).length
      : typeof props[label] === 'object'
        ? Object.keys(props[label]).length
        : props;

    return {
      label,
      kind: CompletionItemKind.Module,
      insertText: new SnippetString(label),
      additionalTextEdits: options.addFilter ? [
        TextEdit.insert(new Position(options.position.line, options.position.character + 2), '| t ')
      ] : [],
      documentation: typeof props === 'object'
        ? getLocaleDescription(1, label, value, locales.path)
        : getLocaleDescription(2, label, value, locales.path)
    };
  }

  const slice = content.slice(2, offset - 1);
  const match = slice.match(/[^\s"']*?$/);

  if (match === null) return null;

  const props = match[0].split('.').filter(Boolean);

  if (!has(props[0], locales.items)) return entries(locales.items).map(ProvideLocales as any);

  if (props.length === 1) {

    const next = locales.items[props[0]] || null;

    if (next === null) return null;
    return Object.entries(next).map(ProvideLocales as any);
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
      : typeof object === 'object' ? entries(object).map(ProvideLocales) : null;

  }(props.slice(1), locales.items[props[0]]));

}

/* -------------------------------------------- */
/* OBJECT PARSER                                */
/* -------------------------------------------- */

export function getVariableObject (vars: {
  start: number,
  ender: number,
  value: string,
  detail: string,
  type: Type,
  keyword: string
}, settings?: SettingsData[]) {

  const props = vars.value.split('.').filter(Boolean);

  if (props[0] === 'settings') {

    const setting = ProvideSettings(settings);

    return props.length === 1
      ? setting.props
      : props.length === 2 ? setting.items[props[1]] : null;

  }

  if (props[1] === 'settings' && props.length === 2) {
    if (props[0] === 'section') {
      return 'settings';
    } else if (props[0] === 'block') {
      return 'block';
    }
  }

  if (!has(props[0], liquid.shopify.objects)) return null;

  if (props.length === 1) {

    const { properties = null } = liquid.shopify.objects[props[0]];

    if (properties === null) return null;

    return entries(properties).map(ProvideProps as any);
  }

  return (function walk (next: string[], value: Properties) {

    if (!value) return null;
    if (!has(next[0], value)) return null;
    if (!has('properties', value[next[0]])) return null;

    const object = value[next[0]].properties;

    // We check if we have walked to the last property
    // to which we can then provide properties, if we haven't
    // we continuall walk the values
    return next.length > 1
      ? object && walk(next.slice(1), object)
      : object ? entries(object).map(ProvideProps as any) : null;

  }(props.slice(1), liquid.shopify.objects[props[0]].properties));

}

/**
 * Parse Object
 *
 * Parses an object from current content offset location.
 * The resulting logical walks the Liquid Language Specifications.
 */
export function parseObject (content: string, offset: number, settings?: SettingsData[]) {

  const slice = content.slice(2, offset - 1);
  const match = slice.match(/[^\s{<=>:]*?$/);

  if (match === null) return null;

  const props = match[0].split('.').filter(Boolean);

  if (props[0] === 'settings') {

    const setting = ProvideSettings(settings);

    return props.length === 1
      ? setting.props
      : props.length === 2 ? setting.items[props[1]] : null;

  }

  if (props[1] === 'settings' && props.length === 2) {
    if (props[0] === 'section') {
      return 'settings';
    } else if (props[0] === 'block') {
      return 'block';
    }
  }

  if (!has(props[0], liquid.shopify.objects)) return null;

  if (props.length === 1) {

    const { properties = null } = liquid.shopify.objects[props[0]];

    if (properties === null) return null;

    return entries(properties).map(ProvideProps as any);
  }

  return (function walk (next: string[], value: Properties) {

    if (!value) return null;
    if (!has(next[0], value)) return null;
    if (!has('properties', value[next[0]])) return null;

    const object = value[next[0]].properties;

    // We check if we have walked to the last property
    // to which we can then provide properties, if we haven't
    // we continuall walk the values
    return next.length > 1
      ? object && walk(next.slice(1), object)
      : object ? Object.entries(object).map(ProvideProps as any) : null;

  }(props.slice(1), liquid.shopify.objects[props[0]].properties));
}

/* -------------------------------------------- */
/* SCHEMA PARSER                                */
/* -------------------------------------------- */

/**
 * Parse Schema
 *
 * Determines whether or not the cursor is currently within a `{% schema %}`
 * code block region. The function returns an object informing on the location
 * offsets of the code region. Use the `within` property for checksum.
 */
export function parseSchema (content: string, offset: number): false | {
  /**
   * Whether or not we are located within a schema tag region.
   */
  within: boolean;
  /**
   * The starting offset location the schema tag, ie: `{% schema %}^`
   */
  start: number;
  /**
   * The ender offset location the schema tag, ie: `^{% endschema %}`
   */
  ender: number;
  /**
   * The inner contents of the `{% schema %}` tag as a string.
   */
  get content(): string
  /**
   * Parse the inner contents of the `{% schema %}` tag
   */
  parse(): SchemaSectionTag
} {

  const detect = content.indexOf('endschema', offset);

  if (detect === -1) return false;

  const start = content.lastIndexOf('%}', detect) + 2;
  const ender = content.lastIndexOf('{%', detect);

  // We can proceed.
  return {
    within: offset > start && offset < ender,
    start,
    ender,
    get content () { return content.slice(start, ender); },
    parse: () => parseJson(content.slice(start, ender))
  };
}

/* -------------------------------------------- */
/* TOKEN PARSER                                 */
/* -------------------------------------------- */

/**
 * Parse Token
 *
 * Extract the Liquid token from an offset position. This is used to determine which completions
 * should be shown and provided via the completion provider. The returned object can be used to
 * determine the token and reason about with it.
 */
export function parseToken (kind: Token, content: string, offset: number): {
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
  get tagName(): string
} {

  const begin = content.lastIndexOf(kind === Token.Tag ? '{%' : '{{', offset);
  const ender = content.indexOf(kind === Token.Tag ? '%}' : '}}', begin) + 2;
  const within = offset >= (begin + 2) && offset <= (ender - 2);
  const text = content.slice(begin, ender);

  return {
    within,
    begin,
    ender,
    text,
    offset: offset - ender,
    get tagName () {
      return text.slice(text.charCodeAt(2) === Char.DSH ? 3 : 2).match(/\w+/i)[0];
    }
  };
}