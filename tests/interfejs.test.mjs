// The site is an interface, not a record about people: the published surface names no one
// (roles stand in — „direktor udruženja”, „nastavnik”) and waits on no consent. A rule that
// protects a member (no publishing without explicit consent) is content, not a dependency,
// and stays; what may never appear again is a personal name or an entry whose availability
// was gated on consent (photo consent, a date-plus-consent status, a name-with-consent field).
// The dossier, LOG.md, the kit and the tests themselves keep their internal records — this
// scans what a reader can open: pages, assets, data and docs.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

const root = new URL('../', import.meta.url);

const collect = async (dir, exts, out = []) => {
  for (const entry of await readdir(new URL(dir, root), { withFileTypes: true })) {
    if (entry.name === 'vendor') continue; // third-party code, hashed in cover.test.mjs
    const path = dir + '/' + entry.name;
    if (entry.isDirectory()) await collect(path, exts, out);
    else if (exts.some(ext => entry.name.endsWith(ext))) out.push(path);
  }
  return out;
};

const files = [
  ...(await readdir(root)).filter(name => name.endsWith('.html')),
  ...(await collect('assets', ['.js', '.svg'])),
  ...(await collect('data', ['.json', '.md'])),
  ...(await collect('docs', ['.md'])),
  'README.md',
  'README.sr.md'
];

// People the interface once named; a name here means it came back.
const NAMES = /(dejan|kozić|koći|kocić|semir|poturak)/i;
// Entries whose publication waited on a consent decision.
const CONSENT_GATED = /(saglasnost za fotografije|photo consent|termin i saglasnost|ime uz saglasnost|name with consent|čeka saglasnost)/i;

test('the published surface is inventoried — the scan sees the whole site', () => {
  assert.ok(files.length >= 40, `only ${files.length} files collected`);
  for (const must of ['index.html', 'udruzenje.html', 'naslovna.html', 'assets/udruzenje.js', 'data/tok.json', 'docs/probavanje-u-udruzenju.md']) {
    assert.ok(files.includes(must), `the scan misses ${must}`);
  }
});

test('the interface names no person — roles stand in', async () => {
  for (const path of files) {
    const text = await readFile(new URL(path, root), 'utf8');
    const name = text.match(NAMES);
    assert.ok(!name, `${path} carries a personal name: ${name?.[0]}`);
  }
});

test('the interface waits on no consent', async () => {
  for (const path of files) {
    const text = await readFile(new URL(path, root), 'utf8');
    const gated = text.match(CONSENT_GATED);
    assert.ok(!gated, `${path} carries a consent-gated item: ${gated?.[0]}`);
  }
});
