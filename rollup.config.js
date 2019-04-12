export default [
  {
    input: 'src/extension.js',
    output: {
      file: 'extension/index.js',
      format: 'cjs',
      external: [
        'prettydiff',
        'vscode'
      ]
    }
  }
]
