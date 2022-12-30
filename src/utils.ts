import { Range, workspace, TextDocument, MarkdownString, WorkspaceEdit, Position } from 'vscode';
import prettify, { LanguageNames, Options } from '@liquify/prettify';
import { omit, isType, has, hasPath } from 'rambdax';
import stripJsonComments from 'strip-json-comments';
import { InLanguageIds, LanguageIds, Liquidrc, StatusItem } from './types';
import parseJSON from 'parse-json';
import { access } from 'node:fs/promises';
import { join } from 'node:path';
import os from 'node:os';

/* -------------------------------------------- */
/* CONSTANTS                                    */
/* -------------------------------------------- */

const HOMEDIR = typeof os.homedir === 'undefined' ? '' : os.homedir().replace(/\\/g, '/');

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
/* NATIVES                                      */
/* -------------------------------------------- */

/**
 * Cache reference of `Object.entries`
 */
export const entries = Object.entries;

/* -------------------------------------------- */
/* FILE SYSTEM                                  */
/* -------------------------------------------- */

/**
 * Path Exists
 *
 * Checks if the uri `path` exists. Returns a boolean
 * value `true` when path is found, else `false`
 */
export async function pathExists (path: string) {

  if (!isString(path)) return false;

  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

/* -------------------------------------------- */
/* NATIVE                                       */
/* -------------------------------------------- */

/**
 * Normalize Prettify Rules
 *
 * Omits the `ignore` and `enable` options
 * from the extended format configurations
 */
export const rulesNormalize = omit([ 'ignore' ]);

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

export function multiline (...input: string[]) {

  return input.join(' ');

}

/**
 * Uppercase First Letter of string
 */
export function upcase (string: string) {

  return string[0].toUpperCase() + string.slice(1);

}

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
export function jsonc (input: string): Liquidrc {

  const json = isString(input) ? input : JSON.stringify(input);

  return parseJSON(stripJsonComments(json));

}

/**
 * Get Default Formatter
 *
 * Returns the name of the currently defined formatter
 * for the provided language id or `undefined` if none.
 */
export function getDefaultFormatter (language: InLanguageIds): string {

  const liquid = workspace.getConfiguration('liquid');
  const target = liquid.has('settings.target')
    ? liquid.get('settings.target') === 'workspace'
      ? 'workspaceValue' : 'globalValue'
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

  const setting = workspace.getConfiguration().inspect(`[${language}]`);

  if (!isObject(setting[target])) return false;
  if (!has('editor.defaultFormatter', setting[target])) return false;

  return setting[target]['editor.defaultFormatter'] === 'sissel.shopify-liquid';

}

/**
 * Is Format on Save
 *
 * Whether or not the provided in~language setting has defined
 * `formatOnSave` as enabled or not.
 */
export function isFormatOnSave (language: InLanguageIds, target: 'workspaceValue' | 'globalValue') {

  const setting = workspace.getConfiguration().inspect(`[${language}]`);

  if (!isObject(setting[target])) return false;
  if (!has('editor.defaultFormatter', setting[target])) return false;

  return setting[target]['editor.formatOnSave'];

}

/**
 * Has Deprecated Configuration
 *
 * Returns a boolean informing on whether or not
 * deprecated settings are defined.
 */
export function hasDeprecatedSettings (rcfile: Liquidrc = undefined) {

  if (rcfile === undefined) {

    const liquid = workspace.getConfiguration().inspect<any>('liquid');

    // These workspace configurations determine that the user
    // is using configuration pre v3.0.0 - This is very old configurations
    if (
      has('rules', liquid.workspaceValue) || (
        has('format', liquid.workspaceValue) &&
        isBoolean(liquid.workspaceValue.format)
      )
    ) {

      return '3.0.0';

    }

    // These workspace configuration determine that the user has
    // settings post v3.0.0 but pre v3.4.0 - This is most recent conigurations
    if (
      has('format', liquid.workspaceValue) && (
        has('enable', liquid.workspaceValue.format) ||
        has('wrap', liquid.workspaceValue.format) ||
        has('markup', liquid.workspaceValue.format) ||
        has('crlf', liquid.workspaceValue.format) ||
        has('preserveLine', liquid.workspaceValue.format) ||
        has('indentSize', liquid.workspaceValue.format) ||
        has('style', liquid.workspaceValue.format) ||
        has('script', liquid.workspaceValue.format) ||
        has('json', liquid.workspaceValue.format) ||
        has('endNewline', liquid.workspaceValue.format) ||
        has('commentIndent', liquid.workspaceValue.format)
      )
    ) {

      return '3.4.0';

    };

    return null;
  }

  if (rcfile) {

    // These workspace configurations determine that the user
    // is using configuration pre v3.0.0 - This is very old configurations
    if (
      has('html', rcfile) ||
      has('js', rcfile) ||
      has('css', rcfile) ||
      has('scss', rcfile) ||
      has('js', rcfile) || (has('ignore', rcfile) && isObject((rcfile as any).ignore[0]))) {

      return '3.0.0';

    }

    // These workspace configuration determine that the user has
    // settings post v3.0.0 but pre v3.4.0 - This is most recent conigurations

    if (
      has('ignore', rcfile) ||
      has('wrap', rcfile) ||
      has('markup', rcfile) ||
      has('style', rcfile) ||
      has('script', rcfile) ||
      has('json', rcfile) ||
      has('crlf', rcfile) ||
      has('preserveLine', rcfile) ||
      has('indentSize', rcfile) ||
      has('endNewline', rcfile) ||
      has('commentIndent', rcfile)) {

      return '3.4.0';
    }

  }

  return null;

}

/**
 * For Inspect
 *
 * Iterator function that loops of the workspace configuration inspect
 * names. Just some basic sugar for working with settings.
 */
export function forInspect (fn:(value: 'workspaceValue' | 'globalValue') => void) {

  for (const value of [
    'workspaceValue',
    'globalValue'
  ] as [
    'workspaceValue',
    'globalValue'
  ]) fn(value);

}

/**
 * Has .liquidrc File
 *
 * Returns a string or undefined to check whether the
 * current workspace contains a `.liquidrc` or `.liquidrc.json`
 * file. When undefined is returned not file exists.
 */
export async function hasLiquidrc (root: string) {

  if (!isString(root)) return undefined;

  const rcfile = join(root, '.liquidrc');
  const exists = await pathExists(rcfile);

  if (!exists) {
    const rcjson = join(root, '.liquidrc.json');
    const exists = await pathExists(rcjson);

    return exists ? rcjson : undefined;
  }

  return rcfile;
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
export function getStatusBar (status: StatusItem) {

  switch (status) {
    case StatusItem.Enabled:
      return 'enable';
    case StatusItem.Disabled:
      return 'disable';
    case StatusItem.NotDefault:
      return 'hide';
    case StatusItem.Hidden:
      return 'hide';
    case StatusItem.Error:
      return 'error';
    case StatusItem.Loading:
      return 'loading';
    case StatusItem.Ignoring:
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
 * Dirty Document
 *
 * Applies a dirty edit to a file following a formatting rule change.
 * This is used so when rules are edited the document will reflect
 * the updated rule changes.
 */
export async function dirty (document: TextDocument) {

  if (!document) return false;

  const insert = new WorkspaceEdit();

  insert.insert(document.uri, new Position(0, 0), ' ');
  await workspace.applyEdit(insert);

  const remove = new WorkspaceEdit();

  remove.delete(document.uri, new Range(new Position(0, 0), new Position(0, 1)));
  await workspace.applyEdit(remove);

  return false;
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
 * Update Deprecated Rules
 *
 * Executes an automated update of .liquidrc and/or workspace
 * settings structures.
 */
export function updateRules (rules: any) {

  const newRules = {
    wrap: hasPath('wrap', rules)
      ? rules.wrap
      : 0,
    crlf: hasPath('crlf', rules)
      ? rules.crlf
      : false,
    indentSize: hasPath('indentSize', rules)
      ? rules.indentSize
      : 2,
    preserveLine: hasPath('preserveLine', rules)
      ? rules.preserveLine
      : 2,
    endNewline: hasPath('endNewline', rules)
      ? rules.endNewline
      : false,
    liquid: {
      commentIndent: hasPath('commentIndent', rules)
        ? rules.commentIndent
        : true,
      commentNewline: hasPath('markup.commentNewline', rules)
        ? rules.markup.commentNewline
        : true,
      delimiterTrims: hasPath('markup.delimiterTrims', rules)
        ? rules.markup.delimiterTrims
        : 'preserve',
      ignoreTagList: [],
      lineBreakSeparator: hasPath('markup.lineBreakSeparator', rules)
        ? rules.markup.lineBreakSeparator
        : 'before',
      normalizeSpacing: hasPath('markup.normalizeSpacing', rules)
        ? rules.markup.normalizeSpacing
        : true,
      preserveComment: false,
      quoteConvert: 'single',
      valueForce: 'intent'
    },
    markup: {
      correct: false,
      quoteConvert: 'double',
      selfCloseSpace: true,
      commentNewline: hasPath('markup.commentNewline', rules)
        ? rules.markup.commentNewline
        : true,
      commentIndent: hasPath('markup.commentIndent', rules)
        ? rules.commentIndent
        : true,
      forceIndent: hasPath('markup.forceIndent', rules)
        ? rules.commentIndent
        : true,
      ignoreScripts: false,
      ignoreStyles: false,
      attributeSort: hasPath('markup.attributeSort', rules)
        ? rules.markup.attributeSort
        : false,
      attributeSortList: hasPath('markup.attributeSortList', rules)
        ? rules.markup.attributeSortList
        : [],
      attributeCasing: 'preserve',
      forceAttribute: 2,
      forceLeadAttribute: hasPath('markup.forceLeadAttribute', rules)
        ? rules.markup.forceLeadAttribute
        : true,
      preserveAttributes: hasPath('markup.preserveAttributes', rules)
        ? rules.markup.preserveAttributes
        : false,
      preserveText: hasPath('markup.preserveText', rules)
        ? rules.markup.preserveText
        : false,
      preserveComment: hasPath('markup.preserveComment', rules)
        ? rules.markup.preserveComment
        : false
    },
    json: {
      bracePadding: false,
      braceAllman: true,
      arrayFormat: 'indent',
      objectIndent: 'indent',
      objectSort: false
    },
    style: {
      correct: true,
      commentNewline: hasPath('markup.commentNewline', rules)
        ? rules.markup.commentNewline
        : true,
      commentIndent: hasPath('markup.commentIndent', rules)
        ? rules.commentIndent
        : true,
      sortProperties: false,
      sortSelectors: false,
      noLeadZero: true,
      quoteConvert: 'single',
      classPadding: true,
      atRuleSpace: true
    },
    script: {
      correct: true,
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
      braceNewline: false,
      braceStyle: 'none',
      commentNewline: true,
      neverFlatten: false,
      noCaseIndent: true,
      noSemicolon: false,
      objectSort: false,
      vertical: false
    }
  };

  for (const rule in newRules) {

    if (rule === 'markup') {

      for (const mu in newRules[rule]) {
        if (newRules[rule][mu] === prettify.options.rules.markup[mu]) {
          delete newRules[rule][mu];
        }
      }

    } else if (rule === 'json') {

      for (const jn in newRules[rule]) {
        if (newRules[rule][jn] === prettify.options.rules.json[jn]) {
          delete newRules[rule][jn];
        }
      }

    } else if (rule === 'style') {

      for (const st in newRules[rule]) {
        if (newRules[rule][st] === prettify.options.rules.markup[st]) {
          delete newRules[rule][st];
        }
      }

    } else if (rule === 'script') {

      for (const sc in newRules[rule]) {
        if (newRules[rule][sc] === prettify.options.rules.markup[sc]) {
          delete newRules[rule][sc];
        }
      }

    }

  }

  return newRules;

}

/**
 * Merge Preferences
 *
 * Extracts the users preference settings and returns
 * a Prettify model that will be merged with defaults.
 */
export function rulesDefault (): Options {

  const rules = rulesOmitted(prettify.options.rules);
  const editor = workspace.getConfiguration('editor');

  rules.json.braceAllman = true;

  return {
    wrap: editor.get<number>('wordWrapColumn') || rules.wrap,
    crlf: rules.crlf,
    indentSize: editor.get<number>('tabSize') || rules.indentSize,
    preserveLine: rules.preserveLine,
    endNewline: editor.get<boolean>('renderFinalNewline') || rules.endNewline,
    liquid: {
      commentIndent: rules.liquid.commentIndent,
      commentNewline: rules.liquid.commentNewline,
      delimiterTrims: rules.liquid.delimiterTrims,
      ignoreTagList: rules.liquid.ignoreTagList,
      lineBreakSeparator: rules.liquid.lineBreakSeparator,
      normalizeSpacing: rules.liquid.normalizeSpacing,
      preserveComment: rules.liquid.preserveComment,
      quoteConvert: rules.liquid.quoteConvert,
      valueForce: rules.liquid.valueForce
    },
    markup: {
      correct: rules.markup.correct,
      quoteConvert: rules.markup.quoteConvert,
      selfCloseSpace: rules.markup.selfCloseSpace,
      commentNewline: rules.markup.commentNewline,
      commentIndent: rules.markup.commentIndent,
      forceIndent: rules.markup.forceIndent,
      attributeSort: rules.markup.attributeSort,
      attributeSortList: rules.markup.attributeSortList,
      attributeCasing: rules.markup.attributeCasing,
      forceAttribute: rules.markup.forceAttribute,
      forceLeadAttribute: rules.markup.forceLeadAttribute,
      preserveAttributes: rules.markup.preserveAttributes,
      preserveText: rules.markup.preserveText,
      ignoreScripts: rules.markup.ignoreScripts,
      ignoreStyles: rules.markup.ignoreStyles
    },
    json: {
      bracePadding: rules.json.bracePadding,
      braceAllman: rules.json.braceAllman,
      arrayFormat: rules.json.arrayFormat,
      objectIndent: rules.json.objectIndent,
      objectSort: rules.json.objectSort
    },
    style: {
      correct: rules.style.correct,
      sortProperties: rules.style.sortProperties,
      sortSelectors: rules.style.sortSelectors,
      noLeadZero: rules.style.noLeadZero,
      quoteConvert: rules.style.quoteConvert,
      classPadding: rules.style.classPadding,
      atRuleSpace: rules.style.atRuleSpace
    },
    script: {
      correct: rules.script.correct,
      arrayFormat: rules.script.arrayFormat,
      braceAllman: rules.script.braceAllman,
      braceNewline: rules.script.braceNewline,
      bracePadding: rules.script.bracePadding,
      braceStyle: rules.script.braceStyle,
      objectIndent: rules.script.objectIndent,
      caseSpace: rules.script.caseSpace,
      endComma: rules.script.endComma,
      quoteConvert: rules.script.quoteConvert,
      elseNewline: rules.script.elseNewline,
      functionNameSpace: rules.script.functionNameSpace,
      functionSpace: rules.script.functionSpace,
      ternaryLine: rules.script.ternaryLine,
      commentNewline: rules.script.commentNewline,
      methodChain: rules.script.methodChain,
      neverFlatten: rules.script.neverFlatten,
      noCaseIndent: rules.script.noCaseIndent,
      noSemicolon: rules.script.noSemicolon,
      objectSort: rules.script.objectSort,
      variableList: rules.script.variableList,
      vertical: rules.script.vertical
    }
  };

}

/**
 * Recommended Rules
 *
 * Applies the recommended beautification rules
 */
export function rulesRecommend (): Liquidrc {

  return {
    format: {
      wrap: 0,
      crlf: false,
      indentSize: 2,
      preserveLine: 2,
      endNewline: true,
      liquid: {
        commentIndent: true,
        commentNewline: true,
        delimiterTrims: 'tags',
        lineBreakSeparator: 'before',
        normalizeSpacing: true,
        quoteConvert: 'single',
        valueForce: 'intent',
        ignoreTagList: []
      },
      markup: {
        quoteConvert: 'double',
        selfCloseSpace: true,
        commentNewline: true,
        forceIndent: true,
        commentIndent: true,
        ignoreScripts: true,
        ignoreStyles: false,
        forceAttribute: 3,
        forceLeadAttribute: true
      },
      json: {
        bracePadding: false,
        braceAllman: true,
        arrayFormat: 'indent',
        objectIndent: 'indent',
        objectSort: false
      },
      style: {
        correct: true,
        noLeadZero: true,
        quoteConvert: 'single',
        atRuleSpace: true
      },
      script: {
        correct: true,
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
        braceNewline: false,
        braceStyle: 'none',
        commentNewline: true,
        neverFlatten: false,
        noCaseIndent: true,
        noSemicolon: false,
        objectSort: false,
        vertical: false
      }
    }
  };

}
