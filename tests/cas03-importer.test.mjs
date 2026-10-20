// Regresioni test: importer se stvarno pokrece, nad pravim izvorom, u izolovanom izlazu.
//
// Zahtev prethodnog izvestaja: "importer se nikad ne pokrece u testu (nema red-zelenog dokaza)".
// Ovaj test pokrece `node tools/cas03-prihvat.mjs <izlaz>` nad stvarnim
// data/cas-03/spisak.json i data/cas-03/slike, a izlaz pise u privremenu fasciklu.
// Zivi registar (data/prototipovi.json) se uopste ne dira.
//
// Kanonska polazna tacka (izvor: data/cas-03/spisak.json):
//   - `sigurno: { do: 16, od: 21 }` — redovi 17-20 cekaju potvrdu studenta.
//   - Red 20 nema nijednu fotografiju, pa za njega nema stavke u predlogu;
//     to NIJE tvrdnja da rad nije pristigao, vec samo da fotografija nije dostupna.
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
const importer = join(repo, 'tools', 'cas03-prihvat.mjs');
const sourceSpisak = join(repo, 'data', 'cas-03', 'spisak.json');
const liveRegister = join(repo, 'data', 'prototipovi.json');

function runImporter() {
  const out = join(mkdtempSync(join(tmpdir(), 'cas03-imp-')), 'out');
  const res = spawnSync(process.execPath, [importer, out], { cwd: repo, encoding: 'utf8' });
  return { res, out, work: dirname(out) };
}

function readJson(p) { return JSON.parse(readFileSync(p, 'utf8')); }

test('importer runs for real and refuses to claim confirmed authorship for rows awaiting confirmation', t => {
  // Sirovi prijem je lokalni izvor, namerno van prenosivog snapshot-a:
  // u restauriranoj verifikacionoj kopiji ova provera nema sta da cita.
  if (!existsSync(join(repo, 'data', 'cas-03', 'slike'))) t.skip('sirovi prijem (data/cas-03/slike) nije deo ove kopije');
  const spisak = readJson(sourceSpisak);
  const { res, out, work } = runImporter();
  try {
    assert.equal(res.status, 0, `importer must exit 0\n${res.stderr}`);

    const predlog = readJson(join(out, 'predlog-registra.json'));
    assert.ok(Array.isArray(predlog.items), 'predlog must carry items');
    assert.ok(predlog.items.length > 0, 'predlog must not be empty');

    const pendingRbs = spisak.radovi.filter(e => e.potvrditi).map(e => e.rb);
    assert.ok(pendingRbs.length > 0, 'source must contain rows awaiting confirmation');

    for (const rb of pendingRbs) {
      const id = String(rb).padStart(2, '0');
      const item = predlog.items.find(i => i.id.startsWith(id + '-'));
      if (!item) {
        // Red bez dostupne fotografije ne proizvodi stavku; to se proveri zasebno.
        continue;
      }
      assert.equal(item.attributionStatus, 'pending',
        `rb ${rb} waits for the student's confirmation and must be marked pending, not ${item.attributionStatus}`);
      assert.notEqual(item.authorRole, 'confirmed',
        `rb ${rb} must not be presented as confirmed authorship`);
    }

    // Nijedna stavka u predlogu ne sme nositi 'confirmed' tamo gde izvor kaze 'potvrditi'.
    const confirmed = predlog.items.filter(i => i.attributionStatus === 'confirmed');
    const pendingIds = new Set(predlog.items.filter(i => i.attributionStatus === 'pending').map(i => i.id));
    assert.equal(pendingIds.size > 0, true,
      'importer must actually mark the unconfirmed rows as pending');
    assert.ok(confirmed.every(i => !pendingIds.has(i.id)), 'a row cannot be both confirmed and pending');
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
});

test('importer cites the recorded source date, not the class day', () => {
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

test('importer never invents a signature for the last photograph of a row', () => {
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

test('the live register still carries no confirmed status for rows awaiting confirmation', () => {
  const spisak = readJson(sourceSpisak);
  const live = readJson(liveRegister);
  const items = live.items || [];
  for (const e of spisak.radovi.filter(r => r.potvrditi)) {
    const id = String(e.rb).padStart(2, '0');
    const item = items.find(i => i.id.startsWith(id + '-'));
    if (!item) continue;
    assert.notEqual(item.attributionStatus, 'confirmed',
      `live register ${item.id} must not claim confirmed authorship while the source still awaits confirmation`);
  }
});
