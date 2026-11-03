// The working week is the one section a teacher fills by hand, so its rules are tested first:
// what the validator refuses, how slides are cut, and whether the files on disk actually pass.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

const load = name => import(new URL(`../assets/${name}`, import.meta.url).href);
const json = async path => JSON.parse(await readFile(new URL(`../${path}`, import.meta.url), 'utf8'));

const {
  validateWeek, validateIndex, validateBlock, toSlides, currentWeek, weekFile,
  weekStats, emptyWeek, serializeWeek, safeHref, BLOCK_KINDS, FORMAT, VERSION
} = await load('material.js');
const { labs } = await load('lab-core.js');
const { exercises } = await load('exercises.js');

const index = await json('data/material/index.json');

test('the material index on disk is valid and points at files that exist', async () => {
  const check = validateIndex(index);
  assert.deepEqual(check.problems, []);
  const files = await readdir(new URL('../data/material/', import.meta.url));
  for (const entry of index.weeks) {
    assert.ok(files.includes(entry.file), `missing file for week ${entry.n}: ${entry.file}`);
    assert.equal(entry.file, weekFile(entry.n).split('/').pop());
  }
});

test('every week file on disk passes the same rules the editor enforces', async () => {
  for (const entry of index.weeks) {
    const week = await json('data/material/' + entry.file);
    const check = validateWeek(week);
    assert.deepEqual(check.problems, [], `week ${entry.n}: ${check.problems.join(' | ')}`);
    assert.equal(week.n, entry.n);
    assert.equal(week.state, entry.state, `week ${entry.n}: state must match the index`);
    assert.equal(week.format, FORMAT);
    assert.equal(week.version, VERSION);
  }
});

test('the index titles match the week files they point at — a redirected week leaves no stale title', async () => {
  for (const entry of index.weeks) {
    const week = await json('data/material/' + entry.file);
    assert.equal(entry.title.en, week.title.en, `week ${entry.n}: index title differs from the week file (en)`);
    assert.equal(entry.title.sr, week.title.sr, `week ${entry.n}: index title differs from the week file (sr)`);
  }
});

test('every lab and exercise a week points at really exists', async () => {
  for (const entry of index.weeks) {
    const week = await json('data/material/' + entry.file);
    for (const block of week.blocks) {
      if (block.kind === 'lab') assert.ok(labs.some(lab => lab.id === block.ref), `week ${entry.n}: unknown lab ${block.ref}`);
      if (block.kind === 'exercise') assert.ok(exercises.some(item => item.id === block.ref), `week ${entry.n}: unknown exercise ${block.ref}`);
    }
  }
});

test('no week invents a teaching date, and a date without a status is refused', async () => {
  for (const entry of index.weeks) {
    const week = await json('data/material/' + entry.file);
    if (week.date === null) continue;
    assert.ok(['confirmed', 'proposed'].includes(week.dateStatus), `week ${entry.n} has a date with no status`);
  }
  const invented = { ...emptyWeek(3), title: { sr: 'x' }, state: 'draft', date: '2026-10-08', dateStatus: 'guessed' };
  assert.ok(validateWeek(invented).problems.some(problem => problem.includes('dateStatus')));
});

test('published material carries a visible revision history, numbered and truthful', async () => {
  for (const entry of index.weeks) {
    const week = await json('data/material/' + entry.file);
    if (week.state !== 'published') continue;
    assert.ok(Array.isArray(week.revizije) && week.revizije.length > 0, `week ${entry.n} is published with no revisions`);
    week.revizije.forEach((r, i) => {
      assert.equal(r.v, i + 1, `week ${entry.n}: revision numbers run 1..n in order`);
      assert.match(r.datum, /^\d{4}-\d{2}-\d{2}$/, `week ${entry.n}: revision ${i + 1} has a date`);
      assert.ok(r.sta && (r.sta.sr || r.sta.en || (typeof r.sta === 'string' && r.sta.trim())), `week ${entry.n}: revision ${i + 1} says what changed`);
    });
    assert.equal(week.updated, week.revizije[week.revizije.length - 1].datum, `week ${entry.n}: "updated" matches the last revision`);
  }
  // The rules themselves: broken histories are refused, not tidied away.
  const base = { ...emptyWeek(3), title: { sr: 'x' }, state: 'published', updated: '2026-10-09' };
  assert.ok(validateWeek({ ...base }).problems.some(p => p.includes('revizije')), 'published without revisions is refused');
  assert.ok(validateWeek({ ...base, revizije: [{ v: 2, datum: '2026-10-09', sta: { sr: 'x' } }] }).problems.some(p => p.includes('"v" must be 1')), 'out-of-order numbering is refused');
  assert.ok(validateWeek({ ...base, revizije: [{ v: 1, datum: '2026-10-08', sta: { sr: 'x' } }] }).problems.some(p => p.includes('updated must equal')), 'a lying "Dopunjeno" line is refused');
  assert.deepEqual(validateWeek({ ...base, revizije: [{ v: 1, datum: '2026-10-09', sta: { sr: 'x' } }], updated: '2026-10-09' }).problems, []);
});

test('an image without a description cannot become material', () => {
  assert.deepEqual(validateBlock({ kind: 'image', src: 'a.jpg', alt: { en: 'A door, 78 cm wide' } }), []);
  const problems = validateBlock({ kind: 'image', src: 'a.jpg', alt: { en: '', sr: '' } });
  assert.ok(problems.length >= 1);
  assert.ok(problems.join(' ').includes('description') || problems.join(' ').includes('alt'));
});

test('a measurement needs an instrument and a quote needs a source', () => {
  assert.ok(validateBlock({ kind: 'measure', text: { en: 'fall' }, value: '14,9 %' }).some(p => p.includes('instrument')));
  assert.deepEqual(validateBlock({ kind: 'measure', text: { en: 'fall' }, value: '14,9 %', instrument: { en: 'phone GNSS ±2 m' } }), []);
  assert.ok(validateBlock({ kind: 'quote', text: { en: 'words' } }).some(p => p.includes('source')));
});

test('unknown kinds and empty required fields are named, not silently dropped', () => {
  assert.ok(validateBlock({ kind: 'carousel' })[0].includes('unknown kind'));
  assert.ok(validateBlock({ kind: 'list', items: [] })[0].includes('items'));
  assert.ok(validateBlock({ kind: 'heading', text: { en: '   ', sr: '' } })[0].includes('text'));
});

test('only http, mailto and relative addresses survive', () => {
  assert.equal(safeHref('https://w3.org'), 'https://w3.org');
  assert.equal(safeHref('data/material/w01.json'), 'data/material/w01.json');
  assert.equal(safeHref('mailto:a@b.rs'), 'mailto:a@b.rs');
  assert.equal(safeHref('javascript:alert(1)'), '');
  assert.equal(safeHref('data:text/html,<script>'), '');
  assert.equal(safeHref('//evil.example'), '');
});

test('a lecture is cut at every heading and nothing is dropped', () => {
  const week = {
    n: 1, state: 'draft', title: { en: 'x' }, blocks: [
      { kind: 'text', text: { en: 'before any heading' } },
      { kind: 'heading', text: { en: 'one' } },
      { kind: 'text', text: { en: 'a' } }, { kind: 'text', text: { en: 'b' } },
      { kind: 'heading', text: { en: 'two' } }
    ]
  };
  const slides = toSlides(week);
  assert.equal(slides.length, 3);
  assert.equal(slides[0].heading, null);
  assert.equal(slides[1].blocks.length, 2);
  assert.equal(slides[2].blocks.length, 0);
  const counted = slides.reduce((sum, slide) => sum + slide.blocks.length + (slide.heading ? 1 : 0), 0);
  assert.equal(counted, week.blocks.length, 'every block must appear on some slide');
  assert.deepEqual(toSlides({ blocks: [] }), []);
});

test('the current week is the declared one, else the last published one', () => {
  const weeks = [{ n: 1, state: 'published' }, { n: 2, state: 'published' }, { n: 3, state: 'draft' }];
  assert.equal(currentWeek({ current: 2, weeks }).n, 2);
  assert.equal(currentWeek({ current: 9, weeks }).n, 2, 'a missing declaration falls back to the last published');
  assert.equal(currentWeek({ weeks }).n, 2);
  assert.equal(currentWeek({ weeks: [] }), null);
  assert.equal(currentWeek({ current: null, weeks: [{ n: 4, state: 'draft' }] }).n, 4);
});

test('week numbering and file names stay in step', () => {
  assert.equal(weekFile(1), 'data/material/w01.json');
  assert.equal(weekFile(12), 'data/material/w12.json');
});

test('the statistics count what is there, not what is intended', async () => {
  const week = await json('data/material/w01.json');
  const stats = weekStats(week);
  assert.equal(stats.blocks, week.blocks.length);
  assert.ok(stats.slides >= 4, String(stats.slides));
  assert.ok(stats.words > 300, String(stats.words));
  assert.ok(stats.counts.heading >= 4);
});

test('an empty week is a draft with nothing in it, and serialises as readable JSON', () => {
  const week = emptyWeek(7);
  assert.equal(week.state, 'draft');
  assert.equal(week.n, 7);
  assert.deepEqual(week.blocks, []);
  assert.ok(validateWeek(week).problems.length >= 1, 'an empty week must not pass as publishable');
  const text = serializeWeek(week);
  assert.equal(text.at(-1), '\n');
  assert.deepEqual(JSON.parse(text), week);
});

test('every block kind the editor offers is a kind the renderer knows', async () => {
  const blocks = await readFile(new URL('../assets/blocks.js', import.meta.url), 'utf8');
  for (const kind of Object.keys(BLOCK_KINDS)) {
    assert.ok(blocks.includes(`case '${kind}'`), `blocks.js does not render "${kind}"`);
    assert.ok(BLOCK_KINDS[kind].label.sr && BLOCK_KINDS[kind].label.en, `${kind} needs a bilingual label`);
  }
});
