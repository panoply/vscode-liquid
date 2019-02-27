[![npm version](https://img.shields.io/badge/vscode-install-blue.svg)](https://marketplace.visualstudio.com/items?itemName=sissel.shopify-liquid)

## Shopify Liquid Syntax (VS Code)
VS Code support for the [shopify liquid](https://shopify.github.io/liquid/) template language.

![showcase](https://github.com/panoply/vscode-shopify-liquid/blob/master/images/showcase.gif?raw=true)

## Syntax

Syntax support for the liquid language which includes support for Shopify section code blocks and various Shopify specific object contained attributes tags.

## Snippets
Liquid snippets are forked from [vscode-liquid-snippets](https://github.com/killalau/vscode-liquid-snippets) to avoid conflicts due to its extension dependency. Some additional snippets and modifications are applied in the version included with this extension.

## Blocks
The extension supports syntax highlighting within sections.

- `{% schema %}`
- `{% javascript %}`
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

## Single File Sections

This extension also includes additional syntax HTML tags. These tags are used as code block references when developing single file sections with liquid files.

These tags are **RESERVED** for Shopify Liquid.

- `<stream>`
- `<snippet>`
- `<partial>`
- `<template>`
- `<schema>`
- `<style lang="sass/scss">`
- `<script lang="ts">`

Additionally, When developing Single file Sections you have various import tags that can be called within certian Single File Section HTML tags.

- @snippet('*')
- @partial('*')
- @stream('*')
- @schema('*')

### Wtf are Single File Sections?

Single File Sections are similar to [Vue Single File Components](https://vuejs.org/v2/guide/single-file-components.html) but for Shopify. The Single File Section aspect of this project is currently used internally by myself for developing Shopify Sections in a way that allow me to render them using a virtual DOM library through DOM hydration.
