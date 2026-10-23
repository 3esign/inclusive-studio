// The second association visit (23.10.2026), published 24.10.2026. The register names
// twenty-eight of thirty-one frames; three frames in which the faces of association users
// are recognizable stay in the raw intake (data/cas-04/slike-poseta) and out of serving.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { setLanguage } from '../assets/core.js';
import { validateVisit } from '../assets/poseta-core.js';
import { renderCas03 } from '../assets/cas03-core.js';

const root = new URL('../', import.meta.url);
const json = async p => JSON.parse(await readFile(new URL(p, root), 'utf8'));
const v = await json('data/poseta-2026-10-23.json');

test('the visit register of 23.10 is valid and keeps the teacher\u2019s roster', () => {
  assert.deepEqual(validateVisit(v), []);
  assert.equal(v.participants.length, 17);
  assert.equal(v.week, 4);
  assert.equal(v.occurredOn, '2026-10-23');
});

test('every published frame matches its fingerprint and the folder holds nothing else', async () => {
  assert.equal(v.photos.length, 28);
  const hashes = new Set();
  for (const p of v.photos) {
    const bytes = await readFile(new URL(p.src, root));
    assert.equal(createHash('sha256').update(bytes).digest('hex'), p.sha256);
    assert.equal(bytes.readUInt16BE(0), 0xffd8);
    hashes.add(p.sha256);
  }
  assert.equal(hashes.size, 28);
  const files = await readdir(new URL('data/prototipovi/poseta-w04/', root));
  assert.deepEqual(files.sort(), v.photos.map(p => p.src.split('/').at(-1)).sort());
});

test('the three withheld frames stay in the raw intake and out of the register', async () => {
  const raw = (await readdir(new URL('data/cas-04/slike-poseta/', root))).filter(f => f.endsWith('.jpg'));
  assert.equal(raw.length, 31);
  const published = new Set(v.photos.map(p => p.src.split('/').at(-1).replace('camera-', '')));
  const withheld = raw.filter(f => !published.has(f));
  assert.deepEqual(withheld.sort(), ['03.jpg', '06.jpg', '29.jpg']);
  const config = await readFile(new URL('_config.yml', root), 'utf8');
  assert.ok(config.includes('data/cas-04/slike-poseta'), 'sirovi prijem posete ostaje van serviranja');
});

test('the class page carries the visit photographs and findings from that register', async () => {
  const spisak = await json('data/cas-04/spisak.json');
  const prototypes = await json('data/prototipovi.json');
  for (const lang of ['sr', 'en']) {
    setLanguage(lang);
    const html = renderCas03(spisak, prototypes, v);
    for (const p of v.photos) assert.ok(html.includes(p.src), lang + ': nedostaje kadar ' + p.id);
    assert.equal((html.match(/visit-finding/g) || []).length, v.findings.length);
    for (const f of v.findings) assert.ok(html.includes(f.title[lang]));
    // A finding cites frames by their place in the sequence; the anchor must exist.
    for (const f of v.findings) for (const id of f.photoIds) assert.ok(html.includes('id="' + id + '"'));
  }
  setLanguage('sr');
});
