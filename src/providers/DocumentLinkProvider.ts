import { basename } from 'node:path';
import { CancellationToken, DocumentLinkProvider as IDocumentLinkProvider, Range, TextDocument, Uri, DocumentLink } from 'vscode';

export class DocumentLinkProvider implements IDocumentLinkProvider {

  /* -------------------------------------------- */
  /* STATE                                        */
  /* -------------------------------------------- */

  /**
   * Render Tag URI's
   */
  includes: Uri[];

  /**
   * Render Tag URI's
   */
  snippets: Uri[];

  /**
   * Render Tag URI's
   */
  sections: Uri[];

  /* -------------------------------------------- */
  /* PROVIDER                                     */
  /* -------------------------------------------- */

  async provideDocumentLinks (document: TextDocument, token: CancellationToken): Promise<DocumentLink[]> {

    const text = document.getText();
    const regex = /(?<={%-?\s*render\s*)['"].*?['"]/g;
    const items: DocumentLink[] = [];

    let m: RegExpExecArray;

    while ((m = regex.exec(text)) !== null) {

      if (m.index === regex.lastIndex) regex.lastIndex++;

      const name = m[0];
      const find = this.files.find(uri => basename(uri.fsPath, '.liquid') === name.slice(1, -1));

      items.push(
        new DocumentLink(
          new Range(document.positionAt(m.index + 1), document.positionAt(m.index + name.length - 1)),
          find
        )
      );

    }

    return items;

  }

}
