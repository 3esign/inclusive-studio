import test from 'node:test';
import assert from 'node:assert/strict';
import { IDEA_BANK, IDEA_FIELDS, IDEA_STATUSES, filterIdeas, connectIdeas } from '../assets/idea-bank.js';

test('the atelier is a structured bank, not a paragraph of suggestions', () => {
  assert.ok(IDEA_BANK.length >= 16);
  assert.equal(new Set(IDEA_BANK.map(idea => idea.id)).size, IDEA_BANK.length);
  const statuses = new Set(IDEA_STATUSES.map(item => item.id));
  const fields = new Set(IDEA_FIELDS.map(item => item.id));
  for (const idea of IDEA_BANK) {
    assert.match(idea.id, /^[a-z0-9-]+$/);
    assert.ok(statuses.has(idea.status), idea.id);
    assert.ok(fields.has(idea.field), idea.id);
    assert.ok(idea.title.en && idea.title.sr, idea.id);
    assert.ok(idea.question.en && idea.question.sr, idea.id);
    assert.ok(idea.move.en && idea.move.sr, idea.id);
    assert.ok(idea.evidence.en && idea.evidence.sr, idea.id);
    assert.ok(Array.isArray(idea.principles) && idea.principles.every(number => number >= 1 && number <= 7), idea.id);
    assert.match(idea.source.url, /^https:\/\//, idea.id);
  }
});

test('filters can combine state, field, principle and Serbian text', () => {
  const result = filterIdeas({ status: 'research', field: 'digital', principle: '4', query: 'AI' });
  assert.ok(result.length >= 2);
  assert.ok(result.every(idea => idea.status === 'research' && idea.field === 'digital' && idea.principles.includes(4)));
  assert.deepEqual(filterIdeas({ query: 'nepostojeća reč' }), []);
});

test('two distinct seeds form a testable connection in either language', () => {
  const sr = connectIdeas('haptic-threshold', 'ai-uncertainty', 'sr');
  const en = connectIdeas('haptic-threshold', 'ai-uncertainty', 'en');
  for (const bridge of [sr, en]) {
    assert.ok(bridge.title && bridge.question && bridge.move && bridge.evidence && bridge.guardrail);
    assert.ok(Array.isArray(bridge.principles));
  }
  assert.match(sr.guardrail, /nije nastavni zadatak/);
  assert.match(en.guardrail, /not an assignment/);
  assert.equal(connectIdeas('haptic-threshold', 'haptic-threshold', 'sr'), null);
  assert.equal(connectIdeas('missing', 'ai-uncertainty', 'sr'), null);
});
