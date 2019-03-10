const vscode = require('vscode')
const path = require('path')
const prettydiff = require('prettydiff')

/**
 * # LIQUID FORMAT
 *
 * This extension formats liquid syntax using
 * PrettyDiff beautifier.
 *
 * # OPTIONS
 * - enable       = Enable / Disable extension
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

const { beautify, format } = vscode.workspace.getConfiguration('liquid')
const { defaults } = prettydiff
const lexers = {
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

const tags = Object.keys(lexers)
tags.map(key => Object.assign(lexers[key], beautify[key]))

/**
 * # PATTERN MATCHER
 * This ugly little pattern matches 4 groups.
 * Each match is used to apply formatting modifications.
 *
 * - Full Match
 * - Opening Tag
 * - Tag Name
 * - Inner Content
 * - Closing Tag
 *
 */
const elements = tags.join('|')
const patterns = {
  open: `((?:<|{%-?)\\s*\\b(${elements})\\b(?:.|\\n)*?\\s*(?:>|-?%})\\s*)`,
  inner: '((?:.|\\n)*?)',
  close: '((?:</|{%-?)\\s*\\b(?:(?:|end)\\2)\\b\\s*(?:>|-?%}))'
}

/**
 * # DEFAULTS
 */
const ATTR = 'data-prettydiff-ignore'
const IGNR = new RegExp(`(<temp ${ATTR}>|</temp>)`, 'g')
const REGX = new RegExp(patterns.open + patterns.inner + patterns.close, 'g')

const ignoreTags = code => `<temp ${ATTR}>${code}</temp>`
const disposal = obj => Object.keys(obj).map(prop => obj[prop].dispose())

function documentTags(code, open, name, source, close) {
  // Filter matching liquid tags, eg: `{% schema %}` or `{% javascript %}`
  if (Object.keys(lexers).includes(name) && open[0] === '{') {
    const assign = Object.assign({}, defaults, lexers[name], { source })
    const pretty = prettydiff.mode(assign)
    return ignoreTags(`${open.trim()}\n\n${pretty}\n${close.trim()}`)
  }
  return ignoreTags(`${code}`)
}

function beautifier(document, range) {
  const contents = document.getText(range)
  const source = contents.replace(REGX, documentTags)
  const assign = Object.assign({}, defaults, lexers.html, { source })
  const output = prettydiff
    .mode(assign)
    .replace(IGNR, '') // Remove ignore wraps, `<temp pretty-diff-ignore>*</temp>`
    .trim() // trim newlines to prevent repeated indentation

  const replace = []
  replace.push(vscode.TextEdit.replace(range, `${output}`))

  return replace
}

function ext(name) {
  if (path.extname(name) === '.git') {
    if (path.extname(name.slice(0, -4)) === '.liquid') {
      return true
    }
  } else if (path.extname(name) === '.liquid') {
    return true
  }
  return false
}

const register = obj => Object.assign(obj, {
  range: vscode.languages.registerDocumentRangeFormattingEditProvider(
    {
      scheme: 'file',
      language: 'html'
    },
    {
      provideDocumentRangeFormattingEdits(document, range) {
        return beautifier(document, range)
      }
    }
  ),
  full: vscode.languages.registerDocumentFormattingEditProvider(
    {
      scheme: 'file',
      language: 'html'
    },
    {
      provideDocumentFormattingEdits(document) {
        const total = document.lineCount - 1
        const last = document.lineAt(total).text.length
        const top = new vscode.Position(0, 0)
        const bottom = new vscode.Position(total, last)
        const range = new vscode.Range(top, bottom)

        return beautifier(document, range)
      }
    }
  )
})

const activation = obj => vscode.workspace.onDidOpenTextDocument((document) => {
  if (ext(document.fileName)) {
    return register(obj)
  }
  return disposal(obj)
})

const formatting = obj => vscode.workspace.onDidChangeConfiguration(() => {
  const name = vscode.window.activeTextEditor.document.uri.path
  const editor = vscode.workspace.getConfiguration('editor').formatOnSave
  if (editor === true && ext(name)) {
    if (format === false) {
      return disposal(obj)
    }

    return register(obj)
  }

  return disposal(obj)
})

/**
 * # ACTIVATE EXTENSION
 */
exports.activate = (context) => {
  const active = vscode.window.activeTextEditor
  if (!active || !active.document) return

  if (format) {
    const object = {}
    context.subscriptions.push(activation(object))
    context.subscriptions.push(formatting(object))
  }
}
