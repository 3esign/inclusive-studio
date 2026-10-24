// The second association visit (23.10.2026). 24.10.2026, teacher: every frame is
// published, every frame names the work recognised in it, and the visit is its own page —
// the class page carries the attachment and one door, not the whole dossier.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { setLanguage } from '../assets/core.js';
import { validateVisit } from '../assets/poseta-core.js';
import { renderVisitDossier } from '../assets/visit-dossier.js';
import { renderCas03 } from '../assets/cas03-core.js';

const root = new URL('../', import.meta.url);
const json = async p => JSON.parse(await readFile(new URL(p, root), 'utf8'));
const v = await json('data/poseta-2026-10-23.json');
const prototypes = await json('data/prototipovi.json');

test('the visit register of 23.10 is valid and keeps the teacher’s roster', () => {
  assert.deepEqual(validateVisit(v), []);
  assert.equal(v.participants.length, 17);
  assert.equal(v.week, 4);
  assert.equal(v.occurredOn, '2026-10-23');
});

test('every frame of the day is published, fingerprinted, and the folder holds nothing else', async () => {
  assert.equal(v.photos.length, 31);
  const hashes = new Set();
  for (const p of v.photos) {
    const bytes = await readFile(new URL(p.src, root));
    assert.equal(createHash('sha256').update(bytes).digest('hex'), p.sha256);
    assert.equal(bytes.readUInt16BE(0), 0xffd8);
    hashes.add(p.sha256);
  }
  assert.equal(hashes.size, 31);
  const files = await readdir(new URL('data/prototipovi/poseta-w04/', root));
  assert.deepEqual(files.sort(), v.photos.map(p => p.src.split('/').at(-1)).sort());
  // Nothing is held back any more: the raw intake and the served set are the same frames.
  const raw = (await readdir(new URL('data/cas-04/slike-poseta/', root))).filter(f => f.endsWith('.jpg'));
  assert.equal(raw.length, 31);
  const published = new Set(v.photos.map(p => p.src.split('/').at(-1).replace('camera-', '')));
  assert.deepEqual(raw.filter(f => !published.has(f)), []);
  const config = await readFile(new URL('_config.yml', root), 'utf8');
  assert.ok(config.includes('data/cas-04/slike-poseta'), 'sirovi prijem posete ostaje van serviranja');
});

test('a frame names a work the register holds, and a work finding cites only its own frames', () => {
  const known = new Set((prototypes.galleries || []).map(g => g.id));
  const bound = new Set();
  for (const p of v.photos) for (const id of p.radovi || []) { assert.ok(known.has(id), p.id + ' names an unknown work: ' + id); bound.add(id); }
  assert.equal(bound.size, 8, 'eight works were recognised across the frames');
  for (const f of v.findings.filter(f => f.work)) {
    assert.ok(bound.has(f.work), 'a work finding names a recognised work');
    for (const id of f.photoIds) assert.ok((v.photos.find(p => p.id === id).radovi || []).includes(f.work), f.work + ' cites a frame it was not recognised in');
  }
  assert.deepEqual(v.photos.filter(p => !(p.radovi || []).length), [], 'after 24.10 every frame names the work recognised in it');
  // The rule must bite: a finding moved onto a frame of another work is refused.
  const broken = structuredClone(v);
  const stripped = broken.photos.at(-1);
  stripped.radovi = [];
  broken.findings.find(f => f.work).photoIds = [stripped.id];
  assert.ok(validateVisit(broken).length, 'a finding may not cite a frame without its work');
});

test('the dossier page carries every frame, grouped under the work recognised in it', async () => {
  const html = await readFile(new URL('poseta-w04.html', root), 'utf8');
  for (const lang of ['sr', 'en']) {
    setLanguage(lang);
    const rendered = renderVisitDossier(v, prototypes);
    for (const p of v.photos) assert.ok(rendered.includes(p.src), lang + ': nedostaje kadar ' + p.id);
    for (const f of v.findings) assert.ok(rendered.includes(f.title[lang]), lang + ': nedostaje nalaz');
    // Every frame a finding cites must have an anchor on the same page.
    for (const f of v.findings) for (const id of f.photoIds) assert.ok(rendered.includes('id="' + id + '"'));
    for (const id of new Set(v.photos.flatMap(p => p.radovi || []))) assert.ok(rendered.includes('id="poseta-' + id + '"'), lang + ': nedostaje blok rada ' + id);
  }
  setLanguage('sr');
  assert.ok(html.includes(renderVisitDossier(v, prototypes)), 'the static baseline is the same renderer');
});

test('the class page carries the attachment and one door, not the whole dossier', async () => {
  const spisak = await json('data/cas-04/spisak.json');
  assert.equal(spisak.posetaStrana, 'poseta-w04.html');
  for (const lang of ['sr', 'en']) {
    setLanguage(lang);
    const html = renderCas03(spisak, prototypes, v);
    assert.ok(html.includes('class="field-visit visit-attachment"'), lang + ': prilog posete nije na strani');
    assert.ok(html.includes('href="poseta-w04.html"'), lang + ': nema vrata ka celoj poseti');
    assert.ok(html.indexOf('visit-attachment') < html.indexOf('cas03-rows-title'), lang + ': prilog mora stajati iznad spiska');
    const frames = v.photos.filter(p => html.includes(p.src)).length;
    assert.ok(frames > 0 && frames <= 4, lang + `: prilog nosi korice, ne ceo dosije (${frames})`);
    assert.ok(!html.includes('visit-finding'), lang + ': čitanje posete stoji u dosijeu, ne na strani časa');
  }
  setLanguage('sr');
});

test('the class page no longer retells how the photographs reached the site', async () => {
  const spisak = await json('data/cas-04/spisak.json');
  assert.ok(!('prenos' in spisak) && !('prijem' in spisak), 'intake prose is not class material');
  const html = await readFile(new URL('cas-04.html', root), 'utf8');
  for (const phrase of ['telefon', 'DCIM', 'prenete su']) assert.ok(!html.includes(phrase), 'strana časa pominje prenos: ' + phrase);
});
