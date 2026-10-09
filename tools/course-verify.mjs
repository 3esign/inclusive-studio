#!/usr/bin/env node
// One reproducible local gate; publishing/teacher approval are separate actions.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import { capture, check, compare, verify, restore } from './course-checkpoint.mjs';

function unchangedCopy(root, manifest) {
  const seen = new Map();
  function walk(dir, prefix = '') {
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
      const rel = prefix + item.name, p = path.join(dir, item.name);
      if (item.isSymbolicLink()) throw new Error('Link appeared in verification copy.');
      if (item.isDirectory()) walk(p, rel + '/');
      else if (rel !== 'CHECKPOINT-RESTORE.json') seen.set(rel, crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'));
    }
  }
  walk(root);
  return seen.size === manifest.files.length && manifest.files.every(f => seen.get(f.path) === f.sha256);
}

try {
  const { values } = parseArgs({ options: { base: { type: 'string' }, store: { type: 'string' }, official: { type: 'string' }, 'official-sha': { type: 'string' } } });
  if (!/^[a-f0-9]{40}$/.test(values.base || '') || !values.store) throw new Error('Usage: node tools/course-verify.mjs --base <exact Git commit> --store <private absolute directory outside site>');
  if (!path.isAbsolute(values.store)) throw new Error('Checkpoint store must be an absolute path.');
  if (Boolean(values.official) !== Boolean(values['official-sha'])) throw new Error('official and official-sha must be supplied together.');
  const root = fs.realpathSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'));
  const opts = { root, store: values.store, base: values.base, official: values.official, expectedSha256: values['official-sha'] };
  const snapshot = capture(opts);
  const integrity = verify({ ...opts, id: snapshot.id });
  const copy = path.join(path.dirname(snapshot.store), path.basename(snapshot.store) + '-verify-' + snapshot.id.slice(0, 16));
  const restored = restore({ ...opts, id: snapshot.id, to: copy });
  const manifest = JSON.parse(fs.readFileSync(path.join(snapshot.store, 'manifests', snapshot.id + '.json'), 'utf8'));
  if (!unchangedCopy(copy, manifest)) throw new Error('Verification copy differs from the snapshot.');
  const baseline = check({ ...opts, againstRoot: copy });
  const files = manifest.files.map(f => f.path).filter(f => /^tests\/[^/]+\.test\.mjs$/.test(f)).sort().map(f => path.join(copy, f));
  if (!files.length) throw new Error('No course tests found.');
  const tests = baseline.ok ? spawnSync(process.execPath, ['--test', ...files], { cwd: copy, encoding: 'utf8', windowsHide: true, timeout: 180000, maxBuffer: 8 * 1024 * 1024 }) : { status: null, stdout: '', stderr: 'Tests not run: baseline guard failed.' };
  const after = compare({ ...opts, id: snapshot.id });
  const stable = !after.changed.length && !after.added.length && !after.deleted.length;
  const copyStable = unchangedCopy(copy, manifest);
  const receipt = { at: new Date().toISOString(), ok: baseline.ok && tests.status === 0 && after.ok && stable && copyStable && integrity.ok,
    snapshot, baseline, tests: { exit: tests.status, error: tests.error?.message || null, output: (tests.stdout || '') + (tests.stderr || '') },
    restored, copyStable, after, stable, integrity, limitation: 'Tests ran in a separate restored snapshot. This is local verification, not teacher approval, visual QA, publication, an OS-immutable filesystem, or an enforced remote branch rule.' };
  const receiptPath = path.join(snapshot.store, 'verification-' + snapshot.id + '.json');
  fs.writeFileSync(receiptPath, JSON.stringify(receipt, null, 2) + '\n', { flag: 'wx' });
  console.log(JSON.stringify({ ok: receipt.ok, snapshot, baseline, testExit: tests.status, testSummary: receipt.tests.output.split('\n').slice(-12), copyStable, verifiedCopy: copy, stable, after, receipt: receiptPath }, null, 2));
  if (!receipt.ok) process.exitCode = 1;
} catch (error) { console.error(JSON.stringify({ ok: false, error: error.message })); process.exitCode = 1; }
