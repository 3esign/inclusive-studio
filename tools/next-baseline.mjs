// Writes only next-class main content. Shells remain owned by tools/shells.mjs.
import { readFile, writeFile } from 'node:fs/promises';
import { setLanguage } from '../assets/core.js';
import { weekFile } from '../assets/material.js';
import { resolveRefs } from '../assets/blocks.js';
import { nextClassEntry, renderNextClass } from '../assets/next-class.js';

if (process.argv.slice(2).some(arg => arg !== '--check')) throw Error('Only --check is supported.');
const check = process.argv.includes('--check'), root = new URL('../', import.meta.url);
const json = async p => JSON.parse(await readFile(new URL(p, root), 'utf8'));
const [tok, prototypes] = await Promise.all([json('data/tok.json'), json('data/prototipovi.json')]);
const entry = nextClassEntry(tok), week = entry ? await json(weekFile(entry.nedelja)) : null;
const refs = await resolveRefs(week?.blocks || []);
setLanguage('sr');
const html = renderNextClass({ tok, week, prototypes, refs });
const target = new URL('sledeci.html', root), before = await readFile(target, 'utf8');
const matches = [...before.matchAll(/<main\b[^>]*\bid="main"[^>]*>[\s\S]*?<\/main>/g)];
if (matches.length !== 1) throw Error('Expected one main region; nothing written.');
const region = matches[0][0], opening = region.slice(0, region.indexOf('>') + 1);
const after = before.replace(region, () => opening + html + '</main>');
if (check && before !== after) throw Error('Next-class baseline differs from its source. Run node tools/next-baseline.mjs.');
if (!check && before !== after) await writeFile(target, after);
console.log(JSON.stringify({ ok: true, mode: check ? 'check' : 'generate', nextWeek: entry?.nedelja ?? null, changed: !check && before !== after, source: 'shared next-class renderer' }));
