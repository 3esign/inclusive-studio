// Stamp the static Serbian baseline of the visit page from the same renderer the browser
// uses. Shells remain owned by tools/shells.mjs; the registres stay the only source.
import { readFile, writeFile } from 'node:fs/promises';
import { setLanguage } from '../assets/core.js';
import { renderPoseta, validateVisit } from '../assets/poseta-core.js';
import { validatePrototypes } from '../assets/prototipovi-core.js';
const root = new URL('../', import.meta.url);
const json = async p => JSON.parse(await readFile(new URL(p, root), 'utf8'));
const visit = await json('data/poseta.json');
const problems = validateVisit(visit);
if (problems.length) throw Error(problems.join('\n'));
const prototypes = await json('data/prototipovi.json');
const registryProblems = validatePrototypes(prototypes);
if (registryProblems.length) throw Error(registryProblems.join('\n'));
setLanguage('sr');
const target = new URL('poseta.html', root), before = await readFile(target, 'utf8');
const start = '<!-- poseta-content:start -->', end = '<!-- poseta-content:end -->';
if (before.split(start).length !== 2 || before.split(end).length !== 2) throw Error('Visit baseline markers missing; nothing written.');
const after = before.slice(0, before.indexOf(start) + start.length) + `<div id="visit-content">${renderPoseta(visit, prototypes)}</div>` + before.slice(before.indexOf(end));
if (before !== after) await writeFile(target, after);
console.log(JSON.stringify({ changed: before !== after, participants: visit.participants.length, findings: 6, source: 'same static and runtime renderer' }));
