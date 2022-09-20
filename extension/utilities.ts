import { Range, workspace, TextDocument, DocumentSelector } from 'vscode';
import prettify, { Options, LanguageNames } from '@liquify/prettify';
import { pathExistsSync, writeFile } from 'fs-extra';
import { join, basename } from 'node:path';
import os from 'node:os';
import { mergeDeepRight, omit, isType, has } from 'rambdax';
import stripJsonComments from 'strip-json-comments';
import { LanguageIDs, Liquidrc, Workspace } from './types';
import parseJSON from 'parse-json';

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
export const normalizeRules = omit<keyof Workspace.Format>([
  'ignore',
  'enable',
  'languages'
]);

/* -------------------------------------------- */
/* FUNCTIONS                                    */
/* -------------------------------------------- */

/**
 * Parse Error Stack
 *
 * Creates a string list of error stacks that are cleaned
 * for rendering in the outpout log.
 */
export function parseStack (error: Error) {

  const stack = error instanceof Error ? error.stack : error;

  if (!stack) return '';

  const match = stack.match(/(?:\n(?: {4}|\t)at .*)+/);

  if (!match) return '';

  const lines = match[0].slice(1).split('\n').map(line => (
    line.replace(/^\t/, '  ').replace(/\s+at.*[(\s](.*)\)?/, (m, p) => (
      m.replace(p, p.replace(HOMEDIR, '~'))
    ))
  ));

  lines.push('');

  return lines;

}

export function jsonc (input: object | string): Liquidrc {

  const json = isString(input) ? input : JSON.stringify(input);

  return parseJSON(stripJsonComments(json as string));

}

export function getSelectors (inject = false): DocumentSelector {

  const defaults: DocumentSelector = [
    {
      scheme: 'file',
      language: 'liquid'
    },
    {
      scheme: 'file',
      language: 'liquid-css'
    },
    {
      scheme: 'file',
      language: 'liquid-scss'
    },
    {
      scheme: 'file',
      language: 'liquid-javascript'
    },
    {
      scheme: 'file',
      language: 'liquid-json'
    }
  ];

  if (inject) {
    (defaults as DocumentSelector[]).push(
      {
        scheme: 'file',
        language: 'html'
      },
      {
        scheme: 'file',
        language: 'json'
      }
    );

  }

  return defaults;
}

export function getDefaultFormatter (language: string, target: 'globalValue' | 'workspaceValue') {

  const setting = workspace.getConfiguration().inspect(language);

  if (!isObject(setting[target])) return undefined;
  if (!has('editor.defaultFormatter', setting[target])) return undefined;

  return setting[target]['editor.defaultFormatter'];

}

export function hasDefinedDefaultFormatter (language: string, target: 'globalValue' | 'workspaceValue') {

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
 * Has Package.json
 *
 * Returns a string or undefined to check whether the
 * current workspace contains a `package.json` file.
 * When undefined is returned not file exists.
 */
export function hasPackage (root: string) {

  if (!isString(root)) return undefined;

  const path = join(root, 'package.json');
  const exists = pathExistsSync(path);

  if (!exists) return undefined;

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
export function isPath (path: string, matchFile: string) {

  const fileName = path.slice(path.lastIndexOf('/') + 1);
  const match = fileName.startsWith(matchFile);

  return {
    fileName,
    match
  };
}

/**
 * Update File
 *
 * Write a file to the system. This is wrapper around fs-extra
 * `writeFile` that executes in a `try/catch` block and if it
 *  fails returns a custom output error message.
 */
export async function updateFile (path: string, content: string): Promise<{
  error: boolean;
  message?: string;
}> {

  try {

    await writeFile(path, content);

    return { error: false };

  } catch (e) {

    console.error(e);

    return {
      error: true,
      message: `ERROR: File ${basename(path)} could not be updated`
    };
  }

}

/**
 * Match Language
 *
 * Converts the provided vscode Language ID to the
 * Prettify language name. This is used to set the lexer mode
 * and have Prettify switch between languages.
 */
export function getLanguage (language: LanguageIDs): LanguageNames {

  if (!isString(language)) return undefined;

  switch (language) {
    case 'liquid':
    case 'json': return language;
    case 'jsonc': return 'json';
    case 'html': return 'liquid';
    case 'liquid-javascript': return 'javascript';
    case 'liquid-css': return 'css';
    case 'liquid-scss': return 'scss';
  }

}

/**
 * Get Language from Extension
 *
 * Parses a file path string and returns the file language ID
 * Prettify language name. This is used when trying to determine
 * the file being dealt with during a change.
 */
export function getLanguagExtensionMap (languages: string[]): string[] {

  const entries: string[] = [];

  for (const language of languages) {
    if (language === 'liquid') {
      entries.push('liquid');
    } else if (language === 'liquid-javascript') {
      entries.push('.js.liquid');
    } else if (language === 'liquid-css') {
      entries.push('.css.liquid');
    } else if (language === 'liquid-scss') {
      entries.push('.scss.liquid');
    } else if (language === 'jsonc') {
      entries.push('.json');
    } else if (language === 'json') {
      entries.push('.json');
    } else if (language === 'html') {
      entries.push('.html');
    } else if (language === 'xml') {
      entries.push('.xml');
    } else if (language === 'css') {
      entries.push('.css');
    } else if (language === 'scss') {
      entries.push('.scss');
    } else if (language === 'javascript') {
      entries.push('.js');
    } else if (language === 'typescript') {
      entries.push('.ts');
    } else if (language === 'jsx') {
      entries.push('.jsx');
    } else if (language === 'tsx') {
      entries.push('.tsx');
    }
  }

  return entries;

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
