import { workspace } from 'vscode'
import assign from 'assign-deep'
import path from 'path'
import fs from 'fs'
import { Rules, Name } from './options'
import Utils from './utils'

/**
 * Applies custom the cutom configuration
 * settings used by the extension.
 *
 * @class Config
 * @extends {Deprecations}
 *
 */

export default class Config extends Utils {

  constructor () {

    super()

    this.config = Rules
    this.liquid = workspace.getConfiguration('liquid')
    this.rcfile = path.join(workspace.rootPath, '.liquidrc')
    this.watching = false
    this.error = false

  }

  /**
   * Defines where formatting rules are sourced.
   * Looks for rules defined in a `.liquirc` file and if
   * no file present will default to workspace settings.
   *
   * Example:
   *
   * Checks useRuleFile application scope setting, which has
   * a`default` value set to `false`
   *
   */
  setFormattingRules () {

    const liquid = workspace.getConfiguration('liquid')

    // Check for `.liquidrc` rule file

    if (!fs.existsSync(this.rcfile)) {

      this.error = liquid.has('beautify')

      if (this.error) {

        return this.greeting()

      }

    }

    // Check if using rule file
    if (!liquid.get('useRuleFile')) {

      // Deep assignment
      this.config = assign(this.config, liquid.rules)

      return true

    }

    // Check for `.liquidrc` rule file
    if (!fs.existsSync(this.rcfile)) {

      return

    }

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

      this.rcfileWatcher()

    }

  }

  rcfileWatcher () {

    if (!this.watching) {

      const watch = workspace.createFileSystemWatcher(this.rcfile, true, false, false)

      watch.onDidChange(() => this.setFormattingRules())
      watch.onDidDelete(() => this.setFormattingRules())

      this.watching = true

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
    if (tag === 'html') {

      return this.config.html

    }

    let rules

    // loop over each language prop
    for (let lang in this.config) {

      if (lang !== 'ignore' || lang !== 'html') {

        // filters out object without a `tags` prop, eg: `html`
        this.config[lang].hasOwnProperty('tags') && this.config[lang].tags.map(i => {

          if (i.begin === tag) {

            rules = this.config[lang]

          }

        })

      }

    }

    return rules

  }

}
