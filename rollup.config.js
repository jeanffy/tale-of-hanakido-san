import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import { initializeBundle, finalizeBundle } from './etc/rollup-plugins.js';

const config = [
  {
    cache: false,
    input: 'dist/index.js',
    output: {
      file: 'docs/index.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      initializeBundle(),
      finalizeBundle(),
      terser(),
      typescript()
    ],
  },
];

export default config;
