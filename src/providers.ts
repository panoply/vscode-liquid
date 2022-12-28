import { FormattingProvider } from 'providers/FormattingProvider';
import { CompletionProvider } from 'providers/CompletionProvider';
import { DocumentLinkProvider } from 'providers/DocumentLinkProvider';
import { HoverProvider } from 'providers/HoverProvider';
import { CodeLensProvider } from 'providers/CodeLensProvider';
import { Extension } from 'extension';
import { Engine, liquid, q } from '@liquify/liquid-language-specs';
import { CompletionItemKind, workspace } from 'vscode';
import { entries } from 'utils';
import { getFilterCompletions, getLogicalCompletions, getObjectCompletions, getObjectKind, getTagCompletions } from 'lexical/parse';

/**
 * Providers
 *
 * Implements all known feature providers, including language services
 * like (for example) the JSONLanguageService. This is the base class
 * from which which all `workspace/*` classes will extend.
 *
 * ---
 *
 * The `StatusLanguageItem` class will extend next.
 */
export class Providers extends Extension {

  /**
   * Formatting Provider
   *
   * The formatting edit provider instance
   */
  public formatting = new FormattingProvider();

  /**
   * Completion Item Provider
   *
   * The completion item provider instance
   */
  public completion = new CompletionProvider();

  /**
   * Document Link Provider
   *
   * The document link provider instance
   */
  public links = new DocumentLinkProvider();

  /**
   * Hover Provider
   *
   * The hover provider instance
   */
  public hovers = new HoverProvider();

  /**
   * CodeLens Provider
   *
   * The codelens provider instance
   */
  public codelens = new CodeLensProvider();

  /**
   * Generate Data
   *
   * Constructs and generates data references used in providers
   */
  async getContext () {

    if (this.engine === 'shopify') {
      q.setEngine(Engine.shopify);
    }

    if (this.uri.files.locales !== null) {
      const locales = await workspace.fs.readFile(this.uri.files.locales);
      this.completion.items.locales = JSON.parse(locales.toString());
    }

    if (this.uri.files.settings !== null) {
      const settings = await workspace.fs.readFile(this.uri.files.settings);
      this.completion.items.settings = JSON.parse(settings.toString());
    }

    if (this.uri.files.snippets !== null) {
      // this.complete.sections = this.uri.files.sections.map(({ fsPath }) => (<CompletionItem>{
      //   label: basename(fsPath, '.liquid'),
      //   insertText: basename(fsPath, '.liquid'),
      //   kind: CompletionItemKind.Reference,
      //   documentation: new MarkdownString(`Snippet File\n\n---\n\n[${basename(fsPath)}](${fsPath})`)
      // }));

    }
    // if (this.files.snippets !== null) {

    //   this.complete.locales.file = this.files.locales;
    //   this.complete.locales.items = JSON.parse(readFileSync(this.files.locales).toString());
    // }

    if (this.completion.enable.logical) {
      this.completion.items.logical = getLogicalCompletions();
    }

    if (this.completion.enable.tags) {
      this.completion.items.tags = entries(liquid.shopify.tags).map(getTagCompletions);
    }

    if (this.completion.enable.filters) {
      this.completion.items.filters = entries(liquid.shopify.filters).map(getFilterCompletions);
    }

    if (this.completion.enable.objects) {
      this.completion.items.objects = entries(liquid.shopify.objects).map(getObjectCompletions);
      this.completion.items.common = getObjectKind(this.completion.items.objects, [ CompletionItemKind.Module ]);
    }

  }

}
