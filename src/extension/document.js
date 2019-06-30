import { workspace, languages, window, ConfigurationTarget } from 'vscode'
import Format from './format'

export default class Document extends Format {

  constructor () {

    super()

    this.handler = {}
    this.liquidConfig = workspace.getConfiguration('liquid')
    this.isFormat = this.liquidConfig.format
    this.fixDeprecatedSettings()
    this.setFormattingRules()
    this.getPatterns()

  }

  onConfigChanges () {

    this.error = false
    this.setFormattingRules()
    this.getPatterns()
    this.onOpenTextDocument()

  }

  onOpenTextDocument () {

    const { fileName, languageId } = window.activeTextEditor.document

    if (this.error) {

      this.statusBarItem('error', true)

    }

    // Skip if log
    if (languageId === 'Log') return

    // Hide status bar item if not HTML and return the provider early
    if (languageId !== 'html') {

      this.dispose()
      this.barItem.hide()

      return

    }

    // If formatOnSave editor option is false, apply its state to Liquid formatter
    if (!workspace.getConfiguration('editor').formatOnSave) {

      this.isFormat = false

    }

    // Formatter is set to false, skip it
    if (!this.isFormat) {

      // Show disabled formatter status bar
      this.dispose()
      this.statusBarItem('disabled', true)

      return

    }

    // Disposal of match filename handler
    if (this.handler.hasOwnProperty(fileName)) {

      this.handler[fileName].dispose()

    }

    this.statusBarItem('enabled', true)

    this.handler[fileName] = languages.registerDocumentFormattingEditProvider({
      scheme: 'file',
      language: 'html'
    }, {
      provideDocumentFormattingEdits: this.provider.bind(this)
    })

  }

  selection () {

    try {

      super.selection()
      window.showInformationMessage('Selection Formatted 💧')

    } catch (error) {

      window.showInformationMessage('Format Failed! The selection is invalid or incomplete!')
      throw outputChannel.appendLine(`💧Liquid: ${error}`)

    }

  }

  document () {

    try {

      super.document()
      window.showInformationMessage('Document Formatted 💧')

    } catch (error) {

      window.showInformationMessage('Document could not be formatted, check your code!')
      throw outputChannel.appendLine(`💧Liquid: ${error}`)

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

    this.isFormat = true

    await this.liquidConfig.update('format', this.isFormat, ConfigurationTarget.Global)
    .then(() => this.onConfigChanges())
    .then(() => window.showInformationMessage('Formatting Enabled 💧'))

  }

  async disable () {

    this.isFormat = false

    await this.liquidConfig.update('format', this.isFormat, ConfigurationTarget.Global)
    .then(() => this.dispose())
    .then(() => this.onConfigChanges())
    .then(() => window.showInformationMessage('Formatting Disabled 💧'))

  }

}
