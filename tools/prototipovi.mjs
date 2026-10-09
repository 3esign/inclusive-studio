// One registry → validated photographs → identical static and live records.
// node tools/prototipovi.mjs [--check]; no network, dependencies or material edits.
import { readFile, writeFile, realpath } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { setLanguage } from '../assets/core.js';
import { validatePrototypes, renderPrototypes, prototypeTeaser } from '../assets/prototipovi-core.js';

const root = new URL('../', import.meta.url), actualRoot = await realpath(fileURLToPath(root));
const check = process.argv.includes('--check');
if (process.argv.slice(2).some(a => a !== '--check')) throw new Error('Only --check is supported.');
const data = JSON.parse(await readFile(new URL('data/prototipovi.json', root), 'utf8'));
const problems = validatePrototypes(data);
if (problems.length) throw new Error(problems.join('\n'));
const photoMap = new Map();
for (const item of [...data.items, ...data.observations, ...(data.revizije || []).flatMap(r => [r.before, r.after])]) for (const photo of item.photos || []) {
  if (photoMap.has(photo.src) && photoMap.get(photo.src).sha256 !== photo.sha256) throw new Error('One photo path has different fingerprints: ' + photo.src);
  photoMap.set(photo.src, photo);
}
function dimensions(b) {
  if (b[0] !== 0xff || b[1] !== 0xd8) throw new Error('Expected a JPEG image.');
  for (let p = 2; p < b.length - 8;) {
    if (b[p] !== 255) break;
    const m = b[p + 1]; if (m === 0xda || m === 0xd9) break;
    const length = b.readUInt16BE(p + 2); if (length < 2 || p + length + 2 > b.length) break;
    if ([0xc0, 0xc1, 0xc2].includes(m)) return { width: b.readUInt16BE(p + 7), height: b.readUInt16BE(p + 5) };
    p += length + 2;
  }
  throw new Error('JPEG dimensions could not be verified.');
}
for (const [src, photo] of photoMap) {
  if (!/^data\/prototipovi\/[a-z0-9-]+\/[a-z0-9-]+\.jpg$/.test(src)) throw new Error('Invalid image path.');
  const file = await realpath(new URL(src, root)), relative = path.relative(actualRoot, file);
  if (relative.startsWith('..') || path.isAbsolute(relative)) throw new Error('Image resolves outside the project.');
  const bytes = await readFile(file), size = dimensions(bytes);
  if (createHash('sha256').update(bytes).digest('hex') !== photo.sha256 || size.width !== photo.width || size.height !== photo.height) throw new Error('Photograph bytes or dimensions changed: ' + src);
}
setLanguage('sr');
const regions = [
  ['prototipovi.html', 'prototipovi', renderPrototypes(data)],
  ['index.html', 'prototype-teaser', prototypeTeaser(data)],
  ['sledeci.html', 'prototype-teaser', prototypeTeaser(data)]
];
const updates = [];
for (const [file, key, html] of regions) {
  const url = new URL(file, root), before = await readFile(url, 'utf8');
  const start = `<!-- ${key}:start -->`, end = `<!-- ${key}:end -->`;
  if (before.split(start).length !== 2 || before.split(end).length !== 2 || before.indexOf(start) > before.indexOf(end)) throw new Error('Missing or duplicated generated region: ' + file);
  const after = before.slice(0, before.indexOf(start) + start.length) + html + before.slice(before.indexOf(end));
  if (before !== after) updates.push({ url, file, after });
}
if (check && updates.length) throw new Error('Regenerate prototype views before release: ' + updates.map(u => u.file).join(', '));
if (!check) for (const u of updates) await writeFile(u.url, u.after);
console.log(JSON.stringify({ ok: true, mode: check ? 'check' : 'generate', prototypes: data.items.length, observations: data.observations.length, photographs: photoMap.size, rewritten: check ? 0 : updates.length }));
