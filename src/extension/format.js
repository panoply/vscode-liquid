import { window, TextEdit, Range } from 'vscode'
import prettydiff from 'prettydiff'
import Pattern from './pattern'

const Options = Object.assign({}, prettydiff.options)

/**
 * Applies formatting to the document
 *
 * @class Format
 * @extends {Pattern}
 */
export default class Format extends Pattern {

  constructor () {

    super()
    this.tags = this.tags.bind(this)
    this.blocks = this.blocks.bind(this)
    this.ignore = this.ignore.bind(this)
    this.comments = this.comments.bind(this)
    this.comment = []

  }

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

    this.comment.length = 0

    // JEKYLL FRONTMATTER
    if (this.frontmatter.test(document)) {

      document = document.replace(this.frontmatter, this.ignore)

    }

    // IGNORED TAGS
    for (let i = 0; i < this.pattern.ignored.length; i++) {

      if (this.pattern.ignored[i].test(document)) {

        document = document.replace(this.pattern.ignored[i], this.ignore)

      }

    }

    // IGNORE COMMENTS
    if (this.htmlComments.test(document)) {

      document = document.replace(this.htmlComments, this.comments)

    }

    // CUSTOM TAGS
    for (let i = 0; i < this.pattern.tags.length; i++) {

      if (this.pattern.tags[i].test(document)) {

        document = document.replace(this.pattern.tags[i], this.tags)

      }

    }

    // SPECIFIC BLOCKS
    for (let i = 0; i < this.pattern.blocks.length; i++) {

      if (this.pattern.blocks[i].test(document)) {

        document = document.replace(this.pattern.blocks[i], this.blocks)

      }

    }

    // REST OF DOCUMENT
    document = this.beautify('html', document)

    // REMOVE IGNORE WRAPPERS
    if (this.ignoreWrap.test(document)) {

      document = document.replace(this.ignoreWrap, '')

    }

    // PUT BACK COMMENTS
    if (this.comment.length > 0) {

      for (let i = 0; i < this.comment.length; i++) {

        document = document.replace(`comment_${i}`, this.comment[i])

      }

    }

    return document

  }

  /**
   * Creates record of comment when `ignore_comments` option is
   * enabled. Comments are replaced upon parsing.
   *
   *
   * @param {"string"} code The full tag match
   * @memberof Format
   */
  comments (code) {

    this.comment.push(code)

    return `comment_${this.comment.length - 1}`

  }

  /**
   * Applies formatting to captured tag blocks
   *
   * @param {"string"} code The full tag match
   * @param {"string"} name the name of the tag, eg: `div`
   * @memberof Format
   */
  tags (code, indent, source, name) {

    const format = this.beautify(name, source, indent)

    return this.ignore(format)

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
  blocks (
    code,
    open,
    name,
    source,
    close
  ) {

    const format = this.beautify(name, source, false)

    // Applies the brace_block custom ruleset
    const newline = prettydiff.options.brace_block ? `\n\n` : `\n`
    const customs = open.trim() + newline + format + newline + close.trim()

    return this.ignore(customs.trim())

  }

  /**
   * Executes formatting
   *
   * @param {string} rule
   * @param {string} source
   */
  beautify (name, source, indent) {

    try {

      const rules = this.getRuleByTagName(name)

      if (indent && indent.length > 0) {

        rules.indent_size = indent.length + rules.indent_size

      }

      Object.assign(prettydiff.options, rules, {
        source
      })

      const output = prettydiff()

      if (prettydiff.sparser.parseerror.length > 0) {

        this.statusBarItem('error')

        this.outputLog({
          title: 'PrettyDiff',
          message: `${prettydiff.sparser.parseerror}`
        })

        return source

      }

      return output

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

    } finally {

      Object.assign(prettydiff.options, Options)

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
  ignore (code) {

    return `<temp data-prettydiff-ignore>${code}</temp>`

  }

}
