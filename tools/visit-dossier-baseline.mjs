// Stamp the static Serbian baseline of a visit dossier page from the same renderer the
// browser uses. The page names its own register; this tool reads that attribute, so a new
// visit is a new register plus a shell — never a second copy of the renderer.
// Run: node tools/visit-dossier-baseline.mjs poseta-w04.html
import { readFile, writeFile } from 'node:fs/promises';
import { setLanguage } from '../assets/core.js';
import { renderVisitDossier } from '../assets/visit-dossier.js';
import { validateVisit } from '../assets/poseta-core.js';
import { validatePrototypes } from '../assets/prototipovi-core.js';

const root = new URL('../', import.meta.url);
const json = async p => JSON.parse(await readFile(new URL(p, root), 'utf8'));
const page = process.argv[2] || 'poseta-w04.html';
const target = new URL(page, root);
const before = await readFile(target, 'utf8');
const register = before.match(/data-visit="([^"]+)"/)?.[1];
if (!register) throw Error(`${page} does not name its visit register in data-visit.`);

const visit = await json(register);
const problems = validateVisit(visit);
if (problems.length) throw Error(register + ':\n' + problems.join('\n'));
const prototypes = await json('data/prototipovi.json');
const registryProblems = validatePrototypes(prototypes);
if (registryProblems.length) throw Error('data/prototipovi.json:\n' + registryProblems.join('\n'));

setLanguage('sr');
const start = '<!-- visit-dossier:start -->', end = '<!-- visit-dossier:end -->';
if (before.split(start).length !== 2 || before.split(end).length !== 2) throw Error('Visit dossier markers missing; nothing written.');
const after = before.slice(0, before.indexOf(start) + start.length)
  + `<div id="visit-dossier">${renderVisitDossier(visit, prototypes)}</div>`
  + before.slice(before.indexOf(end));
if (before !== after) await writeFile(target, after);
const bound = new Set(visit.photos.flatMap(p => p.radovi || []));
console.log(JSON.stringify({ page, changed: before !== after, kadrova: visit.photos.length, radova: bound.size, nalaza: (visit.findings || []).length }));
