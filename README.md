[![install](https://img.shields.io/badge/vscode-install-blue.svg?style=popout-square)](https://marketplace.visualstudio.com/items?itemName=sissel.shopify-liquid) &nbsp; ![](https://img.shields.io/visual-studio-marketplace/v/sissel.shopify-liquid.svg?style=popout-square) &nbsp; ![install](https://vsmarketplacebadge.apphb.com/downloads-short/sissel.shopify-liquid.svg?style=popout-square)

<img src="https://raw.githubusercontent.com/panoply/vscode-shopify-liquid/master/images/banner.gif"  atl="Liquid Logo"  width="100%">

### 🚨 Liquify Release Approaching

For quite some time users of this extension have been waiting for the next release (Liquify). After a lot of work, I will begin moving the towards publishing the pre-release/beta.

For more information, please see:

- [Liquify and the future of this extension – #56](https://github.com/panoply/vscode-liquid/issues/56)
- [Project Shiplist](https://github.com/panoply/vscode-liquid/projects/6)
- [Join the Discord](https://discord.gg/eUNEsxMuWt)

Thanks for your patience!

<hr>

# Liquid <small style="color:#999;">(VS Code)</small>

A visual studio code extension for the [Liquid](https://shopify.github.io/liquid/) template language. Includes syntax highlighting support for Liquid code used in HTML, JavaScript CSS, SCSS, Markdown and more. Ships with auto formatting code beautification, advanced snippet auto-completion resolution and respects VS Codes native Intellisense, hover and diagnostic features.

### Key Features

- Syntax Highlighting support for various Liquid variations
- Auto formatting and beautification with [Prettify](https://github.com/panoply/prettify).
- Snippet auto-completion for liquid tags, filters, shopify schema and more!
- Focused support for Jekyll and Shopify liquid variations
- Supports Shopify [Section](https://help.shopify.com/en/themes/development/sections) code blocks.

#### Avoiding extension conflicts

If you're using the [Liquid Language Support](https://github.com/GingerBear/vscode-liquid) and/or the [Shopify Liquid Template Snippets](https://github.com/killalau/vscode-liquid-snippets) then it's highly recommended that you either uninstall or disable both of these before using this extension.

### Showcase

![showcase](https://github.com/panoply/vscode-shopify-liquid/blob/master/images/showcase.gif?raw=true)

# Table of Contents

- [Quickstart](#quickstart)
- [Commands](#commands)
- [Workspace Settings](#workspace-settings)
- [Syntax Support](#syntax-support)
- [Formatting](#formatting)
  - [Using .liquidrc rule file](#using-liquidrc-rule-file)
  - [Using the workspace setting option](#using-the-workspace-setting-option)
  - [Toggle and Status button](#status-bar-button)
  - [Tag Associations](#tag-associations)
  - [Ignored Tags](#ignoring-tags)
  - [Rules](#rules)
  - [Key Binding](#key-binding)
- [Snippets](#snippets)
- [Support](#support-this-extension)
- [Changelog](#changelog)

# Quickstart

After installing this extension run the `Liquid: Generate .liquidrc File` command to create a `.liquirc` rule file in your projects root directory. This file will be used to enforce your code formatting style, refer to the [Formatting](#formatting) and [Rules](#rules) section for additional information for customization options. Open any `.html`, `.liquid` or `.jekyll` file and starting coding your project.

# Commands

| Command                         | Description                                                  |
| ------------------------------- | ------------------------------------------------------------ |
| Liquid: Format File             | Formats the current file                                     |
| Liquid: Format Selection        | Formats the selected code                                    |
| Liquid: Enable Formatting       | Enable formatting from `.html`, `.liquid` or `.jekyll` files |
| Liquid: Disable Formatting      | Disable formatting                                           |
| Liquid: Generate .liquidrc File | Generates a `.liquidrc` rule file                            |

# Workspace Settings

```jsonc
{
  // Controls whether formatting is enabled or disabled
  "liquid.format": true
}
```

# Syntax Support

This extension provides liquid syntax support in various languages by leveraging VS Codes powerful grammar injections feature. Liquid is a template language and thus its grammar should be treated as such and by using grammar injections we don't loose any of VS Codes awesome features like IntelliSense, Auto Complete, Hover and Diagnostics.

Additionally, Liquid code contained in HTML `<script>` and/or `<style>` tags also support liquid syntax highlighting.

<strong>Supported Languages</strong>

| Language   | Extensions                               |
| ---------- | ---------------------------------------- |
| HTML       | .html, .jekyll, .liquid                  |
| Markdown   | .md                                      |
| CSS        | .css, .css.liquid                        |
| SCSS       | .scss, .scss.liquid, .sass, .sass.liquid |
| JavaScript | .js, .js.liquid                          |
| TypeScript | .ts, .ts.liquid                          |
| JSX        | .jsx                                     |

If you would like Liquid syntax support for a certain language or file extension please submit a feature request.

<strong>HTML Validation</strong><br>

If your `<style>` and `<script>` HTML tags contain Liquid syntax consider disabling HTML Validation in editor settings to prevent VS Code from validating these tags and throwing errors:

```json
{
  "html.validate.scripts": false,
  "html.validate.styles": false
}
```

<img src="https://raw.githubusercontent.com/panoply/vscode-shopify-liquid/master/images/sass-javascript.png"  atl="Liquid SCSS and Liquid JavaScript"  width="100%">

# Formatting

Formatting can be enable/disabled via the command palette and will respect the `editor.formatOnSave` setting. When Liquid formatting is **enabled** the extension will format (beautify) any HTML, Liquid or Jekyll file in your workspace as it will assume these files contain Liquid syntax.

Formatting uses a default set of style rules which enforce a consistent coding style. You can customize the format rules and overwrite the defaults using a `.liquidrc` file or alternatively use the `liquid.rules` workspace setting option.

### Using .liquidrc rule file

Including a .liquid file in the root of your projects workspace is the **recommended approach** for defining a custom set of formatting code style rules. This approach allows you to easily control formatting options to best fit your code style quirks and share this ruleset across projects and collaborations.

### Status bar button

When a HTML, Liquid and Jekyll file is open and active in the editor you will see the Liquid toggle/status button appear on the bottom right hand side of the VS Code status bar. The toggle button will allow you to enable/disable liquid formatting and will notify you when the parser encounters any code errors.

<!-- prettier-ignore -->
| Status Bar Item  | Function | Description |
|--|--|--|
| <img  src="https://raw.githubusercontent.com/panoply/vscode-liquid/master/images/status-enabled.jpg"  width="140px"> | Formatting is enabled | Clicking this status bar in this state will disable formatting |
| <img  src="https://raw.githubusercontent.com/panoply/vscode-liquid/master/images/status-disabled.png"  width="140px"> | Formatting is disabled |  Clicking the status bar item in this state will enable formatting |
| <img  src="https://raw.githubusercontent.com/panoply/vscode-liquid/master/images/status-error.png"  width="140px"> | Parsing error was detected  | Opens the output panel and provides a hint were error occured (formatting is still enabled in this state)

# Rules

Below is the default code style formatting rules. Generate this file using the `Liquid: Generate .liquidrc File` command and a file in the root of your project will be created. Alternatively you can use the `"liquid.rules"` option in your workspace or user settings.

```jsonc
{
  "prettify": {
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
}
```

# Key binding

You can use the Liquid formatter by using the below key binding.

```
cmd + shift + L -> Format Document
```

> Use `ctrl` for windows

<br>

<strong>Custom keybindings</strong><br>
_If you don't like the defaults then rebind editor.action.formatDocument in the keyboard shortcuts menu of vscode._

# Snippets

Liquid snippets are supported in this extension. The Filter and Tag snippets which have been included were forked from [vscode-liquid-snippets](https://github.com/killalau/vscode-liquid-snippets). The reason for forking this extension is to avoid conflicts due to the extension dependency it relies on, however additionally the extension includes over 50+ snippet helpers for both Jekyll and Shopify development.

### Schema Snippets <small>(Shopify Liquid Variation)</small>

Shopify `{% schema %}` section snippets are supported when using the `schema` prefix followed by the input type setting name. The schema snippets inject complete input types and allow you to quickly apply the schema setting.

<br>

<img src="https://raw.githubusercontent.com/panoply/vscode-shopify-liquid/master/images/schema-snippets.png"  atl="Shopify Schema Snippets"  width="100%">

# Support this extension!

This extension brings sufficient support of the Liquid language to VS Code and aims to provide a well integrated IDE experience for developers using all variations of the language. Prior to the release of this extension Liquid support in vscode and text editors in general was extremely limited with developers stuck using outdated and sometimes broken solutions.

Developing this extension has taken a considerable amount of time. For now, this extension is available free of cost but will require a small license fee in the future. To help keep this extension free and open source for as long as possible, please consider supporting its growth and maintainance:

**PayPal**: [Donate](https://www.paypal.me/paynicos)<br>
**BTC**: `35wa8ChA5XvzfFAn5pMiWHWg251xDqxT51`

# Changelog

Refer to the [Changelog](https://github.com/panoply/vscode-liquid/blob/master/CHANGELOG.md) for each per-version update and/or fixes.

<br>

Currently made with 🖤 by Nikolas Savvidis
