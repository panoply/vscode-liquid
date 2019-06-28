'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var vscode = require('vscode');
var assign = _interopDefault(require('assign-deep'));
var prettydiff = _interopDefault(require('prettydiff'));
var path = _interopDefault(require('path'));
var fs = _interopDefault(require('fs'));
var chalk = _interopDefault(require('chalk'));

/**
 * Formatting Rules
 *
 * @returns {object}
 */

const { tabSize } = vscode.workspace.getConfiguration('editor');

const Rules = {

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
    brace_block: false,
    ignored: [
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
    ]

  },

  // Schema Tag
  json: {

    // Private Settings
    tags: [
      {
        type: 'liquid',
        begin: 'schema',
        end: 'endschema'
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
const outputChannel = vscode.window.createOutputChannel('Liquid');

/**
 * Liquid configuration settings
 *
 * @returns {object}
 */
const liquidConfig = vscode.workspace.getConfiguration('liquid');

class Config {

  constructor () {

    this.config = Rules;
    this.rcfile = path.join(vscode.workspace.rootPath, '.liquidrc');
    this.isWatching = false;
    this.isError = false;

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

    // Check if using rule file
    if (!liquidConfig.get('useRuleFile')) {

      // Notify output
      outputChannel.appendLine(`💧 'Not using a .liquidrc rule file`);

      // Assign workspace rules
      // Deep assignment
      assign(this.config, liquidConfig.get('formattingRules'));

      return

    }

    // Check for `.liquidrc` rule file
    if (!fs.existsSync(this.rcfile)) return

    try {

      // Read .liquidrc file
      const file = fs.readFileSync(this.rcfile, 'utf8');

      // Parse contents, use html `indent_size` which uses `editor.tabSize`
      const json = JSON.parse(file, null, this.config.html.indent_size);

      this.isError = false;

      // Assign custom configuration to options
      this.config = assign(this.config, json);

    } catch (error) {

      vscode.window.showErrorMessage('An error occured from within the .liquidrc formatting rules file, see the output for more information. 💧');

      outputChannel.appendLine(`💧Liquid: ${error}`);

      return false

    } finally {

      if (!this.isWatching) {

        const watch = vscode.workspace.createFileSystemWatcher(this.rcfile, true, false, false);

        watch.onDidChange(() => this.setFormattingRules());
        watch.onDidDelete(() => this.setFormattingRules());

        outputChannel.appendLine(`💧Liquid: Watching ${this.rcfile}`);

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

      // filters out object without a `liquid_tags` prop, eg: `html`
      if (this.config[language].hasOwnProperty('tags')) {

        this.config[language].tags.map(i => {

          if (i.begin === tag) {

            rules = this.config[language];

          }

        });

      }

    }

    return rules

  }

  fixDeprecatedSettings () {

    if (!fs.existsSync(this.rcfile) && liquidConfig.get('beautify')) {

      if (liquidConfig.get('formatIgnore')) {

        return this.fixDeprecatedIgnore()

      } else {

        return this.fixDeprecatedRules()

      }

    }

  }

  fixDeprecatedIgnore () {

    vscode.window.showInformationMessage(`The "liquid.formatIgnore" workspace setting has been deprecated. Ignored tags are now defined within the html.ignore formatting ruleset and use a new definition schema. Please re-define your ignored tags.`, 'Learn more', 'Next').then((selected) => {

      if (selected === 'Next') {

        liquidConfig.update('formatIgnore', undefined, true);
        return this.fixDeprecatedRules()

      }

      if (selected === 'Learn More') {

        outputChannel.append(``);

      }

    });

  }

  fixDeprecatedRules () {

    vscode.window.showInformationMessage(`Liquid formatting rules can now be defined using a .liquidrc file. Would you like to generate one based on your current beautify ruleset?`,
      `Yes, (Recommended)`,
      'No').then((selected) => {

      const content = {
        html: liquidConfig.beautify.html || liquidConfig.formattingRules.html,
        js: liquidConfig.beautify.javascript || liquidConfig.formattingRules.js,
        scss: liquidConfig.beautify.stylesheet || liquidConfig.formattingRules.scss,
        css: liquidConfig.beautify.stylesheet || liquidConfig.formattingRules.css,
        json: liquidConfig.beautify.schema || liquidConfig.formattingRules.json
      };

      if (selected !== 'No') {

        const json = JSON.stringify(content, null, 2);

        fs.writeFile(this.rcfile, json, (error) => {

          if (error) {

            outputChannel.appendLine(`${error}`);

            return vscode.window.showErrorMessage('An error occured while generating the .liquidrc rule file.', 'Details', () => outputChannel.show())

          }

        });

      } else {

        liquidConfig.update('formattingRules', content, true);

      }

      liquidConfig.update('beautify', undefined, true);

    });

  }

}

class Pattern extends Config {

  constructor () {

    super();

    this.pattern = {};
    this.frontmatter = new RegExp(`---(?:[^]*?)---`, 'g');

  }

  getPatterns () {

    this.getdocumentTagsPattern();
    this.getIgnoreTagsPattern();

  }

  getdocumentTagsPattern () {

    const language = [];

    for (let lang in this.config) {

      this.config[lang].hasOwnProperty('tags') && this.config[lang].tags.map(({
        type,
        begin,
        end
      }) => {

        if (!type) {

          return outputChannel.appendLine(`💧Tag is missing "type" property`)

        }

        language.push(Pattern.captures(type, begin, end));

      });

    }

    this.pattern.tags = language;

  }

  getIgnoreTagsPattern () {

    const ignore = [];

    this.config.html.ignored.map(({
      type,
      begin,
      end
    }) => {

      if (!type) {

        return outputChannel.appendLine(`💧Ignored tag is missing "type" property`)

      }

      ignore.push(Pattern.captures(type, begin, end));

    });

    this.pattern.ignored = ignore;

  }

  static captures (type, begin, end) {

    const pattern = {

      html: `(<(${begin})>)([^]*?)(</${end}>)`,
      liquid: `({%-?\\s*(${begin}).*?\\s*-?%})([^]*?)({%-?\\s*${end}\\s*-?%})`

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

        document = document.replace(this.pattern.ignored[i], Format.ignore);

      }

    }

    for (let i = 0; i < this.pattern.tags.length; i++) {

      if (document.match(this.pattern.tags[i])) {

        document = document.replace(this.pattern.tags[i], this.tagCaptures.bind(this));

      }

    }

    document = this.beautify('html', document);

    const remove = new RegExp(`(<temp data-prettydiff-ignore>|</temp>)`, 'g');

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
    const pad = prettydiff.options.brace_block ? `\n\n` : `\n`;
    const output = `${open}${pad}${format}${pad}${close}`;

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

        return outputChannel.appendLine(`💧${prettydiff.sparser.parseerror}`)

      }

      return content

    } catch (error) {

      if (prettydiff.sparser.parseerror.length > 0) {

        outputChannel.appendLine(`💧${prettydiff.sparser.parseerror}`);

      }

      throw outputChannel.appendLine(chalk`💧{red ${error}}`)

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

  /**
   * @param {string} code
   */
  static ignore (code) {

    return `<temp data-prettydiff-ignore>${code}</temp>`

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
    this.bar = vscode.StatusBarItem;
    this.bar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, -2);
    this.isFormat = liquidConfig.format;
    this.fixDeprecatedSettings();
    this.init();

  }

  init () {

    this.setFormattingRules();
    this.getPatterns();

  }

  format () {

    const { fileName, languageId } = vscode.window.activeTextEditor.document;

    if (this.handler.hasOwnProperty(fileName)) {

      this.handler[fileName].dispose();

    }

    if (languageId !== 'html') {

      this.bar.hide();

      return

    }

    if (!vscode.workspace.getConfiguration('editor').formatOnSave) {

      this.isFormat = false;

    }

    if (!this.isFormat) {

      Object.assign(this.bar, {
        text: `💧Liquid: $(x)`,
        command: 'liquid.enableFormatting'
      });

      this.dispose();

      this.bar.show();

      return

    }

    if (super.isError) {

      assign(this.bar, {
        text: `⚠️ Liquid: $(x)`,
        command: 'liquid.toggleOutput'
      });

      this.dispose();
      this.bar.show();

      return

    }

    this.handler[fileName] = vscode.languages.registerDocumentFormattingEditProvider({
      scheme: 'file',
      language: 'html'
    }, {
      provideDocumentFormattingEdits: this.provider.bind(this)
    });

    Object.assign(this.bar, {
      text: `💧Liquid: $(check)`,
      command: 'liquid.disableFormatting'
    });

    this.bar.show();

  }

  selection () {

    try {

      super.selection();
      vscode.window.showInformationMessage('Selection Formatted 💧');

    } catch (error) {

      vscode.window.showInformationMessage('Format Failed! The selection is invalid or incomplete!');

    }

  }

  document () {

    try {

      super.document();
      vscode.window.showInformationMessage('Document Formatted 💧');

    } catch (error) {

      console.log(error);
      vscode.window.showInformationMessage('Document could not be formatted, check your code!');

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

    await liquidConfig.update('format', this.isFormat, vscode.ConfigurationTarget.Global)
    .then(() => this.init())
    .then(() => this.format())
    .then(() => vscode.window.showInformationMessage('Formatting Enabled 💧'));

  }

  async disable () {

    this.isFormat = false;

    await liquidConfig.update('format', this.isFormat, vscode.ConfigurationTarget.Global)
    .then(() => this.dispose())
    .then(() => this.init())
    .then(() => this.format())
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

  sub.push(vscode.window.onDidChangeActiveTextEditor(document.format.bind(document)));
  sub.push(vscode.workspace.onDidOpenTextDocument(document.format.bind(document)));
  sub.push(vscode.workspace.onDidChangeConfiguration(document.init.bind(document)));
  sub.push(registerCommand('liquid.disableFormatting', document.disable.bind(document)));
  sub.push(registerCommand('liquid.enableFormatting', document.enable.bind(document)));
  sub.push(registerCommand('liquid.toggleOutput', outputChannel.show()));
  sub.push(registerCommand('liquid.formatDocument', document.document.bind(document)));
  sub.push(registerCommand('liquid.formatSelection', document.selection.bind(document)));

};
