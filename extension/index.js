'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var vscode = require('vscode');
var prettydiff = _interopDefault(require('prettydiff'));
var assign = _interopDefault(require('assign-deep'));
var path = _interopDefault(require('path'));
var fs = _interopDefault(require('fs'));

/**
 * Formatting Rules
 *
 * @returns {object}
 */

const { tabSize } = vscode.workspace.getConfiguration('editor');

const Rules = {

  // Ignored Tags
  ignore: [
    {
      type: 'liquid',
      begin: 'comment',
      end: 'endcomment'
    },
    {
      type: 'html',
      begin: 'script',
      end: 'script'
    },
    {
      type: 'html',
      begin: 'style',
      end: 'style'
    }
  ],

  // HTML + Liquid
  html: {

    mode: 'beautify',
    end_quietly: 'log',
    node_error: true,
    summary_only: true,
    language_name: 'Liquid',
    language: 'html',
    lexer: 'markup',

    // Editor Specific
    indent_size: tabSize,

    // Exposed Default Rules
    correct: true,
    force_attribute: false,
    braces: false,
    preserve: 1,

    // Custom Rules
    brace_block: false

  },

  // Schema Tag
  json: {

    // Private Settings
    tags: [
      {
        type: 'liquid',
        begin: 'schema',
        end: 'endschema'
      },
      {
        type: 'html',
        begin: 'script\\s+type="application\\/json"',
        end: 'script'
      }
    ],

    // Enforced
    mode: 'beautify',
    end_quietly: 'log',
    node_error: true,
    language_name: 'json',
    language: 'JSON',
    lexer: 'script',

    // Editor Specific
    indent_size: tabSize,

    // Exposed Default Rules
    format_array: 'indent',
    preserve: 0,
    braces: true,
    no_semicolon: true,

    // Custom Rules
    brace_block: false

  },

  // StyleSheet Tag
  scss: {

    // Settings
    tags: [
      {
        type: 'liquid',
        begin: 'stylesheet \'scss\'',
        end: 'endstylesheet'
      }
    ],

    // Enforced
    mode: 'beautify',
    end_quietly: 'log',
    node_error: true,
    language_name: 'SASS',
    language: 'scss',
    lexer: 'style',

    // Editor Specific
    indent_size: tabSize,

    // Exposed Default Rules
    css_insert_lines: true,
    preserve: 2,
    braces: false,

    // Custom Rules
    brace_block: false

  },

  // Style Tag
  css: {

    // Settings
    tags: [
      {
        type: 'liquid',
        begin: 'stylesheet',
        end: 'endstylesheet'
      },
      {
        type: 'liquid',
        begin: 'style',
        end: 'endstyle'
      }
    ],

    // Enforced
    language_name: 'CSS',
    language: 'css',

    // Editor Specific
    indent_size: tabSize,

    // Exposed Default Rules
    css_insert_lines: true,
    preserve: 2,
    braces: false,

    // Custom Rules
    brace_block: false
  },

  // JavaScript Tag
  js: {

    // Settings
    tags: [
      {
        type: 'liquid',
        begin: 'javascript',
        end: 'endjavascript'
      }
    ],

    // Enforced
    mode: 'beautify',
    end_quietly: 'log',
    node_error: true,
    language_name: 'JavaScript',
    language: 'javascript',
    lexer: 'script',

    // Editor Specific
    indent_size: tabSize,

    // Exposed Default Rules
    preserve: 1,
    method_chain: 0,
    quote_convert: 'single',
    format_array: 'indent',
    format_object: 'indent',
    braces: false,
    no_semicolon: false,

    // Custom Rules
    brace_block: false

  }

};

/**
 * Output Channel
 *
 * @returns {ui}
 */
const outputChannel$1 = vscode.window.createOutputChannel('Liquid');

class Utils {

  constructor () {

    this.barItem = vscode.StatusBarItem;
    this.barError = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, -3);
    this.barItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, -2);
    this.outputCommand = false;

  }

  output () {

    return outputChannel$1.show()

  }

  /**
   * Status bar item state
   *
   * @param {string} enabled, disabled or error
   */
  statusBarItem (type, show, count) {

    if (this.barItem === undefined) return

    if (type === 'enabled') {

      this.barItem.text = `💧Liquid: $(check)`;
      this.barItem.tooltip = `Enable/Disable Liquid Formatting`;
      this.barItem.command = 'liquid.disableFormatting';

    }

    if (type === 'disabled') {

      this.barItem.text = `💧Liquid: $(x)`;
      this.barItem.command = 'liquid.enableFormatting';

    }

    if (type === 'error') {

      this.barItem.text = `⚠️ Liquid: $(x)`;
      this.barItem.tooltip = `Errors`;
      this.barItem.command = 'liquid.toggleOutput';

    }

    if (show === undefined) return

    if (show) {

      this.barItem.show();

    } else {

      this.barItem.false();

    }

  }

  outputLog ({ title, message, file, show }) {

    const date = new Date().toLocaleString();
    const prefix = `[${date}] ${title}`;
    const msg = !file ? message : this.addFilePath(message, file);

    // Apply a date title to the output
    outputChannel$1.appendLine(`${prefix}: ${msg}`);

    if (show) {

      this.error = true;
      this.statusBarItem('error');
      outputChannel$1.show();

    }

  }

  addFilePath (message, fileName) {

    const lines = message.split('\n');

    if (lines.length > 0) {

      lines[0] = lines[0].replace(/(\d*):(\d*)/g, `${fileName}:$1:$2`);
      return lines.join('\n')

    }

    return message

  }

}

class Config extends Utils {

  constructor () {

    super();

    this.config = Rules;
    this.rcfile = path.join(vscode.workspace.rootPath, '.liquidrc');
    this.isWatching = false;
    this.error = false;

  }

  /**
   * Rules
   *
   * Defines where formatting rules are sourced.
   * Looks for rules defined .liquirc file and if
   * no liquidrc file will look in workspace settings.
   *
   * @return {Object}
   *
   */
  setFormattingRules () {

    const liquid = vscode.workspace.getConfiguration('liquid');

    // Check if using rule file
    if (!liquid.get('useRuleFile')) {

      // Deep assignment
      assign(this.config, liquid.rules);

      return

    }

    // Check for `.liquidrc` rule file
    if (!fs.existsSync(this.rcfile)) return

    try {

      // Read .liquidrc file
      const file = fs.readFileSync(this.rcfile, 'utf8');

      // Parse contents, use html `indent_size` which uses `editor.tabSize`
      const json = JSON.parse(file, null, this.config.html.indent_size);

      this.error = false;

      // Assign custom configuration to options
      this.config = assign(this.config, json);

    } catch (error) {

      this.outputLog({
        title: 'Error reading formatting rules',
        file: this.rcfile,
        message: error.message,
        show: true
      });

    } finally {

      if (!this.isWatching) {

        const watch = vscode.workspace.createFileSystemWatcher(this.rcfile, true, false, false);

        watch.onDidChange(() => this.setFormattingRules());
        watch.onDidDelete(() => this.setFormattingRules());

        this.isWatching = true;

      }

    }

  }

  /**
   * Returns formatting rules based on
   * matching `liquid_tags` value
   *
   * @param {string} tag
   */
  getRuleByTagName (tag) {

    // skip iteration if tag equals html
    if (tag === 'html') return this.config.html

    let rules;

    // loop over each language prop
    for (let language in this.config) {

      if (language !== 'ignore' || language !== 'html') {

        // filters out object without a `tags` prop, eg: `html`
        if (this.config[language].hasOwnProperty('tags')) {

          this.config[language].tags.map(i => {

            if (i.begin === tag) {

              rules = this.config[language];

            }

          });

        }

      }

    }

    return rules

  }

  fixDeprecatedSettings () {

    const liquid = vscode.workspace.getConfiguration('liquid');

    if (!fs.existsSync(this.rcfile) && liquid.get('beautify')) {

      if (liquid.get('formatIgnore')) {

        return this.fixDeprecatedIgnore(liquid)

      } else {

        return this.fixDeprecatedRules(liquid)

      }

    }

  }

  fixDeprecatedIgnore (liquid) {

    vscode.window.showInformationMessage('Do you want to continue?', {
      modal: true
    }, 'Yes', 'No');

    vscode.window.showInformationMessage(`The "liquid.formatIgnore" workspace setting has been deprecated. Ignored tags are now defined within the html.ignore formatting ruleset and use a new definition schema. Please re-define your ignored tags.`, 'Learn more', 'Next').then((selected) => {

      if (selected === 'Next') {

        liquid.update('formatIgnore', undefined, true);
        return this.fixDeprecatedRules(liquid)

      }

      if (selected === 'Learn More') {

        outputChannel$1.append(``);

      }

    });

  }

  fixDeprecatedRules (liquid) {

    vscode.window.showInformationMessage(`Liquid formatting rules can now be defined using a .liquidrc file. Would you like to generate one based on your current beautify ruleset?`,
      `Yes, (Recommended)`,
      'No').then((selected) => {

      const content = {
        ignore: liquid.rules.ignore,
        html: liquid.beautify.html || liquid.rules.html,
        js: liquid.beautify.javascript || liquid.rules.js,
        scss: liquid.beautify.stylesheet || liquid.rules.scss,
        css: liquid.beautify.stylesheet || liquid.rules.css,
        json: liquid.beautify.schema || liquid.rules.json
      };

      if (selected !== 'No') {

        const json = JSON.stringify(content, null, 2);

        fs.writeFile(this.rcfile, json, (error) => {

          if (error) {

            outputChannel$1.appendLine(`${error}`);

            this.outputLog({
              title: 'Error generating rules',
              file: this.rcfile,
              message: error.message
            });
            return vscode.window.showErrorMessage('An error occured while generating the .liquidrc rule file.', 'Details', () => outputChannel$1.show())

          }

        });

      } else {

        liquid.update('rules', content, true);

      }

      liquid.update('beautify', undefined, true);

    });

  }

}

class Pattern extends Config {

  constructor () {

    super();

    this.pattern = {};
    this.frontmatter = new RegExp(/---(?:[^]*?)---/, 'g');
    this.denotations = new RegExp(/(?=(<|<\/|{%-?|{{-?\s+))/, 'g');

  }

  getPatterns () {

    this.getdocumentTagsPattern();
    this.getIgnoreTagsPattern();

  }

  getdocumentTagsPattern () {

    const language = [];

    for (let lang in this.config) {

      if (language !== 'ignore' || language !== 'html') {

        this.config[lang].hasOwnProperty('tags') && this.config[lang].tags.map(({
          type,
          begin,
          end
        }) => {

          if (!type) {

            this.outputLog({
              title: `Error parsing "${lang} > tags > type" rule`,
              show: true,
              message: `Ignored tag has a missing or invalid "type" property at ${type}`
            });

          }

          if (begin.match(this.denotations) || end.match(this.denotations)) {

            this.outputLog({
              title: `Error parsing "${lang} > tags" rule`,
              show: true,
              message: `Do not denote tag associations. The begin and end pattern restricts ${this.denotations}expressions.`
            });

          }

          language.push(Pattern.captures(type, begin, end));

        });

      }

    }

    this.pattern.tags = language;

  }

  getIgnoreTagsPattern () {

    const ignore = [];

    this.config.ignore.map(({
      type,
      begin,
      end
    }) => {

      if (!type) {

        this.outputLog({
          title: `Error parsing "ignore > type" rule`,
          show: true,
          message: `Ignored tag has a missing or invalid "type" property at ${type}`
        });

      }

      // if user includes denotations
      if (begin.match(this.denotations) || end.match(this.denotations)) {

        this.outputLog({
          title: 'Error parsing "ignore" rule',
          show: true,
          message: `Do not denote ignored tag captures. The begin and end pattern restricts ${this.denotations} expressions.`
        });

      }

      // Apply captures
      ignore.push(Pattern.captures(type, begin, end));

    });

    const prefix = `liquid-formatting`;

    ignore.push(Pattern.captures('html_comment', `${prefix}-disable`, `${prefix}-enable`));
    ignore.push(Pattern.captures('js_comment', `${prefix}-disable`, `${prefix}-enable`));

    this.pattern.ignored = ignore;

  }

  static captures (type, begin, end) {

    const pattern = {

      html: `(<(${begin})>)([^]*?)(</${end}>)`,
      liquid: `({%-?\\s*(${begin}).*?\\s*-?%})([^]*?)({%-?\\s*${end}\\s*-?%})`,
      html_comment: `(<!--\\s*(${begin})\\s*-->)([^]*?)(<!--\\s*${end}\\s*-->)`,
      js_comment: `(\\/\\*\\s*(${begin})\\s*\\*\\/)([^]*?)(\\/\\*\\s*${end}\\s*\\*\\/)`

    }[type];

    const expression = new RegExp(pattern, 'g');

    return expression

  }

}

class Format extends Pattern {

  /**
   * Fromatting Provider
   *
   * @returns
   */
  provider (document) {

    if (!this.error) {

      this.statusBarItem('enabled');

    }

    const { range, result } = this.apply(document);

    return [
      vscode.TextEdit.replace(range, `${result.trim()}`)
    ]

  }

  /**
   * Range and Result
   *
   * @param {object} document
   */
  apply (document) {

    const range = Format.range(document);
    const result = this.code(document.getText(range));

    return {
      range,
      result
    }

  }

  /**
 * Apply Formatting
 *
 * @param {object} document
 */
  code (document) {

    if (document.match(this.frontmatter)) {

      document = document.replace(this.frontmatter, Format.ignore);

    }

    for (let i = 0; i < this.pattern.ignored.length; i++) {

      if (document.match(this.pattern.ignored[i])) {

        document = document.replace(this.pattern.ignored[i], Format.ignoreReplace);

      }

    }

    for (let i = 0; i < this.pattern.tags.length; i++) {

      if (document.match(this.pattern.tags[i])) {

        document = document.replace(this.pattern.tags[i], this.tagCaptures.bind(this));

      }

    }

    document = this.beautify('html', document);
    console.log(document);

    const remove = new RegExp(`(<div data-prettydiff-ignore>|</div>)`, 'g');

    if (document.match(remove)) {

      document = document.replace(remove, '');

    }

    return document

  }

  /**
   * @param {string} code
   * @param {string} open
   * @param {string} name
   * @param {string} source
   * @param {string} close
   */
  tagCaptures (
    code,
    open,
    name,
    source,
    close
  ) {

    const format = this.beautify(name, source);
    const newline = prettydiff.options.brace_block ? `\n\n` : `\n`;
    const output = open + newline + format + newline + close;

    return Format.ignore(output)

  }

  /**
   * @param {string} rule
   * @param {string} source
   */
  beautify (name, source) {

    let content = '';

    try {

      let rules = this.getRuleByTagName(name);

      prettydiff.options = Object.assign(prettydiff.options, rules, {
        source
      });

      content = prettydiff();

      if (prettydiff.sparser.parseerror.length > 0) {

        this.statusBarItem('error');

        return this.outputLog({
          title: 'PrettyDiff',
          message: `${prettydiff.sparser.parseerror}`
        })

      }

      return content

    } catch (error) {

      if (prettydiff.sparser.parseerror.length > 0) {

        this.outputLog({
          title: 'PrettyDiff',
          message: `${prettydiff.sparser.parseerror}`
        });

      }

      return this.outputLog({
        title: 'Error',
        message: `${error.message}`
      })

    }

  }

  /**
   * @param {object} document
   */
  static range (document) {

    const range = document.getText().length - 1;
    const first = document.positionAt(0);
    const last = document.positionAt(range);

    return new vscode.Range(first, last)

  }

  static ignoreReplace (
    code,
    open,
    name,
    source,
    close
  ) {

    const output = `<div data-prettydiff-ignore>` + source + `</div>`;

    return Format.ignore(output)

  }
  /**
   * @param {string} code
   */
  static ignore (code) {

    return `<div data-prettydiff-ignore>${code}</div>`

  }

  /**
   * Document Formatting
   *
   * @returns
   */
  document () {

    const { document } = vscode.window.activeTextEditor;
    const { range, result } = this.apply(document);

    vscode.window.activeTextEditor.edit(code => code.replace(range, result));

  }

  /**
   * Selection Formatting
   *
   * @returns
   */
  selection () {

    const { document, selection } = vscode.window.activeTextEditor;
    const format = this.code(document.getText(selection));

    vscode.window.activeTextEditor.edit(code => code.replace(selection, format));

  }

}

class Document extends Format {

  constructor () {

    super();

    this.handler = {};
    this.liquidConfig = vscode.workspace.getConfiguration('liquid');
    this.isFormat = this.liquidConfig.format;
    this.fixDeprecatedSettings();
    this.setFormattingRules();
    this.getPatterns();

  }

  onConfigChanges () {

    this.error = false;
    this.setFormattingRules();
    this.getPatterns();
    this.onOpenTextDocument();

  }

  onOpenTextDocument () {

    const { fileName, languageId } = vscode.window.activeTextEditor.document;

    if (this.error) {

      this.statusBarItem('error', true);

    }

    // Skip if log
    if (languageId === 'Log') return

    // Hide status bar item if not HTML and return the provider early
    if (languageId !== 'html') {

      this.dispose();
      this.barItem.hide();

      return

    }

    // If formatOnSave editor option is false, apply its state to Liquid formatter
    if (!vscode.workspace.getConfiguration('editor').formatOnSave) {

      this.isFormat = false;

    }

    // Formatter is set to false, skip it
    if (!this.isFormat) {

      // Show disabled formatter status bar
      this.dispose();
      this.statusBarItem('disabled', true);

      return

    }

    // Disposal of match filename handler
    if (this.handler.hasOwnProperty(fileName)) {

      this.handler[fileName].dispose();

    }

    this.statusBarItem('enabled', true);

    this.handler[fileName] = vscode.languages.registerDocumentFormattingEditProvider({
      scheme: 'file',
      language: 'html'
    }, {
      provideDocumentFormattingEdits: this.provider.bind(this)
    });

  }

  selection () {

    try {

      super.selection();
      vscode.window.showInformationMessage('Selection Formatted 💧');

    } catch (error) {

      vscode.window.showInformationMessage('Format Failed! The selection is invalid or incomplete!');
      throw outputChannel.appendLine(`💧Liquid: ${error}`)

    }

  }

  document () {

    try {

      super.document();
      vscode.window.showInformationMessage('Document Formatted 💧');

    } catch (error) {

      vscode.window.showInformationMessage('Document could not be formatted, check your code!');
      throw outputChannel.appendLine(`💧Liquid: ${error}`)

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

    this.isFormat = true;

    await this.liquidConfig.update('format', this.isFormat, vscode.ConfigurationTarget.Global)
    .then(() => this.onConfigChanges())
    .then(() => vscode.window.showInformationMessage('Formatting Enabled 💧'));

  }

  async disable () {

    this.isFormat = false;

    await this.liquidConfig.update('format', this.isFormat, vscode.ConfigurationTarget.Global)
    .then(() => this.dispose())
    .then(() => this.onConfigChanges())
    .then(() => vscode.window.showInformationMessage('Formatting Disabled 💧'));

  }

}

const { registerCommand } = vscode.commands;

/**
 * # ACTIVATE EXTENSION
 */
exports.activate = context => {

  const sub = context.subscriptions;
  const active = vscode.window.activeTextEditor;

  if (!active || !active.document) return

  const document = new Document();

  // Workspace
  sub.push(vscode.workspace.onDidChangeConfiguration(document.onConfigChanges.bind(document)));
  sub.push(vscode.workspace.onDidOpenTextDocument(document.onOpenTextDocument.bind(document)));

  // Commands
  sub.push(registerCommand('liquid.disableFormatting', document.disable.bind(document)));
  sub.push(registerCommand('liquid.enableFormatting', document.enable.bind(document)));
  sub.push(registerCommand('liquid.formatDocument', document.document.bind(document)));
  sub.push(registerCommand('liquid.formatSelection', document.selection.bind(document)));
  sub.push(registerCommand('liquid.toggleOutput', document.output.bind(document)));

};
