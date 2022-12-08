import { liquid, Tag, Filter, Object as IObject, Type, Types as ITypes, Properties } from '@liquify/liquid-language-specs';
import { has } from 'rambdax';
import { SchemaSettings } from 'types';
import {
  CompletionItemKind,
  MarkdownString,
  CompletionItem,
  SnippetString,
  CompletionItemTag,
  Position,
  TextEdit,
  Range
} from 'vscode';
import { Char, Token } from './enums';

/* -------------------------------------------- */
/* UTILITIES                                    */
/* -------------------------------------------- */

function documentation (description: string, reference: { name?: string; url: string; }) {

  if (reference && has('name', reference) && has('url', reference)) {
    return new MarkdownString(`${description}\n\n[${reference.name}](${reference.url})`);
  }

  return new MarkdownString(description);

}

export function schemaDocumentation (setting: SchemaSettings & { default?: string}) {

  const defaults = has('default', setting) ? `\nDefault: \`${setting.default}\`` : '';

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
  if (type === Type.data) return CompletionItemKind.Value;

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
    documentation: documentation(
      description,
      reference
    )
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
]: [ string, Filter
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
      documentation: item.documentation,
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
    kind: spec.const
      ? CompletionItemKind.Constant
      : setObjectType(spec.type),
    documentation: documentation(
      spec.description,
      spec.reference
    )
  };

};

function isSchemaBlockType (content: string, operator: string, tagName: string) {

  if (/(?:if|elsif)/.test(tagName) && /={2}/.test(operator)) {
    const token = content.indexOf(tagName, 2) + tagName.length;
    const condition = content.slice(token).trimLeft();
    const logical = condition.slice(0, condition.indexOf(operator)).trim().split('.');
    return logical[0] === 'block' && logical[1] === 'type';
  }

  return false;
}

export function prevChar (content: string, offset: number, tagName?: string): Token {

  const prev = content.slice(0, offset).trimEnd();
  const last = prev.length - 1;

  if (prev.charCodeAt(last) === Char.PIP) return Token.Filter;
  if (prev.charCodeAt(last) === Char.COL) return Token.Object;
  if (prev.charCodeAt(last) === Char.DOT) return Token.Property;
  if (prev.charCodeAt(last - 1) === Char.LSB) {
    if (prev.charCodeAt(last) === Char.SQO || prev.charCodeAt(last) === Char.DQO) {
      return Token.Property;
    }
  }

  let wsp: number;

  if (prev.charCodeAt(last) === Char.SQO || prev.charCodeAt(last) === Char.DQO) {
    wsp = content.slice(0, offset - 1).trimEnd().lastIndexOf(' ');
  } else {
    wsp = prev.lastIndexOf(' ');
  }

  if (wsp > -1) {

    const word = prev.slice(wsp);

    if (/([!=]=|[<>]=?|(?:and|or|contains|in|with)\b)/.test(word)) {
      if (isSchemaBlockType(content, word, tagName)) {
        return Token.Block;
      } else {
        return Token.Object;
      }
    }
  }

  if (typeof tagName === 'string') {

    const exp = new RegExp(`{%-?\\s*${tagName}\\s+-?%}`);

    if (/(?:if|elsif|unless)/.test(tagName)) {

      if (exp.test(content)) return Token.Object;
      if (/^\s*-?%}/.test(content.slice(offset))) return Token.Logical;

    } else if (/(?:case|when)/.test(tagName)) {

      if (exp.test(content)) return Token.Object;

    }
  }

  if (typeof tagName === 'string' && /(if|elsif|case|when|unless)/.test(tagName)) {
    if (new RegExp(`{%-?\\s*${tagName}\\s+-?%}`).test(content)) return Token.Object;
  }

  return null;

}

export function prevChars (content: string, offset: number, code: Char[]) {

  const char = content
    .slice(0, offset)
    .replace(/\s+$/, '').length - 1;

  if (!content[char]) return null;

  return code.includes(content[char].charCodeAt(0));

}

export function isEmptyObject (content: string) {

  return /{{-?\s+-?}}/.test(content);

}

export function isEmptyTag (content: string) {

  return /{%-?\s+-?%}/.test(content);

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
 * Parse Object
 *
 */
export function parseObject (content: string, offset: number) {

  const slice = content.slice(2, offset - 1);
  const match = slice.match(/[^\s{<=>:]*?$/);

  if (match === null) return null;

  const props = match[0].split('.').filter(Boolean);

  if (props[1] === 'settings') {
    if (props[0] === 'section') return 'settings';
    if (props[0] === 'block') return 'block';
  }

  if (!has(props[0], liquid.shopify.objects)) return null;

  if (props.length === 1) {
    const { properties = null } = liquid.shopify.objects[props[0]];
    if (properties === null) return null;
    return Object.entries(properties).map(ProvideProps as any);
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

export function determineToken (content: string, offset: number) {

  const begin = content.slice(0, offset).lastIndexOf('{');
  const token = content.slice(begin, offset);

  if (token.charCodeAt(1) === Char.PER) return Token.Tag;
  if (content.charCodeAt(begin - 1) === Char.LCB) return Token.Object;

  return null;

}

/**
 * Parse Token
 *
 * Extract the Liquid token from an offset position.
 * This is used to determine which completions should
 * be shown and provided via the completion provider.
 *
 * The returns object can be used to determine the token
 * and reason about with it.
 */
export function parseToken (kind: Token, content: string, offset: number) {

  const begin = content.lastIndexOf(kind === Token.Tag ? '{%' : '{{', offset);
  const ender = content.indexOf(kind === Token.Tag ? '%}' : '}}', begin) + 2;
  const within = offset > (begin + 2) && offset < (ender - 2);

  const text = content.slice(begin, ender);
  const startTrim = text.charCodeAt(2) === 45;
  const endTrim = text.charCodeAt(ender - 3) === 45;

  return {
    within,
    begin,
    ender,
    startTrim,
    endTrim,
    text,
    get tagName () { return text.slice(startTrim ? 3 : 2).match(/\w+/i)[0]; },
    offset: offset - ender
  };
}
