// MULTILINE WITH HIGH LIGHTING PRESERVED
//
liquid`

{% for i in arr %}

{{ foo }}

{% endfor %}

<div
  foo="foo"
 {% if condition %}
 {{ product.available }}
 {% endif %}></div>

`;


// ATTRIBUTE HIGH LIGHT INCLUDED
//
liquid`

{% for i in arr %}

{% endfor %}

<div {% if condition %} {{ product.available }} {% endif %}></div>

<div id="{% if condition %} {{ product.available }} {% endif %}"></div>
`;

// INLINE WITH HIGH LIGHTING PRESERVED
//
liquid`{% if condition %} {{ product.available }} {% endif %}`


// NO HIGH LIGHTING - LITERAL BEHAVES AS INTENDED
//
template`

{% for i in arr %}

{% endfor %}

`;

forRules(
  [
    liquid`

    {% # The entire structure will chain starting at the if condition %}

    <div

    id="foo"
    {% if x  %}data-attr="x"
    {% elsif %}
    data-id="x"{% endif %}

    ></div>

    `
    ,
    liquid`

    {% # Chained edge case, attributes will connect (boolean structure) %}

    <div
    data-{% if x %}id="foo"{% else %} name {% endif %}
    >
    </div>`

    ,

    liquid`

    {% # Preservation edge case, structure will be preserved and liquid tokens normalized %}

    <div
    id="foo"
    data-bar
    {{ output.attr | filter: 'xxx' }}
    data-id="foo"
    {% if x  %}
    {{ attr.2 }}
    {% endif %}
    {% if x  %}data-x={{ foo }}{% else %}{{ attr.3 }}{% endif %}
    ></div>`

    ,

    liquid`

    {% # Preservation edge case, structure will be preserved %}

    <div
    data{% if x %}-foo{% else %}-bar{% endif %}={{ x }}
    {% tag %}={% if x %}"foo"{% else %}{{ bar }}{% endif %}
    >
    </div>`

    ,

    liquid`

    {% # Preservation edge case, testing a multitude of expressions %}

    <div
    aria-label={{ label }}
    class="x"
    data-attr
    {{ output_attribute }}
    {{ output_attribute | filter: 'foo' }}
    id={{ unquoted.value }}
    data-dq="{{ dq.value }}"
    data-sq='{{ sq.value }}'
    {{ attr }}="liquid-output-attr"
    {% tag %}="liquid-tag-attr"
    {% if x %}data-if{% elsif x > 0 %}data-elsif{% else %}data-else{% endif %}={{ value}}
    data-{% if x %}id="foo"{% else %}name{% endif %}
    >
    </div>`

    ,

    liquid`

    {% # Preservation edge case, testing a multitude of expressions (child nesting) %}

    <div id={{ no_quotes }} {{ output_attribute }}>
    <div
    id="x"
    class="xxx xxx xxx"
    {% if x == 100 %}
    data-{% if x %}{{ x }}{%- else -%}foo{%- endif %}-id="xxx"
    {% elsif x != 200 %}
    {% unless u == 'foo' and x == 'bar' %}
    data-{{ object.prop | filter }}
    {% endunless %}
    {% endif %}
    aria-x="foo"
    style="background-color: {{ bg.color }}; font-size: 20px;">
    </div>
    </div>
    `

  ]
)(
  {
    wrap: 0,
    language: 'liquid',
    markup: {
      forceAttribute: 2
    }
  }
)(function (source, rules) {

  const actual = prettify.formatSync(source, rules);

  // t.log(actual);

  t.snapshot(actual, 'Attribute structure preservations');

});
