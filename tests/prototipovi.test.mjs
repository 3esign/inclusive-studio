import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { setLanguage } from '../assets/core.js';
import { validatePrototypes, renderPrototypes, prototypeTeaser } from '../assets/prototipovi-core.js';

const root = new URL('../', import.meta.url);
const data = JSON.parse(await readFile(new URL('data/prototipovi.json', root), 'utf8'));
const initial = [
  ['zmijica-2026', 'Zmijica', 'Ivana Simić', '141/2024', 'bd720059492d0db434998c7d2f39923e83d4a3e5a316d4bab93ebfa8130eaa9c'],
  ['muzicka-kutija-2026', 'Muzička Kutija', 'Nikola Pajić', '49/24', 'b287f28a4f0ddf3f036d3ffb4d8e84a61647250836ef7d49cc037ae122205c97'],
  ['zgradica-2026', 'Zgradica', 'Teodora Radojičić', '72/24', '548460e82415964a00ca0ced18618e21db98e1183174cdf199ac60ff1184e4c3'],
  ['sudoku-2026', 'Sudoku', 'Nađa Stanić', '151/24', '0f8dbac6f927a3d4ca052830609b41231fb119b77b4f4b6d3827f138faeecf2a'],
  ['pogodilica-2026', 'Pogodilica', 'Todorić Teodora', '39/24', 'e78005d77caa5ea1ea28b6f755d1518cde2e07070e1cc68bdafe02d6364aa7ac']
];
const clone = () => structuredClone(data);
test('the supplied five photographs retain their exact teacher-provided titles and attribution in current or recorded earlier editions', async () => {
  assert.deepEqual(validatePrototypes(data), []);
  for (const [id, title, name, studentNumber, hash] of initial) {
    const editions = [...data.items, ...(data.revizije || []).flatMap(r => [r.before, r.after])].filter(i => i.id === id);
    const edition = editions.find(i => i.title === title && i.author.name === name && i.author.studentNumber === studentNumber && i.photos[0].sha256 === hash);
    assert.ok(edition, 'Preserve the original evidence when revising ' + id);
    assert.equal(createHash('sha256').update(await readFile(new URL(edition.photos[0].src, root))).digest('hex'), hash);
  }
});
test('an additional independent prototype renders without modifying templates or erasing existing records', () => {
  const next = clone(), item = structuredClone(next.items[0]);
  Object.assign(item, { id: 'new-example', title: 'Novi rad' });
  item.photos = item.photos.map(p => ({ ...p, id: 'new-example-photo', src: 'data/prototipovi/new-example/01.jpg' }));
  next.items.push(item);
  assert.deepEqual(validatePrototypes(next), []);
  const html = renderPrototypes(next);
  assert.match(html, /id="new-example"/);
  for (const original of data.items) assert.ok(html.includes(`id="${original.id}"`));
  assert.equal((html.match(/data-prototype-attribution=/g) || []).length, data.items.length + 1);
});
test('invalid attribution, duplicates, foreign fields and unsafe photo paths are rejected', () => {
  for (const mutate of [
    d => { d.items[0].attribution = null; },
    d => { d.items[0].attribution.sourceId = 'unknown-source'; },
    d => { d.items[0].author.email = 'private@example.invalid'; },
    d => { d.items.push(structuredClone(d.items[0])); },
    d => { d.items[0].photos[0].src = '../private.jpg'; },
    d => { d.items[0].photos[0].src = 'https://example.invalid/track.jpg'; },
    d => { d.items[0].photos[0].sha256 = 'unverified'; },
    d => { d.items[0].photos[0].width = 0; },
    d => { d.items[0].description.en = ''; },
    d => { d.items[0].status = 'approved-for-users'; }
  ]) { const invalid = clone(); mutate(invalid); assert.ok(validatePrototypes(invalid).length); assert.throws(() => renderPrototypes(invalid)); }
});
test('source text is escaped rather than executed in names, descriptions and captions', () => {
  const d = clone(); d.items[0].title = '<script>alert(1)</script>';
  d.items[0].author.name = '<img src=x onerror=alert(1)>';
  d.items[0].description.sr = '<b>untrusted</b>';
  d.items[0].photos[0].alt.sr = '" onerror="alert(1)';
  setLanguage('sr'); const html = renderPrototypes(d);
  assert.ok(!html.includes('<script>')); assert.ok(!html.includes('<img src=x')); assert.ok(html.includes('&lt;b&gt;untrusted&lt;/b&gt;'));
  assert.ok(html.includes('&quot; onerror=&quot;alert(1)'));
});
test('association-use observations need their own date, source, photograph and publication context', () => {
  const d = clone();
  const event = { id: 'observation-example', prototypeId: d.items[0].id, kind: 'association-use', occurredOn: '2026-10-15', sourceId: d.sources[0].id, summary: { sr: 'Zabeleženo opažanje.', en: 'Recorded observation.' }, photos: [{ ...d.items[0].photos[0], id: 'observation-photo', src: 'data/prototipovi/observation-example/01.jpg' }], publication: { sourceId: d.sources[0].id, scope: 'association-observation' } };
  d.observations.push(event); assert.deepEqual(validatePrototypes(d), []);
  setLanguage('sr'); assert.match(renderPrototypes(d), /Zapažanja iz udruženja/);
  for (const key of ['occurredOn', 'sourceId', 'publication', 'prototypeId']) { const invalid = structuredClone(d); delete invalid.observations[0][key]; assert.ok(validatePrototypes(invalid).length); }
  d.observations[0].occurredOn = '2026-02-31'; assert.ok(validatePrototypes(d).length);
});
test('static, live and translated views preserve every author and prototype; summaries use the same registry', async () => {
  setLanguage('sr');
  for (const [file, marker, expected] of [['prototipovi.html', 'prototipovi', renderPrototypes(data)], ['index.html', 'prototype-teaser', prototypeTeaser(data)], ['sledeci.html', 'prototype-teaser', prototypeTeaser(data)]]) {
    const html = await readFile(new URL(file, root), 'utf8');
    assert.equal(html.split(`<!-- ${marker}:start -->`)[1].split(`<!-- ${marker}:end -->`)[0], expected);
  }
  setLanguage('en'); const english = renderPrototypes(data);
  assert.match(english, /Brought prototypes/);
  for (const item of data.items) { assert.ok(english.includes(item.author.name)); assert.ok(english.includes(item.author.studentNumber)); assert.ok(english.includes(item.title)); }
  setLanguage('sr');
});
