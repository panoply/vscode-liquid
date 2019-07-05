import { workspace } from 'vscode'

/**
 * Default formatting Rules used to reset options
 * applied on a per tag basis to PrettyDiff.
 *
 * @see Formatter [PrettyDiff](http://prettydiff.com)
 *
 */

export const defaults = {

  // PrettyDiff
  correct: false,
  force_attribute: false,
  braces: false,
  preserve: 0,
  format_array: 'default',
  format_object: 'defaults',
  no_semicolon: true,
  method_chain: 3,
  css_insert_lines: true,
  quote_convert: 'none',

  // Custom
  brace_block: false

}

/**
 * Tag Associations (Enforced)
 */
export const TagAssociations = {

  css: [
    {
      type: 'liquid',
      begin: 'stylesheet',
      end: 'endstylesheet'
    },
    {
      type: 'liquid',
      begin: 'style',
      end: 'endstyle'
    }
  ],
  scss: [
    {
      type: 'liquid',
      begin: 'stylesheet \'scss\'',
      end: 'endstylesheet'
    }
  ],
  js: [
    {
      type: 'liquid',
      begin: 'javascript',
      end: 'endjavascript'
    }
  ],
  json: [
    {
      type: 'liquid',
      begin: 'schema',
      end: 'endschema'
    }
  ]

}

/**
 * Formatting Rules (Enforced)
 */
export const FormattingRules = {

  // Ignored Tags
  ignore: [],

  // HTML + Liquid
  html: {

    mode: 'beautify',
    end_quietly: 'log',
    node_error: true,
    summary_only: true,
    language_name: 'Liquid',
    language: 'html',
    lexer: 'markup',
    tag_sort: false,

    // Editor Specific
    indent_size: workspace.getConfiguration('editor').tabSize,

    // Exposed Default Rules
    correct: false,
    unformatted: false,
    force_attribute: false,
    braces: false,
    preserve: 1,
    quote_convert: 'double',

    // Custom Rules
    brace_block: false

  },

  // Schema Tag
  json: {

    // Enforced
    mode: 'beautify',
    end_quietly: 'log',
    node_error: true,
    language_name: 'json',
    language: 'JSON',
    lexer: 'script',

    // Editor Specific
    indent_size: workspace.getConfiguration('editor').tabSize,

    // Exposed Default Rules
    format_array: 'indent',
    preserve: 0,
    braces: true,
    no_semicolon: true,

    // Custom Rules
    brace_block: false

  },

  // StyleSheet Tag
  scss: {

    // Enforced
    mode: 'beautify',
    end_quietly: 'log',
    node_error: true,
    language_name: 'SASS',
    language: 'scss',
    lexer: 'style',

    // Editor Specific
    indent_size: workspace.getConfiguration('editor').tabSize,

    // Exposed Default Rules
    css_insert_lines: true,
    preserve: 2,
    braces: false,

    // Custom Rules
    brace_block: false

  },

  // Style Tag
  css: {

    // Enforced
    mode: 'beautify',
    end_quietly: 'log',
    node_error: true,
    language_name: 'CSS',
    language: 'css',

    // Editor Specific
    indent_size: workspace.getConfiguration('editor').tabSize,

    // Exposed Default Rules
    css_insert_lines: true,
    preserve: 2,
    braces: false,

    // Custom Rules
    brace_block: false
  },

  // JavaScript Tag
  js: {

    // Enforced
    mode: 'beautify',
    end_quietly: 'log',
    node_error: true,
    language_name: 'JavaScript',
    language: 'javascript',
    lexer: 'script',

    // Editor Specific
    indent_size: workspace.getConfiguration('editor').tabSize,

    // Exposed Default Rules
    preserve: 1,
    method_chain: 0,
    quote_convert: 'single',
    format_array: 'indent',
    format_object: 'indent',
    braces: false,
    no_semicolon: false,

    // Custom Rules
    brace_block: false

  }

}
