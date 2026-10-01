import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// The site is dependency-free and has no package.json; load its browser ES modules directly.
const load = async name => {
  const source = await readFile(new URL(`../assets/${name}`, import.meta.url), 'utf8');
  return import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
};
const courseModule = await load('course.js');
const exerciseModule = await load('exercises.js');
const contentModule = await load('content.js');
const { course, weeks, blocks, outcomes, site, themes, deliverables, assessment, projectCriteria, links, about } = courseModule;
const { exercises, ideas } = exerciseModule;
const { stages } = contentModule;

const bilingual = value => value && typeof value.en === 'string' && typeof value.sr === 'string' && value.en.trim() && value.sr.trim();

test('the course identity matches the faculty examination record', () => {
  assert.equal(course.programmes.length, 2);
  const [a, b] = course.programmes;
  assert.equal(a.code, '22.OA0068'); assert.equal(a.semester, 5); assert.equal(a.ects, 5);
  assert.equal(b.code, 'OAIPUD'); assert.equal(b.semester, 6); assert.equal(b.ects, 4);
  // The course Semir teaches in 2026/2027 is the fifth-semester, third-year one.
  assert.ok(course.term.sr.includes('2026/2027'), course.term.sr);
  assert.ok(course.term.sr.includes('treća godina'), course.term.sr);
  for (const field of ['title', 'short', 'institution', 'faculty', 'teacher', 'term', 'thesis']) {
    assert.ok(bilingual(course[field]), field);
  }
});

test('what is not yet verified is still declared as unverified', () => {
  assert.ok(course.unconfirmed.en.length >= 3);
  assert.equal(course.unconfirmed.en.length, course.unconfirmed.sr.length);
  // The contact hours are not in the examination record. If that caveat ever disappears
  // silently, the site would be claiming an approved syllabus it does not have.
  assert.ok(course.unconfirmed.sr.some(line => line.includes('Fond časova')));
  assert.ok(course.unconfirmed.sr.some(line => line.includes('radna verzija')));
});

test('there are fifteen teaching weeks, numbered once each, in three blocks', () => {
  assert.equal(weeks.length, 15);
  assert.deepEqual(weeks.map(w => w.n), Array.from({ length: 15 }, (_, i) => i + 1));
  for (const week of weeks) {
    assert.ok(blocks[week.block], `week ${week.n} block`);
    assert.ok(Number.isInteger(week.stage) && week.stage >= 1 && week.stage <= stages.length, `week ${week.n} stage`);
    assert.ok(bilingual(week.lecture), `week ${week.n} lecture`);
    assert.ok(bilingual(week.studio), `week ${week.n} studio`);
  }
  assert.deepEqual(weeks.filter(w => w.block === 'A').map(w => w.n), [1, 2, 3, 4, 5]);
  assert.deepEqual(weeks.filter(w => w.block === 'B').map(w => w.n), [6, 7, 8, 9]);
  assert.deepEqual(weeks.filter(w => w.block === 'C').map(w => w.n), [10, 11, 12, 13, 14, 15]);
});

test('every exercise belongs to a real week and states its hand-in and its check', () => {
  assert.ok(exercises.length >= 15, String(exercises.length));
  const ids = new Set();
  for (const item of exercises) {
    assert.ok(!ids.has(item.id), `duplicate id ${item.id}`);
    ids.add(item.id);
    assert.ok(weeks.some(w => w.n === item.week), `${item.id} week ${item.week}`);
    for (const field of ['title', 'task', 'hand', 'check']) assert.ok(bilingual(item[field]), `${item.id} ${field}`);
    assert.ok(item.source && item.source.label, `${item.id} source`);
    if (item.source.url) assert.match(item.source.url, /^https:\/\//, `${item.id} url`);
  }
  // Every block has work in it; a block with no exercise is a block nobody can do.
  for (const block of ['A', 'B', 'C']) {
    assert.ok(exercises.some(e => weeks.find(w => w.n === e.week).block === block), `block ${block}`);
  }
});

test('the site figures and the problem statement agree', () => {
  const figure = label => site.figures.find(f => f.label.en === label).value;
  assert.equal(figure('Height difference'), '22,5 m');
  assert.equal(figure('Straight-line distance'), '151 m');
  assert.equal(figure('Measured points'), '151');
  // The reconnaissance caveat is the one sentence that stops the base from being misread.
  assert.ok(site.caveat.sr.includes('rekognosciranje'));
  assert.ok(site.caveat.en.includes('not a survey for design'));
  assert.ok(site.problem.en.includes('22,5 m'));
});

test('both programmes are marked out of one hundred', () => {
  assert.equal(assessment.reduce((sum, row) => sum + row.a, 0), 100);
  assert.equal(assessment.reduce((sum, row) => sum + row.b, 0), 100);
  assert.equal(projectCriteria.reduce((sum, row) => sum + row.share, 0), 100);
});

test('the compulsory hand-in items are the ones that carry the course', () => {
  assert.deepEqual(deliverables.map(d => d.n), [1, 2, 3, 4, 5, 6, 7, 8]);
  assert.deepEqual(deliverables.filter(d => d.core).map(d => d.n), [2, 6, 7, 8]);
  for (const item of deliverables) assert.ok(bilingual(item.text), `deliverable ${item.n}`);
});

test('the teacher page, themes, outcomes, ideas and links are complete and bilingual', () => {
  assert.equal(themes.length, 3);
  assert.deepEqual(themes.map(t => t.key), ['A', 'B', 'C']);
  assert.ok(outcomes.length >= 5);
  for (const outcome of outcomes) assert.ok(bilingual(outcome));
  assert.ok(about.eras.length >= 5);
  for (const era of about.eras) {
    assert.match(era.period, /^\d{4}–\d{4}$/);
    assert.ok(bilingual(era.place) && bilingual(era.body), era.period);
  }
  assert.ok(ideas.length >= 5);
  for (const idea of ideas) for (const field of ['scale', 'title', 'body', 'why']) assert.ok(bilingual(idea[field]), `${idea.id} ${field}`);
  for (const group of links) {
    assert.ok(bilingual(group.group));
    for (const item of group.items) {
      assert.ok(bilingual(item.label));
      assert.match(item.url, /^https:\/\//, item.url);
    }
  }
});
