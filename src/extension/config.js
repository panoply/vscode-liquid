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
    end_quietly: 'log',
    node_error: true,
    brace_block: false,

    // Inherited
    indent_size: workspace.getConfiguration('editor').tabSize,

    // Exposed Options
    correct: true,
    force_attribute: false,
    braces: false,
    preserve: 1
  },
  schema: {
    mode: 'beautify',
    language: 'JSON',
    language_name: 'json',
    lexer: 'script',

    // Inherited
    indent_size: workspace.getConfiguration('editor').tabSize,

    // Exposed Default Rules
    format_array: 'indent',
    preserve: 0,
    braces: true,
    no_semicolon: true,
    brace_block: false
  },
  stylesheet: {
    mode: 'beautify',
    language_name: 'SASS',
    language: 'scss',
    lexer: 'style',

    // Inherited
    indent_size: workspace.getConfiguration('editor').tabSize,

    // Exposed Default Rules
    css_insert_lines: true,
    preserve: 2,
    braces: false,
    brace_block: false
  },
  javascript: {
    mode: 'beautify',
    language_name: 'JavaScript',
    language: 'javascript',
    lexer: 'script',

    // Inherited
    indent_size: workspace.getConfiguration('editor').tabSize,

    // Exposed Rules
    preserve: 1,
    method_chain: 0,
    quote_convert: 'none',
    format_array: 'indent',
    format_object: 'indent',
    braces: false,
    no_semicolon: false,
    brace_block: false
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
