/* eslint-disable no-unused-vars */
/* eslint-disable quote-props */

import { ExtensionContext, window } from 'vscode';
import { waitFor, isType } from 'rambdax';
// import { Tester } from 'anymatch';
import { Document } from './document';
import { isUndefined } from './utilities';

/**
 * vscode-liquid
 *
 * Language features for working with the Liquid Template Language.
 */
export async function activate ({ subscriptions }: ExtensionContext) {

  const document = new Document();

  await document.onEditorStart(subscriptions);

};
