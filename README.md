[![npm version](https://img.shields.io/badge/vscode-install-blue.svg)](https://marketplace.visualstudio.com/items?itemName=sissel.shopify-liquid)

<img src="https://github.com/panoply/vscode-shopify-liquid/blob/master/images/banner.gif?raw=true" atl="Liquid Logo" width="100%">

# Liquid Language <small style="color:#999;">(VS Code)</small>

A visual studio code extension for the [liquid](https://shopify.github.io/liquid/) template language.

### Features

- Liquid syntax highlighting support
- Formatting and Beautification onSave, Selection or command
- Liquid Snippet auto-complete for fast development
- HTML IntelliSense
- Jekyll Frontmatter YAML tags
- Shopify Liquid Schema, JavaScript and Stylesheet tags

### Showcase

![showcase](https://github.com/panoply/vscode-shopify-liquid/blob/master/images/showcase.gif?raw=true)

## Settings

The extension allows you to customize how your liquid HTML is formatted. Formatting is applied using the ([PrettyDiff](http://prettydiff.com)) parser and thus coheres to its beautification [options](https://github.com/prettydiff/prettydiff/blob/master/options.md).

By default, formatting will use a combination of pre-configured and editor settings but you can override the defaults to fit your coding style.

#### Please Note

- Formatting is enabled by default, so `.html` files will be formatted
- Both the `<script>` and `<style>` HTML tags are ignored by default

### Enabling HTML IntelliSence

If you want HTML IntelliSense features you will need to associate `.liquid` files with `HTML` files within your `settings.json` file:

```json
"files.associations": {
  "*.liquid": "html"
},
```

### Commands

You can format selections or files by programmatically running a format method via the command palette. There are 4 available commands:

| Command                    | Description                                        |
| -------------------------- | -------------------------------------------------- |
| Liquid: Format File        | Formats the current file                           |
| Liquid: Format Selection   | Formats the selected code                          |
| Liquid: Enable Formatting  | Enables formatting of `*.html` or `*.liquid` files |
| Liquid: Disable Formatting | Disables formatting                                |

### Settings <small>`settings.json`</small>

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

Formatting is applied to files using a `.liquid` extension. Liquid infused HTML code aswell as the shopify liquid specific `{% schema %}`, `{% javascript %}` and `{% stylesheet %}` code blocks will also be formatted:

| Property     | Type     | Description                                                  |
| ------------ | -------- | ------------------------------------------------------------ |
| `html`       | HTML     | Format options for Liquid infused HTML code                  |
| `javascript` | JS       | Format options for `{% javascript %}` tags                   |
| `stylesheet` | CSS/SCSS | Format options for `{% stylesheet %}` and `{% style %}` tags |
| `schema`     | JSON     | Format options `{% schema %}` tags                           |

#### Options

You can apply any [PrettyDiff](http://prettydiff.com) formatting options which are applicable to the property type. Refer to the [PrettyDiff Options](https://github.com/prettydiff/prettydiff/blob/master/options.md) documentation for a complete list of beautify option that can be applied. By default the extension has a bunch of preset options defined.

### HTML

Format options for HTML Liquid code.

| Property        | Value   | Description            |
| --------------- | ------- | ---------------------- |
| indent_size     | `2`     | Tab size / indentation |
| force_attribute | `false` | Indent HTML Attributes |
| preserve        | integer | Lines to preserve      |

#### JavaScript `{% javascript %}`

Format options for JavaScript located within the javascript section tag.

| Property      | Default  | Description                                   |
| ------------- | -------- | --------------------------------------------- |
| indent_size   | `2`      | Tab size / indentation                        |
| preserve      | `1`      | Lines to preserve                             |
| method_chain  | `0`      | Newline chaining of function.                 |
| quote_convert | `none`   | Use single or double quotes.                  |
| format_array  | `indent` | Format Array, Accepts `indent` or `newline`.  |
| format_object | `indent` | Format Object, Accepts `indent` or `newline`. |

#### Stylesheet `{% stylesheet %}`

Format options for CSS and SCSS located withing the stylesheet section tag. Format rules applied here will also be used on CSS within the `{% style %}` tag.

| Property         | Default | Description                      |
| ---------------- | ------- | -------------------------------- |
| indent_size      | `2`     | Tab size / indentation           |
| css_insert_lines | `true`  | Should use new lines in CSS/SCSS |
| preserve         | `2`     | Lines to preserve                |

#### Schema `{% schema %}`

Format options for the schema tag.

| Property     | Default  | Description                                  |
| ------------ | -------- | -------------------------------------------- |
| indent_size  | `2`      | Tab size / indentation                       |
| format_array | `indent` | Format Array, Accepts `indent` or `newline`. |

## Snippets

Liquid snippets are supported in this extension. The snippets which are included have been forked from [vscode-liquid-snippets](https://github.com/killalau/vscode-liquid-snippets). The reason for forking this extension is to avoid conflicts due to a extension dependency it relies on.

> If you have [vscode-liquid-snippets](https://github.com/killalau/vscode-liquid-snippets) installed, you can safely uninstall this extension and it's dependency.

<br>
Made with 🖤 By Nikolas Savvidis
