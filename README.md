[![install](https://img.shields.io/badge/vscode-install-blue.svg?style=popout-square)](https://marketplace.visualstudio.com/items?itemName=sissel.shopify-liquid) &nbsp; ![](https://img.shields.io/visual-studio-marketplace/v/sissel.shopify-liquid.svg?style=popout-square) &nbsp; ![install](https://vsmarketplacebadge.apphb.com/downloads-short/sissel.shopify-liquid.svg?style=popout-square)

<img src="https://raw.githubusercontent.com/panoply/vscode-shopify-liquid/master/images/banner.gif"  atl="Liquid Logo"  width="100%">

#### IMPORTANT

**If you're using the [Liquid Language Support](https://github.com/GingerBear/vscode-liquid) and/or the [Shopify Liquid Template Snippets](https://github.com/killalau/vscode-liquid-snippets) then it's highly recommended that you either uninstall or disable both of these before using this extension.**


# Liquid <small style="color:#999;">(vs code)</small>

A visual studio code extension for the [Liquid](https://shopify.github.io/liquid/) template language. Includes liquid syntax highlighting within HTML, JavaScript, CSS, SCSS and Markdown files, formatting + beautification, snippet auto-completion and HTML Intellisense.


### Features

- Supports Liquid CSS/SCSS, JavaScript and Markdown syntax highighting
- Auto formatting and beautification with the powerful [PrettyDiff](https://prettydiff.com/).
- Snippet autocompletion for Liquid Tags, Filters, Shopify Schema and more!
- HTML IntelliSense and Emmet included
- Jekyll [Front Matter](https://jekyllrb.com/docs/front-matter) yaml syntax support
- Shopify [Sections](https://help.shopify.com/en/themes/development/sections) tag syntax support + formatting
- ES6 Template Literal and comment syntax injection tags

### Showcase

![showcase](https://github.com/panoply/vscode-shopify-liquid/blob/master/images/showcase.gif?raw=true)


# Commands

| Command                    | Description                                       |
| -------------------------- | ------------------------------------------------- |
| Liquid: Format File        | Formats the current file                          |
| Liquid: Format Selection   | Formats the selected code                         |
| Liquid: Enable Formatting  | Enable formatting of `*.html` or `*.liquid` files |
| Liquid: Disable Formatting | Disable formatting                                |


# Workspace Settings

```jsonc
{
  // Controls whether formatting is enabled or disabled
  "liquid.format": true,

  // Controls the formatting rules
  // Each property is uses different rule sets
  "liquid.formatRules": {}

}
```

# Syntax Support

This extension provides liquid syntax support in various languages. To support Liquid in CSS, SCSS and/or JavaScript you must append a `.liquid` extension to the filename. Additionally, Liquid code contained in HTML `<script>` and/or `<style>` tags are also supported.

| Language        | Extensions                    |
| --------------- | ----------------------------- |
| HTML            | `.html` `.jekyll` `.liquid`   |
| Markdown        | `.md`                         |
| CSS             | `.css.liquid`                 |
| SCSS            | `.scss.liquid` `sass.liquid`  |
| JavaScript      | `.js.liquid`                  |


#### TIP
Consider disabling HTML Validation in editor settings to prevent VS Code from validating `<style>` and `<script>` HTML tags that contain Liquid syntax:

```json
{
  "html.validate.scripts": false,
  "html.validate.styles": false,
}
```

<img src="https://raw.githubusercontent.com/panoply/vscode-shopify-liquid/master/images/sass-javascript.png"  atl="Liquid SCSS and Liquid JavaScript"  width="100%">

### Template Literals
The extension supports ES6 Template Strings in JavaScript. Use the ` liquid`` ` literal in your `.js` or `.ts` file and the liquid syntax will be highlighted accordingly, Example:

```javascript
liquid`

  {%- if tag contains condition -%}
    {% assign foo = 'bar' %}
  {%- endif -%}

`
```

### Comment Range
Code located btween block comment tags `/* liquid */` and `/* endliquid */` will inject syntax highlighting support for Liquid between that range. Below is an example used in combination with ESLint.

```html
<script>
  /* eslint-disable */
  /* liquid */

  {%- if condition -%}
    {% assign foo = 'bar' %}
  {%- endif -%}

  /* endliquid */
  /* eslint-enable */
</script>
```

# Formatting
Formatting can be enable/disabled via the command palette and will respect the `editor.formatOnSave` setting to avoid third party extension conflicts. When Liquid formatting is **enabled** the extension will format (beautify) any HTML, Liquid or Jekyll file in your workspace as it will assume these files contain Liquid syntax.

Formatting uses a default set of style rules which enforce a consistent coding style. You can customize the format rules and overwrite the defaults using a `.liquidrc` file or alternatively use the `liquid.formatRules` workspace setting option.

### Using .liquidrc rule file
Including a .liquid file in the root of your projects workspace is the reccomended approach for defining a custom set of formatting style rules.

### Using the workspace setting option
Rules can also be applied in your User or Workspace settings using the `liquid.formattingRules` option. Please note that if a `.liquidrc` is present in the workspace root it will runs precedence over `liquid.formattingRules` and any rules defined in your User or Workspace settings will be ignored.

### Toggle and Status button
When a HTML, Liquid and Jekyll file is open and active in the editor you will see the Liquid toggle/status button appear on the bottom right hand side of the VS Code status bar. The toggle button will allow you to enable/disable liquid formatting and open the output panel.

<img src="https://github.com/panoply/vscode-liquid/blob/master/images/togglebutton.png?raw=true" width="150px">

### Ignoring Tags
Sometimes you may wish to ignore formatting certain HTML or Liquid tags. The `ignored_tags` option available to HTML ruleset accepts an array of tags you wish to exclude when formatting. Only Tags that have matching and open and close definitions are accepted.

By default the formatter will ignore HTML `<script>` and `<style>` tag blocks. If you require formatting for `<script>` tags which contain no liquid code you should consider using [eslint](<[https://eslint.org](https://eslint.org/)>) and the [eslint-plugin-html](https://github.com/BenoitZugmeyer/eslint-plugin-html) with [prettier](https://prettier.io/).

# Rules
Below is a list of the default code style rules that are applied when formatting your document. Rules must be written in JSON format.

```jsonc
{
  "html": {
    "correct": true,
    "force_attribute": false,
    "preserve": 2,
    "ignored": [
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
    ]
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
    "perserve": 0,
    "format_array": "indent",
    "braces": true,
    "no_semicolon": true,
    "brace_block": false
  }
}
```

<details>
<summary>
  <strong>HTML</strong>
</summary>
<p>Format rules for HTML Liquid code.</p>
<p>

| Property        | Default               | Description            |
| --------------- | --------------------- | ---------------------- |
| correct         | `true`                | Corrects code          |
| force_attribute | `false`               | Indents HTML tag attributes to a newline |
| preserve        | `2`                   | Lines to preserve      |
| ignored_tags    | `["script", "style"]` | Lines to preserve      |

</p>
</details>

<details>
<summary>
  <strong>JavaScript</strong>
</summary>
<p>

Format rules for JavaScript within Shopify section `{% javascript %}` tags. These rules will not be applied to in the formatting of HTML `<script>` tags.

</p>
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
| no_semicolon | `false` | Prevents semicons for being added |
| brace_block   | `true`   | Inserts newline before and after inner content.      |

</p>
</details>

<details>
<summary>
  <strong>Stylesheet</strong>
</summary>
<p>

Format rules for CSS and/or SCSS within Shopify section `{% stylesheet %}` tags. These rules will not be applied to content within `<style>` HTML tags, those are ignored.

</p>
<p>

| Property         | Default | Description                      |
| ---------------- | ------- | -------------------------------- |
| indent_size      | `2`     | Tab size / indentation           |
| css_insert_lines | `true`  | Should use new lines in CSS/SCSS |
| preserve         | `2`     | Lines to preserve                |
| brace_block      | `true`  | Inserts newline before and after inner content. |

</p>

> Format rules applied here will also be used on CSS within the `{% style %}` tag.

</details>

<details>
<summary>
  <strong>Schema</strong>
</summary>
<p>

Format options for JSON within Shopify section `{% schema %}` tags.

</p>
<p>

| Property     | Default  | Description                                      |
| ------------ | -------- | ------------------------------------------------ |
| indent_size  | `2`      | Tab size / indentation                           |
| format_array | `indent` | Format Array, Accepts `indent` or `newline`.     |
| no_semicolon | `true`   | Prevents semicons for being added.               |
| brace_block  | `false`  | Inserts newline before and after inner content.  |

</p>
</details>

# Snippets

Liquid snippets are supported in this extension. The snippets which have been included were forked from [vscode-liquid-snippets](https://github.com/killalau/vscode-liquid-snippets). The reason for forking this extension is to avoid conflicts due to the extension dependency it relies on.


### Schema Snippets (Shopify)

Shopify `{% schema %}` section snippets are supported when using the `schema` prefix followed by the input type setting name. The schema snippets inject complete input types and allow you to quickly apply the schema setting.

<br>

<img src="https://raw.githubusercontent.com/panoply/vscode-shopify-liquid/master/images/schema-snippets.png"  atl="Shopify Schema Snippets"  width="100%">


# Key binding
You can use the Liquid formatter by using the below key binding.

```
cmd + shift + L -> Format Document
```

> Use `ctrl` for windows

<br>

<strong>Custom keybindings</strong><br>
*If you don't like the defaults then rebind editor.action.formatDocument in the keyboard shortcuts menu of vscode.*

# Support

This extension brings sufficient support of the Liquid language to VS Code. If this extension has helped your development workflow and you would like to keep it free then please consider supporting its growth and maintainance:

**PayPal**: [Donate](https://www.paypal.me/paynicos)<br>
**BTC**: `35wa8ChA5XvzfFAn5pMiWHWg251xDqxT51`


# Changelog

Refer to the [Changelog](https://github.com/panoply/vscode-liquid/blob/master/CHANGELOG.md) for each per-version update and/or fixes.

<br>


Currently made with 🖤 by Nikolas Savvidis
