import { window, workspace } from 'vscode'
import {
  formatting,
  setup,
  configuration,
  formatDocument,
  formatSelection,
  enableFormatting
} from './extension/formatting'

/**
 * # ACTIVATE EXTENSION
 */
exports.activate = (context) => {
  const active = window.activeTextEditor
  const liquid = workspace.getConfiguration('liquid')

  if (!active || !active.document || !liquid.format) return

  setup()

  context.subscriptions.push(enableFormatting)
  context.subscriptions.push(formatDocument)
  context.subscriptions.push(formatSelection)
  context.subscriptions.push(workspace.onDidOpenTextDocument(formatting))
  context.subscriptions.push(configuration)
}
