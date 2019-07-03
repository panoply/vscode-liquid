import { window, StatusBarItem, StatusBarAlignment } from 'vscode'

/**
 * Utilities frequently used by the extension
 *
 * @class Utils
 */
export default class Utils {

  constructor () {

    this.barItem = StatusBarItem
    this.barItem = window.createStatusBarItem(StatusBarAlignment.Right, -2)
    this.outputChannel = window.createOutputChannel('Liquid')

  }

  /**
   * The status bar item functionality
   *
   * @param {"string"} type the type of status bar item to show
   * @param {"string"} [show] show/hide the status bar item (optional)
   * @memberof Utils
   */
  statusBarItem (type, show) {

    const types = {

      enabled: {
        text: `💧Liquid: $(check)`,
        tooltip: `Enable/Disable Liquid Formatting`,
        command: 'liquid.disableFormatting'
      },
      disabled: {
        text: `💧Liquid: $(x)`,
        tooltip: `Enable Liquid Formatting`,
        command: 'liquid.enableFormatting'
      },
      error: {
        text: `⚠️ Liquid: $(check)`,
        tooltip: `Errors detected! Toggle output`,
        command: 'liquid.toggleOutput'
      }
    }

    Object.assign(this.barItem, types[type])

    if (show !== undefined) {

      return show ? this.barItem.show() : this.barItem.false()

    }

  }

  outputLog ({ title, message, file, show }) {

    const date = new Date().toLocaleString()

    // Apply a date title to the output
    this.outputChannel.appendLine(`[${date}] ${title}: ${message}`)

    if (show) {

      this.error = true
      this.statusBarItem('error')
      this.outputChannel.show()

    }

  }

}
