// The association space: every promise on it comes from the try-out protocol, the verdict
// of the safety gate is derived rather than chosen, nothing leaves the reader's browser,
// and the open arrangements are said to be open.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { GATE_ITEMS, gateVerdict, STEPS, RIGHTS, MEASURED, NEVER } from '../assets/udruzenje-core.js';

const root = new URL('../', import.meta.url);
const page = await readFile(new URL('udruzenje.html', root), 'utf8');
const moduleSource = await readFile(new URL('assets/udruzenje.js', root), 'utf8');

test('the safety gate verdict is derived, never chosen', () => {
  const all = Object.fromEntries(GATE_ITEMS.map(item => [item.id, true]));
  assert.equal(gateVerdict(all).pass, true);
  for (const item of GATE_ITEMS) {
    const missingOne = { ...all, [item.id]: false };
    const verdict = gateVerdict(missingOne);
    assert.equal(verdict.pass, false, `a prototype missing "${item.id}" must not pass`);
    assert.equal(verdict.closed, GATE_ITEMS.length - 1);
  }
  assert.equal(gateVerdict({}).pass, false);
  assert.equal(gateVerdict(null).pass, false, 'an unexamined prototype is not a passed prototype');
  assert.ok(GATE_ITEMS.length === 4, 'the gate has four checks — EN 71-1 small parts, edges, cord, pull');
});

test('the page states the four things that are never done and the five rights', () => {
  assert.equal(RIGHTS.length, 5);
  assert.equal(NEVER.length, 4);
  for (const phrase of ['Bez simulacije invaliditeta', 'Bez ocenjivanja osoba', 'Bez pritiska', 'Bez objave']) {
    assert.ok(page.includes(phrase), `the page no longer says: ${phrase}`);
  }
  for (const phrase of ['dobrovoljno', 'stanete u svakom trenutku', 'Vi se ne ocenjujete', 'saglasnost', 'radnoj svesci studenta']) {
    assert.ok(page.includes(phrase), `the page no longer guarantees: ${phrase}`);
  }
});

test('the open arrangements are said to be open — and nobody is named', () => {
  assert.ok(!/Dejan|Kozić|Koći/.test(page), 'the page still names the director');
  assert.ok(!/saglasnost za fotografije|photo consent|ime uz saglasnost|name with consent/.test(page), 'the page still waits on photo consent');
  assert.ok(page.includes('dogovaraju unapred'), 'the page hides that the date and space are agreed in advance');
});

test('no invented contact channel: no mailto, no tel, no form that submits', () => {
  assert.ok(!page.includes('mailto:'), 'an e-mail contact was invented');
  assert.ok(!page.includes('tel:'), 'a phone contact was invented');
  assert.ok(!/<form/.test(page), 'the page submits a form somewhere');
});

test('serbian is the primary language of this page', () => {
  assert.ok(page.includes('<html lang="sr-Latn"'), 'the page does not declare Serbian first');
  assert.equal(STEPS.length, 4);
  for (const step of STEPS) assert.ok(step.sr.length === 2 && step.sr[0] && step.sr[1]);
  assert.ok(page.includes('Probate na svojim rukama'));
});

test('serbian quotes close the serbian way — „…”, never „…" nor „…“ (KNOWLEDGE.md: Greske)', () => {
  const marks = '„"“”';
  for (const text of [page, moduleSource, JSON.stringify({ STEPS, RIGHTS, MEASURED, NEVER })]) {
    for (const line of text.split('\n')) {
      for (let i = line.indexOf('„'); i !== -1; i = line.indexOf('„', i + 1)) {
        let j = i + 1;
        while (j < line.length && !marks.includes(line[j])) j++;
        assert.ok(j < line.length, `a „ is never closed on its line: ${line.slice(i, i + 40)}`);
        assert.equal(line[j], '”', `wrong closer after ${line.slice(i, j + 1)}`);
      }
    }
  }
});

test('the gate keeps its state in this browser only — nothing leaves the device', () => {
  assert.ok(!/fetch\(|XMLHttpRequest|navigator\.sendBeacon/.test(moduleSource), 'the association page talks to the network');
  assert.ok(moduleSource.includes("save('udruzenje-kapija'"), 'the gate state lost its storage key');
});

test('the recording sheet prints, with the protocol lines that bind it', async () => {
  for (const needle of ['print-sheet', 'blank-row', 'Kapija bezbednosti potpisana pre ruku', 'Vreme do prvog uspeha']) {
    assert.ok(page.includes(needle), `the printable sheet is missing: ${needle}`);
  }
  assert.equal(MEASURED.length, 6, 'the measured set grew or shrank away from the protocol');
});
