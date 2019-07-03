import { window, env, Uri, workspace } from 'vscode'
import fs from 'fs'
import Utils from './utils'

/**
 * Fixes deprecated settings in previous versions
 *
 * @class Deprecations
 */
export default class Deprecations extends Utils {

  fixIgnores () {

    this.liquid.update('formatIgnore', undefined, true).then(() => {

      window.showInformationMessage(`💧liquid.formatIgnore was deprecated.`, 'Learn more').then((selected) => {

        if (selected === 'Learn more') {

          env.openExternal(Uri.parse('https://github.com/panoply/vscode-liquid#ignoring-tags'))

        }

      })

    })

  }

  fixRules () {

    this.unconfigured = true

    window.showInformationMessage('Liquid formatting rules can now be defined using a .liquidrc file. Would you like to generate a .liquidrc file using your exisiting liquid formatting rules or just use the default configuration?',
      'Use default', 'Use .liquidrc file').then((selected) => {

      const content = {
        ignore: this.liquid.rules.ignore,
        html: this.liquid.beautify.html || this.liquid.rules.html,
        js: this.liquid.beautify.javascript || this.liquid.rules.js,
        scss: this.liquid.beautify.stylesheet || this.liquid.rules.scss,
        css: this.liquid.beautify.stylesheet || this.liquid.rules.css,
        json: this.liquid.beautify.schema || this.liquid.rules.json
      }

      if (selected === 'Use .liquidrc file') {

        const json = JSON.stringify(content, null, 2)

        fs.writeFile(this.rcfile, json, (error) => {

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

            this.liquid.update('beautify', undefined, true).then(() => {

              this.fixIgnores()
              this.unconfigured = false

            })

            window.showInformationMessage('You are now using a .liquidrc file to define formatting rules 👍')

          })

        })

      } else if (selected === 'Use default') {

        window.showInformationMessage('Settings were updated successfully 👍')

        this.liquid.update('beautify', undefined, true).then(() => {

          this.fixIgnores()
          this.unconfigured = false

        })

      }

    })

  }

}
