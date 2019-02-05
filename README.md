[![npm version](https://img.shields.io/badge/vscode-install-blue.svg)](https://marketplace.visualstudio.com/items?itemName=sissel.shopify-liquid)

## Shopify Liquid Syntax (VS Code)
VS Code support for the [shopify liquid](https://shopify.github.io/liquid/) template language.

### Usage
Add the below configuration to your users settings vs workspace settings:

```json
"emmet.includeLanguages":{
  "liquid": "html"
},
```

![showcase](https://github.com/panoply/vscode-shopify-liquid/blob/master/images/showcase.gif?raw=true)

## Syntax

Syntax support for liquid which includes support for new sections code blocks and Shopify object contained attributes.

## Snippets
Liquid snippets are forked from [vscode-liquid-snippets](https://github.com/killalau/vscode-liquid-snippets) to avoid conflicts due to its extension dependency.

## Blocks
The extension supports syntax highlighting within sections.

- `{% schema %}`
- `{% javascript %}`
- `{% stylesheet %}`

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

## Single File Sections

This extension also includes 6 additional syntax HTML tags. These tags are used as code block references when developing single file sections with liquid files. They are **RESERVED** tags when using HTML.

- `<stream>`
- `<snippet>`
- `<partial>`
- `<template>`
- `<schema>`
- `<style lang="sass/scss">`
- `<script lang="ts">`
