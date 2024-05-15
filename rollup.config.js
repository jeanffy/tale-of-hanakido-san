import typescript from '@rollup/plugin-typescript';
import { copyAssets, copyIndex, emptyOutputDir } from './rollup-plugins.js';

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
      copyIndex(),
      copyAssets(),
      emptyOutputDir(),
      typescript()
    ],
  },
];

export default config;
