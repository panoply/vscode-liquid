import { window, commands, StatusBarItem, StatusBarAlignment } from 'vscode'
import { outputChannel } from './options'

export default class Utils {

  constructor () {

    this.barItem = StatusBarItem
    this.barError = window.createStatusBarItem(StatusBarAlignment.Right, -3)
    this.barItem = window.createStatusBarItem(StatusBarAlignment.Right, -2)
    this.outputCommand = false

  }

  output () {

    return outputChannel.show()

  }

  /**
   * Status bar item state
   *
   * @param {string} enabled, disabled or error
   */
  statusBarItem (type, show, count) {

    if (this.barItem === undefined) return

    if (type === 'enabled') {

      this.barItem.text = `💧Liquid: $(check)`
      this.barItem.tooltip = `Enable/Disable Liquid Formatting`
      this.barItem.command = 'liquid.disableFormatting'

    }

    if (type === 'disabled') {

      this.barItem.text = `💧Liquid: $(x)`
      this.barItem.command = 'liquid.enableFormatting'

    }

    if (type === 'error') {

      this.barItem.text = `⚠️ Liquid: $(x)`
      this.barItem.tooltip = `Errors`
      this.barItem.command = 'liquid.toggleOutput'

    }

    if (show === undefined) return

    if (show) {

      this.barItem.show()

    } else {

      this.barItem.false()

    }

  }

  outputLog ({ title, message, file, show }) {

    const date = new Date().toLocaleString()
    const prefix = `[${date}] ${title}`
    const msg = !file ? message : this.addFilePath(message, file)

    // Apply a date title to the output
    outputChannel.appendLine(`${prefix}: ${msg}`)

    if (show) {

      this.error = true
      this.statusBarItem('error')
      outputChannel.show()

    }

  }

  addFilePath (message, fileName) {

    const lines = message.split('\n')

    if (lines.length > 0) {

      lines[0] = lines[0].replace(/(\d*):(\d*)/g, `${fileName}:$1:$2`)
      return lines.join('\n')

    }

    return message

  }

}
