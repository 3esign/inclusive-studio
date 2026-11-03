import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

// Kapija privatnosti: ovaj repo JE javni sajt, pa ceo radni stablo (a ne samo
// renderovane stranice) mora biti bez licnih podataka, bez skrivenih slika u
// _config.yml exclude i bez binarnih EXIF/GPS metapodataka (G-3495).

const MEJL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
const TELEFON = /\+381[\s/-]?\d{2,3}[\s/-]?\d{3}[\s/-]?\d{3,4}\b|\b0\d{2,3}[\s/-]\d{3}[\s/-]\d{3,4}\b/g;

// Rezervisani fiksturni domeni (RFC 2606) i javne adrese predmeta/nastavnika.
const MEJL_IZUZETAK = /^(?:[A-Za-z0-9._%+-]+@example\.(?:com|org|net|invalid)|a@b\.rs|ntunionhub@gmail\.com|scumutator@gmail\.com)$/i;

const SKIP = new Set(['.git', 'node_modules']);
const TEKST = /\.(json|md|html|js|mjs|cjs|txt|yml|yaml|css|csv)$/i;
const MEDIA = /\.(jpe?g|png|webp|gif|mp4|mov|webm|heic|avif)$/i;
const root = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(root, '..');

function hasJpegExif(buf) {
  if (buf.length < 4 || buf[0] !== 0xFF || buf[1] !== 0xD8) return false;
  let offset = 2;
  while (offset + 4 <= buf.length) {
    if (buf[offset] !== 0xFF) break;
    const marker = buf[offset + 1];
    if (marker === 0xDA || marker === 0xD9) break;
    const segLen = buf.readUInt16BE(offset + 2);
    if (segLen < 2 || offset + 2 + segLen > buf.length) break;
    if (marker === 0xE1) {
      const hdr = buf.slice(offset + 4, Math.min(offset + 20, offset + 2 + segLen)).toString('ascii');
      if (hdr.startsWith('Exif\0\0') || hdr.includes('http://ns.adobe.com/xap')) return true;
    }
    offset += 2 + segLen;
  }
  return false;
}

function scan(dir, nadjeno) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) { scan(p, nadjeno); continue; }
    if (!TEKST.test(entry.name)) continue;
    const text = fs.readFileSync(p, 'utf8');
    for (const m of text.match(MEJL) || []) if (!MEJL_IZUZETAK.test(m)) nadjeno.push(`${path.relative(root, p)}: mejl ${m}`);
    for (const m of text.match(TELEFON) || []) nadjeno.push(`${path.relative(root, p)}: telefon ${m}`);
  }
  return nadjeno;
}

function scanMedia(dir, list = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) scanMedia(p, list);
    else if (MEDIA.test(entry.name)) list.push(p);
  }
  return list;
}

test('the public repository carries no personal email address or phone number', () => {
  const nadjeno = scan(repoRoot, []);
  assert.deepEqual(nadjeno, [], 'licni podaci u javnom repou (kapija, ne filter): ' + nadjeno.join('; '));
});

test('every media file in the repository is EXIF-free, outside _config.yml exclude, and approved by SHA-256 in DOZVOLJENE_SLIKE.json', () => {
  const configText = fs.readFileSync(path.join(repoRoot, '_config.yml'), 'utf8');
  const excludes = [...configText.matchAll(/^\s*-\s*(\S+)\s*$/gm)].map(m => m[1].replace(/\/+$/, ''));
  const allowlistRaw = JSON.parse(fs.readFileSync(path.join(repoRoot, 'DOZVOLJENE_SLIKE.json'), 'utf8'));
  const approvedHashes = new Set((allowlistRaw.approved || []).map(x => x.sha256));

  const problems = [];
  for (const fullPath of scanMedia(repoRoot)) {
    const rel = path.relative(repoRoot, fullPath).replace(/\\/g, '/');
    const buf = fs.readFileSync(fullPath);
    const sha256 = crypto.createHash('sha256').update(buf).digest('hex');
    if (excludes.some(ex => rel === ex || rel.startsWith(ex + '/'))) {
      problems.push(`${rel}: nalazi se u _config.yml exclude a fizicki je u javnom git repozitorijumu`);
    }
    if (hasJpegExif(buf)) {
      problems.push(`${rel}: sadrzi binarni EXIF/XMP segment`);
    }
    if (!approvedHashes.has(sha256)) {
      problems.push(`${rel}: nema odobren SHA-256 otisak u DOZVOLJENE_SLIKE.json (${sha256.slice(0, 12)})`);
    }
  }
  assert.deepEqual(problems, [], 'Media Firewall prekrsaj: ' + problems.join('; '));
});
