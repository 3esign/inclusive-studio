import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Kapija privatnosti: ovaj repo JE javni sajt, pa ceo radni stablo (a ne samo
// renderovane stranice) mora biti bez licnih podataka. Filter rendera
// (_config.yml exclude) nije granica objave — veci registri su 404 na sajtu,
// a zive su u javnom repou. Ova provera gleda sadrzaj, ne putanju.

const MEJL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
const TELEFON = /\+381[\s/-]?\d{2,3}[\s/-]?\d{3}[\s/-]?\d{3,4}\b|\b0\d{2,3}[\s/-]\d{3}[\s/-]\d{3,4}\b/g;

// Rezervisani fiksturni domeni (RFC 2606) i javne adrese predmeta/nastavnika.
const MEJL_IZUZETAK = /^(?:[A-Za-z0-9._%+-]+@example\.(?:com|org|net|invalid)|a@b\.rs|ntunionhub@gmail\.com|scumutator@gmail\.com)$/i;

const SKIP = new Set(['.git', 'node_modules', 'slike']);   // slike = sirovi prijem, van snapshot-a
const TEKST = /\.(json|md|html|js|mjs|cjs|txt|yml|yaml|css|csv)$/i;
const root = path.dirname(fileURLToPath(import.meta.url));

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

test('the public repository carries no personal email address or phone number', () => {
  const nadjeno = scan(path.join(root, '..'), []);
  assert.deepEqual(nadjeno, [], 'licni podaci u javnom repou (kapija, ne filter): ' + nadjeno.join('; '));
});
