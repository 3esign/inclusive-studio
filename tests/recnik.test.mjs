// The site speaks Serbian on its surface, and its structural vocabulary names things
// plainly: održano, sledeći čas, oblak ideja. The old metaphors — cement, pilot, shelf —
// are gone from every shell and from every module that renders chrome. A quoted paper
// title or a literal piece of furniture keeps its own words; our labels do not borrow them.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const read = async path => readFile(new URL(path, root), 'utf8');

const pages = (await readdir(root)).filter(name => name.endsWith('.html')).sort();
// Modules that render navigation, footers, status lines or page chrome. Data modules
// (research.js, idea-bank.js) quote external titles verbatim and are scanned separately below.
const CHROME_MODULES = ['core.js', 'home.js', 'naslovna.js', 'sledeci.js', 'oblak.js', 'udruzenje.js', 'studio.js', 'ideas.js'];

const JARGON = /\bzacement\w*|\bcement(ed)?\b|\bpilot\w*\b|\bpolice\b|\bpolica\b/ig;

test('no shell carries the old flow vocabulary — cement, pilot, shelf', async () => {
  for (const page of pages) {
    const text = await read(page);
    const hit = text.match(JARGON);
    assert.ok(!hit, `${page}: the old vocabulary is still on the surface ("${hit && hit[0]}")`);
  }
});

test('no chrome-rendering module reintroduces the old vocabulary at runtime', async () => {
  for (const name of CHROME_MODULES) {
    const text = await read('assets/' + name);
    const hits = [...text.matchAll(JARGON)].map(m => m[0]);
    assert.deepEqual(hits, [], `assets/${name}: renders the old vocabulary at runtime`);
  }
});

test('the shells greet in Serbian: skip link, brand, footer and language door', async () => {
  const { identity } = await import(new URL('../assets/identity.js', import.meta.url).href);
  const brand = identity.short.sr.replace(' ', '<br>');
  for (const page of pages) {
    const text = await read(page);
    assert.ok(text.includes('Pređi na sadržaj'), page + ': the skip link is not Serbian');
    assert.ok(text.includes(`<span>${brand}</span>`), page + ': the brand is not the Serbian mark');
    assert.ok(text.includes('Zajednički studio otvoren za doradu.'), page + ': the footer note is not Serbian');
    // English stays behind one door: the language toggle. It must not be the default shell.
    assert.ok(!/>Cover</.test(text) && !/>Course flow</.test(text), page + ': an English navigation label is stamped in the shell');
  }
});

test('quoted sources keep their own words — the ban is on our labels, not on titles', async () => {
  // research.js carries paper titles and provenance that legitimately contain these words.
  // The line below is the guard rail: if these files ever start rendering navigation or
  // status labels, they must join CHROME_MODULES above.
  for (const name of ['research.js', 'idea-bank.js']) {
    const text = await read('assets/' + name);
    assert.ok(!text.includes('data-nav'), `assets/${name}: renders navigation — add it to CHROME_MODULES`);
  }
});
