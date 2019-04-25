import { workspace } from 'vscode'

export const preset = [
  'javascript',
  'stylesheet',
  'schema',
  'style'
]

export const ignore = [
  'comment',
  'script'
].concat(workspace.getConfiguration('liquid').formatIgnore || [])

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
    node_error: true
  },
  schema: {
    mode: 'beautify',
    language: 'JSON',
    language_name: 'json',
    lexer: 'script',
    indent_size: workspace.getConfiguration('editor').tabSize
  },
  stylesheet: {
    mode: 'beautify',
    language_name: 'SASS',
    language: 'scss',
    lexer: 'style',
    preserve: 1,
    indent_size: workspace.getConfiguration('editor').tabSize
  },
  javascript: {
    mode: 'beautify',
    language_name: 'JavaScript',
    language: 'javascript',
    lexer: 'script',
    preserve: 1,
    indent_size: workspace.getConfiguration('editor').tabSize
  }
}

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
