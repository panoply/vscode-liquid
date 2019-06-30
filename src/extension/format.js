import { window, TextEdit, Range } from 'vscode'
import prettydiff from 'prettydiff'
import Pattern from './pattern'

export default class Format extends Pattern {

  /**
   * Fromatting Provider
   *
   * @returns
   */
  provider (document) {

    if (!this.error) {

      this.statusBarItem('enabled')

    }

    const { range, result } = this.apply(document)

    return [
      TextEdit.replace(range, `${result.trim()}`)
    ]

  }

  /**
   * Range and Result
   *
   * @param {object} document
   */
  apply (document) {

    const range = Format.range(document)
    const result = this.code(document.getText(range))

    return {
      range,
      result
    }

  }

  /**
 * Apply Formatting
 *
 * @param {object} document
 */
  code (document) {

    if (document.match(this.frontmatter)) {

      document = document.replace(this.frontmatter, Format.ignore)

    }

    for (let i = 0; i < this.pattern.ignored.length; i++) {

      if (document.match(this.pattern.ignored[i])) {

        document = document.replace(this.pattern.ignored[i], Format.ignore)

      }

    }

    for (let i = 0; i < this.pattern.tags.length; i++) {

      if (document.match(this.pattern.tags[i])) {

        document = document.replace(this.pattern.tags[i], this.tagCaptures.bind(this))

      }

    }

    document = this.beautify('html', document)

    const remove = new RegExp(`(\n?<temp data-prettydiff-ignore>\n?|\n?</temp>\n?)`, 'g')

    if (document.match(remove)) {

      document = document.replace(remove, '')

    }

    return document

  }

  /**
   * @param {string} code
   * @param {string} open
   * @param {string} name
   * @param {string} source
   * @param {string} close
   */
  tagCaptures (
    code,
    open,
    name,
    source,
    close
  ) {

    const format = this.beautify(name, source)
    const newline = prettydiff.options.brace_block ? `\n\n` : `\n`
    const output = open + newline + format + newline + close

    return Format.ignore(output)

  }

  /**
   * @param {string} rule
   * @param {string} source
   */
  beautify (name, source) {

    let content = ''

    try {

      let rules = this.getRuleByTagName(name)

      prettydiff.options = Object.assign(prettydiff.options, rules, {
        source
      })

      content = prettydiff()

      if (prettydiff.sparser.parseerror.length > 0) {

        this.statusBarItem('error')

        this.outputLog({
          title: 'PrettyDiff',
          message: `${prettydiff.sparser.parseerror}`
        })

        return source

      } else {

        return content

      }

    } catch (error) {

      if (prettydiff.sparser.parseerror.length > 0) {

        this.outputLog({
          title: 'PrettyDiff',
          message: `${prettydiff.sparser.parseerror}`
        })

      }

      return this.outputLog({
        title: 'Error',
        message: `${error.message}`
      })

    }

  }

  /**
   * @param {object} document
   */
  static range (document) {

    const range = document.getText().length - 1
    const first = document.positionAt(0)
    const last = document.positionAt(range)

    return new Range(first, last)

  }

  /**
   * @param {string} code
   */
  static ignore (
    code, open, name, source, close
  ) {

    if (name === 'liquid:disable' || name === 'liquid:enable') {

      return `${open}\n<temp data-prettydiff-ignore>\n${source}\n</temp>\n${close}`

    } else {

      return `\n<temp data-prettydiff-ignore>\n${code}\n</temp>\n`

    }

  }

  /**
   * Document Formatting
   *
   * @returns
   */
  document () {

    const { document } = window.activeTextEditor
    const { range, result } = this.apply(document)

    window.activeTextEditor.edit(code => code.replace(range, result))

  }

  /**
   * Selection Formatting
   *
   * @returns
   */
  selection () {

    const { document, selection } = window.activeTextEditor
    const format = this.code(document.getText(selection))

    window.activeTextEditor.edit(code => code.replace(selection, format))

  }

}
