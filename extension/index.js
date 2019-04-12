'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var vscode = require('vscode');
var prettydiff = _interopDefault(require('prettydiff'));

/**
 * PrettyDiff Defaults
 */
const defaults = prettydiff.defaults;

/**
 * Preset Configuration
 */
const preset = {
  tags: ['javascript',
    'stylesheet',
    'schema',
    'style'],
  ignore: [
    'script', // <script>
    'comment' // {% comment %}
  ]
};

/**
 * Editor Configuration
 */
const editor = vscode.workspace.getConfiguration('editor');
const liquid = vscode.workspace.getConfiguration('liquid');

/**
 * Rules
 */
const rules = {
  html: {
    mode: 'beautify',
    language_name: 'Liquid',
    language: 'html',
    lexer: 'markup',
    fix: true,
    preserve: 1,
    indent_size: editor.tabSize,
    end_quietly: 'log',
    node_error: true
  },
  schema: {
    mode: 'beautify',
    language: 'JSON',
    language_name: 'json',
    lexer: 'script',
    indent_size: editor.tabSize
  },
  stylesheet: {
    mode: 'beautify',
    language_name: 'SASS',
    language: 'scss',
    lexer: 'style',
    preserve: 1,
    indent_size: editor.tabSize
  },
  javascript: {
    mode: 'beautify',
    language_name: 'JavaScript',
    language: 'javascript',
    lexer: 'script',
    preserve: 1,
    indent_size: editor.tabSize
  }
};

/**
 * Command Palette
 */
const cmd = {
  document: 'liquid.formatDocument',
  selection: 'liquid.formatSelection',
  enable: 'liquid.enableFormatting',
  disable: 'liquid.disableFormatting'
};

var pattern = {
  frontmatter: new RegExp(['---',
    '(?:[^]*?)',
    '---'].join(''), 'g'),
  tags: new RegExp(
    [
      '(', // Opening
      '(?:<|{%-?)\\s*',
      `\\b(${preset.tags.concat(preset.ignore).join('|')})\\b`,
      '(?:.|\\n)*?\\s*',
      '(?:>|-?%})\\s*',
      ')',
      '(', // Inner
      '(?:.|\\n)*?',
      ')',
      '(', // Closing
      '(?:</|{%-?)\\s*',
      '\\b(?:(?:|end)\\2)\\b',
      '\\s*(?:>|-?%})',
      ')'
    ].join(''),
    'g'
  ),
  ignore: new RegExp(['(',
    '<temp data-prettydiff-ignore>',
    '|',
    '</temp>',
    ')'].join(''), 'g')
};

class Format {

  static beautify (rule, source) {
    const config = Object.assign({}, defaults, rules[rule], { source });
    const pretty = prettydiff.mode(config);
    return pretty
  }

  static range (document) {
    const all = document.getText();
    return new vscode.Range(document.positionAt(0), document.positionAt(all.length - 1))
  }

  static ignore (code) {
    return `<temp data-prettydiff-ignore>${code}</temp>`
  }

  static tags (code, open, name, source, close) {
    if (preset.ignore.includes(name)) {
      return Format.ignore(`${code.trim()}`)
    }

    const format = Format.beautify(name, source);
    const output = `${open.trim()}\n\n${format.trim()}\n\n${close.trim()}`;
    return Format.ignore(output.trim())
  }

  static code (document) {
    if (document.match(pattern.frontmatter)) {
      document = document.replace(pattern.frontmatter, Format.ignore);
    }

    const source = document.replace(pattern.tags, Format.tags);
    const output = Format.beautify('html', source);
    return output.replace(pattern.ignore, '')
  }

  static apply (document) {
    const range = Format.range(document);
    const result = Format.code(document.getText(range));
    return {
      range,
      result
    }
  }

  rules (liquid) {
    preset.tags.map(language => {
      if (liquid.beautify[language]) {
        Object.assign(rules[language], liquid.beautify[language]);
      }
    });
  }

  register () {
    vscode.languages.registerDocumentFormattingEditProvider(
      {
        scheme: 'file',
        language: 'html'
      },
      {
        provideDocumentFormattingEdits (document) {
          const { range, result } = Format.apply(document);
          return [vscode.TextEdit.replace(range, `${result.trim()}`)]
        }
      }
    );
  }

  document () {
    const { document } = vscode.window.activeTextEditor;
    const { range, result } = Format.apply(document);
    vscode.window.activeTextEditor.edit(code => code.replace(range, result));
  }

  selection () {
    const { document, selection } = vscode.window.activeTextEditor;
    const format = Format.code(document.getText(selection));
    vscode.window.activeTextEditor.edit(code => code.replace(selection, format));
  }

}

class Document extends Format {

  static notify (message) {
    return vscode.window.showInformationMessage(`Liquid: ${message}`)
  }
  constructor () {
    super();
    this.handler = null;
    this.editor = vscode.window.activeTextEditor;
    this.rules = super.rules(liquid);
  }
  dispose () {
    if (this.handler !== null) {
      this.handler.dispose();
      this.handler = null;
    }
  }
  format () {
    if (!vscode.workspace.getConfiguration('liquid').format) {
      return this.dispose()
    }
    if (!vscode.workspace.getConfiguration('editor').formatOnSave) {
      return this.dispose()
    }
    this.dispose();
    this.handler = super.register();
  }
  enable () {
    liquid.update('format', true, vscode.ConfigurationTarget.Global);
    return Document.notify('Formatting Enabled 💧')
  }
  disable () {
    liquid.update('format', false, vscode.ConfigurationTarget.Global);
    return Document.notify('Formatting Disabled')
  }
  selection () {
    try {
      super.selection();
      Document.notify('Selection Formatted 💧');
    } catch (error) {
      Document.notify('Format Failed! The selection is invalid or incomplete!');
    }
  }
  document () {
    try {
      super.document();
      Document.notify('Document Formatted 💧');
    } catch (error) {
      Document.notify('Document could not be formatted, check your code!');
    }
  }

}

/**
 * # ACTIVATE EXTENSION
 */
exports.activate = context => {
  const active = vscode.window.activeTextEditor;

  if (!active || !active.document) return

  const document = new Document();

  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument(() => {
      document.format();
    }),
    vscode.workspace.onDidChangeConfiguration(() => {
      document.format();
    }),
    vscode.commands.registerCommand(cmd.enable, () => {
      document.enable();
    }),
    vscode.commands.registerCommand(cmd.disable, () => {
      document.disable();
    }),
    vscode.commands.registerCommand(cmd.document, () => {
      document.document();
    }),
    vscode.commands.registerCommand(cmd.selection, () => {
      document.selection();
    })
  );
};
