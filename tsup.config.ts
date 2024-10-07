import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['esm'],
    dts: true,
    sourcemap: false,
    clean: true,
    minify: false,
    splitting: false,
    target: 'esnext',
    outDir: 'lib/es6',
    config: false,
    outExtension: () => ({ js: '.mjs' }),
  },
]);
