import { workspace, window, ConfigurationTarget, StatusBarAlignment, StatusBarItem } from 'vscode'
import { liquid, editor } from './config'
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
    this.rules = super.rules(liquid)
  }
  format () {
    const { fileName, languageId } = window.activeTextEditor.document
    if (!workspace.getConfiguration('editor').formatOnSave) {
      this.run = false
      return this.run
    }
    if (this.run) {
      try {
        this.handler.hasOwnProperty(fileName) && this.handler[fileName].dispose()
        this.handler[fileName] = super.register()
        Object.assign(this.bar, {
          text: `💧Liquid: $(check)`,
          command: 'liquid.disableFormatting'
        })
      } catch (error) {
        console.error(error)
        Document.notify('Error registering the formatter, re-open the file 💧')
      }
    } else {
      Object.assign(this.bar, {
        text: `💧Liquid: $(x)`,
        command: 'liquid.enableFormatting'
      })
    }
    languageId === 'html' ? this.bar.show() : this.bar.hide()
  }
  async enable () {
    this.run = true
    await liquid
      .update('format', this.run, ConfigurationTarget.Global)
      .then(() => {
        this.format()
      })
      .then(() => Document.notify('Formatting Enabled 💧'))
  }
  async disable () {
    this.run = false
    await liquid
      .update('format', this.run, ConfigurationTarget.Global)
      .then(() => {
        for (const key in this.handler) {
          if (this.handler.hasOwnProperty(key)) {
            this.handler[key].dispose()
          }
        }
      })
      .then(() => Document.notify('Formatting Disabled 💧'))
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
