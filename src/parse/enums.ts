
export const enum Token {
  /**
   * Liquid Tag
   */
  Tag = 1,
  /**
   * Liquid Object
   */
  Object
}


export const enum Words {
  /**
   * `in`
   *
   * @example {% for i in ar %}
   */
  IN = 'in',
  /**
   * `and`
   *
   * @example {% if x and y %}
   */
  AND = 'and',
  /**
   * `or`
   *
   * @example {% if x or y %}
   */
  OR = 'or',
  /**
   * `or`
   *
   * @example {% if x contains y %}
   */
  CONTAINS = 'contains',
  /**
   * `with`
   *
   * @example {% render 'x' with %}
   */
  WITH = 'with',
}

export const enum Char {
  /**
   * `%`
   */
  PER = 37,
  /**
   * `{`
   */
  LCB = 123,
  /**
   * `}`
   */
  RCB = 125,
  /**
   * `<`
   */
  LAN = 60,
  /**
   * `>`
   */
  RAN = 62,
  /**
   * `=`
   */
  EQL = 61,
  /**
   * `>`
   */
  PIP = 124,
  /**
   * `:`
   */
  COL = 58,
  /**
   * `-`
   */
  DSH = 45,
  /**
   * `.`
   */
  DOT = 46,
}
