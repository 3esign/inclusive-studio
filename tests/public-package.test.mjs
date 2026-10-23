import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

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

test('pun registar se ne servira — samo javni izvod', () => {
  assert.ok(excluded.has('data/prototipovi.json'), 'data/prototipovi.json mora biti u exclude');
  assert.ok(!excluded.has('data/prototipovi-javno.json'), 'javni izvod mora ostati serviran');
  assert.ok(!excluded.has('data/cas-03/spisak.json'), 'nastavnicki spisak mora ostati serviran');
});

test('fotografije radova sa nepotvrdenom atribucijom se ne serviraju', () => {
  // 23.10.2026: posle razdvajanja fotografija nijedan rad nije pending. Pravilo ostaje
  // provereno i prazno: cim se neki rad vrati u pending, njegov folder mora u exclude.
  const pending = registry.items.filter((i) => i.attributionStatus === 'pending');
  for (const item of pending) {
    for (const photo of item.photos || []) {
      const dir = photo.src.split('/').slice(0, -1).join('/');
      assert.ok(excluded.has(dir), `${dir} (pending ${item.id}) mora biti u exclude`);
    }
  }
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
