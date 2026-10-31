// The third association visit with prototypes (30.10.2026). 31.10.2026, teacher: file the
// emailed visit list as the fifth-class visit and join it to every student's record.
// 31.10.2026: the six photographs the students took (Drive folder sent with the list) are
// the visit's material; a frame names a work only where that work is recognised in it.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { validateVisit } from '../assets/poseta-core.js';
import { indexKey } from '../assets/dnevnik-core.js';

const root = new URL('../', import.meta.url);
const json = async p => JSON.parse(await readFile(new URL(p, root), 'utf8'));
const v = await json('data/poseta-2026-10-30.json');

test('the visit register of 30.10 is valid and dated to the fifth class', () => {
  assert.deepEqual(validateVisit(v), []);
  assert.equal(v.participants.length, 34);
  assert.equal(v.week, 5);
  assert.equal(v.occurredOn, '2026-10-30');
  assert.equal(new Set(v.participants.map(p => indexKey(p.studentNumber))).size, 34);
});

test('the six student photographs are the files they claim to be, and name only known works', async () => {
  assert.equal(v.photos.length, 6);
  const works = new Set(((await json('data/prototipovi.json')).galleries || []).filter(g => g.documentedWeek === 5).map(g => g.id));
  for (const p of v.photos) {
    assert.equal(createHash('sha256').update(await readFile(new URL(p.src, root))).digest('hex'), p.sha256, p.id);
    for (const id of p.radovi || []) assert.ok(works.has(id), p.id + ' names a work not on the fifth-class list: ' + id);
  }
  assert.deepEqual(v.photos.filter(p => p.radovi).map(p => p.radovi).flat().sort(), ['w5-bajic', 'w5-usjak']);
});

test('the fifth-class list names this visit, and the journal reads it', async () => {
  assert.equal((await json('data/cas-05/spisak.json')).posetaRegistar, 'data/poseta-2026-10-30.json');
  const journal = await json('data/dnevnik.json');
  assert.ok(journal.visits.some(x => x.file === 'data/poseta-2026-10-30.json' && x.page === 'poseta-w05.html'));
});

test('a visitor already in a register keeps that register’s spelling for the same number', async () => {
  const known = new Map();
  for (const g of (await json('data/prototipovi.json')).galleries || []) {
    if (g.author?.studentNumber) known.set(indexKey(g.author.studentNumber), g.author.name);
  }
  for (const p of v.participants) {
    const name = known.get(indexKey(p.studentNumber));
    if (name) assert.equal(p.name, name);
  }
});
