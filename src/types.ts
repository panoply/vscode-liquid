/* eslint-disable no-unused-vars */

import { Options } from '@liquify/prettify';
import { Tester } from 'anymatch';
import { LiteralUnion, Merge } from 'type-fest';
import { ConfigurationTarget, Disposable, FileSystemWatcher, OutputChannel, StatusBarItem } from 'vscode';

/* -------------------------------------------- */
/* ENUMS                                        */
/* -------------------------------------------- */

/**
 * Output State
 *
 * Used to control the output state
 */
export const enum OutputState {
  /**
   * Output is closed
   */
  Closed = 1,
  /**
   * Output was opened
   */
  Opened
}

/**
 * Watch Events
 *
 * Informs upon the file watch event that was invoked
 */
export const enum WatchEvents {
  /**
   * File created
   */
  Create = 1,
  /**
   * File change
   */
  Change,
  /**
   * File deletion
   */
  Delete
}

/**
 * Configuration Type
 *
 * Informs upon the configuration type being used
 */
export const enum Config {
  /**
   * Using a `.liquidrc` file
   */
  Liquidrc = 1,
  /**
   * Using a `prettify` field in package.json
   */
  Package,
  /**
   * Using workspace settings ie: `.vscode/settings.json`
   */
  Workspace
}

export const enum Status {
  /**
   * Formatting and extension is enabled
   */
  Enabled = 1,
  /**
   * Formatting is disabled
   */
  Disabled,
  /**
   * File is excluded/ignored from formatting
   */
  Ignored,
  /**
   * Formatting or extension error was detected
   */
  Error,
  /**
   * The status bar item is a warning
   */
  Warning,
  /**
   * Loading icon in the status bar
   */
  Loading,
  /**
   * The status bar item is hidden
   */
  Hidden,
  /**
   * Upgrade notification
   */
  Upgrade
}

/**
 * Extension Settings
 *
 * This enum is used to determine how configuration
 * files are setup in the users workspace.
 */
export const enum Setting {
  /**
   * Using Deprecated Workspace settings
   */
  DeprecatedWorkspaceSettings = 1,
  /**
   * Using Deprecated Liquidrc settings
   */
  DeprecatedLiquidrc,
  /**
   * Workspace Settings are not defined
   */
  WorkspaceUndefined,
  /**
   * Workspace Settings are defined
   */
  WorkspaceDefined,
  /**
   * Liquidrc file encountered an error
   */
  LiquidrcError,
  /**
   * No Liquidrc file is present
   */
  LiquidrcUndefined,
  /**
   * Liquidrc file is present but with invalid rules
   */
  LiquidrcInvalidRules,
  /**
   * Liquidrc file is present
   */
  LiquidrcDefined,
  /**
   * The package.json file does not exist
   */
  PackageJsonUndefined,
  /**
   * The package.json file had a parse error
   */
  PackageJsonError,
  /**
   * Prettify Field in package.json is not present
   */
  PrettifyFieldUndefined,
  /**
   * Prettify Field in package.json is defined
   */
  PrettifyFieldDefined,
  /**
   * Prettify Field in package.json is but with invalid rules
   */
  PrettifyFieldInvalid,
  /**
   * No configuration is defined
   */
  ConfigurationUndefined,
}

/* -------------------------------------------- */
/* TYPES                                        */
/* -------------------------------------------- */

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
 * Accepted Language IDs
 */
export type LanguageIds = LiteralUnion<(
  | 'liquid'
  | 'liquid-javascript'
  | 'liquid-css'
  | 'liquid-scss'
  | 'xml'
  | 'html'
  | 'json'
  | 'jsonc'
  | 'css'
  | 'sass'
  | 'scss'
  | 'less'
  | 'jsx'
  | 'tsx'
  | 'javascript'
  | 'typescript'
  | 'yaml'
), string>

/**
 * IN Language IDs for assigning the default
 * formatter.
 */
export type InLanguageIds = LiteralUnion<(
  | '[liquid]'
  | '[liquid-javascript]'
  | '[liquid-css]'
  | '[liquid-scss]'
  | '[xml]'
  | '[html]'
  | '[json]'
  | '[jsonc]'
  | '[css]'
  | '[sass]'
  | '[scss]'
  | '[less]'
  | '[jsx]'
  | '[tsx]'
  | '[javascript]'
  | '[typescript]'
  | '[yaml]'
), string>

export namespace Workspace {

  /**
   * `liquid.settings.target`
   *
   * The accepted values of the settings target
   */
  export type Target = 'workspace' | 'user';

  /**
   * `liquid.settings.*`
   *
   * The accepted options for the settings option
   */
  export interface Settings {
    /**
     * The Liquid settings target
     *
     * @default 'workspace'
     */
    target?: Target
  }

  /**
   * `liquid.format.*`
   *
   * The accepted format options
   */
  export type Format = Merge<Options, {
    /**
     * The value of `liquid.format.enable`
     *
     * @default true
     */
    enable?: boolean;
    /**
     * The string list of paths to ignore
     *
     * @default []
     */
    ignore?: string[];
  }>

  /**
   * `liquid.format.*`
   *
   * Props as array list
   */
  export type FormatPropsList = Array<keyof Format>

  /**
   * `liquid.*`
   *
   * The Liquid workspace configuration
   */
  export interface Liquid {
    enable?: boolean;
    settings?: Settings;
    format?: Format
  }
}

/**
 * Liquidrc and Prettify package field
 *
 * The extended Prettify rules available to
 * the `.liquidrc` and `prettify` field.
 *
 * > **NOTE** Some rules are omitted from this
 */
export type Liquidrc = Merge<Options, {
  /**
   * The string list of paths to ignore
   */
  ignore?: string[];
}>

/* -------------------------------------------- */
/* MODELS                                       */
/* -------------------------------------------- */

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
