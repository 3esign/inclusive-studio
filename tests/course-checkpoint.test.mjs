import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { capture, verify, compare, restore, check, safeRelative, validateAbsoluteComponents, compareWeekRevisions, guardOfficial, LIMITS } from '../tools/course-checkpoint.mjs';

const digest = b => crypto.createHash('sha256').update(b).digest('hex');
const encode = o => JSON.stringify(o, null, 2) + '\n';
const baseWeek = () => ({ n: 1, state: 'published', title: { sr: 'Original' }, updated: '2026-10-02', revizije: [{ v: 1, datum: '2026-10-02', sta: { sr: 'First recorded version' } }], blocks: [{ kind: 'exercise', ref: 'first' }] });
const git = (root, ...args) => execFileSync('git', ['-C', root, ...args], { encoding: 'utf8', windowsHide: true, env: { ...process.env, GIT_OPTIONAL_LOCKS: '0' } }).trim();
function fixture(t) {
  const parent = fs.mkdtempSync(path.join(os.tmpdir(), 'course-checkpoint-'));
  const root = path.join(parent, 'site'), store = path.join(parent, 'history');
  fs.mkdirSync(root);
  const write = (rel, text) => { const p = path.join(root, rel); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, typeof text === 'string' ? text : encode(text)); };
  write('index.html', 'existing index'); write('naslovna.html', 'preserved cover');
  write('data/material/w01.json', baseWeek()); write('assets/exercises.js', 'export const exercises = [];');
  git(root, 'init', '-q'); git(root, 'config', 'core.autocrlf', 'false'); git(root, 'add', 'index.html', 'naslovna.html', 'data', 'assets');
  git(root, '-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', '-c', 'core.hooksPath=', 'commit', '-qm', 'fixture');
  const head = git(root, 'rev-parse', 'HEAD');
  t.after(() => {
    assert.ok(path.dirname(parent) === path.resolve(os.tmpdir()) && path.basename(parent).startsWith('course-checkpoint-'));
    fs.rmSync(parent, { recursive: true, force: true });
  });
  return { root, store, parent, head, write };
}

test('CLI invoked through a project junction runs capture and verify while imports remain inert', t => {
  const f = fixture(t), alias = path.join(f.parent, 'linked-site');
  f.write('tools/course-checkpoint.mjs', fs.readFileSync(new URL('../tools/course-checkpoint.mjs', import.meta.url), 'utf8'));
  fs.symlinkSync(f.root, alias, process.platform === 'win32' ? 'junction' : 'dir');
  try {
    const tool = path.join(alias, 'tools/course-checkpoint.mjs');
    const run = args => spawnSync(process.execPath, [tool, ...args], { cwd: alias, encoding: 'utf8', windowsHide: true, timeout: 15000 });
    const captured = run(['capture', '--root', '.', '--store', f.store]);
    assert.equal(captured.error, undefined); assert.equal(captured.status, 0, captured.stderr);
    assert.ok(captured.stdout.trim(), 'a CLI junction entry must perform work, not silently exit zero');
    const snapshot = JSON.parse(captured.stdout);
    assert.equal(snapshot.ok, true); assert.equal(snapshot.head, f.head);
    assert.equal(fs.existsSync(path.join(f.store, 'manifests', snapshot.id + '.json')), true);
    const checked = run(['verify', '--root', '.', '--store', f.store, '--id', snapshot.id]);
    assert.equal(checked.error, undefined); assert.equal(checked.status, 0, checked.stderr);
    assert.equal(JSON.parse(checked.stdout).ok, true);
    const importer = path.join(f.parent, 'import-only.mjs');
    fs.writeFileSync(importer, "import './linked-site/tools/course-checkpoint.mjs'; console.log('import-only');\n");
    const imported = spawnSync(process.execPath, [importer], { encoding: 'utf8', windowsHide: true, timeout: 5000 });
    assert.equal(imported.error, undefined); assert.equal(imported.status, 0, imported.stderr);
    assert.equal(imported.stdout.trim(), 'import-only');
    assert.equal(fs.readFileSync(path.join(f.root, 'index.html'), 'utf8'), 'existing index');
  } finally { fs.unlinkSync(alias); }
});

test('capture binds tracked, dirty and relevant untracked bytes without changing source or index', t => {
  const f = fixture(t); f.write('index.html', 'dirty index'); f.write('sledeci.html', 'new draft page');
  f.write('data/.env', 'never copy'); f.write('data/secrets.json', 'never copy');
  f.write('!Projekti/nested/index.html', 'nested project'); f.write('checkpoints/old.json', 'excluded store');
  const oldIndex = fs.readFileSync(path.join(f.root, '.git/index'));
  const a = capture(f), b = capture(f);
  assert.equal(a.kind, 'existing-state'); assert.equal(a.head, f.head); assert.equal(a.files, 5);
  assert.deepEqual(fs.readFileSync(path.join(f.root, '.git/index')), oldIndex);
  const m = JSON.parse(fs.readFileSync(path.join(f.store, 'manifests', a.id + '.json')));
  assert.match(m.git.trackedStatus, /index.html/); assert.equal(m.files.find(x => x.path === 'sledeci.html').tracked, false);
  assert.equal(m.files.some(x => /secret|env|!Projekti|checkpoints/.test(x.path)), false);
  assert.equal(fs.readdirSync(path.join(f.store, 'blobs')).length, 5, 'identical snapshots deduplicate blobs');
  assert.equal(verify({ ...f, id: a.id }).ok, true); assert.equal(verify({ ...f, id: b.id }).ok, true);
  assert.equal(fs.readFileSync(path.join(f.root, 'index.html'), 'utf8'), 'dirty index');
});

test('restore creates a separate exact copy and refuses existing or overlapping destinations', t => {
  const f = fixture(t), snap = capture(f), to = path.join(f.parent, 'restored');
  f.write('index.html', 'new live content');
  const r = restore({ ...f, id: snap.id, to }); assert.equal(r.originalsChanged, false);
  assert.equal(fs.readFileSync(path.join(to, 'index.html'), 'utf8'), 'existing index');
  assert.equal(fs.readFileSync(path.join(f.root, 'index.html'), 'utf8'), 'new live content');
  assert.equal(fs.readFileSync(path.join(to, 'naslovna.html'), 'utf8'), 'preserved cover');
  assert.throws(() => restore({ ...f, id: snap.id, to }), /nonexistent/);
  for (const dest of [f.root, path.join(f.root, 'copy'), f.store, f.parent]) assert.throws(() => restore({ ...f, id: snap.id, to: dest }), /overlap/);
  assert.throws(() => capture({ root: f.root, store: path.join(f.root, 'history') }), /overlap/);
  assert.throws(() => capture({ root: f.root, store: f.parent }), /overlap/);
});

test('corrupt blob or manifest fails before restoration creates any directory', t => {
  const f = fixture(t), snap = capture(f), mp = path.join(f.store, 'manifests', snap.id + '.json');
  const m = JSON.parse(fs.readFileSync(mp)), first = path.join(f.store, 'blobs', m.files[0].sha256);
  fs.writeFileSync(first, 'corrupt');
  assert.throws(() => verify({ ...f, id: snap.id }), /corrupt blob/);
  const to = path.join(f.parent, 'restore');
  assert.throws(() => restore({ ...f, id: snap.id, to }), /corrupt blob/); assert.equal(fs.existsSync(to), false);
  fs.appendFileSync(mp, ' '); assert.throws(() => verify({ ...f, id: snap.id }), /corrupt manifest/);
});

test('even a correctly hashed forged manifest cannot escape its destination', t => {
  const f = fixture(t), snap = capture(f);
  const m = JSON.parse(fs.readFileSync(path.join(f.store, 'manifests', snap.id + '.json')));
  for (const unsafe of ['../escape', '/absolute', 'C:/escape', 'a\\b', 'data/../escape', 'data//escape', 'assets/CON.txt', 'assets/name.', 'assets/name ', 'assets/file:stream']) {
    assert.throws(() => safeRelative(unsafe), /unsafe/);
    const forged = { ...m, files: [{ ...m.files[0], path: unsafe }] }, bytes = encode(forged), id = digest(bytes);
    fs.writeFileSync(path.join(f.store, 'manifests', id + '.json'), bytes);
    assert.throws(() => verify({ ...f, id }), /unsafe/);
  }
});

test('project and store links are rejected, including a linked top-level content directory', t => {
  const f = fixture(t), outside = path.join(f.parent, 'outside'); fs.mkdirSync(outside);
  const linked = path.join(f.root, 'docs'); fs.symlinkSync(outside, linked, process.platform === 'win32' ? 'junction' : 'dir');
  assert.throws(() => capture(f), /linked/); fs.unlinkSync(linked);
  const linkedStore = path.join(f.parent, 'linked-history'); fs.symlinkSync(outside, linkedStore, process.platform === 'win32' ? 'junction' : 'dir');
  assert.throws(() => capture({ ...f, store: linkedStore }), /linked/);
});

test('absolute Windows aliases, devices and streams are rejected portably before filesystem access', () => {
  for (const unsafe of ['C:/site./history', 'C:/site /history', 'C:/site/history.', 'C:/site/history ', 'C:/site/file:stream', 'C:/site/CON', 'C:/site/NUL.txt', 'C:/site/COM1/file', 'C:/site/LPT².txt', 'C:/site/CONOUT$', 'C:relative', '\\\\?\\C:\\site', '\\\\.\\C:\\site', '//server/share./history']) {
    assert.throws(() => validateAbsoluteComponents(unsafe), /unsafe|absolute|device/);
  }
  for (const family of ['COM', 'LPT']) for (const digit of ['¹', '²', '³']) {
    assert.throws(() => safeRelative(`assets/${family}${digit}.txt`), /unsafe relative/);
    assert.throws(() => validateAbsoluteComponents(`C:/site/${family}${digit}.txt`), /unsafe absolute/);
  }
  for (const valid of ['C:/site/history', 'C:\\site\\history', '/tmp/site/history', '//server/share/history']) assert.equal(validateAbsoluteComponents(valid), valid);
});

test('absolute alias store and restore arguments cannot bypass project overlap or create files', t => {
  const f = fixture(t), snap = capture(f), original = fs.readFileSync(path.join(f.root, 'index.html'));
  for (const alias of [f.root + '.', f.root + ' ', f.store + '.', f.store + ' ']) {
    assert.throws(() => capture({ ...f, store: path.join(alias, 'hidden-store') }), /unsafe absolute/);
    assert.throws(() => restore({ ...f, id: snap.id, to: path.join(alias, 'hidden-restore') }), /unsafe absolute/);
  }
  if (process.platform === 'win32') {
    // Read-only native probe. Node/Windows versions may already refuse this alias.
    try { assert.equal(fs.statSync(f.root + '.').ino, fs.statSync(f.root).ino); }
    catch (e) { assert.equal(e.code, 'ENOENT'); }
    assert.throws(() => capture({ ...f, store: f.root.toUpperCase() }), /overlap/);
  }
  assert.equal(fs.existsSync(path.join(f.root, 'hidden-store')), false);
  assert.equal(fs.existsSync(path.join(f.root, 'hidden-restore')), false);
  assert.deepEqual(fs.readFileSync(path.join(f.root, 'index.html')), original);
});

test('an unavailable terminal filesystem root fails promptly in both ancestor walks', t => {
  const f = fixture(t), script = path.join(f.parent, 'unavailable-root.mjs');
  fs.writeFileSync(script, `
import fs from 'node:fs';
import path from 'node:path';
import { capture } from ${JSON.stringify(new URL('../tools/course-checkpoint.mjs', import.meta.url).href)};
const root = ${JSON.stringify(f.root)}, store = ${JSON.stringify(f.store)};
let unavailable;
if (process.platform === 'win32') {
  const drive = [...'ZYXWVUTSRQPONMLKJIHGFEDCBA'].map(x => x + ':/').find(p => !fs.existsSync(p));
  if (!drive) throw Error('fixture requires one non-mounted Windows drive');
  unavailable = path.join(drive, '__course_checkpoint_missing_root__', 'target');
} else {
  // Portable deterministic equivalent: this path and its terminal root report ENOENT.
  unavailable = path.join(path.parse(root).root, '__course_checkpoint_missing_root__', 'target');
  const original = fs.lstatSync, terminal = path.parse(unavailable).root;
  const missingParent = path.dirname(unavailable);
  fs.lstatSync = function(p, ...args) {
    if ([unavailable, missingParent, terminal].includes(String(p))) { const e = Error('fixture unavailable root'); e.code = 'ENOENT'; throw e; }
    return original.call(this, p, ...args);
  };
}
const results = [];
for (const options of [{ root: unavailable, store }, { root, store: unavailable }]) {
  try { capture(options); throw Error('capture unexpectedly succeeded'); }
  catch (e) { if (!/filesystem root is unavailable/.test(e.message)) throw e; results.push(e.message); }
}
if (fs.existsSync(store)) throw Error('unavailable-root check wrote a store');
console.log(JSON.stringify({ ok: true, results }));
`);
  const child = spawnSync(process.execPath, [script], { encoding: 'utf8', windowsHide: true, timeout: 5000 });
  assert.equal(child.error, undefined, 'ancestor traversal must not reach the child timeout');
  assert.equal(child.status, 0, child.stderr);
  assert.equal(JSON.parse(child.stdout).results.length, 2);
  assert.equal(fs.existsSync(f.store), false);
  assert.equal(fs.readFileSync(path.join(f.root, 'index.html'), 'utf8'), 'existing index');
});

test('changes or additions during capture leave no committed manifest', t => {
  const f = fixture(t); let altered = false;
  assert.throws(() => capture({ ...f, onFile: () => { if (!altered) { altered = true; f.write('naslovna.html', 'concurrent change'); } } }), /changed/);
  assert.equal(fs.existsSync(path.join(f.store, 'manifests')), false);
  const g = fixture(t); let added = false;
  assert.throws(() => capture({ ...g, onFile: () => { if (!added) { added = true; g.write('docs/new.md', 'concurrent addition'); } } }), /changed/);
  assert.equal(fs.existsSync(path.join(g.store, 'manifests')), false);
});

test('size limits reject a sparse oversized artifact before reading it', t => {
  const f = fixture(t), p = path.join(f.root, 'assets/large.bin');
  const fd = fs.openSync(p, 'wx'); fs.ftruncateSync(fd, LIMITS.fileBytes + 1); fs.closeSync(fd);
  assert.throws(() => capture(f), /bounded/); assert.equal(fs.existsSync(f.store), false);
});

test('a lost original can be restored separately, and a subdirectory cannot borrow its parent Git identity', t => {
  const f = fixture(t), snap = capture(f), to = path.join(f.parent, 'recovered');
  fs.mkdirSync(path.join(f.root, 'docs'));
  assert.throws(() => capture({ root: path.join(f.root, 'docs'), store: path.join(f.parent, 'wrong-store') }), /own Git/);
  fs.rmSync(f.root, { recursive: true }); // this test owns the entire temporary project
  assert.equal(verify({ ...f, id: snap.id }).ok, true);
  assert.equal(restore({ ...f, id: snap.id, to }).ok, true);
  assert.equal(fs.existsSync(f.root), false, 'recovery does not recreate or write the original');
  assert.equal(fs.readFileSync(path.join(to, 'naslovna.html'), 'utf8'), 'preserved cover');
});

test('published history cannot be edited, dropped, demoted or changed without a new revision', () => {
  const before = baseWeek(), after = structuredClone(before);
  after.title.sr = 'Changed'; assert.match(compareWeekRevisions(before, after).join(' '), /new revision/);
  after.revizije[0].sta.sr = 'Rewritten'; assert.match(compareWeekRevisions(before, after).join(' '), /prefix/);
  assert.match(compareWeekRevisions(before, { ...before, revizije: [] }).join(' '), /prefix/);
  assert.match(compareWeekRevisions(before, { ...before, state: 'draft' }).join(' '), /demoted/);
  assert.match(compareWeekRevisions(before, null).join(' '), /removed/);
});

test('an appended dated revision can amend material without pretending to authorize it', () => {
  const before = baseWeek(), after = structuredClone(before);
  after.title.sr = 'Changed'; after.revizije.push({ v: 2, datum: '2026-10-09', sta: { sr: 'Correction' } }); after.updated = '2026-10-09';
  assert.deepEqual(compareWeekRevisions(before, after), []);
  after.updated = '2026-10-02'; assert.match(compareWeekRevisions(before, after).join(' '), /updated/);
  after.revizije[1].datum = '2026-10-01'; assert.match(compareWeekRevisions(before, after).join(' '), /backwards/);
  after.revizije[1].datum = '2026-02-31'; assert.match(compareWeekRevisions(before, after).join(' '), /invalid revision/);
});

test('compare covers dependency bytes and removed weeks; CI check needs no private store', t => {
  const f = fixture(t), snap = capture(f); f.write('assets/exercises.js', 'changed dependency');
  let c = compare({ ...f, id: snap.id }); assert.equal(c.ok, true); assert.deepEqual(c.changed, ['assets/exercises.js']);
  const week = baseWeek(); week.title.sr = 'Unrecorded'; f.write('data/material/w01.json', week);
  c = compare({ ...f, id: snap.id }); assert.equal(c.ok, false); assert.match(c.errors.join(' '), /new revision/);
  const ci = check({ root: f.root, base: f.head }); assert.equal(ci.ok, false); assert.equal(ci.publishedIsNotApproval, true);
  fs.unlinkSync(path.join(f.root, 'data/material/w01.json'));
  assert.match(compare({ ...f, id: snap.id }).errors.join(' '), /removed/);
});

test('Git baseline checking reads and protects the separate restored tree, never the live candidate', t => {
  const f = fixture(t), snap = capture(f), againstRoot = path.join(f.parent, 'candidate');
  restore({ ...f, id: snap.id, to: againstRoot });
  const m = { format: 'course-official/v1', snapshotId: snap.id, approval: { kind: 'teacher-approved', source: 'fixture only', at: '2026-10-09T00:00:00Z' }, paths: [{ path: 'assets/exercises.js', sha256: digest(fs.readFileSync(path.join(againstRoot, 'assets/exercises.js'))) }] };
  const official = path.join(f.parent, 'official.json'), raw = encode(m), expectedSha256 = digest(raw); fs.writeFileSync(official, raw);
  const changed = baseWeek(); changed.title.sr = 'Unrecorded live edit'; f.write('data/material/w01.json', changed); f.write('assets/exercises.js', 'unapproved live change');
  assert.equal(check({ ...f, base: f.head }).ok, false);
  const good = check({ ...f, base: f.head, againstRoot, official, expectedSha256 });
  assert.equal(good.ok, true); assert.equal(good.againstRoot, fs.realpathSync(againstRoot));
  assert.equal(fs.existsSync(path.join(againstRoot, '.git')), false, 'material target need not be a Git checkout');
  fs.writeFileSync(path.join(againstRoot, 'data/material/w01.json'), encode(changed));
  const bad = check({ ...f, base: f.head, againstRoot }); assert.equal(bad.ok, false); assert.match(bad.errors.join(' '), /new revision/);
  assert.throws(() => check({ ...f, base: f.head, againstRoot: f.root }), /separate/);
  assert.throws(() => check({ ...f, base: f.head, againstRoot: againstRoot + '.' }), /unsafe absolute/);
});

test('explicit official manifest pins selected content separately from published state', t => {
  const f = fixture(t), snap = capture(f), official = path.join(f.parent, 'official.json');
  const m = { format: 'course-official/v1', snapshotId: snap.id, approval: { kind: 'teacher-approved', source: 'fixture user decision; not an actual course approval', at: '2026-10-09T00:00:00Z' }, paths: ['data/material/w01.json', 'assets/exercises.js'].map(p => ({ path: p, sha256: digest(fs.readFileSync(path.join(f.root, p))) })) };
  const bytes = encode(m), expectedSha256 = digest(bytes); fs.writeFileSync(official, bytes);
  assert.equal(guardOfficial({ ...f, official, expectedSha256 }).ok, true);
  assert.throws(() => guardOfficial({ ...f, official, expectedSha256: '0'.repeat(64) }), /independently supplied/);
  f.write('assets/exercises.js', 'changed official dependency');
  assert.equal(compare({ ...f, id: snap.id, official, expectedSha256 }).ok, false);
  const changed = baseWeek(); changed.title.sr = 'Revised'; changed.revizije.push({ v: 2, datum: '2026-10-09', sta: 'changed' }); changed.updated = '2026-10-09'; f.write('data/material/w01.json', changed);
  assert.equal(check({ ...f, base: f.head, official, expectedSha256 }).ok, false, 'a revision is not teacher approval');
});
