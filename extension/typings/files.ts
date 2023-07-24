import { Engines } from '@liquify/specs';
import { Rules } from 'esthetic';
import { Merge } from 'type-fest';

/**
 * 11ty File paths
 */
export interface EleventyFiles {
  /**
   * **11ty**
   *
   * Reference to the `data` files
   */
  data?: string[];
  /**
   * **11ty**
   *
   * Reference to the `includes` files
   */
  includes?: string[];
  /**
   * **11ty**
   *
   * Reference to layouts
   */
  layouts?: string[];
}

/**
 * Jekyll File paths
 */
export interface JekyllFiles {
  /**
   * **Jekyll**
   *
   * Reference to the `posts` files
   */
  posts?: string[];
  /**
   * **11ty**
   *
   * Reference to the `collections` files
   */
  collections?: string[];
  /**
   * **11ty**
   *
   * Reference to the `includes` files
   */
  includes?: string[];
}

/**
 * Shopify File paths
 */
export interface ShopifyFiles {
  /**
   * **Shopify**
   *
   * Reference to the `*.default.json` Shopify locale file.
   */
  locales?: string;
  /**
   * **Shopify**
   *
   * Reference to the `settings_data.json` Shopify file
   */
  settings?: string;
  /**
   * **Shopify**
   *
   * Reference to directory or files used as snippets.
   */
  snippets?: string[];
  /**
   * **Shopify**
   *
   * Reference to directory of files used as sections.
   */
  sections?: string[];
}

/**
 * Liquidrc and Æsthetic package field
 *
 * The extended Prettify rules available to
 * the `.liquidrc` and `esthetic`, `æsthetic` or `aesthetic` field.
 *
 * > **NOTE** Some rules are omitted from this
 */
export interface Liquidrc {
  /**
   * Liquid Engine Reference
   */
  engine?: Engines | '11ty';
  /**
   * File references
   */
  files?: EleventyFiles | ShopifyFiles

  /**
   * Æsthetic formatting options
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
    'esthetic': string;
  }
}

/**
 * Shopify Locales
 */
export interface ILocales {

  [property: string]: object

}
