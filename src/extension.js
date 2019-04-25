import { window, workspace, commands } from 'vscode'
import Document from './extension/document'

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
    commands.registerCommand('liquid.disableFormatting', () => {

      document.disable()

    })
  )
  context.subscriptions.push(
    commands.registerCommand('liquid.enableFormatting', () => {

      document.enable()

    })
  )
  context.subscriptions.push(
    commands.registerCommand('liquid.formatDocument', () => {

      document.document()

    })
  )
  context.subscriptions.push(
    commands.registerCommand('liquid.formatSelection', () => {

      document.selection()

    })
  )

}
