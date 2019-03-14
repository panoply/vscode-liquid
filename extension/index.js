'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var vscode = require('vscode');
var path = _interopDefault(require('path'));
var prettydiff = _interopDefault(require('prettydiff'));

/**
 * # PrettyDiff Defaults
 */
const defaults = prettydiff.defaults;

/**
 * # Editor Configuration
 */
const editor = vscode.workspace.getConfiguration('editor');

/**
 * Default Formatting Rules
 */
const rules = {
  html: {
    mode: 'beautify',
    language: 'liquid',
    lexer: 'markup',
    indent_size: editor.tabSize,
    ignore_tags: ['script',
      'style',
      'comment']
  },
  schema: {
    mode: 'beautify',
    language: 'JSON',
    lexer: 'script',
    indent_size: editor.tabSize
  },
  stylesheet: {
    mode: 'beautify',
    language: 'SCSS',
    lexer: 'style',
    indent_size: editor.tabSize
  },
  javascript: {
    mode: 'beautify',
    language: 'JavaScript',
    lexer: 'script',
    indent_size: editor.tabSize
  }
};

const tags = Object.keys(rules);
const ignore = rules.html.ignore_tags;
const items = tags.concat(ignore);

var pattern = {
  tags: items,
  enforce: ['schema',
    'style',
    'stylesheet',
    'javascript'],
  inner: '((?:.|\\n)*?)',
  close: '((?:</|{%-?)\\s*\\b(?:(?:|end)\\2)\\b\\s*(?:>|-?%}))',
  ignored: new RegExp(`(<temp data-prettydiff-ignore>|</temp>)`, 'g'),
  open: (tag) => `((?:<|{%-?)\\s*\\b(${tag})\\b(?:.|\\n)*?\\s*(?:>|-?%})\\s*)`,
  ignore: (code) => `<temp data-prettydiff-ignore>${code}</temp>`,
  matches () {
    return new RegExp(this.open(this.tags.join('|')) + this.inner + this.close, 'g')
  }
};

function blocks (code, open, name, source, close) {
  if (pattern.enforce.includes(name) && open[0] === '{') {
    const config = Object.assign({}, defaults, rules[name], { source });
    const pretty = prettydiff.mode(config);
    return pattern.ignore(`${open.trim()}\n\n${pretty.trim()}\n\n${close.trim()}`)
  } else {
    return pattern.ignore(`${code}`)
  }
}

function format (document) {
  const total = document.lineCount - 1;
  const last = document.lineAt(total).text.length;
  const top = new vscode.Position(0, 0);
  const bottom = new vscode.Position(total, last);
  const range = new vscode.Range(top, bottom);
  const contents = document.getText(range);
  const source = contents.replace(pattern.matches(), blocks);
  const assign = Object.assign({}, defaults, rules.html, { source });
  const output = prettydiff.mode(assign).replace(pattern.ignored, '');
  const replace = [];
  replace.push(vscode.TextEdit.replace(range, `${output.trim()}`));
  return replace
}

class Formatting {

  constructor ({ liquid, schema }) {
    this.format = {};
    this.editor = editor;
    this.enable = liquid.format;
    this.schema = schema;
    pattern.tags.map((k) => {
      if (liquid.beautify[k]) {
        return Object.assign(rules[k], liquid.beautify[k])
      }
    });
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
      full: vscode.languages.registerDocumentFormattingEditProvider(this.schema, {
        provideDocumentFormattingEdits: format
      }),
      range: vscode.languages.registerDocumentRangeFormattingEditProvider(this.schema, {
        provideDocumentRangeFormattingEdits: format
      })
    });
  }
  configuration () {
    vscode.workspace.onDidChangeConfiguration(() => {
      const uri = vscode.window.activeTextEditor.document.uri.path;
      if (this.enable === false) return this.disposal()
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
  const liquid = vscode.workspace.getConfiguration('liquid');
  const associate = vscode.workspace.getConfiguration('files.associations');

  if (!active || !active.document || !liquid.format) return

  const format = new Formatting({
    liquid: liquid,
    schema: {
      scheme: 'file',
      language: (associate && associate['*.liquid']) || 'liquid'
    }
  });

  context.subscriptions.push(format.activation());
  context.subscriptions.push(format.configuration());
};
