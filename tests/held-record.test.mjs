import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { heldRecord, heldSection, heldIntro, lessonImages } from '../assets/held-record.js';
import { setLanguage, esc } from '../assets/core.js';
const root = new URL('../', import.meta.url);
const json = async p => JSON.parse(await readFile(new URL(p, root), 'utf8'));
const tok = await json('data/tok.json');

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
  assert.ok(page.includes(heldSection(tok, weeks)), 'static class records are stale: run tools/held-baseline.mjs');
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
  assert.ok(html.includes(esc(item.izvor)), 'source locator must be retained');
  setLanguage('sr');
});

test('newest held date leads the reading path; a malformed image cannot become an executable link', () => {
  setLanguage('sr');
  const old = { naslov: { sr: 'Raniji čas' }, odrzan: '2026-01-02', rezultati: [], izvor: 'zapis' };
  const recent = { ...old, naslov: { sr: 'Noviji čas' }, odrzan: '2026-02-02' };
  const html = heldSection({ odrzano: [old, recent] }, new Map());
  assert.ok(html.indexOf('Noviji čas') < html.indexOf('Raniji čas'));
  assert.deepEqual(lessonImages({ blocks: [
    { kind: 'image', src: 'javascript:alert(1)' },
    { kind: 'image', src: 'data/../../private.jpg' },
    { kind: 'image', src: 'data/photo.jpg" onerror="alert(1)' }
  ] }), []);
  assert.ok(!heldRecord({ ...old, naslov: { sr: '<script>bad</script>' } }, {}).includes('<script>'));
});
