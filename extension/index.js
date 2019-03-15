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

const liquid = vscode.workspace.getConfiguration('liquid');

const info = (message) => vscode.window.showInformationMessage(message);

const blocks = (code, open, name, source, close) => {
  if (pattern.enforce.includes(name) && open[0] === '{') {
    const config = Object.assign({}, defaults, rules[name], { source });
    const pretty = prettydiff.mode(config);
    return pattern.ignore(`${open.trim()}\n\n${pretty.trim()}\n\n${close.trim()}`)
  } else {
    return pattern.ignore(`${code}`)
  }
};

const fullRange = (document) => {
  const first = document.lineAt(0).range.start.character;
  const last = document.lineAt(document.lineCount - 1).range.end.character;
  const range = new vscode.Range(0, first, document.lineCount - 1, last);
  return range
};

const replace = (range, output) => [vscode.TextEdit.replace(range, output)];

const applyFormat = (document, range) => {
  const contents = document.getText(range);
  const source = contents.replace(pattern.matches(), blocks);
  const assign = Object.assign({}, defaults, rules.html, { source });
  const output = prettydiff.mode(assign).replace(pattern.ignored, '');
  return `${output.trim()}`
};
const format = (document) => {
  const range = fullRange(document);
  const output = applyFormat(document, range);
  return replace(range, output)
};

const schema = () => {
  const associate = vscode.workspace.getConfiguration('files').associations;
  return {
    scheme: 'file',
    language: (associate && associate['*.liquid']) || 'liquid'
  }
};

const disposal = () => {
  if (Object.keys(handler).length > 0) {
    for (const key in handler) {
      handler[key].dispose();
    }
  }
};

vscode.commands.registerCommand('liquid.disableFormatting', () => {
  liquid.update('format', false, vscode.ConfigurationTarget.Global);
  disposal();
  return info('Liquid: Formatting has been disabled')
});

const formatDocument = vscode.commands.registerCommand('liquid.formatDocument', () => {
  const document = vscode.window.activeTextEditor.document;
  const range = fullRange(document);
  const output = applyFormat(document, range);
  vscode.window.activeTextEditor.edit((edits) => edits.replace(range, output));
  return info('Liquid: File was formatted')
});

const formatSelection = vscode.commands.registerCommand('liquid.formatSelection', () => {
  const root = vscode.window.activeTextEditor;
  const range = root.selection;
  const output = applyFormat(root.document, range);
  vscode.window.activeTextEditor.edit((edits) => edits.replace(range, output));
  return info('Liquid: Selection was formatted')
});

const setup = () => {
  pattern.tags.map((k) => {
    if (liquid.beautify[k]) {
      return Object.assign(rules[k], liquid.beautify[k])
    }
  });
};

const formatting = () => {
  const name = vscode.window.activeTextEditor.document.uri.path;
  if (path.extname(name) === '.liquid') {
    if (Object.keys(handler).length === 0) {
      handler = {
        full: vscode.languages.registerDocumentFormattingEditProvider(schema(), {
          provideDocumentFormattingEdits: format
        }),
        range: vscode.languages.registerDocumentRangeFormattingEditProvider(schema(), {
          provideDocumentRangeFormattingEdits: format
        })
      };
    }
  } else {
    disposal();
    handler = {};
  }
};

const enableFormatting = vscode.commands.registerCommand('liquid.enableFormatting', () => {
  liquid.update('format', true, vscode.ConfigurationTarget.Global);
  formatting();
  return info('Liquid: Formatting has been enabled.')
});

const configuration = () => {
  return vscode.workspace.onDidChangeConfiguration(() => {
    if (liquid.format === false) return disposal()
    if (editor.formatOnSave === true) {
      formatting();
    }
  })
};

/**
 * # ACTIVATE EXTENSION
 */
exports.activate = (context) => {
  const active = vscode.window.activeTextEditor;
  const liquid = vscode.workspace.getConfiguration('liquid');

  if (!active || !active.document || !liquid.format) return

  setup();

  context.subscriptions.push(enableFormatting);
  context.subscriptions.push(formatDocument);
  context.subscriptions.push(formatSelection);
  context.subscriptions.push(vscode.workspace.onDidOpenTextDocument(formatting));
  context.subscriptions.push(configuration);
};
