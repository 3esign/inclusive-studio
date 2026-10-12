// The visit page keeps its promises: participants exactly from the register, findings that
// separate seen from reading from next step, photographs that exist in the observation
// register, and no claim that the material cannot support.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { setLanguage } from '../assets/core.js';
import { renderPoseta, renderVisitLead, validateVisit } from '../assets/poseta-core.js';
import { validatePrototypes } from '../assets/prototipovi-core.js';

const root = new URL('../', import.meta.url);
const json = async p => JSON.parse(await readFile(new URL(p, root), 'utf8'));
const visit = await json('data/poseta.json');
const prototypes = await json('data/prototipovi.json');

test('the visit register passes its own rules: nine participants, a real date, a source', () => {
  assert.deepEqual(validateVisit(visit), []);
  assert.equal(visit.week, 2);
  assert.equal(visit.occurredOn, '2026-10-09');
  assert.equal(visit.participants.length, 9);
  for (const problem of [
    { ...visit, schema: 'course-visit/v2' },
    { ...visit, participants: [] },
    { ...visit, participants: [{ name: 'Neko' }] },
    { ...visit, occurredOn: '09.10.2026' }
  ]) assert.notEqual(validateVisit(problem).length, 0);
});

test('the analysis page renders every participant once, links every finding and prints no faces claim it cannot support', () => {
  setLanguage('sr');
  assert.deepEqual(validatePrototypes(prototypes), []);
  const html = renderPoseta(visit, prototypes);
  for (const person of visit.participants) {
    assert.equal(html.split(person.name).length - 1, 1, person.name + ' appears more than once');
  }
  for (const work of ['zmijica-2026', 'zgradica-2026', 'upadalica-2026', 'pogodilica-2026', 'sudoku-2026', 'muzicka-kutija-2026']) {
    assert.ok(html.includes(`href="prototipovi.html#${work}"`), work + ' finding must link its gallery entry');
  }
  for (const observation of prototypes.observations) {
    for (const photo of observation.photos) assert.ok(html.includes(`src="${photo.src}"`), photo.src + ' must come from the observation register');
  }
  // The three claims stay separate: seen, reading, next step — labelled, not merged.
  for (const label of ['Viđeno', 'Čitanje', 'Sledeći korak']) assert.ok(html.includes(label));
  // The three recordings are published beside their findings (course lead, 12.10.2026 evening).
  assert.equal((html.match(/<video controls/g) || []).length, 3, 'the three visit recordings must stand beside their findings');
  for (const file of ['poseta-2026-10-09-zgradica.mp4', 'poseta-2026-10-09-upadalica.mp4', 'poseta-2026-10-09-muzicka.mp4']) {
    assert.ok(html.includes('assets/visit/' + file), file + ' must be present');
  }
  // The closer-look section stands between the findings and the patterns.
  assert.ok(html.includes('Prostor i ljudi'), 'the second, closer look must be on the page');
  assert.ok(html.indexOf('id="visit-space-title"') < html.indexOf('id="visit-patterns-title"'), 'the room and the people come before the patterns');
  // No unsupported verdicts and no retired face-claims: this was a visit, not a test.
  for (const banned of ['uspešno testiran', 'odobren od udruženja', 'saglasnost za fotografije', 'bezbedno za sve', 'bez lica', 'ne objavljuju lica']) {
    assert.ok(!html.includes(banned), `"${banned}" is a claim the material cannot support`);
  }
});

test('the static page and the held panel are the renderer output, not a hand-told copy', async () => {
  setLanguage('sr');
  const page = await readFile(new URL('poseta.html', root), 'utf8');
  assert.ok(page.includes(renderPoseta(visit, prototypes)), 'visit page baseline is stale: run tools/poseta-baseline.mjs');
  const index = await readFile(new URL('index.html', root), 'utf8');
  assert.ok(index.includes(renderVisitLead(visit, prototypes)), 'held page lead is stale: run tools/held-baseline.mjs');
  setLanguage('en');
  const english = renderPoseta(visit, prototypes);
  assert.ok(english.includes('Students on the visit'));
  assert.ok(english.includes('What was seen'));
  setLanguage('sr');
});

test('the analysis page carries the version-2 brief and only checked external directions', async () => {
  setLanguage('sr');
  assert.equal(prototypes.observations.length, 9, 'the five established rows plus the four evening additions');
  for (const ph of prototypes.observations.flatMap(o => o.photos)) assert.ok((await readFile(new URL(ph.src, root))).length > 0, ph.src + ' must exist');
  const page = await readFile(new URL('poseta.html', root), 'utf8');
  assert.ok(page.includes('Verzija 2 — i prvi prototip.'), 'the next-class order must stand on the page');
  assert.ok(page.includes('prilog tog časa'), 'the visit material is the appendix of the next class');
  for (const link of ['https://design.ncsu.edu/research/', 'https://www.makersmakingchange.com/', 'https://universaldesign.ie/about-universal-design/']) {
    assert.ok(page.includes('href="' + link + '"'), link + ' must be present');
  }
  for (const person of visit.participants) {
    assert.equal(page.split(person.name).length - 1, 1, person.name + ' appears exactly once on the analysis page');
  }
});

test('the visit and the held week tell the same story: one date, one register', async () => {
  const tok = await json('data/tok.json');
  const week2 = tok.odrzano.find(item => item.nedelja === visit.week);
  assert.ok(week2, 'the visit week must be a held week');
  assert.equal(week2.odrzan, visit.occurredOn, 'the visit date and the held date must agree');
  assert.ok(week2.rezultati.some(r => r.sta.sr.includes('Živimo zajedno') && r.sta.sr.includes('temeljna analiza')), 'the held week must point at the analysis');
});
