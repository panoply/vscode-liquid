import { workspace } from 'vscode'
import prettydiff from 'prettydiff'

/**
 * # PrettyDiff Defaults
 */
export const defaults = prettydiff.defaults

/**
 * # Editor Configuration
 */
export const editor = workspace.getConfiguration('editor')

/**
 * Default Formatting Rules
 */
export const rules = {
  html: {
    mode: 'beautify',
    language: 'liquid',
    lexer: 'markup',
    indent_size: editor.tabSize,
    ignore_tags: ['script',
      'style',
      'comment']
  },
  schema: {
    mode: 'beautify',
    language: 'JSON',
    lexer: 'script',
    indent_size: editor.tabSize
  },
  stylesheet: {
    mode: 'beautify',
    language: 'SCSS',
    lexer: 'style',
    indent_size: editor.tabSize
  },
  javascript: {
    mode: 'beautify',
    language: 'JavaScript',
    lexer: 'script',
    indent_size: editor.tabSize
  }
}

export default {
  editor,
  defaults,
  rules
}
