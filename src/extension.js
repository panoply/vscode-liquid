/**
 * # LIQUID BEAUTFY
 *
 * This extension formats liquid syntax using
 * PrettyDiff beautifier.
 *
 * # OPTIONS
 * - enable       = Enable / Disable extension
 * - ignore       = List of HTML tags to ignore
 *
 * # RULES
 * - indent_level = Start Indentation Padding
 * - indent_size  = Indentation
 * - correct      = Fix Sloppy Code
 * - preserve     = Perserve new lines
 * - object_sort  = Sort Attributes by key name
 * - wrap         = Wrap length
 *
 */

const vscode = require('vscode')
const prettydiff = require('prettydiff')
const path = require('path')

/**
 * # DEFAULTS
 */
const ATTR = 'data-prettydiff-ignore'
const IGNR = new RegExp(`(<temp ${ATTR}>|</temp>)`, 'g')

/**
 * # PATTERN MATCHER
 * This ugly little pattern matches 4 groups.
 * Each match is used to apply modification.
 *
 * - Full Match
 * - Opening Tag
 * - Tag Name
 * - Inner Content
 * - Closing Tag
 *
 */
const REGX = /((?:<|{%)\s*\b(script|style|schema|javascript|stylesheet)\b(?:|.*)\s*(?:>|%})(?:\s*))((?:.|\n)*?)((?:(?:<\/|{%)\s*\b(?:(?:|end)\2)\b\s*(?:>|%})))/g

/**
 * # LEXER DEFAULTS
 */
const LEXR = {
  html: {
    node_error: true,
    indent_size: vscode.workspace.getConfiguration().get('editor.tabSize'),
    api: 'dom',
    mode: 'beautify',
    language: 'liquid',
    lexer: 'markup',
    quote_convert: 'none',
    format_array: 'default',
    format_object: 'default',
    force_attribute: false
  },
  schema: {
    node_error: true,
    indent_size: vscode.workspace.getConfiguration().get('editor.tabSize'),
    api: 'dom',
    mode: 'beautify',
    language: 'JSON',
    lexer: 'script',
    quote_convert: 'double',
    format_array: 'default',
    format_object: 'indent'
  },
  style: {
    node_error: true,
    indent_size: vscode.workspace.getConfiguration().get('editor.tabSize'),
    api: 'dom',
    mode: 'beautify',
    language: 'CSS',
    lexer: 'style',
    quote_convert: 'none',
    format_array: 'default',
    format_object: 'default'
  },
  stylesheet: {
    node_error: true,
    indent_size: vscode.workspace.getConfiguration().get('editor.tabSize'),
    api: 'dom',
    mode: 'beautify',
    language: 'SCSS',
    lexer: 'style',
    quote_convert: 'none',
    format_array: 'default',
    format_object: 'indent'
  },
  javascript: {
    indent_size: vscode.workspace.getConfiguration().get('editor.tabSize'),
    api: 'dom',
    mode: 'beautify',
    language: 'JavaScript',
    lexer: 'script',
    method_chain: 0,
    quote_convert: 'none',
    format_array: 'indent',
    format_object: 'indent'
  }
}

/**
 * # CONFIG
 * The default configuration for the
 * extension.
 *
 */
const config = vscode.workspace.getConfiguration('liquid')
const pretty = prettydiff.defaults
const lexer = lang => Object.assign(LEXR[lang], config.beautify[lang])
const ignoreTags = code => `<temp ${ATTR}>${code}</temp>`
const verifyFileExtension = fileName => path.extname(fileName) !== '.liquid'

/**
 * # DOCUMENT TAGS
 * Runs format of matched tags assigning
 * configuration beautification lexer.
 *
 * @param {string} code – Full code match
 * @param {string} open – Openning tag, eg: `{% tag %}` || `<tag>`
 * @param {string} name – Block name, eg: <`tag`> || {% `tag` %}
 * @param {string} source – Inner code, eg: <tag>`source`</tag>`
 * @param {string} close  – Closing tag, eg: `{% endtag %}` || `</tag>`
 *
 */
const documentTags = (code, open, name, source, close) => {

  // Filter matching liquid tags, eg: `{% schema %}` or `{% javascript %}`
  if (Object.keys(LEXR).includes(name) && open[0] === '{') {

    // Assign configured formatting lexer based on tag name
    const assign = Object.assign(pretty, lexer(name))
    assign.source = source

    // Format liquid code blocks with prettyDiff
    const format = prettydiff.mode(assign)

    // Apply ignore tags to formatted code
    return ignoreTags(`${open.trim()}\n\n${format}\n${close.trim()}`)

  }

  // Apply ignore tag to any other matches
  return ignoreTags(`${code}`)

}

/**
 * # BEAUTIFIER
 * Formats liquid syntax using PrettyDiff
 * Extension defaults are assigned.
 *
 * @param {object} document
 * @param {object} range
 * @param {object} options
 *
 */
const beautifier = (document, range) => {

  // empty array
  const replace = []

  // Get documents contents as string
  const contents = document.getText(range)

  // Run parser – applies block formats and ignores
  const source = contents.replace(REGX, documentTags)

  // Assign configured formatting rules for liquid infused HTML
  const assign = Object.assign(pretty, lexer('html'))
  assign.source = source

  // Format HTML code using prettyDiff
  const output = prettydiff
    .mode(assign)
    .replace(IGNR, '') // Remove ignore wraps, `<temp pretty-diff-ignore>*</temp>`
    .trim() // trim newlines to prevent repeated indentation

  // Replace with formatted code
  replace.push(vscode.TextEdit.replace(range, `${output}`))

  return replace

}

/**
 * # REGISTER RANGE
 * The extension formatting register for VS Code.
 * Supports range document formatting.
 *
 * @param {string} lang
 *
 */
const registerRange = (lang) => {

  vscode.languages.registerDocumentRangeFormattingEditProvider(lang, {
    provideDocumentRangeFormattingEdits(document, range) {

      // Verify file is `.liquid`
      if (verifyFileExtension(document.fileName)) {

        return document

      }

      return beautifier(document, range)

    }
  })

}

/**
 * # REGISTER FILE
 * The extension formatting register for VS Code.
 * Supports file document formatting.
 *
 * @param {string} lang
 *
 */
// Formatting entire document
const registerFile = (lang) => {

  vscode.languages.registerDocumentFormattingEditProvider(lang, {
    provideDocumentFormattingEdits(document) {

      // Verify file is `.liquid`
      if (verifyFileExtension(document.fileName)) {

        return document

      }

      const total = document.lineCount - 1
      const last = document.lineAt(total).text.length
      const top = new vscode.Position(0, 0)
      const bottom = new vscode.Position(total, last)
      const range = new vscode.Range(top, bottom)

      return beautifier(document, range)

    }
  })

}

/**
 * # ACTIVATE EXTENSION
 */
exports.activate = (context) => {

  const active = vscode.window.activeTextEditor
  if (!active || !active.document) return

  const lang = 'html'

  // Ensure formatting is enabled
  if (config.format === true) {

    context.subscriptions.push(registerRange(lang))
    context.subscriptions.push(registerFile(lang))

  }

}
