import { Range, workspace, TextDocument, MarkdownString } from 'vscode';
import prettify, { Options, LanguageNames } from '@liquify/prettify';
import { pathExistsSync } from 'fs-extra';
import { join } from 'node:path';
import os from 'node:os';
import { mergeDeepRight, omit, isType, has } from 'rambdax';
import stripJsonComments from 'strip-json-comments';
import { InLanguageIds, LanguageIds, Liquidrc } from './types';
import parseJSON from 'parse-json';
import { Status } from 'providers/StatusBarItem';

/* -------------------------------------------- */
/* CONSTANTS                                    */
/* -------------------------------------------- */

const HOMEDIR = typeof os.homedir === 'undefined'
  ? ''
  : os.homedir().replace(/\\/g, '/');

/* -------------------------------------------- */
/* TYPEOF CHECKS                                */
/* -------------------------------------------- */

/**
 * Whether type is object or not
 */
export const isObject = isType('Object');

/**
 * Whether type is number or not
 */
export const isNumber = isType('Number');

/**
 * Whether type is function or not
 */
export const isFunction = isType('Function');

/**
 * Whether type is undefined
 */
export const isUndefined = isType('Undefined');

/**
 * Whether type is array or not
 */
export const isArray = isType('Array');

/**
 * Whether type is boolean or not
 */
export const isString = isType('String');

/**
 * Whether type is boolean or not
 */
export const isBoolean = isType('Boolean');

/* -------------------------------------------- */
/* NATIVE                                       */
/* -------------------------------------------- */

/**
 * Normalize Prettify Rules
 *
 * Omits the `ignore` and `enable` options
 * from the extended format configurations
 */
export const rulesNormalize = omit([
  'ignore',
  'enable',
  'languages'
]);

/**
 * Omit Prettify Rules
 *
 * Omits the certain prettify rules from
 * the option configuration - used when generating rcfiles
 */
export const rulesOmitted = omit([
  'lexer',
  'language',
  'languageName',
  'mode',
  'indentLevel',
  'grammar',
  'commentNewline'
]);

/* -------------------------------------------- */
/* FUNCTIONS                                    */
/* -------------------------------------------- */

/**
 * Parse Error Stack
 *
 * Creates a string list of error stacks that are cleaned
 * for rendering in the output log.
 */
export function parseStack (error: Error) {

  const stack = error instanceof Error ? error.stack : error;

  if (!stack) return '';

  const match = stack.match(/(?:\n(?: {4}|\t)at .*)+/);

  if (!match) return '';

  const lines = match[0]
    .slice(1)
    .split('\n')
    .map(line => (line
      .replace(/^\t/, '  ')
      .replace(/\s+at.*[(\s](.*)\)?/, (m, p) => m.replace(p, p.replace(HOMEDIR, '~')))
    ));

  lines.push('');

  return lines;

}

export function mdString (text: string | string[]) {

  const md = new MarkdownString();

  md.supportHtml = true;
  md.supportThemeIcons = true;

  if (isArray(text)) {
    const last = (text as string[]).pop();
    const info = (text as string[]).map(line => `<p>${line}</p><hr>`).join('');
    md.value = info + '<p>' + last + '</p>';
  } else {
    md.value = '<p>' + text as string + '</p>';
  }

  return md;

}

/**
 * JSON with Comments
 *
 * Strips comments from JSONC files and returns the parsed
 * object result or throws an information error.
 */
export function jsonc (input: object | string): Liquidrc {

  const json = isString(input) ? input : JSON.stringify(input);

  return parseJSON(stripJsonComments(json as string));

}

export function getDefaultFormatter (language: string) {

  const liquid = workspace.getConfiguration('liquid');
  const target = liquid.has('settings.target')
    ? liquid.get('settings.target') === 'workspace' ? 'workspaceValue' : 'globalValue'
    : 'workspaceValue';

  const setting = workspace.getConfiguration().inspect(language);

  if (!isObject(setting[target])) return undefined;
  if (!has('editor.defaultFormatter', setting[target])) return undefined;

  return setting[target]['editor.defaultFormatter'];

}

/**
 * Is Default Formatter
 *
 * Whether or not the provided in~language setting has defined
 * `sissel.shopify-liquid` as the `editor.defaultFormatter` or not.
 */
export function isDefaultFormatter (language: InLanguageIds, target: 'workspaceValue' | 'globalValue') {

  const setting = workspace.getConfiguration().inspect(language);

  if (!isObject(setting[target])) return false;
  if (!has('editor.defaultFormatter', setting[target])) return false;

  return setting[target]['editor.defaultFormatter'] === 'sissel.shopify-liquid';

}

/**
 * Has Deprecated Configuration
 *
 * Returns a boolean informing on whether or not
 * deprecated settings are defined.
 */
export function hasDeprecatedSettings (rcfile: Liquidrc = undefined) {

  if (rcfile === undefined) {

    const liquid = workspace.getConfiguration('liquid');

    if (liquid.has('format')) {
      const format = liquid.get<boolean>('format');
      return (isBoolean(format) && format === true);
    }

    return false;
  }

  return rcfile && (
    has('html', rcfile) ||
    has('js', rcfile) ||
    has('css', rcfile) ||
    has('scss', rcfile)
  );
}

/**
 * Has .liquidrc File
 *
 * Returns a string or undefined to check whether the
 * current workspace contains a `.liquidrc` or `.liquidrc.json`
 * file. When undefined is returned not file exists.
 */
export function hasLiquidrc (root: string) {

  if (!isString(root)) return undefined;

  let path = join(root, '.liquidrc');

  if (!pathExistsSync(path)) {
    path = join(root, '.liquidrc.json');
    return pathExistsSync(path) ? path : undefined;
  }

  return path;
}

/**
 * Is Path
 *
 * Returns an object indicating whether the provided
 * path is pointing to the `matchFile` filename or not.
 * This is used by the file watcher to determine what
 * change occured in which file.
 */
export function isFile (path: string, matchFile: string) {

  const fileName = path.slice(path.lastIndexOf('/') + 1);

  return fileName.startsWith(matchFile);

}

/**
 * Get Status Bar
 *
 * Returns a string value of the `Status` enum that
 * will infer a method on the `StatusBarItem` class.
 */
export function getStatusBar (status: Status) {

  switch (status) {
    case Status.Enabled:
      return 'enable';
    case Status.Disabled:
      return 'disable';
    case Status.Hidden:
      return 'hide';
    case Status.Error:
      return 'error';
    case Status.Loading:
      return 'loading';
    case Status.Ignoring:
      return 'ignore';
  }

}

/**
 * Match Language
 *
 * Converts the provided vscode Language ID to the
 * Prettify language name. This is used to set the lexer mode
 * and have Prettify switch between languages.
 */
export function getLanguage (language: LanguageIds): LanguageNames {

  if (!isString(language)) return undefined;

  switch (language) {
    case 'liquid':
    case 'html':
    case 'typescript':
    case 'javascript':
    case 'css':
    case 'sass':
    case 'scss':
      return language;
    case 'jsonc':
      return 'json';
    case 'liquid-css':
      return 'css';
    case 'liquid-scss':
      return 'scss';
    case 'liquid-javascript':
      return 'javascript';
    default:
      return undefined;
  }

}

export function getFileNameExtension (path: string) {

  if (!isString(path)) return undefined;

  const nameidx = path.lastIndexOf('/');
  const lastdot = path.indexOf('.', nameidx);

  return path.slice(lastdot);

}

/**
 * Get Language from Extension
 *
 * Parses a file path string and returns the file language ID
 * Prettify language name. This is used when trying to determine
 * the file being dealt with during a change.
 */
export function getLanguageFromExtension (path: string) {

  if (!isString(path)) return undefined;

  const nameidx = path.lastIndexOf('/');
  const lastdot = path.indexOf('.', nameidx);
  const extname = path.slice(lastdot);

  switch (extname) {
    case '.liquid': return 'liquid';
    case '.js.liquid': return 'javascript';
    case '.css.liquid': return 'css';
    case '.scss.liquid': return 'scss';
  }

  return undefined;

}

/**
 * Get Range
 *
 * Returns the complete range location from a text document.
 * The extension executes a full-document parse on each change.
 */
export function getRange (document: TextDocument) {

  const range = document.getText().length - 1;
  const first = document.positionAt(0);
  const last = document.positionAt(range);

  return new Range(first, last);

}

/**
 * Get Time
 *
 * Returns the current time/date in formatted manner
 *
 * @param brace Wrap in square braces (default `true`)
 * @example
 * '[01-01-2022 01:59:20]'
 * '01-01-2022 01:59:20'
 */
export function getTime (brace = true) {

  const now = new Date();

  const d = now.getDate();
  const m = now.getMonth() + 1;
  const y = now.getFullYear();
  const hur = now.getHours();
  const min = now.getMinutes();
  const sec = now.getSeconds();
  const time = (
    (d < 10 ? `0${d + 1}` : `${d + 1}`) +
    '-' + (m < 10 ? `0${m}` : m) +
    '-' + y + ' ' + (hur < 10 ? `0${hur}` : hur) +
    ':' + (min < 10 ? `0${min}` : min) +
    ':' + (sec < 10 ? `0${sec}` : sec)
  );

  return brace ? '[' + time + ']' : time;
}

/**
 * Merge Preferences
 *
 * Extracts the users preference settings and returns
 * a Prettify model that will be merged with defaults.
 */
export function mergePreferences (options: Options): Options {

  const defaults = prettify.options.rules;
  const editor = workspace.getConfiguration('editor');

  return mergeDeepRight(options, {
    wrap: editor.get<number>('wordWrapColumn') || defaults.wrap,
    indentSize: editor.get<number>('tabSize') || defaults.indentSize,
    endNewline: editor.get<boolean>('renderFinalNewline') || defaults.endNewline
  });

}

/**
 * Recommended Rules
 *
 * Applies the recommended beautification rules
 */
export function recommendedRules (): Options {

  return mergeDeepRight(prettify.options.rules, {
    wrap: 0,
    endNewline: true,
    markup: {
      forceAttribute: 2,
      correct: true,
      quoteConvert: 'double',
      delimiterSpacing: true,
      selfCloseSpace: true,
      commentNewline: true,
      forceIndent: true
    },
    json: {
      braceAllman: true,
      arrayFormat: 'indent',
      objectIndent: 'indent',
      objectSort: false
    },
    style: {
      sortProperties: true,
      sortSelectors: true,
      noLeadZero: true,
      quoteConvert: 'single'
    },
    script: {
      arrayFormat: 'indent',
      objectIndent: 'indent',
      braceAllman: false,
      methodChain: 3,
      caseSpace: true,
      endComma: 'never',
      quoteConvert: 'single',
      elseNewline: true,
      functionNameSpace: true,
      functionSpace: true,
      ternaryLine: true,
      variableList: 'none',
      vertical: true,
      correct: true
    }
  });

}

/**
 * Omit Rules
 *
 * Normalizes the formatting options. Omits certain prettify
 * beautification rules from formatting.
 */
export function omitRules (options: Options = prettify.options.rules) {

  const defaults = Object.assign({}, options);

  // OMITTED BASE RULES
  delete defaults.lexer;
  delete defaults.language;
  delete defaults.languageName;
  delete defaults.mode;
  delete defaults.indentLevel;
  delete defaults.grammar;

  // OMITTED SCRIPT RULES
  delete defaults.script.commentNewline;
  delete defaults.script.objectSort;
  delete defaults.script.vertical;
  delete defaults.script.variableList;

  // OMITTED CSS RULES
  delete defaults.style.forceValue;
  delete defaults.style.quoteConvert;
  delete defaults.style.compressCSS;

  // OMITTED JSON RULES
  delete defaults.json.objectSort;

  const preferences = mergePreferences(defaults);

  // RETURN
  return mergeDeepRight(options, preferences);

}
