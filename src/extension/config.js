import { workspace, window } from 'vscode'
import assign from 'assign-deep'
import path from 'path'
import fs from 'fs'
import Utils from './utils'
import { FormattingRules, TagAssociations } from './options'

/**
 * Applies custom configuration settings used
 * by the extension.
 *
 * @class Config
 * @extends Utils
 */

export default class Config extends Utils {

  constructor () {

    super()

    // Configuration
    this.config = FormattingRules
    this.tagAssociates = TagAssociations

    // Applied Configuration
    this.liquid = workspace.getConfiguration('liquid')
    this.format = this.liquid.get('format')
    this.rcfile = path.join(workspace.rootPath, '.liquidrc')

    // Conditional Executors
    this.watch = false
    this.error = false
    this.reset = false

  }

  /**
   * Defines where formatting rules are sourced.
   * Looks for rules defined in a `.liquirc` file and if
   * no file present will default to workspace settings configuration.
   *
   */
  setFormattingRules () {

    // Look for `liquidrc` file
    if (!fs.existsSync(this.rcfile)) {

      // Get latest config option of Liquid
      const liquid = workspace.getConfiguration('liquid')
      const rules = liquid.get('rules')
      const tags = this.setTagAssociates(rules)

      // Assign custom configuration to options
      this.config = assign(this.config, tags)

    } else {

      try {

        // Read .liquidrc file
        const file = fs.readFileSync(this.rcfile, 'utf8')
        const json = JSON.parse(file, null, this.config.html.indent_size)
        const tags = this.setTagAssociates(json)

        // Assign custom configuration to options
        this.config = assign(this.config, tags)

        // Reset Error Condition
        this.error = false

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

  }

  /**
   * Sets custom and native tag associations.
   *
   * @param {object} config the current configuration source
   */
  setTagAssociates (config) {

    for (let lang in this.tagAssociates) {

      if (
        config[lang].hasOwnProperty('tags') &&
        config[lang].tags.length > 0
      ) {

        for (let tag in this.tagAssociates[lang]) {

          config[lang].tags.push(this.tagAssociates[lang][tag])

        }

      } else {

        if (config.hasOwnProperty(lang)) {

          assign(config[lang], {
            tags: this.tagAssociates[lang]
          })

        }

      }

    }

    return config

  }

  /**
   * Watches `.liquidrc` file for changes
   *
   * @memberof Config
   */
  rcfileWatcher () {

    if (!this.watch) {

      const watch = workspace.createFileSystemWatcher(this.rcfile, true, false, false)

      watch.onDidDelete(() => this.setFormattingRules())
      watch.onDidChange(() => {

        this.reset = true
        this.setFormattingRules()

      })

      this.watch = true

    }

  }

  /**
   * Generates a `.liquidrc` file to root of the projects
   * directory.
   *
   * @returns
   * @memberof Config
   */
  rcfileGenerate () {

    if (fs.existsSync(this.rcfile)) {

      return window.showErrorMessage('.liquidrc file already exists!', 'Open')
      .then(answer => {

        if (answer === 'Open') {

          workspace.openTextDocument(this.rcfile).then((document) => {

            window.showTextDocument(document, 1, false)

          }, (error) => {

            return console.error(error)

          })

        }

      })

    }

    const liquid = workspace.getConfiguration('liquid')
    const rules = JSON.stringify(liquid.rules, null, 2)

    fs.writeFile(this.rcfile, rules, (error) => {

      if (error) {

        return this.outputLog({
          title: 'Error generating rules',
          file: this.rcfile,
          message: error.message,
          show: true
        })

      }

      workspace.openTextDocument(this.rcfile).then((document) => {

        window.showTextDocument(document, 1, false)

      }, (error) => {

        return console.error(error)

      }).then(() => {

        this.rcfileWatcher()

        return window.showInformationMessage('You are now using a .liquidrc file to define formatting rules 👍')

      })

    })

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
