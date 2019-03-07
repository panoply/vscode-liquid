[![npm version](https://img.shields.io/badge/vscode-install-blue.svg)](https://marketplace.visualstudio.com/items?itemName=sissel.shopify-liquid)

## Shopify Liquid (VS Code)

This extension brings [shopify liquid](https://shopify.github.io/liquid/) templating language support to VS Code.

## Features

- Syntax Highlighting
- Formatting ([PrettyDiff](http://prettydiff.com))
- Snippets
- Intellisense

![showcase](https://github.com/panoply/vscode-shopify-liquid/blob/master/images/showcase.gif?raw=true)

## Syntax

Syntax support for the liquid language which includes support for Shopify section code blocks and various Shopify specific object contained attributes tags.

## Formatting

The extension supports formatting of liquid HTML code and shopify section blocks. Keep your `{% schema %}`, `{% javascript %}` or `{% stylesheet %}` code formatted and beautified.

**HTML tags like `<style>` and `<script>` will be ignored. Formatting will only be applied to liquid specific tags.**

## Snippets

Liquid snippets are supported, they are forked from [vscode-liquid-snippets](https://github.com/killalau/vscode-liquid-snippets) to avoid conflicts due to its extension dependency.

## Blocks

The extension supports syntax highlighting within sections.

- `{% schema %}`
- `{% javascript %}`
- `{% style %}`
- `{% stylesheet %}`
- `{% stylesheet 'scss' %}`

> Sass syntax highlighting is applied to stylesheets using the `SCSS` attribute.

## Objects

The Shopify variation of liquid has tag objects that output dynamic content on the page. Syntax highlighting will be applied when using any of these object attributes.

- `{{ order }}`
- `{{ checkout }}`
- `{{ tax_line }}`
- `{{ tablerow }}`
- `{{ shipping_method }}`
- `{{ transaction }}`
- `{{ form }}`
- `{{ discount }}`
- `{{ scripts }}`
- `{{ request }}`

## Atttribute Objects

Some shopify liquid object attributes contain objects. These tags will apply highlighting to any nested objects or single variable object tags like country option object variable.

- `{{ search.results }}`
- `{{ product.tags }}`
- `{{ all_products }}`
- `{{ country_option_tags }}`

## Important

The extension extends upon `HTML` so when working with `html` files the extension will be activated. To avoid conflicts you can disable the extension if you're working with HTML files.
