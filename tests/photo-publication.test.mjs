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

test('the publication gate is closed for the visit alone, once the misfiled frames were separated', () => {
  // 23.10.2026, second record: the three disputed frames were looked at and attributed —
  // the two under „brza putanja” are one work (renamed), the one beside „2d lavirint”
  // belongs to the author of list row 20. No third-class work is withheld any more.
  assert.deepEqual([...withheldWorkIds], []);
  assert.deepEqual([...withheldPhotoDirectories], ['poseta-udruzenje']);
});

test('the served public excerpt is the gated registry, with no pending attribution in it', () => {
  // Pages fetch data/prototipovi-javno.json, not the full register: a pending attribution
  // must be absent from the bytes the reader downloads, not merely hidden by the renderer.
  const served = JSON.parse(read('data/prototipovi-javno.json'));
  const gated = publishedPrototypes(data);
  const published = new Set(gated.items.map(item => item.id));
  const expected = { ...gated, revizije: data.revizije.filter(r => published.has(r.prototypeId)) };
  assert.deepEqual(served, expected, 'the public excerpt must be exactly the gated registry');
  const text = read('data/prototipovi-javno.json');
  for (const item of week3.filter(i => i.attributionStatus === 'pending')) {
    assert.ok(!text.includes('"' + item.id + '"'), 'pending record travels to the reader: ' + item.id);
    // The name may still be served — but only through a work of the same person whose
    // attribution the teacher did confirm, never through this pending record.
    const alsoPublished = gated.items.some(other => other.author?.name === item.author.name);
    if (alsoPublished) continue;
    assert.ok(!text.includes(item.author.name), 'pending author name travels to the reader: ' + item.id);
    assert.ok(!text.includes(item.author.studentNumber), 'pending student number travels to the reader: ' + item.id);
    for (const photo of item.photos || []) assert.ok(!text.includes(photo.src), 'pending photograph travels to the reader: ' + photo.src);
  }
});

test('a work whose attribution is pending is withheld from publication until confirmed', () => {
  // Redosled 17–19 iz spiska čeka studentovu potvrdu: rad i njegove fotografije ne smeju
  // u javni pregled dok atribucija nije potvrđena. Oznaka „čeka potvrdu" na kartici
  // dovoljna je samo uz nastavnikovu izričitu odluku — podrazumevano se ne objavljuje.
  const item = week3[0];
  const pending = { ...item, attributionStatus: 'pending' };
  const withPending = { ...data, items: [...data.items.filter(i => i.id !== item.id), pending], observations: data.observations };
  const out = publishedPrototypes(withPending);
  assert.ok(!out.items.some(i => i.id === item.id), 'pending work must not be published');
  assert.ok(!out.observations.some(e => e.prototypeId === item.id), 'observations of a pending work must not be published');
});

test('every third-class work is recorded, and none is left unattributed', () => {
  assert.equal(week3.length, 26);
  // 26 recorded, 26 published: the separation of 23.10.2026 returned every disputed frame
  // to its author, so no third-class work waits on an attribution any more.
  const published = publishedPrototypes(data).items.filter(i => i.documentedWeek === 3);
  assert.equal(published.length, 26);
  const pending = week3.filter(i => i.attributionStatus === 'pending');
  assert.deepEqual(pending.map(i => i.id), []);
  for (const item of pending) assert.ok(!published.some(i => i.id === item.id), 'pending work must not be published: ' + item.id);
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

test('photographs on disk, in the registry and in the list cover every original frame exactly once', t => {
  // Sirovi prijem je lokalni izvor, namerno van prenosivog snapshot-a:
  // u restauriranoj verifikacionoj kopiji ova provera nema sta da cita.
  // t.skip() ne prekida telo testa — bez return-a asercije nastavljaju i pad se krije kao preskok.
  if (!fs.existsSync(abs('data/cas-03/slike'))) return t.skip('sirovi prijem (data/cas-03/slike) nije deo ove kopije');
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

test('the gallery page shows the 26 published third-class works and the eight earlier ones', () => {
  setLanguage('sr');
  const html = read('prototipovi.html');
  const published = publishedPrototypes(data).items;
  assert.equal(published.length, 34);
  for (const item of published) {
    assert.ok(html.includes('data-prototype="' + item.id + '"'), 'missing from gallery: ' + item.id);
    for (const photo of item.photos || []) assert.ok(html.includes(photo.src), 'missing photo in gallery: ' + photo.src);
  }
  // 23.10.2026: all three separated works are in the gallery, each with its own frames.
  for (const id of ['17-putanja', '18-brza-putanja', '19-2d-lavirint']) {
    assert.ok(html.includes('data-prototype="' + id + '"'), 'separated work must be in the gallery: ' + id);
    const item = data.items.find(i => i.id === id);
    for (const photo of item.photos || []) assert.ok(html.includes(photo.src), 'separated work photo must be in the gallery: ' + photo.src);
  }
  assert.equal(data.items.find(i => i.id === '18-brza-putanja').title, '3d lavirint', 'the renamed work keeps its folder but not its wrong title');
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
  const row20 = rendered.match(/<li data-cas03-row="20"[^>]*>/)[0];
  assert.match(row20, /cas03-neizvesno/, 'row 20 must stay visible as unconfirmed');
  assert.ok(html.includes(row20), 'the static page must carry the same unconfirmed row 20');
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
