#!/usr/bin/env node
// Local preservation and review guard. Hashes bind bytes; they do not grant approval.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const FORMAT = 'course-checkpoint/v1';
export const LIMITS = Object.freeze({ files: 4096, fileBytes: 64 * 1024 * 1024, totalBytes: 256 * 1024 * 1024 });
const DIRS = new Set(['assets', 'data', 'tools', 'tests', 'docs', 'skills', '.github']);
const EXCLUDED = /^(?:\.git|node_modules|!Projekti|\.checkpoints?|checkpoints?|\.course-history|\.env(?:\..*)?|.*(?:secret|credential|vault).*|id_(?:rsa|ed25519)|.*\.(?:pem|p12|pfx|key))$/i;
const HEX = /^[a-f0-9]{64}$/;
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const fail = message => { throw new Error(message); };
const exists = p => { try { fs.lstatSync(p); return true; } catch (e) { if (e.code === 'ENOENT') return false; throw e; } };
const jsonBytes = value => Buffer.from(JSON.stringify(value, null, 2) + '\n');
const canonicalJSON = value => JSON.stringify(value, (_, v) => v && typeof v === 'object' && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
const unsafeComponent = s => !s || s === '.' || s === '..' || /[\x00-\x1f<>:"\\|?*]/.test(s) || /[. ]$/.test(s)
  || /^(?:con|prn|aux|nul|clock\$|conin\$|conout\$|com[1-9¹²³]|lpt[1-9¹²³])(?:\.|$)/i.test(s);

export function safeRelative(value) {
  if (typeof value !== 'string' || !value || value.startsWith('/') || value.split('/').some(unsafeComponent)) fail('unsafe relative path');
  return value;
}
// Pure validation also runs on Windows-looking strings on other test platforms.
export function validateAbsoluteComponents(value) {
  if (typeof value !== 'string' || !value) fail('unsafe absolute path');
  const normalized = value.replace(/\\/g, '/');
  if (!normalized.startsWith('/') && !/^[a-z]:\//i.test(normalized)) fail('absolute path required');
  if (/^\/\/[?.](?:\/|$)/.test(normalized)) fail('Windows device path refused');
  const withoutDrive = normalized.replace(/^[a-z]:/i, '');
  if (withoutDrive.split('/').filter(Boolean).some(unsafeComponent)) fail('unsafe absolute path component');
  return value;
}
function included(rel) {
  safeRelative(rel);
  if (rel === 'CHECKPOINT-RESTORE.json') return false;
  const parts = rel.split('/');
  if (parts.some(p => EXCLUDED.test(p))) return false;
  return parts.length === 1 ? /\.(?:html|md|json|mjs|cjs|js|css|svg|txt)$|^\.gitignore$/i.test(rel) : DIRS.has(parts[0]);
}
function rootPath(root, allowMissing = false) {
  const absolute = path.resolve(root);
  if (allowMissing && !exists(absolute)) {
    let ancestor = absolute; const missing = [];
    while (!exists(ancestor)) {
      const parent = path.dirname(ancestor);
      if (parent === ancestor) fail('project filesystem root is unavailable');
      missing.unshift(path.basename(ancestor)); ancestor = parent;
    }
    if (!fs.statSync(ancestor).isDirectory()) fail('project ancestor is not a directory');
    return path.join(fs.realpathSync(ancestor), ...missing);
  }
  const real = fs.realpathSync(absolute); // explicit project junction is resolved once
  if (!fs.statSync(real).isDirectory()) fail('project root is not a directory');
  return real;
}
function noLinks(p) {
  validateAbsoluteComponents(p);
  const absolute = path.resolve(p), base = path.parse(absolute).root;
  validateAbsoluteComponents(absolute);
  let current = base;
  for (const part of absolute.slice(base.length).split(path.sep).filter(Boolean)) {
    current = path.join(current, part);
    if (!exists(current)) continue;
    if (fs.lstatSync(current).isSymbolicLink()) fail('linked path refused: ' + current);
  }
  // Existing 8.3/case aliases are resolved before any overlap check. Missing tail
  // components remain literal, and have already passed the Windows alias guard.
  let ancestor = absolute; const missing = [];
  while (!exists(ancestor)) {
    const parent = path.dirname(ancestor);
    if (parent === ancestor) fail('filesystem root is unavailable');
    missing.unshift(path.basename(ancestor)); ancestor = parent;
  }
  const canonical = path.join(fs.realpathSync(ancestor), ...missing);
  validateAbsoluteComponents(canonical);
  return canonical;
}
function overlaps(a, b) {
  const inside = (x, y) => { const rel = path.relative(x, y); return !rel || (!rel.startsWith('..' + path.sep) && rel !== '..' && !path.isAbsolute(rel)); };
  return inside(a, b) || inside(b, a);
}
function context(root, store, to) {
  const r = rootPath(root, true), s = noLinks(store);
  if (overlaps(r, s)) fail('checkpoint store overlaps project root');
  if (to) {
    const dest = noLinks(to);
    if (overlaps(dest, r) || overlaps(dest, s)) fail('restore overlaps project or store');
    return { root: r, store: s, to: dest };
  }
  return { root: r, store: s };
}
function identity(s) { return { dev: s.dev, ino: s.ino, size: s.size, mtimeMs: s.mtimeMs, ctimeMs: s.ctimeMs }; }
function same(a, b) { return canonicalJSON(a) === canonicalJSON(b); }
function readStable(p, max = LIMITS.fileBytes) {
  noLinks(p);
  const before = fs.lstatSync(p);
  if (!before.isFile() || before.size > max) fail('not a bounded regular file: ' + p);
  const fd = fs.openSync(p, fs.constants.O_RDONLY);
  try {
    const opened = fs.fstatSync(fd);
    if (!same(identity(before), identity(opened))) fail('file changed before read: ' + p);
    const bytes = fs.readFileSync(fd), after = fs.fstatSync(fd), named = fs.lstatSync(p);
    if (bytes.length > max || !same(identity(before), identity(after)) || !same(identity(before), identity(named)) || named.isSymbolicLink()) fail('file changed during read: ' + p);
    return { bytes, identity: identity(after), sha256: sha(bytes) };
  } finally { fs.closeSync(fd); }
}
function inventory(root) {
  const rows = [], keys = new Set(); let total = 0;
  function visit(dir, prefix = '') {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name, 'en'))) {
      if (EXCLUDED.test(entry.name)) continue;
      const rel = prefix ? prefix + '/' + entry.name : entry.name;
      if (entry.isSymbolicLink() && (prefix || DIRS.has(entry.name) || included(rel))) fail('linked project entry refused: ' + rel);
      if (!prefix && entry.isDirectory() && !DIRS.has(entry.name)) continue;
      if (!prefix && !entry.isDirectory() && !included(rel)) continue;
      safeRelative(rel);
      if (entry.isSymbolicLink()) fail('linked project entry refused: ' + rel);
      const p = path.join(root, rel), s = fs.lstatSync(p);
      if (s.isDirectory()) visit(p, rel);
      else {
        if (!included(rel)) continue;
        if (!s.isFile() || s.size > LIMITS.fileBytes) fail('not a bounded regular file: ' + rel);
        if (keys.has(rel.toLowerCase())) fail('case-colliding paths');
        keys.add(rel.toLowerCase()); total += s.size;
        rows.push({ path: rel, identity: identity(s) });
        if (rows.length > LIMITS.files || total > LIMITS.totalBytes) fail('snapshot scope exceeds limit');
      }
    }
  }
  visit(root);
  return rows.sort((a, b) => a.path.localeCompare(b.path, 'en'));
}
function git(root, args) {
  return execFileSync('git', ['-C', root, ...args], { encoding: 'utf8', windowsHide: true, timeout: 20000, maxBuffer: 1024 * 1024, env: { ...process.env, GIT_OPTIONAL_LOCKS: '0' } });
}
function gitProof(root) {
  if (fs.realpathSync(git(root, ['rev-parse', '--show-toplevel']).trim()) !== root) fail('project must be its own Git working tree');
  return { head: git(root, ['rev-parse', 'HEAD']).trim(), trackedStatus: git(root, ['status', '--porcelain=v1', '-z', '--untracked-files=no']) };
}
function writeImmutable(p, bytes) {
  noLinks(p); fs.mkdirSync(path.dirname(p), { recursive: true }); noLinks(path.dirname(p));
  let fd;
  try { fd = fs.openSync(p, 'wx'); }
  catch (e) {
    if (e.code !== 'EEXIST') throw e;
    if (!readStable(p, Math.max(LIMITS.fileBytes, bytes.length)).bytes.equals(bytes)) fail('immutable object conflict: ' + p);
    return;
  }
  try { fs.writeFileSync(fd, bytes); fs.fsyncSync(fd); } finally { fs.closeSync(fd); }
}

export function capture({ root, store, onFile = () => {} }) {
  const ctx = context(root, store), beforeGit = gitProof(ctx.root), before = inventory(ctx.root), files = [];
  const tracked = new Set(git(ctx.root, ['ls-files', '-z']).split('\0').filter(Boolean));
  for (const row of before) {
    const read = readStable(path.join(ctx.root, row.path));
    if (!same(row.identity, read.identity)) fail('source changed since inventory: ' + row.path);
    writeImmutable(path.join(ctx.store, 'blobs', read.sha256), read.bytes);
    files.push({ path: row.path, bytes: read.bytes.length, sha256: read.sha256, identity: read.identity, tracked: tracked.has(row.path) });
    onFile({ path: row.path, bytes: read.bytes.length, count: files.length });
  }
  if (!same(before, inventory(ctx.root)) || !same(beforeGit, gitProof(ctx.root))) fail('project changed while capturing');
  for (const file of files) {
    const fresh = readStable(path.join(ctx.root, file.path));
    if (fresh.sha256 !== file.sha256 || !same(fresh.identity, file.identity)) fail('project bytes changed while capturing: ' + file.path);
  }
  const manifest = { format: FORMAT, kind: 'existing-state', at: new Date().toISOString(), root: ctx.root, git: beforeGit,
    scope: { directories: [...DIRS], limits: LIMITS, includesRelevantUntracked: true, excludesSecretsAndNestedProjects: true }, files };
  const bytes = jsonBytes(manifest), id = sha(bytes);
  writeImmutable(path.join(ctx.store, 'manifests', id + '.json'), bytes);
  return { ok: true, id, kind: manifest.kind, files: files.length, bytes: files.reduce((n, f) => n + f.bytes, 0), head: beforeGit.head, store: ctx.store };
}
function loadManifest(ctx, id) {
  if (!HEX.test(id || '')) fail('snapshot id must be a SHA-256');
  const read = readStable(path.join(ctx.store, 'manifests', id + '.json'), 8 * 1024 * 1024);
  if (read.sha256 !== id) fail('corrupt manifest');
  const m = JSON.parse(read.bytes);
  if (m.format !== FORMAT || m.kind !== 'existing-state' || m.root !== ctx.root || !/^[a-f0-9]{40,64}$/.test(m.git?.head || '') || !Array.isArray(m.files) || m.files.length > LIMITS.files) fail('invalid snapshot manifest');
  const seen = new Set(); let total = 0;
  for (const f of m.files) {
    if (!included(f.path) || !HEX.test(f.sha256 || '') || !Number.isSafeInteger(f.bytes) || f.bytes < 0 || f.bytes > LIMITS.fileBytes || seen.has(f.path.toLowerCase())) fail('invalid snapshot file');
    seen.add(f.path.toLowerCase()); total += f.bytes;
  }
  if (total > LIMITS.totalBytes) fail('snapshot exceeds limit');
  return m;
}
function blob(ctx, f) {
  const r = readStable(path.join(ctx.store, 'blobs', f.sha256));
  if (r.bytes.length !== f.bytes || r.sha256 !== f.sha256) fail('corrupt blob: ' + f.path);
  return r.bytes;
}
export function verify({ root, store, id }) {
  const ctx = context(root, store), m = loadManifest(ctx, id);
  for (const f of m.files) blob(ctx, f);
  return { ok: true, id, kind: m.kind, files: m.files.length, bytes: m.files.reduce((n, f) => n + f.bytes, 0), head: m.git.head };
}

// This compares two versions, not just the shape of the new history array.
export function compareWeekRevisions(before, after, label = 'week') {
  const errors = [];
  if (before?.state !== 'published') return errors;
  if (!after || after.state !== 'published') return [`${label}: existing published material removed or demoted`];
  const old = before.revizije, next = after.revizije;
  if (!Array.isArray(old) || !old.length || !Array.isArray(next)) return [`${label}: missing revision history needs explicit reconciliation`];
  if (next.length < old.length || old.some((r, i) => !same(r, next[i]))) errors.push(`${label}: revision prefix rewritten or deleted`);
  const content = w => Object.fromEntries(Object.entries(w).filter(([k]) => !['revizije', 'updated'].includes(k)));
  if (!same(content(before), content(after)) && next.length <= old.length) errors.push(`${label}: changed published material requires a new revision`);
  const text = value => typeof value === 'string' && value.trim().length > 0;
  const date = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value + 'T00:00:00Z')) && new Date(value + 'T00:00:00Z').toISOString().slice(0, 10) === value;
  next.forEach((r, i) => {
    if (!r || r.v !== i + 1 || !date(r.datum) || !(text(r.sta) || text(r.sta?.sr) || text(r.sta?.en))) errors.push(`${label}: invalid revision ${i + 1}`);
    if (i && String(r?.datum) < String(next[i - 1]?.datum)) errors.push(`${label}: revision dates move backwards`);
  });
  if (after.updated !== next.at(-1)?.datum) errors.push(`${label}: updated must equal the last revision date`);
  return errors;
}
function weekChecks(before, after) {
  const errors = [];
  for (const [rel, bytes] of before) {
    if (!/^data\/material\/w\d{2}\.json$/.test(rel)) continue;
    const old = JSON.parse(bytes), current = after.has(rel) ? JSON.parse(after.get(rel)) : null;
    errors.push(...compareWeekRevisions(old, current, rel));
  }
  return errors;
}
function currentFiles(root) {
  const rows = inventory(root), files = new Map(), weeks = new Map();
  for (const row of rows) {
    const read = readStable(path.join(root, row.path));
    if (!same(row.identity, read.identity)) fail('project changed during comparison: ' + row.path);
    files.set(row.path, read.sha256);
    if (/^data\/material\/w\d{2}\.json$/.test(row.path)) weeks.set(row.path, read.bytes);
  }
  if (!same(rows, inventory(root))) fail('project changed during comparison');
  return { files, weeks };
}

export function guardOfficial({ root, official, expectedSha256 }) {
  if (EXCLUDED.test(path.basename(official))) fail('excluded official manifest path');
  const r = rootPath(root), raw = readStable(path.resolve(official), 1024 * 1024);
  if (!HEX.test(expectedSha256 || '') || raw.sha256 !== expectedSha256) fail('official manifest must match the independently supplied SHA-256');
  const m = JSON.parse(raw.bytes);
  if (m.format !== 'course-official/v1' || !HEX.test(m.snapshotId || '') || m.approval?.kind !== 'teacher-approved' || !m.approval.source || !m.approval.at || !Array.isArray(m.paths) || !m.paths.length) fail('invalid explicit official manifest');
  const errors = [], seen = new Set();
  for (const f of m.paths) {
    if (!included(f.path) || !HEX.test(f.sha256 || '') || seen.has(f.path.toLowerCase())) fail('invalid official path');
    seen.add(f.path.toLowerCase());
    const p = path.join(r, f.path);
    if (!exists(p) || readStable(p).sha256 !== f.sha256) errors.push('official content changed: ' + f.path);
  }
  return { ok: !errors.length, errors, snapshotId: m.snapshotId, approvalIsSuppliedEvidenceNotAuthenticatedByThisTool: true };
}
export function compare({ root, store, id, official, expectedSha256 }) {
  const ctx = context(root, store), m = loadManifest(ctx, id), before = new Map(), oldWeeks = new Map(), current = currentFiles(ctx.root), after = current.files;
  for (const f of m.files) { const bytes = blob(ctx, f); before.set(f.path, f.sha256); if (/^data\/material\/w\d{2}\.json$/.test(f.path)) oldWeeks.set(f.path, bytes); }
  const changed = [], added = [], deleted = [];
  for (const [rel, digest] of before) { if (!after.has(rel)) deleted.push(rel); else if (digest !== after.get(rel)) changed.push(rel); }
  for (const rel of after.keys()) if (!before.has(rel)) added.push(rel);
  const errors = weekChecks(oldWeeks, current.weeks);
  if (official) errors.push(...guardOfficial({ root: ctx.root, official, expectedSha256 }).errors);
  return { ok: !errors.length, id, changed, added, deleted, errors, publishedIsNotApproval: true };
}
export function check({ root, base, againstRoot, official, expectedSha256 }) {
  const r = rootPath(root);
  gitProof(r);
  const target = againstRoot === undefined ? r : rootPath(noLinks(againstRoot));
  if (againstRoot !== undefined && overlaps(r, target)) fail('againstRoot must be separate from the Git baseline workspace');
  if (!/^[a-f0-9]{40}$/.test(base || '')) fail('base must be an exact 40-character Git commit');
  if (git(r, ['rev-parse', base + '^{commit}']).trim() !== base) fail('base is not a commit');
  const names = git(r, ['ls-tree', '-r', '--name-only', base, '--', 'data/material']).split('\n').filter(p => /^data\/material\/w\d{2}\.json$/.test(p));
  if (!names.length) fail('baseline has no material weeks');
  const before = new Map(names.map(rel => [rel, Buffer.from(git(r, ['show', base + ':' + safeRelative(rel)]))]));
  const errors = weekChecks(before, currentFiles(target).weeks);
  if (official) errors.push(...guardOfficial({ root: target, official, expectedSha256 }).errors);
  return { ok: !errors.length, base, againstRoot: target, errors, publishedIsNotApproval: true };
}
export function restore({ root, store, id, to }) {
  const ctx = context(root, store, to);
  if (!to || exists(ctx.to)) fail('restore requires a nonexistent separate destination');
  const m = loadManifest(ctx, id);
  for (const f of m.files) blob(ctx, f); // corruption fails before creating the destination
  if (!fs.statSync(path.dirname(ctx.to)).isDirectory()) fail('restore parent must exist');
  fs.mkdirSync(ctx.to); // never recursive at the destination; concurrent creation fails closed
  for (const f of m.files) {
    const p = path.join(ctx.to, f.path); noLinks(p);
    fs.mkdirSync(path.dirname(p), { recursive: true }); noLinks(path.dirname(p));
    const fd = fs.openSync(p, 'wx');
    try { fs.writeFileSync(fd, blob(ctx, f)); fs.fsyncSync(fd); } finally { fs.closeSync(fd); }
  }
  for (const f of m.files) if (readStable(path.join(ctx.to, f.path)).sha256 !== f.sha256) fail('restored bytes changed: ' + f.path);
  const result = { ok: true, id, kind: 'separate-restored-copy', files: m.files.length, to: ctx.to, originalsChanged: false, at: new Date().toISOString() };
  writeImmutable(path.join(ctx.to, 'CHECKPOINT-RESTORE.json'), jsonBytes(result));
  return result;
}

function cli(args) {
  const command = args.shift(), opts = {};
  for (let i = 0; i < args.length; i += 2) {
    if (!/^--(?:root|store|id|to|base|official|official-sha)$/.test(args[i] || '') || !args[i + 1] || args[i + 1].startsWith('--')) fail('invalid CLI argument');
    const key = args[i] === '--official-sha' ? 'expectedSha256' : args[i].slice(2);
    if (key in opts) fail('duplicate CLI argument'); opts[key] = args[i + 1];
  }
  if (!opts.root || (!['capture', 'verify', 'compare', 'restore', 'check'].includes(command))) fail('usage: capture|verify|compare|restore|check --root PATH [--store PATH --id SHA --to NEW_PATH | --base COMMIT]');
  if (Boolean(opts.official) !== Boolean(opts.expectedSha256)) fail('official and official-sha must be supplied together');
  const result = ({ capture, verify, compare, restore, check })[command](opts);
  console.log(JSON.stringify(result, null, 2)); if (!result.ok) process.exitCode = 1;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { cli(process.argv.slice(2)); } catch (e) { console.error(JSON.stringify({ ok: false, error: e.message })); process.exitCode = 1; }
}
