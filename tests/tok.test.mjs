// The flow window makes three promises, and each is a thing a course site gets wrong:
//   nothing sits on the cemented shelf unless the class was held and its results are written;
//   nothing in pilot looks finished — it names what it waits for and carries no results;
//   an idea owns no week, only a source and a date, and a pilot says which idea it came from.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const load = name => import(new URL(`../assets/${name}`, import.meta.url).href);
const json = async path => JSON.parse(await readFile(new URL(`../${path}`, import.meta.url), 'utf8'));

const { FORMAT, VERSION, validateTok, emptyTok, shelfOf } = await load('tok-core.js');
const tok = await json('data/tok.json');

const base = () => ({ ...emptyTok(), nacelo: { sr: 'x', en: 'x' } });
const item = (shelf, extra) => ({ ...base()[shelf][0], naslov: { sr: 'x', en: 'x' }, izvor: 'test', ...extra });
const cem = extra => item('cem', { id: 'a', vrsta: 'cas', odrzan: '2026-10-02', rezultati: [{ sta: { sr: 'x' }, izvor: 'test' }], ...extra });
const pilot = extra => item('pilot', { id: 'b', vrsta: 'tema', ceka: { sr: 'x' }, ...extra });
const ideja = extra => item('ideje', { id: 'c', tekst: { sr: 'x' }, datum: '2026-10-09', ...extra });

test('the flow data on disk passes the same rules the page enforces', () => {
  assert.equal(tok.format, FORMAT);
  assert.equal(tok.version, VERSION);
  assert.deepEqual(validateTok(tok), [], validateTok(tok).join(' | '));
});

test('cement without a held date or without written results is refused, not tidied away', () => {
  assert.ok(validateTok({ ...base(), cem: [cem({ odrzan: '2.10.2026' })] }).some(p => p.includes('odrzan')));
  assert.ok(validateTok({ ...base(), cem: [cem({ rezultati: [] })] }).some(p => p.includes('rezultati')));
  assert.ok(validateTok({ ...base(), cem: [cem({ rezultati: [{ sta: { sr: 'x' } }] })] }).some(p => p.includes('rezultati[0]')));
  assert.deepEqual(validateTok({ ...base(), cem: [cem()] }), []);
});

test('a pilot must say what it waits for and must not look finished', () => {
  assert.deepEqual(validateTok({ ...base(), pilot: [pilot()] }), []);
  assert.ok(validateTok({ ...base(), pilot: [pilot({ ceka: undefined })] }).some(p => p.includes('ceka')));
  assert.ok(validateTok({ ...base(), pilot: [pilot({ odrzan: '2026-10-02' })] }).some(p => p.includes('held date')));
  assert.ok(validateTok({ ...base(), pilot: [pilot({ rezultati: [] })] }).some(p => p.includes('results')));
});

test('an idea owns no week — a source and a date only', () => {
  assert.deepEqual(validateTok({ ...base(), ideje: [ideja()] }), []);
  assert.ok(validateTok({ ...base(), ideje: [ideja({ nedelja: 3 })] }).some(p => p.includes('no week')));
  assert.ok(validateTok({ ...base(), ideje: [ideja({ datum: 'juče' })] }).some(p => p.includes('date')));
  assert.ok(validateTok({ ...base(), ideje: [ideja({ izvor: '' })] }).some(p => p.includes('source')));
});

test('a pilot is pulled from the cloud by id, and a cemented item leaves the pilot shelf', () => {
  const cloud = { ...base(), ideje: [ideja()], pilot: [pilot({ izIdeje: 'c' })] };
  assert.deepEqual(validateTok(cloud), []);
  assert.ok(validateTok({ ...base(), pilot: [pilot({ izIdeje: 'nema-takve' })] }).some(p => p.includes('not in the cloud')));
  const done = { ...base(), cem: [cem()], pilot: [pilot({ id: 'a' })] };
  assert.ok(validateTok(done).some(p => p.includes('still sits on the pilot shelf')));
});

test('an item lives on one shelf only', () => {
  const both = { ...base(), cem: [cem({ id: 'isti' })], pilot: [pilot({ id: 'isti' })] };
  assert.ok(validateTok(both).some(p => p.includes('one shelf')));
  assert.equal(shelfOf(both, 'isti'), 'cem');
});

test('every cemented class points at a published week that really carries its results section', async () => {
  for (const entry of tok.cem) {
    if (entry.vrsta !== 'cas') continue;
    assert.ok(typeof entry.nedelja === 'number', `${entry.id}: a held class names its week`);
    const week = await json(`data/material/w${String(entry.nedelja).padStart(2, '0')}.json`);
    assert.equal(week.state, 'published', `${entry.id}: week ${entry.nedelja} is not published`);
    const held = entry.odrzan.split('-').reverse().join('.');
    assert.ok(
      week.blocks.some(block => (block.text?.en || '').includes('Recorded after the session')) &&
      JSON.stringify(week).includes(held),
      `${entry.id}: week ${entry.nedelja} carries no "Recorded after the session" section dated ${held}`
    );
  }
});

test('every pilot class or theme points at a week file that exists', async () => {
  for (const entry of tok.pilot) {
    if (typeof entry.nedelja !== 'number') continue;
    const week = await json(`data/material/w${String(entry.nedelja).padStart(2, '0')}.json`);
    assert.ok(week.n === entry.nedelja);
  }
});

test('the flow is the landing itself, with the three shelves named even without scripting', async () => {
  const page = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const { NAV } = await load('core.js');
  assert.ok(NAV.some(entry => entry.href === 'index.html' && entry.id === 'flow' && entry.group === 'primary'),
    'the landing is the first navigation item');
  for (const word of ['Cemented', 'Pilot', 'Cloud of ideas']) assert.ok(page.includes(word), `static baseline misses "${word}"`);
  assert.ok(page.includes('02.10.2026'), 'the held date is part of the static baseline');
  assert.ok(page.includes('index.html?w=1'), 'a cemented class links to its own week');
  assert.match(page, /data-view="flow"/);
  for (const anchor of ['id="zacementirano"', 'id="sledeci-cas"', 'id="oblak-ideja"']) {
    assert.ok(page.includes(anchor), `the static landing misses the anchor ${anchor}`);
  }
});

test('every cemented class names its A3 sheet: the week file carries at least one exercise', async () => {
  for (const entry of tok.cem) {
    if (entry.vrsta !== 'cas') continue;
    const week = await json(`data/material/w${String(entry.nedelja).padStart(2, '0')}.json`);
    assert.ok(
      week.blocks.some(block => block.kind === 'exercise'),
      `${entry.id}: week ${entry.nedelja} carries no exercise — a held class leaves no A3 sheet for the exam workbook`
    );
  }
});
