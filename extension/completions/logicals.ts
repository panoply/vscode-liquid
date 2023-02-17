import { CompletionItem, CompletionItemKind, SnippetString, MarkdownString } from 'vscode';

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
