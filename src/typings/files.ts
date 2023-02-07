import { Engines } from '@liquify/liquid-language-specs';
import { Rules } from 'esthetic';
import { Merge } from 'type-fest';

/**
 * Liquidrc and Prettify package field
 *
 * The extended Prettify rules available to
 * the `.liquidrc` and `prettify` field.
 *
 * > **NOTE** Some rules are omitted from this
 */
export interface Liquidrc {
  /**
   * Liquid Engine Reference
   */
  engine?: Engines;
  /**
   * File references
   */
  files?: {
    /**
     * Reference to the `*.default.json` Shopify locale file.
     */
    locales?: string;
    /**
     * Reference to the `settings_data.json` Shopify file
     */
    settings?: string;
    /**
     * Reference to directory or files used as snippets.
     */
    snippets?: string[];
    /**
     * Reference to directory of files used as sections.
     */
    sections?: string[];
  };

  /**
   * Prettify formatting options
   */
  format?: Merge<Rules, {
    /**
     * The string list of paths to ignore
     */
    ignore?: string[];

  }>
}

/**
 * Extension Package.json
 */
export interface PackageJSON {
  /**
   * The official name of extension
   */
  name: string;
  /**
   * The display name of extension
   */
  displayName: string;
  /**
   * The extension version field
   */
  version: string;
  /**
   * The repository field
   */
  repository: {
    /**
     * The github repository URL
     */
    url: string;
  }
  /**
   * The extension dependencies - Used to obtain prettify version
   */
  dependencies: {
    '@liquify/prettify': string;
  }
}

/**
 * Shopify Locales
 */
export interface ILocales {

  [property: string]: object

}
