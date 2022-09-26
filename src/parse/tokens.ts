import { q, liquid, Tag, Filter, Object as IObject, $, Type, Types as ITypes } from '@liquify/liquid-language-specs';
import { has } from 'rambdax';
import {
  CompletionItemKind,
  MarkdownString,
  CompletionItem,
  SnippetString,
  CompletionItemTag,
  CompletionTriggerKind,
  TextDocument,
  Position,
  CancellationToken,
  TextEdit
} from 'vscode';
import { Char, Token, Words } from './enums';

/* -------------------------------------------- */
/* UTILITIES                                    */
/* -------------------------------------------- */

function documentation (description: string, reference: { name?: string; url: string; }) {


  if (reference && has('name', reference) && has('url', reference)) {
    return new MarkdownString(`${description}\n\n[${reference.name}](${reference.url})`);
  }

 return new MarkdownString(description);

}


/**
 * Set Object Type
 *
 * Sets the object completion item kind symbol.
 * This is also used for filtering completions so
 * otherwise invalid items don't show up at certain entries.
 */
function setObjectType(type: Type | ITypes.Basic): CompletionItemKind {

  if (type === Type.array) return CompletionItemKind.Field
  if (type === Type.object) return CompletionItemKind.Module
  if (type === Type.data) return CompletionItemKind.Value

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
]: [ string, Tag ]): CompletionItem {

  const insertText = singular
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
]: [ string, Filter ]): CompletionItem {


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
 * Get Array Object Completion
 *
 * Generates the object completions to be used. This logic is
 * partially lifted from the specs. It's a temporary solution
 * as this is handled in Liquify.
 */
export function getObjectKind(items: CompletionItem[], kind: CompletionItemKind[]): CompletionItem[] {

  return items.filter(item => kind.includes(item.kind))

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


export function prevWord (content: string, offset: number, word: Words) {

  const prev = content.slice(0, offset)

  return new RegExp(`\\s\\b${word}\\b\\s+$`).test(prev)

}



export function prevChar (content: string, offset: number, code: Char[]) {

  const char = content
    .slice(0, offset)
    .replace(/\s+$/, '').length - 1

  return code.includes(content[char].charCodeAt(0))

}

export function isEmptyObject(content: string) {

  return /{{-?-?}}/.test(content.replace(/\s+/, ''))

}

export function isEmptyTag(content: string) {


  return /{%-?-?%}/.test(content.replace(/\s+/, ''))

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


  const begin = content.slice(0, offset).lastIndexOf(kind === Token.Tag ? '{%' : '{{')
  const ender = content.indexOf(kind === Token.Tag ? '%}' : '}}', begin) + 2
  const within = offset > (begin + 2) && offset < (ender - 2)

  const text = content.slice(begin, ender)
  const startTrim = text.charCodeAt(2) === 45
  const endTrim = text.charCodeAt(ender - 3) === 45


  return {
    within,
    begin,
    ender,
    startTrim,
    endTrim,
    text,
    get tagName() {  return text.slice(startTrim ? 3 : 3).match(/\w+/i)[0] },
    offset: offset - ender,
  }
}
