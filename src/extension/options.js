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
 * Formatting Rules
 *
 * @returns {object}
 */
export const Rules = {

  // Ignored Tags
  ignore: [
    {
      type: 'liquid',
      begin: 'comment',
      end: 'endcomment'
    },
    {
      type: 'html',
      begin: 'script',
      end: 'script'
    },
    {
      type: 'html',
      begin: 'style',
      end: 'style'
    }
  ],

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
    unformatted: true,
    force_attribute: false,
    braces: false,
    preserve: 1,

    // Custom Rules
    brace_block: false

  },

  // Schema Tag
  json: {

    // Private Settings
    tags: [
      {
        type: 'liquid',
        begin: 'schema',
        end: 'endschema'
      },
      {
        type: 'html',
        begin: 'script\\s+type="application\\/json"',
        end: 'script'
      }
    ],

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
    quote_convert: 'double',

    // Custom Rules
    brace_block: false

  },

  // StyleSheet Tag
  scss: {

    // Settings
    tags: [
      {
        type: 'liquid',
        begin: 'stylesheet \'scss\'',
        end: 'endstylesheet'
      }
    ],

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

    // Settings
    tags: [
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

    // Enforced
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

    // Settings
    tags: [
      {
        type: 'liquid',
        begin: 'javascript',
        end: 'endjavascript'
      }
    ],

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
