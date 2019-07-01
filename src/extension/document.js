import { workspace, languages, window, ConfigurationTarget } from 'vscode'
import Format from './format'

/**
 * Document intializer class
 *
 * @class Document
 * @extends {Format}
 */
export default class Document extends Format {

  constructor () {

    super()

    this.handler = {}
    this.isFormat = this.liquid.format
    this.setFormattingRules()
    this.getPatterns()

  }

  /**
   * Executes when configuration settings have changed
   *
   * @memberof Document
   */
  onConfigChanges () {

    this.error = false
    this.setFormattingRules()
    this.getPatterns()
    this.onOpenTextDocument()

  }

  /**
   * Prepares the opened text document for formatting
   *
   * @memberof Document
   */
  onOpenTextDocument () {

    const { fileName, languageId } = window.activeTextEditor.document

    if (this.error) {

      return this.statusBarItem('error', true)

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

    if (!this.error) {

      this.statusBarItem('enabled', true)

    }

    this.handler[fileName] = languages.registerDocumentFormattingEditProvider({
      scheme: 'file',
      language: 'html'
    }, {
      provideDocumentFormattingEdits: this.provider.bind(this)
    })

  }

  /**
   * Dispose of formatting handlers
   *
   * @memberof Document
   */
  dispose () {

    for (const key in this.handler) {

      if (this.handler.hasOwnProperty(key)) {

        this.handler[key].dispose()

      }

    }

  }

  /**
   * Format the selected text area (command)
   *
   * @memberof Document
   */
  selection () {

    try {

      this.selectedText()
      window.showInformationMessage('Selection Formatted 💧')

    } catch (error) {

      window.showInformationMessage('Format Failed! The selection is invalid or incomplete!')
      throw outputChannel.appendLine(`💧Liquid: ${error}`)

    }

  }

  /**
   * Format the entire document (command)
   *
   * @memberof Document
   */
  document () {

    try {

      this.completeDocument()
      window.showInformationMessage('Document Formatted 💧')

    } catch (error) {

      window.showInformationMessage('Document could not be formatted, check your code!')
      throw outputChannel.appendLine(`💧Liquid: ${error}`)

    }

  }

  /**
   * Toggle the output panel
   *
   * @memberof Document
   */
  output () {

    return this.outputChannel.show()

  }

  /**
   * Enabled formatting (command)
   *
   * @memberof Document
   */
  async enable () {

    this.isFormat = true

    await this.liquid.update('format', this.isFormat, ConfigurationTarget.Global)
    .then(() => this.onConfigChanges())
    .then(() => this.onOpenTextDocument())
    .then(() => window.showInformationMessage('Formatting Enabled 💧'))

  }

  /**
   * Disable formatting (command)
   *
   * @memberof Document
   */
  async disable () {

    this.isFormat = false

    await this.liquid.update('format', this.isFormat, ConfigurationTarget.Global)
    .then(() => this.dispose())
    .then(() => this.onConfigChanges())
    .then(() => window.showInformationMessage('Formatting Disabled 💧'))

  }

}
