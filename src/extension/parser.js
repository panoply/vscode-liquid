import vscode from 'vscode'
import prettydiff from 'prettydiff'
import { defaults, rules, liquid, patterns } from './config'

const { open, inner, close, wrap, unwrap } = patterns

const format = (document, range) => {
  const replace = []
  const contents = document.getText(range)
  const source = contents.replace(this.match, this.blocks.bind(this))
  const assign = Object.assign({}, defaults, rules.html, { source })
  const output = prettydiff
    .mode(assign)
    .replace(unwrap, '')
    .trim()

  replace.push(vscode.TextEdit.replace(range, `${output}`))
  return replace
}
export default class Parser {

  constructor () {
    this.tags = Object.keys(rules)
    this.tags.map((key) => Object.assign(rules[key], liquid.beautify[key]))
    this.match = new RegExp(open(this.tags) + inner + close, 'g')
  }

  blocks (code, open, name, source, close) {
    if (Object.keys(rules).includes(name)) {
      const config = Object.assign({}, defaults, rules[name], { source })
      const pretty = prettydiff.mode(config)
      return wrap(`${open.trim()}\n\n${pretty}\n${close.trim()}`)
    } else {
      return wrap(`${code}`)
    }
  }

  fullFormat (document) {
    console.log(document)
    const total = document.lineCount - 1
    const last = document.lineAt(total).text.length
    const top = new vscode.Position(0, 0)
    const bottom = new vscode.Position(total, last)
    const range = new vscode.Range(top, bottom)
    return this.format(document, range)
  }

}
