/* eslint-disable no-unused-vars */

/* -------------------------------------------- */
/* PARSE RELATED                                */
/* -------------------------------------------- */

/**
 * Token Type
 *
 * Used to infer the _type_ of token we are working with.
 * Used for completions and parse logics.
 */
export const enum Token {
  /**
   * Liquid Tag
   */
  Tag = 1,
  /**
   * Liquid Object
   */
  Object,
  /**
   * Liquid Object
   */
  Property,
  /**
   * Liquid Filter
   */
  Filter,
  /**
   * Liquid Parameter
   */
  Param,
  /**
   * Liquid Settings Data Object
   */
  Settings,
  /**
   * Liquid Locale
   */
  Locale,
  /**
   * Liquid Logical operators
   */
  Logical,
  /**
   * Liquid Schema Block Type
   */
  Block
}

/**
 * Character Codes
 *
 * The character codes used for matching in parse logics.
 */
export const enum Char {
  /**
   * `%`
   */
  PER = 37,
  /**
   * `{`
   */
  LCB = 123,
  /**
   * `}`
   */
  RCB = 125,
  /**
   * `<`
   */
  LAN = 60,
  /**
   * `>`
   */
  RAN = 62,
  /**
   * `=`
   */
  EQL = 61,
  /**
   * `|`
   */
  PIP = 124,
  /**
   * `:`
   */
  COL = 58,
  /**
   * `-`
   */
  DSH = 45,
  /**
   * `.`
   */
  DOT = 46,
  /**
   * `"`
   */
  DQO = 34,
  /**
   * `'`
   */
  SQO = 39,
  /**
   * `[`
   */
  LSB = 91,
  /**
   * ` `
   */
  WSP = 32,
}

/* -------------------------------------------- */
/* ENUMS                                        */
/* -------------------------------------------- */

/**
 * Language Services
 *
 * Used to set and control Language Services
 */
export const enum Services {
  /**
   * JSON Language Service
   */
  JSON = 1,
  /**
   * CSS Language Service
   *
   * **NOT YET AVAILABLE**
   */
  CSS = 2
}

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
export const enum LanguageParticipant {
  /**
   * Always, this is standard for all Liquid languages supported by the
   * extension, which are as follows:
   *
   * - `liquid`
   * - `liquid-css`
   * - `liquid-scss`
   * - `liquid-javascript`
   *
   * These language ids will never be set to `Determine` or `Disabled`
   * and are controllers of the status bar item.
   */
  Active = 1,
  /**
   * Determine, this is for languages which _might_ be related
   * to Liquid projects, typically for languages which have defined
   * the `editor.defaultFormatter` to `sissel.shopify-liquid`
   */
  Determine,
  /**
   * Disabled languages, this is not final and can change, but
   * requires explicit definition of `editor.defaultFormatter`
   * to be define
   */
  Disabled,

}

/**
 * Configuration Type
 *
 * Informs upon the configuration type being used
 */
export const enum ConfigMethod {
  /**
   * The initial value, when no method one will be determined.
   * based on the project structure, ie: if `.liquidrc` exists
   * then the method will be Liquidrc else it will be Workspace.
   */
  Undefined = 1,
  /**
   * Using a `.liquidrc` file
   */
  Liquidrc,
  /**
   * Using workspace settings ie: `.vscode/settings.json`
   */
  Workspace
}

export const enum StatusItem {
  /**
   * Formatting and extension is enabled
   */
  Enabled = 1,
  /**
   * Formatting `formatOnSave` is set to `false`
   */
  Disabled,
  /**
   * Formatter is not the default
   */
  NotDefault,
  /**
   * File is excluded/ignored from formatting
   */
  Ignoring,
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
  LiquidrcExists,
  /**
   * Liquidrc file is present
   */
  LiquidrcDefined,
  /**
   * No configuration is defined
   */
  ConfigurationUndefined,
  /**
   * Liquidrc File exists but config method is Workspace on `liquid.config.method`
   */
  MethodWorkspace,
  /**
   * Using the default method of liquidrc on `liquid.config.method`
   */
  MethodLiquidrcDefault
}
