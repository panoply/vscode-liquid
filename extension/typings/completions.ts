/* eslint-disable no-unused-vars */

import { Objects, Type } from '@liquify/specs';
import { CompletionItem } from 'vscode';
import { Tag } from './enums';
import { SchemaSectionTag } from './schema';
import { LanguageSettings } from 'vscode-json-languageservice';

export namespace Complete {

  export interface ISchema {
    /**
     * The offset line from which the schema code region exists
     */
    offset: number;
    /**
     * The starting offset of the schema tag, ie: `{% schema %`
     */
    begin: number;
    /**
     * The ender offset location the schema tag, ie: `^{% endschema %}`
     */
    ender: number;
    /**
     * The inner contents of the `{% schema %}` tag as a string.
     */
    content: string
    /**
     * Parse the inner contents of the `{% schema %}` tag
     */
    parse(): SchemaSectionTag
  };

  /**
   * Variable Modal
   *
   * This interface represents variables contained in the document.
   */
  export interface Variable {
    /**
     * The actual token of the variable
     */
    token: string;
    /**
     * The variable _kind_ we are working with
     */
    kind: Tag;
    /**
     * The variable keyword assignment
     */
    label: string;
    /**
     * The starting offset index of the variable
     */
    begin: number;
    /**
     * The ending offset index of the variable
     */
    ender: number;
    /**
     * The variable value in string form, eg: `object.prop`
     */
    value: string;
    /**
     * The variable value split, eg: `['object', 'prop']`
     */
    props: string[];
    /**
     * The type which the variable holds
     */
    type: Type,
  }

  /**
   * Variable Modal
   *
   * This interface represents variables contained in the document.
   */
  export interface Iteree {
    /**
     * The actual token of the variable
     */
    token: string;
    /**
     * The variable _kind_ we are working with
     */
    kind: Tag;
    /**
     * The variable keyword assignment
     */
    label: string;
    /**
     * The starting offset index of the variable
     */
    begin: number;
    /**
     * The ending offset index of the variable
     */
    ender: number;
    /**
     * The variable value in string form
     */
    value: string;
    /**
     * The type which the variable holds
     */
    type: Type,
  }

  export interface JSONSchema {
    /**
     * Shared Schema Files
     */
    shared: LanguageSettings;
  }

  /**
   * Schema JSON Completions
   *
   * File based schema code block regions
   */
  export type Schema = Map<string, ISchema>

  /**
   * Variable Completions
   *
   * Set store of known variables within the document
   */
  export type Vars = Map<string, Variable>

  /**
   * Completion Item Keys
   *
   * Map Keys for the completion Types store
   */
  export type ItemKeys = (
    | 'tags'
    | 'operators'
    | 'filters'
    | 'objects'
    | 'object:template'
    | `object:${number}`
    | 'object:boolean'
    | 'object:number'
    | 'object:array'
    | 'object:constant'
    | 'snippets'
    | 'sections'
    | 'settings'
    | 'locales'
    | 'frontmatter'
  )

  /**
   * Completion Items
   *
   * Map store of the completion items available
   */
  export type Items = Map<ItemKeys, CompletionItem[]>

}
