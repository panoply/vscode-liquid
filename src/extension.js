import { window, workspace } from 'vscode'
import {
  formatEnable,
  formatDisable,
  textDocument,
  textSelection,
  registerFormat,
  registerRules
} from './extension/formatting'

/**
 * # ACTIVATE EXTENSION
 */
exports.activate = (context) => {
  const active = window.activeTextEditor

  if (!active || !active.document) return

  registerRules()
  registerFormat()

  context.subscriptions.push(formatEnable)
  context.subscriptions.push(formatDisable)
  context.subscriptions.push(textDocument)
  context.subscriptions.push(textSelection)
  context.subscriptions.push(workspace.onDidOpenTextDocument(registerFormat))
  context.subscriptions.push(workspace.onDidChangeConfiguration(registerFormat))
}
