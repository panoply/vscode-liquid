[![install](https://img.shields.io/badge/vscode-install-blue.svg?style=popout-square)](https://marketplace.visualstudio.com/items?itemName=sissel.shopify-liquid) &nbsp; ![](https://img.shields.io/visual-studio-marketplace/v/sissel.shopify-liquid.svg?style=popout-square) &nbsp; ![install](https://vsmarketplacebadge.apphb.com/downloads-short/sissel.shopify-liquid.svg?style=popout-square)

<img src="https://raw.githubusercontent.com/panoply/vscode-shopify-liquid/master/images/banner.gif"  atl="Liquid Logo"  width="100%">

#### IMPORTANT

**If you're using the [Liquid Language Support](https://github.com/GingerBear/vscode-liquid) and/or the [Shopify Liquid Template Snippets](https://github.com/killalau/vscode-liquid-snippets) then it's highly recommended that you either uninstall or disable both of these before using this extension.**

# Liquid <small style="color:#999;">(vs code)</small>

A visual studio code extension for the [Liquid](https://shopify.github.io/liquid/) template language. Includes syntax highlighting support for Liquid in HTML, JavaScript CSS, SCSS, Markdown and more. Ships with auto formatting code beautification, advanced snippet auto-completion resolution and respects VS Codes native Intellisense, hover and diagnostic features.

### Key Features

- Syntax support for Liquid in CSS, SCSS, JavaScript, Markdown and more!
- Auto formatting and beautification with the powerful [PrettyDiff](https://prettydiff.com/).
- Snippet auto-completion for liquid tags, filters, shopify schema and more!
- Focused support for Jekyll and Shopify liquid variations
- Support Shopify [Sections](https://help.shopify.com/en/themes/development/sections)

### Showcase

![showcase](https://github.com/panoply/vscode-shopify-liquid/blob/master/images/showcase.gif?raw=true)

# Table of Contents

- [Commands](#commands)
- [Workspace Settings](#workspace-setting)
- [Syntax Support](#syntax-support)
- [Formatting](#formatting)
  - [Using .liquidrc rule file](#using-liquidrc-rule-file)
  - [Using the workspace setting option](#using-the-workspace-setting-option)
  - [Toggle and Status button](#toggle-and-status-button)
  - [Tag Associations](#tag-associations)
  - [Ignored Tags](#ignoring-tags)
  - [Key Binding](#key-bindind)
  - [Rules](#rules)
- [Snippets](#snippets)
- [Support](#support)
- [Changelog](#changelog)

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
  "liquid.format": true,
  // Formatting code style rules
  "liquid.rules": {
    // Ignored tags
    "ignore": [
      {
        "type": "", // Accepts html or liquid
        "begin": "", // The start tag pattern
        "end": "" // the ending tag pattern/name
      }
    ],
    // HTML code style
    "html": {},
    // JavaScript code style (applied to the {% javascript %} tag)
    "js": {},
    // CSS code style (appled to {% style %} and {% stylesheet %} tags)
    "css": {},
    // SCSS code style (applied to the {% stylesheet 'scss' %} tag)
    "scss": {},
    // JSON code style (applied to the {% schema %} tag)
    "json": {}
  }
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

> Currently, formatting is only supports Liquid in HTML. There are plans to support more languages in future versions, please be patient.

### Using .liquidrc rule file

Including a .liquid file in the root of your projects workspace is the **recommended approach** for defining a custom set of formatting code style rules. This approach allows you to easily control formatting options to best fit your code style quirks and share this ruleset across projects and collaborations.

### Using the workspace setting option

Rules can also be applied in your User or Workspace settings using the `liquid.rules` configuration option. Please note that if a `.liquidrc` is present in your projects root it will run precedence over rules defined in workspace settings. Again, it's recommended you use a `.liquidrc` file for setting custom rules.

### Toggle and Status button

When a HTML, Liquid and Jekyll file is open and active in the editor you will see the Liquid toggle/status button appear on the bottom right hand side of the VS Code status bar. The toggle button will allow you to enable/disable liquid formatting and will notify you when the parser encounters any code errors.

<img src="https://github.com/panoply/vscode-liquid/blob/master/images/togglebutton.png?raw=true" width="150px">

### Tag Association

The are some situations where you may want to apply language formatting to a specific tag. Using the `tags` property available to each language rule will allow you to apply a formatting code style to a custom defined tag.

<strong>Example</strong>
The below example would apply SCSS formatting to content between `<style lang="scss"></style>` and JSON formatting to `<script type="application/json"><script></script>`.

```jsonc
{
  "scss": {
    "tags": [
      {
        "type": "html",
        "begin": "style lang=\"scss\"", // <style lang="scss">
        "end": "style" // </style>
      }
    ]
  },
  "json": {
    "tags": [
      {
        "type": "html",
        "begin": "script type=\"application/json\"", // <script type="application/json">
        "end": "script" // </script>
      }
    ]
  }
}
```

### Ignoring Tags

Sometimes you may wish to ignore/disable formatting for certain HTML or Liquid tags. The `ignore` ruleset accepts an array of tags you wish to exclude. Ignored tags must have matching open and close definition tags and are defined using the `ignore` setting which accepts an array of objects with each object representing the tag to ignore from formatting.

<strong>Deprecations in version 2.0</strong><br>
In previous versions of this extension ignored tags were defined using the `liquid.formatIgnore` setting. This has been deprecated and you must use the new configuration.

<strong>IMPORTANT</strong><br>
Be careful overiding the default ignore tags. For example, if you have liquid code contained in `<script>` or `<style>` tags formatting will fail, hence why these tags are ignored by default.

The whitespace `{%- comment -%}` tags have trouble parsing if you're not applying whitespace equally, e.g:

<!-- prettier-ignore -->
```html
<!-- ✅ THIS WILL FORMAT CORRECTLY -->
{%- comment -%}
  Hello World
{%- endcomment -%}

{% comment %}
  Hello World
{% endcomment %}

<!-- ❌ THIS WILL BREAK FORMATTING -->
{%- comment %}
  Hello World
{% endcomment -%}
```

Notice in the above example the liquid commment tags using whitespace dash `-`. When the whitespace dash is only used once on either the left or right side it will break formatting. If you decide to remove comments from ignore then you must write all comments with equal whitespace dashes, like the above example.

Please remove the default tags from the `ignore` array with extereme caution, be aware of what you're doing and how it might effect your code.

<strong>Default Ignores</strong>

```jsonc
{
  "ignore": [
    {
      "type": "liquid",
      "begin": "comment", // {% comment %} or {%- comment -%}
      "end": "endcomment" // {% endcomment %} or {%- endcomment -%}
    },
    {
      "type": "html",
      "begin": "script", // <script>
      "end": "script" // </script>
    },
    {
      "type": "html",
      "begin": "style", // <style>
      "end": "style" // <style>
    }
  ]
}
```

> Do not include tag denotations (eg: `<`, `>`, `</`, `{%`, `%}`) when defining **begin** and **end** capture expressions. The `type` property defines the denotations of the tag.

<strong>Please Note</strong><br>

If you require formatting for `<script>` tags which contain _no liquid_ code you should consider using [eslint](<[https://eslint.org](https://eslint.org/)>) and the [eslint-plugin-html](https://github.com/BenoitZugmeyer/eslint-plugin-html) with [prettier](https://prettier.io/).

# Rules

Below is the default code style formatting rules. You can include this using a `.liquidrc` file in the root of your project or via the`"liquid.rules"` option in workspace settings.

```jsonc
{
  "ignore": [
    {
      "type": "liquid",
      "begin": "comment",
      "end": "endcomment"
    },
    {
      "type": "html",
      "begin": "script",
      "end": "script"
    },
    {
      "type": "html",
      "begin": "style",
      "end": "style"
    }
  ],
  "html": {
    "correct": true,
    "force_attribute": false,
    "preserve": 2,
    "unformatted": false
  },
  "js": {
    "preserve": 1,
    "method_chain": 0,
    "quote_convert": "none",
    "format_array": "indent",
    "format_object": "indent",
    "braces": false,
    "no_semicolon": false,
    "brace_block": true
  },
  "scss": {
    "css_insert_lines": true,
    "preserve": 2,
    "braces": false,
    "brace_block": true
  },
  "css": {
    "css_insert_lines": true,
    "preserve": 2,
    "braces": false,
    "brace_block": true
  },
  "json": {
    "preserve": 0,
    "format_array": "indent",
    "braces": true,
    "no_semicolon": true,
    "brace_block": false
  }
}
```

<details>
<summary>
  <strong>Ignore and Tag Associations</strong>
</summary>

<p>HTML or Liquid tags that the formatter will ignore. See [Ignoring Tags](#ignoring-tags) for more information.</p>

<p>

| Property | Accepts            | Description                                   |
| -------- | ------------------ | --------------------------------------------- |
| type     | `liquid` or `html` | The type of language this tags belongs to.    |
| begin    | Regular Expression | A regular expression match for the begin tag. |
| end      | Regular Expression | A regular expression match for the end tag.   |

</p>
</details>

<details>
<summary>
  <strong>HTML</strong>
</summary>

<p>Format rules for HTML Liquid code.</p>

<p>

| Property        | Default | Description                                                      |
| --------------- | ------- | ---------------------------------------------------------------- |
| correct         | `true`  | Corrects code                                                    |
| force_attribute | `false` | Indents HTML tag attributes to a newline                         |
| preserve        | `2`     | Lines to preserve                                                |
| unformatted     | `true`  | Should HTML tags (like attributes) have their insides preserved. |

</p>
</details>

<details>
<summary>
  <strong>JavaScript</strong>
</summary>

<p>Format rules for JavaScript code. This ruleset controls formatting for tags like the shopify section `{% javascript %}` tags. These rules will also be applied to HTML `<script></script>` tags and JavaScript files that use the `.js.liquid` extension name.</p>

<p><strong>Currently liquid syntax contained within `<script></script>` tags and `.js.liquid` files will cause formatting to fail, so please avoid formatting JavaScript which contains Liquid.</strong></p>

<p>

| Property      | Default  | Description                                          |
| ------------- | -------- | ---------------------------------------------------- |
| indent_size   | `2`      | Tab size / indentation                               |
| preserve      | `1`      | Lines to preserve                                    |
| method_chain  | `0`      | Newline chaining of function.                        |
| quote_convert | `none`   | Use single or double quotes.                         |
| format_array  | `indent` | Format Array, Accepts `indent` or `newline`          |
| format_object | `indent` | Format Object, Accepts `indent` or `newline`         |
| comment_line  | `false`  | If a blank new line should be forced above comments. |
| else_line     | `false`  | If keyword 'else' is forced onto a new line          |
| no_semicolon  | `false`  | Prevents semicons for being added                    |
| brace_block   | `true`   | Inserts newline before and after inner content.      |
| tags          | `[]`     | An array of included tags                            |

</p>
</details>

<details>
<summary>
  <strong>CSS</strong>
</summary>

<p>Format rules for CSS code. This ruleset controls formatting for tags like the shopify `{% style %}` and shopify section `{% stylesheet %}` tags. These rules will also be applied to HTML `<style></style>` tags and files that use the `.css.liquid` extension name.</p>

<p><strong>Currently liquid syntax contained within `<style></style>` tags and `.css.liquid` files will cause formatting to fail, so please avoid formatting CSS which contains Liquid.</strong></p>

<p>

| Property         | Default | Description                                     |
| ---------------- | ------- | ----------------------------------------------- |
| indent_size      | `2`     | Tab size / indentation                          |
| css_insert_lines | `true`  | Should use new lines in CSS/SCSS                |
| preserve         | `2`     | Lines to preserve                               |
| brace_block      | `true`  | Inserts newline before and after inner content. |
| tags             | `[]`    | An array of included tags                       |

</p>

</details>

<details>
<summary>
  <strong>SCSS and SASS</strong>
</summary>

<p>Format rules for SCSS and SASS code. This ruleset controls formatting for tags like the shopify section `{% stylesheet 'scss' %}` tag. These rules will also be applied to files that use the `.scss.liquid` or `sass.liquid` extension name.</p>

<p><strong>Currently liquid syntax contained within `.scss.liquid` or `.sass.` files will cause formatting to fail, so please avoid formatting SCSS/SASS which contains Liquid.</strong></p>

<p>

| Property         | Default | Description                                     |
| ---------------- | ------- | ----------------------------------------------- |
| indent_size      | `2`     | Tab size / indentation                          |
| css_insert_lines | `true`  | Should use new lines in CSS/SCSS                |
| preserve         | `2`     | Lines to preserve                               |
| brace_block      | `true`  | Inserts newline before and after inner content. |
| tags             | `[]`    | An array of included tags                       |

</p>

</details>

<details>
<summary>
  <strong>JSON</strong>
</summary>

<p>Format rules for JSON code. This ruleset controls formatting for tags like the shopify `{% schema %}` tag. These rules will also be applied to HTML `<script type="application/json"></script>` tags.</p>

<p>

| Property     | Default  | Description                                     |
| ------------ | -------- | ----------------------------------------------- |
| indent_size  | `2`      | Tab size / indentation                          |
| format_array | `indent` | Format Array, Accepts `indent` or `newline`.    |
| no_semicolon | `true`   | Prevents semicons for being added.              |
| brace_block  | `false`  | Inserts newline before and after inner content. |
| tags         | `[]`     | An array of included tags                       |

</p>
</details>

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

Developing this extension has taken a considerable amount of time. If it has helped your development workflow and you would like to keep it free of cost then please consider supporting its growth and maintainance:

**PayPal**: [Donate](https://www.paypal.me/paynicos)<br>
**BTC**: `35wa8ChA5XvzfFAn5pMiWHWg251xDqxT51`

# Changelog

Refer to the [Changelog](https://github.com/panoply/vscode-liquid/blob/master/CHANGELOG.md) for each per-version update and/or fixes.

<br>

Currently made with 🖤 by Nikolas Savvidis
