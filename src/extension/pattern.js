import { preset } from './config'

export default {
  frontmatter: new RegExp(['---',
    '(?:[^]*?)',
    '---'].join(''), 'g'),
  tags: new RegExp(
    [
      '(', // Opening
      '(?:<|{%-?)\\s*',
      `\\b(${preset.tags.concat(preset.ignore).join('|')})\\b`,
      '(?:.|\\n)*?\\s*',
      '(?:>|-?%})\\s*',
      ')',
      '(', // Inner
      '(?:.|\\n)*?',
      ')',
      '(', // Closing
      '(?:</|{%-?)\\s*',
      '\\b(?:(?:|end)\\2)\\b',
      '\\s*(?:>|-?%})',
      ')'
    ].join(''),
    'g'
  ),
  ignore: new RegExp(['(',
    '<temp data-prettydiff-ignore>',
    '|',
    '</temp>',
    ')'].join(''), 'g')
}
