import { window, TextEdit, Range } from 'vscode'
import prettydiff from 'prettydiff'
import Pattern from './pattern'

/**
 * Applies formatting to the document
 *
 * @class Format
 * @extends {Pattern}
 */
export default class Format extends Pattern {

  /**
   * Formatting provider function
   *
   * @param {Object} document The VSCode document
   * @memberof Format
   */
  provider (document) {

    if (!this.error && this.format) {

      this.statusBarItem('enabled')

    }

    if (this.reset) {

      this.getPatterns()

      // Reset Conditional Executor
      this.reset = false

    }

    const range = Format.range(document)
    const result = this.apply(document.getText(range))

    return [
      TextEdit.replace(range, `${result.trim()}`)
    ]

  }

  /**
   * Applies the formatting and beautification
   *
   * @param {string} document The current document   *
   * @memberof Format
   */
  apply (document) {

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

        document = document.replace(this.pattern.tags[i], this.tags.bind(this))

      }

    }

    document = this.beautify('html', document)

    if (document.match(this.ignoreWrap)) {

      document = document.replace(this.ignoreWrap, '')

    }

    return document

  }

  /**
   * Applies formatting to captured tag blocks
   *
   * @param {"string"} code The full tag match
   * @param {"string"} open the open tag (begin), eg: `<div>`
   * @param {"string"} name the name of the tag, eg: `div`
   * @param {"string"} source the inner conent of of the div.
   * @param {"string"} close the close tag (end), eg: `</div>`
   * @memberof Format
   */
  tags (
    code,
    open,
    name,
    source,
    close
  ) {

    const format = this.beautify(name, source)

    // Applies the brace_block custom ruleset
    const newline = prettydiff.options.brace_block ? `\n\n` : `\n`
    const output = open + newline + format + newline + close

    return Format.ignore(output)

  }

  /**
   * Executes formatting
   *
   * @param {string} rule
   * @param {string} source
   */
  beautify (name, source) {

    try {

      let rules = this.getRuleByTagName(name)

      prettydiff.options = Object.assign(prettydiff.options, rules, {
        source
      })

      let content = prettydiff()

      if (prettydiff.sparser.parseerror.length > 0) {

        this.statusBarItem('error')

        this.outputLog({
          title: 'PrettyDiff',
          message: `${prettydiff.sparser.parseerror}`
        })

        return source

      }

      return content

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
   * Formats the entire document
   *
   * @memberof Format
   */
  completeDocument () {

    const { document } = window.activeTextEditor

    const range = Format.range(document)
    const result = this.apply(document.getText(range))

    window.activeTextEditor.edit(code => code.replace(range, result))

  }

  /**
   * Format the selected (highlighted) text
   *
   * @memberof Format
   */
  selectedText () {

    const { document, selection } = window.activeTextEditor
    const format = this.apply(document.getText(selection))

    window.activeTextEditor.edit(code => code.replace(selection, format))

  }

  /**
   * Get the formatting range
   *
   * @param {Object} document The vscode document
   * @memberof Format
   */
  static range (document) {

    const range = document.getText().length - 1
    const first = document.positionAt(0)
    const last = document.positionAt(range)

    return new Range(first, last)

  }

  /**
   * Apply ignore wrapper to code
   *
   * @param {"string"} code
   * @memberof Format
   */
  static ignore (code) {

    return `<temp data-prettydiff-ignore>\n${code}\n</temp>`

  }

}
