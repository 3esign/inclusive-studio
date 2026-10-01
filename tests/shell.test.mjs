// Fourteen pages must not drift apart: one navigation, one course band, one module each,
// and a static baseline that still works when JavaScript does not run.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

const load = name => import(new URL(`../assets/${name}`, import.meta.url).href);
const { NAV } = await load('core.js');
const { identity } = await load('identity.js');

const root = new URL('../', import.meta.url);
const pages = (await readdir(root)).filter(name => name.endsWith('.html')).sort();
const html = {};
for (const page of pages) html[page] = await readFile(new URL(page, root), 'utf8');

const MODULES = {
  'index.html': 'week.js', 'predavanje.html': 'lecture.js', 'laboratorija.html': 'labs.js',
  'zadatak.html': 'task.js', 'uredi.html': 'editor.js'
};

test('the pages are exactly the ones the navigation points at', () => {
  const linked = NAV.map(item => item.href).sort();
  assert.deepEqual(pages, [...new Set(linked)].sort());
});

test('every page carries the same navigation, in the same order', () => {
  const expected = NAV.filter(item => item.group !== 'footer').map(item => item.id);
  for (const page of pages) {
    const found = [...html[page].matchAll(/data-nav="([a-z]+)"/g)].map(match => match[1]);
    assert.deepEqual(found, expected, page);
    assert.ok(html[page].includes('class="tabbar"'), page + ' has no tab bar for phones');
    assert.ok(html[page].includes('id="announcements"'), page + ' has no live region');
    assert.ok(html[page].includes('id="skip-link"'), page + ' has no skip link');
  }
});

test('each page marks itself as the current one, exactly once', () => {
  for (const page of pages) {
    const item = NAV.find(entry => entry.href === page);
    const navCurrent = [...html[page].matchAll(/data-nav="([a-z]+)"[^>]*aria-current="page"/g)].map(m => m[1]);
    if (item.group === 'footer') assert.deepEqual(navCurrent, [], page);
    else assert.deepEqual(navCurrent, [item.id], page);
    assert.equal(html[page].match(/data-view="([a-z]+)"/)[1], item.id, page);
  }
});

test('every page loads one module, and only the pages that need the big bundle get it', () => {
  for (const page of pages) {
    const scripts = [...html[page].matchAll(/<script type="module" src="assets\/([a-z.-]+)"/g)].map(m => m[1]);
    assert.equal(scripts.length, 1, page);
    assert.equal(scripts[0], MODULES[page] || 'studio.js', page);
  }
  const lean = Object.keys(MODULES);
  for (const page of lean) assert.ok(!html[page].includes('studio.js'), page + ' must not load the legacy bundle');
});

test('the course band on every page names the course, the faculty, the teacher and the term', () => {
  for (const page of pages) {
    const band = html[page].match(/<div class="course-band">([\s\S]*?)<\/div>/);
    assert.ok(band, page + ' has no course band');
    for (const value of [identity.title.en, identity.institution.en, identity.faculty.en, identity.teacher.en, identity.term.en]) {
      assert.ok(band[1].includes(value), `${page} band is missing: ${value}`);
    }
  }
});

test('every page has exactly one h1 and a title that names the course', () => {
  for (const page of pages) {
    assert.equal((html[page].match(/<h1[ >]/g) || []).length, 1, page);
    const title = html[page].match(/<title>([^<]+)<\/title>/)[1];
    assert.ok(title.includes(identity.title.en), page);
    assert.ok(title.includes('Union'), page);
    assert.ok(html[page].includes('name="description"'), page + ' has no description');
    assert.ok(html[page].includes('width=device-width'), page + ' is not scaled for a phone');
  }
});

test('the static baseline of every page offers a way onward without JavaScript', () => {
  for (const page of pages) {
    const main = html[page].match(/<main[^>]*>([\s\S]*?)<\/main>/)[1];
    const links = (main.match(/<a /g) || []).length;
    assert.ok(links >= 1, page + ' main has no links at all');
    assert.ok(main.trim().length > 200, page + ' main is empty');
  }
});

test('nothing in the markup carries an inline handler or an inline script', () => {
  for (const page of pages) {
    assert.ok(!/ on[a-z]+=/.test(html[page]), page + ' has an inline event handler');
    assert.ok(!/<script(?![^>]*src=)/.test(html[page]), page + ' has an inline script');
  }
});

test('the laboratory page lists its labs even with scripting off', async () => {
  const { labs } = await load('lab-core.js');
  for (const lab of labs) {
    assert.ok(html['laboratorija.html'].includes(`lab=${lab.id}`), 'static list misses ' + lab.id);
  }
});

test('the evidence against disability simulation is on the page itself, not only in the code', () => {
  assert.ok(html['laboratorija.html'].includes('Nario-Redmond'));
  assert.ok(html['laboratorija.html'].includes('blindfold'));
});

test('the CSS and the modules are the only assets the shells reference', () => {
  for (const page of pages) {
    const references = [...html[page].matchAll(/(?:src|href)="(assets\/[^"]+)"/g)].map(m => m[1]);
    for (const reference of references) {
      assert.ok(/^assets\/(style\.css|mark\.svg|[a-z-]+\.js)$/.test(reference), `${page}: unexpected asset ${reference}`);
    }
  }
});
