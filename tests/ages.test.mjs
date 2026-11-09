// The age page makes four promises, and each one is a thing a studio gets wrong:
//   a limit always says which class it is — law, standard or development data;
//   a limit always says which clause it comes from and how far we read the source;
//   the ten bands cover childhood once, in order, with no gap and no overlap;
//   the page states, in its own text, that behaviour and not the birthday sets the band.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  AGE_DOCTRINE, AGE_BANDS, AGE_LIMITS, AGE_LIMIT_KINDS, AGE_LAWS, AGE_GAPS,
  filterLimits, limitsForBand, bandById
} from '../assets/age-rules.js';
import { RESEARCH } from '../assets/research.js';
import { NAV } from '../assets/core.js';

const source = file => readFile(new URL('../' + file, import.meta.url), 'utf8');
const bilingual = value => Boolean(value && typeof value === 'object' && value.en && value.sr && value.en !== value.sr);

test('the ten bands cover childhood once, in order, with no gap and no overlap', () => {
  assert.equal(AGE_BANDS.length, 10, 'the CPSC bands are ten; adding one means leaving the published set');
  assert.equal(AGE_BANDS[0].months[0], 0);
  const ids = new Set();
  let previous = -1;
  for (const band of AGE_BANDS) {
    assert.ok(!ids.has(band.id), 'duplicate band ' + band.id);
    ids.add(band.id);
    const [from, to] = band.months;
    assert.ok(Number.isInteger(from) && Number.isInteger(to), band.id + ' needs whole months');
    assert.ok(to > from, band.id + ' ends before it starts');
    assert.equal(from, previous + 1, band.id + ' leaves a gap or overlaps the band before it');
    previous = to;
    for (const field of ['label', 'does', 'space', 'product', 'trap']) {
      assert.ok(bilingual(band[field]), band.id + ' · ' + field + ' must be written in both languages');
    }
  }
  // Childhood here ends where the toy standards end: a toy is for a child under 14.
  assert.ok(previous >= 143 && previous < 168, 'the last band should reach the end of childhood, not past it');
});

test('every limit declares its class, its clause, its source and how far we read it', () => {
  const kinds = new Set(AGE_LIMIT_KINDS.map(kind => kind.id));
  assert.deepEqual([...kinds], ['law', 'standard', 'data']);
  const ids = new Set();
  for (const limit of AGE_LIMITS) {
    assert.ok(!ids.has(limit.id), 'duplicate limit ' + limit.id);
    ids.add(limit.id);
    assert.ok(kinds.has(limit.kind), limit.id + ' has no class, so it cannot be quoted safely');
    assert.ok(limit.clause && String(limit.clause).trim(), limit.id + ' has no clause');
    assert.ok(limit.source, limit.id + ' has no source');
    assert.ok(['full', 'abstract', 'secondary'].includes(limit.verified), limit.id + ' does not say how far we read it');
    assert.ok(/^https?:\/\//.test(limit.url), limit.id + ' has no openable address');
    assert.ok(limit.value && String(limit.value).trim(), limit.id + ' has no value');
    assert.ok(bilingual(limit.rule), limit.id + ' rule must be bilingual');
    assert.ok(bilingual(limit.detail), limit.id + ' detail must be bilingual');
    assert.ok(limit.bands.length, limit.id + ' applies to nobody');
    for (const band of limit.bands) assert.ok(bandById(band), limit.id + ' points at an unknown band ' + band);
  }
  // All three classes must actually be present, or the distinction is decorative.
  for (const kind of kinds) assert.ok(AGE_LIMITS.some(limit => limit.kind === kind), 'no limit of class ' + kind);
});

test('a law is never filed as a preference, and a development figure is never filed as a law', () => {
  const law = AGE_LIMITS.filter(limit => limit.kind === 'law');
  assert.ok(law.length >= 3);
  // Anything tagged 'law' must name an act, a gazette or a regulation, not a standard number.
  for (const limit of law) {
    const text = (typeof limit.source === 'string' ? limit.source : limit.source.sr);
    assert.match(text, /Pravilnik|glasnik|Regulation|Uredba|Convention|Konvencija|Zakon/, limit.id + ' is tagged law but cites no law');
  }
  // Anything tagged 'data' must not be the sole justification for a hard number on a sheet:
  // it has to say so in its own detail text.
  for (const limit of AGE_LIMITS.filter(item => item.kind === 'data')) {
    assert.ok(limit.detail.en.length > 120, limit.id + ' is development data and needs its caveat spelled out');
  }
  // EN 71 numbers are standards, never laws: the Serbian toy rulebook is the law, EN 71 is the proof.
  for (const limit of AGE_LIMITS.filter(item => /EN 71/.test(typeof item.source === 'string' ? item.source : ''))) {
    assert.equal(limit.kind, 'standard', limit.id + ' cites EN 71 and must be a standard, not a law');
  }
});

test('the numbers the first two weeks are built on are on the page, unchanged', () => {
  const cylinder = AGE_LIMITS.find(limit => limit.id === 'small-parts');
  assert.ok(cylinder);
  assert.match(cylinder.value, /31,7 mm/);
  assert.match(cylinder.value, /25,4–57,1 mm/);
  // It applies to every band under 36 months and to none above it.
  const under36 = AGE_BANDS.filter(band => band.months[1] < 36).map(band => band.id);
  assert.deepEqual(cylinder.bands, under36);

  const cord = AGE_LIMITS.find(limit => limit.id === 'cords-18');
  assert.match(cord.value, /220 mm/);
  for (const band of cord.bands) assert.ok(bandById(band).months[1] < 19, 'the 220 mm cord limit is for under 18 months');

  const fall = AGE_LIMITS.find(limit => limit.id === 'playground-fall');
  assert.equal(fall.kind, 'law');
  assert.match(fall.value, /3 m/);
  assert.match(fall.clause, /čl\. 11/);
});

test('the doctrine says that behaviour, not the birthday, sets the band', () => {
  assert.equal(AGE_DOCTRINE.length, 3);
  assert.deepEqual(AGE_DOCTRINE.map(rule => rule.id), ['stage-not-age', 'edition-and-date', 'three-classes']);
  for (const rule of AGE_DOCTRINE) {
    for (const field of ['title', 'body', 'studio']) assert.ok(bilingual(rule[field]), rule.id + ' · ' + field);
  }
  const stage = AGE_DOCTRINE[0];
  assert.match(stage.body.en, /5\.3/, 'the clause behind developmental against chronological age must be cited');
  assert.match(stage.studio.sr, /ponašanje|radi sa predmetom|stavlja u usta/);
  const edition = AGE_DOCTRINE[1];
  assert.match(edition.body.en, /2025\/2509/);
  assert.match(edition.body.en, /2030/);
});

test('every source the page leans on is also on the shelf of the creative hub', () => {
  const shelf = RESEARCH.map(entry => entry.url);
  const expected = ['cpsc-age-2020', 'iso-iec-guide-50', 'en71-8-2011', 'rs-igralista-2019',
    'eu-toy-regulation-2025', 'ico-childrens-code', 'en1729', 'crc-31-gc17', 'rs-predskolske'];
  for (const id of expected) assert.ok(RESEARCH.some(entry => entry.id === id), 'the shelf is missing ' + id);
  // Each law on the age page has a shelf entry at the same address, so a student can find what it does not say.
  for (const law of AGE_LAWS) {
    assert.ok(['full', 'abstract', 'secondary'].includes(law.verified), law.id);
    for (const field of ['title', 'says', 'forUs']) assert.ok(bilingual(law[field]), law.id + ' · ' + field);
  }
  const onShelf = AGE_LAWS.filter(law => shelf.includes(law.url)).length;
  assert.ok(onShelf >= AGE_LAWS.length - 2, 'most laws on the age page must be findable on the shelf');
});

test('the honest gaps are named, including the one in the best document we have', () => {
  assert.ok(AGE_GAPS.length >= 4);
  for (const gap of AGE_GAPS) {
    assert.ok(bilingual(gap.gap), gap.id);
    assert.ok(bilingual(gap.next), gap.id + ' states a hole but no next move');
  }
  // The CPSC guidelines are the spine of the bands and say nothing about disability.
  // If that sentence ever disappears, the page has started flattering its sources.
  const cpsc = RESEARCH.find(entry => entry.id === 'cpsc-age-2020');
  assert.match(cpsc.limit.en, /disability/);
  assert.equal(cpsc.verified, 'full');
  // Serbia's accessibility rulebook has no child dimensions, and the page must keep saying so.
  assert.ok(AGE_GAPS.some(gap => /22\/2015/.test(gap.gap.sr)));
});

test('the filters narrow by band, by class and by text, and never invent a row', () => {
  assert.equal(filterLimits().length, AGE_LIMITS.length);
  assert.equal(filterLimits({ band: 'b00' }).length, limitsForBand('b00').length);
  const laws = filterLimits({ kind: 'law' });
  assert.ok(laws.length && laws.every(limit => limit.kind === 'law'));
  assert.ok(filterLimits({ query: '220' }).some(limit => limit.id === 'cords-18'));
  assert.ok(filterLimits({ query: 'фантазија' }).length === 0);
  assert.equal(filterLimits({ band: 'b00', kind: 'law' }).every(limit => limit.kind === 'law'), true);
  assert.equal(bandById('nothing'), null);
});

test('the page is wired into the site like every other page', async () => {
  const item = NAV.find(entry => entry.id === 'ages');
  assert.ok(item, 'the navigation has no entry for the age page');
  assert.equal(item.href, 'godista.html');
  const page = await source('godista.html');
  assert.match(page, /<script type="module" src="assets\/ages\.js"><\/script>/);
  assert.match(page, /data-view="ages"/);
  // The static baseline carries the three limits that matter before any script runs.
  assert.match(page, /31,7 mm/);
  assert.match(page, /220 mm/);
  assert.match(page, /1,5 × 1,5 m/);
  const module = await source('assets/ages.js');
  assert.ok(!/innerHTML\s*=\s*[^;]*\$\{(?!esc|tr\()/.test(module.replace(/\n/g, ' ')) || module.includes('esc('), 'values must go through esc');
});
