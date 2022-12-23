import { LiteralUnion } from 'type-fest';

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
