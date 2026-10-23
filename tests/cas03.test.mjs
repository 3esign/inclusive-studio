// The third-class list page keeps its promises: rows exactly from the register, the
// uncertain zone published as uncertain, the first wave linked to real gallery entries,
// every open question printed, and no photograph claim the material cannot support.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { setLanguage } from '../assets/core.js';
import { renderCas03, validateCas03 } from '../assets/cas03-core.js';
import { validatePrototypes } from '../assets/prototipovi-core.js';

const root = new URL('../', import.meta.url);
const json = async p => JSON.parse(await readFile(new URL(p, root), 'utf8'));
const spisak = await json('data/cas-03/spisak.json');
const prototypes = await json('data/prototipovi.json');

test('the class-list register passes its own rules: twenty-nine rows, a real date, a source', () => {
  assert.deepEqual(validateCas03(spisak), []);
  assert.equal(spisak.odrzan, '2026-10-16');
  assert.equal(spisak.radovi.length, 29);
  // 23.10.2026: the separation of the three disputed frames confirmed rows 17-19; only
  // row 20 stays open, the name left without a filed work.
  assert.equal(spisak.radovi.filter(row => row.potvrditi).length, 1);
  for (const problem of [
    { ...spisak, schema: 'course-class-list/v2' },
    { ...spisak, radovi: [] },
    { ...spisak, sigurno: { do: 20, od: 21 } },        // the uncertain zone must be exactly the gap
    { ...spisak, radovi: spisak.radovi.map(row => row.rb === 3 ? { ...row, potvrditi: true } : row) },
    { ...spisak, radovi: spisak.radovi.map(row => row.rb === 7 ? { ...row, razjasni: 'nema-takvog-pitanja' } : row) }
  ]) assert.notEqual(validateCas03(problem).length, 0);
  // A first-wave id that is not in the register is refused at render time, not silently linked.
  const ghost = structuredClone(spisak);
  ghost.radovi[4].prviTalas = 'nema-takvog-rada';
  assert.throws(() => renderCas03(ghost, prototypes), /not in the work register/);
});

test('the first wave names only real registry entries, and the certain zones are the teacher’s own', () => {
  assert.deepEqual(validatePrototypes(prototypes), []);
  const ids = new Set(prototypes.items.map(item => item.id));
  for (const row of spisak.radovi) if (row.prviTalas) assert.ok(ids.has(row.prviTalas), `${row.prviTalas} is not in the work register`);
  assert.equal(spisak.radovi.filter(row => row.prviTalas).length, 4, 'Muzička kutija, Zmijica, Sudoku and Castle — the photographed first wave');
  // 19.10.2026: Doljanović's „Castle” entered the gallery with its photographs, so the field now points at the entry.
  const castle = spisak.radovi.find(row => /castle/i.test(row.rad || ''));
  assert.equal(castle?.prviTalas, '29-castle', 'Castle links its gallery entry now that it exists with photographs');
  assert.deepEqual(spisak.radovi.filter(row => row.potvrditi).map(row => row.rb), [20]);
  assert.equal(spisak.sigurno.do, 19);
  assert.equal(spisak.sigurno.od, 21);
});

test('the page renders both segments, marks the uncertain rows and prints every open question', () => {
  setLanguage('sr');
  const html = renderCas03(spisak, prototypes);
  for (const heading of ['Prototipi i slike', 'Analiza iz udruženja', 'Otvoreno za razjašnjenje']) {
    assert.ok(html.includes(heading), `segment missing: ${heading}`);
  }
  assert.equal((html.match(/<li data-cas03-row=/g) || []).length, 29);
  for (const row of spisak.radovi) {
    const li = html.split(`data-cas03-row="${row.rb}"`)[1].split('</li>')[0];
    if (row.potvrditi) assert.ok(li.includes('cas03-neizvesno') && li.includes('čeka potvrdu'), `row ${row.rb} must be marked unconfirmed`);
    else assert.ok(!li.includes('cas03-neizvesno'), `row ${row.rb} is certain and must not carry the uncertain mark`);
    // 19.10.2026: Castle is published with its photographs, so every first-wave row links its gallery entry.
    if (row.prviTalas) assert.ok(li.includes(`href="prototipovi.html#${row.prviTalas}"`), `row ${row.rb} must link its gallery entry`);
    if (row.razjasni) assert.ok(li.includes(`href="#${row.razjasni}"`), `row ${row.rb} must link its open question`);
  }
  for (const question of spisak.razjasni) {
    assert.ok(html.includes(`id="${question.id}"`), `question missing from the page: ${question.id}`);
    assert.ok(html.includes(question.sta.sr), `question text missing: ${question.id}`);
  }
  // The association segment carries only the three recorded statements, each as its own row.
  for (const claim of ['pohvalio je studentske prototipe', 'želja korisnika da isprobavaju', 'mogući konkurs od strane udruženja']) {
    assert.ok(html.includes(claim), `association statement missing: ${claim}`);
  }
  // 19.10.2026: the photographs are published with their works, read in shooting order.
  assert.ok(html.includes('objavljena je uz rad kome pripada'), 'the page must state the photographs stand with the work they belong to');
  for (const banned of ['galerija fotografija', 'saglasnost za fotografije', 'čeka saglasnost']) {
    assert.ok(!html.includes(banned), `"${banned}" is a claim the material cannot support`);
  }
});

test('the static baseline is stamped from the same renderer, and the course points at the page', async () => {
  setLanguage('sr');
  const page = await readFile(new URL('cas-03.html', root), 'utf8');
  const start = '<!-- cas03-content:start -->', end = '<!-- cas03-content:end -->';
  assert.equal(page.split(start).length, 2, 'baseline markers missing');
  const baked = page.slice(page.indexOf(start) + start.length, page.indexOf(end));
  assert.equal(baked, `<div id="cas03-content">${renderCas03(spisak, prototypes)}</div>`, 'the baked list is not the rendered register');
  const week = await json('data/material/w03.json');
  assert.equal(week.state, 'published');
  assert.ok(week.blocks.some(block => block.kind === 'link' && block.href === 'cas-03.html'), 'the week material must link the list page');
  const tok = await json('data/tok.json');
  const held = tok.odrzano.find(item => item.id === 'cas-w03');
  assert.ok(held && held.odrzan === '2026-10-16', 'the flow must hold the third class');
  assert.ok(held.prilog?.some(p => p.href === 'cas-03.html'), 'the held record must link the list page as its prilog');
  const landing = await readFile(new URL('index.html', root), 'utf8');
  assert.ok(landing.includes('href="cas-03.html"'), 'the held page links the list page');
});

test('the intake proposal keeps unconfirmed rows structurally unconfirmed and invents no photograph claims', async () => {
  // 20.10.2026: redovi 17-20 nose „potvrditi“ u nastavnikovom spisku. Predlog registra
  // sme da zadrži ime i indeks iz tog spiska (izvor je nastavnik), ali ne sme da ih
  // tvrdi kao potvrđeno studentsko autorstvo — atribucija čeka studentovu potvrdu.
  const predlog = await json('data/cas-03/predlog-registra.json');
  assert.equal(predlog.items.length, 28, 'the proposal holds every photographed work; row 20 has no photograph');
  assert.deepEqual(validatePrototypes(predlog), [], 'the proposal must satisfy the work-register rules');
  const byRb = new Map(predlog.items.map(item => [Number(item.id.split('-')[0]), item]));
  for (const row of spisak.radovi) {
    const item = byRb.get(row.rb);
    if (!item) continue;                                        // red bez fotografije (20) ne ulazi u predlog
    // 23.10.2026: the proposal is the frozen 18.10 intake artefact, so a row confirmed
    // later may still stand pending in it. What must never happen is the other way round:
    // a row that still awaits confirmation claimed as confirmed in the proposal.
    if (row.potvrditi) {
      assert.equal(item.attributionStatus, 'pending', `row ${row.rb} awaits student confirmation and must say so structurally`);
      assert.ok(item.authorRole === 'student' && item.author?.name && item.attribution?.fields, `row ${row.rb} keeps its mandatory fields while pending`);
    }
  }
  // Napomena o nizu slikanja opisuje strukturu celog talasa, nije dokaz za svaku fotografiju:
  // nijedan pojedinačni potpis ne sme tvrditi da korisnica proba prototip.
  for (const item of predlog.items) for (const photo of item.photos) {
    assert.ok(!/proba prototip|user tries/i.test(photo.caption.sr + photo.caption.en), `${photo.id}: caption claims what no single photo can prove`);
  }
});
