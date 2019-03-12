import { rules } from './config'

const tags = Object.keys(rules)
const ignore = rules.html.ignore_tags
const items = tags.concat(ignore)

console.log(items)
export default {
  tags: items,
  enforce: ['schema',
    'style',
    'stylesheet',
    'javascript'],
  inner: '((?:.|\\n)*?)',
  close: '((?:</|{%-?)\\s*\\b(?:(?:|end)\\2)\\b\\s*(?:>|-?%}))',
  ignored: new RegExp(`(<temp data-prettydiff-ignore>|</temp>)`, 'g'),
  open: (tag) => `((?:<|{%-?)\\s*\\b(${tag})\\b(?:.|\\n)*?\\s*(?:>|-?%})\\s*)`,
  ignore: (code) => `<temp data-prettydiff-ignore>${code}</temp>`,
  matches () {
    return new RegExp(this.open(this.tags.join('|')) + this.inner + this.close, 'g')
  }
}
