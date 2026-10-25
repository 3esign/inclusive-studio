/* Dnevnik je svaki red vezivao na `${page}#cas03-rows-title`. Taj naslov postoji
   samo na cas-04.html; na cas-03.html ista sekcija nosi #galerije-w03, pa je
   dvadeset devet veza „zapis N" otvaralo stranu na vrhu, bez skoka na red.
   Kotva je zato presla u podatak (data/dnevnik.json), uz ovu proveru:
   svaka kotva koju dnevnik upise mora postojati na strani na koju vodi —
   bilo u samoj strani, bilo u skripti koja tu stranu gradi. */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.join(import.meta.dirname, '..');
const journal = JSON.parse(fs.readFileSync(path.join(root, 'data/dnevnik.json'), 'utf8'));
const read = f => { try { return fs.readFileSync(path.join(root, f), 'utf8'); } catch { return ''; } };

/* Strana plus skripte koje ona ucitava: kotva moze biti ispisana iz koda. */
function corpus(page) {
  const html = read(page);
  let text = html;
  for (const m of html.matchAll(/src=["']([^"']+\.m?js)(?:\?[^"']*)?["']/g)) {
    text += read(m[1]);
    for (const i of read(m[1]).matchAll(/from\s+['"]\.\/([^'"]+\.m?js)['"]/g)) text += read('assets/' + i[1]);
  }
  return text;
}
const hasAnchor = (page, id) =>
  new RegExp('id=["\']' + id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '["\']').test(corpus(page));

test('svaki spisak u dnevniku imenuje kotvu koja na toj strani zaista postoji', () => {
  const bad = [];
  for (const list of journal.lists) {
    assert.ok(list.page, 'spisak bez strane: ' + list.file);
    assert.ok(fs.existsSync(path.join(root, list.page)), 'strana ne postoji: ' + list.page);
    if (!list.kotva) { bad.push(list.page + ' (bez kotve)'); continue; }
    if (!hasAnchor(list.page, list.kotva)) bad.push(list.page + '#' + list.kotva);
  }
  assert.deepEqual(bad, [], 'kotva koje na strani nema: ' + bad.join(', '));
});

test('dnevnik ne zakucava kotvu u kod — cita je iz podatka', () => {
  const core = read('assets/dnevnik-core.js');
  assert.ok(!/\$\{esc\(row\.page\)\}#cas03-rows-title/.test(core),
    'kotva reda je ponovo zakucana u dnevnik-core.js');
  assert.match(core, /row\.kotva/, 'dnevnik-core.js ne cita kotvu iz podatka');
});

test('kotve poseta (#poseta-<id>) postoje na strani posete', () => {
  const bad = [];
  let checked = 0;
  for (const v of journal.visits) {
    const data = JSON.parse(read(v.file) || '{}');
    const ids = new Set();
    for (const photo of data.photos || []) for (const id of photo.radovi || []) ids.add(id);
    for (const id of ids) {
      checked++;
      if (!hasAnchor(v.page, 'poseta-' + id)) bad.push(v.page + '#poseta-' + id);
    }
  }
  assert.ok(checked > 0, 'nijedna kotva posete nije proverena — provera bi bila prazna');
  assert.deepEqual(bad, [], 'kotva posete bez cilja: ' + bad.slice(0, 8).join(', '));
});
