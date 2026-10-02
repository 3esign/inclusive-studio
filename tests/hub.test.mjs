// The creative hub keeps two promises: the announcements are three and only three,
// and every source on the shelf declares how far we actually read it.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import { notices, assessment, weeks } from '../assets/course.js';
import { RESEARCH, RESEARCH_KINDS, RESEARCH_THREADS, OPEN_QUESTIONS, filterResearch, researchById } from '../assets/research.js';
import { IDEA_BANK } from '../assets/idea-bank.js';
import { exercises } from '../assets/exercises.js';

const source = file => readFile(new URL('../' + file, import.meta.url), 'utf8');
const bilingual = value => Boolean(value && value.en && value.sr);

test('the whole announcement board is three facts: the A3, the signature, the two colloquia', () => {
  assert.equal(notices.length, 3);
  assert.deepEqual(notices.map(item => item.id), ['a3', 'signature', 'colloquia']);
  for (const item of notices) {
    assert.ok(bilingual(item.title), item.id);
    assert.ok(bilingual(item.body), item.id);
  }
  assert.match(notices[0].body.sr, /A3/);
  assert.match(notices[1].body.sr, /potpisuje/);
  assert.match(notices[2].title.sr, /novembra/);
  assert.match(notices[2].title.sr, /decembra/);
});

test('two colloquia are marked, and the marks still add to one hundred', () => {
  const colloquia = assessment.filter(row => /Kolokvijum/.test(row.item.sr));
  assert.equal(colloquia.length, 2);
  assert.equal(assessment.reduce((sum, row) => sum + row.a, 0), 100);
  assert.equal(assessment.reduce((sum, row) => sum + row.b, 0), 100);
  const colloquiumWeeks = weeks.filter(week => /Kolokvijum/.test(week.studio.sr));
  assert.deepEqual(colloquiumWeeks.map(week => week.n), [5, 11]);
});

test('week one is the toy, and the toy carries the one number that can hurt a child', async () => {
  const toy = exercises.find(item => item.id === 'toy-for-coordination');
  assert.ok(toy, 'the toy exercise exists');
  assert.equal(toy.week, 1);
  for (const field of ['title', 'task', 'hand', 'check']) assert.ok(bilingual(toy[field]), field);
  // EN 71-1 small parts cylinder: a loose part that fits entirely inside is a choking hazard.
  assert.match(toy.hand.sr, /31,7 mm/);
  assert.match(toy.check.sr, /31,7 mm/);
  assert.match(toy.check.sr, /dijagnoza/);
  const week = JSON.parse(await source('data/material/w01.json'));
  assert.equal(week.n, 1);
  assert.ok(week.blocks.some(block => block.kind === 'exercise' && block.ref === 'toy-for-coordination'));
  assert.ok(week.blocks.some(block => block.kind === 'measure' && /31,7/.test(block.value)));
});

test('week two is the prototype: an object that was built, with the material order and the cord limit', async () => {
  const build = exercises.find(item => item.id === 'prototype-from-waste');
  assert.ok(build, 'the prototype exercise exists');
  assert.equal(build.week, 2);
  assert.equal(build.kind, 'making');
  for (const field of ['title', 'task', 'hand', 'check']) assert.ok(bilingual(build[field]), field);
  // The material order is the whole point: found before bought, printed last.
  assert.match(build.task.sr, /nađeno/);
  assert.match(build.task.sr, /štampano poslednje/);
  // The gauge is checked again on the object, not only on the drawing.
  assert.match(build.hand.sr, /sitnih delova/);
  assert.match(build.check.sr, /31,7 mm/);

  const audit = exercises.find(item => item.id === 'seven-principles-audit');
  assert.equal(audit.week, 2, 'the seven principles are judged on the same sheet');
  assert.match(audit.check.sr, /prototip/);

  const week = JSON.parse(await source('data/material/w02.json'));
  assert.equal(week.n, 2);
  assert.equal(week.state, 'published');
  assert.ok(week.blocks.some(block => block.kind === 'exercise' && block.ref === 'prototype-from-waste'));
  // EN 71-1: a cord that can tangle on a toy for a child under 18 months.
  assert.ok(week.blocks.some(block => block.kind === 'measure' && /220 mm/.test(block.value)));
  // The claim about the hand beating the screen may not be stated harder than it was read.
  assert.ok(RESEARCH.some(entry => entry.id === 'gilligan-lee-2023' && entry.verified === 'abstract'));
});

test('every source on the shelf says what it does not say, and how far we read it', () => {
  assert.ok(RESEARCH.length >= 20, 'the shelf is not a handful of links');
  assert.equal(new Set(RESEARCH.map(entry => entry.id)).size, RESEARCH.length);
  const kinds = new Set(RESEARCH_KINDS.map(item => item.id));
  const threads = new Set(RESEARCH_THREADS.map(item => item.id));
  for (const entry of RESEARCH) {
    assert.match(entry.id, /^[a-z0-9-]+$/);
    assert.ok(kinds.has(entry.kind), entry.id);
    assert.ok(threads.has(entry.thread), entry.id);
    assert.ok(['full', 'abstract', 'secondary'].includes(entry.verified), entry.id);
    assert.ok(Number.isInteger(entry.year) && entry.year > 1900, entry.id);
    assert.ok(entry.who && entry.who.length > 3, entry.id);
    for (const field of ['title', 'says', 'limit', 'use']) assert.ok(bilingual(entry[field]), `${entry.id}: ${field}`);
    assert.match(entry.url, /^https?:\/\//, entry.id);
    // A limit that merely repeats the finding is not a limit.
    assert.notEqual(entry.limit.sr, entry.says.sr, entry.id);
  }
  assert.ok(RESEARCH.some(entry => entry.verified === 'full'), 'something was actually opened');
  assert.ok(RESEARCH.some(entry => entry.verified === 'secondary'), 'the shelf admits what it has not opened');
});

test('the shelf can be filtered the way a reader filters it', () => {
  assert.equal(filterResearch({ thread: 'spatial' }).every(entry => entry.thread === 'spatial'), true);
  assert.ok(filterResearch({ thread: 'after' }).length >= 3);
  assert.ok(filterResearch({ verified: 'secondary' }).length >= 1);
  assert.deepEqual(filterResearch({ query: 'nepostojeća reč' }), []);
  assert.equal(researchById('en71-1').verified, 'full');
  assert.equal(researchById('nothing-here'), null);
});

test('an open question states what would change and what the next move is', () => {
  assert.ok(OPEN_QUESTIONS.length >= 3);
  for (const item of OPEN_QUESTIONS) {
    assert.match(item.id, /^[a-z0-9-]+$/);
    for (const field of ['question', 'why', 'next']) assert.ok(bilingual(item[field]), `${item.id}: ${field}`);
  }
});

test('the hub carries the toy thread as seeds, not only as a finished week', () => {
  const children = IDEA_BANK.filter(idea => idea.field === 'children');
  assert.ok(children.length >= 4, 'the children and play thread is a field, not an afterthought');
  assert.ok(IDEA_BANK.some(idea => idea.id === 'toy-from-rubbish' && idea.status === 'in-use'));
  assert.ok(IDEA_BANK.some(idea => idea.id === 'deck-after-diagnosis' && idea.status === 'research'));
});

test('the hub page still refuses to assign anything by itself', async () => {
  const page = await source('ideja.html');
  const module = await source('assets/ideas.js');
  assert.match(page, /Creative hub/);
  assert.match(page, /Nothing here becomes an assignment automatically/);
  assert.match(module, /Odavde se ništa ne zadaje automatski/);
  assert.match(module, /Ništa ovde nije predaja i ništa se odavde ne zadaje/);
});
