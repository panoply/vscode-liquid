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

## [1.6.5]

**bold**
*italic*

<small>Example</small>

- Hello world
- Code inline `{% test %}` and `{% test %}` syntax.

