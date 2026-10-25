// Stamp the static Serbian baseline of the journal from the same renderer the browser
// uses. The manifest (data/dnevnik.json) names which registers are joined; the journal
// creates no record of its own.
// Run: node tools/dnevnik-baseline.mjs
import { readFile, writeFile } from 'node:fs/promises';
import { setLanguage } from '../assets/core.js';
import { buildJournal, renderDnevnik } from '../assets/dnevnik-core.js';
import { validateCas03 } from '../assets/cas03-core.js';
import { validateVisit } from '../assets/poseta-core.js';
import { validatePrototypes } from '../assets/prototipovi-core.js';

const root = new URL('../', import.meta.url);
const json = async p => JSON.parse(await readFile(new URL(p, root), 'utf8'));
const manifest = await json('data/dnevnik.json');

const lists = [];
for (const entry of manifest.lists) {
  const list = await json(entry.file);
  const problems = validateCas03(list);
  if (problems.length) throw Error(entry.file + ':\n' + problems.join('\n'));
  lists.push(Object.assign(list, { page: entry.page, nedelja: entry.nedelja, kotva: entry.kotva || '' }));
}
const visits = [];
for (const entry of manifest.visits) {
  const visit = await json(entry.file);
  const problems = validateVisit(visit);
  if (problems.length) throw Error(entry.file + ':\n' + problems.join('\n'));
  visits.push(Object.assign(visit, { page: entry.page }));
}
// The public excerpt, so the stamped page and the live page join the same records.
const prototypes = await json('data/prototipovi-javno.json');
const registryProblems = validatePrototypes(prototypes);
if (registryProblems.length) throw Error('data/prototipovi.json:\n' + registryProblems.join('\n'));

setLanguage('sr');
const people = buildJournal({ lists, visits, prototypes });
const target = new URL('dnevnik.html', root), before = await readFile(target, 'utf8');
const start = '<!-- dnevnik:start -->', end = '<!-- dnevnik:end -->';
if (before.split(start).length !== 2 || before.split(end).length !== 2) throw Error('Journal markers missing; nothing written.');
const after = before.slice(0, before.indexOf(start) + start.length)
  + `<div id="dnevnik-content">${renderDnevnik(people, { weeks: manifest.weeks })}</div>`
  + before.slice(before.indexOf(end));
if (before !== after) await writeFile(target, after);
console.log(JSON.stringify({ changed: before !== after, osoba: people.length, bezIndeksa: people.filter(p => !p.studentNumber).length, sukobaBroja: people.filter(p => p.problems.length).length }));
