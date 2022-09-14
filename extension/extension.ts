/* eslint-disable no-unused-vars */
/* eslint-disable quote-props */

import { ExtensionContext } from 'vscode';
// import { Tester } from 'anymatch';
import { Document } from '../extension/providers/document';

/**
 * vscode-liquid
 *
 * Language features for working with the Liquid Template Language.
 */
export async function activate ({ subscriptions }: ExtensionContext) {

  const document = new Document();

  // Only init on active document
  if (!document.textEditor && !document.textDocument) return;

  document.onEditorStart(subscriptions);

};
