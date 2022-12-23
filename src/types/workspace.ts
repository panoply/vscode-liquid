import { Engines } from '@liquify/liquid-language-specs';
import { Options } from '@liquify/prettify/types/prettify';

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
   * `liquid.files.*`
   *
   * Project file paths
   */
  export interface Files {
    /**
     * The value of `liquid.files.locales`
     *
     * @default null
     */
    locales?: string;
    /**
     * The value of `liquid.files.settings`
     *
     * @default null
     */
    settings?: string;
    /**
     * The value of `liquid.files.sections`
     *
     * @default []
     */
    sections?: string[];
    /**
     * The value of `liquid.files.snippets`
     *
     * @default []
     */
    snippets?: string[];
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
  export type Format = {
    /**
     * The string list of paths to ignore
     *
     * @default []
     */
    ignore?: string[];
    /**
     * The formatting rules for Prettify
     */
    rules?: Options
  }

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
    format?: Options
  }
}
