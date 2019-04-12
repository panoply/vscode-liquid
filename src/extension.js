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
    }),
    workspace.onDidChangeConfiguration(() => {
      document.format()
    }),
    commands.registerCommand(cmd.enable, () => {
      document.enable()
    }),
    commands.registerCommand(cmd.disable, () => {
      document.disable()
    }),
    commands.registerCommand(cmd.document, () => {
      document.document()
    }),
    commands.registerCommand(cmd.selection, () => {
      document.selection()
    })
  )
}
