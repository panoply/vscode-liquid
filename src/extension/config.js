import { workspace } from 'vscode'

/**
 * Tag Presets
 */
export const preset = [
  'javascript',
  'stylesheet',
  'schema',
  'style'
]

/**
 * Ignored Tags
 */
export const ignore = [
  'comment',
  'script'
].concat(workspace.getConfiguration('liquid').formatIgnore || [])

/**
 * PrettyDiff Formatting Rules
 */
export const rules = {
  html: {
    mode: 'beautify',
    language_name: 'Liquid',
    language: 'html',
    lexer: 'markup',
    correct: true,
    preserve: 1,
    indent_size: workspace.getConfiguration('editor').tabSize,
    end_quietly: 'log',
    brace_block: false,
    node_error: true
  },
  schema: {
    mode: 'beautify',
    language: 'JSON',
    language_name: 'json',
    lexer: 'script',
    brace_block: false,
    no_semicolon: true,
    indent_size: workspace.getConfiguration('editor').tabSize
  },
  stylesheet: {
    mode: 'beautify',
    language_name: 'SASS',
    language: 'scss',
    lexer: 'style',
    preserve: 1,
    brace_block: true,
    indent_size: workspace.getConfiguration('editor').tabSize
  },
  javascript: {
    mode: 'beautify',
    language_name: 'JavaScript',
    language: 'javascript',
    lexer: 'script',
    preserve: 1,
    brace_block: true,
    no_semicolon: false,
    indent_size: workspace.getConfiguration('editor').tabSize
  }
}

/**
 * HTML/Liquid Tag Parser
 */
export const matches = {
  frontmatter: [
    '---',
    '(?:[^]*?)',
    '---'
  ],
  tags: [
    '(',
    '(?:<|{%-?)\\s*',
    `\\b(${preset.concat(ignore).join('|')})\\b`,
    '(?:.|\\n)*?\\s*',
    '(?:>|-?%})\\s*',
    ')',
    '(',
    '(?:.|\\n)*?',
    ')',
    '(',
    '(?:</|{%-?)\\s*',
    '\\b(?:(?:|end)\\2)\\b',
    '\\s*(?:>|-?%})',
    ')'
  ],
  ignore: [
    '(',
    '<temp data-prettydiff-ignore>',
    '|',
    '</temp>',
    ')'
  ]
}
