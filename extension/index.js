'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var vscode = require('vscode');
var prettydiff = _interopDefault(require('prettydiff'));
var path = _interopDefault(require('path'));

/**
 * # Editor Configuration
 */
const editor = vscode.workspace.getConfiguration('editor');

/**
 * # Liquid Configuration
 */
const liquid = vscode.workspace.getConfiguration('liquid');

/**
 * # PrettyDiff Defaults
 */
const defaults = prettydiff.defaults;

/**
 * Parser Pattern Matches
 */
const pattern = {
  open: (tags) => `((?:<|{%-?)\\s*\\b(${tags})\\b(?:.|\\n)*?\\s*(?:>|-?%})\\s*)`,
  inner: '((?:.|\\n)*?)',
  close: '((?:</|{%-?)\\s*\\b(?:(?:|end)\\2)\\b\\s*(?:>|-?%}))',
  wrap: (code) => `<temp data-prettydiff-ignore>${code}</temp>`,
  unwrap: new RegExp(`(<temp data-prettydiff-ignore>|</temp>)`, 'g')
};

/**
 * Formatting File Register
 */
const schema = {
  scheme: 'file',
  language: 'html'
};

/**
 * Default Formatting Rules
 */
const rules = {
  html: {
    mode: 'beautify',
    language: 'liquid',
    lexer: 'markup'
  },
  schema: {
    mode: 'beautify',
    language: 'JSON',
    lexer: 'script'
  },
  stylesheet: {
    mode: 'beautify',
    language: 'SCSS',
    lexer: 'style'
  },
  javascript: {
    mode: 'beautify',
    language: 'JavaScript',
    lexer: 'script'
  }
};

function formatBlocks (code, open, name, source, close) {
  if (Object.keys(rules).includes(name)) {
    const config = Object.assign({}, defaults, rules[name], { source });
    const pretty = prettydiff.mode(config);
    return pattern.wrap(`${open.trim()}\n\n${pretty}\n${close.trim()}`)
  } else {
    return pattern.wrap(`${code}`)
  }
}

const elements = () => {
  const { open, inner, close } = pattern;
  const tags = Object.keys(rules);
  tags.map((key) => Object.assign(rules[key], liquid.beautify[key]));
  return new RegExp(open(tags.join('|')) + inner + close, 'g')
};

const formatFile = (document) => {
  console.log(document);
  const total = document.lineCount - 1;
  const last = document.lineAt(total).text.length;
  const top = new vscode.Position(0, 0);
  const bottom = new vscode.Position(total, last);
  const range = new vscode.Range(top, bottom);

  const contents = document.getText(range);
  const source = contents.replace(elements(), formatBlocks);
  const assign = Object.assign({}, defaults, rules.html, { source });
  const output = prettydiff
    .mode(assign)
    .replace(pattern.unwrap, '')
    .trim();

  const replace = [];
  replace.push(vscode.TextEdit.replace(range, `${output}`));
  return replace
};

class Format {

  constructor () {
    this.format = {};
  }
  extname (name) {
    if (path.extname(name) === '.git') {
      if (path.extname(name.slice(0, -4)) === '.liquid') return true
    } else if (path.extname(name) === '.liquid') {
      return true
    } else {
      return false
    }
  }
  activation () {
    vscode.workspace.onDidOpenTextDocument((document) => {
      return this.extname(document.fileName) ? this.register() : this.disposal()
    });
  }
  register () {
    Object.assign(this.format, {
      full: vscode.languages.registerDocumentFormattingEditProvider(schema, {
        provideDocumentFormattingEdits: formatFile
      }),
      range: vscode.languages.registerDocumentRangeFormattingEditProvider(schema, {
        provideDocumentRangeFormattingEdits: formatFile
      })
    });
  }
  configuration () {
    vscode.workspace.onDidChangeConfiguration(() => {
      const uri = vscode.window.activeTextEditor.document.uri.path;
      if (liquid.format === false) return this.disposal()
      if (editor.formatOnSave === true && this.extname(uri)) {
        return this.register()
      } else {
        return this.disposal()
      }
    });
  }
  disposal () {
    Object.keys(this.format).map((prop) => this.format[prop].dispose());
  }

}

/**
 * # ACTIVATE EXTENSION
 */
exports.activate = (context) => {
  const active = vscode.window.activeTextEditor;
  if (!active || !active.document || !liquid.format) return

  const format = new Format();
  context.subscriptions.push(format.activation());
  context.subscriptions.push(format.configuration());
};
