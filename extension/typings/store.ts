/* eslint-disable no-unused-vars */
import { Rules } from 'esthetic';
import { Tester } from 'anymatch';
import { ConfigMethod, ConfigSource, Setting } from './enums';
import {
  CompletionItem,
  ConfigurationTarget,
  Disposable,
  FileSystemWatcher,
  OutputChannel,
  StatusBarItem,
  TextEdit,
  Uri
} from 'vscode';
import { LiteralUnion } from 'type-fest';

export interface DeprecationIssues {

  [version: string]: {
    /**
     * Workspace
     */
    all: {
      /**
       * Whether or not the issue can be autofixed
       */
      autofix: boolean;
      /**
       * A short message describing the issue
       */
      message: string;
      /**
       * A longer form description of the deprecation
       */
      details: string;
      /**
       * Link to the release notes (changelog)
       */
      changelog: string;
    };
    /**
     * Workspace
     */
    workspace: {
      /**
       * Whether or not the issue can be autofixed
       */
      autofix: boolean;
      /**
       * A short message describing the issue
       */
      message: string;
      /**
       * A longer form description of the deprecation
       */
      details: string;
      /**
       * Link to the release notes (changelog)
       */
      changelog: string;
    };
    /**
     * Liquidrc File
     */
    liquidrc: {
      /**
       * Whether or not the issue can be autofixed
       */
      autofix: boolean;
      /**
       * A short message describing the issue
       */
      message: string;
      /**
       * A longer form description of the deprecation
       */
      details: string;
      /**
       * Link to the release notes (changelog)
       */
      changelog: string;
    }
  }
}

export interface Meta {
  /**
   * Release Notes URI
   */
  releaseNotes: Uri;
  /**
   * The Æsthetic version used in the extension.
   */
  estheticVersion: string;
  /**
   * The current extension version
   */
  version: string;
  /**
   * The extension unique id, ie: `sissel.shopify-liquid`
   */
  id: string;
  /**
   * The marketplace display name, ie: `Liquid`
   */
  displayName: string;
  /**
   * The project name, ie: `vscode-liquid`
   */
  projectName: string;
  /**
   * The repository URL, ieG: `https://github.com/panoply/vscode-liquid`
   */
  repository: string;
}

export interface Config {
  /**
   * The vscode workspace configuration target
   *
   * @default ConfigurationTarget.Global
   */
  target: ConfigurationTarget;
  /**
   * The inspection scope to use.
   *
   * @default 'globalValue'
   */
  inspect: 'globalValue' | 'workspaceValue' | 'defaultValue'
  /**
   * The configuration method being used
   *
   * @default ConfigMethod.Undefined
   */
  method: ConfigMethod;
  /**
   * The configuration sources
   */
  sources: {
    /**
     * File Sources
     */
    files: { [file: string]: ConfigMethod; }
    /**
     * Setting Sources
     */
    setting: { [setting: string]: ConfigSource; }
  }
}

/* -------------------------------------------- */
/* FORMAT MODEL                                 */
/* -------------------------------------------- */

export interface Format {
  /**
   * Hard reference to ignored paths
   */
  ignoreList: string[];
  /**
   * Anymatch pattern for ignored paths
   */
  ignoreMatch: Tester;
  /**
   * Set list of `fsPath` URI ignored paths
   */
  ignored: Set<string>;
  /**
   * Set list of `fsPath` URI paths
   */
  register: Set<string>;
  /**
    * The formatting handler
    */
  handler: Disposable;
  /**
   * The current formatting rules
   */
  rules: Rules;

}

/* -------------------------------------------- */
/* VARIABLES                                    */
/* -------------------------------------------- */

export interface Variables {

}

/* -------------------------------------------- */
/* MODELS                                       */
/* -------------------------------------------- */

export interface Completions {
  /**
  * An additional text edit to be passed to the resolver
  */
  textEdit: TextEdit[];
  /**
   * Tag Completions
   */
  tags: CompletionItem[];
  /**
   * Logical Operator Completions
   */
  logical: CompletionItem[];
  /**
   * Filter Completions
   */
  filters: CompletionItem[];
  /**
   * Object Completions
   */
  objects: CompletionItem[];
  /**
   * Common Objects Completions
   */
  common: CompletionItem[];
  /**
   * Snippet file Completions
   */
  snippets: CompletionItem[];
  /**
   * Sections file Completions
   */
  sections: CompletionItem[];
}

export namespace Files {

  export type Keys = LiteralUnion<
  | 'locales'
  | 'locales_schema'
  | 'shared_schema'
  | 'settings_schema'
  | 'snippets'
  | 'sections'
  | 'section_groups'
  , string>

  /**
   * Shopify specific file URI records
   */
  export interface Shopify {
    /**
     * Locales URI Path
     */
    locales: Uri;
    /**
     * An automated resolve of a locales schema file.
     */
    localeSchema: Uri;
    /**
     * Settings (`settings_schema.json`) file path
     */
    settings: Uri;
    /**
     * Syncify Schema file URIs
     */
    sharedSchema: Set<string>;
    /**
    * Sections directories
    */
    sections: Set<Uri>;
    /**
    * Sections directories
    */
    sectionGroups: Set<Uri>;
    /**
     * Snippets directories
     */
    snippets: Set<Uri>;

  }

  /**
   * Eleventy specific file URI records
   */
  export interface Jekyll {
    /**
    * Settings (`settings_data.json`) file path
    */
    data: Set<Uri>;
    /**
    * Include directories
    */
    includes: Set<Uri>;
    /**
     * Layouts directories
     */
    layouts: Set<Uri>;
    /**
     * Collections directories
     */
    collectons: Set<Uri>;
  }

  /**
   * Eleventy specific file URI records
   */
  export interface Eleventy {
    /**
    * Settings (`settings_data.json`) file path
    */
    data: Set<Uri>;
    /**
    * Include directories
    */
    includes: Set<Uri>;
    /**
     * Layouts directories
     */
    layouts: Set<Uri>;
    /**
     * Collections directories
     */
    collections: Set<Uri>;
    /**
     * Frontmatter
     */
    frontmatter: Set<Uri>;
  }
}

export interface URI {
  /**
   * Returns the base path directory Uri reference according to `liquid.config.baseDir`
   */
  base?: Uri;
  /**
   * Returns the root uri of the workspace
   */
  root?: Uri;
  /**
   * Returns the `.env` file path,
   */
  env?: Uri;
  /**
   * URI path to the `.liquidrc` file
   */
  liquidrc?: Uri;
  /**
   * Returns the projects `.vscode/settings.json` workspace uri.
   */
  workspace?: Uri;
  /**
   * Files
   *
   * The generated data values from the files array.
   */
  files: {
    /**
     * Shopify specific file URI records
     */
    shopify: Files.Shopify;
    /**
     * Eleventy secific file URI records;
     */
    '11ty': Files.Eleventy;
    /**
     * Jekyll secific file URI records;
     */
    jekyll: Files.Jekyll;
  }
}

export interface UI {
  /**
   * The status bar item
   */
  status: StatusBarItem;
  /**
   * The output channel instance
   */
  channel: OutputChannel;

}

export interface Editor {
  /**
   * The extension configuration method being used
   */
  watchers: FileSystemWatcher[]
  /**
   * Returns the current document disposable
   */
  provider: Disposable;
}
