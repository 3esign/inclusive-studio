// Regresioni test: importer se stvarno pokrece, nad pravim izvorom, u izolovanom izlazu.
//
// Zahtev prethodnog izvestaja: "importer se nikad ne pokrece u testu (nema red-zelenog dokaza)".
// Ovaj test pokrece `node tools/cas-prihvat.mjs 03 <izlaz>` nad stvarnim
// data/cas-03/spisak.json i data/cas-03/slike, a izlaz pise u privremenu fasciklu.
// Zivi registar (data/prototipovi.json) se uopste ne dira.
//
// Kanonska polazna tacka (izvor: data/cas-03/spisak.json):
//   - 23.10.2026: red vise ne nosi zastavicu nesigurnosti. Ili pokazuje svoj rad
//     (`galerija`), ili kaze da ceka fotografije (`ceka`) — i tada nema stavke u
//     predlogu. To NIJE tvrdnja da rad nije pristigao, nego da fotografija nije tu.
//   - Izvor nosi `source.recordedOn` — datum zapisa, ne dan odrzavanja casa.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, '..');
const importer = join(repo, 'tools', 'cas-prihvat.mjs');
const sourceSpisak = join(repo, 'data', 'cas-03', 'spisak.json');
const liveRegister = join(repo, 'data', 'prototipovi.json');

function runImporter() {
  const out = join(mkdtempSync(join(tmpdir(), 'cas03-imp-')), 'out');
  const res = spawnSync(process.execPath, [importer, '03', out], { cwd: repo, encoding: 'utf8' });
  return { res, out, work: dirname(out) };
}

function readJson(p) { return JSON.parse(readFileSync(p, 'utf8')); }

test('importer runs for real and proposes a work only where a photograph actually arrived', t => {
  // Sirovi prijem je lokalni izvor, namerno van prenosivog snapshot-a:
  // u restauriranoj verifikacionoj kopiji ova provera nema sta da cita.
  // t.skip() ne prekida telo testa — bez return-a asercije nastavljaju i pad se krije kao preskok.
  if (!existsSync(join(repo, 'data', 'cas-03', 'slike'))) return t.skip('sirovi prijem (data/cas-03/slike) nije deo ove kopije');
  const spisak = readJson(sourceSpisak);
  const { res, out, work } = runImporter();
  try {
    assert.equal(res.status, 0, `importer must exit 0\n${res.stderr}`);

    const predlog = readJson(join(out, 'predlog-registra.json'));
    assert.ok(Array.isArray(predlog.items), 'predlog must carry items');
    assert.ok(predlog.items.length > 0, 'predlog must not be empty');

    // A row that says it waits has no frames, so it may not appear in the proposal; a row
    // that shows its work must carry exactly the identity its row recorded, never more.
    for (const entry of spisak.radovi) {
      const id = String(entry.rb).padStart(2, '0');
      const item = predlog.items.find(i => i.id.startsWith(id + '-'));
      if (entry.ceka) { assert.ok(!item, `rb ${entry.rb} waits for its photographs and may not be proposed`); continue; }
      if (!item) continue;
      assert.equal(item.author.name, entry.ime, `rb ${entry.rb}: the proposed name must come from the row`);
      assert.equal(item.author.studentNumber ?? null, entry.indeks, `rb ${entry.rb}: the proposed number must come from the row`);
      assert.ok(!('attributionStatus' in item), `rb ${entry.rb}: the proposal states no confirmation status it cannot establish`);
    }
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
});

test('importer cites the recorded source date, not the class day', t => {
  if (!existsSync(join(repo, 'data', 'cas-03', 'slike'))) return t.skip('sirovi prijem (data/cas-03/slike) nije deo ove kopije');
  const spisak = readJson(sourceSpisak);
  const { res, out, work } = runImporter();
  try {
    assert.equal(res.status, 0, `importer must exit 0\n${res.stderr}`);
    const predlog = readJson(join(out, 'predlog-registra.json'));
    const recorded = spisak.source && spisak.source.recordedOn;
    assert.ok(recorded, 'source must carry a recorded date');
    const blob = JSON.stringify(predlog);
    assert.ok(blob.includes(recorded),
      `predlog must cite the recorded source date ${recorded}`);
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
});

test('importer never invents a signature for the last photograph of a row', t => {
  if (!existsSync(join(repo, 'data', 'cas-03', 'slike'))) return t.skip('sirovi prijem (data/cas-03/slike) nije deo ove kopije');
  const spisak = readJson(sourceSpisak);
  const { res, out, work } = runImporter();
  try {
    assert.equal(res.status, 0, `importer must exit 0\n${res.stderr}`);
    const predlog = readJson(join(out, 'predlog-registra.json'));
    const invented = /prob(?:a|e) prototip/i;
    for (const item of predlog.items) {
      for (const photo of item.photos || []) {
        const text = JSON.stringify(photo);
        assert.ok(!invented.test(text),
          `${item.id} photo ${photo.id} carries an unsourced signature: ${photo.alt || photo.caption || ''}`);
      }
    }
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
});

test('the live register never claims a confirmed status the list does not establish', () => {
  const spisak = readJson(sourceSpisak);
  const live = readJson(liveRegister);
  // 23.10.2026: a waiting row stands in `cekaju`, never among the published works, and
  // the register claims no attribution status for it.
  for (const entry of spisak.radovi.filter(r => r.ceka)) {
    assert.ok(!(live.galleries || []).some(g => g.listOrder === entry.rb), `row ${entry.rb} waits and may not be published as a work`);
    const waiting = (live.cekaju || []).find(w => w.listOrder === entry.rb);
    assert.ok(waiting, `row ${entry.rb} waits and must stand in cekaju`);
    assert.ok(!('attributionStatus' in waiting), `row ${entry.rb}: a waiting work claims no confirmation status`);
  }
  for (const item of live.items || []) {
    assert.ok(!('attributionStatus' in item) || ['confirmed', 'pending'].includes(item.attributionStatus));
  }
});
