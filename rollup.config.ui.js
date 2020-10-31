import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'

export default {
    input: "src/ui-index.js",
    output: {
        file: "src/ui.js",
        name: "ui",
        format: "iife"
    },
    plugins: [nodeResolve(), terser(), commonjs()]
}