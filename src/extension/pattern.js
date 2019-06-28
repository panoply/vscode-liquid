import Config from './config'
import { output } from './api'

export default class Pattern extends Config {

  constructor () {

    super()

    this.pattern = {}
    this.frontmatter = new RegExp(`---(?:[^]*?)---`, 'g')

  }

  getPatterns () {

    this.getdocumentTagsPattern()
    this.getIgnoreTagsPattern()

  }

  getdocumentTagsPattern () {

    const language = []

    for (let lang in this.config) {

      this.config[lang].hasOwnProperty('tags') && this.config[lang].tags.map(({
        type,
        begin,
        end
      }) => {

        if (!type) {

          return output.appendLine(`💧Tag is missing "type" property`)

        }

        language.push(Pattern.captures(type, begin, end))

      })

    }

    this.pattern.tags = language

  }

  getIgnoreTagsPattern () {

    const ignore = []

    this.config.html.ignored.map(({
      type,
      begin,
      end
    }) => {

      if (!type) {

        return output.appendLine(`💧Ignored tag is missing "type" property`)

      }

      ignore.push(Pattern.captures(type, begin, end))
      //! this.matches.includes(begin) && this.matches.push(begin)

    })

    this.pattern.ignored = ignore

  }

  static captures (type, begin, end) {

    const pattern = {

      html: `(<(${begin})>)([^]*?)(</${end}>)`,
      liquid: `({%-?\\s*(${begin}).*?\\s*-?%})([^]*?)({%-?\\s*${end}\\s*-?%})`

    }[type]

    const expression = new RegExp(pattern, 'g')

    return expression

  }

}
