// Regenerate only the cloud page's static content from the same renderer used in the
// browser (assets/cloud-core.js). Shells remain owned by tools/shells.mjs. The region is
// held between markers in oblak.html so the fallback never retells data/tok.json by hand.
import { readFile, writeFile } from 'node:fs/promises';
import { setLanguage } from '../assets/core.js';
import { validateTok } from '../assets/tok-core.js';
import { cloudView } from '../assets/cloud-core.js';

const root = new URL('../', import.meta.url);
const tok = JSON.parse(await readFile(new URL('data/tok.json', root), 'utf8'));
const errors = validateTok(tok);
if (errors.length) throw Error(errors.join('\n'));
setLanguage('sr');
const target = new URL('oblak.html', root), before = await readFile(target, 'utf8');
const START = '<!-- cloud-view:start -->', END = '<!-- cloud-view:end -->';
let after;
if (before.includes(START) && before.includes(END)) {
  const inner = new RegExp(START.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[\\s\\S]*?' + END.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  after = before.replace(inner, START + cloudView(tok) + END);
} else {
  // First run: wrap the existing hand-written content in markers, then regenerate over it.
  const host = /<div id="cloud-view">([\s\S]*?)\n<\/div>\n<\/main>/;
  if (!host.test(before)) throw Error('cloud-view host missing; nothing written.');
  after = before.replace(host, `<div id="cloud-view">\n${START}${cloudView(tok)}${END}\n</div>\n</main>`);
}
if (before !== after) await writeFile(target, after);
// The page-top meta count ("Ideja N") is flow data too — stamped from the same source,
// never by hand. A missing marker is an error, not a silent skip.
const meta = /(<span data-meta="ideje">)\d+(<\/span>)/;
if (!meta.test(after)) throw Error('oblak.html: the ideas count marker data-meta="ideje" is missing');
const final = after.replace(meta, `$1${tok.ideje.length}$2`);
if (final !== after) await writeFile(target, final);
console.log(JSON.stringify({ changed: before !== final, ideje: tok.ideje.length, source: 'same static and runtime renderer' }));
