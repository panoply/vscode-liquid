import { workspace, languages, window, Position, Range, TextEdit } from 'vscode'
import { defaults, rules, liquid, pattern, editor, schema } from './config'
import path from 'path'
import prettydiff from 'prettydiff'

function formatBlocks (code, open, name, source, close) {
  if (Object.keys(rules).includes(name)) {
    const config = Object.assign({}, defaults, rules[name], { source })
    const pretty = prettydiff.mode(config)
    return pattern.wrap(`${open.trim()}\n\n${pretty}\n${close.trim()}`)
  } else {
    return pattern.wrap(`${code}`)
  }
}

const elements = () => {
  const { open, inner, close } = pattern
  const tags = Object.keys(rules)
  tags.map((key) => Object.assign(rules[key], liquid.beautify[key]))
  return new RegExp(open(tags.join('|')) + inner + close, 'g')
}

const formatFile = (document) => {
  console.log(document)
  const total = document.lineCount - 1
  const last = document.lineAt(total).text.length
  const top = new Position(0, 0)
  const bottom = new Position(total, last)
  const range = new Range(top, bottom)

  const contents = document.getText(range)
  const source = contents.replace(elements(), formatBlocks)
  const assign = Object.assign({}, defaults, rules.html, { source })
  const output = prettydiff
    .mode(assign)
    .replace(pattern.unwrap, '')
    .trim()

  const replace = []
  replace.push(TextEdit.replace(range, `${output}`))
  return replace
}

export default class Format {

  constructor () {
    this.format = {}
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
      full: languages.registerDocumentFormattingEditProvider(schema, {
        provideDocumentFormattingEdits: formatFile
      }),
      range: languages.registerDocumentRangeFormattingEditProvider(schema, {
        provideDocumentRangeFormattingEdits: formatFile
      })
    })
  }
  configuration () {
    workspace.onDidChangeConfiguration(() => {
      const uri = window.activeTextEditor.document.uri.path
      if (liquid.format === false) return this.disposal()
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
