import { workspace, window } from 'vscode'
import assign from 'assign-deep'
import path from 'path'
import fs from 'fs'
import { Rules } from './options'

/**
 * Applies custom the cutom configuration
 * settings used by the extension.
 *
 * @class Config
 * @extends {Deprecations}
 *
 */

export default class Config {

  constructor () {

    this.config = Rules
    this.liquid = workspace.getConfiguration('liquid')
    this.rcfile = path.join(workspace.rootPath, '.liquidrc')
    this.format = this.liquid.get('format')
    this.watching = false
    this.error = false
    this.unconfigured = false

  }

  /**
   * Defines where formatting rules are sourced.
   * Looks for rules defined in a `.liquirc` file and if
   * no file present will default to workspace settings.
   *
   */
  setFormattingRules () {

    const liquid = workspace.getConfiguration('liquid')

    if (!fs.existsSync(this.rcfile)) {

      if (liquid.beautify) {

        return this.fixRules()

      } else {

        this.config = assign(this.config, liquid.rules)

      }

    } else {

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

  }

  rcfileWatcher () {

    if (!this.watching) {

      const watch = workspace.createFileSystemWatcher(this.rcfile, true, false, false)

      watch.onDidChange(() => this.setFormattingRules())
      watch.onDidDelete(() => this.setFormattingRules())

      this.watching = true

    }

  }

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
