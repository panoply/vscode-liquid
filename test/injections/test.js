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
