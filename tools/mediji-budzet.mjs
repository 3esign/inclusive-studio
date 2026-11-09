// Budžet medija za GitHub Pages — jedan pisac izvedenih polja.
//   node tools/mediji-budzet.mjs --check    : svaki praćeni fajl u budžetu (jpg/png/webp ≤ 300 KB, mp4/webm ≤ 2 MB, ostalo ≤ 1 MB); izlaz 1 ako nije.
//   node tools/mediji-budzet.mjs --osvezi   : posle re-enkodiranja osveži sha256/bytes u DOZVOLJENE_SLIKE.json (samo postojeće unose; nestali fajlovi ispadaju)
//                                             i sha256/width/height fotografija u svakom registru data/*.json (prototipovi, posete). Nove fajlove ne odobrava — to radi slike-strazar odobri.
// Bez zavisnosti, bez mreže. Originali re-enkodiranih fajlova stoje u privatnom arhivu Svemira (karantin-slika), nikad se ne brišu odavde.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, statSync, realpathSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const BUDZET = { slika: 300_000, video: 2_000_000, ostalo: 1_000_000 };
const SLIKA = /\.(jpe?g|png|webp|gif|avif)$/i, VIDEO = /\.(mp4|webm)$/i;

export function praceni(root) {
  return execFileSync('git', ['ls-files', '-z'], { cwd: root }).toString('utf8').split('\0').filter(Boolean);
}
export function granica(file) { return SLIKA.test(file) ? BUDZET.slika : VIDEO.test(file) ? BUDZET.video : BUDZET.ostalo; }
export function check(root) {
  const problemi = [];
  for (const rel of praceni(root)) {
    const p = path.join(root, rel); if (!existsSync(p)) continue;
    const bytes = statSync(p).size, max = granica(rel);
    if (bytes > max) problemi.push({ file: rel, bytes, max });
  }
  return problemi;
}
function sha256(buf) { return createHash('sha256').update(buf).digest('hex'); }
function dimenzije(b) {
  if (b[0] !== 0xff || b[1] !== 0xd8) throw new Error('nije JPEG');
  let p = 2;
  while (p + 9 < b.length) {
    if (b[p] !== 255) break;
    const m = b[p + 1]; if (m === 0xda || m === 0xd9) break;
    const len = b.readUInt16BE(p + 2);
    if ([0xc0, 0xc1, 0xc2].includes(m)) return { width: b.readUInt16BE(p + 7), height: b.readUInt16BE(p + 5) };
    p += len + 2;
  }
  throw new Error('JPEG bez SOF');
}
export function osvezi(root, { razlog = 'Re-encoded within Pages media budget (tools/mediji-budzet.mjs); original archived in Svemir karantin-slika' } = {}) {
  const now = new Date().toISOString();
  const dozPath = path.join(root, 'DOZVOLJENE_SLIKE.json');
  const doz = JSON.parse(readFileSync(dozPath, 'utf8'));
  let izmenjeno = 0, uklonjeno = 0;
  doz.approved = (doz.approved || []).filter(e => {
    const rel = e.file || e.path;
    if (!rel) return false;
    if (!e.file) { e.file = rel; delete e.path; }
    const ok = existsSync(path.join(root, rel));
    if (!ok) uklonjeno++;
    return ok;
  });
  for (const e of doz.approved) {
    const buf = readFileSync(path.join(root, e.file)), h = sha256(buf);
    if (h !== e.sha256) { e.sha256 = h; e.bytes = buf.length; e.approvedAt = now; e.reason = razlog; izmenjeno++; }
  }
  doz.totalApproved = doz.approved.length; doz.updatedAt = now;
  writeFileSync(dozPath, JSON.stringify(doz, null, 2) + '\n');
  // Registri sa fotografijama (data/prototipovi.json, data/poseta-*.json ...): svaki unos {src, sha256[, width, height]}
  // čiji su bajtovi promenjeni dobija nov sha256 i stvarne dimenzije. Ništa drugo u registru se ne dira.
  const registri = readdirSync(path.join(root, 'data')).filter(n => n.endsWith('.json')).map(n => path.join('data', n));
  const fotografije = {};
  for (const rel of registri) {
    const full = path.join(root, rel), proto = JSON.parse(readFileSync(full, 'utf8'));
    let n = 0;
    const obidji = node => {
      if (Array.isArray(node)) return node.forEach(obidji);
      if (node && typeof node === 'object') {
        if (typeof node.src === 'string' && typeof node.sha256 === 'string' && /\.jpe?g$/i.test(node.src) && existsSync(path.join(root, node.src))) {
          const buf = readFileSync(path.join(root, node.src)), h = sha256(buf);
          if (h !== node.sha256) { const d = dimenzije(buf); node.sha256 = h; if ('width' in node) node.width = d.width; if ('height' in node) node.height = d.height; n++; }
        }
        for (const v of Object.values(node)) obidji(v);
      }
    };
    obidji(proto);
    if (n) { writeFileSync(full, JSON.stringify(proto, null, 2) + '\n'); fotografije[rel] = n; }
  }
  return { dozvoljene: { izmenjeno, uklonjeno, ukupno: doz.totalApproved }, registri: fotografije };
}
if (process.argv[1] && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const arg = process.argv[2];
  if (arg === '--check') {
    const p = check(root);
    for (const x of p) console.log(`PREKO BUDZETA ${x.file}: ${(x.bytes / 1024).toFixed(0)} KB > ${(x.max / 1024).toFixed(0)} KB`);
    console.log(p.length ? `${p.length} fajl(ova) preko budžeta` : 'ok — svaki praćeni fajl je u budžetu medija');
    process.exit(p.length ? 1 : 0);
  } else if (arg === '--osvezi') {
    console.log(JSON.stringify(osvezi(root)));
  } else { console.log('Upotreba: node tools/mediji-budzet.mjs --check | --osvezi'); process.exit(2); }
}
