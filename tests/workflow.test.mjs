import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const source = async file => readFile(new URL(file, root), 'utf8');

test('the weekly record is one A3 reviewed and signed on paper', async () => {
  const week = await source('assets/home.js');
  const task = await source('assets/task.js');
  assert.match(week, /Jedna nedelja\. Jedan A3\. Jedan razgovor\./);
  assert.match(week, /potpisuje na papiru|Potpis/);
  assert.match(task, /Evidencija na predmetu je A3 na papiru/);
  assert.match(task, /nastavnik ga pregleda i potpisuje na kraju časa/);
});

test('the official student path never sends a hand-in to GitHub', async () => {
  const task = await source('assets/task.js');
  const labs = await source('assets/labs.js');
  const week = await source('assets/home.js');
  const studioFile = await source('assets/studio.js');
  const start = studioFile.indexOf('function studio()');
  const end = studioFile.indexOf('function eventRange', start);
  assert.ok(start >= 0 && end > start, 'studio view can be isolated from the optional public-board code');
  const studioView = studioFile.slice(start, end);
  for (const [name, text] of [['task', task], ['labs', labs], ['week', week], ['studio', studioView]]) {
    assert.ok(!text.includes('issues/new?template=predaja.yml'), name);
    assert.ok(!text.includes('Predaj na tabli'), name);
  }
  assert.match(task, /ideja\.html/);
  assert.match(labs, /ideja\.html/);
  const exercises = await source('assets/exercises.js');
  assert.doesNotMatch(exercises, /published on the pinboard|objavljen na tabli/);
});

test('two exercises in one week are explicitly parts of one A3', async () => {
  const studio = await source('assets/studio.js');
  const exercises = await source('assets/exercises.js');
  assert.match(studio, /two parts of that same sheet/);
  assert.match(studio, /dva dela istog lista/);
  assert.match(exercises, /Left half of the week 14 A3/);
  assert.match(exercises, /Gornji deo A3 lista za 15\. nedelju/);
});

test('the idea atelier is explicitly separate from assignments', async () => {
  const page = await source('ideja.html');
  const module = await source('assets/ideas.js');
  assert.match(page, /Nothing here becomes an assignment automatically/);
  assert.match(module, /Odavde se ništa ne zadaje automatski/);
  assert.match(module, /nije nastavni zadatak|ne menja nastavno gradivo/);
  assert.ok(!module.includes('issues/new'));
});
