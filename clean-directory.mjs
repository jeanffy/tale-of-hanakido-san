import fs from 'node:fs';
import path from 'node:path';

const dirPath = process.argv.slice(2)[0];
const entries = fs.readdirSync(dirPath, { withFileTypes: true });
for (const entry of entries) {
  const entryPath = path.join(entry.path, entry.name);
  if (entry.isDirectory()) {
    fs.rmSync(entryPath, { recursive: true, force: true });
  } else {
    fs.unlinkSync(entryPath);
  }
}
