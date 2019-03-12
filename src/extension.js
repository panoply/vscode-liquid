import { window, workspace } from 'vscode'
import Formatting from './extension/formatting'

/**
 * # ACTIVATE EXTENSION
 */
exports.activate = (context) => {
  const active = window.activeTextEditor
  const liquid = workspace.getConfiguration('liquid')

  if (!active || !active.document || !liquid.format) return

  const format = new Formatting({
    liquid: liquid,
    schema: {
      scheme: 'file',
      language: 'liquid'
    }
  })

  context.subscriptions.push(format.activation())
  context.subscriptions.push(format.configuration())
}
