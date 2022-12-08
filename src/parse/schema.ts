export const schema = {
  $schema: 'http://json-schema.org/draft-07/schema',
  $id: 'shopify-section-schema',
  version: 1.1,
  definitions: {
    content: {
      type: 'string',
      title: 'Content',
      description: 'Textual content for the header title.'
    },
    info: {
      type: 'string',
      title: 'Default',
      description: "Additional information about the setting. Use sparingly, as it's better to use only informative labels whenever you can."
    },
    settings: {
      required: [ 'type', 'id', 'label' ],
      type: 'array',
      items: {
        type: 'object',
        description: 'Lists all settings that are available for this theme section',
        properties: {
          type: {
            type: 'string',
            title: 'Type',
            description: 'Name of the type of setting.',
            oneOf: [
              {
                enum: [ 'text' ],
                title: 'Single-line text fields',
                description: 'A setting of type text is used for capturing short strings, such as URLs, social media usernames, sales banner text, etc.'
              },
              {
                enum: [ 'textarea' ],
                title: 'Multi-line text areas',
                description: 'A setting of type textarea is used for capturing larger blocks of text, such as embed codes.'
              },
              {
                enum: [ 'image_picker' ],
                title: 'Image',
                description: 'Merchants can use a setting of type "image_picker" to upload assets such as logo images, favicons, and slideshow images.'
              },
              {
                enum: [ 'radio' ],
                title: 'Radio button',
                description: 'A setting of type radio is used for presenting mutually exclusive options to the merchant, for example, selecting the alignment of the logo.'
              },
              {
                enum: [ 'select' ],
                title: 'Selection drop-down',
                description: 'A setting of type select is used for presenting a large number of options to the merchant, for example, selecting the number of products to show on the product page.'
              },
              {
                enum: [ 'checkbox' ],
                title: 'Checkbox',
                description: 'A setting of type checkbox is used for toggling preferences on or off, for example, showing or hiding elements on a page. \n\n The values of checkboxes are always forced to be 1. Hidden fields are inserted by Shopify in the theme editor that is generated for each checkbox, to allow for false values to be submitted appropriately.'
              },
              {
                enum: [ 'range' ],
                title: 'Range',
                description: 'The range input setting lets you add a slider that selects from a range of values. For example, merchants can use the range slider to select a font size for text, or to set the spacing between elements. You must set minimum and maximum values for the slider, and optionally a unit of measure such as pixels, seconds, or percentage.'
              },
              {
                enum: [ 'color' ],
                title: 'Color picker',
                description: 'Settings of type color present a color picker to the merchant.'
              },
              {
                enum: [ 'font_picker' ],
                title: 'Font picker',
                description: "Settings of type font_picker generate a drop-down menu that is automatically filled with fonts from Shopify's font library. The library includes web-safe fonts, a selection of Google Fonts, and fonts licensed from Monotype."
              },
              {
                enum: [ 'collection' ],
                title: 'Collections drop-down',
                description: 'Settings of type collection generate a drop-down that is automatically filled with the names of all the collections in the store. The output of the option the merchant selects from the drop-down is the handle of the collection.'
              },
              {
                enum: [ 'product' ],
                title: 'Products drop-down',
                description: 'Settings of type product generate a drop-down that is automatically filled with the names of all the products in the store. The output of the option the merchant selects from the drop-down is the handle of the product.'
              },
              {
                enum: [ 'blog' ],
                title: 'Blogs drop-down',
                description: 'Settings of type blog generate a drop-down that is automatically filled with the names of all the blogs in the store. The output of the option the merchant selects from the drop-down is the handle of the blog.'
              },
              {
                enum: [ 'page' ],
                title: 'Pages drop-down',
                description: 'Settings of type page generate a drop-down that is automatically filled with the names of all pages in the store. The output of the option the merchant selects from the drop-down is the handle of the page.'
              },
              {
                enum: [ 'link_list' ],
                title: 'Link lists drop-down',
                description: 'Settings of type link_list generate a drop-down that is automatically filled with the names of all the menus in the store. The output of the option the merchant selects from the drop-down is the handle of the link list menu.\n\nlink_list settings accept an optional default parameter, which can be set to main-menu or footer.'
              },
              {
                enum: [ 'url' ],
                title: 'URL',
                description: 'A url setting lets merchants link to one of the following resources using a picker in the theme editor'
              },
              {
                enum: [ 'richtext' ],
                title: 'RichText',
                description: 'You can use richtext settings to allow text content with basic formatting. Supported formatting options are bold, italic, underline, links, and paragraphs.'
              },
              {
                enum: [ 'html' ],
                title: 'HTML',
                description: 'An html setting lets merchants add custom HTML code which renders as content for a block. Unclosed tags are automatically closed when settings are saved.'
              },
              {
                enum: [ 'article' ],
                title: 'Article',
                description: 'You can use article settings to reference articles in a Shopify store. Articles function in much the same way as page or product settings, in that they return the handle for the referenced object which can be retrieved with a global variable (in this case, articles).'
              },
              {
                enum: [ 'header' ],
                title: 'Article',
                description: 'Use settings of type header to add a styled header into the sidebar for informational purposes.'
              }
            ]
          },
          id: {
            type: 'string',
            title: 'ID',
            description: 'The unique name for this setting. The id is exposed to the liquid templates via the settings object. It must only contain alphanumeric characters, underscores, and dashes.'
          },
          label: {
            type: 'string',
            title: 'Label',
            description: 'A label for this setting.'
          },
          placeholder: {
            type: 'string',
            title: 'Placeholder',
            description: "A value for the input's placeholder text. This is for text-based setting types only."
          },
          default: {
            type: [ 'number', 'string', 'boolean' ],
            title: 'Default',
            description: 'A value to which the setting can default.'
          }
        },
        allOf: [
          {
            if: {
              properties: {
                type: {
                  const: 'range'
                }
              },
              required: [ 'type' ]
            },
            then: {
              required: [ 'min', 'max', 'step' ],
              properties: {
                step: {
                  type: 'number',
                  title: 'Step',
                  minimum: 0.1,
                  default: 1,
                  description: 'The step refers to the step count for the slider values. For example, if you set the step to 5, then the range slider will count by fives. By default, the step is set to 1.'
                },
                min: {
                  type: 'number',
                  title: 'Min',
                  minimum: 0,
                  maximum: 100,
                  description: 'The minimum number of steps'
                },
                max: {
                  type: 'number',
                  title: 'Max',
                  maximum: 9999,
                  description: 'The maximum number of steps'
                },
                unit: {
                  type: 'string',
                  title: 'Max',
                  maxLength: 3,
                  description: 'The unit of measure label. For example, you could use sec for seconds, or px for pixels.'
                }
              }
            }
          },
          {
            if: {
              properties: {
                type: {
                  const: 'header'
                }
              },
              required: [ 'type' ]
            },
            then: {
              required: [ 'content' ],
              properties: {
                info: {
                  $ref: '#/definitions/info'
                },
                content: {
                  $ref: '#/definitions/content'
                }
              }
            }
          },
          {
            if: {
              properties: {
                type: {
                  const: 'paragraph'
                }
              },
              required: [ 'type' ]
            },
            then: {
              required: [ 'content' ],
              properties: {
                content: {
                  $ref: '#/definitions/content'
                }
              }
            }
          }
        ]
      }
    },
    blocks: {
      type: 'array',
      title: 'Blocks',
      description: 'Blocks are containers of settings and content which can be added, removed, and reordered within a section.',
      items: {
        type: 'object',
        required: [ 'name', 'type' ],
        properties: {
          name: {
            type: 'string',
            title: 'Block Type',
            description: 'The block name which is used as the merchants label'
          },
          type: {
            type: 'string',
            title: 'Block Type',
            description: "A block's type may be any value set by the theme developer."
          },
          limit: {
            type: 'number',
            title: 'Limit',
            minimum: 1,
            description: 'By default, a merchant can add the same block to a section multiple times. If required, you can set a limit for a block so that it can only be added up to a certain number of times.'
          },
          max_blocks: {
            type: 'number',
            title: 'Max Blocks',
            description: 'There is no limit to how many blocks a merchant can add to a section, but you can specify a maximum number of blocks in the section schema.'
          },
          settings: {
            $ref: '#/definitions/settings'
          }
        }
      }
    }
  },
  type: 'object',
  title: 'Shopify Section Schema (Liquid Langauge Server)',
  description: 'Shopify schema store reference for the schema Liquid tag used in Shopify themes.',
  required: [ 'name' ],
  additionalProperties: false,
  properties: {
    name: {
      title: 'Name',
      description: 'Sections should have a name defined in the section schema',
      type: 'string'
    },
    class: {
      title: 'Class',
      description: "Specify additional classes for the section's wrapper in the schema",
      type: 'string'
    },
    tag: {
      title: 'Tag',
      description: "Specify the HTML tag of the section's wrapper",
      type: 'string',
      enum: [
        'article',
        'aside',
        'div',
        'footer',
        'header',
        'section'
      ]

    },
    settings: {
      $ref: '#/definitions/settings'
    },
    blocks: {
      $ref: '#/definitions/blocks'
    },
    presets: {
      type: 'array',
      title: 'Presets',
      description: 'Section presets are default configurations of a section.\n\nWhen a section has one or more presets, each preset becomes a dynamic section a merchant can add to their theme home page if the content_for_index object has been included in index.liquid',
      items: {
        type: 'object',
        required: [ 'name', 'category' ],
        properties: {
          name: {
            title: 'Name',
            description: 'The name of this preset value that is shown in the theme editor',
            type: 'string'
          },
          category: {
            title: 'Category',
            description: 'The category name which this sections presets and will be grouped in the theme editor.',
            type: 'string'
          },
          settings: {
            $ref: '#/definitions/settings'
          },
          blocks: {
            $ref: '#/definitions/blocks'
          }
        }
      }
    },
    defaults: {
      type: 'array',
      title: 'Defaults',
      description: "Sections that are statically included in the theme's templates can define their default configuration in the schema.\n\nYou should only need to use this for sections that are meant to be reused or installed on multiple themes or shops. Statically-included sections that come pre-installed with a theme should have their default configuration defined in settings_data.json",
      items: {
        type: 'object',
        properties: {
          settings: {
            $ref: '#/definitions/settings'
          },
          blocks: {
            $ref: '#/definitions/blocks'
          }
        }
      }
    },
    locales: {
      type: 'object',
      title: 'Defaults',
      description: 'Sections can use global translations defined in the locales directory. The translate and localize filters work within sections, just as they do in other templates.'
    }
  }
};
