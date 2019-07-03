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
  static captures (type, begin, end) {

    const pattern = {

      frontmatter: '---(?:[^]*?)---',
      ignore: '(<temp data-prettydiff-ignore>|</temp>)',
      denotations: '(?=(<|<\\/|{%-?|{{-?\\s+))',
      html: `(<(${begin})>)([^]*?)(</${end}>)`,
      liquid: `({%-?\\s*(${begin}).*?\\s*-?%})([^]*?)({%-?\\s*${end}\\s*-?%})`

    }[type]

    return new RegExp(pattern, 'g')

  }

  constructor () {

    super()

    this.pattern = {}
    this.frontmatter = Pattern.captures('frontmatter')
    this.denotations = Pattern.captures('denotations')
    this.ignoreWrap = Pattern.captures('ignore')

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

    const language = []

    for (let lang in this.config) {

      if (language !== 'ignore' || language !== 'html') {

        this.config[lang].hasOwnProperty('tags') && this.config[lang].tags.map(({
          type,
          begin,
          end
        }) => {

          if (!type) {

            this.outputLog({
              title: `Error parsing "${lang} > tags > type" rule`,
              show: true,
              message: `Ignored tag has a missing or invalid "type" property at ${type}`
            })

          }

          if (begin.match(this.denotations) || end.match(this.denotations)) {

            this.outputLog({
              title: `Error parsing "${lang} > tags" rule`,
              show: true,
              message: `Do not denote tag associations. The begin and end pattern restricts ${this.denotations}expressions.`
            })

          }

          language.push(Pattern.captures(type, begin, end))

        })

      }

    }

    this.pattern.tags = language

  }

  /**
   * Assigns an array of regex pattern expressions
   * that are used to ignore tags when formatting
   */
  getIgnoreTagsPattern () {

    const ignore = []

    this.config.ignore.map(({
      type,
      begin,
      end
    }) => {

      if (!type) {

        this.outputLog({
          title: `Error parsing "ignore > type" rule`,
          show: true,
          message: `Ignored tag has a missing or invalid "type" property at ${type}`
        })

      }

      // if user includes denotations
      if (begin.match(this.denotations) || end.match(this.denotations)) {

        this.outputLog({
          title: 'Error parsing "ignore" rule',
          show: true,
          message: `Do not denote ignored tag captures. The begin and end pattern restricts ${this.denotations} expressions.`
        })

      }

      // Apply captures
      ignore.push(Pattern.captures(type, begin, end))

    })

    this.pattern.ignored = ignore

  }

}
