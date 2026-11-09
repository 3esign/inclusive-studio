// The fourth association visit with prototypes (06.11.2026, week 6).
// Every visit is presented as a chronological event story (01..N) where each photograph
// appears exactly once, accompanied by inline superintelligence commentary blocks.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import { setLanguage } from '../assets/core.js';
import { validateVisit } from '../assets/poseta-core.js';
import { renderVisitDossier } from '../assets/visit-dossier.js';
import { indexKey } from '../assets/dnevnik-core.js';

const root = new URL('../', import.meta.url);
const json = async p => JSON.parse(await readFile(new URL(p, root), 'utf8'));
const v = await json('data/poseta-2026-11-06.json');
const prototypes = await json('data/prototipovi.json');

test('the visit register of 06.11 is valid, dated to the sixth class, and keeps the 22-student roster', () => {
  assert.deepEqual(validateVisit(v), []);
  assert.equal(v.participants.length, 22);
  assert.equal(v.week, 6);
  assert.equal(v.occurredOn, '2026-11-06');
  assert.equal(new Set(v.participants.map(p => indexKey(p.studentNumber))).size, 22);
});

test('the 21 visit photographs match their hashes, omit the discarded blurred and obstructed frames, and name known works', async () => {
  assert.equal(v.photos.length, 21);
  assert.ok(!v.photos.some(p => p.id.includes('58') || p.src.includes('telefon-58')), 'blurred first frame telefon-58 must stay out');
  assert.ok(!v.photos.some(p => p.id.includes('76') || p.src.includes('telefon-76')), 'obstructed frame telefon-76 must stay out');
  const works = new Set((prototypes.galleries || []).map(g => g.id));
  const files = await readdir(new URL('data/prototipovi/poseta-w06/', root));
  assert.deepEqual(files.sort(), v.photos.map(p => p.src.split('/').at(-1)).sort());
  for (const p of v.photos) {
    const bytes = await readFile(new URL(p.src, root));
    assert.equal(createHash('sha256').update(bytes).digest('hex'), p.sha256, p.id);
    for (const id of p.radovi || []) assert.ok(works.has(id), p.id + ' names an unknown work: ' + id);
  }
});

test('every visit dossier renders as a chronological event story with each frame shown exactly once and superintelligence commentary inline', async () => {
  for (const [regPath, pagePath] of [
    ['data/poseta-2026-10-23.json', 'poseta-w04.html'],
    ['data/poseta-2026-10-30.json', 'poseta-w05.html'],
    ['data/poseta-2026-11-06.json', 'poseta-w06.html']
  ]) {
    const reg = await json(regPath);
    const html = await readFile(new URL(pagePath, root), 'utf8');
    for (const lang of ['sr', 'en']) {
      setLanguage(lang);
      const rendered = renderVisitDossier(reg, prototypes);
      assert.ok(rendered.includes('class="visit-story"'), `${pagePath} (${lang}): missing .visit-story`);
      assert.ok(rendered.includes('class="visit-commentary"'), `${pagePath} (${lang}): missing .visit-commentary`);
      for (const p of reg.photos) {
        const occurrences = rendered.split(`src="${p.src}"`).length - 1;
        assert.equal(occurrences, 1, `${pagePath} (${lang}): frame ${p.id} rendered ${occurrences} times instead of once`);
      }
    }
    setLanguage('sr');
    assert.ok(html.includes(renderVisitDossier(reg, prototypes)), `${pagePath}: static HTML matches renderer`);
  }
});

test('a visitor already in a register keeps that register’s spelling for the same number', () => {
  const known = new Map();
  for (const g of prototypes.galleries || []) {
    if (g.author?.studentNumber) known.set(indexKey(g.author.studentNumber), g.author.name);
  }
  for (const p of v.participants) {
    const name = known.get(indexKey(p.studentNumber));
    if (name) assert.equal(p.name, name);
  }
});
