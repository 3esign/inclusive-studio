// Dopuna uz _dopuna-2026-10-23.mjs: redovi koji su upućivali na zatvorena pitanja.
import { readFile, writeFile } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const read = async p => JSON.parse(await readFile(new URL(p, root), 'utf8'));
const write = (p, data) => writeFile(new URL(p, root), JSON.stringify(data, null, 1) + '\n');

const c03 = await read('data/cas-03/spisak.json');
const ids = new Set(c03.razjasni.map(q => q.id));
for (const row of c03.radovi) {
  if (row.razjasni && !ids.has(row.razjasni)) {
    console.log('otvoreno -> zatvoreno:', row.rb, row.razjasni);
    delete row.razjasni;
    if (row.rb === 7) row.napomena = {
      sr: 'nastavnik je 23.10.2026. potvrdio da je isti autor doneo dva prototipa — „hansgadget” i „starlight”; niz od devet fotografija deli se na dva rada, a razdvajanje čeka prenos fotografija. Godište van generacije 2024 potvrđeno je kao ispravno.',
      en: 'on 23 October 2026 the teacher confirmed that the same author brought two prototypes — „hansgadget” and „starlight”; the sequence of nine photographs splits between two works, and the split waits for the photographs to be transferred. The year outside the 2024 cohort is confirmed as correct.',
    };
    else row.napomena = {
      sr: 'godište van generacije 2024 potvrđeno je 23.10.2026. kao ispravno — predmet slušaju i studenti koji nisu položili godinu',
      en: 'the year outside the 2024 cohort was confirmed as correct on 23 October 2026 — the course is also attended by students who have not passed the year',
    };
  }
}
await write('data/cas-03/spisak.json', c03);

const c04 = await read('data/cas-04/spisak.json');
const ids4 = new Set(c04.razjasni.map(q => q.id));
for (const row of c04.radovi) if (row.razjasni && !ids4.has(row.razjasni)) { console.log('c04 otvoreno -> zatvoreno:', row.rb, row.razjasni); delete row.razjasni; }
await write('data/cas-04/spisak.json', c04);
console.log('ok');
