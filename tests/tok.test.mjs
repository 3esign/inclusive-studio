// The flow keeps three honest parts, and each is a thing a course site gets wrong:
//   nothing is listed as held unless the class was held and its results are written;
//   nothing in the next-class preparation looks finished — it names what it waits for;
//   an idea owns no week, only a source and a date, and the preparation says which idea it came from.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const load = name => import(new URL(`../assets/${name}`, import.meta.url).href);
const json = async path => JSON.parse(await readFile(new URL(`../${path}`, import.meta.url), 'utf8'));

const { FORMAT, VERSION, validateTok, emptyTok, shelfOf } = await load('tok-core.js');
const tok = await json('data/tok.json');

const base = () => ({ ...emptyTok(), nacelo: { sr: 'x', en: 'x' } });
const item = (deo, extra) => ({ ...base()[deo][0], naslov: { sr: 'x', en: 'x' }, izvor: 'test', ...extra });
const odrzan = extra => item('odrzano', { id: 'a', vrsta: 'cas', odrzan: '2026-10-02', rezultati: [{ sta: { sr: 'x' }, izvor: 'test' }], ...extra });
const sledeci = extra => item('sledeci', { id: 'b', vrsta: 'tema', ceka: { sr: 'x' }, ...extra });
const ideja = extra => item('ideje', { id: 'c', tekst: { sr: 'x' }, datum: '2026-10-09', ...extra });

test('the flow data on disk passes the same rules the page enforces', () => {
  assert.equal(tok.format, FORMAT);
  assert.equal(tok.version, VERSION);
  assert.deepEqual(validateTok(tok), [], validateTok(tok).join(' | '));
});

test('held without a date or without written results is refused, not tidied away', () => {
  assert.ok(validateTok({ ...base(), odrzano: [odrzan({ odrzan: '2.10.2026' })] }).some(p => p.includes('odrzan')));
  assert.ok(validateTok({ ...base(), odrzano: [odrzan({ rezultati: [] })] }).some(p => p.includes('rezultati')));
  assert.ok(validateTok({ ...base(), odrzano: [odrzan({ rezultati: [{ sta: { sr: 'x' } }] })] }).some(p => p.includes('rezultati[0]')));
  assert.deepEqual(validateTok({ ...base(), odrzano: [odrzan()] }), []);
});

test('a preparation must say what it waits for and must not look finished', () => {
  assert.deepEqual(validateTok({ ...base(), sledeci: [sledeci()] }), []);
  assert.ok(validateTok({ ...base(), sledeci: [sledeci({ ceka: undefined })] }).some(p => p.includes('ceka')));
  assert.ok(validateTok({ ...base(), sledeci: [sledeci({ odrzan: '2026-10-02' })] }).some(p => p.includes('held date')));
  assert.ok(validateTok({ ...base(), sledeci: [sledeci({ rezultati: [] })] }).some(p => p.includes('results')));
});

test('an idea owns no week — a source and a date only', () => {
  assert.deepEqual(validateTok({ ...base(), ideje: [ideja()] }), []);
  assert.ok(validateTok({ ...base(), ideje: [ideja({ nedelja: 3 })] }).some(p => p.includes('no week')));
  assert.ok(validateTok({ ...base(), ideje: [ideja({ datum: 'juče' })] }).some(p => p.includes('date')));
  assert.ok(validateTok({ ...base(), ideje: [ideja({ izvor: '' })] }).some(p => p.includes('source')));
});

test('a preparation is pulled from the cloud by id, and a held item leaves the preparation', () => {
  const cloud = { ...base(), ideje: [ideja()], sledeci: [sledeci({ izIdeje: 'c' })] };
  assert.deepEqual(validateTok(cloud), []);
  assert.ok(validateTok({ ...base(), sledeci: [sledeci({ izIdeje: 'nema-takve' })] }).some(p => p.includes('not in the cloud')));
  const done = { ...base(), odrzano: [odrzan()], sledeci: [sledeci({ id: 'a' })] };
  assert.ok(validateTok(done).some(p => p.includes('still sits')));
});

test('an item lives in one part only', () => {
  const both = { ...base(), odrzano: [odrzan({ id: 'isti' })], sledeci: [sledeci({ id: 'isti' })] };
  assert.ok(validateTok(both).some(p => p.includes('one part')));
  assert.equal(shelfOf(both, 'isti'), 'odrzano');
});

test('every held class points at a published week that really carries its results section', async () => {
  for (const entry of tok.odrzano) {
    if (entry.vrsta !== 'cas') continue;
    assert.ok(typeof entry.nedelja === 'number', `${entry.id}: a held class names its week`);
    const week = await json(`data/material/w${String(entry.nedelja).padStart(2, '0')}.json`);
    assert.equal(week.state, 'published', `${entry.id}: week ${entry.nedelja} is not published`);
    const held = entry.odrzan.split('-').reverse().join('.');
    assert.ok(
      JSON.stringify(week).includes('Zapisano posle časa') &&
      JSON.stringify(week).includes(held),
      `${entry.id}: week ${entry.nedelja} carries no „Zapisano posle časa” section dated ${held}`
    );
  }
});

test('every prepared class or theme points at a week file that exists', async () => {
  for (const entry of tok.sledeci) {
    if (typeof entry.nedelja !== 'number') continue;
    const week = await json(`data/material/w${String(entry.nedelja).padStart(2, '0')}.json`);
    assert.ok(week.n === entry.nedelja);
  }
});

test('the landing is the held record, in Serbian, naming all three parts even without scripting', async () => {
  const page = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const { NAV } = await load('core.js');
  assert.ok(NAV.some(entry => entry.href === 'index.html' && entry.id === 'flow' && entry.group === 'primary'),
    'the held record is a primary navigation item');
  for (const word of ['Održano', 'Sledeći čas', 'Oblak ideja']) assert.ok(page.includes(word), `static baseline misses "${word}"`);
  assert.ok(page.includes('2026-10-02'), 'the held date is part of the static baseline');
  assert.ok(page.includes('index.html?w=1'), 'a held class links to its own week');
  assert.match(page, /data-view="flow"/);
  assert.ok(page.includes('id="odrzano"'), 'the static landing misses the anchor id="odrzano"');
  assert.ok(page.includes('href="sledeci.html"'), 'the landing does not lead to the next-class page');
  assert.ok(page.includes('href="oblak.html"'), 'the landing does not lead to the cloud page');
  assert.ok(page.includes('href="assets/sablon-a3.svg"'), 'the helping material does not offer the A3 template');
});

test('the held page carries no preparation results and no cloud ideas — each has its own page', async () => {
  const page = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  for (const entry of tok.sledeci.filter(item => item.vrsta === 'cas')) {
    assert.ok(!page.includes(entry.naslov.sr), `a next-class item sits on the held page: ${entry.id}`);
  }
  for (const idea of tok.ideje) {
    assert.ok(!page.includes(idea.naslov.sr), `idea "${idea.naslov.sr}" sits on the held page — it belongs to oblak.html`);
  }
});

test('the next-class page is rich and leans on the last held class, without scripting', async () => {
  const page = await readFile(new URL('../sledeci.html', import.meta.url), 'utf8');
  const { nextClassEntry, lastHeldClass } = await load('next-class.js');
  const next = nextClassEntry(tok), last = lastHeldClass(tok);
  if (!next) { assert.ok(page.includes('Naredni čas još nije upisan.')); return; }
  const week = await json(`data/material/w${String(next.nedelja).padStart(2, '0')}.json`);
  for (const needle of ['Šta se donosi', 'Plan, redom', week.title.sr, 'Šta ova strana još čeka', ...tok.sledeci.filter(i => i.vrsta === 'protokol').map(i => i.naslov.sr)]) {
    assert.ok(page.includes(needle), `sledeci.html misses: ${needle}`);
  }
  if (last) {
    assert.ok(page.includes(last.odrzan), 'the next-class page does not lean on the last held class');
    assert.ok(page.includes(`index.html?w=${last.nedelja}`));
  }
  assert.ok(page.includes(`predavanje.html?w=${next.nedelja}&amp;preview=1`));
  if (tok.sledeci.some(i => i.id === 'probavanje-u-udruzenju')) assert.ok(page.includes('assets/fieldwork/zivimo-zajedno-sketch.jpg'), 'the protocol section carries no field sketch');
});

test('the cloud page lists every idea with its date, without scripting', async () => {
  const page = await readFile(new URL('../oblak.html', import.meta.url), 'utf8');
  for (const idea of tok.ideje) {
    assert.ok(page.includes(idea.naslov.sr), `oblak.html misses idea: ${idea.naslov.sr}`);
    assert.ok(page.includes(idea.datum), `oblak.html misses the date of: ${idea.naslov.sr}`);
  }
});

test('every held class names its A3 sheet: the week file carries at least one exercise', async () => {
  for (const entry of tok.odrzano) {
    if (entry.vrsta !== 'cas') continue;
    const week = await json(`data/material/w${String(entry.nedelja).padStart(2, '0')}.json`);
    assert.ok(
      week.blocks.some(block => block.kind === 'exercise'),
      `${entry.id}: week ${entry.nedelja} carries no exercise — a held class leaves no A3 sheet for the exam workbook`
    );
  }
});
