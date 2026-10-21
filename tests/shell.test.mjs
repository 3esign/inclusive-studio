// Every page must carry one navigation, one course band and one module,
// a Serbian shell, and a static baseline that still works when JavaScript does not run.
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
  'index.html': 'home.js', 'predavanje.html': 'lecture.js', 'laboratorija.html': 'labs.js',
  'zadatak.html': 'task.js', 'uredi.html': 'editor.js', 'ideja.html': 'ideas.js',
  'igracka.html': 'toy.js', 'godista.html': 'ages.js',
  'naslovna.html': 'naslovna.js', 'udruzenje.html': 'udruzenje.js',
  'sledeci.html': 'sledeci.js', 'oblak.html': 'oblak.js', 'prototipovi.html': 'prototipovi.js',
  'poseta.html': 'poseta.js', 'cas-03.html': 'cas.js'
};

test('the established primary destinations and lecture/source routes cannot disappear together with generated shells', () => {
  // 20.10.2026 (kanon predmeta): five main destinations — sources joined the primary row
  // after the next class, so every course site carries the same five doors.
  const primary = [['cover', 'naslovna.html'], ['flow', 'index.html'], ['next', 'sledeci.html'], ['library', 'resources.html'], ['cloud', 'oblak.html']];
  assert.deepEqual(NAV.filter(item => item.group === 'primary').map(item => [item.id, item.href]), primary);
  for (const [id, href] of [['library', 'resources.html'], ['lecture', 'predavanje.html']]) {
    assert.equal(NAV.find(item => item.id === id)?.href, href, id + ' retains its existing route');
    assert.ok(pages.includes(href), href + ' must remain a real page');
  }
});

test('the navigation points only at real pages, and the material pages stay published', () => {
  for (const item of NAV) assert.ok(pages.includes(item.href), item.href + ' must remain a real page');
  for (const must of ['prototipovi.html', 'poseta.html', 'udruzenje.html', 'resources.html', 'ideja.html', 'predmet.html']) {
    assert.ok(pages.includes(must), must + ' must stay a published page');
  }
});

test('every page carries the same four-door navigation, in the same order, labelled in Serbian', () => {
  const expected = NAV.filter(item => item.group === 'primary').map(item => item.id);
  for (const page of pages) {
    const found = [...html[page].matchAll(/data-nav="([a-z]+)"/g)].map(match => match[1]);
    assert.deepEqual(found, expected, page);
    for (const item of NAV.filter(entry => entry.group === 'primary')) {
      assert.ok(html[page].includes(`>${item.sr}</a>`), `${page}: navigation label "${item.sr}" is missing — the shell language slipped`);
    }
    // 12.10.2026 (course lead's note): the top navigation is present at every width; the bottom tab bar is gone.
    assert.ok(!html[page].includes('class="tabbar"'), page + ' still carries a tab bar');
    assert.ok(html[page].includes('class="main-nav"'), page + ' has no top navigation');
    assert.ok(html[page].includes('id="announcements"'), page + ' has no live region');
    assert.ok(html[page].includes('id="skip-link"'), page + ' has no skip link');
  }
});

test('each page marks itself as the current one, exactly once', () => {
  for (const page of pages) {
    const item = NAV.find(entry => entry.href === page);
    const navCurrent = [...html[page].matchAll(/data-nav="([a-z]+)"[^>]*aria-current="page"/g)].map(m => m[1]);
    // 12.10.2026 (course lead): only the four primary doors mark themselves as current;
    // material pages keep their data-view but carry no navigation highlight.
    if (item && item.group === 'primary') assert.deepEqual(navCurrent, [item.id], page);
    else assert.deepEqual(navCurrent, [], page);
    const view = html[page].match(/data-view="([a-z]+)"/);
    assert.ok(view, page + ' has no data-view');
    if (item) assert.equal(view[1], item.id, page);
  }
});

test('every page declares Serbian as its language, and its title names the course in Serbian', () => {
  for (const page of pages) {
    assert.ok(html[page].startsWith('<!doctype html>\n<html lang="sr-Latn">'), page + ' is not declared Serbian (sr-Latn)');
    const title = html[page].match(/<title>([^<]+)<\/title>/)[1];
    assert.ok(title.includes(identity.title.sr), page + ' title is not Serbian');
    assert.ok(title.includes('Union'), page);
    assert.ok(html[page].includes('name="description"'), page + ' has no description');
    assert.ok(html[page].includes('width=device-width'), page + ' is not scaled for a phone');
  }
});

test('every page loads one module, and only the pages that need the big bundle get it', () => {
  for (const page of pages) {
    const scripts = [...html[page].matchAll(/<script type="module" src="assets\/([a-z.-]+)"/g)].map(m => m[1]);
    assert.equal(scripts.length, 1, page);
    assert.equal(scripts[0], MODULES[page] || (page.startsWith('galerija-') ? 'gallery-page.js' : 'studio.js'), page);
  }
  const lean = Object.keys(MODULES);
  for (const page of lean) assert.ok(!html[page].includes('studio.js'), page + ' must not load the legacy bundle');
});

test('the course band on every page names the course, the faculty and the term in Serbian — and no person', () => {
  for (const page of pages) {
    const band = html[page].match(/<div class="course-band">([\s\S]*?)<\/div>/);
    assert.ok(band, page + ' has no course band');
    for (const value of [identity.title.sr, identity.institution.sr, identity.faculty.sr, identity.term.sr]) {
      assert.ok(band[1].includes(value), `${page} band is missing: ${value}`);
    }
    assert.ok(!/Dejan|Kozić|Koći|Semir|Poturak/.test(band[1]), page + ' band names a person');
  }
});

test('every page has exactly one h1 and a footer in Serbian', () => {
  for (const page of pages) {
    assert.equal((html[page].match(/<h1[ >]/g) || []).length, 1, page);
    assert.ok(html[page].includes('Zajednički studio otvoren za doradu.'), page + ' footer note is not the Serbian one');
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

test('the flow strip sits in the header of every page and tells the truth about the three parts', async () => {
  const tok = JSON.parse(await readFile(new URL('../data/tok.json', import.meta.url), 'utf8'));
  const nextCas = tok.sledeci.filter(item => item.vrsta === 'cas' && typeof item.nedelja === 'number')[0];
  const stamped = {
    odrzano: String(tok.odrzano.length),
    sledeciNedelja: nextCas ? String(nextCas.nedelja) : '',
    oblakIdeja: String(tok.ideje.length)
  };
  for (const page of pages) {
    assert.ok(html[page].includes('class="flow-strip"'), page + ' has no flow strip in its header');
    for (const anchor of ['index.html#odrzano', 'sledeci.html', 'oblak.html']) {
      assert.ok(html[page].includes(`href="${anchor}"`), page + ' strip misses ' + anchor);
    }
    const counts = [...html[page].matchAll(/data-flow="([a-z-]+)" data-count="([^"]*)"/g)].map(match => match[2]);
    assert.deepEqual(counts, [stamped.odrzano, stamped.sledeciNedelja, stamped.oblakIdeja], page + ' strip counts disagree with data/tok.json');
  }
});

test('the evidence against disability simulation is on the page itself, not only in the code', () => {
  assert.ok(html['laboratorija.html'].includes('Nario-Redmond'));
  assert.ok(html['laboratorija.html'].includes('blindfold'));
});

test('the CSS, the modules and the site\'s own images are the only assets the shells reference', () => {
  for (const page of pages) {
    const references = [...html[page].matchAll(/(?:src|href)="(assets\/[^"]+)"/g)].map(m => m[1]);
    for (const reference of references) {
      // vendor/three.module.min.js and vendor/three.core.min.js are the only third-party
      // files, vendored on purpose (assets/vendor/README.md carries their hashes).
      // vizuali/ (our own standard diagrams) and fieldwork/ (our own field sketch) are
      // first-party images; every one of them was drawn or photographed for this course.
      assert.ok(/^assets\/(style\.css|[a-z0-9-]+\.(svg|js)|vizuali\/[a-z0-9-]+\.svg|fieldwork\/[a-z0-9-]+\.jpg|visit\/poseta-[a-z0-9-]+\.mp4|vendor\/three\.(module|core)\.min\.js)$/.test(reference), `${page}: unexpected asset ${reference}`);
    }
    // Nothing may call a third party at read time: no CDN, no analytics, no webfonts.
    assert.ok(!/https?:\/\/[^"]*\.(js|css|woff2?)/.test(html[page]), `${page}: loads a script, style or font from the network`);
  }
});
