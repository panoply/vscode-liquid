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
  | 'markdown'
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
export type Selectors = Array<{
  scheme: string;
  language: LiteralUnion<(
    | 'liquid'
    | 'liquid-javascript'
    | 'liquid-css'
    | 'liquid-scss'
  ), string>
}>
