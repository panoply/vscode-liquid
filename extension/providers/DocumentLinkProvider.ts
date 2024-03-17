import { basename } from 'node:path';
import { SettingsFile, SnippetFile } from 'parse/helpers';
import {
  CancellationToken,
  DocumentLinkProvider as IDocumentLinkProvider,
  Range,
  TextDocument,
  Uri,
  DocumentLink
} from 'vscode';

export class DocumentLinkProvider implements IDocumentLinkProvider {

  /* -------------------------------------------- */
  /* STATE                                        */
  /* -------------------------------------------- */

  /**
   * Render Tag URI's for 11ty Liquid engine
   */
  includes: Uri[];

  /**
   * Render Tag URI's for Shopify Liquid engine
   */
  snippets: Uri[];

  /**
   *The `settings_schema.json` URI
   */
  settings: Uri = null;

  /**
   * Render Tag URI's
   */
  sections: Uri[];

  /* -------------------------------------------- */
  /* PROVIDER                                     */
  /* -------------------------------------------- */

  provideDocumentLinks (document: TextDocument, _token: CancellationToken): DocumentLink[] {

    const content = document.getText();
    const links: DocumentLink[] = [];

    if (this.snippets && this.snippets.length > 0) {
      this.getPartialFileLinks(document, content, links);
    }

    if (this.includes && this.includes.length > 0) {
      this.getPartialFileLinks(document, content, links);
    }

    if (this.settings !== null) {
      this.getSettingsLinks(document, content, links);
    }

    return links;

  }

  private getPartialFileLinks (document: TextDocument, content: string, links: DocumentLink[]) {

    let m: RegExpExecArray;

    while ((m = SnippetFile.exec(content)) !== null) {

      if (m.index === SnippetFile.lastIndex) SnippetFile.lastIndex++;

      const uri = this.snippets.find(uri => basename(uri.fsPath, '.liquid') === m[0].slice(1, -1));
      const range = new Range(document.positionAt(m.index + 1), document.positionAt(m.index + m[0].length - 1));
      const link = new DocumentLink(range, uri);

      link.tooltip = 'Open File';

      links.push(link);

    }

    return links;

  }

  private getSettingsLinks (document: TextDocument, content: string, links: DocumentLink[]) {

    let m: RegExpExecArray;

    while ((m = SettingsFile.exec(content)) !== null) {

      if (m.index === SettingsFile.lastIndex) SettingsFile.lastIndex++;

      const prop = m[0].split('.').filter(Boolean);

      if (prop.length > 0) {

        const range = new Range(document.positionAt(m.index), document.positionAt(m.index + 8));
        const link = new DocumentLink(range, this.settings);

        link.tooltip = 'Open File';

        links.push(link);
      }

    }

    return links;

  }

  // TODO
  //
  // private getLocalesLinks () { }

}
