/* eslint-disable no-unused-vars */

import { Engines } from '@liquify/liquid-language-specs';
import { Options } from '@liquify/prettify';
import { Tester } from 'anymatch';
import { LiteralUnion, Merge } from 'type-fest';
import {
  CompletionItem,
  ConfigurationTarget,
  Disposable,
  FileSystemWatcher,
  OutputChannel,
  Position,
  StatusBarItem,
  TextDocument,
  TextEdit
} from 'vscode';

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
), string>

/**
 * Language document selectors
 */
export interface Selectors {
  /**
   * Liquid Language Selectors
   */
  active: Array<{
    scheme: 'file';
    language: LiteralUnion<(
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
    ), string>
  }>
  /**
   * Liquid Language Selectors
   */
  liquid: Array<{
    scheme: 'file';
    language:
    | 'liquid'
    | 'liquid-javascript'
    | 'liquid-css'
    | 'liquid-scss'
  }>
  /**
   * Extended Language Selectors
   */
  extend: Array<{
    scheme: 'file';
    language:
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
  }>
}

export namespace Workspace {

  /**
   * `liquid.settings.target`
   *
   * The accepted values of the settings target
   */
  export type Target = 'workspace' | 'user';

  /**
   * `liquid.engine`
   *
   * The Liquid variation engine
   */
  export type Engine = Engines;

  /**
   * `liquid.completions.*`
   *
   * The accepted options for completions
   */
  export interface Completion {
    /**
     * Whether or not tag completions are enabled
     *
     * @default true
     */
    tags?: boolean;
    /**
     * Whether or not filter completions are enabled
     *
     * @default true
     */
    filters?: boolean;
    /**
     * Whether or not logical completions are enabled
     *
     * @default true
     */
    logical?: boolean;
    /**
     * Whether or not object completions are enabled
     *
     * @default true
     */
    objects?: boolean;
    /**
     * Whether or not control flow operators are enabled
     *
     * @default true
     */
    operators?: boolean;
    /**
     * Whether or not section object completions are enabled
     *
     * @default true
     */
    section?: boolean;
    /**
     * Whether or not schema tag JSON completions are enabled
     *
     * @default true
     */
    schema?: boolean;
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

/* -------------------------------------------- */
/* SHOPIFY SCHEMA TAGS                          */
/* -------------------------------------------- */

export interface SchemaRegion {
  /**
   * The parse position
   */
  readonly position: Position;
  /**
   * The portion text document
   */
  readonly textDocument: TextDocument;
}

export interface SchemaPreset {

}

export interface SchemaDefault extends SchemaPreset {

}

declare type SchemaBasicInputSettings = (
  | 'checkbox'
  | 'number'
  | 'radio'
  | 'range'
  | 'select'
  | 'text'
  | 'textarea'
)

declare type SchemaSpecializedInputSettings = (
  | 'article'
  | 'blog'
  | 'collection'
  | 'collection_list'
  | 'color'
  | 'color_background'
  | 'font_picker'
  | 'html'
  | 'image_picker'
  | 'inline_richtext'
  | 'link_list'
  | 'liquid'
  | 'page'
  | 'product'
  | 'product_list'
  | 'richtext'
  | 'url'
  | 'video'
  | 'video_url'
)

export type SchemaSettingTypes = SchemaBasicInputSettings | SchemaSpecializedInputSettings

export namespace Schema {

  export interface Common<T extends SchemaSettingTypes> {
    /**
     * The setting type, which can be any of the basic or specialized input setting types.
     */
    type: T;
    /**
     * The setting ID, which is used to access the setting value.
     */
    id: string;
    /**
     * The setting label, which will show in the theme editor.
     */
    label: string;
    /**
     * An option for informational text about the setting.
     */
    info?: string;
  }

  export interface Number extends Common<'number'> {
    /**
     * The default value for the setting.
     */
    default?: number;
    /**
     * A placeholder value for the input.
     *
     * These values only appear for settings defined in settings_schema.json.
     * They don't appear for settings defined in a section's schema.
     */
    placeholder?: number;
  }

  export interface Checkbox extends Common<'checkbox'> {
    /**
     * The default value for the setting.
     */
    default?: boolean;
  }

  export interface Radio extends Common<'radio'> {
    /**
     * An array of value and label definitions
     */
    options: Array<{ value: string; label: string; }>
    /**
     * The default value for the setting.
     */
    default?: string;
  }

  export interface Range extends Common<'range'> {
    /**
     * The minimum value of the input
     */
    min: number;
    /**
     * The maximum value of the input
     */
    max: number;
    /**
     * The increment size between steps of the slider
     */
    step: number;
    /**
     * The unit for the input. For example, you can set `px` for a font-size slider.
     */
    unit?: string;
    /**
     * The default value for the setting.
     */
    default?: number;
  }

  export interface Select extends Common<'select'> {
    /**
     * Takes an array of value/label definitions for each option in the drop-down.
     */
    options: Array<{
      value: string;
      label: string;
      /**
       * An optional attribute you can add to each option to create
       * option groups in the drop-down.
       */
      group?: string;
    }>
    /**
      * The default value for the setting.
      */
    default?: string;
  }

  export interface Text extends Common<'text'> {
    /**
     * A placeholder value for the input.
     *
     * These values only appear for settings defined in settings_schema.json.
     * They don't appear for settings defined in a section's schema.
     */
    placeholder?: string;
    /**
     * The default value for the setting.
     */
    default?: string;
  }

  export interface Textarea extends Common<'text'> {
    /**
     * A placeholder value for the input.
     *
     * These values only appear for settings defined in settings_schema.json.
     * They don't appear for settings defined in a section's schema.
     */
    placeholder?: string;
    /**
     * The default value for the setting.
     */
    default?: string;
  }

  /**
   * Returns the `article` object.
   */
  export interface Article extends Common<'article'> {}

  /**
   * Returns the `blog` object.
   */
  export interface Blog extends Common<'blog'> {}

  /**
   * Returns the `collection` object.
   */
  export interface Collection extends Common<'collection'> {}

  /**
   * Returns the `image` object.
   */
  export interface ImagePicker extends Common<'image_picker'> {}

  /**
   * Returns the `video` object.
   */
  export interface Video extends Common<'video'> {}

  /**
   * Returns the `page` object.
   */
  export interface Page extends Common<'page'> {}

  /**
   * Returns an `product` object.
   */
  export interface Product extends Common<'product'> {}

  /* -------------------------------------------- */
  /* EXTENDED                                     */
  /* -------------------------------------------- */

  export interface CollectionList extends Common<'collection_list'> {
    /**
     * The maximum number of collections that the merchant can select.
     * The default limit, and the maximum limit you can set, is 50.
     */
    limit?: number;
  }

  export interface Color extends Common<'color'> {
    /**
     * The default value for the setting.
     */
    default?: string;
  }

  export interface ColorBackground extends Common<'color_background'> {
    /**
     * The default value for the setting.
     */
    default?: string;
  }

  /**
   * Returns an `font` object.
   */
  export interface FontPicker extends Common<'font_picker'> {
    /**
     * The default value for the setting.
     *
     * **The default attribute is required. Failing to include it will result in an error.**
     */
    default: string;
  }

  export interface Html extends Common<'html'> {
    /**
     * A placeholder value for the input.
     */
    placeholder?: string;
    /**
     * The default value for the setting.
     */
    default?: string;
  }

  export interface InlineRichText extends Common<'inline_richtext'> {
    /**
     * The default value for the setting.
     */
    default?: string;
  }

  export interface LinkList extends Common<'link_list'> {
    /**
     * The default value for the setting.
     *
     * **Accepted values for the default attribute are main-menu and footer**
     */
    default?: string;
  }

  export interface Liquid extends Common<'liquid'> {
    /**
     * The default value for the setting.
     *
     * The default attribute is optional. However, if you use it,
     * then its value can't be an empty string. Additionally, unclosed
     * HTML tags are automatically closed when the setting is saved.
     * This might not line up with your intended formatting, so be sure
     * to verify your input.
     */
    default?: string;
  }

  export interface ProductList extends Common<'product_list'> {
    /**
     * The maximum number of products that the merchant can select.
     * The default limit, and the maximum limit you can set, is 50.
     */
    limit?: number;
  }

  export interface RichText extends Common<'richtext'> {
    /**
     * The default value for the setting.
     *
     * The default attribute isn't required. However, if it's used,
     * then the content must be wrapped in <p> tags.
     *
     * The following HTML tags are also supported inside the parent <p> tag:
     *
     * - `<p>`
     * - `<br>`
     * - `<strong>`
     * - `<b>`
     * - `<em>`
     * - `<i>`
     * - `<u>`
     * - `<span>`
     * - `<a>`
     *
     * **Failing to wrap the default content in <p> tags will result in an error.**
     */
    default?: string;
  }

  export interface Url extends Common<'url'> {
    /**
     * The default value for the setting.
     *
     * Accepted values for the default attribute are `/collections` and `/collections/all`.
     */
    default?: string;
  }

  export interface VideoUrl extends Common<'video_url'> {
    /**
     * A placeholder value for the input.
     */
    placeholder?: string;
    /**
     * The default value for the setting.
     *
     * Accepted values for the default attribute are `/collections` and `/collections/all`.
     */
    accept: ['youtube' | 'vimeo'];
  }

}

export type SchemaSettings = (
| Schema.Article
| Schema.Blog
| Schema.Checkbox
| Schema.Collection
| Schema.CollectionList
| Schema.Color
| Schema.ColorBackground
| Schema.FontPicker
| Schema.Html
| Schema.ImagePicker
| Schema.InlineRichText
| Schema.LinkList
| Schema.Liquid
| Schema.Number
| Schema.Page
| Schema.Product
| Schema.ProductList
| Schema.Radio
| Schema.Range
| Schema.RichText
| Schema.Select
| Schema.Text
| Schema.Textarea
| Schema.Url
| Schema.Video
| Schema.VideoUrl
);

export interface SchemaBlocks {
  /**
   * The block type. This is a free-form string that you can use
   * as an identifier. You can access this value through the type
   * attribute of the block object.
   */
  type: string;
  /**
   * The block name, which will show as the block title in the theme editor.
   */
  name: string;
  /**
   * The number of blocks of this type that can be used.
   */
  limit?: number;
  /**
   * Any input or sidebar settings that you want for the block. Certain
   * settings might be used as the title of the block in the theme editor.
   */
  settings?: SchemaSettings[]
}

export interface SchemaSectionTag {
  /**
   * The name attribute determines the section title that is
   * shown in the theme editor.For example, the following schema
   * returns the following output:
   */
  name: string;
  /**
   * By default, when Shopify renders a section, it’s wrapped
   * in a `<div>` element with a unique id attribute:
   */
  tag?: LiteralUnion<'article'| 'aside'| 'div'| 'footer'| 'header'| 'section', string>;
  /**
   * When Shopify renders a section, it’s wrapped in an HTML element
   * with a class of shopify-section. You can add to that class with
   * the class attribute:
   */
  class?: string;
  /**
   * By default, there's no limit to how many times a section can be
   * added to a template. You can specify a limit of `1` or `2` with the limit attribute.
   */
  limit?: number;
  /**
   * You can create section specific settings to allow merchants
   * to customize the section with the settings object:
   */
  settings?: SchemaSettings[];
  /**
   * You can create blocks for a section. Blocks are reusable modules
   * of content that can be added, removed, and reordered within a section.
   */
  blocks?: SchemaBlocks[]
  /**
   * There’s a limit of 50 blocks per section. You can specify a lower limit
   * with the max_blocks attribute.
   */
  max_blocks?: number;
  /**
   * Presets are default configurations of sections that enable merchants
   * to easily add a section to a JSON template through the theme editor.
   * Presets aren't related to theme styles that are defined in settings_data.json.
   */
  presets?: SchemaPreset[];
  /**
   * If you statically render a section, then you can define a default configuration
   * with the default object, which has the same attributes as the preset object.
   */
  default?: SchemaDefault[];
  /**
   * If you statically render a section, then you can define a default configuration
   * with the default object, which has the same attributes as the preset object.
   *
   */
  locales?: {
    [language: string]: {
      [translation_key: string]: string
    },
  }
  /**
   * You can restrict a section to certain templates by specifying those
   * templates through the templates attribute. This attribute accepts a list
   * of strings that represent the page type.
   */
  templates?: string[];
}
