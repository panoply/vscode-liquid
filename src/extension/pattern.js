import Config from './config'
import { outputChannel } from './options'

export default class Pattern extends Config {

  constructor () {

    super()

    this.pattern = {}
    this.frontmatter = new RegExp(/---(?:[^]*?)---/, 'g')
    this.denotations = new RegExp(/(?=(<|<\/|{%-?|{{-?\s+))/, 'g')

  }

  getPatterns () {

    this.getdocumentTagsPattern()
    this.getIgnoreTagsPattern()

  }

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

    ignore.push(Pattern.captures('html_comment', `liquid:disable`, `liquid:enable`))
    ignore.push(Pattern.captures('js_comment', `liquid:disable`, `liquid:enable`))

    this.pattern.ignored = ignore

  }

  static captures (type, begin, end) {

    const pattern = {

      html: `(<(${begin})>)([^]*?)(</${end}>)`,
      liquid: `({%-?\\s*(${begin}).*?\\s*-?%})([^]*?)({%-?\\s*${end}\\s*-?%})`,
      html_comment: `(<!--\\s*(${begin})\\s*-->)([^]*?)(<!--\\s*${end}\\s*-->)`,
      js_comment: `(\\/\\*\\s*(${begin})\\s*\\*\\/)([^]*?)(\\/\\*\\s*${end}\\s*\\*\\/)`

    }[type]

    const expression = new RegExp(pattern, 'g')

    return expression

  }

}
