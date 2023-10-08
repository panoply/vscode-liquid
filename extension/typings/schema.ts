/* eslint-disable no-unused-vars */

import { LiteralUnion, Merge } from 'type-fest';
import { Position, TextDocument } from 'vscode';

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

export interface SchemaPreset {}

export interface SchemaDefault extends SchemaPreset {}

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
     * Description - Only Shared Schema applies
     */
    $description?: string | string[];
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
    /**
     * Reference to shared schema
     */
    $ref?: string
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
      /**
       * The select value
       */
      value: string;
      /**
       * The select label
       */
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

export type SchemaSettingsData = (
  | Schema.Checkbox
  | Schema.Number
  | Schema.Radio
  | Schema.Range
  | Schema.Select
  | Schema.Color
  | Schema.ColorBackground
  | Schema.FontPicker
  | Schema.RichText
  | Schema.Text
  | Schema.Textarea
);

export interface SettingsData {
  /**
   * The `name` which will show as the name title in the settings editor.
   */
  name: string;
  /**
   * The `settings_data.json` settings array.
   */
  settings: SchemaSettingsData[];

}

export interface SchemaBlocks {
  /**
   * Description - Only Shared Schema applies
   */
  $description?: string | string[];
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
  settings?: SchemaSettings[];

  /**
   * Reference to shared schema
   */
  $ref?: string
}

export interface EnabledOn {
  /**
   * Array list of templates to enabled this section on
   */
  templates?: string[];
  /**
   * Array list of groups to enabled this section on
   */
  groups?: string[];
}

export interface DisabledOn {
  /**
   * Array list of templates to disable this section on
   */
  templates?: string[];
  /**
   * Array list of groups to disable this section on
   */
  groups?: string[];
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
   * You can prevent a section from being used on certain template page types and
   * section group types by setting them in the disabled_on attribute. When you use
   * `disabled_on`, the section is available to all templates and section groups except
   * the ones that you specified.
   */
  enabled_on?: EnabledOn;
  /**
   * You can prevent a section from being used on certain template page types and
   * section group types by setting them in the disabled_on attribute. When you use
   * `disabled_on`, the section is available to all templates and section groups except
   * the ones that you specified.
   */
  disabled_on?: DisabledOn;
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

export type SharedSchemaDescription = string | string[] | {
  [ref: string]: string | string[];
}

export interface SharedSchema {
  /**
   * References
   */
  [ref: string]: (
    | SchemaSettings[]
    | SchemaBlocks[]
    | SchemaSettings
    | SchemaBlocks
    | { $description?: SharedSchemaDescription; settings: SchemaSettings[] }
  );
}
