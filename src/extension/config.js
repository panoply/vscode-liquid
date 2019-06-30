import { workspace, window } from 'vscode'
import assign from 'assign-deep'
import path from 'path'
import fs from 'fs'
import { Rules, outputChannel } from './options'
import Utils from './utils'

export default class Config extends Utils {

  constructor () {

    super()

    this.config = Rules
    this.rcfile = path.join(workspace.rootPath, '.liquidrc')
    this.isWatching = false
    this.error = false

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

    const liquid = workspace.getConfiguration('liquid')

    // Check if using rule file
    if (!liquid.get('useRuleFile')) {

      // Deep assignment
      assign(this.config, liquid.rules)

      return

    }

    // Check for `.liquidrc` rule file
    if (!fs.existsSync(this.rcfile)) return

    try {

      // Read .liquidrc file
      const file = fs.readFileSync(this.rcfile, 'utf8')

      // Parse contents, use html `indent_size` which uses `editor.tabSize`
      const json = JSON.parse(file, null, this.config.html.indent_size)

      this.error = false

      // Assign custom configuration to options
      this.config = assign(this.config, json)

    } catch (error) {

      this.outputLog({
        title: 'Error reading formatting rules',
        file: this.rcfile,
        message: error.message,
        show: true
      })

    } finally {

      if (!this.isWatching) {

        const watch = workspace.createFileSystemWatcher(this.rcfile, true, false, false)

        watch.onDidChange(() => this.setFormattingRules())
        watch.onDidDelete(() => this.setFormattingRules())

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

      if (language !== 'ignore' || language !== 'html') {

        // filters out object without a `tags` prop, eg: `html`
        if (this.config[language].hasOwnProperty('tags')) {

          this.config[language].tags.map(i => {

            if (i.begin === tag) {

              rules = this.config[language]

            }

          })

        }

      }

    }

    return rules

  }

  fixDeprecatedSettings () {

    const liquid = workspace.getConfiguration('liquid')

    if (!fs.existsSync(this.rcfile) && liquid.get('beautify')) {

      if (liquid.get('formatIgnore')) {

        return this.fixDeprecatedIgnore(liquid)

      } else {

        return this.fixDeprecatedRules(liquid)

      }

    }

  }

  fixDeprecatedIgnore (liquid) {

    window.showInformationMessage('Do you want to continue?', {
      modal: true
    }, 'Yes', 'No')

    window.showInformationMessage(`The "liquid.formatIgnore" workspace setting has been deprecated. Ignored tags are now defined within the html.ignore formatting ruleset and use a new definition schema. Please re-define your ignored tags.`, 'Learn more', 'Next').then((selected) => {

      if (selected === 'Next') {

        liquid.update('formatIgnore', undefined, true)
        return this.fixDeprecatedRules(liquid)

      }

      if (selected === 'Learn More') {

        outputChannel.append(``)

      }

    })

  }

  fixDeprecatedRules (liquid) {

    window.showInformationMessage(`Liquid formatting rules can now be defined using a .liquidrc file. Would you like to generate one based on your current beautify ruleset?`,
      `Yes, (Recommended)`,
      'No').then((selected) => {

      const content = {
        ignore: liquid.rules.ignore,
        html: liquid.beautify.html || liquid.rules.html,
        js: liquid.beautify.javascript || liquid.rules.js,
        scss: liquid.beautify.stylesheet || liquid.rules.scss,
        css: liquid.beautify.stylesheet || liquid.rules.css,
        json: liquid.beautify.schema || liquid.rules.json
      }

      if (selected !== 'No') {

        const json = JSON.stringify(content, null, 2)

        fs.writeFile(this.rcfile, json, (error) => {

          if (error) {

            outputChannel.appendLine(`${error}`)

            this.outputLog({
              title: 'Error generating rules',
              file: this.rcfile,
              message: error.message
            })
            return window.showErrorMessage('An error occured while generating the .liquidrc rule file.', 'Details', () => outputChannel.show())

          }

        })

      } else {

        liquid.update('rules', content, true)

      }

      liquid.update('beautify', undefined, true)

    })

  }

}
