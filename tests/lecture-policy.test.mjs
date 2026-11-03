import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { lecturePolicy, selectLecture, validatePublication } from '../assets/lecture-policy.js';

const hash = 'a'.repeat(64);
const record = { week: 1, kind: 'held-record', materialSha256: hash, source: 'Confirmed class record', recordedAt: '2026-10-02T12:00:00Z' };
const manifest = { schema: 'course-publication/v1', items: [record] };
const index = { current: 2, weeks: [{ n: 1, state: 'published' }, { n: 2, state: 'published' }, { n: 3, state: 'draft' }] };

test('published preparation and drafts cannot be mistaken for recorded or finalized lectures', () => {
  assert.equal(lecturePolicy({ n: 2, state: 'published' }, manifest, hash).allowed, false);
  assert.equal(lecturePolicy({ n: 1, state: 'draft' }, manifest, hash).allowed, false);
  assert.equal(lecturePolicy({ n: 3, state: 'draft' }, manifest, hash).allowed, false);
  assert.equal(selectLecture(index, manifest, null).n, 1);
  assert.equal(selectLecture(index, manifest, 90), null);
});

test('the stored material fingerprint must match; a held record does not claim teacher approval', () => {
  assert.deepEqual(lecturePolicy({ n: 1, state: 'published' }, manifest, hash), { allowed: true, mode: 'held-record', source: record.source });
  assert.equal(lecturePolicy({ n: 1, state: 'published' }, manifest, 'b'.repeat(64)).reason, 'changed-material');
  assert.equal(lecturePolicy({ n: 1, state: 'published' }, manifest, undefined).allowed, false);
  const finalized = { ...manifest, items: [{ ...record, kind: 'teacher-finalized' }] };
  assert.equal(lecturePolicy({ n: 1, state: 'published' }, finalized, hash).mode, 'teacher-finalized');
});

test('preview stays available and carries preparation status even for published content', () => {
  for (const n of [1, 2, 3]) assert.deepEqual(lecturePolicy({ n, state: 'draft' }, manifest, '', { preview: true }), { allowed: true, mode: 'preparation', reason: 'preview' });
  assert.equal(selectLecture(index, manifest, null, { preview: true }).n, 2);
});

test('malformed or ambiguous publication records fail closed', () => {
  for (const invalid of [null, { items: [] }, { ...manifest, items: [record, record] }, { ...manifest, items: [{ ...record, source: '' }] }, { ...manifest, items: [{ ...record, kind: 'published' }] }]) {
    assert.ok(validatePublication(invalid).length);
    assert.equal(lecturePolicy({ n: 1, state: 'published' }, invalid, hash).allowed, false);
  }
});

test('registered material matches its bytes and held records have corresponding class evidence', async () => {
  const real = JSON.parse(await readFile(new URL('../data/course-publication.json', import.meta.url), 'utf8'));
  const flow = JSON.parse(await readFile(new URL('../data/tok.json', import.meta.url), 'utf8'));
  assert.deepEqual(validatePublication(real), []);
  for (const item of real.items) {
    const bytes = await readFile(new URL(`../data/material/w${String(item.week).padStart(2, '0')}.json`, import.meta.url));
    assert.equal(lecturePolicy(JSON.parse(bytes), real, createHash('sha256').update(bytes).digest('hex')).allowed, true);
    if (item.kind === 'held-record') assert.ok(flow.odrzano.some(record => record.nedelja === item.week && record.odrzan && record.rezultati?.length), `week ${item.week}: no dated class record`);
  }
});
