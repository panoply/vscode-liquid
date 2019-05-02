import { languages, window, TextEdit, Range } from 'vscode'
import { preset, rules, ignore } from './config'
import prettydiff from 'prettydiff'
import pattern from './pattern'

export default class Format {

  /**
   * @param {string} rule
   * @param {string} source
   */
  static beautify (rule, source) {

    prettydiff.options = Object.assign(prettydiff.options, rules[rule], {
      source
    })

    return prettydiff()

  }

  /**
   * @param {object} document
   */
  static range (document) {

    const first = document.positionAt(0)
    const last = document.positionAt(document.getText().length - 1)

    return new Range(first, last)

  }

  /**
   * @param {string} code
   */
  static ignores (code) {

    return `<temp data-prettydiff-ignore>${code}</temp>`

  }

  /**
   * @param {string} code
   * @param {string} open
   * @param {string} name
   * @param {string} source
   * @param {string} close
   */
  static tags (code, open, name, source, close) {

    if (ignore.includes(name)) {

      return Format.ignores(`${code.trim()}`)

    }

    const format = Format.beautify(name, source)
    const output = `${open.trim()}\n\n${format.trim()}\n\n${close.trim()}`

    return Format.ignores(output.trim())

  }

  /**
   * @param {object} document
   */
  static code (document) {

    if (document.match(pattern.frontmatter)) {

      document = document.replace(pattern.frontmatter, Format.ignores)

    }

    // Beautification
    const source = document.replace(pattern.tags, Format.tags)
    const output = Format.beautify('html', source)
    const result = output.replace(pattern.ignore, '')

    return result

  }

  /**
   * @param {object} document
   */
  static apply (document) {

    const range = Format.range(document)
    const result = Format.code(document.getText(range))

    return {
      range,
      result
    }

  }

  /**
   * Constructor
   */
  constructor () {

    this.scheme = {
      scheme: 'file',
      language: 'html'
    }

  }

  /**
   * @param {object} liquid
   */
  rules (liquid) {

    preset.map(language => {

      if (liquid.beautify[language]) {

        Object.assign(rules[language], liquid.beautify[language])

      }

    })

  }

  /**
   * @returns
   */
  register () {

    return languages.registerDocumentFormattingEditProvider(this.scheme, {
      provideDocumentFormattingEdits (document) {

        const { range, result } = Format.apply(document)
        return [ TextEdit.replace(range, `${result.trim()}`) ]

      }
    })

  }

  /**
   * @returns
   */
  document () {

    const { document } = window.activeTextEditor
    const { range, result } = Format.apply(document)

    window.activeTextEditor.edit(code => code.replace(range, result))

  }

  /**
   * @returns
   */
  selection () {

    const { document, selection } = window.activeTextEditor
    const format = Format.code(document.getText(selection))

    window.activeTextEditor.edit(code => code.replace(selection, format))

  }

}
