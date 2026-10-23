import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { validatePrototypes } from '../assets/prototipovi-core.js';

// GitHub Pages servira ceo repo osim Jekyll "exclude" liste (_config.yml).
// Javni paket sme da sadrzi samo: javni izvod registra (prototipovi-javno.json),
// nastavnicki spisak (odobrena povrsina nesigurnosti) i fotografije objavljenih radova.
// Puni registar, interni prijem i fotografije radova sa nepotvrdenom atribucijom
// moraju ostati van serviranja — ciscenje prikaza nije dovoljno.

const root = new URL('..', import.meta.url);
const config = await readFile(new URL('_config.yml', root), 'utf8');
const excluded = new Set(
  [...config.matchAll(/^\s*-\s*(\S+)\s*$/gm)].map((m) => m[1])
);

const registry = JSON.parse(await readFile(new URL('data/prototipovi.json', root), 'utf8'));

test('the public excerpt retains trial sources and passes the browser validator', async () => {
  const publicData = JSON.parse(await readFile(new URL('data/prototipovi-javno.json', root), 'utf8'));
  assert.deepEqual(validatePrototypes(publicData), []);
  for (const g of publicData.galleries || []) if (g.probanje) assert.ok(publicData.sources.some(s => s.id === g.probanje.sourceId));
});

test('pun registar se ne servira — samo javni izvod', () => {
  assert.ok(excluded.has('data/prototipovi.json'), 'data/prototipovi.json mora biti u exclude');
  assert.ok(!excluded.has('data/prototipovi-javno.json'), 'javni izvod mora ostati serviran');
  assert.ok(excluded.has('data/cas-03/spisak.json'), '21.10: processing roster stays outside the student surface');
});

test('fotografije radova sa nepotvrdenom atribucijom se ne serviraju', () => {
  // 21.10.2026: posle ponovnog preseka nijedan rad ne stoji kao „pending“ — svaki objavljeni
  // rad nosi identitet koji je nastavnik dostavio. Kapija ipak mora da vazi ako se pending
  // rad pojavi, pa se proverava i na stvarnim i na unetom primeru.
  const pending = registry.items.filter((i) => i.attributionStatus === 'pending');
  for (const item of pending) {
    for (const photo of item.photos || []) {
      const dir = photo.src.split('/').slice(0, -1).join('/');
      assert.ok(excluded.has(dir), `${dir} (pending ${item.id}) mora biti u exclude`);
    }
  }
});

test('nijedan folder slika van javnog izvoda ne ostaje serviran', async () => {
  // Stariji presek i povuceni kadrovi ostaju u repou kao dokaz, ali Pages ih ne servira.
  // Ovo vazi za svaki sledeci talas: folder koji javni izvod ne koristi mora biti iskljucen.
  const javni = JSON.parse(await readFile(new URL('data/prototipovi-javno.json', root), 'utf8'));
  const served = new Set();
  // Teacher, 21 October: the third-class visit has its own authorized scene register.
  const visit = JSON.parse(await readFile(new URL('data/poseta-w03.json', root), 'utf8'));
  for (const p of visit.photos) served.add(p.src.split('/')[2]);
  for (const group of [javni.items, javni.observations, javni.galleries || []]) {
    for (const it of group) for (const p of it.photos || []) served.add(p.src.split('/')[2]);
  }
  for (const r of javni.revizije || []) for (const side of ['before', 'after']) {
    for (const p of r[side].photos || []) served.add(p.src.split('/')[2]);
  }
  const { readdir } = await import('node:fs/promises');
  for (const name of await readdir(new URL('data/prototipovi', root))) {
    if (served.has(name)) continue;
    assert.ok(excluded.has('data/prototipovi/' + name), 'data/prototipovi/' + name + ' nije u javnom izvodu i mora biti u exclude');
  }
  assert.ok(served.size > 0);
});

test('izvornici prijema casa 03 se ne serviraju (samo spisak)', () => {
  for (const internal of [
    'data/cas-03/predlog-registra.json',
    'data/cas-03/prihvat.json',
    'data/cas-03/uloge-slika.json',
    'data/cas-03/verifikacija-prijema.md',
    'data/cas-03/slike',
  ]) {
    assert.ok(excluded.has(internal), `${internal} mora biti u exclude`);
  }
});

test('poseta udruzenju ostaje van serviranja na obe lokacije', () => {
  assert.ok(excluded.has('data/prototipovi/poseta-udruzenje'));
  // data/cas-03/slike je vec pokriven gore; poseta unutar njega ne moze da se servira.
});

// 23.10.2026: a served page is only as published as the module it loads. The fourth class
// is a list page on the student surface, so its view module — and everything that module
// imports — must stay outside the exclude list, or the page dies the moment JavaScript runs.
test('svaki modul koji servirana strana ucitava i sam ostaje serviran', async () => {
  const { readdir } = await import('node:fs/promises');
  const pages = (await readdir(root)).filter(name => name.endsWith('.html') && !excluded.has(name));
  const seen = new Set();
  async function reachable(file) {
    if (seen.has(file) || !file.startsWith('assets/')) return;
    seen.add(file);
    assert.ok(!excluded.has(file), file + ' se ucitava sa servirane strane i mora ostati serviran');
    const text = await readFile(new URL(file, root), 'utf8');
    for (const [, spec] of text.matchAll(/^import[^'"]*['"]\.\/([\w.-]+\.js)['"]/gm)) await reachable('assets/' + spec);
  }
  for (const page of pages) {
    const text = await readFile(new URL(page, root), 'utf8');
    for (const [, src] of text.matchAll(/<script[^>]*src="(assets\/[\w.-]+\.js)"/g)) await reachable(src);
  }
  assert.ok(seen.has('assets/core.js') && seen.has('assets/cas03-core.js'), 'the scan must actually reach the shared modules');
});
