import fs from 'node:fs';
import path from 'node:path';
import { globSync } from 'glob';

export function copyIndexHtml() {
  return {
    name: 'copy-index-html',
    closeBundle() {
      const outputDir = 'docs';
      fs.mkdirSync(outputDir, { recursive: true });
      console.log(`src/index.html -> ${outputDir}/index.html`);
      fs.copyFileSync('src/index.html', `${outputDir}/index.html`);
    }
  };
}

export function copyAssets() {
  return {
    name: 'copy-assets',
    closeBundle() {
      const outputDir = path.join('docs', 'assets');
      fs.mkdirSync(outputDir, { recursive: true });
      const files = globSync('src/assets/**/*.{jpg,png}');
      for (const filePath of files) {
        const fileName = path.basename(filePath);
        const outputFilePath = path.join(outputDir, fileName);
        console.log(`${filePath} -> ${outputFilePath}`);
        fs.copyFileSync(filePath, outputFilePath);
      }
    },
  };
}

export function emptyOutputDir() {
  return {
    name: 'empty-output-dir',
    outputOptions(options) {
      let outputDir = options.dir;
      if (outputDir === undefined && options.file !== undefined) {
        outputDir = path.dirname(options.file);
      }
      if (outputDir === undefined) {
        console.warn(`${emptyOutputDir.name}: no outputDir`);
        return options;
      }
      console.log(`emptying ${outputDir}`);
      fs.readdirSync(outputDir, { withFileTypes: true }).forEach(entry => {
        if (entry.isDirectory()) {
          fs.rmSync(path.join(entry.path, entry.name), { recursive: true, force: true });
        } else {
          fs.unlinkSync(path.join(entry.path, entry.name));
        }
      });
      return options;
    },
  };
}
