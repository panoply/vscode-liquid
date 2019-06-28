import { workspace,
  languages,
  window,
  ConfigurationTarget,
  StatusBarItem,
  StatusBarAlignment } from 'vscode'

import assign from 'assign-deep'
import Format from './format'

export default class Document extends Format {

  constructor () {

    super()

    this.handler = {}
    this.bar = StatusBarItem
    this.bar = window.createStatusBarItem(StatusBarAlignment.Right, -2)
    this.isFormat = this.liquid.get('format')
    this.fixDeprecatedSettings()
    this.init()

  }

  init () {

    this.isFormat = workspace.getConfiguration('liquid').format
    this.setFormattingRules()
    this.getPatterns()
    this.format()

  }

  format () {

    const { fileName, languageId } = window.activeTextEditor.document

    if (this.handler.hasOwnProperty(fileName)) {

      this.handler[fileName].dispose()

    }

    if (languageId !== 'html') {

      this.bar.hide()

    }

    if (!workspace.getConfiguration('editor').formatOnSave) {

      this.isFormat = false

    }

    if (!this.isFormat || !workspace.getConfiguration('liquid').format) {

      Object.assign(this.bar, {
        text: `💧Liquid: $(x)`,
        command: 'liquid.enableFormatting'
      })

      this.dispose()

      this.bar.show()

      return

    }

    if (super.isError) {

      assign(this.bar, {
        text: `⚠️ Liquid: $(x)`,
        command: 'liquid.toggleOutput'
      })

      this.dispose()

      return this.bar.show()

    }

    this.handler[fileName] = languages.registerDocumentFormattingEditProvider({
      scheme: 'file',
      language: 'html'
    }, {
      provideDocumentFormattingEdits: this.provider.bind(this)
    })

    Object.assign(this.bar, {
      text: `💧Liquid: $(check)`,
      command: 'liquid.disableFormatting'
    })

    this.bar.show()

  }

  selection () {

    try {

      super.selection()
      window.showInformationMessage('Selection Formatted 💧')

    } catch (error) {

      window.showInformationMessage('Format Failed! The selection is invalid or incomplete!')

    }

  }

  document () {

    try {

      super.document()
      window.showInformationMessage('Document Formatted 💧')

    } catch (error) {

      console.log(error)
      window.showInformationMessage('Document could not be formatted, check your code!')

    }

  }

  dispose () {

    for (const key in this.handler) {

      if (this.handler.hasOwnProperty(key)) {

        return this.handler[key].dispose()

      }

    }

  }

  async enable () {

    this.isFormat = true

    await this.liquid.update('format', this.isFormat, ConfigurationTarget.Global)
    .then(() => this.format())
    .then(() => this.init())
    .then(() => window.showInformationMessage('Formatting Enabled 💧'))

  }

  async disable () {

    this.isFormat = false

    await this.liquid.update('format', this.isFormat, ConfigurationTarget.Global)
    .then(() => this.dispose())
    .then(() => this.init())
    .then(() => window.showInformationMessage('Formatting Disabled 💧'))

  }

}
