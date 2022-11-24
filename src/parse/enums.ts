/* eslint-disable no-unused-vars */

export const enum Token {
  /**
   * Liquid Tag
   */
  Tag = 1,
  /**
   * Liquid Object
   */
  Object,
  /**
   * Liquid Object
   */
  Property,
  /**
   * Liquid Filter
   */
  Filter,
  /**
   * Liquid Parameter
   */
  Param,
  /**
   * Liquid Logical operators
   */
  Logical,
  /**
   * Liquid Schema Block Type
   */
  Block
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
   * `|`
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
  /**
   * `"`
   */
  DQO = 34,
  /**
   * `'`
   */
  SQO = 39,
  /**
   * `[`
   */
  LSB = 91,
}
