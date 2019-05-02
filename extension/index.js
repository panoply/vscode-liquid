'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var vscode = require('vscode');
var prettydiff = _interopDefault(require('prettydiff'));

/**
 * Tag Presets
 */
const preset = [
  'javascript',
  'stylesheet',
  'schema',
  'style'
];

/**
 * Ignored Tags
 */
const ignore = [
  'comment',
  'script'
].concat(vscode.workspace.getConfiguration('liquid').formatIgnore || []);

/**
 * PrettyDiff Formatting Rules
 */
const rules = {
  html: {
    mode: 'beautify',
    language_name: 'Liquid',
    language: 'html',
    lexer: 'markup',
    correct: true,
    preserve: 1,
    indent_size: vscode.workspace.getConfiguration('editor').tabSize,
    end_quietly: 'log',
    node_error: true
  },
  schema: {
    mode: 'beautify',
    language: 'JSON',
    language_name: 'json',
    lexer: 'script',
    indent_size: vscode.workspace.getConfiguration('editor').tabSize
  },
  stylesheet: {
    mode: 'beautify',
    language_name: 'SASS',
    language: 'scss',
    lexer: 'style',
    preserve: 1,
    indent_size: vscode.workspace.getConfiguration('editor').tabSize
  },
  javascript: {
    mode: 'beautify',
    language_name: 'JavaScript',
    language: 'javascript',
    lexer: 'script',
    preserve: 1,
    indent_size: vscode.workspace.getConfiguration('editor').tabSize
  }
};

/**
 * HTML/Liquid Tag Parser
 */
const matches = {
  frontmatter: [
    '---',
    '(?:[^]*?)',
    '---'
  ],
  tags: [
    '(',
    '(?:<|{%-?)\\s*',
    `\\b(${preset.concat(ignore).join('|')})\\b`,
    '(?:.|\\n)*?\\s*',
    '(?:>|-?%})\\s*',
    ')',
    '(',
    '(?:.|\\n)*?',
    ')',
    '(',
    '(?:</|{%-?)\\s*',
    '\\b(?:(?:|end)\\2)\\b',
    '\\s*(?:>|-?%})',
    ')'
  ],
  ignore: [
    '(',
    '<temp data-prettydiff-ignore>',
    '|',
    '</temp>',
    ')'
  ]
};

/**
 * Expression Helpers
 */
var pattern = {
  frontmatter: new RegExp(matches.frontmatter.join(''), 'g'),
  tags: new RegExp(matches.tags.join(''), 'g'),
  ignore: new RegExp(matches.ignore.join(''), 'g')
};

class Format {

  /**
   * @param {string} rule
   * @param {string} source
   */
  static beautify (rule, source) {

    prettydiff.options = Object.assign(prettydiff.options, rules[rule], {
      source
    });

    return prettydiff()

  }

  /**
   * @param {object} document
   */
  static range (document) {

    const first = document.positionAt(0);
    const last = document.positionAt(document.getText().length - 1);

    return new vscode.Range(first, last)

  }

  /**
   * @param {string} code
   */
  static ignores (code) {

    return `<temp data-prettydiff-ignore>${code}</temp>`

  }

  /**
   * @param {string} code
   * @param {string} open
   * @param {string} name
   * @param {string} source
   * @param {string} close
   */
  static tags (code, open, name, source, close) {

    if (ignore.includes(name)) {

      return Format.ignores(`${code.trim()}`)

    }

    const format = Format.beautify(name, source);
    const output = `${open.trim()}\n\n${format.trim()}\n\n${close.trim()}`;

    return Format.ignores(output.trim())

  }

  /**
   * @param {object} document
   */
  static code (document) {

    if (document.match(pattern.frontmatter)) {

      document = document.replace(pattern.frontmatter, Format.ignores);

    }

    // Beautification
    const source = document.replace(pattern.tags, Format.tags);
    const output = Format.beautify('html', source);
    const result = output.replace(pattern.ignore, '');

    return result

  }

  /**
   * @param {object} document
   */
  static apply (document) {

    const range = Format.range(document);
    const result = Format.code(document.getText(range));

    return {
      range,
      result
    }

  }

  /**
   * Constructor
   */
  constructor () {

    this.scheme = {
      scheme: 'file',
      language: 'html'
    };

  }

  /**
   * @param {object} liquid
   */
  rules (liquid) {

    preset.map(language => {

      if (liquid.beautify[language]) {

        Object.assign(rules[language], liquid.beautify[language]);

      }

    });

  }

  /**
   * @returns
   */
  register () {

    return vscode.languages.registerDocumentFormattingEditProvider(this.scheme, {
      provideDocumentFormattingEdits (document) {

        const { range, result } = Format.apply(document);
        return [ vscode.TextEdit.replace(range, `${result.trim()}`) ]

      }
    })

  }

  /**
   * @returns
   */
  document () {

    const { document } = vscode.window.activeTextEditor;
    const { range, result } = Format.apply(document);

    vscode.window.activeTextEditor.edit(code => code.replace(range, result));

  }

  /**
   * @returns
   */
  selection () {

    const { document, selection } = vscode.window.activeTextEditor;
    const format = Format.code(document.getText(selection));

    vscode.window.activeTextEditor.edit(code => code.replace(selection, format));

  }

}

class Document extends Format {

  static notify (message) {

    return vscode.window.showInformationMessage(`Liquid ${message}`)

  }

  constructor () {

    super();
    this.handler = {};
    this.run = vscode.workspace.getConfiguration('liquid').format;
    this.bar = vscode.StatusBarItem;
    this.bar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, -2);
    this.rules = super.rules(vscode.workspace.getConfiguration('liquid'));

  }

  format () {

    const { fileName, languageId } = vscode.window.activeTextEditor.document;

    if (!vscode.workspace.getConfiguration('editor').formatOnSave) {

      this.run = false;

      return this.run

    }

    if (this.run) {

      try {

        if (fileName && this.handler.hasOwnProperty(fileName)) {

          this.handler[fileName].dispose();

        }

        this.handler[fileName] = super.register();

        Object.assign(this.bar, {
          text: `💧Liquid: $(check)`,
          command: 'liquid.disableFormatting'
        });

      } catch (error) {

        console.error(error);
        Document.notify('Error registering the formatter, re-open the file 💧');

      }

    }
    if (!this.run) {

      Object.assign(this.bar, {
        text: `💧Liquid: $(x)`,
        command: 'liquid.enableFormatting'
      });

    }
    if (languageId === 'html') {

      this.bar.show();

    } else {

      this.bar.hide();

    }

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

      console.log(error);
      Document.notify('Document could not be formatted, check your code!');

    }

  }

  dispose () {

    for (const key in this.handler) {

      if (this.handler.hasOwnProperty(key)) {

        this.handler[key].dispose();

      }

    }

  }

  async enable () {

    this.run = true;
    await vscode.workspace
      .getConfiguration('liquid')
      .update('format', this.run, vscode.ConfigurationTarget.Global)
      .then(() => this.format())
      .then(() => Document.notify('Formatting Enabled 💧'));

  }
  async disable () {

    this.run = false;
    await vscode.workspace
      .getConfiguration('liquid')
      .update('format', this.run, vscode.ConfigurationTarget.Global)
      .then(() => this.dispose())
      .then(() => Document.notify('Formatting Disabled 💧'));

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

    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand('liquid.disableFormatting', () => {

      document.disable();

    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand('liquid.enableFormatting', () => {

      document.enable();

    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand('liquid.formatDocument', () => {

      document.document();

    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand('liquid.formatSelection', () => {

      document.selection();

    })
  );

};
