import { ExtensionContext } from 'vscode';
import { VSCodeLiquid } from 'service';

/**
 * vscode-liquid
 *
 * Language features for working with the Liquid Template Language.
 */
export async function activate ({ subscriptions, extension }: ExtensionContext) {

  const liquid = new VSCodeLiquid(extension);

  return liquid.onActiveEditor(subscriptions);

};
