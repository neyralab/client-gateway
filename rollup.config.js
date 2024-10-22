import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';
import builtins from 'rollup-plugin-node-builtins';
import alias from '@rollup/plugin-alias';
import inject from '@rollup/plugin-inject';

function replaceWindowAndGlobal() {
  return {
    name: 'replace-window-and-global',
    transform(code) {
      // Replace 'window' with 'self' and 'global' with 'self'
      const transformedCode = code
          .replace(/\bwindow\b/g, 'self') // Exact replacement for 'window'
          .replace(/\bglobal\b/g, 'self'); // Exact replacement for 'global'
      return {
        code: transformedCode,
        map: null,
      };
    },
  };
}

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/bundle.umd.js',
        format: 'umd',
        name: 'client-gateway', // Replace with your library name
        sourcemap: false,
      },
      {
        file: 'dist/bundle.esm.js',
        format: 'esm',
        sourcemap: false,
      },
    ],
    plugins: [
      alias({
        entries: [
          { find: 'crypto', replacement: 'crypto-browserify' }, // Polyfill for crypto
          { find: 'stream', replacement: 'stream-browserify' }, // Polyfill for stream
        ],
      }),
      resolve({
        preferBuiltins: true, // For built-in Node.js modules
        browser: true, // For browser environment
      }),
      commonjs(), // Support for CommonJS modules
      json(),
      builtins(), // Support for built-in Node.js modules
      inject({
        process: 'process/browser', // Polyfill for process
      }),
      replace({
        preventAssignment: true,
        values: {
          global: 'self',
          window: 'self',
        },
      }),
      replaceWindowAndGlobal(),
      typescript(),
    ],
    external: [],
  },
];
