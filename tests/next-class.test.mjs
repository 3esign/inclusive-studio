import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { setLanguage, esc } from '../assets/core.js';
import { emptyTok } from '../assets/tok-core.js';
import { emptyWeek, weekFile } from '../assets/material.js';
import { resolveRefs } from '../assets/blocks.js';
import { nextClassEntry, lastHeldClass, renderNextClass } from '../assets/next-class.js';

const tx = s => ({ sr: s, en: 'EN ' + s });
const held = n => ({ id: `held-${n}`, vrsta: 'cas', nedelja: n, naslov: tx(`Held ${n}`), odrzan: `2026-10-${String(n * 7 - 5).padStart(2, '0')}`, rezultati: [{ sta: tx(`Result ${n}`), izvor: 'Fixture evidence' }], izvor: 'Fixture evidence' });
const waiting = n => ({ id: `next-${n}`, vrsta: 'cas', nedelja: n, naslov: tx(`Next ${n}`), ceka: tx(`Confirm ${n}`), izvor: 'Fixture plan' });
const flow = n => ({ ...emptyTok(), nacelo: tx('Fixture'), odrzano: [held(n - 1)], sledeci: [waiting(n)], ideje: [] });
const week = n => ({ ...emptyWeek(n), title: tx(`Material ${n}`), aim: tx(`Aim ${n}`), bring: [tx(`Bring ${n}`)], blocks: [{ kind: 'heading', text: tx(`Topic ${n}`) }, { kind: 'text', text: tx(`Content ${n}`) }, { kind: 'link', href: `resources.html#week-${n}`, text: tx(`Source ${n}`) }] });
const json = async p => JSON.parse(await readFile(new URL('../' + p, import.meta.url), 'utf8'));

test('next class transitions from 2 to 3 to 4 using only that material and the latest held class', () => {
  setLanguage('sr');
  for (const n of [2, 3, 4]) {
    const tok = flow(n), material = week(n), before = JSON.stringify({ tok, material });
    const html = renderNextClass({ tok, week: material });
    for (const value of [`data-next-week="${n}"`, `Material ${n}`, `Aim ${n}`, `Bring ${n}`, `Topic ${n}`, `Content ${n}`, `resources.html#week-${n}`, `predavanje.html?w=${n}&amp;preview=1`, `index.html?w=${n - 1}`, `Result ${n - 1}`, `Confirm ${n}`]) assert.ok(html.includes(value), value);
    assert.ok(!html.includes(`predavanje.html?w=${n - 1}&amp;preview=1`));
    assert.ok(!html.includes('EN 71-1') && !html.includes('Redosled materijala'));
    assert.ok(html.includes('nacrt — plan čeka potvrdu'));
    assert.equal(JSON.stringify({ tok, material }), before, 'rendering cannot mutate source data');
  }
});

test('the current real preparation includes its own title, links and exercise references', async () => {
  const tok = await json('data/tok.json'), entry = nextClassEntry(tok);
  if (!entry) { assert.ok(renderNextClass({ tok }).includes('Naredni čas još nije upisan.')); return; }
  const material = await json(weekFile(entry.nedelja));
  const html = renderNextClass({ tok, week: material });
  assert.ok(html.includes(esc(material.title.sr)));
  const ids = [...new Set(material.blocks.filter(b => b.kind === 'exercise').map(b => b.ref))];
  for (const id of ids) assert.ok(html.includes(`data-next-exercise="${id}"`));
  assert.equal((html.match(/data-next-exercise=/g) || []).length, ids.length);
  assert.ok(html.includes(`class="button" href="predavanje.html?w=${entry.nedelja}&amp;preview=1"`));
  setLanguage('en'); const english = renderNextClass({ tok, week: material });
  assert.ok(english.includes(esc(material.title.en)));
  if (material.state === 'draft') assert.ok(english.includes('draft — plan awaiting confirmation'));
  setLanguage('sr');
});

test('missing or mismatched next material cannot quietly display a previous week', () => {
  assert.throws(() => renderNextClass({ tok: flow(3), week: week(2) }), /does not match/);
  assert.throws(() => renderNextClass({ tok: flow(3) }), /not an object/);
  const bad = flow(3); bad.odrzano.push(held(3));
  assert.throws(() => nextClassEntry(bad), /follow the held/);
  const empty = flow(3); empty.sledeci = [];
  const html = renderNextClass({ tok: empty });
  assert.ok(html.includes('Naredni čas još nije upisan.'));
  assert.ok(!html.includes('predavanje.html?w='));
  assert.ok(html.includes('Result 2'));
});

test('a valid draft with no detailed blocks or bring list stays useful and labels the missing preparation', () => {
  const material = week(3); material.blocks = []; material.bring = []; delete material.aim;
  const html = renderNextClass({ tok: flow(3), week: material });
  for (const value of ['Material 3', 'Detaljan plan još nije upisan.', 'Spisak za donošenje još nije upisan.', 'Confirm 3', 'Result 2', 'predavanje.html?w=3&amp;preview=1']) assert.ok(html.includes(value), value);
  assert.ok(!html.includes('data-next-exercise=') && !html.includes('Content 2'));
  delete material.blocks;
  assert.throws(() => renderNextClass({ tok: flow(3), week: material }), /blocks must be an array/, 'malformed material is explicitly refused, not displayed as a complete preparation');
});

test('latest held class is selected by held date, not array order; null date never claims confirmation', () => {
  const tok = flow(3); tok.odrzano = [held(2), held(1)];
  assert.equal(lastHeldClass(tok).nedelja, 2);
  const material = week(3); material.dateStatus = 'confirmed';
  assert.ok(renderNextClass({ tok, week: material }).includes('datum nije upisan'));
  assert.ok(!renderNextClass({ tok, week: material }).includes('datum potvrđen'));
});

test('ordered blocks, bilingual meaning and exercise details survive without topic-specific extraction', () => {
  const material = week(3), bank = [{ id: 'fixture-task', title: tx('Task title'), task: tx('Task body'), hand: tx('Deliverable'), check: tx('Check'), source: tx('Bank source') }];
  material.blocks.push(
    { kind: 'image', src: 'data/example.jpg', alt: tx('Meaning <photo>'), caption: tx('Caption') },
    { kind: 'list', items: [tx('List detail')] },
    { kind: 'quote', text: tx('Quotation'), source: 'Author source' },
    { kind: 'measure', text: tx('Measurement'), value: '42 mm', instrument: tx('Ruler') },
    { kind: 'question', items: [tx('Question')] },
    { kind: 'file', href: 'assets/sablon-a3.svg', text: tx('Download') },
    { kind: 'decision', text: tx('Proposed decision') },
    { kind: 'lab', ref: 'fixture-lab' },
    { kind: 'exercise', ref: 'fixture-task', text: tx('Specific instruction') }
  );
  const html = renderNextClass({ tok: flow(3), week: material, exerciseBank: bank });
  for (const token of ['Caption', 'Meaning &lt;photo&gt;', 'List detail', 'Quotation', 'Author source', '42 mm', 'Ruler', 'Question', 'download', 'Predlog zapisa za čas', 'fixture-lab', 'Task body', 'Deliverable', 'Bank source', 'Specific instruction']) assert.ok(html.includes(token), token);
  assert.equal((html.match(/src="data\/example.jpg"/g) || []).length, 1, 'the first photograph appears once');
  assert.ok(html.indexOf('List detail') < html.indexOf('Quotation'));
  assert.ok(!html.includes('width="1400"'), 'unknown photo dimensions must not be invented');
  assert.throws(() => renderNextClass({ tok: flow(3), week: material, exerciseBank: [] }), /Missing referenced exercise/);
});

test('static next-class main equals the shared renderer, including the prototype teaser markers', async () => {
  const tok = await json('data/tok.json'), entry = nextClassEntry(tok);
  const material = entry ? await json(weekFile(entry.nedelja)) : null;
  const prototypes = await json('data/prototipovi.json'), refs = await resolveRefs(material?.blocks || []);
  setLanguage('sr');
  const expected = renderNextClass({ tok, week: material, prototypes, refs });
  const page = await readFile(new URL('../sledeci.html', import.meta.url), 'utf8');
  const actual = page.match(/<main\b[^>]*\bid="main"[^>]*>([\s\S]*?)<\/main>/)?.[1];
  assert.equal(actual, expected);
  assert.equal((actual.match(/<!-- prototype-teaser:start -->/g) || []).length, 1);
  assert.equal((actual.match(/<!-- prototype-teaser:end -->/g) || []).length, 1);
  for (const line of material?.bring || []) assert.ok(actual.includes(esc(line.sr)));
});
