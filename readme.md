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

<pre><code><strong>
  💧 <i>LIQUIFY ~ INFORMATION ON THE FUTURE RELEASE</i></strong>
<p><i>
  For quite some time users of this extension have been waiting for the next
  release (Liquify). Liquify will supersede this extension to facilitate advanced
  features and capabilities. Liquify is a big project which I began developing in 2020.
  This extension will continue to be maintained and slowly transition to Liquify.</i>
</p>
  → <a href="https://github.com/panoply/vscode-liquid/issues/56"><i>Liquify and the future of this extension</i></a>
  → <a href="https://github.com/panoply/vscode-liquid/projects/6"><i>Project Overview and what to expect</i></a>
  → <a href="https://discord.gg/eUNEsxMuWt"><i>Join the Discord and collaborate on the project</i></a>

</code></pre>

<img src="https://raw.githubusercontent.com/panoply/vscode-liquid/v3.0.0/images/banner.png"  atl="Liquid Logo"  width="100%">

# Liquid <small style="color:#999;">(vscode)</small>

The essential vscode extension for [Liquid](https://shopify.github.io/liquid/) (template language). Supports formatting, tag, filter, object and schema auto-completions, hovers, syntax highlighting, diagnostic capabilities and respects HTML Intellisense features.

### Key Features

- Syntax support for Liquid in CSS, SCSS, JavaScript, Markdown and more!
- Formatting and beautification support using [Prettify](https://github.com/panoply/prettify).
- Auto-Completions for Liquid tags, objects, filters, sections and more!
- Embedded JSON Schema Tag language completions and diagnostics in Shopify theme sections.
- Snippet auto-completion for Liquid tags and filters.
- Supports Liquid embedded code block syntax highlighting.
- Integrated Schema stores that provide IntelliSense capabilities within Shopify JSON files.
- Preserves VSCode HTML IntelliSense capabilities in `.liquid` files.
- Liquid Template Literal syntax highlighting support for TypeScript an JavaScript.
- Hover descriptions and reference links on tags, filters, objects and more!

### Showcase

![showcase](https://github.com/panoply/vscode-shopify-liquid/blob/master/images/showcase.gif?raw=true)

# Table of Contents

- [Updating to v3.0](#updating-to-v300)
- [Command Palette](#command-palette)
- [Workspace Settings](#workspace-settings)
  - [Working Directories](#working-directories)
  - [Config Base URL](#config-base-url)
  - [Settings Target](#settings-target)
  - [Controlling Capabilities](#controlling-capabilities)
- [Syntax Support](#syntax-support)
  - [Supported Languages](#supported-languages)
  - [Object Scopes](#object-scopes)
  - [Grammar Injections](#grammar-injections)
  - [Liquid in JSON, YAML and Markdown](#liquid-in-json-yaml-and-markdown)
  - [Liquid in CSS, SCSS, SASS and JavaScript](#liquid-in-css-scss-sass-and-javascript)
  - [Markdown Codeblock](#markdown-codeblock)
  - [Template Literal](#template-literal)
- [Schema IntelliSense](#schema-intellisense)
  - [Liquid Completions](#liquid-completions)
  - [JSON Completions](#json-completions)
  - [JSON Diagnostics](#json-diagnostics)
- [Completions](#completions)
  - [Tags](#tags)
  - [Objects](#objects)
  - [Filters](#filters)
  - [Operators](#operators)
  - [Schema](#schema-shopify)
  - [Sections](#sections-shopify)
- [Formatting](#formatting)
  - [Prettify](#prettify)
  - [Setting Default Formatter](#setting-default-formatter)
  - [Status Bar](#status-bar)
  - [Ignoring Code and/or Files](#ignoring-code-andor-files)
- [Configuration](#configuration)
  - [Using workspace setting](#using-workspace-settings)
  - [Using the package.json prettify field](#using-the-packagejson-prettify-field)
  - [Using .liquidrc rule file](#using-liquidrc-config-file)
  - [Supported .liquidrc files](#supported-liquidrc-files)
  - [Generating .liquidrc files](#generating-a-liquidrc-file)
- [Snippets](#snippets)
  - [Tag and Filter Snippets](#tag-and-filter-snippets)
  - [Schema Snippets](#schema-snippets)
- [Extension Conflicts](#extension-conflicts)
  - [Liquid Languages Support](#liquid-languages-support)
  - [Shopify Liquid](#shopify-liquid)
- [Contributing](#contributing)
  - [Developing](#developing)
  - [Testing](#testing)
- [Releases](#changelog)
- [Acknowledgements](#acknowledgements)
- [Support](#support)

# Updating to v3.0.0

Users who were upgraded to version **3.0.0** will need to align their configurations. The options defined in the **v2.3.0** `.liquidrc` file are no longer supported or valid in **v3.0.0**. File validations will inform about the changes but take a look at the release notes for a complete overview.

- [Release Notes](https://github.com/panoply/vscode-liquid/releases/tag/v3.0.0)
- [Sample Project](https://github.com/panoply/vscode-liquid-sample)

### Continue using v2.3.0

Though it is discouraged you can continue using the old version of this extension. Search for "liquid" within the vscode _extensions_ tab, press the gear icon in the bottom right corner of the listing and choose "Install Another Version" and then select **2.3.0**.

- [Documentation v2.3.0](https://github.com/panoply/vscode-liquid/tree/v2.3.0)

# Command Palette

Below are the available commands exposed to the vscode command palette (`cmd + shift + p`)

| Command                                | Description                                          |
| -------------------------------------- | ---------------------------------------------------- |
| Liquid: Enable Formatting              | _Enable Prettify formatting_                         |
| Liquid: Disable Formatting             | _Disable Prettify formatting_                        |
| Liquid: Format Document                | _Formats the current document_                       |
| Liquid: Generate .liquidrc (defaults)  | _Generate a `.liquidrc` file with default rules_     |
| Liquid: Generate .liquidrc (recommend) | _Generate a `.liquidrc` file with recommended rules_ |
| Liquid: Open Output                    | _Open the Liquid output panel_                       |
| Liquid: Restart Extension              | _Restarts the extension_                             |
| Liquid: Release Notes                  | _Visit the Release notes (opens in browser)_         |

# Workspace Settings

The extension provides various workspace/user settings. The options available to `liquid.format` can be controlled using a `.liquidrc` configuration file or alternatively you can define format options via a `prettify` field in a node `package.json` file. Take a look at the [configuration](#configuration) section for more information.

By default, it is assumed you are using vscode workspace/user settings.

<!--prettier-ignore-->
```jsonc
{

  // Defined the Liquid variation you are working with
  "liquid.engine": "shopify",

  // Path location to a rule configuration file (relative to project root)
  "liquid.config.baseUrl": ".",

  // Controls how extension settings are applied (leave this to workspace)
  "liquid.settings.target": "workspace",

  // Whether or not to enable tag completions
  "liquid.completion.tags": true,

  // Whether or not to enable object completions
  "liquid.completion.objects": true,

  // Whether or not to enable filter completions
  "liquid.completion.filters": true,

  // Whether or not to enable control flow operator completions
  "liquid.completion.operators": true,

  // Whether or not to enable section object completions
  "liquid.completion.sections": true,

  // Whether or not to enable JSON {% schema %} tag completions
  "liquid.completion.schema": true,

  // Whether or not to enable JSON {% schema %} tag diagnostic validations
  "liquid.validate.schema": true,

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

    // Sort attributes according to this list, requires attributeSort to be true
    "attributeSortList": [],

    // Control Liquid delimiter trims, eg: '{%-' and '{{-'
    "delimiterTrims": "preserve",

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

### Config Base URL

The `liquid.config.baseUrl` option can be used to define a **relative** directory path for resolving config files. The option will only work in projects that use `.liquidrc` files or define formatting rules on a package.json `prettify` field (see: [Configuration](#configuration)). Consider the following directory layout:

```bash
 root
 ├─ .vscode
 │  └─ settings.json
 ├─ docs
 │  ├─ .liquidrc.json
 │  └─ index.liquid
 └─ src
    ├─ includes
    └─ views
```

By default, when no `.liquidrc` or `package.json` file (containing a `prettify` field) exist in a projects root, then it is assumed beautification rules have been defined in the `.vscode/settings.json` workspace file. When no formatting rules are defined in the workspace file then the default Prettify and Extension rules will be used. In situations where you need the extension to use a config file that is located outside of the root you can provide a `baseUrl` to the directory containing one of the supported file types.

Targeting the `.liquidrc.json` file located in `docs` directory:

<!--prettier-ignore-->
```jsonc
{
  "liquid.config.baseUrl": "./docs"
}
```

_The `baseUrl` must point to a relative directory not a file. If the directory provided cannot be resolved, root is used._

### Settings Target

The `liquid.settings.target` option is used to determine where the extension writes settings. The default configuration and behavior is to use the `.vscode/settings.json` workspace file. Though you can target `user` settings (ie: global) though it is **highly discouraged** to do so and could lead to unexpected issues outside of Liquid projects.

# Syntax Support

Liquid syntax highlighting is applied using detailed token captures which extend upon the HTML derivative. The core grammars account for all all token structures available in Liquid and have been developed with theming consideration in mind. Liquid contained within Markdown, YAML and JSON languages are supported using vscode injection grammars and applied in a non-conflicting manner. The injected grammars allow intelliSense capabilities provided by vscode to persist and work without interruption while the base Liquid grammar supports HTML intelliSense features within `.liquid` extension files in an isolated manner.

### Supported Languages

| Language Identifier | Language Alias    | Supported Extension       | IntelliSense Support |
| ------------------- | ----------------- | ------------------------- | -------------------- |
| liquid              | Liquid            | .liquid, or .jekyll       | ✓                    |
| json                | JSON              | .json                     | ✓                    |
| yaml                | YAML              | .yaml                     | ✓                    |
| markdown            | Markdown          | .md, .md.liquid           | ✓                    |
| liquid-css          | Liquid CSS        | .css.liquid               | 𐄂                    |
| liquid-scss         | Liquid SCSS       | .scss.liquid, sass.liquid | 𐄂                    |
| liquid-javascript   | Liquid JavaScript | .js.liquid                | 𐄂                    |

### Object Scopes

The extension has context of objects used in the Shopify Liquid variation and applies scoped highlighting based on the object type values directly within grammars. What this means is, whenever your object points to `string`, `boolean` or `integer` then the last known property key of the object will be highlighted according to the type it holds. For example:

<img src="/images/syntax-scopes.png">

Notice that in the above code sample how the different values of object properties have different syntax highlighting. The strings are highlighted as a string, booleans as booleans and numbers as numbers. This is a great way for you to distinguish against the _type_ of property you are referencing.

### Grammar Injections

In order to preserve vscode intellisense capabilities the below languages have Liquid grammars injected into them. The grammar injection will allow Liquid code to be highlighted and treated like the syntax exists as part of the language/s.

- JSON
- Yaml
- Markdown

When these languages contain Liquid syntax, vscode might complain about invalid code. You should consider disabling validations on these languages when they contain Liquid. Please be aware that in situations where you leverage linters or third party tools that Liquid code will typically be interpreted as invalid. It is up to you to take the necessary steps to disable and prevent such issues from becoming problematic to your development experience.

```jsonc
{
  // Disabling JSON validations when it contains Liquid syntax
  "json.validate.enable": false,

  // Disabling JavaScript validations when it contains Liquid syntax
  "javascript.validate.enable": true
}
```

### Liquid in JSON, YAML and Markdown

Liquid tags, comments and object grammars are injected into JSON, YAML and Markdown languages. External language code regions and anything which requires an embedded language (ie: `{% schema %}`) are excluded. There is no need to use a `.liquid` suffix on these file names for Liquid syntax highlighting as it will work out of the box.

_If for any reason the injections become problematic then please report an issue._

### Liquid in CSS, SCSS, SASS and JavaScript

Liquid syntax contained in JavaScript, CSS, SCSS, SASS and other supported languages require a `.liquid` extension suffix be applied on file names. The suffix will associate these languages to a designated grammar, for example:

```
.css    →   .css.liquid
.scss   →   .scss.liquid
.sass   →   .scss.liquid
.js     →   .js.liquid
```

_If the required `.liquid` suffix is problematic to your use case then use [file associations](https://code.visualstudio.com/docs/languages/identifiers). Please note that the language native IntelliSense capabilities are not supported in the suffixed files._

### Markdown Codeblock

Liquid markdown embedded code block regions are supported in `.md` files.

````md
```liquid
{% if x %} {{ object.prop }} {% endif %}`
```
````

### Template Literal

Liquid template literals are supported for usage within JavaScript, JSX and TypeScript languages. The literal will provide both HTML and Liquid syntax highlighting. When expressing a template literal suffixed with `liquid` all containing code will have Liquid syntax highlighted.

```ts
liquid`{% if condition == true %} {{ object.prop }} {% endif %}`;
```

# Schema IntelliSense

The current version (**v3.2^**) of the extension supports schema tag intelliSense capabilities. This is achieved on the client until the Liquify supersede and handling moves to the server using LSP. The feature drastically improves productivity for developers working with the Shopify Liquid variation.

### Liquid Completions

Liquid `section.*` object completions are provided in accordance with the contents contained within `{% schema %}` embedded tags. Section completions are scope aware and respect `block.type` regions implemented with either control flow `{% if %}` or `{% case %}` tags. The tag completions do not _yet_ support re-assignment variable naming, which means you will need to use the default object names (`section.settings`, `section.blocks` and `block.settings`) for completions to work. You can disable/enable Liquid section object completions within your workspace settings configuration.

**Workspace Settings**

```jsonc
{
  "liquid.completion.sections": true // Pass a value of false to disable
}
```

### JSON Completions

Embedded JSON contained within `{% schema %}` tags support completions in accordance with trigger characters. The JSON completions are made possible through Schema Stores maintained at [@liquify/schema](#). You can disable/enable JSON schema completions within your workspace settings configuration.

**Workspace Settings**

```jsonc
{
  "liquid.completion.schema": true // Pass a value of false to disable
}
```

### JSON Diagnostics

In addition to JSON and Liquid completion support, schema JSON diagnostic validation is also supported. This capability will warn you when incorrect or otherwise invalid JSON syntax and structures are provided. You can disable/enable JSON schema diagnostics within your workspace settings configuration.

**Workspace Settings**

```jsonc
{
  "liquid.validate.schema": true // Pass a value of false to disable
}
```

# Completions

The extension supports completion capabilities. This is a **preview** feature and will be improved upon as the extension progresses to Liquify, as such the integration is elementary. Completions are similar to snippets but a little more refined. The completions will be invoked and made available depending on trigger characters and previous/surrounding character sequences.

### Tags

Liquid tag completions are made available by typing the `%` character.

**Workspace Settings**

```jsonc
{
  "liquid.completion.tags": true // Pass a value of false to disable
}
```

### Objects

Liquid object completions will be invoked within tokens at different points. Object properties are triggered when typing `.` and the previous keyword is a known object reference.

**Workspace Settings**

```jsonc
{
  "liquid.completion.objects": true // Pass a value of false to disable
}
```

### Filters

Liquid filter completions are made available by typing the `|` character. Filter completions are persisted with whitespace, meaning when the completion list will remain open when the previous character is determined to be a filter operator.

**Workspace Settings**

```jsonc
{
  "liquid.completion.filters": true // Pass a value of false to disable
}
```

### Operators

Liquid operator completions are made available within control flow tags such as `{% if %}`, `{% elsif %}` and `{% unless %}`. Operator completions will be invoked according to surrounding structures.

**Workspace Settings**

```jsonc
{
  "liquid.completion.operators": true // Pass a value of false to disable
}
```

### Schema (Shopify)

Liquid `{% schema %}` embedded JSON tags support completions using JSON Schema Store files. Shopify schema tags is currently a **preview** feature.

**Workspace Settings**

```jsonc
{
  "liquid.completion.schema": true // Pass a value of false to disable
}
```

### Sections (Shopify)

Liquid `section.*` object completions are provided in accordance with the contents contained within `{% schema %}` embedded tags. Section completions are scope aware and respect `block.type` regions implemented with either control flow `{% if %}` or `{% case %}` tags.

**Workspace Settings**

```jsonc
{
  "liquid.completion.sections": true // Pass a value of false to disable
}
```

# Formatting

Formatting can be enabled/disabled via the command palette and will respect `editor.formatOnSave`. When Liquid formatting is **enabled** the extension will format Liquid and all suffixed `*.liquid` files with a language supported by [Prettify](https://github.com/panoply/prettify). You can **disable** beautification by clicking the 💧 emoji icon in the status bar or exclude directories/files from handling using the `format.ignore` setting.

Formatting options can be defined in a `.liquidrc` file, package.json `prettify` field or alternatively you can use workspace settings.

### Prettify 🎀

[Prettify](https://github.com/panoply/prettify) is used to facilitate formatting capabilities by the extension. Prettify is built atop of the late but powerful Sparser lexing algorithm and has since been adapted for refined usage with Liquid and this extension. Prettify exposes a granular set of rules and supports Liquid beautification in various markup, script and style languages.

I actively maintain Prettify and it is currently in a **pre-release** (beta) stage. The ambition is to eventually have the tool become a competitive alternative to Prettier and disrupt "opinionated" conventions imposed upon the code nexus, one size does not fit all. Prettify was introduced in version **3.0.0** replacing [PrettyDiff](https://github.com/prettydiff/prettydiff) as the core formatter for this extension. Though Prettify has yet to ship an official release candidate it is stable enough for usage and its adaption fixes previous version defects.

- [Repository](https://github.com/panoply/prettify)
- [Playground](https://liquify.dev/prettify)

_Prettify, once stable enough for the big time will be made available for usage in a separate extension_

### Setting Default Formatter

In some situations you may have another extension handling formatting and you will need to explicitly define an in-language `editor.defaultFormatter` within your vscode workspace/user settings. VSCode will typically inform you about this but if for any reason you are unable to get formatting to work, try setting the in-language default formatter.

_Be sure to define only the languages you wish to have formatted by the extension. If you don't want Prettify to handle formatting then set the option `liquid.format.enable` to `false`._

```jsonc
{
  // Enables formatting of .liquid files
  "[liquid]": {
    "editor.defaultFormatter": "sissel.shopify-liquid",
    "editor.formatOnSave": true
  },
  // Enables formatting of all .css.liquid files
  "[liquid-css]": {
    "editor.defaultFormatter": "sissel.shopify-liquid",
    "editor.formatOnSave": false
  }
}
```

In addition to the above defaults, you can also choose to have Prettify beautify other supported languages. Please note, that when extending to the below languages that Prettify is still in its early stages so results may not be perfect, so think wisely. Liquid syntax contained in any of these languages is supported!

```jsonc
{
  // Enables formatting of all .html files
  "[html]": {
    "editor.defaultFormatter": "sissel.shopify-liquid"
  },
  // Enables formatting of all .tsx files
  "[xml]": {
    "editor.defaultFormatter": "sissel.shopify-liquid"
  },
  // Enables formatting of all .css files
  "[css]": {
    "editor.defaultFormatter": "sissel.shopify-liquid"
  },
  // Enables formatting of all .json files
  "[json]": {
    "editor.defaultFormatter": "sissel.shopify-liquid"
  },
  // Enables formatting of all .jsonc files
  "[jsonc]": {
    "editor.defaultFormatter": "sissel.shopify-liquid"
  }
}
```

### Status Bar

When the extension is enabled and a supported file has been opened in the editor you'll see a 💧 emoji appear in the bottom right hand side of the vscode status bar. This is the extensions **status bar item** and that will allow you to enable/disable formatting (programmatically). It also informs upon ignored files, notifies you when the parser encounters any code errors and is displayed when a `.liquid` file is opened.

<!-- prettier-ignore -->
| Status  | Command | Action |
|:--|:--|:--|
| <img src="https://github.com/panoply/vscode-liquid/blob/v3.0.0/images/status-enabled.png?raw=true"  width="50px"> | **Enabled** | _Clicking the status bar item in this state will disable formatting_ |
| <img src="https://github.com/panoply/vscode-liquid/blob/v3.0.0/images/status-disabled.png?raw=true"  width="50px"> | **Disabled** |  _Clicking the status bar item in this state will enable formatting_ |
| <img src="https://github.com/panoply/vscode-liquid/blob/v3.0.0/images/status-ignored.png?raw=true"  width="50px"> | **Ignoring**  | _Clicking the status bar item in this state opens the output panel_
| <img src="https://github.com/panoply/vscode-liquid/blob/v3.0.0/images/status-error.png?raw=true"  width="50px"> | **Errors**  | _Clicking the status bar item in this state opens the output panel_

### Ignoring Code and/or Files

You can skip formatting on files, directories and code input a few different ways. If you are using workspace/user settings for configuration then you can pass a glob list of paths relative to the projects root using the `liquid.format.ignore[]` option. Folks leveraging the `.liquidrc` file or package.json `prettify` field for defining beautification rules can use the `ignore[]` option.

In addition to path ignores, users can also take advantage of Prettify's [inline control](https://github.com/panoply/prettify#inline-control) comments for skipping blocks of code and files from beautification.

<strong>Ignoring Regions</strong><br>

- `@prettify-ignore-start`
- `@prettify-ignore-end`

_You can also annotate HTML tags with `data-prettify-ignore` attributes_

<strong>Ignoring Files</strong><br>

- `<!-- @prettify-ignore -->`
- `{% # @prettify-ignore %}`
- `{% comment %} @prettify-ignore {% endcomment %}`
- `/* @prettify-ignore */`
- `// @prettify-ignore`

> **Warning**&nbsp;
> Inline comment ignores made possible via Prettify might be little flakey until an official release.

# Configuration

The extension provides a couple of different ways for users to configure and control capabilities. Depending on how regularly you are working with Liquid should help determine which method is best for you. The `.liquidrc` file or package.json `prettify` field method are great option for developers who prefer single point of control for beautification features. Developers who prefer to keep things in the editor (ie: `.vscode/settings.json`) can use workspace/user settings.

### Using workspace settings

Setting configuration using workspace settings is made available on the `liquid` option. When a `.liquidrc` file is present in your projects root then that will take precedence over the `liquid.format.*` options defined in workspace/user settings unless formatting has been disabled (ie: the `liquid.format.enable` option is set to `false`).

Refer to [Workspace Settings](#workspace-settings) for defaults.

### Using the package.json prettify field

In some situations users may prefer to define formatting options within a `package.json` file. The extension will check `package.json` files for a `prettify` field and use any beautification options provided when it is defined. The `prettify` field only accepts format rules and overrides vscode workspace/user settings unless a `.liquidrc` file is present. When a `.liquidrc` file is present in your projects root then that will take precedence over the `prettify` field and `liquid.format.*` workspace/user setting.

### Using .liquidrc config file

The `.liquidrc` file allows users to control formatting rules used by the extension. You can only provide formatting configuration in `.liquidrc` files, it does not accept additional vscode workspace/user settings. This method is typically the easiest way to define per-project configurations and shareable rules. Whenever the extension detects the presence of a `.liquidrc` file it will behave in accordance and assume a Liquid environment.

_The `.liquidrc` file will be an essential requirement in Liquify (the future release) and the point of control for the Liquify parser, Language Server, Liquid specifications and other features. If you use Liquid a lot, then it a good idea to use this method._

### Supported .liquidrc files

Currently, the extension only supports 2 JSON (with comments) file types:

- `.liquidrc`
- `.liquidrc.json`

### Generating .liquidrc Files

You can generate a `.liquidrc` file using the **Liquid: Generate .liquidrc (defaults)** command in the vscode command palette. If you prefer a more refined output then you can generate a file with **recommended** rules. The recommended rules are best suited to Shopify projects and were helped determined by several talented developers who frequent the [Shopify Developers](https://discord.com/channels/597504637167468564) discord server.

Below is the **default** rules. It is important to note that if the `liquid.format.*` user/workspace setting contains rules it will be merged with these defaults when the file is generated.

```jsonc
{
  "ignore": [],
  "wrap": 0,
  "commentIndent": true,
  "crlf": false,
  "indentSize": 2,
  "preserveComment": true,
  "preserveLine": 2,
  "endNewLine": true,
  "markup": {
    "commentNewline": true,
    "forceLeadAttribute": false,
    "forceAttribute": false,
    "forceIndent": false,
    "attributeCasing": "preserve",
    "attributeSort": false,
    "attributeSortList": [],
    "correct": false,
    "delimiterSpacing": false,
    "preserveAttributes": false,
    "preserveText": true,
    "quoteConvert": "none",
    "selfCloseSpace": false
  },
  "json": {
    "arrayFormat": "default",
    "braceAllman": false,
    "bracePadding": false,
    "objectIndent": "default",
    "objectSort": false
  },
  "style": {
    "braceAllman": false,
    "classPadding": false,
    "sortProperties": false,
    "sortSelectors": false,
    "selectorList": false,
    "comments": false,
    "correct": false,
    "noLeadZero": false,
    "quoteConvert": "none"
  },
  "script": {
    "correct": false,
    "arrayFormat": "indent",
    "braceAllman": false,
    "methodChain": 3,
    "caseSpace": true,
    "endComma": "never",
    "quoteConvert": "single",
    "elseNewline": true,
    "functionNameSpace": false,
    "functionSpace": true,
    "ternaryLine": true,
    "braceNewline": false,
    "bracePadding": true,
    "braceStyle": "none",
    "neverFlatten": false,
    "noCaseIndent": true,
    "noSemicolon": false,
    "objectIndent": "indent",
    "objectSort": false,
    "vertical": false,
    "variableList": false
  }
}
```

# Snippets

Liquid snippets are supported in this extension. The filter and tag snippets provided were originally forked from [vscode-liquid-snippets](https://github.com/killalau/vscode-liquid-snippets) but have since changed a considerable amount.

### Tag Snippets

Snippets made available leverage tab invoked "choices" for applying filter pipes `|` and delimiter whitespace dashes `-` within liquid tokens. In addition to the tags and filter snippets, section schema snippets are also supported which help users to quickly generate settings within Shopify theme `{% schema %}` tag blocks.

# Extension Conflicts

If you are using alternative extensions such as the Shopify Liquid or Liquid Languages Support extension then you may run into some issues. The conflicts which may be incurred will be caused because these extensions also target Liquid grammars.

The vscode marketplace has 3 different extensions for Liquid support:

- **Liquid**
- Liquid Languages Support
- Shopify Liquid

This extension uses the **Liquid** display name and is considered the official Liquid extension for vscode.

### Liquid Languages Support

If you are using or have installed the [Liquid Languages Support](https://marketplace.visualstudio.com/items?itemName=neilding.language-liquid) extension then it is recommended that you either uninstall or disable it. The Liquid Languages Support extension is not maintained and the grammars are mostly obsolete. Using it along side this extension and Shopify Liquid is problematic, boycott it, as it does nothing but increase the editors startup time.

### Shopify Liquid

If you are using or have installed [Shopify Liquid](https://marketplace.visualstudio.com/items?itemName=Shopify.theme-check-vscode) then you _may_ need to choose (or alternate) between the Shopify Liquid extension and this extension. The Shopify Liquid extension is for Shopify projects (specifically themes) and provides a couple of great features which this extension does not (yet) support (like validations).

These capabilities made available by Shopify Liquid are nice but they come with limitations as the extension (Shopify Liquid) does not support Windows and its LSP (Language Server) implementation requires Ruby to function making it rather resource heavy and exhaustive on your machine. Though the extra features like validations do indeed help in _some_ cases, they are specific to Shopify themes and not much use outside of that.

_Capabilities available in the future release (Liquify) support all current features of the Shopify Liquid extension._

# Releases

As of **v3.0.0** all version releases and changelogs including the distributed VSIX files can be found in [Releases](https://github.com/panoply/vscode-liquid/releases). Previous version changelogs can be found in the [v2.3.0](https://github.com/panoply/vscode-liquid/blob/v2.3.0/CHANGELOG.md) branch.

- [Releases](https://github.com/panoply/vscode-liquid/releases)
- [Roadmap](https://github.com/panoply/vscode-liquid/projects/6)

# Contributing

Contributions are welcome! This project uses [pnpm](https://pnpm.js.org/en/cli/install) for package management and is written in TypeScript.

1. Ensure pnpm is installed globally `npm i pnpm -g`
2. Leverage `pnpm env` if you need to align node versions
3. Clone this repository `git clone https://github.com/panoply/vscode-liquid.git`
4. Run `pnpm i` in the root directory
5. Run `pnpm dev` for development mode

### Developing

The project uses [tsup](https://tsup.egoist.sh) for producing the distributed bundle. You can produce a VSIX by running the `pnpm build` command. The `.vscode/launch.json` file contains the extension host logic.

```bash
pnpm dev         # Development in watch mode
pnpm build       # Builds extension and packages VSIX
pnpm grammar     # Generates object grammars and applies them to liquid.tmLanguage.json
pnpm dry         # Prints list of files that are packages into VSIX
```

### Testing

The extension has undergone E2E and capability tests, but it does not leverage the vscode test suite. The extension itself is simple enough where extensive tests are not a matter of necessity. The contained `test` directory is used when invoking the debugger and extension host. Contained within that directory are various sample files that can be used for validating capabilities, grammars and invocation.

_PR's are welcome for test cases, but be aware that the Liquify supersede will make them obsolete in due time._

# Acknowledgements

Thanks to these talented folks who's work, ideas, feedback and contributions make this extension possible.

- [Curtis](https://github.com/toklok)
- [Mansedan](https://github.com/MattWIP)
- [David Warrington](https://ellodave.dev/)
- [Austin Cheney](https://github.com/prettydiff)

# Support

No obligation but coffee is always appreciated.

**PayPal**: [Donate](https://www.paypal.me/paynicos)<br>
**BTC**: `35wa8ChA5XvzfFAn5pMiWHWg251xDqxT51`

<br>

🥛 <small>[Νίκος Σαβίδης](mailto:n.savvidis@gmx.com)</small>
