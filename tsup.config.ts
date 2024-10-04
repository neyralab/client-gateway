import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/**/*.ts', '!src/**/*.test.ts'],
    format: ['esm'],
    dts: false,
    sourcemap: false,
    clean: true,
    minify: false,
    splitting: false,
    target: 'esnext',
    outDir: 'lib/esm',
    outExtension: () => ({ js: '.mjs' }),
  },
]);
