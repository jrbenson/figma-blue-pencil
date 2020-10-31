import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'

export default {
    input: "src/index.js",
    output: {
        file: "dist/code.js",
        name: "bluepencil",
        format: "iife"
    },
    plugins: [nodeResolve(), terser(), commonjs()]
}