import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { setLanguage, esc } from '../assets/core.js';
import { heldRecord, lessonImages } from '../assets/held-record.js';
import { exercises } from '../assets/exercises.js';

const root = new URL('../', import.meta.url);
const json = async path => JSON.parse(await readFile(new URL(path, root), 'utf8'));
const referenceSources = [1, 2, 3].map(n => `data/igracka/igracka-${String(n).padStart(2, '0')}.jpg`);
const weekFiles = (await readdir(new URL('data/material/', root))).filter(file => /^w\d{2}\.json$/.test(file)).sort();
const weeks = new Map(await Promise.all(weekFiles.map(async file => [file, await json(`data/material/${file}`)])));
const firstWeek = weeks.get('w01.json'), secondWeek = weeks.get('w02.json');
const borrowed = { sr: /pozajm\p{L}*/iu, en: /\bborrowed\b/i };
const firstClass = { sr: /prv\p{L}*\s+čas\p{L}*/iu, en: /\bfirst\s+(?:class|lesson)\b/i };

function assertReferenceContext(text, language, label) {
  assert.equal(typeof text, 'string', `${label}: text is required`);
  assert.match(text, borrowed[language], `${label}: identify the borrowed reference object`);
  assert.match(text, firstClass[language], `${label}: identify its use in the first class`);
}

test('all three borrowed reference photographs belong only to week one across the actual material files', () => {
  assert.ok(firstWeek && secondWeek, 'both taught weeks must be present');
  assert.equal(firstWeek.n, 1);
  const images = (firstWeek.blocks || []).filter(block => block.kind === 'image' && block.src?.startsWith('data/igracka/'));
  assert.deepEqual(images.map(block => block.src).sort(), [...referenceSources].sort(), 'preserve all three original views exactly once in week one');
  for (const [file, week] of weeks) {
    if (file === 'w01.json') continue;
    const misplaced = (week.blocks || []).filter(block => block.kind === 'image' && block.src?.startsWith('data/igracka/'));
    assert.deepEqual(misplaced.map(block => block.src), [], `${file}: the borrowed reference is not a later student work`);
  }
  for (const image of images) for (const language of ['sr', 'en']) {
    assertReferenceContext(image.caption?.[language], language, `${image.src} caption.${language}`);
  }
});

test('held records preserve the first-class reference context in both languages without assigning it to week two', async t => {
  const flow = await json('data/tok.json');
  const first = flow.odrzano.find(item => item.nedelja === 1), second = flow.odrzano.find(item => item.nedelja === 2);
  assert.ok(first && second, 'the two held records must have explicit course evidence');
  t.after(() => setLanguage('sr'));
  for (const language of ['sr', 'en']) {
    setLanguage(language);
    const firstHtml = heldRecord(first, firstWeek), secondHtml = heldRecord(second, secondWeek);
    for (const src of referenceSources) {
      assert.equal(firstHtml.split(`src="${src}"`).length - 1, 1, `${language}: show each reference photo once in the first class`);
      assert.ok(!secondHtml.includes(src), `${language}: do not turn the borrowed object into a week-two result`);
    }
    for (const image of lessonImages(firstWeek).filter(block => referenceSources.includes(block.src))) {
      assert.ok(firstHtml.includes(esc(image.caption[language])), `${language}: preserve the factual caption`);
    }
    assert.ok(firstHtml.includes('href="index.html?w=1"'), 'the first-class record links to its own material');
    assert.ok(secondHtml.includes('href="index.html?w=2"'), 'the second-class record keeps its distinct material');
  }
});

test('week-two images come from work actually documented in week two', async () => {
  const registry = await json('data/prototipovi.json');
  const allowed = new Set(registry.items.filter(item => item.documentedWeek === 2).flatMap(item => item.photos.map(photo => photo.src)));
  const images = (secondWeek?.blocks || []).filter(block => block.kind === 'image');
  assert.ok(images.length > 0, 'week two retains an image of its documented work');
  for (const image of images) assert.ok(allowed.has(image.src), `${image.src}: use the actual week-two register rather than the borrowed example`);
});

test('the reference page and exercise bank identify the borrowed first-class example and retain its material link', async () => {
  const exercise = exercises.find(item => item.id === 'toy-for-coordination');
  assert.ok(exercise);
  assert.equal(exercise.week, 1);
  for (const language of ['sr', 'en']) assertReferenceContext(exercise.task[language], language, `exercise.task.${language}`);

  const source = await readFile(new URL('assets/toy.js', root), 'utf8');
  const referenceData = source.match(/const REFERENCE\s*=\s*\{[\s\S]*?\n\};/)?.[0];
  const referenceView = source.match(/function referenceBox\(\)\s*\{[\s\S]*?\n\}/)?.[0];
  assert.ok(referenceData && referenceView, 'inspect the actual reference introduction, not unrelated examples elsewhere on the page');
  for (const language of ['sr', 'en']) assertReferenceContext(referenceData + referenceView, language, `live reference introduction ${language}`);
  assert.ok(source.includes('href="index.html?w=1"'), 'the live exercise page links to its first-class material');

  const page = await readFile(new URL('igracka.html', root), 'utf8');
  const main = page.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1];
  assert.ok(main, 'the no-JavaScript introduction is present');
  const language = /<html\b[^>]*lang="en(?:-[^"]*)?"/.test(page) ? 'en' : 'sr';
  assertReferenceContext(main, language, 'static reference introduction');
  assert.ok(main.includes('href="index.html?w=1"'), 'the static reference page links to its first-class material');
});
