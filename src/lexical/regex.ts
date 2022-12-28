/* -------------------------------------------- */
/* GENERATORS                                   */
/* -------------------------------------------- */

export const Tag = (name: string) => new RegExp(`{%-?\\s*\\b${name}\\b\\s+-?%}`);

/* -------------------------------------------- */
/* EXPRESSIONS                                  */
/* -------------------------------------------- */

/**
 * Schema Start, eg: `{% schema %}`
 */
export const SchemaStart = /{%-?\s*\bschema\b\s*-?%}/;

/**
 * Schema End, eg: `{% endschema %}`
 */
export const SchemaEnd = /{%-?\s*\bschema\b\s*-?%}/;

/**
 * Control Names, eg: `if|elsif|case|when|unless`
 */
export const ControlNames = /if|elsif|case|when|unless/;

/**
 * If Control Names, eg:`if|elsif|unless`
 */
export const IfControlNames = /if|elsif|unless/;

/**
 * Case Control Names, eg:`case|when`
 */
export const CaseControlNames = /case|when/;

/**
 * Operators, eg: `([!=]=|[<>]=?|(?:and|or|contains|in|with)\b)`
 */
export const Operators = /([!=]=|[<>]=?|(?:and|or|contains|in|with)\b)/;

/**
 * Empty Output, eg: `/{{-?\s*-?}}/`
 */
export const EmptyOutput = /{{-?\s*-?}}/;

/**
 * Empty Tag, eg: `/{%-?\s*-?%}/`
 */
export const EmptyTag = /{%-?\s*-?%}/;

/**
 * An empty tag ender, eg: `/^\s*-?%}/`
 */
export const EmptyEnder = /^\s*-?%}/;
