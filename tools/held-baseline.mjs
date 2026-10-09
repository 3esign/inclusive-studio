// Regenerate only the held landing's content from the same renderer used in the browser.
// Shells remain owned by tools/shells.mjs. No private sources or new claims are imported.
import { readFile, writeFile } from 'node:fs/promises';
import { setLanguage } from '../assets/core.js';
import { heldIntro, heldSection } from '../assets/held-record.js';
import { validateTok } from '../assets/tok-core.js';
import { validateWeek } from '../assets/material.js';
const root = new URL('../', import.meta.url);
const json = async p => JSON.parse(await readFile(new URL(p, root), 'utf8'));
const tok = await json('data/tok.json');
const errors = validateTok(tok);
if (errors.length) throw Error(errors.join('\n'));
const weeks = new Map();
for (const item of tok.odrzano) {
  if (!Number.isInteger(item.nedelja) || weeks.has(item.nedelja)) continue;
  const w = await json(`data/material/w${String(item.nedelja).padStart(2, '0')}.json`);
  const check = validateWeek(w); if (!check.ok) throw Error(check.problems.join('\n'));
  weeks.set(item.nedelja, w);
}
setLanguage('sr');
const target = new URL('index.html', root), before = await readFile(target, 'utf8');
const top = /<!-- held-intro:start -->[\s\S]*?<!-- held-intro:end -->/;
const body = /<section id="odrzano"[\s\S]*?<\/section>/;
if (!top.test(before) || !body.test(before)) throw Error('Held baseline markers missing; nothing written.');
const after = before.replace(top, `<!-- held-intro:start --><div id="held-intro">${heldIntro()}</div><!-- held-intro:end -->`).replace(body, heldSection(tok, weeks));
if (before !== after) await writeFile(target, after);
console.log(JSON.stringify({ changed: before !== after, held: tok.odrzano.length, source: 'same static and runtime renderer' }));
