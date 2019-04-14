import { workspace } from 'vscode'
import prettydiff from 'prettydiff'

/**
 * PrettyDiff Defaults
 */
export const defaults = prettydiff.defaults

/**
 * Editor Configuration
 */
export const editor = workspace.getConfiguration('editor')
export const liquid = workspace.getConfiguration('liquid')

/**
 * Preset Configuration
 */
export const preset = {
  tags: ['javascript',
    'stylesheet',
    'schema',
    'style'],
  ignore: [
    'script', // <script>
    'comment' // {% comment %}
  ].concat(liquid.formatIgnore || [])
}

/**
 * Rules
 */
export const rules = {
  html: {
    mode: 'beautify',
    language_name: 'Liquid',
    language: 'html',
    lexer: 'markup',
    fix: true,
    preserve: 1,
    indent_size: editor.tabSize,
    end_quietly: 'log',
    node_error: true
  },
  schema: {
    mode: 'beautify',
    language: 'JSON',
    language_name: 'json',
    lexer: 'script',
    indent_size: editor.tabSize
  },
  stylesheet: {
    mode: 'beautify',
    language_name: 'SASS',
    language: 'scss',
    lexer: 'style',
    preserve: 1,
    indent_size: editor.tabSize
  },
  javascript: {
    mode: 'beautify',
    language_name: 'JavaScript',
    language: 'javascript',
    lexer: 'script',
    preserve: 1,
    indent_size: editor.tabSize
  }
}

/**
 * Command Palette
 */
export const cmd = {
  document: 'liquid.formatDocument',
  selection: 'liquid.formatSelection',
  enable: 'liquid.enableFormatting',
  disable: 'liquid.disableFormatting'
}
