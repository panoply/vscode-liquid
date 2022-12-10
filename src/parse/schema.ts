export const schema = {
  $schema: 'http://json-schema.org/draft-07/schema',
  $id: 'shopify-section-schema',
  version: 1.1,
  definitions: {
    content: {
      required: [ 'content' ],
      type: 'object',
      properties: {
        content: {
          type: 'string',
          title: 'Content',
          description: 'Textual content for the header title.'
        }
      }
    },
    placeholder: {
      type: 'object',
      properties: {
        placeholder: {
          type: 'string',
          title: 'Placeholder',
          description: 'A placeholder value'
        }
      }
    },
    limit: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          title: 'Limit',
          description: 'The maximum number of items that the merchant can select. The default limit, and the maximum limit you can set, is 50.',
          maximum: 50
        }
      }
    },
    select: {
      required: [ 'options' ],
      properties: {
        options: {
          type: 'array',
          title: 'Select Options',
          description: 'Takes an array of value/label definitions for each option in the drop-down',
          items: {
            type: 'object',
            required: [ 'value', 'label' ],
            additionalProperties: false,
            properties: {
              value: {
                type: 'string',
                description: 'The value of the select options. This will be used as the output'
              },
              label: {
                type: 'string',
                description: 'A label to render to the theme editor'
              },
              group: {
                type: 'string',
                description: 'An optional attribute you can add to each option to create option groups in the drop-down.'
              }
            }
          }
        }
      }
    },
    range: {
      required: [ 'min', 'max', 'step' ],
      type: 'object',
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
    },
    radio: {
      required: [ 'options' ],
      type: 'object',
      properties: {
        options: {
          type: 'array',
          title: 'Radio Options',
          description: 'Takes an array of value/label definitions',
          items: {
            type: 'object',
            required: [ 'value', 'label' ],
            additionalProperties: false,
            properties: {
              value: {
                type: 'string'
              },
              label: {
                type: 'string'
              }
            }
          }
        }
      }
    },
    video_url: {
      required: [ 'accepts' ],
      type: 'object',
      properties: {
        accepts: {
          type: 'array',
          title: 'Accepts',
          uniqueItems: true,
          additionalItems: false,
          description: 'Takes an array of accepted video providers. Valid values are youtube, vimeo, or both',
          items: {
            type: 'string',
            enum: [ 'youtube', 'vimeo' ]
          }
        },
        placeholder: {
          type: 'string',
          title: 'Placeholder',
          description: 'A placeholder value'
        }
      }
    },
    settings: {
      type: 'array',
      items: {
        required: [ 'type' ],
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
                enum: [ 'number' ],
                title: 'Number',
                description: 'A setting of type number outputs a single number field. In addition to the standard attributes of an input setting, number type settings have the following attribut'
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
                enum: [ 'collection_list' ],
                title: 'Collection List',
                description: "A setting of type `collection_list` outputs a collection picker field that's automatically populated with the available collections for the store. You can use these fields to capture multiple collections, such as a group of collections to feature on the homepage."
              },
              {
                enum: [ 'product' ],
                title: 'Products drop-down',
                description: 'Settings of type product generate a drop-down that is automatically filled with the names of all the products in the store. The output of the option the merchant selects from the drop-down is the handle of the product.'
              },
              {
                enum: [ 'product_list' ],
                title: 'Products drop-down',
                description: "A setting of type product_list outputs a product picker field that's automatically populated with the available products for the store. You can use these fields to capture multiple products, such as a group of products to feature on the homepage."
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
                enum: [ 'inline_richtext' ],
                title: 'Inline RichText',
                description: "A setting of type inline_richtext outputs HTML markup that isn't wrapped in paragraph tags (<p>). The setting includes the following basic formatting options:"
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
                title: 'Header',
                description: 'Use settings of type header to add a styled header into the sidebar for informational purposes.'
              },
              {
                enum: [ 'paragraph' ],
                title: 'Paragraph',
                description: 'A setting of type paragraph outputs a text element to help you better describe your input settings'
              },
              {
                enum: [ 'liquid' ],
                title: 'Liquid',
                description: 'A setting of type liquid outputs a multi-line text field that accepts HTML and limited Liquid markup. You can use these fields to capture custom blocks of HTML and Liquid content, such as a product-specific message. Merchants can also use a liquid setting to add the code needed to integrate certain types of apps into your theme.'
              },
              {
                enum: [ 'video' ],
                title: 'Video',
                description: "A setting of type video outputs a video picker that's automatically populated with the available videos from the Files section of the Shopify admin. The merchant also has the option to upload new videos."
              },
              {
                enum: [ 'video_url' ],
                title: 'Video URL',
                description: 'A setting of type video_url outputs a URL entry field. In addition to the standard attributes of an input setting.'
              }
            ]
          }
        },
        if: {
          required: [ 'type' ],
          type: 'object',
          properties: {
            type: {
              enum: [
                'text',
                'textarea',
                'image_picker',
                'radio',
                'select',
                'checkbox',
                'number',
                'range',
                'color',
                'font_picker',
                'collection',
                'collection_list',
                'product',
                'product_list',
                'blog',
                'page',
                'link_list',
                'url',
                'richtext',
                'inline_richtext',
                'html',
                'article',
                'liquid',
                'video',
                'video_url'
              ]
            }
          }
        },
        then: {
          required: [ 'id', 'label' ],
          properties: {
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
            default: {
              type: [ 'string', 'number', 'boolean' ],
              title: 'Default',
              description: 'A value to which the setting can default.'
            },
            info: {
              title: 'Info',
              type: 'string',
              description: "Additional information about the setting. Use sparingly, as it's better to use only informative labels whenever you can."
            }
          },
          allOf: [
            {
              if: {
                required: [ 'type' ],
                type: 'object',
                properties: {
                  type: {
                    const: 'range'
                  }
                }
              },
              then: {
                $ref: '#/definitions/range'
              }
            },
            {
              if: {
                required: [ 'type' ],
                type: 'object',
                properties: {
                  type: {
                    const: 'select'
                  }
                }
              },
              then: {
                $ref: '#/definitions/select'
              }
            },
            {
              if: {
                required: [ 'type' ],
                type: 'object',
                properties: {
                  type: {
                    const: 'radio'
                  }
                }
              },
              then: {
                $ref: '#/definitions/radio'
              }
            },
            {
              if: {
                required: [ 'type' ],
                type: 'object',
                properties: {
                  type: {
                    enum: [
                      'collection_list',
                      'product_list'
                    ]
                  }
                }
              },
              then: {
                $ref: '#/definitions/limit'
              }
            },

            {
              if: {
                required: [ 'type' ],
                type: 'object',
                properties: {
                  type: {
                    enum: [
                      'text',
                      'textarea',
                      'html',
                      'number'
                    ]
                  }
                }
              },
              then: {
                $ref: '#/definitions/placeholder'
              }
            },
            {
              if: {
                required: [ 'type' ],
                type: 'object',
                properties: {
                  type: {
                    const: 'video_url'
                  }
                }
              },
              then: {
                $ref: '#/definitions/video_url'
              }
            }
          ]
        },
        else: {
          if: {
            required: [ 'type' ],
            type: 'object',
            properties: {
              type: {
                enum: [ 'header', 'paragraph' ]
              }
            }
          },
          then: {
            allOf: [
              {
                $ref: '#/definitions/content'
              }
            ]
          }
        }
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
          settings: {
            $ref: '#/definitions/settings'
          }
        }
      }
    }
  },
  type: 'object',
  title: 'Shopify Section Schema',
  description: 'Shopify schema store reference for the schema Liquid tag used in Shopify themes.',
  additionalProperties: false,
  required: [ 'name' ],
  properties: {
    name: {
      title: 'Name',
      description: 'The name attribute determines the section title that is shown in the theme editor.',
      type: 'string'
    },
    class: {
      title: 'Class',
      description: 'When Shopify renders a section, it’s wrapped in an HTML element with a class of shopify-section. You can add to that class here.',
      type: 'string'
    },
    tag: {
      title: 'Tag',
      description: "By default, when Shopify renders a section, it's wrapped in a <div> element with a unique id attribute.\n\nIf you don’t want to use a <div>, then you can specify which kind of HTML element to use with the tag attribute.",
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
    max_blocks: {
      title: 'Limit',
      description: 'There’s a limit of 50 blocks per section. You can specify a lower limit with the max_blocks attribute.',
      type: 'number',
      minimum: 1,
      maximum: 50
    },
    templates: {
      title: 'Templates',
      description: 'You can restrict a section to certain templates by specifying those templates through the templates attribute. This attribute accepts a list of strings that represent the page type',
      type: 'array',
      uniqueItems: true,
      items: {
        type: 'string',
        enum: [
          '404',
          'article',
          'blog',
          'cart',
          'collection',
          'list-collections',
          'customers/account',
          'customers/activate_account',
          'customers/addresses',
          'customers/login',
          'customers/order',
          'customers/register',
          'customers/reset_password',
          'gift_card',
          'index',
          'page',
          'password',
          'policy',
          'product',
          'search'
        ]
      }
    },
    limit: {
      title: 'Limit',
      description: "By default, there's no limit to how many times a section can be added to a template. You can specify a limit of 1 or 2 with the limit attribute.",
      type: 'number'
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
      description: "Presets are default configurations of sections that enable merchants to easily add a section to a JSON template through the theme editor. Presets aren't related to theme styles that are defined in `settings_data.json` files.",
      items: {
        type: 'object',
        required: [ 'name' ],
        properties: {
          name: {
            title: 'Name',
            description: 'The preset name, which will show in the Add section portion of the theme editor.',
            type: 'string'
          },
          settings: {
            type: 'object',
            title: 'Settings',
            description: 'A list of default values for any settings you might want to populate. Each entry should include the setting name and the value.'
          },
          blocks: {
            type: 'array',
            description: 'A list of default blocks that you might want to include. Each entry should be an object with attributes of type and settings. The type attribute value should reflect the type of the block that you want to include, and the settings object should be in the same format as the settings attribute above.',
            items: {
              type: 'object'
            }
          }
        }
      }
    },
    defaults: {
      type: 'array',
      title: 'Defaults',
      description: 'If you statically render a section, then you can define a default configuration with the default object, which has the same attributes as the preset object.',
      items: {
        type: 'object',
        required: [ 'name' ],
        properties: {
          name: {
            title: 'Name',
            description: 'The default name, which will show in the Add section portion of the theme editor.',
            type: 'string'
          },
          settings: {
            type: 'object',
            title: 'Settings',
            description: 'A list of default values for any settings you might want to populate. Each entry should include the setting name and the value.'
          },
          blocks: {
            type: 'array',
            description: 'A list of default blocks that you might want to include. Each entry should be an object with attributes of type and settings. The type attribute value should reflect the type of the block that you want to include, and the settings object should be in the same format as the settings attribute above.',
            items: {
              type: 'object'
            }
          }
        }
      }
    },
    locales: {
      type: 'object',
      title: 'Locales',
      description: 'Sections can provide their own set of translated strings through the `locales` object. This is separate from the `locales` directory of the theme, which makes it a useful feature for sections that are meant to be installed on multiple themes or shops.'
    }
  }
};
