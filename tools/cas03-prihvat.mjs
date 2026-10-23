#!/usr/bin/env node
// Prihvat fotografija sa trećeg časa (PUD).
// Usage: node tools/cas03-prihvat.cjs
// Očekuje: data/cas-03/slike/<rb>-<slug>/*.jpg  (npr. 16-obojilica/01.jpg)
// Piše:    data/cas-03/prihvat.json ( pregled ) i data/cas-03/predlog-registra.json
//          — predlog u obliku koji assets/prototipovi-core.js validira; registar
//            data/prototipovi.json se NE menja automatski.
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync, existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, basename, resolve } from 'node:path';

const root = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const dir = join(root, 'data', 'cas-03');
// Opciona izlazna fascikla (prvi argument) — regeneracija u izolovanom izlazu bez diranja
// postojećih fajlova (npr. Semirovog prihvat.json-a). Bez argumenta piše kao i ranije.
const outDir = process.argv[2] ? resolve(process.argv[2]) : dir;
mkdirSync(outDir, { recursive: true });
const slikeDir = join(dir, 'slike');
const spisak = JSON.parse(readFileSync(join(dir, 'spisak.json'), 'utf8'));
// Izvor zapisa dolazi iz spiska (nastavnikov zapis od 18.10.2026); časan je održan 16.10,
// ali dan časa nije dan zapisa — id i datum izvora moraju ostati onakvi kakvi su u spisku.
const izvor = spisak.source;

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
    // Nedelja izrade nije zapisana u izvoru — originWeek se izostavlja (validator dozvoljava),
    // jer jedino documentedWeek (treći čas) ima dokaz.
    documentedWeek: 3,
    author: { name: entry.ime || 'nepoznat autor', ...(entry.indeks ? { studentNumber: entry.indeks } : {}) },
    attribution: { sourceId: izvor.id, fields: entry.indeks ? ['name', 'studentNumber'] : ['name'] },
    ...(entry.potvrditi ? { attributionStatus: 'pending' } : {}),
    sourceId: izvor.id,
    description: {
      sr: `Prototip sa trećeg časa (16.10.2026), zapis nastavnika${entry.potvrditi ? '; atribucija čeka potvrdu studenta' : ''}.`,
      en: `Prototype from the third class (2026-10-16), teacher's record${entry.potvrditi ? '; attribution pending student confirmation' : ''}.`,
    },
    photos: rad.slike.filter(p => p.ok).map((p, i) => ({
      id: `${id}-foto-${String(i + 1).padStart(2, '0')}`,
      src: `data/prototipovi/${id}/${p.file.toLowerCase()}`,
      sha256: p.sha256, width: p.width, height: p.height,
      alt: { sr: `Fotografija prototipa „${entry.rad}”`, en: `Photograph of the “${entry.rad}” prototype` },
      caption: { sr: `Red ${i + 1} u nizu slikanja.`, en: `Frame ${i + 1} in the photographic sequence.` },
      sourceId: izvor.id,
    })),
  });
}

const predlog = {
  schema: 'course-prototypes/v1',
  sources: [{
    id: izvor.id, recordedOn: izvor.recordedOn,
    description: izvor.description,
  }],
  items,
  observations: [],
};

const ukupno = nalazi.reduce((n, r) => n + r.slike.length, 0);

// Cuvar: bez ulaznih fotografija alat ne prepisuje postojeci prihvat praznim.
if (ukupno === 0) {
  console.log(`Radova u spisku: ${spisak.radovi.length}`);
  console.log('Folderi sa slikama: 0, fotografija: 0 — postojeci prihvat.json i predlog-registra.json nisu dirani.');
  console.log('Cekam slike: prebaci ih u data/cas-03/slike/<rb>-<slug>/ i pokreni ponovo.');
  process.exit(0);
}

writeFileSync(join(outDir, 'prihvat.json'), JSON.stringify({ provereno: new Date().toISOString(), nalazi, evidencija }, null, 1));
writeFileSync(join(outDir, 'predlog-registra.json'), JSON.stringify(predlog, null, 1));

console.log(`Radova u spisku: ${spisak.radovi.length}`);
console.log(`Folderi sa slikama: ${nalazi.filter(r => r.postoji).length}, fotografija: ${ukupno}, u predlogu registra: ${predlog.items.length}`);
for (const g of evidencija) console.log('!', g);
if (ukupno === 0) console.log('Čekam slike: prebaci ih u data/cas-03/slike/<rb>-<slug>/ i pokreni ponovo.');
