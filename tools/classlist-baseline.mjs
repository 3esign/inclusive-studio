// Stamp the static Serbian baseline of every class-list page from the same renderer the
// browser uses. One tool for every class: the page names its register in data-classlist,
// shells remain owned by tools/shells.mjs, and the register stays the only source.
// Run: node tools/classlist-baseline.mjs [page.html …]  (no argument = every class page)
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { setLanguage } from '../assets/core.js';
import { renderCas03, validateCas03 } from '../assets/cas03-core.js';
import { validatePrototypes } from '../assets/prototipovi-core.js';
import { validateVisit } from '../assets/poseta-core.js';

const root = new URL('../', import.meta.url);
const json = async p => JSON.parse(await readFile(new URL(p, root), 'utf8'));
const prototypes = await json('data/prototipovi.json');
const registryProblems = validatePrototypes(prototypes);
if (registryProblems.length) throw Error(registryProblems.join('\n'));
setLanguage('sr');

const start = '<!-- cas03-content:start -->', end = '<!-- cas03-content:end -->';
const named = process.argv.slice(2);
// A class page declares itself with data-view="classlist"; the pages that outgrew their
// list (the third class now shows galleries) are built by their own tool, not this one.
const candidates = named.length ? named : (await readdir(root)).filter(name => /^cas-\d+\.html$/.test(name)).sort();
const pages = [];
for (const name of candidates) {
  const text = await readFile(new URL(name, root), 'utf8');
  if (text.includes('data-view="classlist"')) pages.push(name);
  else if (named.length) throw Error(`${name}: not a class-list page (data-view="classlist" is missing).`);
}
const report = [];
for (const page of pages) {
  const target = new URL(page, root), before = await readFile(target, 'utf8');
  const registar = before.match(/data-classlist="([^"]+)"/)?.[1];
  if (!registar) throw Error(`${page}: data-classlist is missing — the page must name its register.`);
  if (before.split(start).length !== 2 || before.split(end).length !== 2) throw Error(`${page}: baseline markers missing; nothing written.`);
  const spisak = await json(registar);
  const problems = validateCas03(spisak);
  if (problems.length) throw Error(`${page} (${registar}):\n` + problems.join('\n'));
  const poseta = spisak.posetaRegistar ? await json(spisak.posetaRegistar) : null;
  if (poseta) { const visitProblems = validateVisit(poseta); if (visitProblems.length) throw Error(page + ' (' + spisak.posetaRegistar + '): ' + visitProblems.join('; ')); }
  const after = before.slice(0, before.indexOf(start) + start.length) + `<div id="cas03-content">${renderCas03(spisak, prototypes, poseta)}</div>` + before.slice(before.indexOf(end));
  if (before !== after) await writeFile(target, after);
  report.push({ page, registar, changed: before !== after, rows: spisak.radovi.length, neizvesno: spisak.radovi.filter(r => r.potvrditi).length, cekaju: spisak.radovi.filter(r => r.slike === 0).length, pitanja: spisak.razjasni.length, ispravke: (spisak.ispravke || []).length, poseta: poseta ? poseta.participants.length : 0 });
}
console.log(JSON.stringify({ pages: report, source: 'same static and runtime renderer' }));
