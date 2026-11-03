// Teacher correction, 21 October: this URL now presents galleries, not processing records.
// 23.10.2026: the third class keeps its own register (data/cas-03/spisak.json) even though
// the page shows galleries instead of rows — the corrections filed against it and the
// questions still open are printed here, by the same renderer the list pages use, so a
// question is never open on one surface and answered on another.
import { readFile, writeFile } from 'node:fs/promises';
import { setLanguage } from '../assets/core.js';
import { gallerySection } from '../assets/galleries.js';
import { renderIspravke, renderRazjasni, validateCas03 } from '../assets/cas03-core.js';
import { renderVisitRecord } from '../assets/poseta-core.js';

const root = new URL('../', import.meta.url); setLanguage('sr');
const json = async p => JSON.parse(await readFile(new URL(p, root), 'utf8'));
const data = await json('data/prototipovi-javno.json');
const visit = await json('data/poseta-w03.json');
const spisak = await json('data/cas-03/spisak.json');
const problems = validateCas03(spisak);
if (problems.length) throw Error('data/cas-03/spisak.json:\n' + problems.join('\n'));

const url = new URL('cas-03.html', root), before = await readFile(url, 'utf8');
const body = '<div id="class-galleries"><h1>Treći čas</h1><p><a href="#poseta-w03">Poseta udruženju ↓</a></p>'
  + gallerySection(data, 3) + renderVisitRecord(visit) + renderIspravke(spisak) + renderRazjasni(spisak) + '</div>';
const after = before.replace(/<main([^>]*)>[\s\S]*?<\/main>/, '<main$1>' + body + '</main>');
if (before !== after) await writeFile(url, after);
console.log(JSON.stringify({ changed: before !== after, galerije: (data.galleries || []).length, pitanja: spisak.razjasni.length, ispravke: (spisak.ispravke || []).length }));
