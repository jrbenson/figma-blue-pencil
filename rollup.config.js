import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-typescript2'
import del from 'rollup-plugin-delete'

import manifest from './manifest.json'

export default [
  {
    input: 'src/index.ts',
    output: {
      file: manifest.main,
      name: 'bluepencil',
      format: 'iife',
    },
    plugins: [del({ runOnce: true, targets: 'dist/**/*' }), typescript(), nodeResolve(), terser(), commonjs()],
  },
  {
    input: 'src/ui-index.ts',
    output: {
      file: 'src/ui-index.js',
      name: 'ui',
      format: 'iife',
    },
    plugins: [typescript(), nodeResolve(), terser(), commonjs()],
  },
]
