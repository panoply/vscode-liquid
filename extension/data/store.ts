/**
* LICENSE - THIS FILE IS NOT MIT
*
* THIS LICENCE IS STRICTLY IMPOSED AND IS LIMITED TO APPROVED USAGE
* YOU ARE NOT PERMITTED TO USE THE CONTENTS OF THIS FILE IN ANY FORM
* YOUR ARE NOT AUTHORISED TO COPY, RE-DISTRIBUTE OR MODIFY THIS FILE
* ASK PERMISSION FROM THE PROJECT AUTHOR BEFORE USAGE OR RE-PURPOSING
*
*/
/* eslint-disable */
export const schema = {
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "shopify-section-schema",
  "version": 1.1,
  "definitions": {
    "shared_settings": {
      "$comment": "Shared Section Settings $ref (references) will be inserted here"
    },
    "shared_blocks": {
      "$comment": "Shared Section Blocks $ref (references) will be inserted here"
    },
    "languages": {
      "type": "object",
      "markdownDescription": "Locales",
      "properties": {
        "af": {
          "type": "string",
          "markdownDescription": "Afrikaans (Afrikaans)"
        },
        "ar": {
          "type": "string",
          "markdownDescription": "Arabic (العربية)"
        },
        "az": {
          "type": "string",
          "markdownDescription": "Azerbaijani (Azərbaycanlı)"
        },
        "be": {
          "type": "string",
          "markdownDescription": "Belarusian (беларуская)"
        },
        "bg": {
          "type": "string",
          "markdownDescription": "Bulgarian (български)"
        },
        "bs": {
          "type": "string",
          "markdownDescription": "Bosnian (bosanski/босански)"
        },
        "cs": {
          "type": "string",
          "markdownDescription": "Czech (čeština)"
        },
        "cy": {
          "type": "string",
          "markdownDescription": "Welsh (Cymraeg)"
        },
        "da": {
          "type": "string",
          "markdownDescription": "Danish (dansk)"
        },
        "de": {
          "type": "string",
          "markdownDescription": "German (Deutsch)"
        },
        "el": {
          "type": "string",
          "markdownDescription": "Greek (ελληνικά)"
        },
        "en": {
          "type": "string",
          "markdownDescription": "English"
        },
        "es": {
          "type": "string",
          "markdownDescription": "Spanish (español)"
        },
        "et": {
          "type": "string",
          "markdownDescription": "Estonian (eesti)"
        },
        "fa": {
          "type": "string",
          "markdownDescription": "Persian (فارسى)"
        },
        "fi": {
          "type": "string",
          "markdownDescription": "Finnish (suomi)"
        },
        "fr": {
          "type": "string",
          "markdownDescription": "French (français)"
        },
        "fy": {
          "type": "string",
          "markdownDescription": "Frisian (Frysk)"
        },
        "he": {
          "type": "string",
          "markdownDescription": "Hebrew (עברית)"
        },
        "hr": {
          "type": "string",
          "markdownDescription": "Croatian (hrvatski)"
        },
        "hi": {
          "type": "string",
          "markdownDescription": "Hindi (हिंदी)"
        },
        "hu": {
          "type": "string",
          "markdownDescription": "Hungarian (magyar)"
        },
        "id": {
          "type": "string",
          "markdownDescription": "Indonesian (Bahasa Indonesia)"
        },
        "is": {
          "type": "string",
          "markdownDescription": "Icelandic (íslenska)"
        },
        "lv": {
          "type": "string",
          "markdownDescription": "Latvian (latviešu)"
        },
        "nl": {
          "type": "string",
          "markdownDescription": "Dutch (Nederlands)"
        },
        "no": {
          "type": "string",
          "markdownDescription": "Norwegian (norsk)"
        },
        "it": {
          "type": "string",
          "markdownDescription": "Italian (italiano)"
        },
        "ja": {
          "type": "string",
          "markdownDescription": "Japanese (日本語)"
        },
        "ko": {
          "type": "string",
          "markdownDescription": "Korean (한국어/韓國語)"
        },
        "lb": {
          "type": "string",
          "markdownDescription": "Luxembourgish (Lëtzebuergesch)"
        },
        "lt": {
          "type": "string",
          "markdownDescription": "Lithuanian (lietuvių)"
        },
        "mk": {
          "type": "string",
          "markdownDescription": "Macedonian (македонски јазик)"
        },
        "pa": {
          "type": "string",
          "markdownDescription": "Punjabi (ਪੰਜਾਬੀ)"
        },
        "pl": {
          "type": "string",
          "markdownDescription": "Polish (polski)"
        },
        "pt": {
          "type": "string",
          "markdownDescription": "Portuguese (Português)"
        },
        "ro": {
          "type": "string",
          "markdownDescription": "Romanian (română)"
        },
        "ru": {
          "type": "string",
          "markdownDescription": "Russian (русский)"
        },
        "si": {
          "type": "string",
          "markdownDescription": "Sinhala (සිංහල)"
        },
        "sl": {
          "type": "string",
          "markdownDescription": "Albanian (shqipe)"
        },
        "sk": {
          "type": "string",
          "markdownDescription": "Slovak (slovenčina)"
        },
        "sq": {
          "type": "string",
          "markdownDescription": "Slovenian (slovenski)"
        },
        "sv": {
          "type": "string",
          "markdownDescription": "Swedish (svenska)"
        },
        "ta": {
          "type": "string",
          "markdownDescription": "Tamil (தமிழ்)"
        },
        "th": {
          "type": "string",
          "markdownDescription": "Thai (ไทย)"
        },
        "tr": {
          "type": "string",
          "markdownDescription": "Turkish (Türkçe)"
        },
        "zh": {
          "type": "string",
          "markdownDescription": "Chinese (中文)"
        },
        "uk": {
          "type": "string",
          "markdownDescription": "Ukrainian (українська)"
        },
        "vi": {
          "type": "string",
          "markdownDescription": "Vietnamese (Tiếng Việt/㗂越)"
        }
      }
    },
    "content": {
      "required": [
        "content"
      ],
      "type": "object",
      "properties": {
        "content": {
          "title": "Content",
          "markdownDescription": "The setting content, which will show in the theme editor.\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/docs/themes/architecture/settings/sidebar-settings#paragraph)",
          "oneOf": [
            {
              "type": "string"
            },
            {
              "$ref": "#/definitions/languages"
            }
          ]
        }
      }
    },
    "header": {
      "required": [
        "content"
      ],
      "type": "object",
      "properties": {
        "content": {
          "title": "Content",
          "markdownDescription": "The setting content, which will show in the theme editor.\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/docs/themes/architecture/settings/sidebar-settings#standard-attributes)"
        },
        "info": {
          "title": "Info",
          "markdownDescription": "In addition to the standard attributes of a sidebar setting, `header` type can accept informational text.\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/docs/themes/architecture/settings/sidebar-settings#header)",
          "oneOf": [
            {
              "type": "string"
            },
            {
              "$ref": "#/definitions/languages"
            }
          ]
        }
      }
    },
    "placeholder": {
      "type": "object",
      "properties": {
        "placeholder": {
          "title": "Placeholder",
          "markdownDescription": "A placeholder value",
          "default": "",
          "oneOf": [
            {
              "type": "string"
            },
            {
              "$ref": "#/definitions/languages"
            }
          ]
        }
      }
    },
    "limit": {
      "type": "object",
      "properties": {
        "limit": {
          "type": "number",
          "title": "Limit",
          "markdownDescription": "The maximum number of items that the merchant can select. The default limit, and the maximum limit you can set, is 50.",
          "maximum": 50
        }
      }
    },
    "select": {
      "required": [
        "options"
      ],
      "properties": {
        "options": {
          "type": "array",
          "title": "Select Options",
          "markdownDescription": "Takes an array of value/label definitions for each option in the drop-down",
          "items": {
            "type": "object",
            "required": [
              "value",
              "label"
            ],
            "additionalProperties": false,
            "defaultSnippets": [
              {
                "label": "Options",
                "markdownDescription": "Takes an array of value/label definitions for each option in the drop-down.",
                "body": {
                  "value": "$1",
                  "label": "${1/([^_]+)(_*)/${1:/capitalize}${2:+ }/g}$2"
                }
              },
              {
                "label": "Options with group",
                "markdownDescription": "Takes an array of value/label definitions for each option in the drop-down with an optional attribute you can add to each option to create option groups in the drop-down",
                "body": {
                  "value": "$1",
                  "label": "${1/([^_]+)(_*)/${1:/capitalize}${2:+ }/g}$2",
                  "group": "$3"
                }
              }
            ],
            "properties": {
              "value": {
                "type": "string",
                "markdownDescription": "The value of the select options. This will be used as the output"
              },
              "label": {
                "title": "Label",
                "markdownDescription": "A label to render to the theme editor",
                "oneOf": [
                  {
                    "type": "string"
                  },
                  {
                    "$ref": "#/definitions/languages"
                  }
                ]
              },
              "group": {
                "title": "Group",
                "markdownDescription": "An optional attribute you can add to each option to create option groups in the drop-down.",
                "oneOf": [
                  {
                    "type": "string"
                  },
                  {
                    "$ref": "#/definitions/languages"
                  }
                ]
              }
            }
          }
        }
      }
    },
    "range": {
      "required": [
        "min",
        "max",
        "step"
      ],
      "type": "object",
      "properties": {
        "step": {
          "type": "number",
          "title": "Step",
          "minimum": 0.1,
          "default": 1,
          "markdownDescription": "The step refers to the step count for the slider values. For example, if you set the step to 5, then the range slider will count by fives. By default, the step is set to 1."
        },
        "min": {
          "type": "number",
          "title": "Min",
          "markdownDescription": "The minimum number of steps"
        },
        "max": {
          "type": "number",
          "title": "Max",
          "markdownDescription": "The maximum number of steps"
        },
        "unit": {
          "title": "Unit",
          "markdownDescription": "The unit of measure label. For example, you could use sec for seconds, or px for pixels.",
          "default": "",
          "oneOf": [
            {
              "type": "string"
            },
            {
              "$ref": "#/definitions/languages"
            }
          ]
        }
      }
    },
    "radio": {
      "required": [
        "options"
      ],
      "type": "object",
      "properties": {
        "options": {
          "type": "array",
          "title": "Radio Options",
          "markdownDescription": "Takes an array of value/label definitions",
          "items": {
            "type": "object",
            "required": [
              "value",
              "label"
            ],
            "additionalProperties": false,
            "defaultSnippets": [
              {
                "label": "Radio Options",
                "markdownDescription": "Value and label definitions",
                "body": {
                  "value": "$1",
                  "label": "${2/([^_]+)(_*)/${1:/capitalize}${2:+ }/g}$3"
                }
              }
            ],
            "properties": {
              "value": {
                "type": "string"
              },
              "label": {
                "title": "Label",
                "markdownDescription": "Radio Label",
                "oneOf": [
                  {
                    "type": "string"
                  },
                  {
                    "$ref": "#/definitions/languages"
                  }
                ]
              }
            }
          }
        }
      }
    },
    "color": {
      "type": "object",
      "format": "color",
      "properties": {
        "default": {
          "type": "string",
          "format": "color"
        }
      }
    },
    "video_url": {
      "required": [
        "accepts"
      ],
      "type": "object",
      "properties": {
        "accept": {
          "type": "array",
          "title": "Accept",
          "uniqueItems": true,
          "additionalItems": false,
          "markdownDescription": "Takes an array of accepted video providers. Valid values are youtube, vimeo, or both",
          "items": {
            "type": "string",
            "enum": [
              "youtube",
              "vimeo"
            ]
          }
        },
        "placeholder": {
          "$ref": "#/definitions/languages"
        }
      }
    },
    "settings": {
      "$comment": "Shared Section Schema $ref (references) and inserted dynamically via the JSON language server. When \"schema\" file globs are provided in liquidrc or workspace settings, the vscode extension will insert the additional schemas required",
      "type": "array",
      "markdownDescription": "You can create section specific [settings](https://shopify.dev/themes/architecture/settings/input-settings) to allow merchants to customize the section with the `settings` object:\n\n**Example**\n\n```liquid\n\n{% schema %}\n{\n  \"name\": \"Slideshow\",\n  \"tag\": \"section\",\n  \"class\": \"slideshow\",\n  \"settings\": [\n    {\n      \"type\": \"text\",\n      \"id\": \"header\",\n      \"label\": \"Header\"\n    }\n  ]\n}\n{% endschema %}\n\n```\n\n**[Input Settings](https://shopify.dev/themes/architecture/settings/input-settings)**\n\nInput settings are generally composed of [standard attributes](https://shopify.dev/themes/architecture/settings/input-settings#standard-attributes), and there are two categories:\n\n- [Basic input settings](https://shopify.dev/themes/architecture/settings/input-settings#basic-input-settings)\n- [Specialized input settings](https://shopify.dev/themes/architecture/settings/input-settings#specialized-input-settings)\n\nTo learn how to access the values of these settings for use in your theme, refer to the [settings overview](https://shopify.dev/themes/architecture/settings#access-settings).\n\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/settings/input-settings)\n",
      "items": {
        "type": "object",
        "properties": {
          "type": {
            "type": "string",
            "title": "Type",
            "required": [
              "type"
            ],
            "markdownDescription": "The setting type, which can be any of the [basic](https://shopify.dev/docs/themes/architecture/settings/input-settings#basic-input-settings) or [specialized](https://shopify.dev/docs/themes/architecture/settings/input-settings#specialized-input-settings) input setting types.\n\n**Basic input settings**\n\nAnchor link to section titled \"Basic input settings\" The following are the basic input setting types:\n\n- [checkbox](https://shopify.dev/docs/themes/architecture/settings/input-settings#checkbox)\n- [number](https://shopify.dev/docs/themes/architecture/settings/input-settings#number)\n- [radio](https://shopify.dev/docs/themes/architecture/settings/input-settings#radio)\n- [range](https://shopify.dev/docs/themes/architecture/settings/input-settings#range)\n- [select](https://shopify.dev/docs/themes/architecture/settings/input-settings#select)\n- [text](https://shopify.dev/docs/themes/architecture/settings/input-settings#text)\n- [textarea](https://shopify.dev/docs/themes/architecture/settings/input-settings#textarea)\n\n\n**Specialized input settings**\n\nAnchor link to section titled \"Specialized input settings\" The following are the specialized input setting types:\n\n- [article](https://shopify.dev/docs/themes/architecture/settings/input-settings#article)\n- [blog](https://shopify.dev/docs/themes/architecture/settings/input-settings#blog)\n- [collection](https://shopify.dev/docs/themes/architecture/settings/input-settings#collection)\n- [collection_list](https://shopify.dev/docs/themes/architecture/settings/input-settings#collection_list)\n- [color](https://shopify.dev/docs/themes/architecture/settings/input-settings#color)\n- [color_background](https://shopify.dev/docs/themes/architecture/settings/input-settings#color_background)\n- [color_scheme](https://shopify.dev/docs/themes/architecture/settings/input-settings#color_scheme)\n- [color_scheme_group](https://shopify.dev/docs/themes/architecture/settings/input-settings#color_scheme_group)\n- [font_picker](https://shopify.dev/docs/themes/architecture/settings/input-settings#font_picker)\n- [html](https://shopify.dev/docs/themes/architecture/settings/input-settings#html)\n- [image_picker](https://shopify.dev/docs/themes/architecture/settings/input-settings#image_picker)\n- [inline_richtext](https://shopify.dev/docs/themes/architecture/settings/input-settings#inline_richtext)\n- [link_list](https://shopify.dev/docs/themes/architecture/settings/input-settings#link_list)\n- [liquid](https://shopify.dev/docs/themes/architecture/settings/input-settings#liquid)\n- [page](https://shopify.dev/docs/themes/architecture/settings/input-settings#page)\n- [product](https://shopify.dev/docs/themes/architecture/settings/input-settings#product)\n- [product_list](https://shopify.dev/docs/themes/architecture/settings/input-settings#product_list)\n- [richtext](https://shopify.dev/docs/themes/architecture/settings/input-settings#rich_text)\n- [url](https://shopify.dev/docs/themes/architecture/settings/input-settings#url)\n- [video](https://shopify.dev/docs/themes/architecture/settings/input-settings#video)\n- [video_url](https://shopify.dev/docs/themes/architecture/settings/input-settings#video_url)\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/sections/section-schema#default)\n",
            "oneOf": [
              {
                "enum": [
                  "text"
                ],
                "title": "Single-line text fields",
                "markdownDescription": "A setting of type `text` outputs a single-line text field. In addition to the [standard attributes](https://shopify.dev/themes/architecture/settings/input-settings#standard-attributes) of an input setting.\n\nWhen accessing the value of a `text` type setting, data is returned as one of the following:\n\n- A [string](https://shopify.dev/api/liquid/basics#types).\n- An [empty object](https://shopify.dev/api/liquid/basics#empty), if nothing has been entered.\n\n#\n\n---\n\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/settings/input-settings#text)\n\n\n"
              },
              {
                "enum": [
                  "textarea"
                ],
                "title": "Multi-line text areas",
                "markdownDescription": "A setting of type `textarea` outputs a multi-line text field. In addition to the [standard attributes](https://shopify.dev/themes/architecture/settings/input-settings#standard-attributes) of an input setting.\n\nWhen accessing the value of a `textarea` type setting, data is returned as one of the following:\n\n- A [string](https://shopify.dev/api/liquid/basics#types).\n- An [empty object](https://shopify.dev/api/liquid/basics#empty), if nothing has been entered.\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/settings/input-settings#textarea)\n\n\n"
              },
              {
                "enum": [
                  "image_picker"
                ],
                "title": "Image Picker",
                "markdownDescription": "A setting of type `image_picker` outputs an image picker field that's automatically populated with the available images from the [Files](https://help.shopify.com/en/manual/shopify-admin/productivity-tools/file-uploads) section of Shopify admin, and has the option to upload new images. Merchants also have an opportunity to enter alt text and select a [focal point](https://shopify.dev/themes/architecture/settings/input-settings#image-focal-points) for their image.\n\nYou can use these fields to capture an image selection, such as logos, favicons, and slideshow images.\n\nWhen accessing the value of an `image_picker` type setting, data is returned as one of the following:\n\n- An [image object](https://shopify.dev/api/liquid/objects/image).\n- [nil](https://shopify.dev/api/liquid/basics/types#nil), if either no selection has been made or the selection no longer exists.\n\n> **NOTE**\n>\n> Settings of type `image_picker` are not updated when switching presets. `image_picker` settings also don't support the `default` attribute.\n\n**[Image focal points](https://shopify.dev/themes/architecture/settings/input-settings#image-focal-points)**\n\nImages selected using an `image_picker` setting support focal points. A focal point is a position in an image that the merchant wants to remain in view as the image is cropped and adjusted by the theme. Focal points can be set in the theme editor `image_picker` setting, or from the Files page.\n\nTo make sure that your theme respects the focal point of the image, do the following:\n\n- Render your images using the [image_tag](https://shopify.dev/api/liquid/filters/image_tag) filter.\n- Consider positioning images within containers using `object-fit: cover`.\n\nUsing `image_tag`, if a focal point was provided, then an `object-position` style is added to the image tag, with the value set to the focal point.\n\n**Input**\n\n```liquid\n\n{{ section.settings.image_with_text_image | image_url: width: 1500 | image_tag }}\n\n```\n\n**Output**\n\n```html\n\n<img src=\"octopus-tentacle.jpg?v=1&width=1500\" alt=\"My alt text\"\n srcset=\"octopus-tentacle.jpg?v=1&width=352 352w,\n         octopus-tentacle.jpg?v=1&width=832 832w,\n         octopus-tentacle.jpg?v=1&width=1200 1200w\"\n width=\"1500\" height=\"1875\"\n style=\"object-position:25% 10%;\">\n\n\n```\n\nIf you need override the `object-position` style for a specific use case, then pass a style: `object-position: inherit;` property to the `image_tag` filter.\n\n> **TIP**\n>\n> You can also access the focal point data using [image.presentation.focal_point](https://shopify.dev/api/liquid/objects/image_presentation#image_presentation-focal_point).\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/settings/input-settings#image_picker)\n"
              },
              {
                "enum": [
                  "radio"
                ],
                "title": "Radio Button",
                "markdownDescription": "A setting of type `radio` outputs a radio option field. In addition to the [standard attributes](https://shopify.dev/themes/architecture/settings/input-settings#standard-attributes) of an input setting, `radio` type settings have a required options attribute that accepts an array of value and label definitions.\n\nYou can use these fields to capture a multi-option selection, such as the alignment of a header logo.\n\nWhen accessing the value of a radio type setting, data is returned as a [string](https://shopify.dev/api/liquid/basics/types#string).\n\n> **NOTE**\n>\n> If `default` is unspecified, then the first option is selected by default.\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/settings/input-settings#radio)\n\n"
              },
              {
                "enum": [
                  "select"
                ],
                "title": "Selection drop-down",
                "markdownDescription": "A setting of type `select` outputs a drop-down selector field. In addition to the [standard attributes](https://shopify.dev/themes/architecture/settings/input-settings#standard-attributes) of an input setting.\n\nWhen accessing the value of a `select` type setting, data is returned as a [string](https://shopify.dev/api/liquid/basics/types#string).\n\n> **NOTE**\n>\n> If `default` is unspecified, then the first option is selected by default.\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/settings/input-settings#select)\n\n\n"
              },
              {
                "enum": [
                  "checkbox"
                ],
                "title": "Checkbox",
                "markdownDescription": "A setting of type `checkbox` outputs a checkbox field. These fields can be used for toggling features on and off, such as whether to show an announcement bar.\n\nWhen accessing the value of a `checkbox` type setting, data is returned as a [boolean](https://shopify.dev/api/liquid/basics/types#boolean).\n\n> **NOTE**\n>\n> If `default` is unspecified, then the value is false by default.\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/settings/input-settings#checkbox)\n\n"
              },
              {
                "enum": [
                  "number"
                ],
                "title": "Number",
                "markdownDescription": "A setting of type `number` outputs a single number field. In addition to the [standard attributes](https://shopify.dev/themes/architecture/settings/input-settings#standard-attributes) of an input setting.\n\nWhen accessing the value of a `number` type setting, data is returned as one of the following:\n\n- A [number](https://shopify.dev/api/liquid/basics/types#number).\n- [nil](https://shopify.dev/api/liquid/basics/types#nil), if nothing has been entered.\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/settings/input-settings#number)\n\n\n"
              },
              {
                "enum": [
                  "range"
                ],
                "title": "Range",
                "markdownDescription": "A setting of type `range` outputs a range slider field. In addition to the [standard attributes](https://shopify.dev/themes/architecture/settings/input-settings#standard-attributes) of an input setting.\n\nWhen accessing the value of a `range` type setting, data is returned as a [number](https://shopify.dev/api/liquid/basics/types#number).\n\n> **CAUTION**\n>\n> The `default` attribute is required. The `min`, `max`, `step`, and `default` attributes can't be string values. Failing to adhere results in an error.\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/settings/input-settings#range)\n\n\n"
              },
              {
                "enum": [
                  "color"
                ],
                "title": "Color Picker",
                "markdownDescription": "A setting of type `color` outputs a color picker field. You can use these fields to capture a color selection for various theme elements, such as the body text color.\n\nWhen accessing the value of a color type setting, data is returned as one of the following:\n\n- A [color object](https://shopify.dev/api/liquid/objects/color).\n- `blank`, if no selection has been made.\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/settings/input-settings#color)\n"
              },
              {
                "enum": [
                  "color_scheme"
                ],
                "title": "Color Scheme",
                "markdownDescription": "A setting of type `color_scheme` outputs a picker with all of the available theme color schemes, and a preview of the selected color scheme. Theme color schemes in the picker are defined using the [color_scheme_group](https://shopify.dev/docs/themes/architecture/settings/input-settings#color_scheme_group) setting. You can apply a color scheme to sections, blocks and general theme settings. Color scheme settings aren't supported in app blocks.\n\nFor example, the following setting generates the following output:\n\n```json\n{\n  \"type\": \"color_scheme\",\n  \"id\": \"color_scheme\",\n  \"default\": \"scheme_1\",\n  \"label\": \"Color Scheme\"\n}\n```\n\nWhen accessing the value of a `color_scheme` type setting, Shopify returns the selected `color_scheme` object from `color_scheme_group`.\n\nIf no value was entered, or the value was invalid, then the default value from `color_scheme` is returned. If the default value is also invalid, then the first `color_scheme` from `color_scheme_group` is returned.\n\nIf the theme doesn't have `color_scheme_group` data in `settings_data.json`, then [nil](https://shopify.dev/docs/api/liquid/basics/types#nil) is returned.\n\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/docs/themes/architecture/settings/input-settings#color_scheme)\n"
              },
              {
                "enum": [
                  "color_background"
                ],
                "title": "Color Background",
                "markdownDescription": "A setting of type `color_background` outputs a text field for entering [CSS background](https://developer.mozilla.org/en-US/docs/Web/CSS/background) properties. You can use these fields to capture background settings for various theme elements, such as the store background.\n\n> **CAUTION**\n>\n> A Settings of type `color_background` do not support image related background properties.\n\nWhen accessing the value of a `color_background` type setting, data is returned as one of the following:\n\n- A [string](https://shopify.dev/api/liquid/basics/types#string).\n- [nil](https://shopify.dev/api/liquid/basics/types#nil), if nothing has been entered.\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/settings/input-settings#color_background)\n"
              },
              {
                "enum": [
                  "font_picker"
                ],
                "title": "Font Picker",
                "markdownDescription": "A setting of type `font_picker` outputs a font picker field that's automatically populated with fonts from the [Shopify font library](https://shopify.dev/themes/architecture/settings/fonts#shopify-font-library). This library includes web-safe fonts, a selection of Google Fonts, and fonts licensed by Monotype.\n\nYou can use these fields to capture a font selection for various theme elements, such as the base heading font.\n\nWhen accessing the value of a `font_picker` type setting, data is returned as a [font object](https://shopify.dev/api/liquid/objects/font).\n\n> **CAUTION**\n>\n> The `default` attribute is required. Failing to include it will result in an error. You can find the possible values through the [available fonts](https://shopify.dev/themes/architecture/settings/fonts#available-fonts) in the Shopify font library.\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/settings/input-settings#font_picker)\n"
              },
              {
                "enum": [
                  "collection"
                ],
                "title": "Collections drop-down",
                "markdownDescription": "A setting of type `collection` outputs a collection picker field that's automatically populated with the available collections for the store. You can use these fields to capture a collection selection, such as a collection for featuring products on the homepage.\n\nWhen accessing the value of a `collection` type setting, data is returned as one of the following\n\n- A [collection object](https://shopify.dev/api/liquid/objects/collection).\n  To ensure backwards compatibility with [legacy resource-based settings](https://shopify.dev/themes/architecture/settings#legacy-resource-based-settings), outputting the setting directly will return the object's handle.\n- `blank` if no selection has been made, the selection isn't visible, or the selection no longer exists.\n\n> **NOTE**\n>\n> Settings of type `collection` are not updated when switching presets. `collection` settings also don't support the `default` attribute.\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/settings/input-settings#collection)\n"
              },
              {
                "enum": [
                  "collection_list"
                ],
                "title": "Collection List",
                "markdownDescription": "A setting of type `collection_list` outputs a collection picker field that's automatically populated with the available collections for the store. You can use these fields to capture multiple collections, such as a group of collections to feature on the homepage.\n\nWhen accessing the value of a `collection_list` type setting, data is returned as one of the following:\n\n- An array of [collection objects](https://shopify.dev/api/liquid/objects/collection).\n  This array supports pagination using the [paginate](https://shopify.dev/api/liquid/tags/paginate#paginate-paginating-setting-arrays) tag. You can also append `.count` to the [setting key](https://shopify.dev/themes/architecture/settings#access-settings) to return the number of collections in the array.\n- `blank` if no selection has been made, the selection isn't visible, or the selection no longer exists.\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/settings/input-settings#collection_list)\n"
              },
              {
                "enum": [
                  "product"
                ],
                "title": "Products drop-down",
                "markdownDescription": "A setting of type `product` outputs a product picker field that's automatically populated with the available products for the store. You can use these fields to capture a product selection, such as the product to feature on the homepage.\n\n- A [product object](https://shopify.dev/api/liquid/objects/product).\n  To ensure backwards compatibility with [legacy resource-based settings](https://shopify.dev/themes/architecture/settings#legacy-resource-based-settings), outputting the setting directly will return the object's handle.\n- `blank`, if no selection has been made, the selection isn't visible, or the selection no longer exists.\n\n> **NOTE**\n>\n> Settings of type product are not updated when switching presets. `product` settings also don't support the `default` attribute.\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/settings/input-settings#product)\n"
              },
              {
                "enum": [
                  "product_list"
                ],
                "title": "Products drop-down",
                "markdownDescription": "A setting of type `product_list` outputs a product picker field that's automatically populated with the available products for the store. You can use these fields to capture multiple products, such as a group of products to feature on the homepage.\n\nWhen accessing the value of a `product_list` type setting, data is returned as one of the following:\n\n- An array of [product objects](https://shopify.dev/api/liquid/objects/product).\n  This array supports pagination using the [paginate](https://shopify.dev/api/liquid/tags/paginate#paginate-paginating-setting-arrays) tag. You can also append `.count` to the [setting key](https://shopify.dev/themes/architecture/settings#access-settings) to return the number of products in the array.\n- `blank` if no selection has been made, the selection isn't visible, or the selection no longer exists.\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/settings/input-settings#product_list)\n\n"
              },
              {
                "enum": [
                  "blog"
                ],
                "title": "Blogs drop-down",
                "markdownDescription": "A setting of type `blog` outputs a blog picker field that's automatically populated with the available blogs for the store. You can use these fields to capture a blog selection, such as the blog to feature in the sidebar.\n\nWhen accessing the value of a `blog` type setting, data is returned as one of the following\n\n- A [blog object](https://shopify.dev/api/liquid/objects/blog).\n  To ensure backwards compatibility with [legacy resource-based settings](https://shopify.dev/themes/architecture/settings#legacy-resource-based-settings), outputting the setting directly will return the object's handle.\n- `blank` if no selection has been made, the selection isn't visible, or the selection no longer exists.\n\n> **NOTE**\n>\n> Settings of type `blog` are not updated when switching presets. `blog` settings also don't support the `default` attribute.\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/settings/input-settings#blog)\n"
              },
              {
                "enum": [
                  "page"
                ],
                "title": "Pages drop-down",
                "markdownDescription": "A setting of type `page` outputs a page picker field that's automatically populated with the available pages for the store. You can use these fields to capture a page selection, such as the page to feature content for in a size-chart display.\n\nWhen accessing the value of a `page` type setting, data is returned as one of the following:\n\n- A [page object](https://shopify.dev/api/liquid/objects/page).\n  To ensure backwards compatibility with [legacy resource-based settings](https://shopify.dev/themes/architecture/settings#legacy-resource-based-settings), outputting the setting directly will return the object's handle.\n- `blank`, if no selection has been made, the selection isn't visible, or the selection no longer exists.\n\n> **NOTE**\n>\n> Settings of type page are not updated when switching presets. `page` settings also don't support the `default` attribute.\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/settings/input-settings#page)\n\n"
              },
              {
                "enum": [
                  "link_list"
                ],
                "title": "Link lists drop-down",
                "markdownDescription": "A setting of type `link_list` outputs a menu picker field that's automatically populated with the available menus for the store. You can use these fields to capture a menu selection, such as the menu to use for footer links.\n\nWhen accessing the value of a link_list type setting, data is returned as one of the following:\n\n- A [linklist object](https://shopify.dev/api/liquid/objects/linklist).\n- `blank`, if either no selection has been made or the selection no longer exists.\n\n> **NOTE**\n>\n> Accepted values for the `default` attribute are `main-menu` and `footer`.\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/settings/input-settings#link_list)\n"
              },
              {
                "enum": [
                  "url"
                ],
                "title": "URL",
                "markdownDescription": "A setting of type `url` outputs a URL entry field where you can manually enter external URLs and relative paths. It also has a picker that's automatically populated with the following available resources for the shop:\n\n- Articles\n- Blogs\n- Collections\n- Pages\n- Products\n\n> _You can use these fields to capture a URL selection, such as the URL to use for a slideshow button link._\n\nWhen accessing the value of a url type setting, data is returned as one of the following:\n\n- A [string](https://shopify.dev/api/liquid/basics/types#string) that contains the selected URL.\n- [nil](https://shopify.dev/api/liquid/basics/types#nil), if nothing has been entered.\n\n> **NOTE**\n>\n> Accepted values for the `default` attribute are `/collections` and `/collections/all`.\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/settings/input-settings#url)\n"
              },
              {
                "enum": [
                  "richtext"
                ],
                "title": "RichText",
                "markdownDescription": "A setting of type `richtext` outputs a multi-line text field with the following basic formatting options:\n\n- Bold\n- Italic\n- Underline\n- Link\n- Paragraph\n- Unordered list\n\n> **NOTE**\n>\n> No underline option appears in the rich text component. Merchants can underline text using the `CMD`+`U` or `CTRL`+`U` keyboard shortcut.\n\nYou can use these fields to capture formatted text content, such as introductory brand content on the homepage.\n\nWhen accessing the value of a richtext type setting, data is returned as one of the following:\n\n- A [string](https://shopify.dev/api/liquid/basics/types#string) that contains the entered content.\n- An [empty object](https://shopify.dev/api/liquid/basics/types#emptydrop), if nothing has been entered.\n\n**[default](https://shopify.dev/themes/architecture/settings/input-settings#default)**\n\nThe `default` attribute isn't required. However, if it's used, then only `<p>` or `<ul>` tags are supported as top-level elements.\n\nThe following HTML tags are also supported inside the parent `<p>` tag:\n\n```html\n- <p>\n- <br>\n- <strong>\n- <b>\n- <em>\n- <i>\n- <u>\n- <span>\n- <a>\n```\n\n> **CAUTION**\n>\n> Failing to wrap the default content in `<p>` or `<ul>` tags will result in an error.\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/settings/input-settings#richtext)\n"
              },
              {
                "enum": [
                  "inline_richtext"
                ],
                "title": "Inline RichText",
                "markdownDescription": "A setting of type `inline_richtext` outputs HTML markup that isn't wrapped in paragraph tags (`<p>`). The setting includes the following basic formatting options:\n\n- Bold\n- Italic\n- Link\n\n> **NOTE**\n>\n> The `inline_richtext` setting doesn't support the following features:\n>\n> - Line breaks (`<br>`)\n> - An underline option in the rich text editor. Merchants can underline text using the `CMD`+`U` or `CTRL`+`U` keyboard shortcut.\n\nYou can use these fields to capture formatted text content, such as introductory brand content on the homepage.\n\nWhen accessing the value of a `inline_richtext` type setting, data is returned as one of the following:\n\n- A [string](https://shopify.dev/api/liquid/basics/types#string) that contains the entered content.\n- An [empty object](https://shopify.dev/api/liquid/basics/types#emptydrop), if nothing has been entered.\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/settings/input-settings#inline_richtext)\n"
              },
              {
                "enum": [
                  "text_alignment"
                ],
                "title": "Text Alignment",
                "markdownDescription": "A setting of type `text_alignment` outputs a `SegmentedControl` field with icons. In addition to the standard [attributes](https://shopify.dev/docs/themes/architecture/settings/input-settings#standard-attributes) of an input setting.\n\nWhen you access the value of a `text_alignment` type setting, data is returned as a string.\n\n> **NOTE**\n>\n> If you don't specify the default attribute, then the `left` option is selected by default.\n> Note\nIf you don't specify the default attribute, then the left option is selected by default.\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/docs/themes/architecture/settings/input-settings#text_alignment)\n\n\n"
              },
              {
                "enum": [
                  "html"
                ],
                "title": "HTML",
                "markdownDescription": "A setting of type `html` outputs a multi-line text field that accepts HTML markup. In addition to the [standard attributes](https://shopify.dev/themes/architecture/settings/input-settings#standard-attributes) of an input setting.\n\nYou can use these fields to capture custom blocks of HTML content, such as a video embed.\n\nThe following HTML tags will be automatically removed:\n\n```html\n<html>\n<head>\n<body>\n```\n\nWhen accessing the value of an `html` type setting, data is returned as one of the following:\n\n- A [string](https://shopify.dev/api/liquid/basics/types#string) that contains the entered content.\n- An [empty object](https://shopify.dev/api/liquid/basics/types#emptydrop), if nothing has been entered.\n\n> **NOTE**\n>\n> Unclosed HTML tags are automatically closed when the setting is saved. This may not line up with your intended formatting, so be sure to verify your input.\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/settings/input-settings#html)\n"
              },
              {
                "enum": [
                  "article"
                ],
                "title": "Article",
                "markdownDescription": "A setting of type `article` outputs an article picker field that's automatically populated with the available articles for the store. You can use these fields to capture an article selection, such as the article to feature on the homepage.\n\nWhen accessing the value of a `article` type setting, data is returned as one of the following:\n\n- An [article object](https://shopify.dev/api/liquid/objects/article).\n  To ensure backwards compatibility with [legacy resource-based settings](https://shopify.dev/themes/architecture/settings#legacy-resource-based-settings), outputting the setting directly will return the object's handle.\n- `blank` if no selection has been made, the selection isn't visible, or the selection no longer exists.\n\n> **NOTE**\n>\n> Settings of type `article` are not updated when switching presets. `article` settings also don't support the `default` attribute.\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/settings/input-settings#article)\n"
              },
              {
                "enum": [
                  "header"
                ],
                "title": "Header",
                "markdownDescription": "A setting of type `header` outputs a header element to help you better organize your input settings.\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/docs/themes/architecture/settings/sidebar-settings#header)"
              },
              {
                "enum": [
                  "paragraph"
                ],
                "title": "Paragraph",
                "markdownDescription": "A setting of type `paragraph` outputs a text element to help you better describe your input settings.\n\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/docs/themes/architecture/settings/sidebar-settings#paragraph)"
              },
              {
                "enum": [
                  "liquid"
                ],
                "title": "Liquid",
                "markdownDescription": "A setting of type `liquid` outputs a multi-line text field that accepts HTML and **[limited](https://shopify.dev/themes/architecture/settings/input-settings#limitations)** Liquid markup. You can use these fields to capture custom blocks of HTML and Liquid content, such as a product-specific message. Merchants can also use a liquid setting to add the code needed to integrate certain types of [apps](https://shopify.dev/apps/online-store) into your theme.\n\nWhen accessing the value of a `liquid` type setting, data is returned as one of the following:\n\n- A [string](https://shopify.dev/api/liquid/basics/types#string) that contains the entered content.\n- An [empty object](https://shopify.dev/api/liquid/basics/types#emptydrop), if nothing has been entered.\n\n> **NOTE**\n>\n> The `default` attribute is optional. However, if you use it, then its value can't be an empty string. Additionally, unclosed HTML tags are automatically closed when the setting is saved. This might not line up with your intended formatting, so be sure to verify your input.\n\n**[Limitations](https://shopify.dev/themes/architecture/settings/input-settings#limitations)**\n\nSettings of type `liquid` don't have access to the following liquid objects/tags:\n\n- [layout](https://shopify.dev/api/liquid/tags/layout)\n- [content_for_header](https://shopify.dev/api/liquid/objects/content_for_header)\n- [content_for_layout](https://shopify.dev/api/liquid/objects/content_for_layout)\n- [content_for_index](https://shopify.dev/api/liquid/objects/content_for_index)\n- [section](https://shopify.dev/api/liquid/tags/section)\n- [javascript](https://shopify.dev/themes/architecture/sections/section-assets#javascript)\n- [stylesheet](https://shopify.dev/themes/architecture/sections/section-assets#stylesheet)\n- [schema](https://shopify.dev/themes/architecture/sections/section-schema)\n- [settings](https://shopify.dev/api/liquid/objects/settings)\n\nHowever, liquid settings can access the following:\n\n- [Global Liquid objects](https://shopify.dev/api/liquid/objects)\n- Template specific objects like `collection`, `product`, etc. (within their respective templates)\n- Standard Liquid [tags](https://shopify.dev/api/liquid/tags) and [filters](https://shopify.dev/api/liquid/filters)\n\nIf your content includes non-existent, or empty, Liquid tags, then they will be rendered as empty strings. For example, the following setting generates the following output:\n\n**Setting**\n\n```json\n{\n  \"type\": \"liquid\",\n  \"id\": \"message\",\n  \"label\": \"Message\",\n  \"default\": \"Hello {{ not_a_real_tag }}, welcome to our shop.\"\n}\n```\n\n**Output**\n\n```\nHello , welcome to our shop.\n```\n\n> **CAUTION**\n>\n> Content entered in these settings can't exceed 50kb. Saving content that either exceeds this limit or includes invalid Liquid will result in an error.\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/settings/input-settings#liquid)\n"
              },
              {
                "enum": [
                  "video"
                ],
                "title": "Video",
                "markdownDescription": "A setting of type `video` outputs a video picker that's automatically populated with the available videos from the [Files](https://help.shopify.com/en/manual/shopify-admin/productivity-tools/file-uploads) section of the Shopify admin. The merchant also has the option to upload new videos.\n\n> _The `video` type setting also accepts metafields of type `file_reference` as a [dynamic source](https://shopify.dev/themes/architecture/settings#dynamic-sources)._\n\nWhen accessing the value of a `video` type setting, data is returned as one of the following:\n\n- A [video object](https://shopify.dev/api/liquid/objects#video).\n- `nil`, if:\n  - no selection has been made,\n  - the selection no longer exists, or\n  - the selection is a `file_reference` metafield that points to a non-video file.\n\n> **NOTE**\n>\n> `video` settings don't support the `default` attribute.\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/settings/input-settings#video)\n"
              },
              {
                "enum": [
                  "video_url"
                ],
                "title": "Video URL",
                "markdownDescription": "A setting of type `video_url` outputs a URL entry field. In addition to the [standard attributes](https://shopify.dev/themes/architecture/settings/input-settings#standard-attributes) of an input setting.\n\nWhen accessing the value of a video_url type setting, data is returned as one of the following:\n\n- A [string](https://shopify.dev/api/liquid/basics/types#string) that contains the entered URL.\n- `nil`, if nothing has been entered.\n\nAdditionally, there's access to the `id` and `type` (YouTube or Vimeo) of the video.\n\nFor example, assuming you're using [this video](https://www.youtube.com/watch?v=_9VUPq3SxOc) with the above setting, the following Liquid generates the following output:\n\n**Setting**\n\n```liquid\n\nID: {{ settings.product_description_video.id }}\nType: {{ settings.product_description_video.type }}\n\n```\n\n**Output**\n\n```\n\nID: _9VUPq3SxOc\nType: youtube\n\n```\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/settings/input-settings#video_url)\n"
              }
            ]
          }
        },
        "if": {
          "required": [
            "type"
          ],
          "type": "object",
          "properties": {
            "type": {
              "enum": [
                "text",
                "textarea",
                "image_picker",
                "radio",
                "select",
                "checkbox",
                "number",
                "range",
                "color",
                "color_background",
                "color_scheme",
                "font_picker",
                "collection",
                "collection_list",
                "product",
                "product_list",
                "blog",
                "page",
                "link_list",
                "url",
                "richtext",
                "inline_richtext",
                "text_alignment",
                "html",
                "article",
                "liquid",
                "video",
                "video_url"
              ]
            }
          }
        },
        "then": {
          "required": [
            "id",
            "label"
          ],
          "properties": {
            "id": {
              "type": "string",
              "default": "",
              "minLength": 1,
              "markdownDescription": "The setting ID, which is used to access the setting value. The id is exposed to the liquid templates via the settings object. It must only contain alphanumeric characters, underscores, and dashes.\n\n> **REQUIRED**\n>\n> The `id` attribute is required for all settings.\n\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/docs/themes/architecture/settings/input-settings#standard-attributes)\n"
            },
            "label": {
              "markdownDescription": "The setting label, which will show in the theme editor.\n\n> **REQUIRED**\n>\n> The `label` attribute is required for all settings.\n\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/docs/themes/architecture/settings/input-settings#standard-attributes)\n",
              "default": "",
              "oneOf": [
                {
                  "type": "string"
                },
                {
                  "$ref": "#/definitions/languages"
                }
              ]
            },
            "default": {
              "type": [
                "string",
                "number",
                "boolean"
              ],
              "markdownDescription": "The default value for the setting.\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/docs/themes/architecture/settings/input-settings#standard-attributes)\n"
            },
            "info": {
              "markdownDescription": "An option for informational text about the setting. Use sparingly, as it's better to use only informative labels whenever you can.\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/docs/themes/architecture/settings/input-settings#standard-attributes)\n",
              "default": "",
              "oneOf": [
                {
                  "type": "string"
                },
                {
                  "$ref": "#/definitions/languages"
                }
              ]
            }
          },
          "allOf": [
            {
              "if": {
                "required": [
                  "type"
                ],
                "type": "object",
                "properties": {
                  "type": {
                    "const": "range"
                  }
                }
              },
              "then": {
                "$ref": "#/definitions/range"
              }
            },
            {
              "if": {
                "required": [
                  "type"
                ],
                "type": "object",
                "properties": {
                  "type": {
                    "const": [
                      "color",
                      "color_scheme",
                      "color_background"
                    ]
                  }
                }
              },
              "then": {
                "$ref": "#/definitions/color"
              }
            },
            {
              "if": {
                "required": [
                  "type"
                ],
                "type": "object",
                "properties": {
                  "type": {
                    "const": "select"
                  }
                }
              },
              "then": {
                "$ref": "#/definitions/select"
              }
            },
            {
              "if": {
                "required": [
                  "type"
                ],
                "type": "object",
                "properties": {
                  "type": {
                    "const": "text_alignment"
                  }
                }
              },
              "then": {
                "$ref": "#/definitions/text_alignment"
              }
            },
            {
              "if": {
                "required": [
                  "type"
                ],
                "type": "object",
                "properties": {
                  "type": {
                    "const": "radio"
                  }
                }
              },
              "then": {
                "$ref": "#/definitions/radio"
              }
            },
            {
              "if": {
                "required": [
                  "type"
                ],
                "type": "object",
                "properties": {
                  "type": {
                    "enum": [
                      "collection_list",
                      "product_list"
                    ]
                  }
                }
              },
              "then": {
                "$ref": "#/definitions/limit"
              }
            },
            {
              "if": {
                "required": [
                  "type"
                ],
                "type": "object",
                "properties": {
                  "type": {
                    "enum": [
                      "text",
                      "textarea",
                      "html",
                      "number"
                    ]
                  }
                }
              },
              "then": {
                "$ref": "#/definitions/placeholder"
              }
            },
            {
              "if": {
                "required": [
                  "type"
                ],
                "type": "object",
                "properties": {
                  "type": {
                    "const": "video_url"
                  }
                }
              },
              "then": {
                "$ref": "#/definitions/video_url"
              }
            }
          ]
        },
        "else": {
          "if": {
            "required": [
              "type"
            ],
            "type": "object",
            "properties": {
              "type": {
                "enum": [
                  "header",
                  "paragraph"
                ]
              }
            }
          },
          "then": {
            "allOf": [
              {
                "if": {
                  "required": [
                    "type"
                  ],
                  "type": "object",
                  "properties": {
                    "type": {
                      "markdownDescription": "The input setting type for a [header](https://shopify.dev/docs/themes/architecture/settings/sidebar-settings#header).\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/docs/themes/architecture/settings/sidebar-settings#header)",
                      "const": "header"
                    }
                  }
                },
                "then": {
                  "$ref": "#/definitions/header"
                }
              },
              {
                "if": {
                  "required": [
                    "type"
                  ],
                  "type": "object",
                  "properties": {
                    "type": {
                      "markdownDescription": "A setting of type `paragraph` outputs a text element to help you better describe your input settings.\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/docs/themes/architecture/settings/sidebar-settings#paragraph)",
                      "const": "paragraph"
                    }
                  }
                },
                "then": {
                  "$ref": "#/definitions/content"
                }
              }
            ]
          },
          "else": {
            "required": [],
            "$comment": "Shared Section Schema $ref (references) will be inserted here",
            "$ref": "#/definitions/shared_settings"
          }
        },
        "defaultSnippets": [
          {
            "label": "$ref",
            "markdownDescription": "> **This capability is for developers leveraging [Syncify](https://github.com/panoply/syncify). If you are not using Syncify then please consider adopting it as an alternative to the Shopify CLI.**\n>\n> Use [Syncify](https://github.com/panoply/syncify) for theme development and take advantage of Shared Section Schema files plus a ton of essential features that will empower your productivity. Support open source tools that are created, maintained and backed by developers for developers.\n\n---\n\nProvide a key identifier and either a schema setting/block (object) or array of settings/blocks. In your `{% schema %}` tag, you can import the shared schema using a `$ref` property key. The `$ref` property value **requires** you to pass the shared schema filename (without the `.json` extension) followed by a `.` and then the shared schema property key.\n\n**Example**\n\nSay (for example) your shared schema file is named `foo.json` and contains the following:\n\n```json\n{\n  \"hero_image\": {\n    \"type\": \"image_picker\",\n    \"id\": \"hero\",\n    \"label\": \"Some Hero\"\n  },\n  \"hero_caption\": {\n    \"type\": \"text\",\n    \"id\": \"caption\",\n    \"label\": \"Caption\",\n    \"default\": \"Some Caption\"\n  }\n}\n```\n\nYou can inject the `hero_image` and `hero_caption` schema into any section, and also overwrite the `id`, `label` etc. In the below example, we inject the `hero_image` and apply an overwrite to the `hero_caption`.\n\n```liquid\n{% schema %}\n{\n  \"name\": \"tester\",\n  \"class\": \"example\",\n  \"tag\": \"section\",\n  \"settings\": [\n    {\n      \"ref\": \"foo.hero_image\"\n    },\n    {\n      \"ref\": \"foo.hero_caption\",\n      \"label\": \"New Caption\",\n      \"default\": \"xxx\"\n    }\n  ]\n}\n{% endschema %}\n```",
            "body": {
              "${1|$ref|}": "^$2"
            }
          },
          {
            "label": "Text",
            "markdownDescription": "A setting of type `text` outputs a single-line text field. In addition to the [standard attributes](https://shopify.dev/themes/architecture/settings/input-settings#standard-attributes) of an input setting.\n\nWhen accessing the value of a `text` type setting, data is returned as one of the following:\n\n- A [string](https://shopify.dev/api/liquid/basics#types).\n- An [empty object](https://shopify.dev/api/liquid/basics#empty), if nothing has been entered.\n\n#\n\n---\n\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/settings/input-settings#text)\n\n\n",
            "body": {
              "type": "text",
              "id": "$2",
              "label": "${2/([^_]+)(_*)/${1:/capitalize}${2:+ }/g}$3",
              "${4|default,placeholder,info|}": "$5"
            }
          },
          {
            "label": "Textarea",
            "markdownDescription": "A setting of type `textarea` outputs a multi-line text field. In addition to the [standard attributes](https://shopify.dev/themes/architecture/settings/input-settings#standard-attributes) of an input setting.\n\nWhen accessing the value of a `textarea` type setting, data is returned as one of the following:\n\n- A [string](https://shopify.dev/api/liquid/basics#types).\n- An [empty object](https://shopify.dev/api/liquid/basics#empty), if nothing has been entered.\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/settings/input-settings#textarea)\n\n\n",
            "body": {
              "type": "text",
              "id": "$2",
              "label": "${2/([^_]+)(_*)/${1:/capitalize}${2:+ }/g}$3",
              "${4|default,placeholder,info|}": "$5"
            }
          },
          {
            "label": "Text Alignment",
            "markdownDescription": "A setting of type `text_alignment` outputs a `SegmentedControl` field with icons. In addition to the standard [attributes](https://shopify.dev/docs/themes/architecture/settings/input-settings#standard-attributes) of an input setting.\n\nWhen you access the value of a `text_alignment` type setting, data is returned as a string.\n\n> **NOTE**\n>\n> If you don't specify the default attribute, then the `left` option is selected by default.\n> Note\nIf you don't specify the default attribute, then the left option is selected by default.\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/docs/themes/architecture/settings/input-settings#text_alignment)\n\n\n",
            "body": {
              "type": "text_alignment",
              "id": "$2",
              "label": "${2/([^_]+)(_*)/${1:/capitalize}${2:+ }/g}$3",
              "default": "${4|left,center,right|}"
            }
          },
          {
            "label": "Number",
            "markdownDescription": "A setting of type `number` outputs a single number field. In addition to the [standard attributes](https://shopify.dev/themes/architecture/settings/input-settings#standard-attributes) of an input setting.\n\nWhen accessing the value of a `number` type setting, data is returned as one of the following:\n\n- A [number](https://shopify.dev/api/liquid/basics/types#number).\n- [nil](https://shopify.dev/api/liquid/basics/types#nil), if nothing has been entered.\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/settings/input-settings#number)\n\n\n",
            "body": {
              "type": "number",
              "id": "$1",
              "label": "${1/([^_]+)(_*)/${1:/capitalize}${2:+ }/g}$2",
              "default": "^$3",
              "${4|placeholder,info|}": "$5"
            }
          },
          {
            "label": "Checkbox",
            "markdownDescription": "A setting of type `checkbox` outputs a checkbox field. These fields can be used for toggling features on and off, such as whether to show an announcement bar.\n\nWhen accessing the value of a `checkbox` type setting, data is returned as a [boolean](https://shopify.dev/api/liquid/basics/types#boolean).\n\n> **NOTE**\n>\n> If `default` is unspecified, then the value is false by default.\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/settings/input-settings#checkbox)\n\n",
            "body": {
              "type": "checkbox",
              "id": "$1",
              "label": "${1/([^_]+)(_*)/${1:/capitalize}${2:+ }/g}$2",
              "default": "^${3|true,false|}",
              "info": "$4"
            }
          },
          {
            "label": "Select",
            "markdownDescription": "A setting of type `select` outputs a drop-down selector field. In addition to the [standard attributes](https://shopify.dev/themes/architecture/settings/input-settings#standard-attributes) of an input setting.\n\nWhen accessing the value of a `select` type setting, data is returned as a [string](https://shopify.dev/api/liquid/basics/types#string).\n\n> **NOTE**\n>\n> If `default` is unspecified, then the first option is selected by default.\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/settings/input-settings#select)\n\n\n",
            "body": {
              "type": "select",
              "id": "$1",
              "label": "${1/([^_]+)(_*)/${1:/capitalize}${2:+ }/g}$2",
              "default": "$4",
              "info": "$5",
              "options": [
                "^$3"
              ]
            }
          },
          {
            "label": "Radio",
            "markdownDescription": "A setting of type `radio` outputs a radio option field. In addition to the [standard attributes](https://shopify.dev/themes/architecture/settings/input-settings#standard-attributes) of an input setting, `radio` type settings have a required options attribute that accepts an array of value and label definitions.\n\nYou can use these fields to capture a multi-option selection, such as the alignment of a header logo.\n\nWhen accessing the value of a radio type setting, data is returned as a [string](https://shopify.dev/api/liquid/basics/types#string).\n\n> **NOTE**\n>\n> If `default` is unspecified, then the first option is selected by default.\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/settings/input-settings#radio)\n\n",
            "body": {
              "type": "radio",
              "id": "$1",
              "label": "${1/([^_]+)(_*)/${1:/capitalize}${2:+ }/g}$2",
              "default": "$4",
              "info": "$5",
              "options": [
                "^$3"
              ]
            }
          },
          {
            "label": "Range",
            "markdownDescription": "A setting of type `range` outputs a range slider field. In addition to the [standard attributes](https://shopify.dev/themes/architecture/settings/input-settings#standard-attributes) of an input setting.\n\nWhen accessing the value of a `range` type setting, data is returned as a [number](https://shopify.dev/api/liquid/basics/types#number).\n\n> **CAUTION**\n>\n> The `default` attribute is required. The `min`, `max`, `step`, and `default` attributes can't be string values. Failing to adhere results in an error.\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/settings/input-settings#range)\n\n\n",
            "body": {
              "type": "range",
              "id": "$1",
              "label": "${1/([^_]+)(_*)/${1:/capitalize}${2:+ }/g}$2",
              "min": "^$3",
              "max": "^$4",
              "step": "^$5",
              "unit": "$6",
              "default": "^$7"
            }
          },
          {
            "label": "Header",
            "markdownDescription": "A setting of type `header` outputs a header element to help you better organize your input settings.\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/docs/themes/architecture/settings/sidebar-settings#header)",
            "body": {
              "type": "header",
              "content": "$1",
              "${2:info}": "$3"
            }
          },
          {
            "label": "Paragraph",
            "markdownDescription": "A setting of type `paragraph` outputs a text element to help you better describe your input settings.\n\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/docs/themes/architecture/settings/sidebar-settings#paragraph)",
            "body": {
              "type": "paragraph",
              "content": "$1"
            }
          },
          {
            "label": "Article",
            "markdownDescription": "A setting of type `article` outputs an article picker field that's automatically populated with the available articles for the store. You can use these fields to capture an article selection, such as the article to feature on the homepage.\n\nWhen accessing the value of a `article` type setting, data is returned as one of the following:\n\n- An [article object](https://shopify.dev/api/liquid/objects/article).\n  To ensure backwards compatibility with [legacy resource-based settings](https://shopify.dev/themes/architecture/settings#legacy-resource-based-settings), outputting the setting directly will return the object's handle.\n- `blank` if no selection has been made, the selection isn't visible, or the selection no longer exists.\n\n> **NOTE**\n>\n> Settings of type `article` are not updated when switching presets. `article` settings also don't support the `default` attribute.\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/settings/input-settings#article)\n",
            "body": {
              "type": "article",
              "id": "$1",
              "label": "${1/([^_]+)(_*)/${1:/capitalize}${2:+ }/g}$2"
            }
          },
          {
            "label": "Blog",
            "markdownDescription": "A setting of type `blog` outputs a blog picker field that's automatically populated with the available blogs for the store. You can use these fields to capture a blog selection, such as the blog to feature in the sidebar.\n\nWhen accessing the value of a `blog` type setting, data is returned as one of the following\n\n- A [blog object](https://shopify.dev/api/liquid/objects/blog).\n  To ensure backwards compatibility with [legacy resource-based settings](https://shopify.dev/themes/architecture/settings#legacy-resource-based-settings), outputting the setting directly will return the object's handle.\n- `blank` if no selection has been made, the selection isn't visible, or the selection no longer exists.\n\n> **NOTE**\n>\n> Settings of type `blog` are not updated when switching presets. `blog` settings also don't support the `default` attribute.\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/settings/input-settings#blog)\n",
            "body": {
              "type": "blog",
              "id": "$1",
              "label": "${1/([^_]+)(_*)/${1:/capitalize}${2:+ }/g}$2"
            }
          },
          {
            "label": "Collection",
            "markdownDescription": "A setting of type `collection` outputs a collection picker field that's automatically populated with the available collections for the store. You can use these fields to capture a collection selection, such as a collection for featuring products on the homepage.\n\nWhen accessing the value of a `collection` type setting, data is returned as one of the following\n\n- A [collection object](https://shopify.dev/api/liquid/objects/collection).\n  To ensure backwards compatibility with [legacy resource-based settings](https://shopify.dev/themes/architecture/settings#legacy-resource-based-settings), outputting the setting directly will return the object's handle.\n- `blank` if no selection has been made, the selection isn't visible, or the selection no longer exists.\n\n> **NOTE**\n>\n> Settings of type `collection` are not updated when switching presets. `collection` settings also don't support the `default` attribute.\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/settings/input-settings#collection)\n",
            "body": {
              "type": "collection",
              "id": "$1",
              "label": "${1/([^_]+)(_*)/${1:/capitalize}${2:+ }/g}$2"
            }
          },
          {
            "label": "Collection List",
            "markdownDescription": "A setting of type `collection_list` outputs a collection picker field that's automatically populated with the available collections for the store. You can use these fields to capture multiple collections, such as a group of collections to feature on the homepage.\n\nWhen accessing the value of a `collection_list` type setting, data is returned as one of the following:\n\n- An array of [collection objects](https://shopify.dev/api/liquid/objects/collection).\n  This array supports pagination using the [paginate](https://shopify.dev/api/liquid/tags/paginate#paginate-paginating-setting-arrays) tag. You can also append `.count` to the [setting key](https://shopify.dev/themes/architecture/settings#access-settings) to return the number of collections in the array.\n- `blank` if no selection has been made, the selection isn't visible, or the selection no longer exists.\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/settings/input-settings#collection_list)\n",
            "body": {
              "type": "collection_list",
              "id": "$1",
              "label": "${1/([^_]+)(_*)/${1:/capitalize}${2:+ }/g}$2",
              "limit": "^$3"
            }
          },
          {
            "label": "Color",
            "markdownDescription": "A setting of type `color` outputs a color picker field. You can use these fields to capture a color selection for various theme elements, such as the body text color.\n\nWhen accessing the value of a color type setting, data is returned as one of the following:\n\n- A [color object](https://shopify.dev/api/liquid/objects/color).\n- `blank`, if no selection has been made.\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/settings/input-settings#color)\n",
            "body": {
              "type": "color",
              "id": "$1",
              "label": "${1/([^_]+)(_*)/${1:/capitalize}${2:+ }/g}$2",
              "default": "$3"
            }
          },
          {
            "label": "Color Scheme",
            "markdownDescription": "A setting of type `color_scheme` outputs a picker with all of the available theme color schemes, and a preview of the selected color scheme. Theme color schemes in the picker are defined using the [color_scheme_group](https://shopify.dev/docs/themes/architecture/settings/input-settings#color_scheme_group) setting. You can apply a color scheme to sections, blocks and general theme settings. Color scheme settings aren't supported in app blocks.\n\nFor example, the following setting generates the following output:\n\n```json\n{\n  \"type\": \"color_scheme\",\n  \"id\": \"color_scheme\",\n  \"default\": \"scheme_1\",\n  \"label\": \"Color Scheme\"\n}\n```\n\nWhen accessing the value of a `color_scheme` type setting, Shopify returns the selected `color_scheme` object from `color_scheme_group`.\n\nIf no value was entered, or the value was invalid, then the default value from `color_scheme` is returned. If the default value is also invalid, then the first `color_scheme` from `color_scheme_group` is returned.\n\nIf the theme doesn't have `color_scheme_group` data in `settings_data.json`, then [nil](https://shopify.dev/docs/api/liquid/basics/types#nil) is returned.\n\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/docs/themes/architecture/settings/input-settings#color_scheme)\n",
            "body": {
              "type": "color_scheme",
              "id": "$1",
              "label": "${1/([^_]+)(_*)/${1:/capitalize}${2:+ }/g}$2",
              "default": "$3"
            }
          },
          {
            "label": "Color Background",
            "markdownDescription": "A setting of type `color_background` outputs a text field for entering [CSS background](https://developer.mozilla.org/en-US/docs/Web/CSS/background) properties. You can use these fields to capture background settings for various theme elements, such as the store background.\n\n> **CAUTION**\n>\n> A Settings of type `color_background` do not support image related background properties.\n\nWhen accessing the value of a `color_background` type setting, data is returned as one of the following:\n\n- A [string](https://shopify.dev/api/liquid/basics/types#string).\n- [nil](https://shopify.dev/api/liquid/basics/types#nil), if nothing has been entered.\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/settings/input-settings#color_background)\n",
            "body": {
              "type": "color_background",
              "id": "$1",
              "label": "${1/([^_]+)(_*)/${1:/capitalize}${2:+ }/g}$2",
              "default": "$3"
            }
          },
          {
            "label": "Font Picker",
            "markdownDescription": "A setting of type `font_picker` outputs a font picker field that's automatically populated with fonts from the [Shopify font library](https://shopify.dev/themes/architecture/settings/fonts#shopify-font-library). This library includes web-safe fonts, a selection of Google Fonts, and fonts licensed by Monotype.\n\nYou can use these fields to capture a font selection for various theme elements, such as the base heading font.\n\nWhen accessing the value of a `font_picker` type setting, data is returned as a [font object](https://shopify.dev/api/liquid/objects/font).\n\n> **CAUTION**\n>\n> The `default` attribute is required. Failing to include it will result in an error. You can find the possible values through the [available fonts](https://shopify.dev/themes/architecture/settings/fonts#available-fonts) in the Shopify font library.\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/settings/input-settings#font_picker)\n",
            "body": {
              "type": "font_picker",
              "id": "$1",
              "label": "${1/([^_]+)(_*)/${1:/capitalize}${2:+ }/g}$2",
              "default": "$3"
            }
          },
          {
            "label": "HTML",
            "markdownDescription": "A setting of type `html` outputs a multi-line text field that accepts HTML markup. In addition to the [standard attributes](https://shopify.dev/themes/architecture/settings/input-settings#standard-attributes) of an input setting.\n\nYou can use these fields to capture custom blocks of HTML content, such as a video embed.\n\nThe following HTML tags will be automatically removed:\n\n```html\n<html>\n<head>\n<body>\n```\n\nWhen accessing the value of an `html` type setting, data is returned as one of the following:\n\n- A [string](https://shopify.dev/api/liquid/basics/types#string) that contains the entered content.\n- An [empty object](https://shopify.dev/api/liquid/basics/types#emptydrop), if nothing has been entered.\n\n> **NOTE**\n>\n> Unclosed HTML tags are automatically closed when the setting is saved. This may not line up with your intended formatting, so be sure to verify your input.\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/settings/input-settings#html)\n",
            "body": {
              "type": "html",
              "id": "$1",
              "label": "${1/([^_]+)(_*)/${1:/capitalize}${2:+ }/g}$2",
              "default": "$3"
            }
          },
          {
            "label": "Image Picker",
            "markdownDescription": "A setting of type `image_picker` outputs an image picker field that's automatically populated with the available images from the [Files](https://help.shopify.com/en/manual/shopify-admin/productivity-tools/file-uploads) section of Shopify admin, and has the option to upload new images. Merchants also have an opportunity to enter alt text and select a [focal point](https://shopify.dev/themes/architecture/settings/input-settings#image-focal-points) for their image.\n\nYou can use these fields to capture an image selection, such as logos, favicons, and slideshow images.\n\nWhen accessing the value of an `image_picker` type setting, data is returned as one of the following:\n\n- An [image object](https://shopify.dev/api/liquid/objects/image).\n- [nil](https://shopify.dev/api/liquid/basics/types#nil), if either no selection has been made or the selection no longer exists.\n\n> **NOTE**\n>\n> Settings of type `image_picker` are not updated when switching presets. `image_picker` settings also don't support the `default` attribute.\n\n**[Image focal points](https://shopify.dev/themes/architecture/settings/input-settings#image-focal-points)**\n\nImages selected using an `image_picker` setting support focal points. A focal point is a position in an image that the merchant wants to remain in view as the image is cropped and adjusted by the theme. Focal points can be set in the theme editor `image_picker` setting, or from the Files page.\n\nTo make sure that your theme respects the focal point of the image, do the following:\n\n- Render your images using the [image_tag](https://shopify.dev/api/liquid/filters/image_tag) filter.\n- Consider positioning images within containers using `object-fit: cover`.\n\nUsing `image_tag`, if a focal point was provided, then an `object-position` style is added to the image tag, with the value set to the focal point.\n\n**Input**\n\n```liquid\n\n{{ section.settings.image_with_text_image | image_url: width: 1500 | image_tag }}\n\n```\n\n**Output**\n\n```html\n\n<img src=\"octopus-tentacle.jpg?v=1&width=1500\" alt=\"My alt text\"\n srcset=\"octopus-tentacle.jpg?v=1&width=352 352w,\n         octopus-tentacle.jpg?v=1&width=832 832w,\n         octopus-tentacle.jpg?v=1&width=1200 1200w\"\n width=\"1500\" height=\"1875\"\n style=\"object-position:25% 10%;\">\n\n\n```\n\nIf you need override the `object-position` style for a specific use case, then pass a style: `object-position: inherit;` property to the `image_tag` filter.\n\n> **TIP**\n>\n> You can also access the focal point data using [image.presentation.focal_point](https://shopify.dev/api/liquid/objects/image_presentation#image_presentation-focal_point).\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/settings/input-settings#image_picker)\n",
            "body": {
              "type": "image_picker",
              "id": "$1",
              "label": "${1/([^_]+)(_*)/${1:/capitalize}${2:+ }/g}$2"
            }
          },
          {
            "label": "Inline Richtext",
            "markdownDescription": "A setting of type `inline_richtext` outputs HTML markup that isn't wrapped in paragraph tags (`<p>`). The setting includes the following basic formatting options:\n\n- Bold\n- Italic\n- Link\n\n> **NOTE**\n>\n> The `inline_richtext` setting doesn't support the following features:\n>\n> - Line breaks (`<br>`)\n> - An underline option in the rich text editor. Merchants can underline text using the `CMD`+`U` or `CTRL`+`U` keyboard shortcut.\n\nYou can use these fields to capture formatted text content, such as introductory brand content on the homepage.\n\nWhen accessing the value of a `inline_richtext` type setting, data is returned as one of the following:\n\n- A [string](https://shopify.dev/api/liquid/basics/types#string) that contains the entered content.\n- An [empty object](https://shopify.dev/api/liquid/basics/types#emptydrop), if nothing has been entered.\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/settings/input-settings#inline_richtext)\n",
            "body": {
              "type": "inline_richtext",
              "id": "$1",
              "label": "${1/([^_]+)(_*)/${1:/capitalize}${2:+ }/g}$2"
            }
          },
          {
            "label": "Link List",
            "markdownDescription": "A setting of type `link_list` outputs a menu picker field that's automatically populated with the available menus for the store. You can use these fields to capture a menu selection, such as the menu to use for footer links.\n\nWhen accessing the value of a link_list type setting, data is returned as one of the following:\n\n- A [linklist object](https://shopify.dev/api/liquid/objects/linklist).\n- `blank`, if either no selection has been made or the selection no longer exists.\n\n> **NOTE**\n>\n> Accepted values for the `default` attribute are `main-menu` and `footer`.\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/settings/input-settings#link_list)\n",
            "body": {
              "type": "link_list",
              "id": "$1",
              "label": "${1/([^_]+)(_*)/${1:/capitalize}${2:+ }/g}$2"
            }
          },
          {
            "label": "Liquid",
            "markdownDescription": "A setting of type `liquid` outputs a multi-line text field that accepts HTML and **[limited](https://shopify.dev/themes/architecture/settings/input-settings#limitations)** Liquid markup. You can use these fields to capture custom blocks of HTML and Liquid content, such as a product-specific message. Merchants can also use a liquid setting to add the code needed to integrate certain types of [apps](https://shopify.dev/apps/online-store) into your theme.\n\nWhen accessing the value of a `liquid` type setting, data is returned as one of the following:\n\n- A [string](https://shopify.dev/api/liquid/basics/types#string) that contains the entered content.\n- An [empty object](https://shopify.dev/api/liquid/basics/types#emptydrop), if nothing has been entered.\n\n> **NOTE**\n>\n> The `default` attribute is optional. However, if you use it, then its value can't be an empty string. Additionally, unclosed HTML tags are automatically closed when the setting is saved. This might not line up with your intended formatting, so be sure to verify your input.\n\n**[Limitations](https://shopify.dev/themes/architecture/settings/input-settings#limitations)**\n\nSettings of type `liquid` don't have access to the following liquid objects/tags:\n\n- [layout](https://shopify.dev/api/liquid/tags/layout)\n- [content_for_header](https://shopify.dev/api/liquid/objects/content_for_header)\n- [content_for_layout](https://shopify.dev/api/liquid/objects/content_for_layout)\n- [content_for_index](https://shopify.dev/api/liquid/objects/content_for_index)\n- [section](https://shopify.dev/api/liquid/tags/section)\n- [javascript](https://shopify.dev/themes/architecture/sections/section-assets#javascript)\n- [stylesheet](https://shopify.dev/themes/architecture/sections/section-assets#stylesheet)\n- [schema](https://shopify.dev/themes/architecture/sections/section-schema)\n- [settings](https://shopify.dev/api/liquid/objects/settings)\n\nHowever, liquid settings can access the following:\n\n- [Global Liquid objects](https://shopify.dev/api/liquid/objects)\n- Template specific objects like `collection`, `product`, etc. (within their respective templates)\n- Standard Liquid [tags](https://shopify.dev/api/liquid/tags) and [filters](https://shopify.dev/api/liquid/filters)\n\nIf your content includes non-existent, or empty, Liquid tags, then they will be rendered as empty strings. For example, the following setting generates the following output:\n\n**Setting**\n\n```json\n{\n  \"type\": \"liquid\",\n  \"id\": \"message\",\n  \"label\": \"Message\",\n  \"default\": \"Hello {{ not_a_real_tag }}, welcome to our shop.\"\n}\n```\n\n**Output**\n\n```\nHello , welcome to our shop.\n```\n\n> **CAUTION**\n>\n> Content entered in these settings can't exceed 50kb. Saving content that either exceeds this limit or includes invalid Liquid will result in an error.\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/settings/input-settings#liquid)\n",
            "body": {
              "type": "liquid",
              "id": "$1",
              "label": "${1/([^_]+)(_*)/${1:/capitalize}${2:+ }/g}$2"
            }
          },
          {
            "label": "Page",
            "markdownDescription": "A setting of type `page` outputs a page picker field that's automatically populated with the available pages for the store. You can use these fields to capture a page selection, such as the page to feature content for in a size-chart display.\n\nWhen accessing the value of a `page` type setting, data is returned as one of the following:\n\n- A [page object](https://shopify.dev/api/liquid/objects/page).\n  To ensure backwards compatibility with [legacy resource-based settings](https://shopify.dev/themes/architecture/settings#legacy-resource-based-settings), outputting the setting directly will return the object's handle.\n- `blank`, if no selection has been made, the selection isn't visible, or the selection no longer exists.\n\n> **NOTE**\n>\n> Settings of type page are not updated when switching presets. `page` settings also don't support the `default` attribute.\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/settings/input-settings#page)\n\n",
            "body": {
              "type": "page",
              "id": "$1",
              "label": "${1/([^_]+)(_*)/${1:/capitalize}${2:+ }/g}$2"
            }
          },
          {
            "label": "Product",
            "markdownDescription": "A setting of type `product` outputs a product picker field that's automatically populated with the available products for the store. You can use these fields to capture a product selection, such as the product to feature on the homepage.\n\n- A [product object](https://shopify.dev/api/liquid/objects/product).\n  To ensure backwards compatibility with [legacy resource-based settings](https://shopify.dev/themes/architecture/settings#legacy-resource-based-settings), outputting the setting directly will return the object's handle.\n- `blank`, if no selection has been made, the selection isn't visible, or the selection no longer exists.\n\n> **NOTE**\n>\n> Settings of type product are not updated when switching presets. `product` settings also don't support the `default` attribute.\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/settings/input-settings#product)\n",
            "body": {
              "type": "product",
              "id": "$1",
              "label": "${1/([^_]+)(_*)/${1:/capitalize}${2:+ }/g}$2"
            }
          },
          {
            "label": "Product List",
            "markdownDescription": "A setting of type `product_list` outputs a product picker field that's automatically populated with the available products for the store. You can use these fields to capture multiple products, such as a group of products to feature on the homepage.\n\nWhen accessing the value of a `product_list` type setting, data is returned as one of the following:\n\n- An array of [product objects](https://shopify.dev/api/liquid/objects/product).\n  This array supports pagination using the [paginate](https://shopify.dev/api/liquid/tags/paginate#paginate-paginating-setting-arrays) tag. You can also append `.count` to the [setting key](https://shopify.dev/themes/architecture/settings#access-settings) to return the number of products in the array.\n- `blank` if no selection has been made, the selection isn't visible, or the selection no longer exists.\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/settings/input-settings#product_list)\n\n",
            "body": {
              "type": "product_list",
              "id": "$1",
              "label": "${1/([^_]+)(_*)/${1:/capitalize}${2:+ }/g}$2",
              "limit": "^$3"
            }
          },
          {
            "label": "Richtext",
            "markdownDescription": "A setting of type `richtext` outputs a multi-line text field with the following basic formatting options:\n\n- Bold\n- Italic\n- Underline\n- Link\n- Paragraph\n- Unordered list\n\n> **NOTE**\n>\n> No underline option appears in the rich text component. Merchants can underline text using the `CMD`+`U` or `CTRL`+`U` keyboard shortcut.\n\nYou can use these fields to capture formatted text content, such as introductory brand content on the homepage.\n\nWhen accessing the value of a richtext type setting, data is returned as one of the following:\n\n- A [string](https://shopify.dev/api/liquid/basics/types#string) that contains the entered content.\n- An [empty object](https://shopify.dev/api/liquid/basics/types#emptydrop), if nothing has been entered.\n\n**[default](https://shopify.dev/themes/architecture/settings/input-settings#default)**\n\nThe `default` attribute isn't required. However, if it's used, then only `<p>` or `<ul>` tags are supported as top-level elements.\n\nThe following HTML tags are also supported inside the parent `<p>` tag:\n\n```html\n- <p>\n- <br>\n- <strong>\n- <b>\n- <em>\n- <i>\n- <u>\n- <span>\n- <a>\n```\n\n> **CAUTION**\n>\n> Failing to wrap the default content in `<p>` or `<ul>` tags will result in an error.\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/settings/input-settings#richtext)\n",
            "body": {
              "type": "richtext",
              "id": "$1",
              "label": "${1/([^_]+)(_*)/${1:/capitalize}${2:+ }/g}$2"
            }
          },
          {
            "label": "URL",
            "markdownDescription": "A setting of type `url` outputs a URL entry field where you can manually enter external URLs and relative paths. It also has a picker that's automatically populated with the following available resources for the shop:\n\n- Articles\n- Blogs\n- Collections\n- Pages\n- Products\n\n> _You can use these fields to capture a URL selection, such as the URL to use for a slideshow button link._\n\nWhen accessing the value of a url type setting, data is returned as one of the following:\n\n- A [string](https://shopify.dev/api/liquid/basics/types#string) that contains the selected URL.\n- [nil](https://shopify.dev/api/liquid/basics/types#nil), if nothing has been entered.\n\n> **NOTE**\n>\n> Accepted values for the `default` attribute are `/collections` and `/collections/all`.\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/settings/input-settings#url)\n",
            "body": {
              "type": "url",
              "id": "$1",
              "label": "${1/([^_]+)(_*)/${1:/capitalize}${2:+ }/g}$2"
            }
          },
          {
            "label": "Video",
            "markdownDescription": "A setting of type `video` outputs a video picker that's automatically populated with the available videos from the [Files](https://help.shopify.com/en/manual/shopify-admin/productivity-tools/file-uploads) section of the Shopify admin. The merchant also has the option to upload new videos.\n\n> _The `video` type setting also accepts metafields of type `file_reference` as a [dynamic source](https://shopify.dev/themes/architecture/settings#dynamic-sources)._\n\nWhen accessing the value of a `video` type setting, data is returned as one of the following:\n\n- A [video object](https://shopify.dev/api/liquid/objects#video).\n- `nil`, if:\n  - no selection has been made,\n  - the selection no longer exists, or\n  - the selection is a `file_reference` metafield that points to a non-video file.\n\n> **NOTE**\n>\n> `video` settings don't support the `default` attribute.\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/settings/input-settings#video)\n",
            "body": {
              "type": "video",
              "id": "$1",
              "label": "${1/([^_]+)(_*)/${1:/capitalize}${2:+ }/g}$2"
            }
          },
          {
            "label": "Video URL",
            "markdownDescription": "A setting of type `video_url` outputs a URL entry field. In addition to the [standard attributes](https://shopify.dev/themes/architecture/settings/input-settings#standard-attributes) of an input setting.\n\nWhen accessing the value of a video_url type setting, data is returned as one of the following:\n\n- A [string](https://shopify.dev/api/liquid/basics/types#string) that contains the entered URL.\n- `nil`, if nothing has been entered.\n\nAdditionally, there's access to the `id` and `type` (YouTube or Vimeo) of the video.\n\nFor example, assuming you're using [this video](https://www.youtube.com/watch?v=_9VUPq3SxOc) with the above setting, the following Liquid generates the following output:\n\n**Setting**\n\n```liquid\n\nID: {{ settings.product_description_video.id }}\nType: {{ settings.product_description_video.type }}\n\n```\n\n**Output**\n\n```\n\nID: _9VUPq3SxOc\nType: youtube\n\n```\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/settings/input-settings#video_url)\n",
            "body": {
              "type": "video_url",
              "id": "$1",
              "label": "${1/([^_]+)(_*)/${1:/capitalize}${2:+ }/g}$2",
              "accepts": [
                "^3"
              ]
            }
          }
        ]
      }
    },
    "block_name": {
      "title": "Block Name",
      "markdownDescription": "The block name which is used as the merchants label",
      "oneOf": [
        {
          "type": "string"
        },
        {
          "$ref": "#/definitions/languages"
        }
      ]
    },
    "block_type": {
      "type": "string",
      "title": "Block Type",
      "markdownDescription": "A block's type may be any value set by the theme developer."
    },
    "block_limit": {
      "type": "number",
      "title": "Limit",
      "minimum": 1,
      "markdownDescription": "By default, a merchant can add the same block to a section multiple times. If required, you can set a limit for a block so that it can only be added up to a certain number of times."
    },
    "blocks": {
      "$comment": "Shared Section Schema $ref (references) and inserted dynamically via the JSON language server. This is why the if, then and else chains are applied. When \"schema\" file globs are provided in liquidrc or workspace settings, the vscode extension will insert the additional schemas required",
      "type": "array",
      "title": "Blocks",
      "markdownDescription": "You can create blocks for a section. Blocks are reusable modules of content that can be added, removed, and reordered within a section.\n\nBlocks have the following attributes:\n\n**`type`** (required)\n\n> The block type. This is a free-form string that you can use as an identifier. You can access this value through the `type` attribute of the [block object](https://shopify.dev/api/liquid/objects/block#block-type).\n\n**`name`** (required)\n\n> The block name, which will show as the block title in the theme editor.\n\n**`limit`**\n\n> The number of blocks of this type that can be used.\n\n**`settings`**\n\n> Any [input](https://shopify.dev/themes/architecture/settings/input-settings) or [sidebar](https://shopify.dev/themes/architecture/settings/sidebar-settings) settings that you want for the block. Certain settings might be used as the [title of the block in the theme editor.](https://shopify.dev/themes/architecture/sections/section-schema#show-dynamic-block-titles-in-the-theme-editor)\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/sections/section-schema#blocks)\n",
      "items": {
        "type": "object",
        "defaultSnippets": [
          {
            "label": "$ref",
            "markdownDescription": "> **This capability is for developers leveraging [Syncify](https://github.com/panoply/syncify). If you are not using Syncify then please consider adopting it as an alternative to the Shopify CLI.**\n>\n> Use [Syncify](https://github.com/panoply/syncify) for theme development and take advantage of Shared Section Schema files plus a ton of essential features that will empower your productivity. Support open source tools that are created, maintained and backed by developers for developers.\n\n---\n\nProvide a key identifier and either a schema setting/block (object) or array of settings/blocks. In your `{% schema %}` tag, you can import the shared schema using a `$ref` property key. The `$ref` property value **requires** you to pass the shared schema filename (without the `.json` extension) followed by a `.` and then the shared schema property key.\n\n**Example**\n\nSay (for example) your shared schema file is named `foo.json` and contains the following:\n\n```json\n{\n  \"hero_image\": {\n    \"type\": \"image_picker\",\n    \"id\": \"hero\",\n    \"label\": \"Some Hero\"\n  },\n  \"hero_caption\": {\n    \"type\": \"text\",\n    \"id\": \"caption\",\n    \"label\": \"Caption\",\n    \"default\": \"Some Caption\"\n  }\n}\n```\n\nYou can inject the `hero_image` and `hero_caption` schema into any section, and also overwrite the `id`, `label` etc. In the below example, we inject the `hero_image` and apply an overwrite to the `hero_caption`.\n\n```liquid\n{% schema %}\n{\n  \"name\": \"tester\",\n  \"class\": \"example\",\n  \"tag\": \"section\",\n  \"settings\": [\n    {\n      \"ref\": \"foo.hero_image\"\n    },\n    {\n      \"ref\": \"foo.hero_caption\",\n      \"label\": \"New Caption\",\n      \"default\": \"xxx\"\n    }\n  ]\n}\n{% endschema %}\n```",
            "body": {
              "${1|$ref|}": "^$2"
            }
          },
          {
            "label": "Block",
            "markdownDescription": "You can create blocks for a section. Blocks are reusable modules of content that can be added, removed, and reordered within a section.\n\nBlocks have the following attributes:\n\n**`type`** (required)\n\n> The block type. This is a free-form string that you can use as an identifier. You can access this value through the `type` attribute of the [block object](https://shopify.dev/api/liquid/objects/block#block-type).\n\n**`name`** (required)\n\n> The block name, which will show as the block title in the theme editor.\n\n**`limit`**\n\n> The number of blocks of this type that can be used.\n\n**`settings`**\n\n> Any [input](https://shopify.dev/themes/architecture/settings/input-settings) or [sidebar](https://shopify.dev/themes/architecture/settings/sidebar-settings) settings that you want for the block. Certain settings might be used as the [title of the block in the theme editor.](https://shopify.dev/themes/architecture/sections/section-schema#show-dynamic-block-titles-in-the-theme-editor)\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/sections/section-schema#blocks)\n",
            "body": {
              "name": "$1",
              "type": "$2",
              "settings": [
                "^$3"
              ]
            }
          },
          {
            "label": "Block with Limit",
            "markdownDescription": "You can create blocks for a section. Blocks are reusable modules of content that can be added, removed, and reordered within a section.\n\nBlocks have the following attributes:\n\n**`type`** (required)\n\n> The block type. This is a free-form string that you can use as an identifier. You can access this value through the `type` attribute of the [block object](https://shopify.dev/api/liquid/objects/block#block-type).\n\n**`name`** (required)\n\n> The block name, which will show as the block title in the theme editor.\n\n**`limit`**\n\n> The number of blocks of this type that can be used.\n\n**`settings`**\n\n> Any [input](https://shopify.dev/themes/architecture/settings/input-settings) or [sidebar](https://shopify.dev/themes/architecture/settings/sidebar-settings) settings that you want for the block. Certain settings might be used as the [title of the block in the theme editor.](https://shopify.dev/themes/architecture/sections/section-schema#show-dynamic-block-titles-in-the-theme-editor)\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/sections/section-schema#blocks)\n",
            "body": {
              "name": "$1",
              "type": "$2",
              "limit": "^$3",
              "settings": [
                "^$4"
              ]
            }
          }
        ],
        "properties": {
          "name": {
            "$ref": "#/definitions/block_name"
          },
          "type": {
            "$ref": "#/definitions/block_type"
          }
        },
        "if": {
          "required": [
            "type"
          ],
          "type": "object",
          "properties": {
            "type": {
              "type": "string"
            }
          }
        },
        "then": {
          "type": "object",
          "required": [
            "type",
            "name"
          ],
          "properties": {
            "name": {
              "$ref": "#/definitions/block_name"
            },
            "limit": {
              "$ref": "#/definitions/block_limit"
            },
            "settings": {
              "$ref": "#/definitions/settings"
            }
          }
        },
        "else": {
          "if": {
            "required": [
              "name"
            ],
            "type": "object",
            "properties": {
              "name": {
                "type": "string"
              }
            }
          },
          "then": {
            "type": "object",
            "required": [
              "type",
              "name"
            ],
            "properties": {
              "type": {
                "$ref": "#/definitions/block_type"
              },
              "limit": {
                "$ref": "#/definitions/block_limit"
              },
              "settings": {
                "$ref": "#/definitions/settings"
              }
            }
          },
          "else": {
            "required": [],
            "$ref": "#/definitions/shared_blocks"
          }
        }
      }
    },
    "default": {
      "type": "array",
      "title": "Default",
      "markdownDescription": "If you statically render a section, then you can define a default configuration with the `default` object, which has the same attributes as the [preset object](https://shopify.dev/themes/architecture/sections/section-schema#presets).\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/sections/section-schema#default)\n",
      "items": {
        "type": "object",
        "required": [
          "name"
        ],
        "properties": {
          "name": {
            "title": "Name",
            "markdownDescription": "The default name, which will show in the Add section portion of the theme editor.",
            "type": [
              "string",
              "object"
            ]
          },
          "settings": {
            "type": "object",
            "title": "Settings",
            "markdownDescription": "A list of default values for any settings you might want to populate. Each entry should include the setting name and the value."
          },
          "blocks": {
            "type": "array",
            "markdownDescription": "A list of default blocks that you might want to include. Each entry should be an object with attributes of type and settings. The type attribute value should reflect the type of the block that you want to include, and the settings object should be in the same format as the settings attribute above.",
            "items": {
              "type": "object"
            }
          }
        }
      }
    },
    "presets": {
      "type": "array",
      "title": "Presets",
      "markdownDescription": "Presets are default configurations of sections that enable merchants to easily add a section to a [JSON template](https://shopify.dev/themes/architecture/templates/json-templates) through the theme editor. Presets aren't related to [theme styles](https://shopify.dev/themes/architecture/config/settings-data-json#theme-styles) that are defined in `settings_data.json`.\n\nThe presets object has the following attributes:\n\n**`name`** (required)\n\n> The preset name, which will show in the Add section portion of the theme editor.\n\n**`settings`**\n\n> A list of default values for any settings you might want to populate. Each entry should include the setting name and the value.\n\n**`blocks`**\n\n> A list of default blocks that you might want to include. Each entry should be an object with attributes of `type` and `settings`. The type attribute value should reflect the type of the block that you want to include, and the `settings` object should be in the same format as the `settings` attribute above.\n\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/sections/section-schema#presets)\n",
      "items": {
        "type": "object",
        "required": [
          "name"
        ],
        "properties": {
          "name": {
            "title": "Name",
            "markdownDescription": "The preset name, which will show in the Add section portion of the theme editor.",
            "default": "",
            "oneOf": [
              {
                "type": "string"
              },
              {
                "$ref": "#/definitions/languages"
              }
            ]
          },
          "settings": {
            "type": "object",
            "title": "Settings",
            "markdownDescription": "A list of default values for any settings you might want to populate. Each entry should include the setting name and the value."
          },
          "blocks": {
            "type": "array",
            "markdownDescription": "A list of default blocks that you might want to include. Each entry should be an object with attributes of type and settings. The type attribute value should reflect the type of the block that you want to include, and the settings object should be in the same format as the settings attribute above.",
            "items": {
              "type": "object"
            }
          }
        }
      }
    },
    "templates": {
      "title": "Templates",
      "markdownDescription": "You can restrict a section to certain templates by specifying those templates through the `templates` attribute. This attribute accepts a list of strings that represent the [page type](https://shopify.dev/api/liquid/objects/request#request-page_type).\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/sections/section-schema#templates)\n",
      "type": "array",
      "uniqueItems": true,
      "items": {
        "type": "string",
        "enum": [
          "404",
          "article",
          "blog",
          "cart",
          "collection",
          "list-collections",
          "customers/account",
          "customers/activate_account",
          "customers/addresses",
          "customers/login",
          "customers/order",
          "customers/register",
          "customers/reset_password",
          "gift_card",
          "index",
          "page",
          "password",
          "policy",
          "product",
          "search"
        ]
      }
    },
    "locales": {
      "type": "object",
      "title": "Locales",
      "markdownDescription": "Sections can provide their own set of translated strings through the `locales` object. This is separate from the `locales` directory of the theme, which makes it a useful feature for sections that are meant to be installed on multiple themes or shops.\n\nThe `locales` object has the following general format:\n\n```json\n\n{\n  \"locales\": {\n    \"language\": {\n      \"translation_key\": \"translation_value\"\n    }\n  }\n}\n\n```\n\n**Example**\n\n```liquid\n\n{% schema %}\n{\n  \"name\": \"Slideshow\",\n  \"class\": \"slideshow\",\n  \"settings\": [\n    {\n      \"type\": \"text\",\n      \"id\": \"title\",\n      \"label\": \"Slideshow\"\n    }\n  ],\n  \"locales\": {\n    \"en\": {\n      \"title\": \"Slideshow\"\n    },\n    \"fr\": {\n      \"title\": \"Diaporama\"\n    }\n  }\n}\n{% endschema %}\n\n```\n\nAny translations will show up under the Sections tab of the language editor for merchants to edit. When edits are made, the changes are saved directly to the applicable locale file, and the section schema is unchanged.\n\nThese translations can be accessed through the Liquid [translation filter](https://shopify.dev/api/liquid/filters/translate) (`t` filter) where the key will be in the following format:\n\n```\nsections.[section-name].[translation-description]\n```\n\nFor example, if you want to reference the title translation from the example above, then use the following:\n\n```liquid\n{{ 'sections.slideshow.title' | t }}\n```\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/sections/section-schema#locales)\n",
      "properties": {
        "af": {
          "type": "object",
          "markdownDescription": "Afrikaans (Afrikaans)"
        },
        "ar": {
          "type": "object",
          "markdownDescription": "Arabic (العربية)"
        },
        "az": {
          "type": "object",
          "markdownDescription": "Azerbaijani (Azərbaycan­lı)"
        },
        "be": {
          "type": "object",
          "markdownDescription": "Belarusian (беларуская)"
        },
        "bg": {
          "type": "object",
          "markdownDescription": "Bulgarian (български)"
        },
        "bs": {
          "type": "object",
          "markdownDescription": "Bosnian (bosanski/босански)"
        },
        "cs": {
          "type": "object",
          "markdownDescription": "Czech (čeština)"
        },
        "cy": {
          "type": "object",
          "markdownDescription": "Welsh (Cymraeg)"
        },
        "da": {
          "type": "object",
          "markdownDescription": "Danish (dansk)"
        },
        "de": {
          "type": "object",
          "markdownDescription": "German (Deutsch)"
        },
        "el": {
          "type": "object",
          "markdownDescription": "Greek (ελληνικά)"
        },
        "en": {
          "type": "object",
          "markdownDescription": "English"
        },
        "es": {
          "type": "object",
          "markdownDescription": "Spanish (español)"
        },
        "et": {
          "type": "object",
          "markdownDescription": "Estonian (eesti)"
        },
        "fa": {
          "type": "object",
          "markdownDescription": "Persian (فارسى)"
        },
        "fi": {
          "type": "object",
          "markdownDescription": "Finnish (suomi)"
        },
        "fr": {
          "type": "object",
          "markdownDescription": "French (français)"
        },
        "fy": {
          "type": "object",
          "markdownDescription": "Frisian (Frysk)"
        },
        "he": {
          "type": "object",
          "markdownDescription": "Hebrew (עברית)"
        },
        "hr": {
          "type": "object",
          "markdownDescription": "Croatian (hrvatski)"
        },
        "hi": {
          "type": "object",
          "markdownDescription": "Hindi (हिंदी)"
        },
        "hu": {
          "type": "object",
          "markdownDescription": "Hungarian (magyar)"
        },
        "id": {
          "type": "object",
          "markdownDescription": "Indonesian (Bahasa Indonesia)"
        },
        "is": {
          "type": "object",
          "markdownDescription": "Icelandic (íslenska)"
        },
        "lv": {
          "type": "object",
          "markdownDescription": "Latvian (latviešu)"
        },
        "nl": {
          "type": "object",
          "markdownDescription": "Dutch (Nederlands)"
        },
        "no": {
          "type": "object",
          "markdownDescription": "Norwegian (norsk)"
        },
        "it": {
          "type": "object",
          "markdownDescription": "Italian (italiano)"
        },
        "ja": {
          "type": "object",
          "markdownDescription": "Japanese (日本語)"
        },
        "ko": {
          "type": "object",
          "markdownDescription": "Korean (한국어/韓國語)"
        },
        "lb": {
          "type": "object",
          "markdownDescription": "Luxembourgish (Lëtzebuergesch)"
        },
        "lt": {
          "type": "object",
          "markdownDescription": "Lithuanian (lietuvių)"
        },
        "mk": {
          "type": "object",
          "markdownDescription": "Macedonian (македонски јазик)"
        },
        "pa": {
          "type": "object",
          "markdownDescription": "Punjabi (ਪੰਜਾਬੀ)"
        },
        "pl": {
          "type": "object",
          "markdownDescription": "Polish (polski)"
        },
        "pt": {
          "type": "object",
          "markdownDescription": "Portuguese (Português)"
        },
        "ro": {
          "type": "object",
          "markdownDescription": "Romanian (română)"
        },
        "ru": {
          "type": "object",
          "markdownDescription": "Russian (русский)"
        },
        "si": {
          "type": "object",
          "markdownDescription": "Sinhala (සිංහල)"
        },
        "sl": {
          "type": "object",
          "markdownDescription": "Albanian (shqipe)"
        },
        "sk": {
          "type": "object",
          "markdownDescription": "Slovak (slovenčina)"
        },
        "sq": {
          "type": "object",
          "markdownDescription": "Slovenian (slovenski)"
        },
        "sv": {
          "type": "object",
          "markdownDescription": "Swedish (svenska)"
        },
        "ta": {
          "type": "object",
          "markdownDescription": "Tamil (தமிழ்)"
        },
        "th": {
          "type": "object",
          "markdownDescription": "Thai (ไทย)"
        },
        "tr": {
          "type": "object",
          "markdownDescription": "Turkish (Türkçe)"
        },
        "zh": {
          "type": "object",
          "markdownDescription": "Chinese (中文)"
        },
        "uk": {
          "type": "object",
          "markdownDescription": "Ukrainian (українська)"
        },
        "vi": {
          "type": "object",
          "markdownDescription": "Vietnamese (Tiếng Việt/㗂越)"
        }
      }
    },
    "tag": {
      "title": "Tag",
      "markdownDescription": "By default, when Shopify renders a section, it’s wrapped in a `<div>` element with a unique id attribute:\n\n```html\n\n<div id=\"shopify-section-[id]\" class=\"shopify-section\">\n  <!-- Output of the section content -->\n</div>\n\n```\n\nIf you don’t want to use a `<div>`, then you can specify which kind of HTML element to use with the tag attribute. The following are the accepted values:\n\n- `article`\n- `aside`\n- `div`\n- `footer`\n- `header`\n- `section`\n\nFor example, the following schema settings returns the following output:\n\n**Example**\n\n```liquid\n\n{% schema %}\n{\n  \"name\": \"Slideshow\",\n  \"tag\": \"section\"\n}\n{% endschema %}\n\n```\n\n**Output**\n\n```html\n\n<section id=\"shopify-section-[id]\" class=\"shopify-section\">\n   <!-- Output of the section content -->\n</section>\n\n```\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/sections/section-schema#tag)\n",
      "type": "string",
      "enum": [
        "article",
        "aside",
        "div",
        "footer",
        "header",
        "section"
      ]
    },
    "text_alignment": {
      "type": "object",
      "properties": {
        "default": {
          "type": "string",
          "default": "left",
          "enum": [
            "left",
            "center",
            "right"
          ]
        }
      }
    },
    "enabled_on": {
      "title": "Enabled On",
      "markdownDescription": "You can restrict a section to certain template page types and section group types by specifying them through the `enabled_on` attribute.\n\n`enabled_on`, along with `disabled_on`, replaces the templates attribute.\n\n> **CAUTION**\n>\n> You can use only one of `enabled_on` or [`disabled_on`](https://shopify.dev/docs/themes/architecture/sections/section-schema#disabled_on).\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/docs/themes/architecture/sections/section-schema#enabled_on)\n",
      "type": "object",
      "properties": {
        "templates": {
          "title": "Templates",
          "markdownDescription": "A list of the template page types where the section can be used.",
          "type": "array",
          "uniqueItems": true,
          "items": {
            "type": "string",
            "enum": [
              "*",
              "404",
              "article",
              "blog",
              "cart",
              "collection",
              "list-collections",
              "customers/account",
              "customers/activate_account",
              "customers/addresses",
              "customers/login",
              "customers/order",
              "customers/register",
              "customers/reset_password",
              "gift_card",
              "index",
              "page",
              "password",
              "policy",
              "product",
              "search"
            ]
          }
        },
        "groups": {
          "title": "Groups",
          "markdownDescription": "A list of the section groups where the section can be used.",
          "type": "array",
          "uniqueItems": true,
          "items": {
            "type": "string",
            "enum": [
              "header",
              "footer",
              "aside"
            ]
          }
        }
      }
    },
    "disabled_on": {
      "title": "Disabled On",
      "markdownDescription": "You can prevent a section from being used on certain template page types and section group types by setting them in the `disabled_on` attribute. When you use `disabled_on`, the section is available to all templates and section groups except the ones that you specified.\n\n`disabled_on`, along with `enabled_on`, replaces the `templates` attribute.\n\n> **CAUTION**\n>\n> You can use only one of [`disabled_on`](https://shopify.dev/docs/themes/architecture/sections/section-schema#disabled_on). or `disabled_on`\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/docs/themes/architecture/sections/section-schema#disabled_on)",
      "type": "object",
      "properties": {
        "templates": {
          "title": "Templates",
          "markdownDescription": "A list of the template page types where the section can't be used.",
          "type": "array",
          "uniqueItems": true,
          "items": {
            "type": "string",
            "enum": [
              "*",
              "404",
              "article",
              "blog",
              "cart",
              "collection",
              "list-collections",
              "customers/account",
              "customers/activate_account",
              "customers/addresses",
              "customers/login",
              "customers/order",
              "customers/register",
              "customers/reset_password",
              "gift_card",
              "index",
              "page",
              "password",
              "policy",
              "product",
              "search"
            ]
          }
        },
        "groups": {
          "title": "Groups",
          "markdownDescription": "A list of the section groups where the section can't be used.",
          "type": "array",
          "uniqueItems": true,
          "items": {
            "type": "string",
            "enum": [
              "*",
              "header",
              "footer",
              "aside"
            ]
          }
        }
      }
    }
  },
  "type": "object",
  "title": "Shopify Section Schema",
  "markdownDescription": "Shopify schema store reference for the schema Liquid tag used in Shopify themes.",
  "additionalProperties": false,
  "required": [
    "name"
  ],
  "properties": {
    "name": {
      "title": "Name",
      "markdownDescription": "The name attribute determines the section title that is shown in the theme editor.\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/sections/section-schema#name)\n",
      "oneOf": [
        {
          "type": "string"
        },
        {
          "$ref": "#/definitions/languages"
        }
      ]
    },
    "class": {
      "title": "Class",
      "markdownDescription": "When Shopify renders a section, it’s wrapped in an HTML element with a class of `shopify-section`. You can add to that class with the `class` attribute:\n\n**Example**\n\n```liquid\n\n{% schema %}\n{\n  \"name\": \"Slideshow\",\n  \"tag\": \"section\",\n  \"class\": \"slideshow\"\n}\n{% endschema %}\n\n```\n\n**Output**\n\n```html\n\n<section id=\"shopify-section-[id]\" class=\"shopify-section slideshow\">\n  <!-- Output of the section content -->\n</section>\n\n```\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/sections/section-schema#class)\n",
      "type": "string"
    },
    "tag": {
      "$ref": "#/definitions/tag"
    },
    "enabled_on": {
      "$ref": "#/definitions/enabled_on"
    },
    "disabled_on": {
      "$ref": "#/definitions/disabled_on"
    },
    "max_blocks": {
      "title": "Limit",
      "markdownDescription": "There’s a limit of 50 blocks per section. You can specify a lower limit with the `max_blocks` attribute:\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/sections/section-schema#max_blocks)\n",
      "type": "number",
      "minimum": 1,
      "maximum": 50
    },
    "templates": {
      "$ref": "#/definitions/templates"
    },
    "limit": {
      "title": "Limit",
      "markdownDescription": "By default, there's no limit to how many times a section can be added to a template. You can specify a limit of 1 or 2 with the `limit` attribute:\n\n**Example**\n\n```liquid\n\n{% schema %}\n{\n  \"name\": \"Slideshow\",\n  \"tag\": \"section\",\n  \"class\": \"slideshow\",\n  \"limit\": 1\n}\n{% endschema %}\n\n```\n\n#\n\n---\n\n[Shopify Documentation](https://shopify.dev/themes/architecture/sections/section-schema#limit)\n",
      "type": "number"
    },
    "settings": {
      "$ref": "#/definitions/settings"
    },
    "blocks": {
      "$ref": "#/definitions/blocks"
    },
    "presets": {
      "$ref": "#/definitions/presets"
    },
    "default": {
      "$ref": "#/definitions/default"
    },
    "locales": {
      "$ref": "#/definitions/locales"
    }
  }
}