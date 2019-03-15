import { workspace, languages, commands, window, Range, TextEdit, ConfigurationTarget } from 'vscode'
import path from 'path'
import prettydiff from 'prettydiff'
import pattern from './pattern'
import { editor, defaults, rules } from './config'

let handler = {}

const liquid = workspace.getConfiguration('liquid')

const info = (message) => window.showInformationMessage(message)

const blocks = (code, open, name, source, close) => {
  if (pattern.enforce.includes(name) && open[0] === '{') {
    const config = Object.assign({}, defaults, rules[name], { source })
    const pretty = prettydiff.mode(config)
    return pattern.ignore(`${open.trim()}\n\n${pretty.trim()}\n\n${close.trim()}`)
  } else {
    return pattern.ignore(`${code}`)
  }
}

const fullRange = (document) => {
  const first = document.lineAt(0).range.start.character
  const last = document.lineAt(document.lineCount - 1).range.end.character
  const range = new Range(0, first, document.lineCount - 1, last)
  return range
}

const replace = (range, output) => [TextEdit.replace(range, output)]

const applyFormat = (document, range) => {
  const contents = document.getText(range)
  const source = contents.replace(pattern.matches(), blocks)
  const assign = Object.assign({}, defaults, rules.html, { source })
  const output = prettydiff.mode(assign).replace(pattern.ignored, '')
  return `${output.trim()}`
}
const format = (document) => {
  const range = fullRange(document)
  const output = applyFormat(document, range)
  return replace(range, output)
}

const schema = () => {
  const associate = workspace.getConfiguration('files').associations
  return {
    scheme: 'file',
    language: (associate && associate['*.liquid']) || 'liquid'
  }
}

const disposal = () => {
  if (Object.keys(handler).length > 0) {
    for (const key in handler) {
      handler[key].dispose()
    }
  }
}

commands.registerCommand('liquid.disableFormatting', () => {
  liquid.update('format', false, ConfigurationTarget.Global)
  disposal()
  return info('Liquid: Formatting has been disabled')
})

export const formatDocument = commands.registerCommand('liquid.formatDocument', () => {
  const document = window.activeTextEditor.document
  const range = fullRange(document)
  const output = applyFormat(document, range)
  window.activeTextEditor.edit((edits) => edits.replace(range, output))
  return info('Liquid: File was formatted')
})

export const formatSelection = commands.registerCommand('liquid.formatSelection', () => {
  const root = window.activeTextEditor
  const range = root.selection
  const output = applyFormat(root.document, range)
  window.activeTextEditor.edit((edits) => edits.replace(range, output))
  return info('Liquid: Selection was formatted')
})

export const setup = () => {
  pattern.tags.map((k) => {
    if (liquid.beautify[k]) {
      return Object.assign(rules[k], liquid.beautify[k])
    }
  })
}

export const formatting = () => {
  const name = window.activeTextEditor.document.uri.path
  if (path.extname(name) === '.liquid') {
    if (Object.keys(handler).length === 0) {
      handler = {
        full: languages.registerDocumentFormattingEditProvider(schema(), {
          provideDocumentFormattingEdits: format
        }),
        range: languages.registerDocumentRangeFormattingEditProvider(schema(), {
          provideDocumentRangeFormattingEdits: format
        })
      }
    }
  } else {
    disposal()
    handler = {}
  }
}

export const enableFormatting = commands.registerCommand('liquid.enableFormatting', () => {
  liquid.update('format', true, ConfigurationTarget.Global)
  formatting()
  return info('Liquid: Formatting has been enabled.')
})

export const configuration = () => {
  return workspace.onDidChangeConfiguration(() => {
    if (liquid.format === false) return disposal()
    if (editor.formatOnSave === true) {
      formatting()
    }
  })
}
