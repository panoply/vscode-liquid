import { workspace } from 'vscode'
import prettydiff from 'prettydiff'

/**
 * # Editor Configuration
 */
export const editor = workspace.getConfiguration('editor')

/**
 * # Liquid Configuration
 */
export const liquid = workspace.getConfiguration('liquid')

/**
 * # PrettyDiff Defaults
 */
export const defaults = prettydiff.defaults

/**
 * Parser Pattern Matches
 */
export const pattern = {
  open: (tags) => `((?:<|{%-?)\\s*\\b(${tags})\\b(?:.|\\n)*?\\s*(?:>|-?%})\\s*)`,
  inner: '((?:.|\\n)*?)',
  close: '((?:</|{%-?)\\s*\\b(?:(?:|end)\\2)\\b\\s*(?:>|-?%}))',
  wrap: (code) => `<temp data-prettydiff-ignore>${code}</temp>`,
  unwrap: new RegExp(`(<temp data-prettydiff-ignore>|</temp>)`, 'g')
}

/**
 * Formatting File Register
 */
export const schema = {
  scheme: 'file',
  language: 'html'
}

/**
 * Default Formatting Rules
 */
export const rules = {
  html: {
    mode: 'beautify',
    language: 'liquid',
    lexer: 'markup'
  },
  schema: {
    mode: 'beautify',
    language: 'JSON',
    lexer: 'script'
  },
  stylesheet: {
    mode: 'beautify',
    language: 'SCSS',
    lexer: 'style'
  },
  javascript: {
    mode: 'beautify',
    language: 'JavaScript',
    lexer: 'script'
  }
}

export default {
  editor,
  liquid,
  defaults,
  pattern,
  schema,
  rules
}
