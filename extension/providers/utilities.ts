/* eslint-disable no-unused-vars */

import { LiteralUnion } from 'type-fest';
import prettify, { Options, LanguageNames } from '@liquify/prettify';
import { mergeRight } from 'rambda';
import { Range, workspace, TextDocument, DocumentSelector } from 'vscode';
import { TextDocument as ITextDocument } from 'vscode-languageserver-textdocument';
import stripJsonComments from 'strip-json-comments';

/* -------------------------------------------- */
/* ENUMS                                        */
/* -------------------------------------------- */

export const enum Status {
  Enabled = 1,
  Disabled,
  Ignored,
  Error,
  Loading,
  Upgrade
}

type LanguageIDs = LiteralUnion<(
  | 'html'
  | 'liquid'
  | 'json'
  | 'jsonc'
  | 'liquid-javascript'
  | 'liquid-css'
  | 'liquid-scss'
  | 'liquid-json'
), string>

/* -------------------------------------------- */
/* FUNCTIONS                                    */
/* -------------------------------------------- */

export function jsonc (input: object | string) {

  const json = typeof input === 'string' ? input : JSON.stringify(input);

  try {

    return JSON.parse(stripJsonComments(json));

  } catch (error) {

    throw new Error(error);

  }
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
    defaults.push(
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

/**
 * Match Language
 *
 * Converts the provided vscode Language ID to the
 * Prettify language name. This is used to set the lexer mode
 * and have Prettify switch between languages.
 */
export function getLanguage (language: LanguageIDs): LanguageNames {

  console.log(language);
  switch (language) {
    case 'liquid':
    case 'json': return language;
    case 'html': return 'liquid';
    case 'jsonc': return 'json';
    case 'liquid-javascript': return 'javascript';
    case 'liquid-css': return 'scss';
    case 'liquid-scss': return 'scss';
    case 'liquid-json': return 'json';
  }

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

  return mergeRight(options, {
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

  return mergeRight(prettify.options.rules, {
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
  return mergeRight(options, preferences);

}
