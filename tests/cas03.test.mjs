// The third-class list page keeps its promises: rows exactly from the register, every row
// either opening its work's page or openly waiting for its photographs, the open questions
// printed, and no photograph claim the material cannot support.
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

test('the class-list register passes its own rules: every listed work, a real date, a source', () => {
  assert.deepEqual(validateCas03(spisak), []);
  assert.equal(spisak.odrzan, '2026-10-16');
  assert.equal(spisak.radovi.length, prototypes.galleries.length + prototypes.cekaju.length);
  for (const problem of [
    { ...spisak, schema: 'course-class-list/v2' },
    { ...spisak, radovi: [] },
    { ...spisak, presek: { sr: 'samo srpski' } },
    { ...spisak, prenos: { sr: 'samo srpski' } },
    // A cut class has no pending intake: the frames are here, bound to their rows.
    { ...spisak, prijem: { uredjaj: 'x', putanja: 'y', prviSnimak: 'z.jpg', prviSnimakVreme: '2026-10-16T12:22:00', napomena: { sr: 'a', en: 'b' } } },
    // A row may not both open a work and claim to be waiting for it.
    { ...spisak, radovi: spisak.radovi.map(row => row.galerija ? { ...row, ceka: true } : row) },
    // Nor may it do neither: a row with no work and no stated wait is an unexplained row.
    { ...spisak, radovi: spisak.radovi.map(row => { const { galerija, ceka, ...rest } = row; return rest; }) },
    { ...spisak, radovi: spisak.radovi.map(row => row.rb === 7 ? { ...row, razjasni: 'nema-takvog-pitanja' } : row) }
  ]) assert.notEqual(validateCas03(problem).length, 0);
  // A work id that is not in the register is refused at render time, not silently linked.
  const ghost = structuredClone(spisak);
  ghost.radovi.find(row => row.galerija).galerija = 'nema-takvog-rada';
  assert.throws(() => renderCas03(ghost, prototypes), /not in the work register/);
});

test('the list and the work register tell the same story, row for row', () => {
  assert.deepEqual(validatePrototypes(prototypes), []);
  const works = new Map(prototypes.galleries.map(g => [g.listOrder, g]));
  const waiting = new Map(prototypes.cekaju.map(w => [w.listOrder, w]));
  for (const row of spisak.radovi) {
    const work = works.get(row.rb) ?? waiting.get(row.rb);
    assert.ok(work, `row ${row.rb} has no work in the register`);
    assert.equal(row.ime, work.author.name, `row ${row.rb}: the name must match the register`);
    assert.equal(row.indeks, work.author.studentNumber ?? null, `row ${row.rb}: the student number must match`);
    assert.equal(row.rad ?? 'Bez naziva', work.title.sr, `row ${row.rb}: the title must match`);
    if (works.has(row.rb)) {
      assert.equal(row.galerija, work.id, `row ${row.rb} opens its own work`);
      assert.equal(row.slike, work.photos.length, `row ${row.rb}: the count must equal the frames shown`);
    } else {
      assert.ok(row.ceka, `row ${row.rb} has no photographs and must say that it waits`);
      assert.equal(row.slike, work.expectedPhotos, `row ${row.rb}: the count is what is still owed`);
    }
  }
  // 23.10.2026: exactly one row waits. Its title is the teacher's provisional guess, so
  // the count stays unrecorded — a named work with no frames is still a work with no frames.
  const waits = spisak.radovi.filter(row => row.ceka);
  assert.equal(waits.length, 1);
  assert.equal(waits[0].slike, null);
  assert.equal(waiting.get(waits[0].rb).expectedPhotos, null);
  assert.ok(waiting.get(waits[0].rb).reason.sr.includes('uslovno'), 'a provisional title must say so in the register');
});

test('the page renders both segments, marks the waiting rows and prints every open question', () => {
  setLanguage('sr');
  const html = renderCas03(spisak, prototypes);
  for (const heading of ['Prototipi i slike', 'Analiza iz udruženja', 'Otvoreno za razjašnjenje']) {
    assert.ok(html.includes(heading), `segment missing: ${heading}`);
  }
  assert.equal((html.match(/<li data-cas03-row=/g) || []).length, spisak.radovi.length);
  for (const row of spisak.radovi) {
    const li = html.split(`data-cas03-row="${row.rb}"`)[1].split('</li>')[0];
    if (row.ceka) assert.ok(li.includes('cas03-neizvesno') && li.includes('fotografije tek stižu'), `row ${row.rb} must be marked as waiting`);
    else assert.ok(!li.includes('cas03-neizvesno'), `row ${row.rb} has its photographs and must not be marked as waiting`);
    if (row.galerija) assert.ok(li.includes(`href="galerija-${row.galerija}.html"`), `row ${row.rb} must open its work`);
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
  // How the sequence was cut, and what the transfer still owes, are both stated on the page.
  assert.ok(html.includes(spisak.presek.sr) && html.includes(spisak.prenos.sr));
  for (const banned of ['galerija fotografija', 'saglasnost za fotografije', 'čeka saglasnost']) {
    assert.ok(!html.includes(banned), `"${banned}" is a claim the material cannot support`);
  }
});

test('third-class public URL and material open galleries, not the processing roster', async () => {
  const html = await readFile(new URL('cas-03.html', root), 'utf8');
  assert.ok(html.includes('id="galerije-w03"'));
  assert.ok(!html.includes('data-cas03-row='));
  const week = await json('data/material/w03.json');
  assert.ok(week.blocks.some(b => b.kind === 'link' && b.href === 'prototipovi.html#galerije-w03'));
  const tok = await json('data/tok.json');
  assert.equal(tok.odrzano.find(i => i.nedelja === 3).odrzan, '2026-10-16');
  assert.ok(tok.odrzano.find(i => i.nedelja === 3).prilog.some(p => p.href === 'prototipovi.html#galerije-w03'));
});

test('no caption claims of a single frame what only the whole sequence showed', () => {
  for (const work of prototypes.galleries) for (const photo of work.photos) {
    const text = photo.caption.sr + photo.caption.en + photo.alt.sr + photo.alt.en;
    assert.ok(!/proba prototip|user tries/i.test(text), `${photo.id}: caption claims what no single photo can prove`);
  }
});
