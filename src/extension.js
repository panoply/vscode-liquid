import { window, workspace, commands } from 'vscode'
import Document from './extension/document'

/**
 * vscode-liquid
 *
 * @author Nikolas Savvidis
 * @version 2.x.x
 */
exports.activate = context => {

  const { registerCommand } = commands
  const sub = context.subscriptions
  const active = window.activeTextEditor

  if (!active || !active.document) return

  // Get Document
  const document = new Document()

  // Workspace
  sub.push(workspace.onDidChangeConfiguration(document.onConfigChanges.bind(document)))
  sub.push(workspace.onDidOpenTextDocument(document.onOpenTextDocument.bind(document)))

  // Commands
  sub.push(registerCommand('liquid.disableFormatting', document.disable.bind(document)))
  sub.push(registerCommand('liquid.enableFormatting', document.enable.bind(document)))
  sub.push(registerCommand('liquid.formatDocument', document.document.bind(document)))
  sub.push(registerCommand('liquid.formatSelection', document.selection.bind(document)))
  sub.push(registerCommand('liquid.toggleOutput', document.output.bind(document)))
  sub.push(registerCommand('liquid.liquidrc', document.liquidrc.bind(document)))
  sub.push(registerCommand('liquid.fixDeprecations', document.fixRules.bind(document)))

}
