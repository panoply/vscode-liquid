[![npm version](https://img.shields.io/badge/vscode-install-blue.svg)](https://marketplace.visualstudio.com/items?itemName=sissel.shopify-liquid)

## Shopify Liquid (VS Code)

This extension brings [shopify liquid](https://shopify.github.io/liquid/) templating language support to VS Code.

## Features

- ✅ Syntax Highlighting
- ✅ Formatting and Beautification
- ✅ Liquid Snippets
- ✅ HTML Intellisense

![showcase](https://github.com/panoply/vscode-shopify-liquid/blob/master/images/showcase.gif?raw=true)

## Settings

The extension allows you to customize how your liquid HTML is formatted. Formatting is applied using the ([PrettyDiff](http://prettydiff.com)) parser and thus coheres to its beautification rules.

By default formatting will use a combination of pre-configured and editor settings but you can override these defaults to fit your coding style.

#### Please Note:

- `<script>` and `<style>` HTML tags are ignored.
- Only files using `.liquid` extension will be formatted.
- Beautify on save will be enabled when "editor.formatOnSave" is `true`
- When "liquid.format" is set to `false` no formatting will be applied.

### `settings.json`

```json
{
  "liquid.format": true,
  "liquid.beautify": {
    "html": {
      "indent_size": 2,
      "force_attribute": false,
      "preserve": 2,
      "ignored_tags": ["style", "script"]
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

> You can apply any [PrettyDiff](http://prettydiff.com)) formatting rule.

## Rules

Below is default formatting beautification rules that are pre-configured.

### HTML

Format options for HTML Liquid code.

| Property        | Value   | Description                                  |
| --------------- | ------- | -------------------------------------------- |
| indent_size     | `2`     | Tab size / indentation                       |
| force_attribute | `false` | Indent HTML Attributes                       |
| preserve        | integer | Lines to preserve                            |
| ignored_tags    | array   | Tag blocks that should **not** be formatted. |

### `{% javascript %}`

Format options for JavaScript located within the javascript section tag.

| Property      | Default  | Description                                   |
| ------------- | -------- | --------------------------------------------- |
| indent_size   | `2`      | Tab size / indentation                        |
| preserve      | `1`      | Lines to preserve                             |
| method_chain  | `0`      | Newline chaining of function.                 |
| quote_convert | `none`   | Use single or double quotes.                  |
| format_array  | `indent` | Format Array, Accepts `indent` or `newline`.  |
| format_object | `indent` | Format Object, Accepts `indent` or `newline`. |

### `{% stylesheet %}`

Format options for CSS and SCSS located withing the stylesheet section tag. Format rules applied here will also be used on CSS within the `{% style %}` tag.

| Property         | Default | Description                      |
| ---------------- | ------- | -------------------------------- |
| indent_size      | `2`     | Tab size / indentation           |
| css_insert_lines | `true`  | Should use new lines in CSS/SCSS |
| preserve         | `2`     | Lines to preserve                |

### `{% schema %}`

Format options for the schema tag.

| Property     | Default  | Description                                  |
| ------------ | -------- | -------------------------------------------- |
| indent_size  | `2`      | Tab size / indentation                       |
| format_array | `indent` | Format Array, Accepts `indent` or `newline`. |

## Snippets

Liquid snippets are supported, they are forked from [vscode-liquid-snippets](https://github.com/killalau/vscode-liquid-snippets) to avoid conflicts due to its extension dependency.

## Important

The extension extends upon `HTML`. The plus side to this is you will get all the awesome Intellisense HTML features that ships with VS Code but the down side is when you're working with `html` files the extension will be activated. This means you will receive liquid snippet autocompletion and liquis syntax highlighting in your `.html` files.

If this is something that bugs you, then disable the extension when you're working with `.html` files.
