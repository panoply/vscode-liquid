---
author: "John Smith"
layout: "foobar"
permalink: "/"
layout: default
foo:
 - bar: test
 - foo: bar
 - jekyll: frontmatter
---

# Example

{%- for taggg in collection.all_tags -%}
  {%- if current_tags contains taggg -%}
    {{ current_tags.tag | link_to_remove_tag: taggg }}
  {%- else -%}
    {{ current_tags.tag | link_to_add_tag: tag }}
  {%- endif -%}
{%- endfor -%}

## [1.6.5] –
<small>10/05/2019</small>

- Minor overhaul on syntax definitions, leverages variable tags.
- Fixes Shopfy `{% javascript %}` and `{% schema %}` syntax highlighting.
- Make new literal string highlighting injection more sane
- Format tmLanguage, bring sanity to the ever growing file.

