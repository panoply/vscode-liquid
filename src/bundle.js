import { window } from 'vscode'
import Format from './extension/formatting'
import { liquid, patterns } from './extension/config'

/**
 * # ACTIVATE EXTENSION
 */
exports.activate = (context) => {
  const active = window.activeTextEditor
  if (!active || !active.document || !liquid.format) return

  const format = new Format()
  context.subscriptions.push(format.activation())
  context.subscriptions.push(format.configuration())
}
