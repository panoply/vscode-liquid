<pre><code><strong>🩸 <i>LIQUIFY ~ INFORMATION ON THE FUTURE RELEASE</i></strong>
<p>
<i>For quite some time users of this extension have been waiting for the next release
(Liquify). Liquify will supersede this extension and facilitate advanced features and
capabilities. Liquify is a big project which I began developing in 2020. This extension
will continue to be maintained and progressively transition to Liquify.</i>
</p>
   <a href="https://github.com/panoply/vscode-liquid/issues/56"><i>Liquify and the future of this extension</i></a>
   <a href="https://github.com/panoply/vscode-liquid/projects/6"><i>Project Overview and what to expect</i></a>
   <a href="https://discord.gg/eUNEsxMuWt"><i>Join the Discord and collaborate on the project</i></a>

</code></pre>

<hr>

[![install](https://img.shields.io/badge/vscode-install-blue.svg?style=popout-square)](https://marketplace.visualstudio.com/items?itemName=sissel.shopify-liquid) &nbsp; ![](https://img.shields.io/visual-studio-marketplace/v/sissel.shopify-liquid.svg?style=popout-square) &nbsp; ![install](https://vsmarketplacebadge.apphb.com/downloads-short/sissel.shopify-liquid.svg?style=popout-square)

<img src="https://raw.githubusercontent.com/panoply/vscode-shopify-liquid/master/images/banner.gif"  atl="Liquid Logo"  width="100%">

# Liquid <small style="color:#999;">(VS Code)</small>

A visual studio code extension for the [Liquid](https://shopify.github.io/liquid/) template language. Includes syntax highlighting support, snippet auto-completion, auto formatting (code beautification), validations and more! Respects VS Codes native Intellisense features and provides hover capabilities + various other essentials.

### Key Features

- Syntax support for Liquid in CSS, SCSS, JavaScript, Markdown and more!
- Auto formatting and beautification using [Prettify](https://github.com/panoply/prettify).
- Snippet auto-completion for Liquid tags, filters and more!
- Supports Shopify [Section](https://help.shopify.com/en/themes/development/sections) code blocks.
- Integrated JSON Schema stores that provide IntelliSense capabilities in Shopify Theme files.
- Preserves VSCode HTML IntelliSense capabilities in `.liquid` markup files.

### Showcase

![showcase](https://github.com/panoply/vscode-shopify-liquid/blob/master/images/showcase.gif?raw=true)

# Table of Contents

- [Quickstart](#quickstart)
  - [Upgrading v3.0](#upgrading-v30)
- [Commands](#commands)
- [Workspace Settings](#workspace-settings)
- [Syntax Support](#syntax-support)
  - [Supported Languages](#supported-languages)
  - [Grammar Injections](#grammar-injections)
  - [HTML Validations](#html-validations)
  - [Markdown Codeblock](#markdown-codeblock)
- [Formatting](#formatting)
  - [Prettify](#prettify)
  - [Key Binding](#key-binding)
  - [Status Bar](#key-binding)
- [Configuration](#configuration)
  - [Using .liquidrc rule file](#using-liquidrc-rule-file)
  - [Using the workspace setting option](#using-the-workspace-setting-option)
  - [Using package.json prettify](#status-bar-button)
- [Snippets](#snippets)
- [Contributing](#contributing)
  - [Requirements](#requirements)
  - [Support](#support)
- [Changelog](#changelog)

# Quickstart

After installing this extension run the `Liquid: Generate .liquidrc File` command to create a `.liquidrc` configuration file in your projects root directory. This file will be used to configure the formatting style and control various other capabilities provided by the extension. Refer to the [Formatting](#formatting) and [Rules](#rules) section for additional information and customization options.

### Upgrading v3.0

Users who were upgraded to version **3.0.0** will need to align their configurations. As of **v3.0.0** the `.liquidrc` configuration file schema does not support the schema used in version **v2.3.0**. Both the `ignore` tags and `associate` tags formatting options are deprecated and will have no effect. The validations will inform about the changes.

- [v3.0.0 Release Notes](/release-notes.md)
- [Changelog](/changelog.md)

If you do not wish to upgrade then you can continue using the old version. Search for the extension "liquid" and clicking the gear icon. Select "Install Another Version" then select **2.3.0**. You can find the old readme in the [v2.3.0](https://github.com/panoply/vscode-liquid/tree/v2.3.0) branch.

# Commands

Below are the available commands exposed to the vscode command palette (`cmd + shift + p`)

| Command                    | Description                          |
| -------------------------- | ------------------------------------ |
| Liquid: Format File        | _Formats the current file_           |
| Liquid: Format Selection   | _Formats the selected code_          |
| Liquid: Enable Formatting  | _Enable Prettify formatting_         |
| Liquid: Disable Formatting | _Disable Prettify formatting_        |
| Liquid: Enable Extension   | _Enable the extension_               |
| Liquid: Disable Extension  | _Disable the extension_              |
| Liquid: Restart Extension  | _Restart the extension_              |
| Liquid: Generate .liquidrc | _Generate a `.liquidrc` config file_ |

# Workspace Settings

The extension provides various workspace settings. Most the available options can be controlled within a `.liquidrc` configuration file. Take a look at the [configuration](#configuration) section for information and other setting options.

```jsonc
{
  // Disable the extended features of the extension
  "liquid.enable": true,
  // Validate shopify schema tag blocks
  "liquid.validate.shopifySchemaTag": true,
  // Controls whether formatting is enabled or disabled
  "liquid.format.enable": true,
  // Glob paths to exclude from formatting
  "liquid.format.ignore": [],
  // Word wrap limit, defaults to the vscode wordWrapColumn
  "liquid.format.wrap": 0,
  // indentation level, defaults to the vscode tabSize
  "liquid.format.indentSize": 2,
  // Whether or not documents end with newline, defaults to the vscode renderFinalNewline
  "liquid.format.endNewLine": false,
  // If a blank new line should be forced above comments
  "liquid.format.commentIndent": false,
  // The maximum number of consecutive empty lines to retain
  "liquid.format.preserveLine": 3,
  // Prevent comment reformatting due to option wrap
  "liquid.format.preserveComment": false,
  // Use Windows (CRLF) format, Unix (LF) format is the default.
   "liquid.format.crlf": false,
  // HTML, Liquid + HTML code style
  "liquid.format.markup": {
    // Automatically attempts to correct some sloppiness in code
    "correct": false,
    // Control the casing of attributes.
    "attributeCasing": "preserve",
    // Alphanumerically sort HTML attributes from A to Z.
    "attributeSort": false,
    // Sort attributes according to this list, requires attributeSort  to be true
    "attributeSortList": [],
    // Strip extraneous spacing from Liquid delimiters
    "delimiterSpacing": false,
    // Whether comments should always start at position 0 or indented to code
    "commentNewline":  false,
    // Force leading attributes onto a newline when using wrap
    "forceLeadAttribute": false,
    // Will force indentation upon content
    "forceIndent": false,
    // Whether attributes should be indented each onto their own line
    "forceAttribute": false,
    // If text in the provided document code should be preserved
    "preserveText": true,
    // self-closing tags end will end with ' />' instead of '/>'
    "selfCloseSpace": false,
    // Whether attributes should be preserved
    "preserveAttributes": false,
    // Quotation character conversion
    "quoteConvert": "none",
  },
  // JavaScript, TypeScript code style
  "liquid.format.script": {},
  // CSS/SCSS code style
  "liquid.format.style": {},
  // JSON code style
  "liquid.format.json": {},
  }
}
```

# Syntax Support

Liquid syntax highlighting support within HTML and JSON languages are applied using vscode injection grammars. Grammar injections allow intelliSense capabilities provided by vscode to persist and work without interruption. Liquid syntax contained in JavaScript, TypeScript, CSS/SCSS, JSON and other supported languages require an `.liquid` extension suffix be applied on file names (eg: _js.liquid_, _css.liquid_ etc) or alternatively, you can use the vscode [file associations](https://code.visualstudio.com/docs/languages/identifiers).

### Supported Languages

| Language Identifier | Supported Extensions | Grammar Scope        | Grammar Injection |
| ------------------- | -------------------- | -------------------- | ----------------- |
| HTML                | .liquid _or_ .html   | text.html.derivative | ✓                 |
| JSON                | .json                | source.json          | ✓                 |
| Liquid              | .liquid              | source.liquid        | 𐄂                 |
| Liquid Yaml         | .yaml.liquid         | source.yaml          | 𐄂                 |
| Liquid Markdown     | .md.liquid           | text.html.markdown   | 𐄂                 |
| Liquid CSS          | .css.liquid          | source.css           | 𐄂                 |
| Liquid SCSS         | .scss.liquid         | source.scss          | 𐄂                 |
| Liquid JavaScript   | .js.liquid           | source.ts            | 𐄂                 |
| Liquid TypeScript   | .ts.liquid           | source.ts            | 𐄂                 |

### Grammar Injections

In previous versions of this extension, the applied injections would cause otherwise valid syntax to be invalidated in the many languages being extended. As of version 3.0 the vast majority of those issues were fixed and no interference outside of Liquid contained structures will apply highlighting.

**Files using a `.liquid` extension will be automatically associated to HTML.**

### HTML Validations

If your `<style>` and `<script>` HTML tags contain Liquid syntax consider disabling HTML Validations. This will to prevent VS Code from validating these tags and throwing errors:

```json
{
  "html.validate.scripts": false,
  "html.validate.styles": false
}
```

### Markdown Codeblock

Embedded code blocks regions are supported in markdown (_.md_) files:

````md
```liquid

```
````

<img src="https://raw.githubusercontent.com/panoply/vscode-shopify-liquid/master/images/sass-javascript.png"  atl="Liquid SCSS and Liquid JavaScript"  width="100%">

# Formatting

Formatting can be enabled/disabled via the command palette and respects vscode settings like `editor.formatOnSave` and `defaultFormatter`. When Liquid formatting is **enabled** the extension will format Liquid, JSON and all suffixed `*.liquid` files supported by [Prettify](https://github.com/panoply/prettify). You can **disable** beautification by clicking the 💧 emoji icon in the status bar or define a set of directories/files to exclude from handling using the `format.ignore[]` option. Formatting options for controlling code output style can be provided within a `.liquidrc` file or alternatively you can use the workspace setting options.

### Prettify 🎀

[Prettify](https://github.com/panoply/prettify) is used to facilitate formatting capabilities. Prettify is built atop of the late but powerful Sparser + PrettyDiff lexing algorithm and has since been adapted for refined usage by this extension. Prettify exposes a granular set of beautification rules that supports Liquid code contained in markup, script and style languages and will be used in the future Liquify release. I actively maintain Prettify and though it exists in its infancy stages the ambition is to eventually have the tool be a competitive alternative to Prettier with the goal of eliminating the "opinionated" conventions imposed.

- [Playground](https://liquify.dev/prettify)

### Setting Default Formatter

In some situations you may have already configured another extension to handle beautification and might prevent vscode from forwarding documents to Prettify. Depending on your preferences, you may need to explicitly define a `defaultFormatter` in your vscode workspace/user settings.

> **Note**
> Be sure to select only the languages which you wish to have formatted by Prettify. If you don't want Prettify to handle formatting then set `liquid.format.enable` to `false`.

```jsonc
{
  // Enables formatting of .liquid files
  "[liquid]": {
    "editor.defaultFormatter": "sissel.shopify-liquid"
  },
  // Enables formatting of all .json files
  "[json]": {
    "editor.defaultFormatter": "sissel.shopify-liquid"
  },
  // Enables formatting of all .js.liquid files
  "[liquid-javascript]": {
    "editor.defaultFormatter": "sissel.shopify-liquid"
  },
  // Enables formatting of all .css.liquid files
  "[liquid-css]": {
    "editor.defaultFormatter": "sissel.shopify-liquid"
  },
  // Enables formatting of all .scss.liquid files
  "[liquid-scss]": {
    "editor.defaultFormatter": "sissel.shopify-liquid"
  },
  // Enables formatting of all .json.liquid files
  "[liquid-json]": {
    "editor.defaultFormatter": "sissel.shopify-liquid"
  }
}
```

### Key Binding

For folks who prefer formatting via key-binding can trigger full document beautification using:

```bash
cmd  + L  # mac
ctrl + L  # windows
```

> **Note**
> You can configure a different key-binding via `editor.action.formatDocument` keyboard shortcuts menu in vscode.

### Status Bar

When the extension is enabled and a supported file is open and active in your editor a toggle/status button will appear in the bottom right hand side of the VSCode status bar. The toggle button will allow you to enable/disable formatting programmatically, inform upon ignored files and will notify you when the parser encounters any code errors.

<!-- prettier-ignore -->
| Status  | Command | Action |
|:--|:--|:--|
| <img  src="https://github.com/panoply/vscode-liquid/blob/v3.0.0/images/status-enabled.png?raw=true"  width="50px"> | **Enabled** | _Clicking this status bar in this state will disable formatting_ |
| <img  src="https://github.com/panoply/vscode-liquid/blob/v3.0.0/images/status-disabled.png?raw=true"  width="50px"> | **Disabled** |  _Clicking the status bar item in this state will enable formatting_ |
| <img  src="https://github.com/panoply/vscode-liquid/blob/v3.0.0/images/status-ignored.png?raw=true"  width="50px"> | **Ignoring**  | _Clicking the status bar item removes the file from ignore list and enables formatting_
| <img  src="https://github.com/panoply/vscode-liquid/blob/v3.0.0/images/status-error.png?raw=true"  width="50px"> | **Errors**  | _Click the status bar item in this state opens the output panel for error information_

> **Note**
> When extended features have been disabled (ie: `liquid.enable` is `false`) then the status bar will not be displayed and formatting will not applied.

### Ignoring Code and/or Files

You can skip formatting on files, directories and code a few different ways. If you are using workspace/user settings for configuration then you can pass a glob list of paths relative to your projects root using `liquid.format.ignore[]` option. Folks using the `.liquidrc` file or `prettify` field in a `package.json` file this option is available via the `ignore[]` field. In addition to path ignores, users can also use Prettify [inline ignores](https://github.com/panoply/prettify#inline-control) for skipping blocks of code and files.

<strong>Ignoring Files</strong><br>

- `{% # @prettify-ignore %}`
- `<!-- @prettify-ignore -->`
- `{% comment %} @prettify-ignore {% endcomment %}`

> **Warning**
> Inline ignore made possible via Prettify are not yet fully operational.

# Configuration

The extension provides a couple of different ways for users to configure and control capabilities. The preferred method is to use a `.liquidrc` file, but you can also provide configuration via vscode workspace/global settings. In addition to these 2 the extension will also check for the existence of a `prettify` field in `package.json` files.

### Using the workspace settings

Setting configuration in user or workspace settings is made available on `liquid.*` property. Workspace settings are validated and will inform upon each configuration option in real-time. When a `.liquidrc` file is present in your projects root then that will run precedence over `format` options defined in workspace settings.

Refer to [Workspace Settings](#workspace-settings) for defaults.

### Using the package.json prettify field

In some situations users may prefer to defined options within a `package.json` file. The extension will check `package.json` files for a `prettify` field and use the defined beautification options provided. The `prettify` field only accepts format rules and will override workspace settings but if `liquidrc` file is present in your projects root then that will run precedence.

### Using .liquidrc config file

Including a `.liquidrc` file in the root of your projects workspace is the **recommended** configuration method. The `.liquidrc` file allows users to control beautification, validations and some editor specific options. All options available to workspace settings aside from `liquid.enable` and `liquid.format.enable` can be provided via the `.liquidrc` file.

> **Note**
> The `.liquidrc` file will be an essential requirement in Liquify (the future release) and the point of control for the Liquify parser, Language Server and the multiple features it provides.

### Supported Files

Currently, the extension only supports 2 JSON (with comments) file types.

- `.liquidrc`
- `.liquidrc.json`

### Generating a .liquidrc File

You can generate a `.liquidrc` file using the **Liquid: Generate .liquidrc** command via the vscode command palette. The extension will use default rules defined on the `liquid.format` user/workspace setting. Don't get too married to this schema as it will likely change when the extension is superseded by Liquify but rest easy knowing backward capability will be provided as things progressively change.

```jsonc
{
  "ignore": [],
  "crlf": false,
  "commentIndent": true,
  "endNewline": false,
  "indentChar": " ",
  "indentSize": 2,
  "preserveComment": false,
  "preserveLine": 2,
  "wrap": 0,
  "markup": {
    "correct": false,
    "commentNewline": false,
    "attributeCasing": "preserve",
    "attributeValues": "preserve",
    "attributeSort": false,
    "attributeSortList": [],
    "forceAttribute": false,
    "forceLeadAttribute": false,
    "forceIndent": false,
    "preserveText": false,
    "preserveAttributes": false,
    "selfCloseSpace": false,
    "quoteConvert": "none"
  },
  "style": {
    "correct": false,
    "classPadding": false,
    "noLeadZero": false,
    "sortSelectors": false,
    "sortProperties": false
  },
  "script": {
    "correct": false,
    "braceNewline": false,
    "bracePadding": false,
    "braceStyle": "none",
    "braceAllman": false,
    "caseSpace": false,
    "inlineReturn": true,
    "elseNewline": false,
    "endComma": "never",
    "arrayFormat": "default",
    "objectIndent": "default",
    "functionNameSpace": false,
    "functionSpace": false,
    "styleGuide": "none",
    "ternaryLine": false,
    "methodChain": 4,
    "neverFlatten": false,
    "noCaseIndent": false,
    "noSemicolon": false,
    "quoteConvert": "none"
  },
  "json": {
    "arrayFormat": "default",
    "braceAllman": false,
    "bracePadding": false,
    "objectIndent": "default"
  }
}
```

# Snippets

Liquid snippets are supported in this extension. The filter and tag snippets included were originally forked from [vscode-liquid-snippets](https://github.com/killalau/vscode-liquid-snippets) but apply choice based delimiter dashes opposed to including duplicated completions.

> **Note**
> Extension snippets will be deprecated in Liquify and exist only until the extension is superseded. Liquify supports LSP Completions as per [#56](https://github.com/panoply/vscode-liquid/issues/56#issuecomment-852550324).

<br>

<img src="https://raw.githubusercontent.com/panoply/vscode-shopify-liquid/master/images/schema-snippets.png"  atl="Shopify Schema Snippets"  width="100%">

# Contributing

TODO

### Requirements

### Support

**PayPal**: [Donate](https://www.paypal.me/paynicos)<br>
**BTC**: `35wa8ChA5XvzfFAn5pMiWHWg251xDqxT51`

# Changelog

Refer to the [Changelog](https://github.com/panoply/vscode-liquid/blob/master/CHANGELOG.md) for each per-version update and/or fixes.

<br>

Currently made with 🖤 by Nikolas Savvidis
