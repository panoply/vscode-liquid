/* eslint-disable no-unused-vars */

import { LiteralUnion } from 'type-fest';
import prettify, { Options, LanguageNames } from '@liquify/prettify';
import { mergeRight } from 'rambda';
import { Range, workspace, TextDocument } from 'vscode';

/* -------------------------------------------- */
/* ENUMS                                        */
/* -------------------------------------------- */

export const enum Status {
  Enabled = 1,
  Disabled,
  Error
}

type LanguageIDs = LiteralUnion<(
  | 'html'
  | 'liquid'
  | 'liquid-javascript'
  | 'liquid-css'
  | 'liquid-scss'
  | 'liquid-json'
), string>

/* -------------------------------------------- */
/* FUNCTIONS                                    */
/* -------------------------------------------- */

export function matchLanguage (language: LanguageIDs): LanguageNames {

  switch (language) {
    case 'liquid':
    case 'html': return language;
    case 'liquid-javascript': return 'javascript';
    case 'liquid-css':
    case 'liquid-scss': return 'css';
    case 'liquid-json': return 'json';
  }

}

/**
 * Get the full document formatting range
 */
export function getRange (document: TextDocument) {

  const range = document.getText().length - 1;
  const first = document.positionAt(0);
  const last = document.positionAt(range);

  return new Range(first, last);

}

/**
 * Merges User settings with Prettify beautification options.
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
 * Omits certain prettify beautification rules from
 * formatting.
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
