import { FormattingProvider } from './providers/FormattingProvider';
import { CompletionProvider } from './providers/CompletionProvider';
import { DocumentLinkProvider } from './providers/DocumentLinkProvider';
import { HoverProvider } from './providers/HoverProvider';
import { CodeLensProvider } from './providers/CodeLensProvider';
import { Engine, liquid, q } from '@liquify/liquid-language-specs';
import { CompletionItemKind } from 'vscode';
import { entries, parseJsonFile } from './utils';
import { operators } from './completions/helpers/operators';
import {
  getFilterCompletions,
  getItemKind,
  getOperatorCompletions,
  getObjectCompletions,
  getFileCompletions,
  getSchemaCompletions,
  getTagCompletions
} from './lexical/tags';
import { Extension } from './extension';

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
   * Get Completions
   */
  async getContext () {

    if (this.engine === 'shopify') {

      q.setEngine(Engine.shopify);

      if (this.completion.enable.operators) {
        this.completion.items.set('operators', getOperatorCompletions(operators));
      }

      if (this.completion.enable.tags) {
        this.completion.items.set('tags', getTagCompletions(liquid.shopify.tags));
      }

      if (this.completion.enable.filters) {
        this.completion.items.set('filters', getFilterCompletions(liquid.shopify.filters));
      }

      if (this.completion.enable.objects) {
        this.completion.items.set('objects', getObjectCompletions(liquid.shopify.objects));
      }

      if (this.completion.enable.snippets) {
        this.completion.items.set('snippets', getFileCompletions(this.files.snippets));
      }

      if (this.completion.enable.sections) {
        this.completion.items.set('sections', getFileCompletions(this.files.sections));
      }

    }
  }

  /**
   * Generate Data
   *
   * Constructs and generates data references used in providers
   */
  // async getContexts () {

  //   if (this.engine === 'shopify') {

  //     q.setEngine(Engine.shopify);

  //     if (this.uri.files.locales !== null) {

  //       const items = await parseJsonFile(this.uri.files.locales);

  //       if (items !== null) {
  //         this.completion.files.locales.items = items;
  //         this.completion.files.locales.path = this.uri.files.locales.fsPath;
  //       }
  //     }

  //     if (this.uri.files.settings !== null) {
  //       this.completion.files.settings = await parseJsonFile(this.uri.files.settings);
  //     }

  //     if (this.completion.enable.logical) {
  //       this.completion.items.logical = getLogicalCompletions();
  //     }

  //     if (this.completion.enable.tags) {
  //       this.completion.items.tags = entries(liquid.shopify.tags).map(getTagCompletions);
  //     }

  //     if (this.completion.enable.filters) {
  //       this.completion.items.filters = entries(liquid.shopify.filters).map(getFilterCompletions);
  //     }

  //     if (this.completion.enable.objects) {
  //       this.completion.items.objects = entries(liquid.shopify.objects).map(getObjectCompletions);
  //       this.completion.items.common = getObjectKind(this.completion.items.objects, [ CompletionItemKind.Module ]);
  //     }

  //   }

  // }

}
