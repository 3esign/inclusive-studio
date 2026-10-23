// Jednokratna ispravka po nastavnikovom zapisu 23.10.2026 (treći zapis tog dana):
// (1) indeks zapisa 27 četvrtog časa je 28/24 — godište je 2024, kao kod cele generacije;
// (2) prezime autora zapisa 19 trećeg časa je „Vasić”; indeks ostaje kako je zapisan
//     18.10. i čeka potvrdu, jer njegovo godište odudara od generacije;
// (3) brojevi redova u ispravkama i opisima usklađeni sa spiskom posle razdvajanja
//     od 23.10. (pre razdvajanja su imena stajala jedan red niže).
import { readFile, writeFile } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const read = async p => JSON.parse(await readFile(new URL(p, root), 'utf8'));
const write = (p, data) => writeFile(new URL(p, root), JSON.stringify(data, null, 1) + '\n');

const IZVOR = 'teacher-2026-10-23-vasic-mijanovic';

// ---------------------------------------------------------------- treći čas
const c3 = await read('data/cas-03/spisak.json');
const r19 = c3.radovi.find(r => r.rb === 19);
if (!r19) throw Error('treći čas: nema zapisa 19');
r19.ime = 'Aleksa Vasić';
r19.razjasni = 'vasic-indeks';
r19.napomena = {
  sr: 'autorstvo zavedeno 23.10.2026. gledanjem fotografije; prezime je istog dana potvrđeno u ovom obliku; broj indeksa stoji kako je zapisan u spisku od 18.10. i čeka potvrdu — njegovo godište odudara od generacije 2024.',
  en: 'authorship filed on 23 October 2026 by looking at the photograph; the surname was confirmed that day in this form; the student number stands as recorded in the 18 October list and awaits confirmation — its year differs from the 2024 cohort.',
};
const r18 = c3.radovi.find(r => r.rb === 18);
r18.razjasni = 'hornjacek-indeks';
const r27 = c3.radovi.find(r => r.rb === 27);
r27.napomena = {
  sr: 'broj indeksa potvrđen 23.10.2026: godište je 2024, kao kod cele generacije; u spisku četvrtog časa bio je zapisan sa zamenjenim delovima.',
  en: 'the student number was confirmed on 23 October 2026: the year is 2024, as for the whole cohort; the fourth-class list had its parts swapped.',
};
c3.razjasni = [
  ...c3.razjasni.filter(q => q.id !== 'vasic-indeks' && q.id !== 'hornjacek-indeks'),
  {
    id: 'hornjacek-indeks',
    sta: {
      sr: 'Zapis 18: broj indeksa je u spisku četvrtog časa zapisan drukčije nego ovde, uz isto ime. Oba su objavljena kako su zapisana; tačan broj se potvrđuje na času.',
      en: 'Entry 18: the student number in the fourth-class list differs from the one here, beside the same name. Both are published as recorded; the correct number is confirmed in class.',
    },
  },
  {
    id: 'vasic-indeks',
    sta: {
      sr: 'Zapis 19: prezime je potvrđeno 23.10.2026, broj indeksa nije — stoji kako je zapisan 18.10, a njegovo godište odudara od generacije 2024. Čeka se potvrda broja.',
      en: 'Entry 19: the surname was confirmed on 23 October 2026, the student number was not — it stands as recorded on 18 October, and its year differs from the 2024 cohort. The number awaits confirmation.',
    },
  },
];
await write('data/cas-03/spisak.json', c3);

// -------------------------------------------------------------- četvrti čas
const c4 = await read('data/cas-04/spisak.json');
const m = c4.radovi.find(r => r.rb === 27);
if (m.indeks !== '24/28') throw Error('četvrti čas: zapis 27 nije u očekivanom stanju');
m.indeks = '28/24';
delete m.razjasni;
m.napomena = {
  sr: 'broj indeksa ispravljen 23.10.2026. po nastavnikovoj potvrdi: danas je zapisan sa zamenjenim delovima, godište je 2024 kao kod cele generacije.',
  en: 'the student number was corrected on 23 October 2026 on the teacher’s confirmation: today it was written with its parts swapped; the year is 2024, as for the whole cohort.',
};
const h = c4.radovi.find(r => r.rb === 8);
h.razjasni = 'indeks-hornjacek';
h.napomena = {
  sr: 'broj indeksa je danas zapisan drukčije nego u spisku trećeg časa, uz isto ime; tačan broj se potvrđuje na času.',
  en: 'the student number is recorded today differently from the third-class list, beside the same name; the correct number is confirmed in class.',
};
const k = c4.radovi.find(r => r.rb === 4);
k.razjasni = 'naziv-zapis-4';

c4.razjasni = [
  {
    id: 'indeks-hornjacek',
    sta: {
      sr: 'Zapis 8 nosi broj indeksa koji se razlikuje od onoga u spisku trećeg časa uz isto ime. Oba su objavljena onako kako su zapisana; tačan broj se potvrđuje na času.',
      en: 'Entry 8 carries a student number that differs from the third-class list beside the same name. Both are published exactly as recorded; the correct number is confirmed in class.',
    },
  },
  {
    id: 'naziv-zapis-4',
    sta: {
      sr: 'Zapis 4: rad je na ovom spisku zaveden kao „brza putanja”, a u galeriji radova stoji pod nazivom „putanja” — ispravkom od 23.10. taj naziv je ostao bez rada. Koji naziv ostaje: „putanja” ili „brza putanja”?',
      en: 'Entry 4: on this list the work stands as „brza putanja”, while the work register carries it as „putanja” — after the 23 October correction the former title is left without a work. Which title stays: „putanja” or „brza putanja”?',
    },
  },
  ...c4.razjasni.filter(q => q.id !== 'indeksi-hornjacek-mijanovic'),
  {
    id: 'fotografije-c03-u-arhivi',
    sta: {
      sr: 'Treći čas: u javnom registru stoji 42 od 86 fotografija koje spisak navodi. Ostatak je 20.10. arhiviran na arhivsko telo i nije u ovom repou; zapisi 1 i 2 trećeg časa zato još nemaju ni jednu objavljenu fotografiju ni zapis u galeriji radova.',
      en: 'The third class: the public register carries 42 of the 86 photographs the list states. The rest was archived to the archive body on 20 October and is not in this repository; entries 1 and 2 of the third class therefore still have no published photograph and no work-register record.',
    },
  },
];

const vasic = c4.ispravke.find(i => i.id === 'sanja-aleksa-vasic');
vasic.sta = {
  sr: 'Zatvoreno 23.10.2026: fotografija koja je stajala uz „2d lavirint” (treći čas) pripisana je autoru zapisa 19 spiska trećeg časa, koji nije na ovom spisku. Rad je vraćen u galeriju; prezime je potvrđeno, broj indeksa se potvrđuje na času.',
  en: 'Closed on 23 October 2026: the photograph that stood beside „2d lavirint” (third class) is attributed to the author of entry 19 of the third-class list, who is not on this list. The work is back in the gallery; the surname is confirmed, the student number is confirmed in class.',
};
c4.ispravke = [
  ...c4.ispravke.filter(i => i.id !== 'mijanovic-indeks'),
  {
    id: 'mijanovic-indeks',
    izvor: 'Nastavnik predmeta, 23.10.2026. (treći zapis tog dana)',
    sta: {
      sr: 'Broj indeksa zapisa 27 ovog spiska ispravljen je: danas je bio zapisan sa zamenjenim delovima, a godište je 2024, kao kod cele generacije. Spisak trećeg časa je uz isto ime od početka nosio tačan broj, pa je pitanje zatvoreno.',
      en: 'The student number of entry 27 of this list was corrected: today it was written with its parts swapped, while the year is 2024, as for the whole cohort. The third-class list carried the correct number beside the same name from the start, so the question is closed.',
    },
  },
];
await write('data/cas-04/spisak.json', c4);

// --------------------------------------------------------- registar radova
const reg = await read('data/prototipovi.json');
if (!reg.sources.some(s => s.id === IZVOR)) reg.sources.push({
  id: IZVOR,
  recordedOn: '2026-10-23',
  description: {
    sr: 'Treći zapis nastavnika od 23.10.2026: prezime autora zapisa 19 spiska trećeg časa je „Vasić”; broj indeksa ostaje kako je zapisan 18.10. i čeka potvrdu. Broj indeksa zapisa 27 četvrtog časa ispravljen je — godište je 2024.',
    en: 'The teacher’s third record of 23 October 2026: the surname of entry 19’s author in the third-class list is „Vasić”; the student number stands as recorded on 18 October and awaits confirmation. The student number of entry 27 of the fourth class was corrected — the year is 2024.',
  },
});
const item = reg.items.find(i => i.id === '19-2d-lavirint');
if (!item) throw Error('registar: nema 19-2d-lavirint');
const before = structuredClone(item);
item.author = { name: 'Aleksa Vasić', studentNumber: item.author.studentNumber };
item.attribution = { sourceId: IZVOR, fields: ['name', 'studentNumber'] };
item.description = {
  sr: 'Prototip sa trećeg časa (16.10.2026). Autorstvo zavedeno 23.10.2026. gledanjem fotografije: rad pripada autoru zapisa 19 spiska trećeg časa, kako spisak stoji posle razdvajanja fotografija istog dana. Prezime je potvrđeno u ovom obliku; broj indeksa stoji kako je zapisan 18.10. i čeka potvrdu na času.',
  en: 'Prototype from the third class (2026-10-16). Authorship filed on 23 October 2026 by looking at the photograph: the work belongs to the author of entry 19 of the third-class list, as the list stands after the same day’s separation of the photographs. The surname is confirmed in this form; the student number stands as recorded on 18 October and awaits confirmation in class.',
};
reg.revizije.push({
  v: Math.max(...reg.revizije.map(r => r.v)) + 1,
  datum: '2026-10-23',
  sta: {
    sr: 'Prezime autora ispravljeno po nastavnikovoj potvrdi istog dana; broj indeksa nije promenjen i izričito čeka potvrdu. Opis sada upućuje na red spiska kako stoji posle razdvajanja fotografija.',
    en: 'The author’s surname was corrected on the teacher’s confirmation the same day; the student number is unchanged and explicitly awaits confirmation. The description now points at the list row as it stands after the photographs were separated.',
  },
  sourceId: IZVOR,
  prototypeId: '19-2d-lavirint',
  before,
  after: structuredClone(item),
});
await write('data/prototipovi.json', reg);

console.log(JSON.stringify({
  c3red19: r19.ime, c4red27: m.indeks,
  pitanjaC3: c3.razjasni.length, pitanjaC4: c4.razjasni.length,
  revizija: reg.revizije.at(-1).v,
}));
