import { workspace, window, ConfigurationTarget, StatusBarItem, StatusBarAlignment } from 'vscode'

import Format from './format'

export default class Document extends Format {

  static notify (message) {

    return window.showInformationMessage(`Liquid ${message}`)

  }

  constructor () {

    super()
    this.handler = {}
    this.run = workspace.getConfiguration('liquid').format
    this.bar = StatusBarItem
    this.bar = window.createStatusBarItem(StatusBarAlignment.Right, -2)
    this.rules = super.rules(workspace.getConfiguration('liquid'))

  }

  format () {

    const { fileName, languageId } = window.activeTextEditor.document

    if (!workspace.getConfiguration('editor').formatOnSave) {

      this.run = false

      return this.run

    }

    if (this.run) {

      try {

        if (fileName && this.handler.hasOwnProperty(fileName)) {

          this.handler[fileName].dispose()

        }

        this.handler[fileName] = super.register()

        Object.assign(this.bar, {
          text: `💧Liquid: $(check)`,
          command: 'liquid.disableFormatting'
        })

      } catch (error) {

        console.error(error)
        Document.notify('Error registering the formatter, re-open the file 💧')

      }

    }
    if (!this.run) {

      Object.assign(this.bar, {
        text: `💧Liquid: $(x)`,
        command: 'liquid.enableFormatting'
      })

    }
    if (languageId === 'html') {

      this.bar.show()

    } else {

      this.bar.hide()

    }

  }
  selection () {

    try {

      super.selection()
      Document.notify('Selection Formatted 💧')

    } catch (error) {

      Document.notify('Format Failed! The selection is invalid or incomplete!')

    }

  }
  document () {

    try {

      super.document()
      Document.notify('Document Formatted 💧')

    } catch (error) {

      console.log(error)
      Document.notify('Document could not be formatted, check your code!')

    }

  }

  dispose () {

    for (const key in this.handler) {

      if (this.handler.hasOwnProperty(key)) {

        this.handler[key].dispose()

      }

    }

  }

  async enable () {

    this.run = true
    await workspace
      .getConfiguration('liquid')
      .update('format', this.run, ConfigurationTarget.Global)
      .then(() => this.format())
      .then(() => Document.notify('Formatting Enabled 💧'))

  }
  async disable () {

    this.run = false
    await workspace
      .getConfiguration('liquid')
      .update('format', this.run, ConfigurationTarget.Global)
      .then(() => this.dispose())
      .then(() => Document.notify('Formatting Disabled 💧'))

  }

}
