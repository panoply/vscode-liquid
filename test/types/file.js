import Banner from "banner"
import state from "state"

{% - for tag in collection.all_tags -%}
{% - if current_tags contains tag -%}
{ { current_tags.tag | link_to_remove_tag: tag } }
{% - else -%}
{ { current_tags.tag | link_to_add_tag: tag } }
{% - endif -%}
{% - endfor -%}


m.render(root, {
  view() {

    // Template Literal
    return liquid`

      {%- for tag in collection.all_tags -%}
        {%- if current_tags contains tag -%}
          {{ current_tags.tag | link_to_remove_tag: tag }}
        {%- else -%}
          {{ current_tags.tag | link_to_add_tag: tag }}
        {%- endif -%}
      {%- endfor -%}

    `
  }
})

/* liquid */

{% if condition %}
{ { current_tags.tag | link_to_remove_tag: taggg } }
{% endif %}


/* endliquid */



const testt = {{ settings.color_body_text | t }};
const test = {
  foo: {{ foo | replace: 'hello', 'world' }},
bar: { { - 'general.meta.page' | page: current_page | json -} }
}

export default {
  onLoad() {

    { { - 'general.meta.page' | page: current_page | json -} }

    this.banner = this.container.querySelector("#banner")
    m.mount(banner, {
      view: () => {
        m(Banner, {
          banner: state.data.header.banner
        })
      }
    })
  },
  state: {
    navbar: {
      active: null
    }
  }
}
