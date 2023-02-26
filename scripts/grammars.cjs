const { liquid, Type } = require('@liquify/specs');
const { join } = require('path');
const { has, uniq, isEmpty } = require('rambdax');
const { writeFileSync } = require('fs');

const file = join(process.cwd(), 'syntax/liquid.tmLanguage.json');

/**
 * Return Liquid Grammar File
 */
const grammar = require(file);

/**
 * Retrive all Shopify Objects
 */
const entries = Object.entries(liquid.shopify.objects);

/**
 * Generate the grammar patterns for each object
 */
function generate () {

  /**
   * Capture Patterns
   */
  const patterns = [
    {
      name: 'support.class.object.liquid',
      match: '(?<=[\\s,:=<>\\[])\\s*(?!\\.)\\b([a-zA-Z_][a-zA-Z0-9_-]*)\\b\\s*(?=\\.)'
    }
  ];

  /**
   * The pattern capture types we will generate
   */
  const captures = {
    constant: [],
    object: {
      before: [],
      insert: [],
      values: [],
      object: {}
    },
    string: {
      before: [],
      insert: [],
      values: [],
      object: {}
    },
    boolean: {
      before: [],
      insert: [],
      values: [],
      object: {}
    },
    integer: {
      before: [],
      insert: [],
      values: [],
      object: {}
    }
  };

  /**
   * Insert pattern references
   */
  const insert = type => prop => {

    if (!has(prop, captures[type].object)) {
      captures[type].object[prop] = [];
    }

    return captures[type].object[prop];

  };

  /**
   * Walks nested properties
   */
  const props = (object, properties) => {

    const props = Object.entries(properties);

    for (const [ prop, spec ] of props) {
      if (spec.type === Type.object) {
        insert('object')(object).push(prop);
      } else if (spec.type === Type.string) {
        insert('string')(object).push(prop);
      } else if (spec.type === Type.number || spec.type === Type.float) {
        insert('integer')(object).push(prop);
      } else if (spec.type === Type.boolean) {
        insert('boolean')(object).push(prop);
      }
    }

  };

  for (const [ object, spec ] of entries) {
    if (has('type', spec)) {
      if (has('properties', spec)) {
        props(object, spec.properties);
        captures.object.values.push(object);
      } else if (spec.type === Type.object) {
        captures.object.values.push(object);
      } else if (spec.type === Type.string) {
        captures.string.values.push(object);
      } else if (spec.type === Type.number || spec.type === Type.float) {
        captures.integer.values.push(object);
      } else {
        captures.constant.push(object);
      }
    } else if (spec.const === true) {
      captures.constant.push(object);
    }
  }

  /**
   * Object Patterns
   */
  if (!isEmpty(captures.object.object)) {
    for (const name in captures.object.object) {
      captures.object.before.push(name);
      captures.object.insert.push(...captures.object.object[name]);
    }
  }

  /**
   * String Patterns
   */
  if (!isEmpty(captures.string.object)) {
    for (const name in captures.string.object) {
      captures.string.before.push(name);
      captures.string.insert.push(...captures.string.object[name]);
    }
  }

  /**
   * Boolean Patterns
   */
  if (!isEmpty(captures.boolean.object)) {
    for (const name in captures.boolean.object) {
      captures.boolean.before.push(name);
      captures.boolean.insert.push(...captures.boolean.object[name]);
    }
  }

  /**
   * Integer Patterns
   */
  if (!isEmpty(captures.integer.object)) {
    for (const name in captures.integer.object) {
      captures.integer.before.push(name);
      captures.integer.insert.push(...captures.integer.object[name]);
    }
  }

  /* -------------------------------------------- */
  /* OBJECT PATTERNS                              */
  /* -------------------------------------------- */

  /**
   * Insert constant object patterns
   */
  if (captures.object.values.length > 0) {
    patterns.push(
      {
        name: 'entity.name.tag.object.liquid',
        match: `\\b(${uniq(captures.constant).join('|')})\\b`
      }
    );
  }

  /**
   * Insert string object patterns
   */
  if (captures.object.values.length > 0) {
    patterns.push(
      {
        name: 'support.class.object-value.liquid',
        match: `(?!\\.)\\b(${uniq(captures.object.values).join('|')})\\b(?![\\.])`
      },
      {
        name: 'support.class.object-value.liquid',
        match: `(?<=\\.\\s*)\\b(${uniq(captures.object.values).join('|')})\\b`
      }
    );
  }

  /**
   * Insert string object patterns
   */
  if (captures.string.values.length > 0) {
    patterns.push(
      {
        name: 'string.other.object-value.liquid',
        match: `\\b(${uniq(captures.string.values).join('|')})\\b`
      }
    );
  }

  /**
   * Insert integer object patterns
   */
  if (captures.integer.values.length > 0) {
    patterns.push(
      {
        name: 'constant.numeric.object-value.liquid',
        match: `\\b(${uniq(captures.integer.values).join('|')})\\b`
      }
    );
  }

  /**
   * Insert boolean object patterns
   */
  if (captures.boolean.values.length > 0) {
    patterns.push(
      {
        name: 'constant.language.object-value.liquid',
        match: `\\b(${uniq(captures.boolean.values).join('|')})\\b`
      }
    );
  }

  /* -------------------------------------------- */
  /* PROPERTY PATTERNS                            */
  /* -------------------------------------------- */

  const { string, integer, boolean } = captures;

  /**
   * Insert string property patterns
   */
  if (string.insert.length > 0) {
    patterns.push(
      {
        name: 'string.other.property-value.liquid',
        match: `(?<=(?:${uniq(string.before).join('|')})\\s*\\.)\\s*\\b(${uniq(string.insert).join('|')})\\b`
      }
    );
  }

  /**
   * Insert integer property patterns
   */
  if (integer.insert.length > 0) {
    patterns.push(
      {
        name: 'constant.numeric.property-value.liquid',
        match: `(?<=(?:${uniq(integer.before).join('|')})\\s*\\.)\\s*\\b(${uniq(integer.insert).join('|')})\\b`
      }
    );
  }

  /**
   * Insert boolean property patterns
   */
  if (boolean.insert.length > 0) {
    patterns.push(
      {
        name: 'constant.language.object-value.liquid',
        match: `(?<=(?:${uniq(boolean.before).join('|')})\\s*\\.)\\s*\\b(${uniq(boolean.insert).join('|')})\\b`
      }
    );
  }

  grammar.repository.objects.patterns = patterns;

}

generate();

// console.log(grammar.repository.objects);

writeFileSync(file, JSON.stringify(grammar, null, 2));
