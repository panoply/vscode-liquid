import { rules } from './config'

export default {
  tags: Object.keys(rules),
  inner: '((?:.|\\n)*?)',
  close: '((?:</|{%-?)\\s*\\b(?:(?:|end)\\2)\\b\\s*(?:>|-?%}))',
  ignored: new RegExp(`(<temp data-prettydiff-ignore>|</temp>)`, 'g'),
  open: (tag) => `((?:<|{%-?)\\s*\\b(${tag})\\b(?:.|\\n)*?\\s*(?:>|-?%})\\s*)`,
  ignore: (code) => `<temp data-prettydiff-ignore>${code}</temp>`,
  matches () {
    return new RegExp(this.open(this.tags.join('|')) + this.inner + this.close, 'g')
  }
}
