#!/usr/bin/env node
// Prihvat fotografija jednog časa (PUD). Jedan alat za svaki čas — čas se bira brojem.
// Usage: node tools/cas-prihvat.mjs <cas> [izlazna-fascikla]     (npr. 04)
// Očekuje: data/cas-<cas>/slike/<rb>-<slug>/*.jpg  (npr. 09-brojkice/01.jpg)
// Piše:    data/cas-<cas>/prihvat.json (pregled) i data/cas-<cas>/predlog-registra.json
//          — predlog u obliku koji assets/prototipovi-core.js validira; registar
//            data/prototipovi.json se NE menja automatski.
// Čuvar (20.10.2026): bez ijedne ulazne fotografije alat ne prepisuje postojeći prihvat.
// 23.10.2026: red spiska više ne nosi zastavicu nesigurnosti — ili pokazuje svoj rad ili
// kaže da čeka fotografije, pa predlog ne proizvodi `attributionStatus`.
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const cas = String(process.argv[2] || '').padStart(2, '0');
if (!/^\d{2}$/.test(cas)) {
  console.error('Koji čas? npr: node tools/cas-prihvat.mjs 04');
  process.exit(2);
}
const root = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const dir = join(root, 'data', `cas-${cas}`);
if (!existsSync(join(dir, 'spisak.json'))) {
  console.error(`Nema spiska: data/cas-${cas}/spisak.json`);
  process.exit(2);
}
const outDir = process.argv[3] ? resolve(process.argv[3]) : dir;
mkdirSync(outDir, { recursive: true });
const karantinSlikeDir = process.env.CAS_SLIKE_KARANTIN_DIR || join('C:\\Svemir\\data\\karantin-slika\\inclusive-studio', `cas-${cas}`, 'slike');
const slikeDir = existsSync(join(dir, 'slike')) ? join(dir, 'slike') : karantinSlikeDir;
const spisak = JSON.parse(readFileSync(join(dir, 'spisak.json'), 'utf8'));
// Dan časa nije dan zapisa — id i datum izvora ostaju onakvi kakvi su u spisku.
const izvor = spisak.source;
const nedelja = spisak.nedelja ?? Number(cas);
const danSr = spisak.odrzan.split('-').reverse().join('.') + '.';

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
const folderOf = entry => `${String(entry.rb).padStart(2, '0')}-${slug(entry.rad || entry.ime || 'unnamed')}`;

const nalazi = [];
for (const entry of spisak.radovi) {
  const folderName = folderOf(entry);
  const folder = join(slikeDir, folderName);
  const rad = { rb: entry.rb, folder: `data/cas-${cas}/slike/${folderName}`, ocekovano: entry.slike, postoji: existsSync(folder), slike: [] };
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

// Provera heš-manifesta iz depoa (standard od cas-06 nadalje; ako manifest postoji, bajtovi se moraju slagati).
const manifestFiles = existsSync(dir)
  ? readdirSync(dir).filter(f => /^MANIFEST-depo-\d+\.json$/.test(f)).sort()
  : [];
const manifestGreske = [];
for (const mf of manifestFiles) {
  const m = JSON.parse(readFileSync(join(dir, mf), 'utf8'));
  for (const f of m.files || []) {
    const rel = String(f.file || '').replace(/^slike\//, '');
    const p = join(slikeDir, ...rel.split('/'));
    if (!existsSync(p)) {
      manifestGreske.push(`${mf}: nedostaje predati fajl ${f.file}`);
    } else {
      const h = createHash('sha256').update(readFileSync(p)).digest('hex');
      if (h !== f.sha256) manifestGreske.push(`${mf}: sha256 neslaganje za ${f.file}`);
    }
  }
}

// Evidencija: nečitljive dimenzije, odstupanje od spiska i heš-manifest iz depoa.
const evidencija = [
  ...manifestGreske,
  ...nalazi.flatMap(r => r.slike.filter(p => !p.ok).map(p => `${r.folder}/${p.file}: dimenzije nisu pročitane`)),
  ...nalazi.filter(r => r.postoji && Number.isInteger(r.ocekovano) && r.slike.length !== r.ocekovano)
    .map(r => `${r.folder}: nađeno ${r.slike.length}, u spisku stoji ${r.ocekovano}`),
];

// Predlog registra — samo radovi sa bar jednom važećom slikom.
const items = [];
for (const rad of nalazi) {
  const entry = spisak.radovi.find(e => e.rb === rad.rb);
  if (!rad.slike.some(p => p.ok)) continue;
  const id = folderOf(entry);
  const naziv = entry.rad || 'Bez naziva';
  items.push({
    id,
    title: naziv,
    kind: 'prototype', authorRole: 'student', medium: 'physical', status: 'documented',
    // Nedelja izrade nije zapisana u izvoru — originWeek se izostavlja (validator dozvoljava),
    // jer jedino documentedWeek (nedelja ovog časa) ima dokaz.
    documentedWeek: nedelja,
    author: { name: entry.ime || 'nepoznat autor', ...(entry.indeks ? { studentNumber: entry.indeks } : {}) },
    attribution: { sourceId: izvor.id, fields: entry.indeks ? ['name', 'studentNumber'] : ['name'] },
    sourceId: izvor.id,
    description: {
      sr: `Prototip sa časa ${danSr} (nedelja ${nedelja}), zapis profesora.`,
      en: `Prototype from the class of ${spisak.odrzan} (week ${nedelja}), professor's record.`,
    },
    photos: rad.slike.filter(p => p.ok).map((p, i) => ({
      id: `${id}-foto-${String(i + 1).padStart(2, '0')}`,
      src: `data/prototipovi/${id}/${p.file.toLowerCase()}`,
      sha256: p.sha256, width: p.width, height: p.height,
      alt: { sr: `Fotografija prototipa „${naziv}”`, en: `Photograph of the “${naziv}” prototype` },
      caption: { sr: `Red ${i + 1} u nizu slikanja.`, en: `Frame ${i + 1} in the photographic sequence.` },
      sourceId: izvor.id,
    })),
  });
}

const predlog = {
  schema: 'course-prototypes/v1',
  sources: [{ id: izvor.id, recordedOn: izvor.recordedOn, description: izvor.description }],
  items,
  observations: [],
};

const ukupno = nalazi.reduce((n, r) => n + r.slike.length, 0);
const ocekovanoUkupno = spisak.radovi.reduce((n, r) => n + (r.slike || 0), 0);

console.log(`Čas ${cas} (${danSr}) — radova u spisku: ${spisak.radovi.length}, očekivanih fotografija: ${ocekovanoUkupno}`);

if (ukupno === 0) {
  console.log('Folderi sa slikama: 0, fotografija: 0 — postojeći prihvat.json i predlog-registra.json nisu dirani.');
  console.log(`Čekam slike: prebaci ih u data/cas-${cas}/slike/<rb>-<slug>/ i pokreni ponovo. Očekivani folderi:`);
  for (const entry of spisak.radovi.filter(e => e.slike > 0)) console.log(`  data/cas-${cas}/slike/${folderOf(entry)}/  (${entry.slike})`);
  process.exit(0);
}

writeFileSync(join(outDir, 'prihvat.json'), JSON.stringify({ provereno: new Date().toISOString(), cas, izvorSlika: slikeDir, ...(manifestFiles.length ? { manifesti: manifestFiles } : {}), nalazi, evidencija }, null, 1));
writeFileSync(join(outDir, 'predlog-registra.json'), JSON.stringify(predlog, null, 1));
const kontaktOut = process.argv[3] ? join(outDir, 'kontakt-list.html') : join(slikeDir, '..', 'kontakt-list.html');
mkdirSync(resolve(kontaktOut, '..'), { recursive: true });
const kontaktHtml = `<!doctype html><html lang="sr"><head><meta charset="utf-8"><title>Kontakt-list časa ${cas} (${danSr})</title>
<style>body{font-family:system-ui,sans-serif;background:#111418;color:#e6edf3;padding:20px}.row{border:1px solid #2a313d;border-radius:8px;padding:12px;margin-bottom:12px;background:#171b22}.warn{border-color:#da3633;background:#2a1517}.thumbs{display:flex;gap:10px;flex-wrap:wrap;margin-top:8px}.thumb{border:1px solid #2a313d;padding:6px;border-radius:6px;font-size:12px}.thumb img{max-width:180px;max-height:140px;object-fit:contain;display:block;margin-bottom:4px;background:#090b0e}</style></head>
<body><h1>Kontakt-list prijema · Čas ${cas} (${danSr})</h1><p>Nijedna slika ne ulazi u javni registar ni <code>DOZVOLJENE_SLIKE.json</code> bez vizuelne potvrde da red odgovara studentu i radu.</p>
${nalazi.map(r => {
  const e = spisak.radovi.find(x => x.rb === r.rb) || {};
  const folderName = folderOf(e);
  const mismatch = r.postoji && Number.isInteger(r.ocekovano) && r.slike.length !== r.ocekovano;
  return `<section class="row ${mismatch ? 'warn' : ''}"><strong>#${r.rb} · ${e.ime || ''} — ${e.rad || ''}</strong> (očekivano: ${r.ocekovano ?? '?'}, nađeno: ${r.slike.length})${mismatch ? ' ⚠ ODSTUPANJE BROJA SLIKA — PROVERI REDOSLED!' : ''}
  <div class="thumbs">${r.slike.map(s => {
    const imgUrl = 'file:///' + join(slikeDir, folderName, s.file).replace(/\\/g, '/');
    return `<div class="thumb"><a href="${imgUrl}" target="_blank" rel="noopener"><img src="${imgUrl}" alt="${s.file}" loading="lazy"></a><div><code>${s.file}</code> (${s.width}×${s.height})</div><div>SHA-256: <code>${s.sha256.slice(0, 16)}…</code></div></div>`;
  }).join('')}</div></section>`;
}).join('\n')}</body></html>\n`;
writeFileSync(kontaktOut, kontaktHtml);
console.log(`Folderi sa slikama: ${nalazi.filter(r => r.postoji).length}, fotografija: ${ukupno}, u predlogu registra: ${predlog.items.length}`);
for (const g of evidencija) console.log('!', g);
if (manifestGreske.length > 0) process.exitCode = 1;
