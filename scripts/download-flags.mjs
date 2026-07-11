import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const countriesSource = fs.readFileSync(path.join(root, 'src/shared/countries.ts'), 'utf8');
const codes = [...countriesSource.matchAll(/code: '([^']+)'/g)].map((match) => match[1]);
const outDirs = [
  path.join(root, 'src/client/assets/flags'),
  path.join(root, 'public/flags'),
];

for (const dir of outDirs) {
  fs.mkdirSync(dir, { recursive: true });
}

const concurrency = 20;
let index = 0;
let downloaded = 0;
let skipped = 0;
let failed = 0;

async function downloadOne(code) {
  const primaryDest = path.join(outDirs[0], `${code}.png`);
  if (fs.existsSync(primaryDest) && fs.statSync(primaryDest).size > 100) {
    for (const dir of outDirs) {
      const dest = path.join(dir, `${code}.png`);
      if (!fs.existsSync(dest)) {
        fs.copyFileSync(primaryDest, dest);
      }
    }
    skipped += 1;
    return;
  }

  const url = `https://flagcdn.com/w320/${code}.png`;
  const response = await fetch(url);
  if (!response.ok) {
    failed += 1;
    console.error(`Failed ${code}: ${response.status}`);
    return;
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  for (const dir of outDirs) {
    fs.writeFileSync(path.join(dir, `${code}.png`), buffer);
  }
  downloaded += 1;
}

async function worker() {
  while (index < codes.length) {
    const code = codes[index];
    index += 1;
    await downloadOne(code);
  }
}

await Promise.all(Array.from({ length: concurrency }, () => worker()));
console.log(`Flags ready: ${downloaded} downloaded, ${skipped} cached, ${failed} failed, ${codes.length} total.`);
