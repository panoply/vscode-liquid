export default {
  close: '((?:</|{%-?)\\s*\\b(?:(?:|end)\\2)\\b\\s*(?:>|-?%}))',
  inner: '((?:.|\\n)*?)',
  open: (tags) => `((?:<|{%-?)\\s*\\b(${tags})\\b(?:.|\\n)*?\\s*(?:>|-?%})\\s*)`,
  ignore: (code) => `<temp data-prettydiff-ignore>${code}</temp>`,
  elements (tags) {
    return {
      match: new RegExp(this.open(tags) + this.inner + this.close, 'g'),
      skip: new RegExp(`(<temp data-prettydiff-ignore>|</temp>)`, 'g')
    }
  }
}
