import { window, workspace, commands } from 'vscode';
import Document from './extension/document';

/**
 * vscode-liquid
 *
 * @author Nikolas Savvidis
 * @version 2.x.x
 */
exports.activate = context => {

  const { registerCommand } = commands;
  const subscribe = context.subscriptions;
  const active = window.activeTextEditor;
  const document = new Document();
  const {
    liquidrc,
    onConfigChanges,
    onOpenTextDocument,
    disable,
    enable,
    selection,
    output
  } = document;

  // Can create a liquidrc file
  subscribe.push(registerCommand('liquid.liquidrc', liquidrc.bind(document)));

  // Only init on active document
  if (!active || !active.document) return;

  // Workspace
  subscribe.push(workspace.onDidChangeConfiguration(onConfigChanges.bind(document)));
  subscribe.push(workspace.onDidOpenTextDocument(onOpenTextDocument.bind(document)));

  // Commands
  subscribe.push(registerCommand('liquid.disableFormatting', disable.bind(document)));
  subscribe.push(registerCommand('liquid.enableFormatting', enable.bind(document)));
  subscribe.push(registerCommand('liquid.formatSelection', selection.bind(document)));
  subscribe.push(registerCommand('liquid.toggleOutput', output.bind(document)));

};
