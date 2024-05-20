import fs from 'node:fs';
import path from 'node:path';
import { globSync } from 'glob';

export function initializeBundle() {
  return {
    name: 'initialize-bundle',
    // https://rollupjs.org/plugin-development/#outputoptions
    outputOptions(options) {
      let outputDir = options.dir;
      if (outputDir === undefined && options.file !== undefined) {
        outputDir = path.dirname(options.file);
      }
      if (outputDir === undefined) {
        console.warn(`${emptyOutputDir.name}: no outputDir`);
        return options;
      }
      initializeBundleAction(outputDir);
      return options;
    },
  };
}

export function finalizeBundle() {
  return {
    name: 'finalize-bundle',
    // https://rollupjs.org/plugin-development/#closebundle
    closeBundle() {
      finalizeBundleAction();
    }
  };
}

function initializeBundleAction(outputDir) {
  console.log(`emptying ${outputDir}`);
  fs.readdirSync(outputDir, { withFileTypes: true }).forEach(entry => {
    if (entry.isDirectory()) {
      fs.rmSync(path.join(entry.path, entry.name), { recursive: true, force: true });
    } else {
      fs.unlinkSync(path.join(entry.path, entry.name));
    }
  });
}

function finalizeBundleAction() {
  const docsDir = 'docs';
  fs.mkdirSync(docsDir, { recursive: true });
  console.log(`src/index.html -> ${docsDir}/index.html`);
  fs.copyFileSync('src/index.html', `${docsDir}/index.html`);
  console.log(`src/index.css -> ${docsDir}/index.css`);
  fs.copyFileSync('src/index.css', `${docsDir}/index.css`);

  const assetsDir = path.join(docsDir, 'assets');
  fs.mkdirSync(assetsDir, { recursive: true });
  const files = globSync('src/assets/**/*.{jpg,png}');
  for (const filePath of files) {
    const fileName = path.basename(filePath);
    const outputFilePath = path.join(assetsDir, fileName);
    console.log(`${filePath} -> ${outputFilePath}`);
    fs.copyFileSync(filePath, outputFilePath);
  }
}
