[![install](https://img.shields.io/badge/vscode-install-blue.svg?style=popout-square)](https://marketplace.visualstudio.com/items?itemName=sissel.shopify-liquid) &nbsp; ![](https://img.shields.io/visual-studio-marketplace/v/sissel.shopify-liquid.svg?style=popout-square) &nbsp; ![install](https://vsmarketplacebadge.apphb.com/downloads-short/sissel.shopify-liquid.svg?style=popout-square)

<img src="https://raw.githubusercontent.com/panoply/vscode-shopify-liquid/master/images/banner.gif"  atl="Liquid Logo"  width="100%">

#### IMPORTANT

**If you're using the [Liquid Language Support](https://github.com/GingerBear/vscode-liquid) and/or the [Shopify Liquid Template Snippets](https://github.com/killalau/vscode-liquid-snippets) then it's highly recommended that you either uninstall or disable both of these before using this extension.**


# Liquid <small style="color:#999;">(vs code)</small>

A visual studio code extension for the [Liquid](https://shopify.github.io/liquid/) template language. Includes liquid syntax highlighting within HTML, JavaScript, CSS, SCSS and Markdown files, formatting + beautification, snippet auto-completion and HTML Intellisense.


### Features

- 🆕 Liquid [CSS/SCSS](https://github.com/panoply/vscode-liquid#syntax-support), [JavaScript](https://github.com/panoply/vscode-liquid#syntax-support) and [Markdown](https://github.com/panoply/vscode-liquid#syntax-support) syntax highighting
- Support Liquid with ES6 [Template literals](https://github.com/panoply/vscode-liquid#template-literals) ` liquid`` ` JSX strings
- Auto formatting and beautification with the powerful [PrettyDiff](https://prettydiff.com/).
- Liquid syntax snippet auto-completion
- Shopify sections [Schema Snippets](https://github.com/panoply/vscode-liquid#snippets) auto-completion
- HTML IntelliSense and Emmet included
- Jekyll [Front Matter](https://jekyllrb.com/docs/front-matter) yaml syntax support
- Shopify [Sections](https://help.shopify.com/en/themes/development/sections) tag syntax support + formatting

### Showcase

![showcase](https://github.com/panoply/vscode-shopify-liquid/blob/master/images/showcase.gif?raw=true)


## Snippets

Liquid snippets are supported in this extension. The snippets which have been included were forked from [vscode-liquid-snippets](https://github.com/killalau/vscode-liquid-snippets). The reason for forking this extension is to avoid conflicts due to the extension dependency it relies on.

> If you have [vscode-liquid-snippets](https://github.com/killalau/vscode-liquid-snippets) installed, you can safely uninstall this extension and it's dependency.

<strong>Schema Snippets (Shopify)</strong><br>

Shopify `{% schema %}` section snippets are supported when using the `schema` prefix followed by the input type setting name. The `schema` snippets injects complete input types and allow you to quickly write apply the schema setting.

> Schema snippets leverage [Tabstops](https://code.visualstudio.com/docs/editor/userdefinedsnippets#_tabstops).

<br>

<img src="https://raw.githubusercontent.com/panoply/vscode-shopify-liquid/master/images/schema-snippets.png"  atl="Shopify Schema Snippets"  width="100%">



## Key binding

You can use the Liquid formatter by using the below key binding.

```
cmd + shift + L -> Format Document
```

> Use `ctrl` for windows

<br>

<strong>Custom keybindings</strong><br>
*If you don't like the defaults then rebind editor.action.formatDocument in the keyboard shortcuts menu of vscode.*

## Workspace Settings

```json
{
  "liquid.format": true,
  "liquid.formatIgnore": ["case"],
  "liquid.beautify": {
   "html": {
      "correct": true,
      "force_attribute": false,
      "braces": false,
      "preserve": 2
    },
    "javascript": {
      "preserve": 1,
      "method_chain": 0,
      "quote_convert": "none",
      "format_array": "indent",
      "format_object": "indent",
      "braces": false,
      "no_semicolon": false,
      "brace_block": true
    },
    "stylesheet": {
      "css_insert_lines": true,
      "preserve": 2,
      "braces": false,
      "brace_block": true
    },
    "schema": {
      "perserve": 0,
      "format_array": "indent",
      "braces": true,
      "brace_block": false,
      "no_semicolon": true
    }
  }
}
```

## Syntax Support

The extension supports liquid syntax highlighting in various languages. To support Liquid in CSS, SCSS and/or JavaScript you must append a `.liquid` extension to the filename. Additionally, Liquid syntax present within HTML `<script>` and/or `<style>` tags are also supported.

| Language        | Files Extensions            |
| --------------- | --------------------------- |
| HTML            | `.html` `.jekyll` `.liquid` |
| CSS             | `.css.liquid`               |
| SCSS            | `.scss.liquid`              |
| JavaScript      | `.js.liquid`                |
| Markdown        | `.md`                       |

<strong>TIP</strong><br>

Consider disabling HTML Validation in editor settings to prevent VS Code from validating `<style>` and `<script>` HTML tags that contain Liquid syntax:

```json
{
  "html.validate.scripts": false,
  "html.validate.styles": false,
}
```

<br>
<img src="https://raw.githubusercontent.com/panoply/vscode-shopify-liquid/master/images/sass-javascript.png"  atl="Liquid SCSS and Liquid JavaScript"  width="100%">

## Template Literals

The extension supports ES6 Template Strings in JavaScript. Use the ` liquid`` ` literal in your `.js` or `.ts` file and the liquid syntax will be highlighted accordingly, Example:

```javascript

liquid`

  {%- for tag in collection.all_tags -%}
    {%- if current_tags contains tag -%}
      {{ current_tags.tag | link_to_remove_tag: taggg }}
    {%- else -%}
      {{ current_tags.tag | link_to_add_tag: tag }}
    {%- endif -%}
  {%- endfor -%}

`

```

## Formatting

Formatting can be enable or disabled via the command palette and also respects the `editor.formatOnSave` setting. When Liquid formatting is **enabled** the extension will format any HTML (`*.html`) or Liquid (`*.liquid`) file in your workspace as it will assume these files contain Liquid syntax. You can customize how Liquid HTML is to be beautified when formatting is applied by configuring the workspace setting.

<strong>Toggle Button</strong><br>
When an HTML or Liquid file is open in the editor you will see the Liquid toggle button appear on the bottom right hand side of the status bar. This button will allow you to enable/disable liquid formatting.

<img src="https://github.com/panoply/vscode-liquid/blob/master/images/togglebutton.png?raw=true" width="150px" style="padding-bottom:2px;">

<br>

<strong>Parser</strong><br>
Under the hood this extension uses language aware code comparison tool known as [PrettyDiff](https://prettydiff.com/). You can apply any PrettyDiff formatting [option](https://github.com/prettydiff/prettydiff/blob/master/options.md) to language specific properties of the `liquid.beautify` rules object in workspace settings.

<strong>Ignoring Tags</strong><br>
Sometimes PrettyDiff will have trouble formatting your code, in this case you can apply the tag to the ignore array setting by adding the name of the tag, eg:

```json
{
  "liquid.formatIgnore": ["case", "head"]
}
```

In the above example the contents of Liquid `{% case %}` tag and the HTML `<head>` tag will both be ignored when formatting. Only contained block tags can be applied the have both an opening and closing tag.

<strong>❗Important ❗</strong><br>
By default the formatter will ignore both the `<script>` and `{%- comment -%}` tag blocks. These tags are forcefully ignored and their contents will not be formatted due to a defect within the parser. The defect will be resolved in future versions.

> If you require formatting for `<script>` tags you should consider using [eslint](<[https://eslint.org](https://eslint.org/)>) and the [eslint-plugin-html](https://github.com/BenoitZugmeyer/eslint-plugin-html) with [prettier](https://prettier.io/).

#### Commands

| Command                    | Description                                       |
| -------------------------- | ------------------------------------------------- |
| Liquid: Format File        | Formats the current file                          |
| Liquid: Format Selection   | Formats the selected code                         |
| Liquid: Enable Formatting  | Enable formatting of `*.html` or `*.liquid` files |
| Liquid: Disable Formatting | Disable formatting                                |

#### Rules

Below is a list of the default beautification rules that will be applied when formatting.

<details>
<summary>
  <strong>HTML</strong>
</summary>
<p>Format rules for HTML Liquid code.</p>
<p>

| Property        | Value   | Description            |
| --------------- | ------- | ---------------------- |
| correct     | `true`     | Corrects code |
| indent_size     | `2`     | Tab size / indentation |
| force_attribute | `false` | Indent HTML Attributes |
| preserve        | integer | Lines to preserve      |

</p>
</details>

<details>
<summary>
  <strong>JavaScript</strong>
</summary>
<p>

Format rules for JavaScript within Shopify section `{% javascript %}` tags. These rules will not be applied to content within `<script>` HTML tags, those are ignored.

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

| Property     | Default  | Description                                  |
| ------------ | -------- | -------------------------------------------- |
| indent_size  | `2`      | Tab size / indentation                       |
| format_array | `indent` | Format Array, Accepts `indent` or `newline`. |
| no_semicolon | `true` | Prevents semicons for being added |
| brace_block | `false` | Inserts newline before and after inner content. |

</p>
</details>

## Support this extension

This extension brings sufficient support of the Liquid language to VS Code. If this extension has helped your development workflow and you would like to keep it free then please consider supporting its growth and maintainance:

**PayPal**: [Donation](https://www.paypal.me/paynicos)
**BTC**: `35wa8ChA5XvzfFAn5pMiWHWg251xDqxT51`


## Changelog

Refer to the [Changelog](https://github.com/panoply/vscode-liquid/blob/master/CHANGELOG.md) for each per-version update and/or fixes.

<br>


Currently made with 🖤 by Nikolas Savvidis
