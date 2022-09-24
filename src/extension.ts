import { ExtensionContext, window } from 'vscode';
import { VSCodeLiquid } from 'service';

/**
 * vscode-liquid
 *
 * Language features for working with the Liquid Template Language.
 */
export async function activate ({ subscriptions, extension }: ExtensionContext) {

  if (!window.activeTextEditor) return;

  const liquid = new VSCodeLiquid(extension);

  return liquid.onActiveEditor(subscriptions).catch(console.error);

};
