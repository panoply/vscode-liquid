/* eslint-disable no-unused-vars */
/* -------------------------------------------- */
/* ENUMS                                        */
/* -------------------------------------------- */

import { Options } from '@liquify/prettify';
import { LiteralUnion, Merge } from 'type-fest';

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
   * Loading icon in the status bar
   */
  Loading,
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
export const enum EXTSettings {
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
 * IN Language IDs for assigning the default
 * formatter.
 */
export type INLanguageIDs = LiteralUnion<(
  | '[html]'
  | '[liquid]'
  | '[json]'
  | '[css]'
  | '[scss]'
), string>

/**
 * Accepted Language IDs
 */
export type LanguageIDs = LiteralUnion<(
  | 'html'
  | 'liquid'
  | 'json'
  | 'jsonc'
  | 'liquid-javascript'
  | 'liquid-css'
  | 'liquid-scss'
  | 'liquid-json'
), string>

export namespace Workspace {

  /**
   * `liquid.enable`
   *
   * The accepted value of the enable option
   */
  export type Enable = boolean;

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
   * `liquid.validate.*`
   *
   * The accepted settings validation option
   */
  export interface Validate {
    /**
     * Validates JSON content and files
     *
     * @default true
     */
    json?: boolean;
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
     * The value of `liquid.format.languages`
     *
     * @default true
     */
    languages?: string[];
    /**
     * The string list of paths to ignore
     *
     * @default []
     */
    ignore?: string[];
  }>

  /**
   * `liquid.*`
   *
   * The Liquid workspace configuration
   */
  export interface Liquid {
    enable?: Enable;
    settings?: Settings;
    validate?: Validate;
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
  /**
   * The value of `liquid.format.languages`
   *
   * @default true
   */
  languages?: string[];
}>
