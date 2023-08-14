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
<a href="https://github.com/panoply/esthetic">
  <img src="https://img.shields.io/npm/v/esthetic?style=popout-square&color=hotpink&label=%F0%9F%8E%80%20Æsthetic%20%20">
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
  → <a href="https://github.com/panoply/liquify"><i>Track progress in the Liquify Repository</i></a>
  → <a href="https://github.com/panoply/vscode-liquid/issues/56"><i>Liquify and the future of this extension</i></a>
  → <a href="https://discord.gg/eUNEsxMuWt"><i>Join the Discord and collaborate on the project</i></a>

</code></pre>

<img src="https://raw.githubusercontent.com/panoply/vscode-liquid/v3.0.0/images/banner.png"  atl="Liquid Logo"  width="100%">

# Liquid <small style="color:#999;">(vscode)</small>

The essential vscode extension for [Liquid](https://shopify.github.io/liquid/) (template language). Supports formatting, tag, filter, object, locale, snippet and schema auto-completions, hovers, syntax highlighting and diagnostic capabilities.

### Key Features

- Syntax Highlighting for Liquid in CSS, SCSS, JavaScript, Markdown and more!
- Formatting support using [Æsthetic](https://github.com/panoply/esthetic).
- Completions for Liquid tags, objects, filters, sections and more!
- Embedded JSON Schema Tag language completions and diagnostics in Shopify theme sections.
- Snippet auto-completion for Liquid tags and filters and Shopify Schema sections.
- Integrated Schema stores that provide IntelliSense capabilities within Shopify JSON files.
- Preserves VSCode HTML IntelliSense capabilities in `.liquid` files.
- Informative Hover descriptions and reference links on tags, filters, objects and more!
- Liquid Template Literal syntax highlighting support for TypeScript and JavaScript.
- Hover descriptions and reference links on tags, filters, objects and more!

### Showcase

![showcase](https://github.com/panoply/vscode-shopify-liquid/blob/master/images/showcase.gif?raw=true)

# Table of Contents

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
  - [JSON Completions](#json-completions)
  - [JSON Diagnostics](#json-diagnostics)
- [Completions](#completions)
- [Formatting](#formatting)
  - [Æsthetic](#esthetic)
  - [Setting Default Formatter](#setting-default-formatter)
  - [Status Bar](#status-bar)
  - [Ignoring Code and/or Files](#ignoring-code-andor-files)
- [Configuration](#configuration)
  - [Using workspace setting](#using-workspace-settings)
  - [Using .liquidrc rule file](#using-liquidrc-config-file)
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

# Updating to v4.0.0

Users who were upgraded to version **4.0.0** will need to align their configurations.

- [Release Notes](https://github.com/panoply/vscode-liquid/releases/tag/v3.0.0)
- [Sample Project](https://github.com/panoply/vscode-liquid-sample)

# Command Palette

Below are the available commands exposed to the vscode command palette (`cmd + shift + p`)

| Command                                | Description                                          |
| -------------------------------------- | ---------------------------------------------------- |
| Liquid: Enable Formatting              | _Enable Æsthetic formatting_                         |
| Liquid: Disable Formatting             | _Disable Æsthetic formatting_                        |
| Liquid: Format Document                | _Formats the current document_                       |
| Liquid: Generate .liquidrc (defaults)  | _Generate a `.liquidrc` file with default rules_     |
| Liquid: Generate .liquidrc (recommend) | _Generate a `.liquidrc` file with recommended rules_ |
| Liquid: Open Output                    | _Open the Liquid output panel_                       |
| Liquid: Restart Extension              | _Restarts the extension_                             |
| Liquid: Release Notes                  | _Visit the Release notes (opens in browser)_         |

# Workspace Settings

The extension provides various workspace/user settings. Some options can be controlled using a `.liquidrc` configuration file. Take a look at the [configuration](#configuration) section for more information. Below is a _bare minimum_ sample that shows how you'd configure settings for your project.

By default, it is assumed you are using vscode workspace/user settings.

<!--prettier-ignore-->
```jsonc
{

  // Liquid Formatting
  //
  // Leave the "editor.formatOnSave" option set to false.
  // You can enable it by pressing using the 💧 button in the status bar.
  //
  "[liquid]": {
    "editor.defaultFormatter": "sissel.shopify-liquid",
    "editor.formatOnSave": false
  },

  // Liquid Configuration
  //
  // If you are not using a .liquidrc file you can set the
  // "liquid.config.method" setting to "workspace"
  //
  "liquid.config.baseUrl": ".",
  "liquid.config.method": "liquidrc",

  // Liquid Completion Settings
  //
  // These settings will enable/disable completions from showing.
  //
  "liquid.completion.tags": true,
  "liquid.completion.objects": true,
  "liquid.completion.filters": true,
  "liquid.completion.operators": true,
  "liquid.completion.schema": true,

  // Liquid Validations
  //
  // This setting will enable/disable validations in {% schema %} JSON
  //
  "liquid.validate.schema": true,

  // Liquid Hover Descriptions
  //
  // These settings will enable/disable hover descriptions from showing
  //
  "liquid.hover.tags": true,
  "liquid.hover.filters": true,
  "liquid.hover.objects": true,
  "liquid.hover.schema": true,

  // Uncomment if you are not using a .liquidrc file
  //
  // "liquid.engine": "shopify",

  // Uncomment if you are not using a .liquidrc file
  //
  // "liquid.files.shopify": {},
  // "liquid.files.11ty": {},

  //  Uncomment these if you do not use a .liquidrc file
  //
  // "liquid.format.rules": {
  //   "ignore":[],
  //   "liquid": {},
  //   "html": {}
  // }

}
```

### Config Base URL (optional)

The `liquid.config.baseUrl` option can be used to define a **relative** directory path for resolving a `.liquidrc` file. The option will only work in projects that use `.liquidrc` files. Consider the following directory layout:

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

By default, when no `.liquidrc` exists in the root of the opened project, then it is assumed beautification rules have been defined in the `.vscode/settings.json` workspace file. If no settings are defined in the workspace file then the defaults will be used. In situations where you need the extension to use a config file that is located outside of the root of your project you can leverage the `baseUrl` setting.

Targeting the `.liquidrc.json` file located in `docs` directory:

<!--prettier-ignore-->
```jsonc
{
  "liquid.config.baseUrl": "./docs"
}
```

_The `baseUrl` must point to a relative directory not a file. If the directory provided cannot be resolved, root is used._

# Syntax Support

Liquid syntax highlighting is applied using detailed token captures which extend upon the HTML derivative. The core grammars account for all token structures available in Liquid and have been developed with theming consideration in mind. Liquid contained within Markdown, YAML and JSON languages are supported using vscode injection grammars and applied in a non-conflicting manner. The injected grammars allow intelliSense capabilities provided by vscode in these languages to persist and work without interruption.

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

### Grammar Injections

In order to preserve vscode intellisense capabilities the below languages have Liquid grammars injected into them. The grammar injection will allow Liquid code to be highlighted and treated like the syntax exists as if it were part of the language.

- JSON
- Yaml
- Markdown

When these languages contain Liquid syntax, vscode might complain about invalid code. You should consider disabling validations when they contain Liquid. Please be aware that in situations where you leverage linters or third party tools, Liquid syntaxes will typically be interpreted as invalid. It is up to you to take the necessary steps to disable and prevent such issues from becoming problematic to your development experience.

```jsonc
{
  // Disabling JSON validations when it contains Liquid syntax
  "json.validate.enable": false,

  // Disabling JavaScript validations when it contains Liquid syntax
  "javascript.validate.enable": false
}
```

### Liquid in JSON, YAML and Markdown

Liquid tags, comments and object grammars are injected into JSON, YAML and Markdown languages. External language code regions and anything which requires an embedded language (ie: `{% schema %}`) are excluded. There is no need to use a `.liquid` suffix on these file names as Liquid syntax highlighting will be applied automatically.

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
{% if x %} {{ object.prop }} {% endif %}
```
````

### Template Literal

Liquid template literals are supported for usage within JavaScript, JSX and TypeScript languages. The literal will provide both HTML and Liquid syntax highlighting. When expressing a template literal suffixed with `liquid` all containing code will have Liquid syntax highlighted.

```ts
liquid`{% if condition == true %} {{ object.prop }} {% endif %}`;
```

Take a look at [Language Literals](https://github.com/panoply/language-literals) NPM module and the [VSCode Extension](https://marketplace.visualstudio.com/items?itemName=sissel.language-literals) for syntax highlighting and de-dentation logic of string input.

### Frontmatter

The extension also provides additional syntax highlighting for language annotated frontmatter atop of YAML highlighting support. Language annotated frontmatter regions are typically implemented in [11ty](https://www.11ty.dev/) projects.

```js
// Frontmatter YAML
---
---

// Frontmatter JavaScript
---js
---

// Frontmatter JSON
---json
---
```

# Schema IntelliSense

As of version **v3.2^** this extension supports schema tag intelliSense capabilities. The feature drastically improves productivity for developers working with the Shopify Liquid variation. Section `{% schema %}` provide users with common JSON features such as completions, validations, hovers and snippets. The contents of schema tags (ie: section settings and blocks) are made available to Liquid `{{ section.settings.* }}` and `{{ block.settings.* }}` objects.

### Liquid Completions

Liquid `section.*` object completions are provided in accordance with the contents contained within `{% schema %}` embedded tags. Section completions are scope aware and respect `block.type` regions implemented with either control flow `{% if %}` or `{% case %}` tags. Tag completions support sensible re-assignment variable naming, which means you can assign to different names and completions will work. You can disable/enable Liquid section object completions within your workspace settings configuration.

**Workspace Settings**

```jsonc
{
  "liquid.completion.sections": true // Pass a value of false to disable
}
```

### JSON Completions

Embedded JSON contained within `{% schema %}` tags support completions in accordance with trigger characters. The JSON completions are made possible through Schema Stores maintained at [@liquify/schema](https://github.com/panoply/liquify-schema). VSCode Liquid has full IETF Support and also provides snippet (<kbd>Ctrl</kbd> + <kbd>Space</kbd>) triggers completions for settings and blocks. You can disable/enable JSON schema completions within your workspace settings configuration.

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

The extension supports Standard and Shopify variation completions. This feature and will be improved upon as the extension progresses to Liquify, so the integration is elementary. Completions will be displayed in an intelligent manner.

- [Tags](#tags)
- [Objects](#objects)
- [Filters](#filters)
- [Operators](#operators)
- [Variables](#variables)
- [Snippets](#files)
- [Sections](#files)

```jsonc
{
  "liquid.completion.tags": true,
  "liquid.completion.objects": true,
  "liquid.completion.operators": true,
  "liquid.completion.filters": true,
  "liquid.completion.variables": true,
  "liquid.completion.schema": true
}
```

<details>
<summary>
<strong>Tags</strong>
</summary>

Liquid tag completions are tokens which are encapsulated within `{%` and `%}` delimiters. Tag completions can be invoked by typing the `%` character.

**Workspace Settings**

```jsonc
{
  "liquid.completion.tags": true // Pass a value of false to disable
}
```

</details>

<details>
<summary>
<strong>Objects</strong>
</summary>

Liquid object completions will be invoked within tokens at different points. The parse algorithm will uses the previous character sequence to determine when object completions are to be provided. Object properties are triggered when a dot `.`character is typed that follows a known keyword (object) reference.

**Workspace Settings**

```jsonc
{
  "liquid.completion.objects": true // Pass a value of false to disable
}
```

</details>

<details>
<summary>
<strong>Filters</strong>
</summary>

Liquid filter completions will be invoked by typing the `|` character. Filter completions are persisted with whitespace, so the completion list will remain open when the previous character is determined to be a filter operator.

**Workspace Settings**

```jsonc
{
  "liquid.completion.filters": true // Pass a value of false to disable
}
```

</details>

<details>
<summary>
<strong>Operators</strong>
</summary>

Liquid operator completions will be invoked within control flow tokens such as `{% if %}`, `{% elsif %}` and `{% unless %}` tag types. Operator completions will be provided according to surrounding structures and support the `and`, `or` and `contains` keyword logics.

**Workspace Settings**

```jsonc
{
  "liquid.completion.operators": true // Pass a value of false to disable
}
```

</details>

<details>
<summary>
<strong>Variables</strong>
</summary>

Liquid variable completions are supported and made available a per-document basis. The extension will use your current cursor position when providing variable completions and only those which are accessible via the Liquid rendering engine will be shown. Liquid `{% assign %}` and `{% capture %}` tokens are analyzed and will be provided within completion items.

**Workspace Settings**

```jsonc
{
  "liquid.completion.variables": true // Pass a value of false to disable
}
```

</details>

# Files

The extension supports file completions. Depending on the specified Liquid `engine` variation defined, different types of file completions are made available. `locale`, `settings`, `snippets` and `section` file based completions but you will need to provide path references to enable this capability. You can provide path references in your `.liquidrc` file on `files` key. The paths must be relative to your projects root directory.

**Using `.liquidrc` File**

```jsonc
{
  "engine": "shopify",
  "files": {
    "locales": "locales/en.default.json",
    "settings": "config/settings_data.json",
    "snippets": ["snippets/*.liquid"],
    "sections": ["sections/*.liquid"]
  }
}
```

<details>
<summary>
<strong>Workspace Settings</strong>
</summary>

If you defining configuration via workspace settings, the extension only supports project level definition references but does not support global (User Preferences) definitions for this setting. This means you can provide these references within your `.vscode/settings.json` file on a per-project level but you cannot provide this within your global configuration.

```jsonc
{
  // Shopify Liquid Variation
  // Expects the "engine" option to be using "shopify"
  //
  "liquid.files.shopify": {
    "locales": "",
    "settings": "",
    "snippets": [],
    "sections": []
  },

  // Eleventy Liquid Variation
  // Expects the "engine" option to be using "11ty"
  //
  "liquid.files.11ty": {
    "data": [],
    "includes": [],
    "layouts": []
  }
}
```

</details>

# Formatting

Formatting can be enabled/disabled via the command palette and references the language specific `editor.formatOnSave` vscode preference setting to determine whether or not it should be used. When Liquid formatting is **enabled** the extension will beautify Liquid and all suffixed `*.liquid` files. You can **disable** beautification by clicking the 💧 emoji icon in the status bar or exclude directories/files from handling using the `format.ignore[]` setting.

### Æsthetic

[Æsthetic](https://github.com/panoply/esthetic) is used to facilitate formatting capabilities under the hood. Æsthetic is built atop of the late but powerful Sparser lexing algorithm and has since been adapted for refined usage with Liquid and in particular this extension. Æsthetic exposes 30+ different formatting rules and supports Liquid beautification in various markup, script and style languages.

I actively maintain Æsthetic and it is currently in a **pre-release** (beta) stage. The ambition is to eventually have the tool become a competitive alternative to Prettier and disrupt "opinionated" conventions imposed upon the code nexus, one size does not fit all. Æsthetic was introduced in version **3.0.0** as the core formatter for this extension. Though Æsthetic has yet to ship an official release candidate it is stable enough for usage and its adaption fixes previous version defects.

- [Repository](https://github.com/panoply/esthetic)
- [Playground](https://æsthetic.dev/playground)

_Æsthetic, once stable enough for the big time will be made available for usage in a separate extension_

### Setting Default Formatter

In some situations you may have another extension handling formatting and you will need to explicitly define an in-language `editor.defaultFormatter` within your vscode workspace/user settings. VSCode will typically inform you about this but if for any reason you are unable to get formatting to work, try setting the in-language default formatter.

_Be sure to define only the languages you wish to have formatted by the extension._

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
    "editor.formatOnSave": true
  }
}
```

In addition to the above defaults, you can also choose to have Æsthetic format other supported languages.

```jsonc
{
  // Enables formatting of all .html files
  "[html]": {
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

> **Note**&nbsp;
> Æsthetic is still in its early stages and results may not be perfect. Extend with caution to languages other than Liquid/HTML

### Ignoring Files

You can skip formatting on files, directories and code input a few different ways. If you are using workspace/user settings for configuration then you can pass a glob list of paths relative to the projects root using the `liquid.format.ignore[]` option. Folks leveraging the `.liquidrc` file for defining beautification rules can use the `format.ignore[]` setting.

**Using `.liquidrc` File**

```jsonc
{
  "format": {
    "ignore": []
  }
}
```

<details>
<summary>
<strong>Using Workspace Settings</strong>
</summary>

If you are using a `.vscode/settings.json` file to define formatting options, you can use the following structure:

```jsonc
{
  "liquid.format.rules": {
    "ignore": []
  }
}
```

</details>

### Ignore Comments

In addition to file ignores, users can also take advantage of Æsthetic [inline control](https://github.com/panoply/esthetic#inline-control) comments. This will allow you to skip blocks of code or files from beautification.

<strong>Ignoring Blocks</strong><br>

- `esthetic-ignore-next`

<strong>Ignoring Regions</strong><br>

- `esthetic-ignore-start`
- `esthetic-ignore-end`

_You can also annotate HTML tags with `data-esthetic-ignore` attributes_

<strong>Ignoring Files</strong><br>

- `<!-- esthetic-ignore -->`
- `{% # esthetic-ignore %}`
- `{% comment %} esthetic-ignore {% endcomment %}`
- `/* esthetic-ignore */`
- `// esthetic-ignore`

> **Warning**&nbsp;
> Inline comment ignores made possible via Æsthetic might be little flakey until an official release.

# Status Bar

When the extension is enabled and a supported `*.liquid` file has been opened in the editor you'll see an 💧 emoji appear in the bottom right hand side of the vscode status bar. This is the extensions **status bar item** and it will allow you to enable/disable formatting (programmatically), inform you when an ignored file is open and notifies you when the Æsthetic encounters any code errors during beautification.

> The 💧 emoji will only show when a `.liquid` file is opened.

<!-- prettier-ignore -->
| Status  | Command | Action |
|:--|:--|:--|
| <img src="https://github.com/panoply/vscode-liquid/blob/v3.0.0/images/status-enabled.png?raw=true"  width="50px"> | **Enabled** | _Clicking the status bar item in this state will disable formatting_ |
| <img src="https://github.com/panoply/vscode-liquid/blob/v3.0.0/images/status-disabled.png?raw=true" width="50px"> | **Disabled** |  _Clicking the status bar item in this state will enable formatting_ |
| <img src="https://github.com/panoply/vscode-liquid/blob/v3.0.0/images/status-ignored.png?raw=true"  width="50px"> | **Ignoring**  | _Clicking the status bar item in this state opens the output panel_
| <img src="https://github.com/panoply/vscode-liquid/blob/v3.0.0/images/status-error.png?raw=true"  width="50px"> | **Errors**  | _Clicking the status bar item in this state opens the output panel_

# Configuration

The extension provides 2 different ways for users to configure and control capabilities. Depending on how regularly you are working with Liquid should help determine which method is best for you. Using `.liquidrc` file is a great option for developers who prefer a single point of control and is _typically_ the preferred approach. Developers who'd rather keep things to the editor can define all configurations in their workspace/user settings `.vscode/settings.json` file.

### Using workspace settings

Setting configuration using workspace settings is made available on the `liquid` property. When a `.liquidrc` file is present in your projects root then that will take precedence over options defined in workspace/user settings.

Refer to [Workspace Settings](#workspace-settings) for defaults.

### Using .liquidrc config file

The `.liquidrc` file allows users to specify their Liquid `engine` (variation), `files` for completions and `format` beautification rules. All other configuration options need to be defined within vscode workspace/user settings. The `.liquidrc` file is typically the easiest way to define per-project configurations and have shareable rules across projects. Whenever the extension detects the presence of a `.liquidrc` file it will behave in accordance and assume a Liquid project environment.

_The `.liquidrc` file will be an essential requirement in Liquify (the future release) and the point of control for the Liquify parser, Language Server, Liquid specifications and other features. If you use Liquid a lot, then it a good idea to use this method._

### Supported .liquidrc files

Currently, the extension only supports 2 JSON (with comments) file types:

- `.liquidrc`
- `.liquidrc.json`

### Generating .liquidrc Files

You can generate a `.liquidrc` file using the **Liquid: Generate .liquidrc (defaults)** command from the vscode command palette. If you prefer a more refined output then you can generate a file with **recommended** rules. The recommended rules are best suited to Shopify projects and were helped determined by several talented developers who frequent the [Shopify Developers](https://discord.com/channels/597504637167468564) discord server.

Below is the **default** rules. It is important to note that if the `liquid.format.rules` user/workspace setting contains rules it will be merged with these defaults when the file is generated.

```json
{
  "engine": "shopify",
  "files": {
    "locales": [],
    "settings": [],
    "sections": [],
    "snippets": []
  },
  "format": {
    "ignore": [],
    "preset": "none",
    "indentSize": 2,
    "indentChar": " ",
    "wrap": 0,
    "crlf": false,
    "endNewline": false,
    "preserveLine": 3,
    "liquid": {
      "commentIndent": false,
      "commentNewline": false,
      "delimiterTrims": "preserve",
      "ignoreTagList": [],
      "lineBreakSeparator": "before",
      "normalizeSpacing": true,
      "preserveComment": false,
      "preserveInternal": false,
      "quoteConvert": "single",
      "dedentTagList": [],
      "delimiterPlacement": "preserve",
      "forceArgument": 0,
      "forceFilter": 0,
      "indentAttribute": false
    },
    "markup": {
      "attributeCasing": "preserve",
      "attributeSort": false,
      "commentIndent": false,
      "commentNewline": false,
      "forceAttribute": false,
      "forceIndent": false,
      "preserveComment": false,
      "preserveText": true,
      "quoteConvert": "double",
      "selfCloseSpace": false,
      "delimiterTerminus": "inline",
      "ignoreCSS": false,
      "ignoreJS": false,
      "ignoreJSON": false,
      "lineBreakValue": "align",
      "preserveAttribute": false,
      "selfCloseSVG": false,
      "stripAttributeLines": false
    },
    "style": {
      "classPadding": false,
      "commentNewline": false,
      "correct": false,
      "noLeadZero": false,
      "quoteConvert": "none",
      "sortProperties": false,
      "sortSelectors": false,
      "atRuleSpace": false,
      "commentIndent": false,
      "preserveComment": false
    },
    "json": {
      "arrayFormat": "indent",
      "braceAllman": true,
      "bracePadding": true,
      "objectIndent": "indent",
      "objectSort": false
    },
    "script": {
      "arrayFormat": "indent",
      "braceAllman": false,
      "braceNewline": false,
      "bracePadding": false,
      "caseSpace": false,
      "correct": false,
      "elseNewline": false,
      "endComma": "never",
      "functionNameSpace": false,
      "functionSpace": false,
      "methodChain": 3,
      "neverFlatten": false,
      "noCaseIndent": false,
      "noSemicolon": false,
      "objectIndent": "default",
      "objectSort": false,
      "quoteConvert": "single",
      "ternaryLine": false,
      "variableList": false,
      "vertical": false,
      "commentIndent": false,
      "commentNewline": false,
      "preserveComment": false
    }
  }
}
```

# Snippets

Liquid snippets are supported in this extension. The filter and tag snippets were originally forked from [vscode-liquid-snippets](https://github.com/killalau/vscode-liquid-snippets). The snippets provided do not expose trim (`{%-`) delimiters and you can instead leverage the liquid formatting rule of `delimiterTrims` for controlling this.

> **Note**&nbsp;
> You can also invoke tag completions by typing `%` which will automatically trigger a completion list.

# Extension Conflicts

If you are using alternative extensions such as the Shopify Liquid (Theme Check) or Liquid Languages Support extension then you may run into some issues. The conflicts incurred will be caused because these extensions also target Liquid grammars and offers similar capabilities.

The vscode marketplace has 3 different extensions for Liquid support:

- **Liquid**
- Liquid Languages Support
- Shopify Liquid (Theme Check)

This extension uses the **Liquid** display name and is considered the official Liquid extension for vscode by developers. It is recommended that you either uninstall or disable the **Shopify Liquid (Theme Check)** extension and make the choice between **Liquid** and using the Shopify backed one, more on this below.

### Liquid Languages Support

If you are using or have installed the [Liquid Languages Support](https://marketplace.visualstudio.com/items?itemName=neilding.language-liquid) extension then it is recommended that you either uninstall or disable it. The Liquid Languages Support extension is not maintained and the grammars are mostly obsolete. Using it along side this extension is problematic, boycott it, as it does nothing but increase the editors startup time.

### Shopify Liquid (Theme Check)

If you are using or have installed [Shopify Liquid (Theme Check)](https://marketplace.visualstudio.com/items?itemName=Shopify.theme-check-vscode) then you may need to choose (or alternate) between the Shopify Liquid (Theme Check) extension and this extension. The Shopify Liquid (Theme Check) extension is for Shopify projects (specifically themes) but tends to create a lot of noise.

The capabilities made available by Shopify Liquid (Theme Check) are nice but they come with limitations as its LSP (Language Server) implementation requires Ruby to function making it rather resource heavy and exhaustive on your machine. Though the extra features like validations do indeed help in some cases, they are specific to Shopify themes and not much use outside of that environment. If you require linting features maybe consider running their CLI solution only when necessary.

Currently, this extension offers far more features and capabilities than the Shopify backed extension. Though there is efforts being made by Shopify to improve their approach but (currently) the only upside for choosing it would be the validation features. The Liquify supersede will provide linting and validations upon its release, so the value proposition for continuing to choose this extension over Shopify Theme Check is minimal and one should evaluate whether or not it's the right choice for their productivity.

# Releases

As of **v4.0.0** all version releases and changelogs including the distributed VSIX files can be found in [Releases](https://github.com/panoply/vscode-liquid/releases). Previous version changelogs can be found in the [v2.3.0](https://github.com/panoply/vscode-liquid/blob/v2.3.0/CHANGELOG.md) branch.

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
pnpm schema      # Imports all JSON schema stores and updates package.json contributes
pnpm grammar     # Generates object grammars and applies them to liquid.tmLanguage.json
pnpm dry         # Prints list of files that are packages into VSIX
```

### Testing

The extension has undergone E2E and capability tests internally, but it does not leverage the vscode test suite. The extension itself is simple enough where extensive tests are not a matter of necessity. The contained `test` directory is used when invoking the debugger and extension host. Contained within that directory are various sample files that can be used for validating capabilities, grammars and invocation.

_PR's are welcome for test cases, but be aware that the Liquify supersede will make them obsolete in due time._

# Acknowledgements

Thanks to these 3 talented folks who's work, ideas, feedback and contributions make this extension possible.

- [Mansedan](https://github.com/MattWIP)
- [David Warrington](https://ellodave.dev/)
- [Curtis](https://github.com/toklok)

# Support

Follow me on [Twitter](https://twitter.com/niksavvidis) and say hello! There is no obligation, but coffee is always appreciated.

**PayPal**: [Donate](https://www.paypal.me/paynicos)<br>
**BTC**: `35wa8ChA5XvzfFAn5pMiWHWg251xDqxT51`

<br>

🥛 <small>[Νίκος Σαβίδης](mailto:n.savvidis@gmx.com)</small>
