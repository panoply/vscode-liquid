<h2 align="center">
<a href="https://marketplace.visualstudio.com/items?itemName=sissel.shopify-liquid">
  <img src="https://img.shields.io/badge/vscode-install-blue.svg?style=popout-square">
</a>
&nbsp;
<a href="https://marketplace.visualstudio.com/items?itemName=sissel.shopify-liquid">
  <img src="https://img.shields.io/visual-studio-marketplace/v/sissel.shopify-liquid.svg?style=popout-square">
</a>
&nbsp;
<a href="https://marketplace.visualstudio.com/items?itemName=sissel.shopify-liquid">
  <img src="https://img.shields.io/visual-studio-marketplace/i/sissel.shopify-liquid?style=flat-square">
</a>
&nbsp;
<a href="https://github.com/panoply/prettify">
  <img src="https://img.shields.io/npm/v/@liquify/prettify?style=popout-square&color=hotpink&label=%F0%9F%8E%80%20prettify%20%20">
</a>
&nbsp;
</h2>

<pre><code><strong> 💧 <i>LIQUIFY ~ INFORMATION ON THE FUTURE RELEASE</i></strong>
<p>
<i>For quite some time users of this extension have been waiting for the next release
(Liquify). Liquify will supersede this extension and facilitate advanced features and
capabilities. Liquify is a big project which I began developing in 2020. This extension
will continue to be maintained and progressively transition to Liquify.</i>
</p>
  → <a href="https://github.com/panoply/vscode-liquid/issues/56"><i>Liquify and the future of this extension</i></a>
  → <a href="https://github.com/panoply/vscode-liquid/projects/6"><i>Project Overview and what to expect</i></a>
  → <a href="https://discord.gg/eUNEsxMuWt"><i>Join the Discord and collaborate on the project</i></a>

</code></pre>

<img src="https://raw.githubusercontent.com/panoply/vscode-liquid/v3.0.0/images/banner.png"  atl="Liquid Logo"  width="100%">

# Liquid <small style="color:#999;">(vscode)</small>

A vscode extension for the [Liquid](https://shopify.github.io/liquid/) template language. Provides formatting, syntax highlighting, snippet auto-completion, validations and respects HTML Intellisense features.

### Key Features

- Syntax support for Liquid in CSS, SCSS, JavaScript, Markdown and more!
- Formatting and beautification support using [Prettify](https://github.com/panoply/prettify).
- Snippet auto-completion for Liquid tags, filters and more!
- Supports Shopify [Section](https://help.shopify.com/en/themes/development/sections) code blocks.
- Integrated Schema stores that provide IntelliSense capabilities within Shopify JSON files.
- Preserves VSCode HTML IntelliSense capabilities in `.liquid` markup files.

### Showcase

![showcase](https://github.com/panoply/vscode-shopify-liquid/blob/master/images/showcase.gif?raw=true)

# Table of Contents

- [Updating to v3.0](#updating-to-v300)
- [Commands](#commands)
- [Workspace Settings](#workspace-settings)
  - [Settings Target](#settings-target)
  - [Control Capabilities](#control-capabilities)
- [Syntax Support](#syntax-support)
  - [Supported Languages](#supported-languages)
  - [Grammar Injections](#grammar-injections)
  - [Liquid in HTML](#liquid-in-html)
  - [HTML Validations](#html-validations)
  - [Liquid in JSON, YAML and Markdown](#liquid-in-json-yaml-and-markdown)
  - [Markdown Codeblock](#markdown-codeblock)
- [Formatting](#formatting)
  - [Prettify](#prettify)
  - [Setting Default Formatter](#setting-default-formatter)
  - [Status Bar](#status-bar)
  - [Ignoring Code and/or Files](#ignoring-code-andor-files)
- [Configuration](#configuration)
  - [Using workspace setting](#using-workspace-settings)
  - [Using the package.json prettify field](#using-the-packagejson-prettify-field)
  - [Using .liquidrc rule file](#using-liquidrc-config-file)
- [Snippets](#snippets)
- [Releases](#changelog)
- [Contributing](#contributing)
- [Acknowledgements](#acknowledgements)
- [Support](#support)

# Updating to v3.0.0

Users who were upgraded to version **3.0.0** will need to align their configurations. The options defined in the **v2.3.0** `.liquidrc` file are no longer supported or valid in **v3.0.0**. The validations will inform about the changes but take a look at the release notes for a complete overview.

- [Release Notes](/release-notes.md)

### Continue using v2.3.0

Though it is discouraged, if you do not wish to upgrade then you can continue using the old version. Search for the extension "liquid" in vscode and press the gear icon in the bottom right corner. Select "Install Another Version" and then select **2.3.0**.

- [v2.3.0 Documentation](https://github.com/panoply/vscode-liquid/tree/v2.3.0)

# Commands

Below are the available commands exposed to the vscode command palette (`cmd + shift + p`)

| Command                                  | Description                                          |
| ---------------------------------------- | ---------------------------------------------------- |
| Liquid: Enable Extension                 | _Enable extension capabilities_                      |
| Liquid: Disable Extension                | _Disable extension capabilities_                     |
| Liquid: Enable Formatting                | _Enable Prettify formatting_                         |
| Liquid: Disable Formatting               | _Disable Prettify formatting_                        |
| Liquid: Format Document                  | _Formats the current document_                       |
| Liquid: Open Output                      | _Open the Liquid output panel_                       |
| Liquid: Generate .liquidrc (defaults)    | _Generate a `.liquidrc` file with default rules_     |
| Liquid: Generate .liquidrc (recommended) | _Generate a `.liquidrc` file with recommended rules_ |

# Workspace Settings

The extension provides various workspace/user settings. The `liquid.format` options can be controlled using a `.liquidrc` configuration file or alternatively you can define format option on the `prettify` field of a node `package.json` file. Take a look at the [configuration](#configuration) section for information and other setting options.

By default, it is assumed you are using workspace/user settings.

<!--prettier-ignore-->
```jsonc
{
  // Disable the extended features of the extension
  "liquid.enable": true,

  // Controls how extension settings are applied
  "liquid.settings.target": "workspace",

  // Validates the contents of the `{% schema %}` tag and implemented JSON
  "liquid.validate.json": true,

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
    "commentNewline": false,

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
    "quoteConvert": "none"
  },

  // CSS/SCSS code style
  "liquid.format.style": {

    // Automatically attempts to correct some sloppiness in code.
    "correct": false,

    // Whether to apply allman style indentation to braces
    "braceAllman": false,

    // Sorts CSS Selectors in an alphanumerical order
    "sortSelectors": false,

    // Sort Selectors in an alphanumerical order
    "sortProperties": false,

    // Inserts new line characters between every CSS code block
    "classPadding": false,

    // Whether leading `0s` in CSS values immediately preceding a decimal or removed
    "noLeadZero": false,

    // If comma separated CSS selectors should present on a single line of code
    "selectorList": false
  },

  // JSON code style
  "liquid.format.json": {

    // Determines how array indexes should be indented
    "arrayFormat": "default",

    // Whether to apply allman style indentation to braces
    "braceAllman": false,

    // Inserts a space after the start and before the end of a container
    "bracePadding": false,

    // Emulates JSBeautify's brace_style option
    "braceStyle": "none",

    // Determines if all array indexes should be indented, never indented, or left to the default.
    "formatArray": "default",

    // Determines if all object keys should be indented, never indented, or left to the default
    "objectIndent": "default"
  },

  // JavaScript, TypeScript code style
  "liquid.format.script": {

    // Determines how array indexes should be indented
    "arrayFormat": "default",

    // Automatically attempts to correct some sloppiness in code.
    "correct": false,

    // Whether to apply allman style indentation to braces
    "braceAllman": false,

    // Insert line after opening curly braces and before closing curly braces
    "braceNewline": false,

    // Inserts a space after the start and before the end of a container
    "bracePadding": false,

    // Emulates JSBeautify's brace_style option
    "braceStyle": "none",

    // If the colon separating a case's expression (of a switch/case block)
    "caseSpace": false,

    // Whether the 'else' keyword is forced onto a new line.
    "elseNewline": false,

    // If there should be a trailing comma in arrays and object
    "endComma": "none",

    // Determines how array indexes should be indented
    "arrayFormat": "default",

    // Determines how object keys should be indented
    "objectIndent": "default",

    // If a space should follow a JavaScript function name
    "functionNameSpace": false,

    // When to break chained methods and properties onto separate lines
    "methodChain": 3,

    // If destructured lists in script should never be flattened
    "neverFlatten": false,

    // If a case statement should receive indentation
    "noCaseIndent": false,

    // Removes semicolons that would be inserted by ASI
    "noSemicolon": false,

    // Prevent comment reformatting due to option wrap
    "preserveComment": false,

    // Quotation character conversion
    "quoteConvert": "none",

    // Inserts a space following the function keyword for anonymous functions
    "functionSpace": false,

    // Keep ternary statements on one Line
    "ternaryLine": false,

    // Merges into consecutive variables into a comma separated list
    "variableList": false
  }
}
```

### Settings Target

The `liquid.settings.target` option is used to determine how and where the extension applies settings. The default configuration and behavior of the extension is to use the `.vscode/settings.json` workspace file as per the `workspace` target. Though you can target `user` settings, it is **highly discouraged** and could lead to unexpected issues outside of Liquid projects.

The below vscode settings is what will be applied to your projects workspace unless the HTML language identifier has pre-existing settings defined. Take a look at the [setting default formatter](#setting-default-formatter) and [grammar injections](#grammar-injections) sections for more information.

_Default configuration applied to your projects .vscode/settings.json file when options are undefined_

```jsonc
{
  "html.validate.scripts": false,
  "html.validate.styles": false,
  "[html]": {
    "editor.defaultFormatter": "sissel.shopify-liquid"
  }
}
```

### Control Capabilities

The extension provides an option for disabling capabilities. The `liquid.enable` workspace/user option can be used to disable the extension from initializing in environments or projects where you may no desire its usage. When the `liquid.enable` setting is set to `false` it will disable the following features:

- Formatting
- File Association
- JSON Validations
- Status Bar Item

When you set `liquid.enable` to `false` it does not disabled the extension but instead just prevents it from running at full capacity, assuming environment and providing capabilities that you might otherwise not require.

# Syntax Support

Liquid syntax highlighting support within HTML, Markdown, YAML and JSON languages are applied using vscode injection grammars. Grammar injections allow intelliSense capabilities provided by vscode to persist and work without interruption. Liquid syntax contained in JavaScript, CSS, SCSS, YAML and other supported languages require an `.liquid` extension suffix be applied to file names (eg: _.css_ → _.css.liquid_ etc).

_If the required `.liquid` suffix is problematic then use [file associations](https://code.visualstudio.com/docs/languages/identifiers)._

### Supported Languages

| Language Identifier | Language Alias    | Supported Extension | Grammar Injection |
| ------------------- | ----------------- | ------------------- | ----------------- |
| html                | HTML              | .liquid             | ✓                 |
| json                | JSON              | .json               | ✓                 |
| yaml                | YAML              | .yaml               | ✓                 |
| markdown            | Markdown          | .md                 | ✓                 |
| liquid              | Liquid            | .liquid             | 𐄂                 |
| liquid-css          | Liquid CSS        | .css.liquid         | 𐄂                 |
| liquid-scss         | Liquid SCSS       | .scss.liquid        | 𐄂                 |
| liquid-javascript   | Liquid JavaScript | .js.liquid          | 𐄂                 |

### Grammar Injections

In order to preserve vscode intellisense capabilities both the HTML and JSON languages have Liquid grammars injected into them. The grammar injection will allow Liquid code to be highlighted and treated as if its syntax was a part of the language it is implemented within.

### Liquid in HTML

Liquid is almost exclusively written within markup languages like HTML and as such the Liquid grammars are injected into the HTML grammar derivative. When a file is using a `.liquid` extension the **intended behavior** is to associate it to the HTML Language to ensure HTML intellisense capabilities and made available to you.

_Changing the language to Liquid from HTML will disable HTML intellisense capabilities._

### HTML Validations

When your `<style>` and `<script>` HTML tags contain Liquid syntax vscode will complain about invalid code. You should consider disabling HTML script and style validations when working with Liquid. Disabling validations in these embedded code regions will to prevent VSCode from validating and throwing errors.

```json
{
  "html.validate.scripts": false,
  "html.validate.styles": false
}
```

### Liquid in JSON, YAML and Markdown

Liquid tags, comments and object grammars are also injected into JSON, YAML and Markdown languages but external code regions and anything which requires an embedded language reference is excluded. There is no need to use a `.liquid` suffix on these file names in order for syntax highlighting of Liquid to be applied, it will work out of the box.

_If for any reason the injections become problematic then please report an issue and disable the extension._

### Markdown Codeblock

Liquid markdown embedded code block regions are supported in `.md` files.

````md
```liquid
{% comment %} Liquid code {% endcomment %}
```
````

# Formatting

Formatting can be enabled/disabled via the command palette and will respect `editor.formatOnSave`. When Liquid formatting is **enabled** the extension will format Liquid, HTML, JSON and all suffixed `*.liquid` files supported by [Prettify](https://github.com/panoply/prettify). You can **disable** beautification by clicking the 💧 emoji icon in the status bar or exclude directories/files from handling using the `format.ignore` setting. You can define formatting options in a .liquidrc file, a package.json `prettify` field or alternatively you can use the workspace setting options.

### 🎀 Prettify

[Prettify](https://github.com/panoply/prettify) is used to facilitate formatting capabilities by the extension. Prettify is built atop of the late but powerful Sparser lexing algorithm and has since been adapted for refined usage with Liquid. Prettify exposes a granular set of rules and supports Liquid beautification in various markup, script and style languages. I actively maintain Prettify and though in its infancy stages the ambition is to eventually have the tool become a competitive alternative to Prettier and eliminate "opinionated" conventions.

- [Repository](https://github.com/panoply/prettify)
- [Playground](https://liquify.dev/prettify)

### Setting Default Formatter

In some situations you may have already configured another extension to handle formatting and this might prevent vscode from forwarding documents to the extension for beautification. Depending on your preferences, you may need to explicitly define a language `defaultFormatter` in your vscode workspace/user settings.

_Be sure to define only the languages which you wish to have formatted by the extension. If you don't want Prettify to handle formatting then set the option `liquid.format.enable` to `false`._

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
  // Enables formatting of all .jsonc files
  "[jsonc]": {
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
  }
}
```

### Status Bar

When the extension is enabled and a supported file has been opened in the editor you'll a 💧 emoji appear in the bottom right hand side of the vscode status bar. This is the extensions status bar item and it will allow you to enable/disable formatting programmatically, inform upon ignored files and notify you when the parser encounters any code errors.

_When extended features have been disabled (ie: `liquid.enable` is `false`) then the status bar item will not be displayed and formatting will not applied._

<!-- prettier-ignore -->
| Status  | Command | Action |
|:--|:--|:--|
| <img  src="https://github.com/panoply/vscode-liquid/blob/v3.0.0/images/status-enabled.png?raw=true"  width="50px"> | **Enabled** | _Clicking the status bar item in this state will disable formatting_ |
| <img  src="https://github.com/panoply/vscode-liquid/blob/v3.0.0/images/status-disabled.png?raw=true"  width="50px"> | **Disabled** |  _Clicking the status bar item in this state will enable formatting_ |
| <img  src="https://github.com/panoply/vscode-liquid/blob/v3.0.0/images/status-ignored.png?raw=true"  width="50px"> | **Ignoring**  | _Clicking the status bar item in this state removes the file from ignore list_
| <img  src="https://github.com/panoply/vscode-liquid/blob/v3.0.0/images/status-error.png?raw=true"  width="50px"> | **Errors**  | _Clicking the status bar item in this state opens the output panel_

### Ignoring Code and/or Files

You can skip formatting on files, directories and code input a few different ways. If you are using workspace/user settings for configuration then you can pass a glob list of paths relative to your projects root using the `liquid.format.ignore[]` option. Folks using the `.liquidrc` file or package.json `prettify` field can use the `ignore[]` option.

In addition to path ignores, users can also use Prettify [inline control](https://github.com/panoply/prettify#inline-control) comments for skipping blocks of code and files from beautification.

<strong>Ignoring Files</strong><br>

- `{% # @prettify-ignore %}`
- `<!-- @prettify-ignore -->`
- `{% comment %} @prettify-ignore {% endcomment %}`

> **Warning**&nbsp;&nbsp;
> Inline ignore made possible via Prettify are not yet fully operational.

# Configuration

The extension provides a couple of different ways for users to configure and control capabilities. Depending on how regularly you are working with Liquid should help determine which method is best for you. The `.liquidrc` file or package.json `prettify` field method is a great option for developers who require a single point of control over beautification features whereas the same can be said using workspace workspace settings.

### Using workspace settings

Setting configuration using workspace settings is made available to the `liquid` option. When a `.liquidrc` file is present in your projects root then that will run precedence over the `liquid.format.*` options defined in workspace/user settings unless formatting has been disabled (ie: the `liquid.format.enable` option is set to `false`).

Refer to [Workspace Settings](#workspace-settings) for defaults.

### Using the package.json prettify field

In some situations users may prefer to define formatting options within a `package.json` file. The extension will check `package.json` files for a `prettify` field and use any beautification options provided when it is defined. The `prettify` field only accepts format rules and will override vscode workspace/user settings unless a `.liquidrc` file is present. When a .liquidrc file is present in your projects root then that will run precedence over the `prettify` field and workspace settings.

### Using .liquidrc config file

The `.liquidrc` file allows users to control formatting rules used by the extension. You can only provide formatting configuration in .liquidrc files and it does not accept vscode workspace/user settings. It's typically the easiest way to define per-project configurations and shareable rules as whenever the extension detects the presence of a .liquidrc file it will behave in accordance and assume a Liquid environment.

_The `.liquidrc` file will be an essential requirement in Liquify (the future release) and the point of control for the Liquify parser, Language Server, Liquid specifications and other features._

### Supported files

Currently, the extension only supports 2 JSON (with comments) file types:

- `.liquidrc`
- `.liquidrc.json`

### Generating a .liquidrc File

You can generate a `.liquidrc` file using the **Liquid: Generate .liquidrc (defaults)** command in the vscode command palette. If you prefer a more refined output then you can generate a file with **recommended** rules. The recommended rules are best suited to Shopify projects and were helped determined by several talented developers who frequent the [Shopify Developers](https://discord.com/channels/597504637167468564) discord server.

Below is the **default** rules. It is important to note that if the `liquid.format` user/workspace setting contains rules then will be merged with defaults when the file is generated.

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

Liquid snippets are supported in this extension. The filter and tag snippets provided were originally forked from [vscode-liquid-snippets](https://github.com/killalau/vscode-liquid-snippets) but have since changed a considerable amount. Snippets made available by this extension leverage tab invoked "choices" for writing filter pipes `|` and delimiter whitespace dashes `-` on liquid tokens. In addition to the tags and filter snippets, section schema snippets are also supported that help users to quickly generate settings in Shopify theme `{% schema %}` tag blocks.

_Extension snippets will be deprecated in Liquify and will exist only until the extension is superseded. Liquify supports LSP Completions as per [#56](https://github.com/panoply/vscode-liquid/issues/56#issuecomment-852550324)._

<br>

<img src="https://raw.githubusercontent.com/panoply/vscode-shopify-liquid/master/images/schema-snippets.png"  atl="Shopify Schema Snippets"  width="100%">

# [Releases](https://github.com/panoply/vscode-liquid/releases)

As of **v3.0.0** all version releases and changelogs, including the distributed VSIX files can be found in [Releases](https://github.com/panoply/vscode-liquid/releases). Previous version changelogs can be found in the [v2.3.0](https://github.com/panoply/vscode-liquid/blob/v2.3.0/CHANGELOG.md) branch.

# Contributing

Contributions are welcome! This project is uses [pnpm](https://pnpm.js.org/en/cli/install) for package management and is written in TypeScript.

1. Ensure pnpm is installed globally `npm i pnpm -g`
2. Leverage pnpm env if you need to align node versions
3. Clone this repository `git clone https://github.com/panoply/vscode-liquid.git`
4. Run `pnpm i` in the root directory
5. Run `pnpm dev` for development and `pnpm build` for bundles

### Acknowledgements

Special thanks to these talented folks.

- [Curtis](https://github.com/toklok)
- [Mansedan](https://github.com/MattWIP)
- [David Warrington](https://ellodave.dev/)
- [Austin Cheney](https://github.com/prettydiff)

### Support

**PayPal**: [Donate](https://www.paypal.me/paynicos)<br>
**BTC**: `35wa8ChA5XvzfFAn5pMiWHWg251xDqxT51`

<img src="https://raw.githubusercontent.com/panoply/vscode-liquid/v3.0.0/images/line.svg" width="100%">
<br>

🥛 <small>[Νίκος Σαβίδης](mailto:n.savvidis@gmx.com)</small>
