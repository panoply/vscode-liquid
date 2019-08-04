import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import { terser } from 'rollup-plugin-terser'

export default [
  {
    input: 'src/extension.js',
    output: {
      file: 'extension/index.js',
      format: 'cjs',
      external: [
        'vscode',
        'prettydiff'
      ]
    },
    plugins: [
      nodeResolve(),
      commonjs(),
      terser()
    ]
  }
]
