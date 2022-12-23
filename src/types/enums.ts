/* eslint-disable no-unused-vars */

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
  JSON = 1
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
