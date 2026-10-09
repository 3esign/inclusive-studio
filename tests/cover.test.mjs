// The cover: additive by law — it may not displace the flow landing; its numbers are the
// flow's numbers; its only third-party code is vendored, hashed and offline.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { NAV } from '../assets/core.js';

const root = new URL('../', import.meta.url);
const read = async path => readFile(new URL(path, root), 'utf8');

test('the cover is the first door, and the flow landing keeps its job', async () => {
  assert.equal(NAV[0].id, 'cover');
  assert.equal(NAV[0].href, 'naslovna.html');
  const flow = NAV.find(item => item.id === 'flow');
  assert.equal(flow.href, 'index.html');
  const landing = await read('index.html');
  assert.ok(landing.includes('id="odrzano"'), 'the landing lost its held anchor');
  const home = await read('assets/home.js');
  assert.ok(/w=/.test(home), 'deep links index.html?w=N no longer handled by home.js');
});

test('the cover tells the truth without scripting: its counts are the flow counts', async () => {
  const tok = JSON.parse(await read('data/tok.json'));
  const nextCas = tok.sledeci.filter(item => item.vrsta === 'cas' && typeof item.nedelja === 'number')[0];
  const cover = await read('naslovna.html');
  const stage = cover.match(/<div class="cover-stage" data-odrzano="(\d*)" data-sledeci-nedelja="(\d*)"/);
  assert.ok(stage, 'the cover stage carries no stamped counts');
  assert.equal(stage[1], String(tok.odrzano.length), 'held count on the cover disagrees with data/tok.json');
  assert.equal(stage[2], String(nextCas ? nextCas.nedelja : ''), 'next-class week on the cover disagrees with data/tok.json');
  const odrzano = cover.match(/<b data-count="odrzano">([^<]*)<\/b>/);
  const nedelja = cover.match(/<b data-count="sledeci-nedelja">([^<]*)<\/b>/);
  assert.equal(odrzano[1], String(tok.odrzano.length));
  assert.equal(nedelja[1], String(nextCas ? nextCas.nedelja : '—'));
});

test('the only third-party code is vendored, hashed and stated', async () => {
  const manifest = await read('assets/vendor/README.md');
  const files = [['three.module.min.js', 'e2b5ee6bccd38fd6d8a2428546b83c5f2426d84b152ef82be8055556e3b40eb6'],
                 ['three.core.min.js', '61ba0df005b05991361d040d8ff670e1aadfd0ce7aeebd1fdb0725957a8957de']];
  for (const [name, hash] of files) {
    const bytes = await readFile(new URL('assets/vendor/' + name, root));
    assert.equal(createHash('sha256').update(bytes).digest('hex'), hash, `${name}: the file no longer matches the recorded hash — update assets/vendor/README.md consciously`);
    assert.ok(manifest.includes(hash), `${name}: hash not recorded in assets/vendor/README.md`);
  }
  assert.ok(manifest.includes('0.180.0') && manifest.includes('MIT'), 'the vendor manifest states neither version nor license');
  for (const [name] of files) {
    const text = await readFile(new URL('assets/vendor/' + name, root), 'utf8');
    assert.ok(text.includes('MIT'), `${name}: license header missing`);
  }
});

test('the scene is an enhancement, never a requirement', async () => {
  const module = await read('assets/naslovna.js');
  assert.ok(module.includes('prefers-reduced-motion'), 'the scene ignores prefers-reduced-motion');
  assert.ok(/try\s*\{[\s\S]*?import\('\.\/vendor\/three\.module\.min\.js'\)[\s\S]*?\}\s*catch/.test(module) || /catch\s*\{\s*return;\s*\}[\s\S]*import/.test(module) || module.includes("import('./vendor/three.module.min.js')"), 'three.js is not loaded behind a guarded dynamic import');
  const cover = await read('naslovna.html');
  assert.ok(cover.includes('class="cover-fallback"'), 'the cover has no drawn fallback for readers without WebGL');
  assert.ok(cover.includes('cover-doors'), 'the cover has no doors onward');
});

test('the cover prints as the workbook\'s A3 title sheet', async () => {
  const cover = await read('naslovna.html');
  for (const needle of ['print-cover', 'A3 horizontalna radna sveska', 'Ime i prezime / Name', 'Broj listova / Sheets']) {
    assert.ok(cover.includes(needle), `the printable cover is missing: ${needle}`);
  }
  const css = await read('assets/style.css');
  assert.ok(css.includes('size:A3 landscape'), 'the stylesheet does not print on the course\'s paper format');
});

test('serbian quotes on the cover close with ” (U+201D), the site\'s convention', async () => {
  const marks = '„"“”';
  for (const file of ['naslovna.html', 'assets/naslovna.js']) {
    const text = await read(file);
    for (const line of text.split('\n')) {
      for (let i = line.indexOf('„'); i !== -1; i = line.indexOf('„', i + 1)) {
        let j = i + 1;
        while (j < line.length && !marks.includes(line[j])) j++;
        assert.ok(j < line.length, `${file}: a „ is never closed on its line: ${line.slice(i, i + 40)}`);
        assert.equal(line[j], '”', `${file}: wrong closer after ${line.slice(i, j + 1)}`);
      }
    }
  }
});
