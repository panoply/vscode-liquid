import { window, env, Uri, workspace } from 'vscode'
import fs from 'fs'

/*
    window.showInformationMessage('Do you want to continue?', {
      modal: true
    }, 'Yes', 'No')

*/

/**
 * Fixes deprecated settings in previous versions
 *
 * @class Deprecations
 */
export default class Deprecations {

  greeting () {

    window.showInformationMessage(`💧 Liquid Extension: Some settings have changed that need your attention, please proceed.`, 'Proceed').then((selected) => {

      if (selected === 'Proceed') {

        // this.liquid.update('formatIgnore', undefined, true)
        return this.liquid.get('formatIgnore') ? this.fixIgnores() : this.fixRules()

      } else {

        window.showInformationMessage('💧 Are you sure?\n\nLiquid formatting will not work without proceeding\n', {
          modal: true
        }, 'Go Back').then(answer => {

          if (answer === 'Go Back') {

            return this.greeting()

          }

        })

      }

    })

  }

  fixIgnores () {

    window.showInformationMessage(`The liquid.formatIgnore workspace setting has been deprecated. Please re-define your ignored tags using the new definition schema 💧`, 'Learn more', 'Next').then((selected) => {

      if (selected === 'Next') {

        // this.liquid.update('formatIgnore', undefined, true)

        return this.fixRules()

      }

      if (selected === 'Learn more') {

        env.openExternal(Uri.parse('https://github.com/panoply/vscode-liquid/tree/v2.0.0#ignoring-tags'))

      }

    })

  }

  fixRules () {

    window.showInformationMessage(`Liquid formatting rules can now be defined using a .liquidrc file – would you like to generate one based on your current formatting ruleset?`,
      'No', 'Yes (Recommended)').then((selected) => {

      const content = {
        ignore: this.liquid.rules.ignore,
        html: this.liquid.beautify.html || this.liquid.rules.html,
        js: this.liquid.beautify.javascript || this.liquid.rules.js,
        scss: this.liquid.beautify.stylesheet || this.liquid.rules.scss,
        css: this.liquid.beautify.stylesheet || this.liquid.rules.css,
        json: this.liquid.beautify.schema || this.liquid.rules.json
      }

      if (selected === 'Yes (Recommended)') {

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

            this.error = false

            return window.showInformationMessage(`👍 Success!`)

          })

        })

      } else if (selected === 'No') {

        this.liquid.update('rules', content, true).then(() => {

          this.error = false

          return window.showInformationMessage(`👍 Success! The new configuration settings were applied to your workspace settings.`)

        })

      }

      // liquid.update('beautify', undefined, true)

    })

  }

}
