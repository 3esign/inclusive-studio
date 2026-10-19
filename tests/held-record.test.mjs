import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { heldRecord, heldSection, heldIntro, lessonImages } from '../assets/held-record.js';
import { setLanguage, esc } from '../assets/core.js';
import { renderVisitLead, validateVisit } from '../assets/poseta-core.js';
const root = new URL('../', import.meta.url);
const json = async p => JSON.parse(await readFile(new URL(p, root), 'utf8'));
const tok = await json('data/tok.json');
const visit = await json('data/poseta.json');
const prototypes = await json('data/prototipovi.json');
assert.deepEqual(validateVisit(visit), [], 'visit register must pass its own rules');

test('the held landing retains each lesson photograph, caption and result in static and live reading paths', async () => {
  setLanguage('sr');
  const page = await readFile(new URL('index.html', root), 'utf8');
  const weeks = new Map();
  for (const item of tok.odrzano) {
    if (!Number.isInteger(item.nedelja)) continue;
    const week = await json(`data/material/w${String(item.nedelja).padStart(2, '0')}.json`);
    weeks.set(item.nedelja, week);
    const rendered = heldRecord(item, week);
    for (const image of lessonImages(week)) {
      assert.ok(rendered.includes(`src="${esc(image.src)}"`));
      assert.ok(rendered.includes(esc(image.alt.sr)));
      assert.ok(rendered.includes(esc(image.caption.sr)));
      assert.ok(page.includes(`src="${esc(image.src)}"`), 'photograph missing when JavaScript is unavailable');
      assert.ok((await readFile(new URL(image.src, root))).length > 0, 'photograph must exist, not merely have a link');
    }
    for (const result of item.rezultati) assert.ok(rendered.includes(esc(result.sta.sr)), 'an actual outcome was lost');
  }
  assert.ok(page.includes(heldIntro()), 'static intro differs from live Serbian intro');
  assert.ok(page.includes(heldSection(tok, weeks, { visit, prototypes })), 'static class records are stale: run tools/held-baseline.mjs');
});

test('the landing is chronological: each visit and each work strip stands inside its own week', async () => {
  setLanguage('sr');
  const page = await readFile(new URL('index.html', root), 'utf8');
  const lead = renderVisitLead(visit, prototypes);
  assert.ok(page.includes(lead), 'stale visit lead: run tools/held-baseline.mjs');
  // Course order (teacher's instruction of 19.10.2026): the oldest class opens the page.
  const weekMarks = [...page.matchAll(/Nedelja (\d+)<\/p>/g)].map(match => Number(match[1]));
  assert.deepEqual(weekMarks, [...tok.odrzano].sort((a, b) => a.nedelja - b.nedelja).map(item => item.nedelja), 'records must read oldest first');
  // The visit belongs to its week: after the week-2 record, before the week-3 record.
  const leadPos = page.indexOf('field-visit visit-lead');
  const w2Pos = page.indexOf('Nedelja 2</p>');
  const w3Pos = page.indexOf('Nedelja 3</p>');
  assert.ok(w2Pos >= 0 && leadPos > w2Pos && w3Pos > leadPos, 'the visit lead must stand inside the week of the visit');
  // No mixed strip above the records: the first teaser on the page is week 2's.
  assert.ok(!page.includes('<!-- prototype-teaser:start -->'), 'the standalone mixed teaser is withdrawn from the landing');
  assert.ok(page.indexOf('prototype-teaser-title-w2') > w2Pos && page.indexOf('prototype-teaser-title-w2') < w3Pos, 'earlier work strip stays inside week two');
  assert.ok(!page.includes('prototype-teaser-title-w3'), 'withdrawn third-class photos must not appear');
  for (const person of visit.participants) {
    assert.equal(page.split(esc(person.name)).length - 1, 1, person.name + ' must appear exactly once on the held page');
  }
  assert.ok(lead.includes('visit-compact'), 'the participants are shown discreetly on the lead');
  assert.ok(lead.includes('data/prototipovi/'), 'the lead shows photographs from the visit');
  assert.ok(page.includes('Temeljna analiza posete'), 'the lead must open the analysis page');
  assert.ok(!heldSection(tok, new Map()).includes('data-visit-participants'), 'without the visit register the records stay free of the visit panel');
});

test('the image reading path translates descriptions and retains provenance without inventing a class photograph', async () => {
  const item = tok.odrzano.find(i => Number.isInteger(i.nedelja));
  const week = await json(`data/material/w${String(item.nedelja).padStart(2, '0')}.json`);
  setLanguage('en');
  const html = heldRecord(item, week);
  for (const image of lessonImages(week)) {
    assert.ok(html.includes(esc(image.alt.en)));
    assert.ok(html.includes(esc(image.caption.en)));
  }
  assert.ok(html.includes('Photographs from the lesson material'));
  // 12.10.2026 (course lead's order): the records-and-sources details is withdrawn from the
  // page; the locator lives in data/tok.json, not on the public surface.
  assert.ok(!html.includes(esc(item.izvor)), 'the source locator must not be shown on the page');
  setLanguage('sr');
});

test('oldest held date opens the reading path; a malformed image cannot become an executable link', () => {
  setLanguage('sr');
  const record = (n, date) => Object.freeze({ nedelja: n, naslov: { sr: `Čas ${n}` }, odrzan: date, rezultati: [], izvor: 'zapis' });
  const old = record(1, '2026-10-02');
  const records = Object.freeze([record(2, '2026-10-09'), record(10, '2026-12-04'), old, record(3, '2026-10-16')]);
  const before = JSON.stringify(records);
  const html = heldSection({ odrzano: records }, new Map());
  assert.deepEqual([...html.matchAll(/<h3>Čas (\d+)<\/h3>/g)].map(match => Number(match[1])), [1, 2, 3, 10]);
  assert.equal(JSON.stringify(records), before, 'display order must not rewrite the original course record');
  assert.deepEqual(lessonImages({ blocks: [
    { kind: 'image', src: 'javascript:alert(1)' },
    { kind: 'image', src: 'data/../../private.jpg' },
    { kind: 'image', src: 'data/photo.jpg" onerror="alert(1)' }
  ] }), []);
  assert.ok(!heldRecord({ ...old, naslov: { sr: '<script>bad</script>' } }, {}).includes('<script>'));
});
