import { languages, window, Range, TextEdit } from 'vscode'
import { defaults, rules, preset } from './config'
import prettydiff from 'prettydiff'
import pattern from './pattern'

export default class Format {

  static beautify (rule, source) {
    const config = Object.assign({}, defaults, rules[rule], { source })
    const pretty = prettydiff.mode(config)
    return pretty
  }

  static range (document) {
    const all = document.getText()
    return new Range(document.positionAt(0), document.positionAt(all.length - 1))
  }

  static ignore (code) {
    return `<temp data-prettydiff-ignore>${code}</temp>`
  }

  static tags (code, open, name, source, close) {
    if (preset.ignore.includes(name)) {
      return Format.ignore(`${code.trim()}`)
    }

    const format = Format.beautify(name, source)
    const output = `${open.trim()}\n\n${format.trim()}\n\n${close.trim()}`
    return Format.ignore(output.trim())
  }

  static code (document) {
    if (document.match(pattern.frontmatter)) {
      document = document.replace(pattern.frontmatter, Format.ignore)
    }

    const source = document.replace(pattern.tags, Format.tags)
    const output = Format.beautify('html', source)
    return output.replace(pattern.ignore, '')
  }

  static apply (document) {
    const range = Format.range(document)
    const result = Format.code(document.getText(range))
    return {
      range,
      result
    }
  }

  rules (liquid) {
    preset.tags.map(language => {
      if (liquid.beautify[language]) {
        Object.assign(rules[language], liquid.beautify[language])
      }
    })
  }

  register () {
    return languages.registerDocumentFormattingEditProvider(
      {
        scheme: 'file',
        language: 'html'
      },
      {
        provideDocumentFormattingEdits (document) {
          const { range, result } = Format.apply(document)
          return [TextEdit.replace(range, `${result.trim()}`)]
        }
      }
    )
  }

  document () {
    const { document } = window.activeTextEditor
    const { range, result } = Format.apply(document)
    window.activeTextEditor.edit(code => code.replace(range, result))
  }

  selection () {
    const { document, selection } = window.activeTextEditor
    const format = Format.code(document.getText(selection))
    window.activeTextEditor.edit(code => code.replace(selection, format))
  }

}
