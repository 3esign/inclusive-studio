// Jedno novo otvoreno pitanje na oba spiska: godište u broju indeksa koje odudara od
// generacije 2024. Nije greška po sebi — ali nije ni potvrđeno, pa se traži na času.
import { readFile, writeFile } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const read = async p => JSON.parse(await readFile(new URL(p, root), 'utf8'));
const write = (p, data) => writeFile(new URL(p, root), JSON.stringify(data, null, 1) + '\n');

const c3 = await read('data/cas-03/spisak.json');
for (const rb of [7, 26]) {
  const row = c3.radovi.find(r => r.rb === rb);
  if (!row) throw Error('treći čas: nema zapisa ' + rb);
  row.razjasni = 'godista-van-generacije';
}
c3.razjasni = [...c3.razjasni.filter(q => q.id !== 'godista-van-generacije'), {
  id: 'godista-van-generacije',
  sta: {
    sr: 'Zapisi 7 i 26 nose godište koje odudara od generacije 2024 — jedan je zapisan u formatu sa četvorocifrenim godištem, drugi sa godištem godinu ranije. Zapis 19 ima svoje pitanje. Nije greška po sebi, ali nije ni potvrđeno.',
    en: 'Entries 7 and 26 carry a year that differs from the 2024 cohort — one is written with a four-digit year, the other a year earlier. Entry 19 has its own question. Not an error in itself, but not confirmed either.',
  },
}];
await write('data/cas-03/spisak.json', c3);

const c4 = await read('data/cas-04/spisak.json');
const row = c4.radovi.find(r => r.rb === 24);
row.razjasni = 'godiste-zapis-24';
c4.razjasni = [...c4.razjasni, {
  id: 'godiste-zapis-24',
  sta: {
    sr: 'Zapis 24 nosi godište godinu posle generacije 2024. Nije greška po sebi, ali nije ni potvrđeno — potvrđuje se na času.',
    en: 'Entry 24 carries a year one after the 2024 cohort. Not an error in itself, but not confirmed either — it is confirmed in class.',
  },
}];
await write('data/cas-04/spisak.json', c4);
console.log(JSON.stringify({ pitanjaC3: c3.razjasni.length, pitanjaC4: c4.razjasni.length }));
