// One registry → validated photographs → identical static and live records.
// node tools/prototipovi.mjs [--check]; no network, dependencies or material edits.
import { readFile, writeFile, realpath } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { setLanguage } from '../assets/core.js';
import { validatePrototypes, renderPrototypes, prototypeTeaser } from '../assets/prototipovi-core.js';
import { galleryDetail, galleryHref } from '../assets/galleries.js';
import { publishedPrototypes } from '../assets/photo-publication.js';

const root = new URL('../', import.meta.url), actualRoot = await realpath(fileURLToPath(root));
const check = process.argv.includes('--check');
if (process.argv.slice(2).some(a => a !== '--check')) throw new Error('Only --check is supported.');
const data = JSON.parse(await readFile(new URL('data/prototipovi.json', root), 'utf8'));
const problems = validatePrototypes(data);
if (problems.length) throw new Error(problems.join('\n'));
const photoMap = new Map();
for (const item of [...data.items, ...data.observations, ...(data.galleries || []), ...(data.revizije || []).flatMap(r => [r.before, r.after])]) for (const photo of item.photos || []) {
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
// The public data set: the same registry seen through the publication gate. A work whose
// attribution waits for the student's confirmation stays in the record (the full file) but
// never travels to the reader — pages fetch this excerpt, so pending names, numbers and
// photographs are not merely hidden by the renderer, they are not served at all.
const publicData = (() => {
  const gated = publishedPrototypes(data);
  const published = new Set(gated.items.map(item => item.id));
  return { ...gated, revizije: (data.revizije || []).filter(revision => published.has(revision.prototypeId)) };
})();
const publicText = JSON.stringify(publicData, null, 1) + '\n';
const publicUrl = new URL('data/prototipovi-javno.json', root);
{
  const before = await readFile(publicUrl, 'utf8').catch(() => null);
  if (before !== publicText) {
    if (check) throw new Error('Regenerate the public prototype excerpt before release: data/prototipovi-javno.json');
    await writeFile(publicUrl, publicText);
  }
}

setLanguage('sr');
const regions = [
  ['prototipovi.html', 'prototipovi', renderPrototypes(data)],
  ['sledeci.html', 'prototype-teaser', prototypeTeaser(data)]
];
const updates = [];
const shell = await readFile(new URL('prototipovi.html', root), 'utf8');
for (const g of data.galleries || []) {
  const file = galleryHref(g), url = new URL(file, root);
  const after = shell.replace('src="assets/prototipovi.js"', 'src="assets/gallery-page.js"')
    .replace('<body data-view="prototypes">', '<body data-view="prototypes" data-gallery="' + g.id + '">')
    .replace(/(<meta name="description" content=")[^"]*(")/, '$1Galerija rada: ' + g.title.sr + '.$2')
    .replace(/<title>[^<]*<\/title>/, '<title>' + g.title.sr + ' — Principi univerzalnog dizajna · Univerzitet „Union — Nikola Tesla”, Beograd</title>')
    .replace(/<main([^>]*)>[\s\S]*?<\/main>/, '<main$1>' + galleryDetail(data, g.id) + '</main>');
  const before = await readFile(url, 'utf8').catch(() => null);
  if (before !== after) updates.push({url, file, after});
}
for (const [file, key, html] of regions) {
  const url = new URL(file, root), before = await readFile(url, 'utf8');
  const start = `<!-- ${key}:start -->`, end = `<!-- ${key}:end -->`;
  if (before.split(start).length !== 2 || before.split(end).length !== 2 || before.indexOf(start) > before.indexOf(end)) throw new Error('Missing or duplicated generated region: ' + file);
  const after = before.slice(0, before.indexOf(start) + start.length) + html + before.slice(before.indexOf(end));
  if (before !== after) updates.push({ url, file, after });
}
if (check && updates.length) throw new Error('Regenerate prototype views before release: ' + updates.map(u => u.file).join(', '));
if (!check) for (const u of updates) await writeFile(u.url, u.after);
console.log(JSON.stringify({ ok: true, mode: check ? 'check' : 'generate', prototypes: data.items.length, observations: data.observations.length, photographs: photoMap.size, rewritten: check ? 0 : updates.length, publicPrototypes: publicData.items.length }));
