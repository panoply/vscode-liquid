[![npm version](https://img.shields.io/badge/vscode-install-blue.svg)](https://marketplace.visualstudio.com/items?itemName=sissel.shopify-liquid)

# Liquid Language (VS Code)

VS Code support for the [shopify liquid](https://shopify.github.io/liquid/) template language. This extension will provide syntax highlighting for sections blocks and object contained attributes.

![showcase](https://github.com/panoply/vscode-shopify-liquid/blob/master/images/showcase.gif?raw=true)

## Blocks
The extension supports syntax highlighting within sections.

- `{% schema %}`
- `{% javascript %}`
- `{% stylesheet %}`

> Sass syntax highlighting is applied to stylesheets using the the `SCSS` attribute.

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

