import { FormatEvent, FormattingProvider } from './providers/FormattingProvider';
import { CompletionProvider } from './providers/CompletionProvider';
import { DocumentLinkProvider } from './providers/DocumentLinkProvider';
import { HoverProvider } from 'providers/HoverProvider';
import { Engine, liquid, q } from '@liquify/specs';
import { ShopifyOperators, StandardOperators } from 'data/operators';
import { getFilterCompletions, getFileCompletions, getTagCompletions } from 'data/liquid';
import { Extension } from 'extension';

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
  public formatting = new FormattingProvider<FormatEvent>(this.listen);

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
  //  public codelens = new CodeLensProvider();

  resetFeatures () {

    if (this.engine === 'shopify') {

      if (this.completion.enable.snippets) {
        this.completion.items.set('snippets', getFileCompletions(this.files.snippets));
        this.links.snippets = Array.from(this.files.snippets);
      }

      if (this.completion.enable.sections) {
        this.completion.items.set('sections', getFileCompletions(this.files.sections));
        this.links.sections = Array.from(this.files.sections);
      }

    } else if (this.engine === '11ty') {

      if (this.completion.enable.includes) {
        this.completion.items.set('snippets', getFileCompletions(this.files.includes));
        this.links.includes = Array.from(this.files.includes);
      }

    }
  }

  /**
   * Get Features
   */
  async setFeatures () {

    if (this.engine === 'shopify') {

      q.setEngine(Engine.shopify);

      if (this.completion.enable.operators) {
        this.completion.items.set('operators', ShopifyOperators);
      }

      if (this.completion.enable.tags) {
        this.completion.items.set('tags', getTagCompletions(liquid.shopify.tags));
      }

      if (this.completion.enable.filters) {
        this.completion.items.set('filters', getFilterCompletions(liquid.shopify.filters));
      }

      if (this.completion.enable.snippets) {
        this.completion.items.set('snippets', getFileCompletions(this.files.snippets));
        this.links.snippets = Array.from(this.files.snippets);
      }

      if (this.completion.enable.sections) {
        this.completion.items.set('sections', getFileCompletions(this.files.sections));
        this.links.sections = Array.from(this.files.sections);
      }

      if (this.completion.enable.settings) {
        this.links.settings = this.files.settings;
      }

    } else if (this.engine === '11ty') {

      q.setEngine(Engine.eleventy);

      if (this.completion.enable.operators) {
        this.completion.items.set('operators', StandardOperators);
      }

      if (this.completion.enable.tags) {
        this.completion.items.set('tags', getTagCompletions(liquid.eleventy.tags));
      }

      if (this.completion.enable.filters) {
        this.completion.items.set('filters', getFilterCompletions(liquid.eleventy.filters));
      }

      if (this.completion.enable.includes) {
        this.completion.items.set('snippets', getFileCompletions(this.files.includes));
      }

    } else {

      if (this.engine === 'jekyll') {
        q.setEngine(Engine.jekyll);
      } else if (this.engine === 'standard') {
        q.setEngine(Engine.standard);
      }

      if (this.completion.enable.operators) {
        this.completion.items.set('operators', StandardOperators);
      }

      if (this.completion.enable.tags) {
        this.completion.items.set('tags', getTagCompletions(liquid.standard.tags));
      }

      if (this.completion.enable.filters) {
        this.completion.items.set('filters', getFilterCompletions(liquid.standard.filters));
      }

      if (this.completion.enable.includes) {
        this.completion.items.set('snippets', getFileCompletions(this.files.includes));
      }
    }

  }

}
