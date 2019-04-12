import { workspace, window, ConfigurationTarget } from 'vscode'
import { liquid } from './config'
import Format from './format'

export default class Document extends Format {

  static notify (message) {
    return window.showInformationMessage(`Liquid: ${message}`)
  }
  constructor () {
    super()
    this.handler = null
    this.editor = window.activeTextEditor
    this.rules = super.rules(liquid)
  }
  dispose () {
    if (this.handler !== null) {
      this.handler.dispose()
      this.handler = null
    }
  }
  format () {
    if (!workspace.getConfiguration('liquid').format) {
      return this.dispose()
    }
    if (!workspace.getConfiguration('editor').formatOnSave) {
      return this.dispose()
    }
    this.dispose()
    this.handler = super.register()
  }
  enable () {
    liquid.update('format', true, ConfigurationTarget.Global)
    return Document.notify('Formatting Enabled 💧')
  }
  disable () {
    liquid.update('format', false, ConfigurationTarget.Global)
    return Document.notify('Formatting Disabled')
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
      Document.notify('Document could not be formatted, check your code!')
    }
  }

}
