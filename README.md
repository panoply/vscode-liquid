[![install](https://img.shields.io/badge/vscode-install-blue.svg?style=popout-square)](https://marketplace.visualstudio.com/items?itemName=sissel.shopify-liquid) &nbsp; ![](https://img.shields.io/visual-studio-marketplace/v/sissel.shopify-liquid.svg?style=popout-square) &nbsp; ![install](https://vsmarketplacebadge.apphb.com/downloads-short/sissel.shopify-liquid.svg?style=popout-square)

<img src="https://raw.githubusercontent.com/panoply/vscode-shopify-liquid/master/images/banner.gif" atl="Liquid Logo" width="100%">

> <small>_If you're using the [Liquid Language Support](https://github.com/GingerBear/vscode-liquid) and/or the [Shopify Liquid Template Snippets](<[vscode-liquid-snippets](https://github.com/killalau/vscode-liquid-snippets)>) extension then it's recommended that you either uninstall or disable both these extensions before using this._</small>

# Liquid <small style="color:#999;">(VS Code)</small>

A visual studio code extension for the [liquid](https://shopify.github.io/liquid/) template language. Includes syntax highlighting, snippet auto-completion and formatting and HTML Intellisense.

### Features

- Supports Jekyll and Shopify liquid variation syntax
- Auto formatting and beautification
- Snippet auto-completion
- HTML IntelliSense
- [Jekyll Front Matter](https://jekyllrb.com/docs/front-matter) yaml syntax support
- [Shopify Sections](https://help.shopify.com/en/themes/development/sections) tag syntax support, formatting highlighting

### Showcase

![showcase](https://github.com/panoply/vscode-shopify-liquid/blob/master/images/showcase.gif?raw=true)

## Snippets

Liquid snippets are supported in this extension. The snippets which have been included were forked from [vscode-liquid-snippets](https://github.com/killalau/vscode-liquid-snippets). The reason for forking this extension is to avoid conflicts due to a extension dependency it relies on.

> If you have [vscode-liquid-snippets](https://github.com/killalau/vscode-liquid-snippets) installed, you can safely uninstall this extension and it's dependency.

## Settings – <small>`settings.json`</small>

The default extension configuration settings:

```json
{
  "liquid.format": true,
  "liquid.beautify": {
    "html": {
      "indent_size": 2,
      "force_attribute": false,
      "preserve": 2
    },
    "javascript": {
      "indent_size": 2,
      "preserve": 1,
      "method_chain": 0,
      "quote_convert": "none",
      "format_array": "indent",
      "format_object": "indent"
    },
    "stylesheet": {
      "indent_size": 2,
      "css_insert_lines": true,
      "preserve": 2
    },
    "schema": {
      "indent_size": 2,
      "format_array": "indent"
    }
  }
}
```

## Formatting

Formatting can be enable or disabled via the command palette ([see below](#)). When Liquid formatting is **enabled** the extension will format any HTML (`*.html` or Liquid (`*.liquid`) file in your workspace as it will assume these files contain Liquid syntax. You can customize how Liquid HTML is to be beautified when formatting is applied in workspace settings.

<strong>❗Important ❗</strong>
Both `<script>` and `<style>` HTML tags are ignored will not be formatted. If you require formatting on these tags you should consider using [eslint](<[https://eslint.org](https://eslint.org/)>) and the [eslint-plugin-html](https://github.com/BenoitZugmeyer/eslint-plugin-html) with [prettier](https://prettier.io/).

| Command                    | Description                                       |
| -------------------------- | ------------------------------------------------- |
| Liquid: Format File        | Formats the current file                          |
| Liquid: Format Selection   | Formats the selected code                         |
| Liquid: Enable Formatting  | Enable formatting of `*.html` or `*.liquid` files |
| Liquid: Disable Formatting | Disable formatting                                |

## Beautify

Below is a list of the default beautification rules that will be applied when formatting.

### HTML

Format rules for HTML Liquid code.

| Property        | Value   | Description            |
| --------------- | ------- | ---------------------- |
| indent_size     | `2`     | Tab size / indentation |
| force_attribute | `false` | Indent HTML Attributes |
| preserve        | integer | Lines to preserve      |

### JavaScript `{% javascript %}`

Format rules for JavaScript within Shopify section JavaScript tags.

| Property      | Default  | Description                                   |
| ------------- | -------- | --------------------------------------------- |
| indent_size   | `2`      | Tab size / indentation                        |
| preserve      | `1`      | Lines to preserve                             |
| method_chain  | `0`      | Newline chaining of function.                 |
| quote_convert | `none`   | Use single or double quotes.                  |
| format_array  | `indent` | Format Array, Accepts `indent` or `newline`.  |
| format_object | `indent` | Format Object, Accepts `indent` or `newline`. |

### Stylesheet `{% stylesheet %}`

Format rules for CSS and/or SCSS within Shopify section stylesheet tags.

| Property         | Default | Description                      |
| ---------------- | ------- | -------------------------------- |
| indent_size      | `2`     | Tab size / indentation           |
| css_insert_lines | `true`  | Should use new lines in CSS/SCSS |
| preserve         | `2`     | Lines to preserve                |

> Format rules applied here will also be used on CSS within the `{% style %}` tag.

### Schema `{% schema %}`

Format options for JSON within Shopify section schema tags.

| Property     | Default  | Description                                  |
| ------------ | -------- | -------------------------------------------- |
| indent_size  | `2`      | Tab size / indentation                       |
| format_array | `indent` | Format Array, Accepts `indent` or `newline`. |

<br>
Made with 🖤 By Nikolas Savvidis
