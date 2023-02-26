
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


// LIQUID COMMENT BLOCKS
//
liquid`

  {% comment %}
  here is a comment
  {% endcomment %}

  {% # commment %}

  {% for i in arr %}

  {% endfor %}

  <div {% if condition %} {{ product.available }} {% endif %}></div>

  <div id="{% if condition %} {{ product.available }} {% endif %}"></div>

`;




[
    liquid`{% # 1 newline following comment is respected %}

      <div>
      1 NEWLINE FOLLOWING COMMENT
      </div>

      {% comment %} esthetic-ignore-start {% endcomment %}
      <main>
        <h1></h1>
      </main>
      <!--__ender__-->

    `,
    liquid`{% # 2 newlines following comment are respected %}

      <div>
      2 NEWLINES FOLLOWING COMMENT
      </div>

      <!--__start__-->

      <main>
                <h1>     ignored       </h1>
      </main>
      <!--__ender__-->
    `
]

// ATTRIBUTE HIGHLIGHT INCLUDED
//
liquid`

{% for i in arr %}

{% endfor %}

<div {% if condition %} {{ product.available }} {% endif %}></div>

<div id="{% if condition %} {{ product.available }} {% endif %}"></div>
`;

// INLINE WITH HIGHLIGHTING PRESERVED
//
liquid`{% if condition %} {{ product.available }} {% endif %}`;

// NO HIGH LIGHTING - LITERAL BEHAVES AS INTENDED
//
template`

{% for i in arr %}

{% endfor %}

`;
