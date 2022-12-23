/* eslint-disable no-unused-vars */
import { Options } from '@liquify/prettify';
import { Tester } from 'anymatch';
import { LanguageIds } from './document';
import { Config, Status } from './enums';
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

/**
 * Deprecation Actions
 */
export interface Deprecations {
  /**
   * Whether or not a deprecation was detected.
   */
  detected: boolean;
  /**
   * The version which the breaking change was detected.
   */
  version: string;

}

export interface DeprecationIssues {

  [version: string]: {
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

/**
 * External Files
 *
 * The generated data values from the files array.
 */
export interface Files {
  /**
   * Locales URI Path
   */
  locales: Uri;
  /**
   * Settings (`settings_data.json`) file path
   */
  settings: Uri;
  /**
   * Sections directories
   */
  sections: Uri[];
  /**
   * Snippets directories
   */
  snippets: Uri[];
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
  /**
   * Settings Completions
   */
  settings: {
    /**
     * The path of the locale file.
     */
    file: string;
    /**
     * Completion Items for locales
     */
    items: object;
  }
  /**
   * Locale Completions
   */
  locales: {
    /**
     * The path of the locale file.
     */
    file: string;
    /**
     * Completion Items for locales
     */
    items: object;
  }
}

export interface URI {
  /**
   * Returns the rootPath of the workspace
   */
  root?: string;
  /**
   * URI path to the `.liquidrc` file
   */
  liquidrc?: string;
  /**
   * URI path to the `package.json` file
   */
  package?: string;
}

export interface Store {
  /**
   * The extension configuration method being used
   */
  config: Config;
  /**
   * The current status
   */
  status: Status;
  /**
   * The workspace target
   */
  target: ConfigurationTarget;
  /**
   * Anymatch pattern for ignored paths
   */
  ignore: Tester;
  /**
   * The current formatting rules
   */
  prettify: Options;
  /**
   * Set list of the default languages we apply formatting to
   */
  languages: { [K in LanguageIds]: boolean };
  /**
   * Whether or not formatting is enabled
   *
   * @default false
   */
  isEnabled: boolean;
  /**
   * Whether or not the extension has initialized
   *
   * @default false
   */
  isReady: boolean;
  /**
   * Whether or not the file system watcher is running
   *
   * @default false
   */
  isWatching: boolean;
  /**
   * Whether the extension is in a state of loading
   *
   * @default false
   */
  isLoading: boolean;
  /**
   * Whether or not the invoked action was a command
   *
   * @default false
   */
  isCommand: boolean;
  /**
   * Whether or not a watched file has changed
   */
  hasChanged: boolean;
  /**
   * Whether or not an error has occured
   */
  hasError: boolean;
  /**
   * Whether or not a warning has occured
   */
  hasWarning: boolean;
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
