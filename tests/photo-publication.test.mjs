import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { setLanguage } from '../assets/core.js';
import { renderPrototypes, prototypeTeaser, photograph } from '../assets/prototipovi-core.js';
import { renderPoseta } from '../assets/poseta-core.js';
import { renderCas03 } from '../assets/cas03-core.js';
import { publishedPrototypes, withheldWorkIds, withheldPhotoDirectories } from '../assets/photo-publication.js';

const root = new URL('../', import.meta.url);
const read = p => fs.readFileSync(new URL(p, root), 'utf8');
const abs = p => new URL(p, root);
const data = JSON.parse(read('data/prototipovi.json'));
const visit = JSON.parse(read('data/poseta.json'));
const list = JSON.parse(read('data/cas-03/spisak.json'));
const roles = JSON.parse(read('data/cas-03/uloge-slika.json'));

const sha256 = p => crypto.createHash('sha256').update(fs.readFileSync(abs(p))).digest('hex');
const framesIn = dir => (fs.existsSync(abs(dir)) ? fs.readdirSync(abs(dir)).filter(f => f.endsWith('.jpg')).sort() : []);
const nums = files => files.map(f => Number(f.replace('.jpg', ''))).sort((a, b) => a - b);

// The teacher's list is the proof of the photo-to-work link: row order is shooting
// order, `slike` is how many photographs were taken for that work. The classroom
// frame roles follow uloge-slika.json. These are the only two sources of truth.
const week3 = data.items.filter(item => item.documentedWeek === 3);
const rowOf = item => list.radovi.find(r => String(r.rb).padStart(2, '0') === item.id.slice(0, 2));

test('the publication gate is open for the works and closed only for the visit', () => {
  assert.deepEqual([...withheldWorkIds], []);
  assert.deepEqual([...withheldPhotoDirectories], ['poseta-udruzenje']);
});

test('every third-class work from the list is published, and no invented work exists', () => {
  assert.equal(week3.length, 26);
  assert.equal(publishedPrototypes(data).items.filter(i => i.documentedWeek === 3).length, 26);
  assert.equal(data.items.filter(i => i.documentedWeek === 2).length, 8);
  for (const item of week3) {
    const row = rowOf(item);
    assert.ok(row, 'no list row for ' + item.id);
    // The teacher's decision of 19.10.2026: row 26 (Jana Grujić) keeps "Bez naziva" — no invented title.
    assert.ok(row.rad !== null && row.rad !== undefined || item.title === 'Bez naziva', 'list row ' + row.rb + ' has no work name and the entry is not marked "Bez naziva"');
  }
});

test('rows shot before class carry no photographs and are not published as works', () => {
  for (const rb of [1, 2]) {
    const row = list.radovi.find(r => r.rb === rb);
    assert.equal(row.rad, null, 'row ' + rb + ' must stay "not recorded"');
    assert.ok(!data.items.some(i => i.id.slice(0, 2) === String(rb).padStart(2, '0')), 'row ' + rb + ' must not be published');
  }
  const rb20 = list.radovi.find(r => r.rb === 20);
  assert.ok(rb20, 'row 20 must stay in the list');
  assert.ok(!data.items.some(i => i.id.startsWith('20-')), 'row 20 is unconfirmed and must not be published');
});

test('published photographs follow the list exactly: the work frames, never the context frames', () => {
  const removed = new Set(roles.uklonjeno);
  for (const item of week3) {
    const row = rowOf(item);
    const n = row.slike;
    const published = nums((item.photos || []).map(p => p.src.split('/').pop()));
    const expected = n >= 3
      ? Array.from({ length: n - 2 }, (_, k) => k + 2)   // drop box shot and trying-on shot
      : n === 2
        ? [1]                                             // second frame is the environment
        : [1];                                            // a single frame is the work itself
    assert.deepEqual(published, expected, item.id + ' published frames must follow the list (N=' + n + ')');
    const gone = nums([...removed].filter(s => s.startsWith('data/prototipovi/' + item.id + '/')).map(s => s.split('/').pop()));
    const expectedGone = n >= 3 ? [1, n] : n === 2 ? [2] : [];
    assert.deepEqual(gone, expectedGone, item.id + ' removed frames must be exactly the context frames');
  }
});

test('photographs on disk, in the registry and in the list cover every original frame exactly once', () => {
  for (const item of week3) {
    const n = rowOf(item).slike;
    const originals = nums(framesIn('data/cas-03/slike/' + item.id));
    assert.deepEqual(originals, Array.from({ length: n }, (_, k) => k + 1), item.id + ' originals must be untouched');
    const onDisk = nums(framesIn('data/prototipovi/' + item.id));
    const registry = nums((item.photos || []).map(p => p.src.split('/').pop()));
    assert.deepEqual(onDisk, registry, item.id + ' public folder must hold exactly the published frames');
    for (const num of registry) assert.ok(originals.includes(num), item.id + ' frame ' + num + ' has no original');
  }
});

test('every published photograph is a real file whose bytes match the registry', () => {
  setLanguage('sr');
  for (const item of publishedPrototypes(data).items) {
    for (const photo of item.photos || []) {
      assert.match(photo.src, /^data\/prototipovi\/[a-z0-9-]+\/[a-z0-9-]+\.jpg$/, 'public path shape: ' + photo.src);
      assert.ok(fs.existsSync(abs(photo.src)), 'missing file: ' + photo.src);
      assert.equal(sha256(photo.src), photo.sha256, 'byte mismatch: ' + photo.src);
      assert.ok(photo.width > 0 && photo.height > 0, 'dimensions missing: ' + photo.src);
      // alt is bilingual: { sr, en }
      assert.ok(photo.alt && photo.alt.sr && photo.alt.sr.trim().length > 0 && photo.alt.en && photo.alt.en.trim().length > 0, 'alt text missing: ' + photo.src);
      assert.ok(!/null/i.test(photo.alt.sr + ' ' + photo.alt.en), 'alt text must not contain "null": ' + photo.src);
    }
  }
});

test('the visit stays withdrawn, with its evidence intact', () => {
  assert.ok(visit.photos.length >= 23, 'visit photographs must stay recorded');
  const html = renderPoseta(visit, data);
  for (const photo of visit.photos) assert.ok(!html.includes(photo.src), 'withheld visit photo leaked: ' + photo.src);
});

test('the gallery page shows all 26 third-class works and the eight earlier ones', () => {
  setLanguage('sr');
  const html = read('prototipovi.html');
  const published = publishedPrototypes(data).items;
  assert.equal(published.length, 34);
  for (const item of published) {
    assert.ok(html.includes('data-prototype="' + item.id + '"'), 'missing from gallery: ' + item.id);
    for (const photo of item.photos || []) assert.ok(html.includes(photo.src), 'missing photo in gallery: ' + photo.src);
  }
  for (const photo of visit.photos) assert.ok(!html.includes(photo.src), 'withheld visit photo in gallery: ' + photo.src);
});

test('no page claims the third-class photographs are withdrawn', () => {
  for (const page of ['index.html', 'prototipovi.html', 'cas-03.html', 'sledeci.html']) {
    const html = read(page);
    assert.ok(!/privremeno su povu[čc]ene/i.test(html), page + ' still claims a temporary withdrawal');
    assert.ok(!/fotografije tre[ćc]eg [čc]asa privremeno/i.test(html), page + ' still claims withdrawn third-class photos');
  }
});

test('the list page keeps all 29 rows, including the unconfirmed ones', () => {
  setLanguage('sr');
  const html = read('cas-03.html');
  const rendered = renderCas03(list, data);
  assert.equal(list.radovi.length, 29);
  assert.equal(rendered.match(/data-cas03-row="\d+"/g).length, 29);
  assert.equal(html.match(/data-cas03-row="\d+"/g).length, 29);
  assert.ok(html.includes('20-'), 'row 20 must stay visible as unconfirmed');
});

test('teasers and prototypes render from one source of truth', () => {
  setLanguage('sr');
  const teaser = prototypeTeaser(data, 3);
  for (const item of publishedPrototypes(data).items.filter(i => i.documentedWeek === 3)) {
    assert.ok(!/withheld|povu[čc]eno/i.test(teaser) || teaser.includes(item.id), 'teaser must not hide week 3');
  }
  const one = publishedPrototypes(data).items.find(i => i.documentedWeek === 3);
  // Render one work on its own; its revisions travel with it, the others' stay behind.
  const single = renderPrototypes({ ...data, items: [one], observations: [], revizije: (data.revizije || []).filter(r => r.prototypeId === one.id) });
  assert.ok(single.includes(one.id));
  assert.equal(photograph(one.photos[0]).includes(one.photos[0].src), true);
});
