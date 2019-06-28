import { workspace, window } from 'vscode'
import assign from 'assign-deep'
import path from 'path'
import fs from 'fs'
import { Rules } from './rules'
import { output } from './api'
import chalk from 'chalk'
import { throws } from 'assert'

export default class Config {

  constructor () {

    this.config = Rules
    this.rcfile = path.join(workspace.rootPath, '.liquidrc')
    this.liquid = workspace.getConfiguration('liquid')
    this.isWatching = false
    this.isError = false

  }

  /**
   * Rules
   *
   * Defines where formatting rules are sourced.
   * Looks for rules defined .liquirc file and if
   * no liquidrc file will look in workspace settings.
   *
   * @return {Object}
   *
   */
  setFormattingRules () {

    // Check if using rule file
    if (!this.liquid.get('useRuleFile')) {

      // Notify output
      output.appendLine(`💧 'Not using a .liquidrc rule file`)

      // Assign workspace rules
      // Deep assignment
      assign(this.config, this.liquid.get('formattingRules'))

      return

    }

    // Check for `.liquidrc` rule file
    if (!fs.existsSync(this.rcfile)) return

    try {

      // Read .liquidrc file
      const file = fs.readFileSync(this.rcfile, 'utf8')

      // Parse contents, use html `indent_size` which uses `editor.tabSize`
      const json = JSON.parse(file, null, this.config.html.indent_size)

      this.isError = false

      // Assign custom configuration to options
      this.config = assign(this.config, json)

    } catch (error) {

      window.showErrorMessage('An error occured from within the .liquidrc formatting rules file, see the output for more information. 💧')

      output.appendLine(`💧Liquid: ${error}`)

      return false

    } finally {

      if (!this.isWatching) {

        const watch = workspace.createFileSystemWatcher(this.rcfile, true, false, false)

        watch.onDidChange(() => this.setFormattingRules())
        watch.onDidDelete(() => this.setFormattingRules())

        output.appendLine(`💧Liquid: Watching ${this.rcfile}`)

        this.isWatching = true

      }

    }

  }

  /**
   * Returns formatting rules based on
   * matching `liquid_tags` value
   *
   * @param {string} tag
   */
  getRuleByTagName (tag) {

    // skip iteration if tag equals html
    if (tag === 'html') return this.config.html

    let rules

    // loop over each language prop
    for (let language in this.config) {

      // filters out object without a `liquid_tags` prop, eg: `html`
      if (this.config[language].hasOwnProperty('tags')) {

        this.config[language].tags.map(i => {

          if (i.begin === tag) {

            rules = this.config[language]

          }

        })

      }

    }

    return rules

  }

  fixDeprecatedSettings () {

    if (!fs.existsSync(this.rcfile) && this.liquid.get('beautify')) {

      if (this.liquid.get('formatIgnore')) {

        return this.fixDeprecatedIgnore()

      } else {

        return this.fixDeprecatedRules()

      }

    }

  }

  fixDeprecatedIgnore () {

    window.showInformationMessage(`The "liquid.formatIgnore" workspace setting has been deprecated. Ignored tags are now defined within the html.ignore formatting ruleset and use a new definition schema. Please re-define your ignored tags.`, 'Learn more', 'Next').then((selected) => {

      if (selected === 'Next') {

        this.liquid.update('formatIgnore', undefined, true)
        return this.fixDeprecatedRules()

      }

      if (selected === 'Learn More') {

        output.append(``)

      }

    })

  }

  fixDeprecatedRules () {

    window.showInformationMessage(`Liquid formatting rules can now be defined using a .liquidrc file. Would you like to generate one based on your current beautify ruleset?`,
      `Yes, (Recommended)`,
      'No').then((selected) => {

      const content = {
        html: this.liquid.beautify.html || this.liquid.formattingRules.html,
        js: this.liquid.beautify.javascript || this.liquid.formattingRules.js,
        scss: this.liquid.beautify.stylesheet || this.liquid.formattingRules.scss,
        css: this.liquid.beautify.stylesheet || this.liquid.formattingRules.css,
        json: this.liquid.beautify.schema || this.liquid.formattingRules.json
      }

      if (selected !== 'No') {

        const json = JSON.stringify(content, null, 2)

        fs.writeFile(this.rcfile, json, (error) => {

          if (error) {

            output.appendLine(`${error}`)

            return window.showErrorMessage('An error occured while generating the .liquidrc rule file.', 'Details', () => output.show())

          }

        })

      } else {

        this.liquid.update('formattingRules', content, true)

      }

      this.liquid.update('beautify', undefined, true)

    })

  }

}
