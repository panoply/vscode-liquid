import { Engines } from '@liquify/specs';
import { Rules } from 'esthetic';
import type { EleventyFiles, ShopifyFiles } from './files';

export namespace Workspace {

  /**
   * `liquid.config.*`
   *
   * The accepted values relating to configuration.
   */
  export type Config = {
    /**
     * The configuration method to use
     *
     * @default 'liquidrc'
     */
    method: 'workspace' | 'liquidrc';
    /**
     * The base URL location of the `.liquidrc` file
     *
     * @default '.'
     */
    baseUrl: string;
  }

  /**
   * `liquid.engine`
   *
   * The Liquid variation engine
   */
  export type Engine = Engines;

  /**
   * `liquid.completion.*`
   *
   * The accepted options for completions
   */
  export interface Completion {
    /**
     * Whether or not tag completions are enabled
     *
     * - Standard
     * - Shopify
     * - Jekyll
     * - Eleventy
     *
     * @default true
     */
    tags: boolean;
    /**
     * Whether or not operator completions are enabled
     *
     * - Standard
     * - Shopify
     * - Jekyll
     * - Eleventy
     *
     * @default true
     */
    operators: boolean;
    /**
     * Whether or not filter completions are enabled
     *
     * - Standard
     * - Shopify
     * - Jekyll
     * - Eleventy
     *
     * @default true
     */
    filters: boolean;
    /**
     * Whether or not object completions are enabled
     *
     * - Shopify
     * - Jekyll
     * - Eleventy
     *
     * @default true
     */
    objects: boolean;
    /**
     * Whether or not section schema completions are enabled
     *
     * - Shopify
     *
     * @default true
     */
    schema: boolean;
    /**
     * Whether or not locale file completions are enabled
     *
     * - Shopify
     *
     * @default true
     */
    locales: boolean;
    /**
     * Whether or not `settings_data.json` file completions are enabled
     *
     * - Shopify
     *
     * @default true
     */
    settings: boolean;
    /**
     * Whether or not `snippet` file completions are enabled
     *
     * - Shopify
     *
     * @default true
     */
    snippets: boolean;
    /**
     * Whether or not `_include` file completions are enabled
     *
     * - Jekyll
     * - Eleventy
     *
     * @default true
     */
    includes: boolean;
    /**
     * Whether or not `section` file completions are enabled
     *
     * - Shopify
     *
     * @default true
     */
    sections: boolean;
    /**
     * Whether or not to variable completions are enabled
     *
     * - Standard
     * - Shopify
     * - Jekyll
     * - Eleventy
     *
     * @default true
     */
    variables: boolean;
    /**
     * Whether or not data file completions are enabled
     *
     * - Jekyll
     * - Eleventy
     *
     * @default true
     */
    data: boolean;
    /**
     * Whether or not frontmatter completions are enabled
     *
     * - Jekyll
     * - Eleventy
     *
     * @default true
     */
    frontmatter: boolean;
  }

  /**
   * `liquid.hover.*`
   *
   * The accepted options for hovers
   */
  export interface Hover {
    /**
     * The value of `liquid.hover.tags`
     *
     * @default 'true'
     */
    tags?: boolean;
    /**
     * The value of `liquid.hover.filters`
     *
     * @default 'true'
     */
    filters?: boolean;
    /**
     * The value of `liquid.hover.objects`
     *
     * @default 'true'
     */
    objects?: boolean;
    /**
     * The value of `liquid.hover.schema`
     *
     * @default 'true'
     */
    schema?: boolean;
  }

  /**
   * `liquid.files.*`
   *
   * Project file paths
   */
  export interface Files {
    /**
     * 11ty Files
     */
    '11ty'?: EleventyFiles;
    /**
     * Shopify Files
     */
    shopify?: ShopifyFiles;
  }

  /**
   * `liquid.validate.*`
   *
   * The accepted options for validate
   */
  export interface Validate {
    /**
     * The value of `liquid.validate.schema`
     *
     * @default 'true'
     */
    schema?: boolean;

  }

  /**
   * `liquid.format.*`
   *
   * The accepted format options
   */
  export interface Format {
    /**
     * The string list of paths to ignore
     *
     * @default []
     */
    ignore?: string[];
    /**
     * The formatting rules for Prettify
     */
    rules?: Rules
  }

}
