#!/usr/bin/env node
// Prihvat fotografija sa trećeg časa (PUD).
// Usage: node tools/cas03-prihvat.cjs
// Očekuje: data/cas-03/slike/<rb>-<slug>/*.jpg  (npr. 16-obojilica/01.jpg)
// Piše:    data/cas-03/prihvat.json ( pregled ) i data/cas-03/predlog-registra.json
//          — predlog u obliku koji assets/prototipovi-core.js validira; registar
//            data/prototipovi.json se NE menja automatski.
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync, existsSync, writeFileSync } from 'node:fs';
import { join, basename } from 'node:path';

const root = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const dir = join(root, 'data', 'cas-03');
const slikeDir = join(dir, 'slike');
const spisak = JSON.parse(readFileSync(join(dir, 'spisak.json'), 'utf8'));

// JPEG/SOF + PNG dimenzije bez zavisnosti.
function dimensions(buf) {
  if (buf[0] === 0x89 && buf[1] === 0x50) return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  let i = 2;
  while (i + 9 < buf.length) {
    if (buf[i] !== 0xff) { i++; continue; }
    const marker = buf[i + 1];
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker))
      return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
    i += 2 + buf.readUInt16BE(i + 2);
  }
  return null;
}

const slug = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'rad';

const nalazi = [];
for (const entry of spisak.radovi) {
  const folderName = `${String(entry.rb).padStart(2, '0')}-${slug(entry.rad || entry.ime || 'unnamed')}`;
  const folder = join(slikeDir, folderName);
  const rad = { rb: entry.rb, folder: `data/cas-03/slike/${folderName}`, postoji: existsSync(folder), slike: [] };
  if (rad.postoji) {
    for (const f of readdirSync(folder).sort()) {
      if (!/\.jpe?g$/i.test(f)) continue;
      const buf = readFileSync(join(folder, f));
      const d = dimensions(buf);
      rad.slike.push({
        file: f, bytes: buf.length,
        sha256: createHash('sha256').update(buf).digest('hex'),
        width: d?.width ?? null, height: d?.height ?? null,
        ok: !!d && d.width > 0,
      });
    }
  }
  nalazi.push(rad);
}

const evidencija = nalazi.flatMap(r => r.slike.filter(p => !p.ok).map(p => `${r.folder}/${p.file}: dimenzije nisu pročitane`));

// Predlog registra — samo radovi sa bar jednom važećom slikom.
const items = [];
for (const rad of nalazi) {
  const entry = spisak.radovi.find(e => e.rb === rad.rb);
  if (!rad.slike.some(p => p.ok)) continue;
  const id = `${String(entry.rb).padStart(2, '0')}-${slug(entry.rad || entry.ime || 'unnamed')}`;
  items.push({
    id,
    title: entry.rad || 'unnamed',
    kind: 'prototype', authorRole: 'student', medium: 'physical', status: 'documented',
    originWeek: 3, documentedWeek: 3,
    author: { name: entry.ime || 'nepoznat autor', ...(entry.indeks ? { studentNumber: entry.indeks } : {}) },
    attribution: { sourceId: 'teacher-2026-10-16-cas-03', fields: entry.indeks ? ['name', 'studentNumber'] : ['name'] },
    sourceId: 'teacher-2026-10-16-cas-03',
    description: {
      sr: `Prototip sa trećeg časa (16.10.2026), zapis nastavnika${entry.potvrditi ? '; attribucija čeka potvrdu studenta' : ''}.`,
      en: `Prototype from the third class (2026-10-16), teacher's record${entry.potvrditi ? '; attribution pending student confirmation' : ''}.`,
    },
    photos: rad.slike.filter(p => p.ok).map((p, i) => ({
      id: `${id}-foto-${String(i + 1).padStart(2, '0')}`,
      src: `data/prototipovi/${id}/${p.file.toLowerCase()}`,
      sha256: p.sha256, width: p.width, height: p.height,
      alt: { sr: `Fotografija prototipa „${entry.rad}”`, en: `Photograph of the “${entry.rad}” prototype` },
      caption: { sr: `Red ${i + 1} u nizu slikanja;${i + 1 === rad.slike.length ? ' poslednja: korisnica proba prototip' : ''}.`, en: `Frame ${i + 1} in the photographic sequence.` },
      sourceId: 'teacher-2026-10-16-cas-03',
    })),
  });
}

const predlog = {
  schema: 'course-prototypes/v1',
  sources: [{
    id: 'teacher-2026-10-16-cas-03', recordedOn: '2026-10-16',
    description: spisak.napomena,
  }],
  items,
  observations: [],
};

writeFileSync(join(dir, 'prihvat.json'), JSON.stringify({ provereno: new Date().toISOString(), nalazi, evidencija }, null, 1));
writeFileSync(join(dir, 'predlog-registra.json'), JSON.stringify(predlog, null, 1));

const ukupno = nalazi.reduce((n, r) => n + r.slike.length, 0);
console.log(`Radova u spisku: ${spisak.radovi.length}`);
console.log(`Folderi sa slikama: ${nalazi.filter(r => r.postoji).length}, fotografija: ${ukupno}, u predlogu registra: ${predlog.items.length}`);
for (const g of evidencija) console.log('!', g);
if (ukupno === 0) console.log('Čekam slike: prebaci ih u data/cas-03/slike/<rb>-<slug>/ i pokreni ponovo.');
