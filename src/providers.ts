import { q, liquid, Engine } from '@liquify/liquid-language-specs';
import { JSONLanguageService } from 'service/JsonLanguageService';
import { HoverProvider } from 'providers/HoverProvider';
import { CompletionProvider } from 'providers/CompletionProvider';
import { State } from 'state';
import { entries } from 'utils';
import { CompletionItemKind } from 'vscode';
import {
  getFilterCompletions,
  getLogicalCompletions,
  getObjectCompletions,
  getObjectKind,
  getTagCompletions
} from 'parse/tokens';

export class Providers extends State {

  /**
   * JSON Language Service Instance
   */
  public jsonService: JSONLanguageService;

  /**
   * Completion Provider Instance
   */
  public provide: {
    /**
     * Hover Provider closure
     */
    hovers?: ReturnType< typeof HoverProvider>;
    /**
     * Completion Provider closure
     */
    completions?: ReturnType< typeof CompletionProvider>;

  } = {};

  setService () {

    this.jsonService = new JSONLanguageService();

  }

  /**
   * Set Completions
   */
  setCompletions () {

    if (this.engine === 'shopify') q.setEngine(Engine.shopify);

    this.complete.logical = getLogicalCompletions();

    if (this.canComplete.tags) {
      this.complete.tags = entries(liquid.shopify.tags).map(getTagCompletions);
    }

    if (this.canComplete.filters) {
      this.complete.filters = entries(liquid.shopify.filters).map(getFilterCompletions);
    }

    if (this.canComplete.objects) {
      this.complete.objects = entries(liquid.shopify.objects).map(getObjectCompletions);
      this.complete.common = getObjectKind(this.complete.objects, [
        CompletionItemKind.Module
      ]);
    }

    this.provide.completions = CompletionProvider(
      this.canComplete,
      this.complete,
      this.jsonService
    );
  }

  setHovers () {

    this.provide.hovers = HoverProvider(
      this.canHover,
      this.jsonService
    );
  }

}
