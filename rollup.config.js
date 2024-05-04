import typescript from '@rollup/plugin-typescript';
import { copyAssets, copyIndexHtml, emptyOutputDir } from './rollup-plugins.js';

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
      copyIndexHtml(),
      copyAssets(),
      emptyOutputDir(),
      typescript()
    ],
  },
];

export default config;
