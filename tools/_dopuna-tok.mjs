// Upis dopune od 23.10.2026 u tok predmeta i u gradivo nedelje 4:
// poseta udruženju istog dana (17 zavedenih imena) i zatvorena pitanja.
import { readFile, writeFile } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const read = async p => JSON.parse(await readFile(new URL(p, root), 'utf8'));
const write = (p, data) => writeFile(new URL(p, root), JSON.stringify(data, null, p.includes('material') ? 2 : 1) + '\n');

const IZVOR = 'Nastavnik predmeta, 23.10.2026. (dopuna uz spisak četvrtog časa); data/poseta-2026-10-23.json; data/cas-04/spisak.json.';

const tok = await read('data/tok.json');
const w04 = tok.odrzano.find(item => item.id === 'cas-w04');
if (!w04) throw Error('Nema cas-w04 u toku.');

const novi = [
  { sta: {
      sr: 'Poseta udruženju je zavedena kao zaseban registar istog dana: sedamnaest studenata, redom kojim ih je nastavnik zapisao. Šesnaest imena stoji i u spisku radova; jedno ne stoji — to je osamnaesto zavedeno prisustvo tog dana, bez zavedenog rada.',
      en: 'The association visit is filed as its own register of the same day: seventeen students, in the order the teacher wrote them. Sixteen names also stand in the list of works; one does not — that is the eighteenth recorded attendance of the day, without a filed work.' },
    izvor: IZVOR },
  { sta: {
      sr: 'Pet pitanja koja su stajala otvorena zatvorena su istog dana: naziv rada zapisa 4, broj indeksa zapisa 8, godišta van generacije 2024, „starlight 6 + 3” kao dva rada istog autora i autorstvo rada „kubismo”. Naziv „brza putanja” uslovno je pripisan imenu zapisa 20 trećeg časa i i dalje čeka potvrdu studentkinje.',
      en: 'Five questions that stood open were closed the same day: the title of entry 4, the student number of entry 8, the years outside the 2024 cohort, „starlight 6 + 3” as two works by the same author, and the authorship of „kubismo”. The title „brza putanja” is provisionally attributed to the name in entry 20 of the third class and still awaits the student’s confirmation.' },
    izvor: IZVOR },
  { sta: {
      sr: 'Zapisano kao granica evidencije: prisustvo na predavanju do sada nije vođeno. Spiskovi časova zavode one koji su se pojavili u spisku radova i na poseti — ko je bio na času a nije zaveden, iz njih se ne vidi.',
      en: 'Recorded as a limit of the record: attendance at the lecture has not been kept so far. The class lists record those who appeared in the list of works and on the visit — whoever was in class without being recorded is not visible in them.' },
    izvor: 'Nastavnik predmeta, 23.10.2026.: „evidenciju prisustva na samom predavanju do sad nisam vodio”.' },
];
for (const r of novi) if (!w04.rezultati.some(x => x.sta.sr === r.sta.sr)) w04.rezultati.push(r);
await write('data/tok.json', tok);

const mat = await read('data/material/w04.json');
const stavke = [
  { sr: 'Poseta udruženju istog dana: sedamnaest zavedenih imena u zasebnom registru; jedno ime je na poseti a nije u spisku radova.',
    en: 'The association visit the same day: seventeen names recorded in a separate register; one name is on the visit but not in the list of works.' },
  { sr: 'Pet otvorenih pitanja zatvoreno je uz izvor; „brza putanja” je uslovno pripisana i čeka potvrdu studentkinje.',
    en: 'Five open questions were closed with their source; „brza putanja” is provisionally attributed and awaits the student’s confirmation.' },
  { sr: 'Granica evidencije: prisustvo na predavanju do sada nije vođeno, pa se „bio a nije zaveden” iz spiskova ne vidi.',
    en: 'A limit of the record: attendance at the lecture has not been kept, so „present but not recorded” is not visible from the lists.' },
];
const lista = mat.blocks.find(b => b.kind === 'list');
for (const s of stavke) if (!lista.items.some(x => x.sr === s.sr)) lista.items.push(s);
mat.updated = '2026-10-23';
mat.revizije.push({
  v: mat.revizije.length + 1,
  datum: '2026-10-23',
  izvor: 'Nastavnik predmeta, 23.10.2026. (dopuna uveče).',
  sta: {
    sr: 'Dopuna zapisa četvrtog časa: spisak sa posete udruženju zaveden je kao zaseban registar, pet otvorenih pitanja je zatvoreno, a nevođena evidencija prisustva na predavanju upisana je kao granica evidencije, ne kao propust koji se krije.',
    en: 'An addition to the record of the fourth class: the association-visit list is filed as its own register, five open questions are closed, and the fact that lecture attendance has not been kept is written down as a limit of the record, not a gap to be hidden.',
  },
});
await write('data/material/w04.json', mat);
console.log(JSON.stringify({ rezultati: w04.rezultati.length, stavki: lista.items.length, revizija: mat.revizije.length }));
