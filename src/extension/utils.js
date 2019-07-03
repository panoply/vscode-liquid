import { window, StatusBarItem, StatusBarAlignment } from 'vscode'
import Config from './config'

/**
 * Utilities frequently used by the extension
 *
 * @export
 * @class Utils
 * @extends Deprecations
 */
export default class Utils extends Config {

  constructor () {

    super()

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
        text: `⚠️ Liquid: $(x)`,
        tooltip: `Errors detected! Toggle output`,
        command: 'liquid.toggleOutput'
      },
      unconfigured: {
        text: `⚠️ Liquid`,
        tooltip: `Unconfigured! Formatting disabled`,
        command: 'liquid.fixDeprecations'
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
