'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var vscode = require('vscode');
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
    language: 'html',
    lexer: 'markup',
    fix: true,
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

const cmd = {
  document: 'liquid.formatDocument',
  selection: 'liquid.formatSelection',
  enable: 'liquid.enableFormatting',
  disable: 'liquid.disableFormatting'
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

let handler = {};

const replace = (range, output) => [vscode.TextEdit.replace(range, output)];

const blocks = (code, open, name, source, close) => {
  if (pattern.enforce.includes(name) && open[0] === '{') {
    let config = Object.assign({}, defaults, rules[name], { source });
    let pretty = prettydiff.mode(config);
    return pattern.ignore(`${open.trim()}\n\n${pretty.trim()}\n\n${close.trim()}`)
  }
  return pattern.ignore(`${code}`)
};

const fullRange = (document) => {
  let first = document.lineAt(0).range.start.character;
  let last = document.lineAt(document.lineCount - 1).range.end.character;
  let range = new vscode.Range(0, first, document.lineCount - 1, last);

  return range
};

function applyFormat (document, range) {
  let contents = document.getText(range);
  let source = contents.replace(pattern.matches(), blocks);
  let assign = Object.assign({}, defaults, rules.html, {
    source
  });

  let output = prettydiff.mode(assign);
  output = output.replace(pattern.ignored, '');

  return `${output.trim()}`
}

function format (document) {
  let range = fullRange(document);
  let output = applyFormat(document, range);

  return replace(range, output)
}

function schema () {
  let associate = vscode.workspace.getConfiguration('files').associations;
  return {
    scheme: 'file',
    language: (associate && associate['*.liquid']) || 'liquid'
  }
}

function disposal () {
  if (Object.keys(handler).length > 0) {
    handler.range.dispose();
    handler.full.dispose();
    handler = {};
  }
}

const textDocument = vscode.commands.registerCommand(cmd.document, () => {
  let document = vscode.window.activeTextEditor.document;
  let range = fullRange(document);
  let output = applyFormat(document, range);
  vscode.window.activeTextEditor.edit((edits) => edits.replace(range, output));
  vscode.window.showInformationMessage('Liquid Language: Document Formatted 💧');
});

const textSelection = vscode.commands.registerCommand(cmd.selection, () => {
  let root = vscode.window.activeTextEditor;
  let range = root.selection;
  let output = applyFormat(root.document, range);
  vscode.window.activeTextEditor.edit((edits) => edits.replace(range, output));
  vscode.window.showInformationMessage('Liquid Language: Selection Formatted! 💧');
});

const formatEnable = vscode.commands.registerCommand(cmd.enable, () => {
  let liquid = vscode.workspace.getConfiguration('liquid');
  liquid.update('format', true, vscode.ConfigurationTarget.Global);
  vscode.window.showInformationMessage('Liquid Language: Formatting Enabled 💧');
});

const formatDisable = vscode.commands.registerCommand(cmd.disable, () => {
  let liquid = vscode.workspace.getConfiguration('liquid');
  liquid.update('format', false, vscode.ConfigurationTarget.Global);
  disposal();
  vscode.window.showInformationMessage('Liquid Language: Formatting Disabled');
});

const registerFormat = () => {
  if (!vscode.workspace.getConfiguration('liquid').format) {
    return disposal()
  }

  if (!vscode.workspace.getConfiguration('editor').formatOnSave) {
    return disposal()
  }

  if (Object.keys(handler).length > 0) {
    disposal();
  }

  if (Object.keys(handler).length === 0) {
    handler.full = vscode.languages.registerDocumentFormattingEditProvider(schema(), {
      provideDocumentFormattingEdits: format
    });
    handler.range = vscode.languages.registerDocumentRangeFormattingEditProvider(schema(), {
      provideDocumentRangeFormattingEdits: format
    });
  }
};

const registerRules = () => {
  let liquid = vscode.workspace.getConfiguration('liquid');
  pattern.tags.map((k) => {
    if (liquid.beautify[k]) {
      Object.assign(rules[k], liquid.beautify[k]);
    }
  });
};

/**
 * # ACTIVATE EXTENSION
 */
exports.activate = (context) => {
  const active = vscode.window.activeTextEditor;

  if (!active || !active.document) return

  registerRules();
  registerFormat();

  context.subscriptions.push(formatEnable);
  context.subscriptions.push(formatDisable);
  context.subscriptions.push(textDocument);
  context.subscriptions.push(textSelection);
  context.subscriptions.push(vscode.workspace.onDidOpenTextDocument(registerFormat));
  context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(registerFormat));
};
