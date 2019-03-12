import { workspace, languages, window, Position, Range, TextEdit } from 'vscode'
import path from 'path'
import prettydiff from 'prettydiff'
import pattern from './pattern'
import { editor, defaults, rules } from './config'

function blocks (code, open, name, source, close) {
  if (pattern.tags.includes(name)) {
    const config = Object.assign({}, defaults, rules[name], { source })
    const pretty = prettydiff.mode(config)
    return pattern.ignore(`${open.trim()}\n\n${pretty.trim()}\n\n${close.trim()}`)
  } else {
    return pattern.ignore(`${code}`)
  }
}

function format (document) {
  const total = document.lineCount - 1
  const last = document.lineAt(total).text.length
  const top = new Position(0, 0)
  const bottom = new Position(total, last)
  const range = new Range(top, bottom)
  const contents = document.getText(range)
  const source = contents.replace(pattern.matches(), blocks)
  const assign = Object.assign({}, defaults, rules.html, { source })
  const output = prettydiff.mode(assign).replace(pattern.ignored, '')
  const replace = []
  replace.push(TextEdit.replace(range, `${output.trim()}`))
  return replace
}

class Formatting {

  constructor ({ liquid, schema }) {
    this.format = {}
    this.editor = editor
    this.enable = liquid.format
    this.schema = schema
    pattern.tags.map((k) => Object.assign(rules[k], liquid.beautify[k]))
  }
  extname (name) {
    if (path.extname(name) === '.git') {
      if (path.extname(name.slice(0, -4)) === '.liquid') return true
    } else if (path.extname(name) === '.liquid') {
      return true
    } else {
      return false
    }
  }
  activation () {
    workspace.onDidOpenTextDocument((document) => {
      return this.extname(document.fileName) ? this.register() : this.disposal()
    })
  }
  register () {
    Object.assign(this.format, {
      full: languages.registerDocumentFormattingEditProvider(this.schema, {
        provideDocumentFormattingEdits: format
      }),
      range: languages.registerDocumentRangeFormattingEditProvider(this.schema, {
        provideDocumentRangeFormattingEdits: format
      })
    })
  }
  configuration () {
    workspace.onDidChangeConfiguration(() => {
      const uri = window.activeTextEditor.document.uri.path
      if (this.enable === false) return this.disposal()
      if (editor.formatOnSave === true && this.extname(uri)) {
        return this.register()
      } else {
        return this.disposal()
      }
    })
  }
  disposal () {
    Object.keys(this.format).map((prop) => this.format[prop].dispose())
  }

}

export default Formatting
