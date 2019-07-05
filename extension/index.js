'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var vscode = require('vscode');
var prettydiff = _interopDefault(require('prettydiff'));
var assign = _interopDefault(require('assign-deep'));
var path = _interopDefault(require('path'));
var fs = _interopDefault(require('fs'));

/**
 * Utilities frequently used by the extension
 *
 * @class Utils
 */
class Utils {

  constructor () {

    this.barItem = vscode.StatusBarItem;
    this.barItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, -2);
    this.outputChannel = vscode.window.createOutputChannel('Liquid');

  }

  /**
   * The status bar item functionality
   *
   * @param {"string"} type the type of status bar item to show
   * @param {"string"} [show] show/hide the status bar item (optional)
   * @memberof Utils
   */
  statusBarItem (type, show) {

    const types = {

      enabled: {
        text: `💧Liquid: $(check)`,
        tooltip: `Enable/Disable Liquid Formatting`,
        command: 'liquid.disableFormatting'
      },
      disabled: {
        text: `💧Liquid: $(x)`,
        tooltip: `Enable Liquid Formatting`,
        command: 'liquid.enableFormatting'
      },
      error: {
        text: `⚠️ Liquid: $(check)`,
        tooltip: `Errors detected! Toggle output`,
        command: 'liquid.toggleOutput'
      }
    };

    Object.assign(this.barItem, types[type]);

    if (show !== undefined) {

      return show ? this.barItem.show() : this.barItem.false()

    }

  }

  outputLog ({ title, message, file, show }) {

    const date = new Date().toLocaleString();

    // Apply a date title to the output
    this.outputChannel.appendLine(`[${date}] ${title}: ${message}`);

    if (show) {

      this.error = true;
      this.statusBarItem('error');
      this.outputChannel.show();

    }

  }

}

/**
 * Tag Associations (Enforced)
 */
const TagAssociations = {

  css: [
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
  scss: [
    {
      type: 'liquid',
      begin: 'stylesheet \'scss\'',
      end: 'endstylesheet'
    }
  ],
  js: [
    {
      type: 'liquid',
      begin: 'javascript',
      end: 'endjavascript'
    }
  ],
  json: [
    {
      type: 'liquid',
      begin: 'schema',
      end: 'endschema'
    }
  ]

};

/**
 * Formatting Rules (Enforced)
 */
const FormattingRules = {

  // Ignored Tags
  ignore: [],

  // HTML + Liquid
  html: {

    mode: 'beautify',
    end_quietly: 'log',
    node_error: true,
    summary_only: true,
    language_name: 'Liquid',
    language: 'html',
    lexer: 'markup',
    tag_sort: false,

    // Editor Specific
    indent_size: vscode.workspace.getConfiguration('editor').tabSize,

    // Exposed Default Rules
    correct: false,
    unformatted: false,
    force_attribute: false,
    braces: false,
    preserve: 1,
    quote_convert: 'double',

    // Custom Rules
    brace_block: false

  },

  // Schema Tag
  json: {

    // Enforced
    mode: 'beautify',
    end_quietly: 'log',
    node_error: true,
    language_name: 'json',
    language: 'JSON',
    lexer: 'script',

    // Editor Specific
    indent_size: vscode.workspace.getConfiguration('editor').tabSize,

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

    // Enforced
    mode: 'beautify',
    end_quietly: 'log',
    node_error: true,
    language_name: 'SASS',
    language: 'scss',
    lexer: 'style',

    // Editor Specific
    indent_size: vscode.workspace.getConfiguration('editor').tabSize,

    // Exposed Default Rules
    css_insert_lines: true,
    preserve: 2,
    braces: false,

    // Custom Rules
    brace_block: false

  },

  // Style Tag
  css: {

    // Enforced
    mode: 'beautify',
    end_quietly: 'log',
    node_error: true,
    language_name: 'CSS',
    language: 'css',

    // Editor Specific
    indent_size: vscode.workspace.getConfiguration('editor').tabSize,

    // Exposed Default Rules
    css_insert_lines: true,
    preserve: 2,
    braces: false,

    // Custom Rules
    brace_block: false
  },

  // JavaScript Tag
  js: {

    // Enforced
    mode: 'beautify',
    end_quietly: 'log',
    node_error: true,
    language_name: 'JavaScript',
    language: 'javascript',
    lexer: 'script',

    // Editor Specific
    indent_size: vscode.workspace.getConfiguration('editor').tabSize,

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
 * Applies custom configuration settings used
 * by the extension.
 *
 * @class Config
 * @extends Utils
 */

class Config extends Utils {

  constructor () {

    super();

    // Configuration
    this.config = FormattingRules;
    this.tagAssociates = TagAssociations;

    // Applied Configuration
    this.liquid = vscode.workspace.getConfiguration('liquid');
    this.format = this.liquid.get('format');
    this.rcfile = path.join(vscode.workspace.rootPath, '.liquidrc');

    // Conditional Executors
    this.watch = false;
    this.error = false;
    this.reset = false;

  }

  /**
   * Defines where formatting rules are sourced.
   * Looks for rules defined in a `.liquirc` file and if
   * no file present will default to workspace settings configuration.
   *
   */
  setFormattingRules () {

    // Look for `liquidrc` file
    if (!fs.existsSync(this.rcfile)) {

      // Get latest config option of Liquid
      const liquid = vscode.workspace.getConfiguration('liquid');
      const rules = liquid.get('rules');
      const tags = this.setTagAssociates(rules);

      // Assign custom configuration to options
      this.config = assign(this.config, tags);

    } else {

      try {

        // Read .liquidrc file
        const file = fs.readFileSync(this.rcfile, 'utf8');
        const json = JSON.parse(file, null, this.config.html.indent_size);
        const tags = this.setTagAssociates(json);

        // Assign custom configuration to options
        this.config = assign(this.config, tags);

        // Reset Error Condition
        this.error = false;

      } catch (error) {

        this.outputLog({
          title: 'Error reading formatting rules',
          file: this.rcfile,
          message: error.message,
          show: true
        });

      } finally {

        this.rcfileWatcher();

      }

    }

  }

  /**
   * Sets custom and native tag associations.
   *
   * @param {object} config the current configuration source
   */
  setTagAssociates (config) {

    for (let lang in this.tagAssociates) {

      if (
        config[lang].hasOwnProperty('tags') &&
        config[lang].tags.length > 0
      ) {

        for (let tag in this.tagAssociates[lang]) {

          config[lang].tags.push(this.tagAssociates[lang][tag]);

        }

      } else {

        if (config.hasOwnProperty(lang)) {

          assign(config[lang], {
            tags: this.tagAssociates[lang]
          });

        }

      }

    }

    return config

  }

  /**
   * Watches `.liquidrc` file for changes
   *
   * @memberof Config
   */
  rcfileWatcher () {

    if (!this.watch) {

      const watch = vscode.workspace.createFileSystemWatcher(this.rcfile, true, false, false);

      watch.onDidDelete(() => this.setFormattingRules());
      watch.onDidChange(() => {

        this.reset = true;
        this.setFormattingRules();

      });

      this.watch = true;

    }

  }

  /**
   * Generates a `.liquidrc` file to root of the projects
   * directory.
   *
   * @returns
   * @memberof Config
   */
  rcfileGenerate () {

    if (fs.existsSync(this.rcfile)) {

      return vscode.window.showErrorMessage('.liquidrc file already exists!', 'Open')
      .then(answer => {

        if (answer === 'Open') {

          vscode.workspace.openTextDocument(this.rcfile).then((document) => {

            vscode.window.showTextDocument(document, 1, false);

          }, (error) => {

            return console.error(error)

          });

        }

      })

    }

    const liquid = vscode.workspace.getConfiguration('liquid');
    const rules = JSON.stringify(liquid.rules, null, 2);

    fs.writeFile(this.rcfile, rules, (error) => {

      if (error) {

        return this.outputLog({
          title: 'Error generating rules',
          file: this.rcfile,
          message: error.message,
          show: true
        })

      }

      vscode.workspace.openTextDocument(this.rcfile).then((document) => {

        vscode.window.showTextDocument(document, 1, false);

      }, (error) => {

        return console.error(error)

      }).then(() => {

        this.rcfileWatcher();

        return vscode.window.showInformationMessage('You are now using a .liquidrc file to define formatting rules 👍')

      });

    });

  }

  /**
   * Returns formatting rules based on
   * matching `liquid_tags` value
   *
   * @param {string} tag
   */
  getRuleByTagName (tag) {

    // skip iteration if tag equals html
    if (tag === 'html') {

      return this.config.html

    }

    let rules;

    // loop over each language prop
    for (let lang in this.config) {

      if (lang !== 'ignore' || lang !== 'html') {

        // filters out object without a `tags` prop, eg: `html`
        this.config[lang].hasOwnProperty('tags') && this.config[lang].tags.map(i => {

          if (i.begin === tag) {

            rules = this.config[lang];

          }

        });

      }

    }

    return rules

  }

}

/**
 * Pattern Generator
 *
 * Generates regex patterns using the
 * configuration rules. Generated patterns are
 * used when fromatting.
 *
 * @class Pattern
 * @extends {Utils}
 */

class Pattern extends Config {

  /**
   * Regex pattern helper to generate tag pattern
   * matches when formatting.
   *
   * @param {"string"} type The type of pattern to generate
   * @param {"string"} [begin] The begin tag name (optional)
   * @param {"string"} [end] The end tag name (optional)
   * @returns RegExp regular expression
   */
  static captures (type, begin, end) {

    const pattern = {

      frontmatter: '---(?:[^]*?)---',
      ignore: '(<temp data-prettydiff-ignore>\n|\n</temp>)',
      denotations: '(?=(<|<\\/|{%-?|{{-?\\s+))',
      html: `(<(${begin})>)([^]*?)(</${end}>)`,
      liquid: `({%-?\\s*(${begin}).*?\\s*-?%})([^]*?)({%-?\\s*${end}\\s*-?%})`

    }[type];

    return new RegExp(pattern, 'g')

  }

  constructor () {

    super();

    this.pattern = {};
    this.frontmatter = Pattern.captures('frontmatter');
    this.denotations = Pattern.captures('denotations');
    this.ignoreWrap = Pattern.captures('ignore');

  }

  /**
   * Apply the required patterns used for formatting.
   * Used to assign the `pattern{}` object.
   *
   * @memberof Pattern
   */
  getPatterns () {

    this.getdocumentTagsPattern();
    this.getIgnoreTagsPattern();

  }

  /**
   * Assigns an array of regex pattern expressions
   * that match `liquid` and `html` tags.
   */
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

  /**
   * Assigns an array of regex pattern expressions
   * that are used to ignore tags when formatting
   */
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

    this.pattern.ignored = ignore;

  }

}

/**
 * Applies formatting to the document
 *
 * @class Format
 * @extends {Pattern}
 */
class Format extends Pattern {

  /**
   * Formatting provider function
   *
   * @param {Object} document The VSCode document
   * @memberof Format
   */
  provider (document) {

    if (!this.error && this.format) {

      this.statusBarItem('enabled');

    }

    if (this.reset) {

      this.getPatterns();

      // Reset Conditional Executor
      this.reset = false;

    }

    const range = Format.range(document);
    const result = this.apply(document.getText(range));

    return [
      vscode.TextEdit.replace(range, `${result.trim()}`)
    ]

  }

  /**
   * Applies the formatting and beautification
   *
   * @param {string} document The current document   *
   * @memberof Format
   */
  apply (document) {

    if (document.match(this.frontmatter)) {

      document = document.replace(this.frontmatter, Format.ignore);

    }

    for (let i = 0; i < this.pattern.ignored.length; i++) {

      if (document.match(this.pattern.ignored[i])) {

        document = document.replace(this.pattern.ignored[i], Format.ignore);

        console.log(document);

      }

    }

    for (let i = 0; i < this.pattern.tags.length; i++) {

      if (document.match(this.pattern.tags[i])) {

        document = document.replace(this.pattern.tags[i], this.tags.bind(this));

      }

    }

    document = this.beautify('html', document);

    if (document.match(this.ignoreWrap)) {

      document = document.replace(this.ignoreWrap, '');

    }

    return document

  }

  /**
   * Applies formatting to captured tag blocks
   *
   * @param {"string"} code The full tag match
   * @param {"string"} open the open tag (begin), eg: `<div>`
   * @param {"string"} name the name of the tag, eg: `div`
   * @param {"string"} source the inner conent of of the div.
   * @param {"string"} close the close tag (end), eg: `</div>`
   * @memberof Format
   */
  tags (
    code,
    open,
    name,
    source,
    close
  ) {

    const format = this.beautify(name, source);

    // Applies the brace_block custom ruleset
    const newline = prettydiff.options.brace_block ? `\n\n` : `\n`;
    const output = open + newline + format + newline + close;

    return Format.ignore(output)

  }

  /**
   * Executes formatting
   *
   * @param {string} rule
   * @param {string} source
   */
  beautify (name, source) {

    try {

      let rules = this.getRuleByTagName(name);

      prettydiff.options = Object.assign(prettydiff.options, rules, {
        source
      });

      let content = prettydiff();

      if (prettydiff.sparser.parseerror.length > 0) {

        this.statusBarItem('error');

        this.outputLog({
          title: 'PrettyDiff',
          message: `${prettydiff.sparser.parseerror}`
        });

        return source

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
   * Formats the entire document
   *
   * @memberof Format
   */
  completeDocument () {

    const { document } = vscode.window.activeTextEditor;

    const range = Format.range(document);
    const result = this.apply(document.getText(range));

    vscode.window.activeTextEditor.edit(code => code.replace(range, result));

  }

  /**
   * Format the selected (highlighted) text
   *
   * @memberof Format
   */
  selectedText () {

    const { document, selection } = vscode.window.activeTextEditor;
    const format = this.apply(document.getText(selection));

    vscode.window.activeTextEditor.edit(code => code.replace(selection, format));

  }

  /**
   * Get the formatting range
   *
   * @param {Object} document The vscode document
   * @memberof Format
   */
  static range (document) {

    const range = document.getText().length - 1;
    const first = document.positionAt(0);
    const last = document.positionAt(range);

    return new vscode.Range(first, last)

  }

  /**
   * Apply ignore wrapper to code
   *
   * @param {"string"} code
   * @memberof Format
   */
  static ignore (code) {

    return `<temp data-prettydiff-ignore>\n${code}\n</temp>`

  }

}

/**
 * Document intializer class
 *
 * @class Document
 * @extends {Format}
 */
class Document extends Format {

  constructor () {

    super();

    this.handler = {};
    this.setFormattingRules();
    this.getPatterns();

  }

  /**
   * Executes when configuration settings have changed
   *
   * @memberof Document
   */
  onConfigChanges () {

    // Reset Error Condition
    this.error = false;

    // Common Initializes
    this.dispose();
    this.setFormattingRules();
    this.getPatterns();
    this.onOpenTextDocument();

  }

  /**
   * Prepares the opened text document for formatting
   *
   * @memberof Document
   */
  onOpenTextDocument () {

    const { fileName, languageId } = vscode.window.activeTextEditor.document;

    if (this.error) {

      this.statusBarItem('error', true);

    }

    // Hide status bar item if not HTML and return the provider early
    if (languageId !== 'html') {

      this.dispose();
      this.barItem.hide();

      return

    }

    // If formatOnSave editor option is false, apply its state to Liquid formatter
    if (!vscode.workspace.getConfiguration('editor').formatOnSave) {

      this.format = false;

    }

    // Formatter is set to false, skip it
    if (!this.format) {

      // Show disabled formatter status bar
      this.dispose();
      return this.statusBarItem('disabled', true)

    }

    // Disposal of match filename handler
    if (this.handler.hasOwnProperty(fileName)) {

      this.handler[fileName].dispose();

    }

    if (!this.error && this.format) {

      this.statusBarItem('enabled', true);

    }

    this.handler[fileName] = vscode.languages.registerDocumentFormattingEditProvider({
      scheme: 'file',
      language: 'html'
    }, {
      provideDocumentFormattingEdits: this.provider.bind(this)
    });

  }

  /**
   * Dispose of formatting handlers
   *
   * @memberof Document
   */
  dispose () {

    for (const key in this.handler) {

      if (this.handler.hasOwnProperty(key)) {

        this.handler[key].dispose();

      }

    }

  }

  /**
   * Format the selected text area (command)
   *
   * @memberof Document
   */
  selection () {

    try {

      this.selectedText();
      vscode.window.showInformationMessage('Selection Formatted 💧');

    } catch (error) {

      vscode.window.showInformationMessage('Format Failed! The selection is invalid or incomplete!');
      throw outputChannel.appendLine(`💧Liquid: ${error}`)

    }

  }

  /**
   * Handles the Generate `.liquidrc` file command
   *
   * @memberof Document
   */
  liquidrc () {

    return this.rcfileGenerate()

  }

  /**
   * Format the entire document (command)
   *
   * @memberof Document
   */
  document () {

    try {

      this.completeDocument();
      vscode.window.showInformationMessage('Document Formatted 💧');

    } catch (error) {

      console.log(error);
      vscode.window.showInformationMessage('Document could not be formatted, check your code!');
      throw outputChannel.appendLine(`💧Liquid: ${error}`)

    }

  }

  /**
   * Toggle the output panel
   *
   * @memberof Document
   */
  output () {

    return this.outputChannel.show()

  }

  /**
   * Enabled formatting (command)
   *
   * @memberof Document
   */
  enable () {

    this.format = true;
    this.liquid.update('format', this.format, vscode.ConfigurationTarget.Global)
    .then(() => vscode.window.showInformationMessage('Formatting Enabled 💧'));

  }

  /**
   * Disable formatting (command)
   *
   * @memberof Document
   */
  disable () {

    this.format = false;
    this.liquid.update('format', this.format, vscode.ConfigurationTarget.Global)
    .then(() => vscode.window.showInformationMessage('Formatting Disabled 💧'));

  }

}

/**
 * vscode-liquid
 *
 * @author Nikolas Savvidis
 * @version 2.x.x
 */
exports.activate = context => {

  const { registerCommand } = vscode.commands;
  const sub = context.subscriptions;
  const active = vscode.window.activeTextEditor;

  if (!active || !active.document) return

  // Get Document
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
  sub.push(registerCommand('liquid.liquidrc', document.liquidrc.bind(document)));

};
