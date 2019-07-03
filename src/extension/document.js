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
    this.setFormattingRules()
    this.getPatterns()

  }

  /**
   * Executes when configuration settings have changed
   *
   * @memberof Document
   */
  onConfigChanges () {

    // Operation Condition
    if (this.unconfigured) return

    // Reset error
    this.error = false

    // Common Initializes
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

    if (this.unconfigured) {

      return this.statusBarItem('unconfigured', true)

    }

    if (this.error) {

      this.statusBarItem('error', true)

    }

    // Hide status bar item if not HTML and return the provider early
    if (languageId !== 'html') {

      this.dispose()
      this.barItem.hide()

      return

    }

    // If formatOnSave editor option is false, apply its state to Liquid formatter
    if (!workspace.getConfiguration('editor').formatOnSave) {

      this.format = false

    }

    // Formatter is set to false, skip it
    if (!this.format) {

      // Show disabled formatter status bar
      this.dispose()
      return this.statusBarItem('disabled', true)

    }

    // Disposal of match filename handler
    if (this.handler.hasOwnProperty(fileName)) {

      this.handler[fileName].dispose()

    }

    if (!this.error && this.format) {

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

  liquidrc () {

    return this.rcfileGenerate()

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
  enable () {

    this.format = true
    this.liquid.update('format', this.format, ConfigurationTarget.Global)
    .then(() => window.showInformationMessage('Formatting Enabled 💧'))

  }

  /**
   * Disable formatting (command)
   *
   * @memberof Document
   */
  disable () {

    this.format = false
    this.liquid.update('format', this.format, ConfigurationTarget.Global)
    .then(() => this.dispose())
    .then(() => window.showInformationMessage('Formatting Disabled 💧'))

  }

}
