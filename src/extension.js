import { window, workspace, commands } from 'vscode'
import Document from './extension/document'
import { outputChannel } from './extension/options'

const { registerCommand } = commands

/**
 * # ACTIVATE EXTENSION
 */
exports.activate = context => {

  const sub = context.subscriptions
  const active = window.activeTextEditor

  if (!active || !active.document) return

  const document = new Document()

  sub.push(window.onDidChangeActiveTextEditor(document.format.bind(document)))
  sub.push(workspace.onDidOpenTextDocument(document.format.bind(document)))
  sub.push(workspace.onDidChangeConfiguration(document.init.bind(document)))
  sub.push(registerCommand('liquid.disableFormatting', document.disable.bind(document)))
  sub.push(registerCommand('liquid.enableFormatting', document.enable.bind(document)))
  sub.push(registerCommand('liquid.toggleOutput', outputChannel.show()))
  sub.push(registerCommand('liquid.formatDocument', document.document.bind(document)))
  sub.push(registerCommand('liquid.formatSelection', document.selection.bind(document)))

}
