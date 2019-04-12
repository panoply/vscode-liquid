import { window, workspace, commands } from 'vscode'
import Document from './extension/document'
import { cmd } from './extension/config'

/**
 * # ACTIVATE EXTENSION
 */
exports.activate = context => {
  const active = window.activeTextEditor

  if (!active || !active.document) return

  const document = new Document()

  context.subscriptions.push(
    workspace.onDidOpenTextDocument(() => {
      document.format()
    })
  )
  context.subscriptions.push(
    commands.registerCommand(cmd.disable, () => {
      document.disable()
    })
  )
  context.subscriptions.push(
    commands.registerCommand(cmd.enable, () => {
      document.enable()
    })
  )
  context.subscriptions.push(
    commands.registerCommand(cmd.document, () => {
      document.document()
    })
  )
  context.subscriptions.push(
    commands.registerCommand(cmd.selection, () => {
      document.selection()
    })
  )
}
