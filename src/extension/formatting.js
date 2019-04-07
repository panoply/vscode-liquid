import { workspace, languages, commands, window, Range, TextEdit, ConfigurationTarget } from 'vscode'
import prettydiff from 'prettydiff'
import pattern from './pattern'
import { defaults, rules, cmd } from './config'

let handler = {}

const replace = (range, output) => [TextEdit.replace(range, output)]

const blocks = (code, open, name, source, close) => {
  if (pattern.enforce.includes(name) && open[0] === '{') {
    let config = Object.assign({}, defaults, rules[name], { source })
    let pretty = prettydiff.mode(config)
    return pattern.ignore(`${open.trim()}\n\n${pretty.trim()}\n\n${close.trim()}`)
  }
  return pattern.ignore(`${code}`)
}

const fullRange = (document) => {
  let first = document.lineAt(0).range.start.character
  let last = document.lineAt(document.lineCount - 1).range.end.character
  let range = new Range(0, first, document.lineCount - 1, last)

  return range
}

function applyFormat (document, range) {
  let contents = document.getText(range)
  let source = contents.replace(pattern.matches(), blocks)
  let assign = Object.assign({}, defaults, rules.html, {
    source
  })

  let output = prettydiff.mode(assign)
  output = output.replace(pattern.ignored, '')

  return `${output.trim()}`
}

function format (document) {
  let range = fullRange(document)
  let output = applyFormat(document, range)

  return replace(range, output)
}

function schema () {
  let associate = workspace.getConfiguration('files').associations
  return {
    scheme: 'file',
    language: (associate && associate['*.liquid']) || 'liquid'
  }
}

function disposal () {
  if (Object.keys(handler).length > 0) {
    handler.range.dispose()
    handler.full.dispose()
    handler = {}
  }
}

export const textDocument = commands.registerCommand(cmd.document, () => {
  let document = window.activeTextEditor.document
  let range = fullRange(document)
  let output = applyFormat(document, range)
  window.activeTextEditor.edit((edits) => edits.replace(range, output))
  window.showInformationMessage('Liquid Language: Document Formatted 💧')
})

export const textSelection = commands.registerCommand(cmd.selection, () => {
  let root = window.activeTextEditor
  let range = root.selection
  let output = applyFormat(root.document, range)
  window.activeTextEditor.edit((edits) => edits.replace(range, output))
  window.showInformationMessage('Liquid Language: Selection Formatted! 💧')
})

export const formatEnable = commands.registerCommand(cmd.enable, () => {
  let liquid = workspace.getConfiguration('liquid')
  liquid.update('format', true, ConfigurationTarget.Global)
  window.showInformationMessage('Liquid Language: Formatting Enabled 💧')
})

export const formatDisable = commands.registerCommand(cmd.disable, () => {
  let liquid = workspace.getConfiguration('liquid')
  liquid.update('format', false, ConfigurationTarget.Global)
  disposal()
  window.showInformationMessage('Liquid Language: Formatting Disabled')
})

export const registerFormat = () => {
  if (!workspace.getConfiguration('liquid').format) {
    return disposal()
  }

  if (!workspace.getConfiguration('editor').formatOnSave) {
    return disposal()
  }

  if (Object.keys(handler).length > 0) {
    disposal()
  }

  if (Object.keys(handler).length === 0) {
    handler.full = languages.registerDocumentFormattingEditProvider(schema(), {
      provideDocumentFormattingEdits: format
    })
    handler.range = languages.registerDocumentRangeFormattingEditProvider(schema(), {
      provideDocumentRangeFormattingEdits: format
    })
  }
}

export const registerRules = () => {
  let liquid = workspace.getConfiguration('liquid')
  pattern.tags.map((k) => {
    if (liquid.beautify[k]) {
      Object.assign(rules[k], liquid.beautify[k])
    }
  })
}
