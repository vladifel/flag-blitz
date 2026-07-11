import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

function countPngs(dir) {
  if (!fs.existsSync(dir)) {
    return 0;
  }

  return fs.readdirSync(dir).filter((name) => name.endsWith('.png')).length;
}

const assetCount = countPngs(path.join(root, 'src/client/assets/flags'));
const publicCount = countPngs(path.join(root, 'public/flags'));

if (assetCount < 200 && publicCount < 200) {
  console.error(
    `Missing flag assets (${assetCount} in src/client/assets/flags, ${publicCount} in public/flags). Run: npm run download-flags`
  );
  process.exit(1);
}

console.log(`Flags OK: assets=${assetCount}, public=${publicCount}`);
