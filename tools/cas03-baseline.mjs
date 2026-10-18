// Stamp the static Serbian baseline of the third-class list page from the same renderer
// the browser uses. Shells remain owned by tools/shells.mjs; the register stays the only source.
import { readFile, writeFile } from 'node:fs/promises';
import { setLanguage } from '../assets/core.js';
import { renderCas03, validateCas03 } from '../assets/cas03-core.js';
import { validatePrototypes } from '../assets/prototipovi-core.js';
const root = new URL('../', import.meta.url);
const json = async p => JSON.parse(await readFile(new URL(p, root), 'utf8'));
const spisak = await json('data/cas-03/spisak.json');
const problems = validateCas03(spisak);
if (problems.length) throw Error(problems.join('\n'));
const prototypes = await json('data/prototipovi.json');
const registryProblems = validatePrototypes(prototypes);
if (registryProblems.length) throw Error(registryProblems.join('\n'));
setLanguage('sr');
const target = new URL('cas-03.html', root), before = await readFile(target, 'utf8');
const start = '<!-- cas03-content:start -->', end = '<!-- cas03-content:end -->';
if (before.split(start).length !== 2 || before.split(end).length !== 2) throw Error('Class-list baseline markers missing; nothing written.');
const after = before.slice(0, before.indexOf(start) + start.length) + `<div id="cas03-content">${renderCas03(spisak, prototypes)}</div>` + before.slice(before.indexOf(end));
if (before !== after) await writeFile(target, after);
console.log(JSON.stringify({ changed: before !== after, rows: spisak.radovi.length, neizvesno: spisak.radovi.filter(r => r.potvrditi).length, pitanja: spisak.razjasni.length, source: 'same static and runtime renderer' }));
