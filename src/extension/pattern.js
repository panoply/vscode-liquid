import Config from './config'

/**
 * Pattern Generator
 *
 * Generates regex patterns using the
 * configuration rules. Generated patterns are
 * used when fromatting.
 *
 * @class Pattern
 * @extends {Utils}
 */

export default class Pattern extends Config {

  /**
   * Regex pattern helper to generate tag pattern
   * matches when formatting.
   *
   * @param {"string"} type The type of pattern to generate
   * @param {"string"} [begin] The begin tag name (optional)
   * @param {"string"} [end] The end tag name (optional)
   * @returns RegExp regular expression
   */
  static captures (tag) {

    const pattern = {

      frontmatter: '---(?:[\\s\\S]+?)---',
      ignoreWrap: '(<temp data-prettydiff-ignore>|</temp>)',
      denotations: '(?=(<|<\\/|{%-?|{{-?))',
      html: `(<(${tag.begin})>)([\\s\\S]+?)(</${tag.end}>)`,
      liquid: `({%-?\\s*(${tag.begin}).*?\\s*-?%})([\\s\\S]+?)({%-?\\s*${tag.end}\\s*-?%})`,
      htmlComments: `<!--[\\s\\S]+?-->`,
      htmlCommentsHolder: `comment_\\d+`,
      other: `${tag.begin}[\\s\\S]+?${tag.end}`,
      htmlTag: `((?!\n)\\s+)(<(${tag.tag})[\\s\\S]+?>)` // HTML tag Only

    }[tag.type]

    return new RegExp(pattern, 'gm')

  }

  constructor () {

    super()

    this.frontmatter = Pattern.captures({
      type: 'frontmatter'
    })
    this.denotations = Pattern.captures({
      type: 'denotations'
    })
    this.ignoreWrap = Pattern.captures({
      type: 'ignoreWrap'
    })

    this.htmlComments = Pattern.captures({
      type: 'htmlComments'
    })

    this.htmlCommentsHolder = Pattern.captures({
      type: 'htmlCommentsHolder'
    })

    this.pattern = {
      ignored: [],
      blocks: [],
      tags: []
    }

  }

  /**
   * Apply the required patterns used for formatting.
   * Used to assign the `pattern{}` object.
   *
   * @memberof Pattern
   */
  getPatterns () {

    this.getdocumentTagsPattern()
    this.getIgnoreTagsPattern()

  }

  /**
   * Assigns an array of regex pattern expressions
   * that match `liquid` and `html` tags.
   */
  getdocumentTagsPattern () {

    for (const lang in this.config) {

      if (lang !== 'ignore' && this.config[lang].tags) {

        for (const option in this.config[lang].tags) {

          const tag = this.config[lang].tags[option]

          if (!tag.type && !tag.tag) {

            this.outputLog({
              title: `Error parsing "${lang} > tags > type" rule`,
              show: true,
              message: `Tag has a missing or invalid "type" property.`
            })

            break

          }

          if (tag.begin && tag.end) {

            if (this.denotations.test(tag.begin) || this.denotations.test(tag.end)) {

              this.outputLog({
                title: `Error parsing "${lang} > tags" rule`,
                show: true,
                message: `Do not denote tag associations. The "begin" and "end" patterns restrict ${this.denotations} expressions.`
              })

              break

            }

          }

          if (lang === 'html') {

            if (tag.tag) {

              if (this.denotations.test(tag.tag)) {

                this.outputLog({
                  title: `Error parsing "${lang} > tags" rule`,
                  show: true,
                  message: `Do not denote tag associations. The "match" pattern restricts ${this.denotations} expressions.`
                })

                break

              }

              // Custom pattern type
              tag.type = 'htmlTag'

            }

          }

          const pattern = Pattern.captures(tag)

          if (tag.type === 'htmlTag') {

            if (!this.pattern.tags.includes(pattern)) {

              this.pattern.tags.push(pattern)

            }

          } else {

            if (!this.pattern.blocks.includes(pattern)) {

              this.pattern.blocks.push(pattern)

            }

          }

        }

      }

    }

  }

  /**
   * Assigns an array of regex pattern expressions
   * that are used to ignore tags when formatting
   */
  getIgnoreTagsPattern () {

    for (let i = 0; i < this.config.ignore.length; i++) {

      const tag = this.config.ignore[i]

      if (!tag.type) {

        this.outputLog({
          title: `Error parsing "ignore > type" rule`,
          show: true,
          message: `Ignored tag has a missing or invalid "type" property at ${tag.type}. The accepted values are: "html" or "liquid"
          `
        })

        break

      }

      if (tag.type === 'html' || tag.type === 'liquid') {

        if (tag.begin && tag.end) {

          const { begin, end } = tag

          if (this.denotations.test(begin) || this.denotations.test(end)) {

            this.outputLog({
              title: 'Error parsing "ignore" rule',
              show: true,
              message: `Do not denote ignored tag captures. The begin and end pattern restricts: ${this.denotations} expressions.`
            })

            break

          }

        }

      }

      const pattern = Pattern.captures(tag)

      if (!this.pattern.ignored.includes(pattern)) {

        this.pattern.ignored.push(pattern)

      }

    }

  }

}
