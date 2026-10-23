// 23.10.2026, drugi nalog nastavnika: fotografije zapisa 17–19 trećeg časa pripadaju
// imenima jedan red niže. Tri rada dobijaju tačnog autora, dva se vraćaju u galeriju,
// a jedno ime iz spiska ostaje bez zavedenog rada. Jednokratna ruka, zapis u registru.
import { readFile, writeFile } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const read = async p => JSON.parse(await readFile(new URL(p, root), 'utf8'));
const write = (p, v) => writeFile(new URL(p, root), JSON.stringify(v, null, 2) + '\n');
const clone = v => JSON.parse(JSON.stringify(v));

const SOURCE = 'teacher-2026-10-23-foto-razdvajanje';
const reg = await read('data/prototipovi.json');
if (!reg.sources.some(s => s.id === SOURCE)) reg.sources.push({
  id: SOURCE, recordedOn: '2026-10-23',
  description: {
    sr: 'Drugi zapis nastavnika od 23.10.2026, po gledanju sve tri sporne fotografije: pod zapisima 17–19 trećeg časa fotografije pripadaju imenu iz sledećeg reda spiska. „Putanja” je rad autorke zapisa 18, fotografija pod „brza putanja” je „3d lavirint” autorke zapisa 19, a fotografija uz „2d lavirint” je rad autora zapisa 20. Ime iz zapisa 17 ostaje bez zavedenog rada.',
    en: 'The teacher’s second record of 23 October 2026, after looking at all three disputed photographs: under entries 17–19 of the third class the photographs belong to the name in the next row of the list. „Putanja” is the work of entry 18’s author, the photograph under „brza putanja” is „3d lavirint” by entry 19’s author, and the photograph beside „2d lavirint” is the work of entry 20’s author. The name in entry 17 stays without a filed work.'
  }
});

const item = id => reg.items.find(i => i.id === id) || (() => { throw Error('Nema zapisa: ' + id); })();
let v = Math.max(...reg.revizije.map(r => r.v));
const revise = (id, sta, change) => {
  const target = item(id), before = clone(target);
  change(target);
  target.attribution = { sourceId: SOURCE, fields: ['name', 'studentNumber'] };
  reg.revizije.push({ v: ++v, datum: '2026-10-23', sta, sourceId: SOURCE, prototypeId: id, before, after: clone(target) });
};

revise('17-putanja', {
  sr: 'Fotografije ovog rada potvrđene su gledanjem: rad je autorke zapisa 18 spiska trećeg časa, kako je i ispravljeno ranije istog dana. Pripisivanje je sada potvrđeno izvorom, ne pretpostavkom.',
  en: 'This work’s photographs were confirmed by looking at them: the work belongs to the author of entry 18 of the third-class list, as corrected earlier the same day. The attribution now rests on a source, not an assumption.'
}, work => {
  work.description = {
    sr: 'Prototip sa trećeg časa (16.10.2026). Autorstvo ispravljeno i potvrđeno 23.10.2026. po nastavnikovom zapisu i gledanju fotografija.',
    en: 'Prototype from the third class (2026-10-16). Authorship corrected and confirmed on 23 October 2026 by the teacher’s record and by looking at the photographs.'
  };
  delete work.attributionStatus;
});

revise('18-brza-putanja', {
  sr: 'Naziv i autorstvo ispravljeni: fotografije pod „brza putanja” prikazuju „3d lavirint”, rad autorke zapisa 19 spiska trećeg časa odnosno zapisa 8 četvrtog časa. Rad se vraća u galeriju.',
  en: 'Title and authorship corrected: the photographs filed under „brza putanja” show „3d lavirint”, the work of entry 19 of the third-class list and entry 8 of the fourth. The work returns to the gallery.'
}, work => {
  work.title = '3d lavirint';
  work.author = { name: 'Sanja Hornjaček', studentNumber: '74/24' };
  work.description = {
    sr: 'Prototip sa trećeg časa (16.10.2026). Rad je 23.10.2026. zaveden pod tačnim nazivom „3d lavirint”; ranije je stajao kao „brza putanja” sa pogrešnim autorstvom. Putanje fotografija zadržavaju stari naziv foldera da otisci ostanu proverivi.',
    en: 'Prototype from the third class (2026-10-16). On 23 October 2026 the work was filed under its correct title „3d lavirint”; it earlier stood as „brza putanja” with the wrong authorship. The photograph paths keep the old folder name so the fingerprints stay verifiable.'
  };
  delete work.attributionStatus;
  for (const p of work.photos) {
    p.alt = { sr: 'Fotografija prototipa „3d lavirint”', en: 'Photograph of the “3d lavirint” prototype' };
  }
});

revise('19-2d-lavirint', {
  sr: 'Fotografija uz ovaj rad pripisana je autoru zapisa 20 spiska trećeg časa — jedinom imenu u nizu 17–20 koje je ostalo bez rada pre ove ispravke. Rad se vraća u galeriju.',
  en: 'The photograph beside this work is attributed to the author of entry 20 of the third-class list — the only name in the 17–20 run left without a work before this correction. The work returns to the gallery.'
}, work => {
  work.author = { name: 'Aleksa Vesić', studentNumber: '70/21' };
  work.description = {
    sr: 'Prototip sa trećeg časa (16.10.2026). Autorstvo zavedeno 23.10.2026: nastavnik je ime danas zapisao kao „Aleksa Vasić” bez indeksa; u spisku trećeg časa stoji „Aleksa Vesić, 70/21”. Objavljeno je kako stoji u spisku, pisanje prezimena potvrđuje se na času.',
    en: 'Prototype from the third class (2026-10-16). Authorship filed on 23 October 2026: today the teacher wrote the name as „Aleksa Vasić” without a student number; the third-class list carries „Aleksa Vesić, 70/21”. Published as the list has it; the spelling is confirmed in class.'
  };
  delete work.attributionStatus;
});
await write('data/prototipovi.json', reg);

// Spisak trećeg časa: imena 17–19 pomerena na rad iz istog reda, 20 ostaje ime bez rada.
const s3 = await read('data/cas-03/spisak.json');
const row = rb => s3.radovi.find(r => r.rb === rb);
Object.assign(row(17), { ime: 'Katarina Petrović', indeks: '79/24', rad: 'putanja', slike: 6 });
delete row(17).potvrditi; delete row(17).napomena; delete row(17).razjasni;
Object.assign(row(18), { ime: 'Sanja Hornjaček', indeks: '74/24', rad: '3d lavirint', slike: 4 });
delete row(18).potvrditi; delete row(18).razjasni;
row(18).napomena = {
  sr: 'naziv ispravljen 23.10.2026: zavedeno je bilo „brza putanja”, fotografije prikazuju „3d lavirint”; indeks je danas zapisan kao 74/24, ranije 84/24',
  en: 'title corrected on 23 October 2026: it was filed as „brza putanja”, the photographs show „3d lavirint”; the number is recorded today as 74/24, earlier 84/24'
};
Object.assign(row(19), { ime: 'Aleksa Vesić', indeks: '70/21', rad: '2d lavirint', slike: 2 });
delete row(19).potvrditi; delete row(19).razjasni;
row(19).napomena = {
  sr: 'autorstvo zavedeno 23.10.2026. gledanjem fotografije; nastavnik je danas prezime zapisao kao „Vasić”, bez indeksa',
  en: 'authorship filed on 23 October 2026 by looking at the photograph; today the teacher wrote the surname as „Vasić”, without a student number'
};
Object.assign(row(20), { ime: 'Lukić Miljana', indeks: '58/24', rad: null, slike: null, potvrditi: true, razjasni: 'miljana-bez-rada' });
row(20).napomena = {
  sr: 'ime je zavedeno na trećem času, ali nijedan niz fotografija nije njen: razdvajanje od 23.10.2026. pokazalo je da su fotografije zapisa 17–19 radovi imena iz sledećeg reda. Čeka se njen rad ili potvrda da nije slikan.',
  en: 'the name was recorded at the third class, but no photograph sequence is hers: the separation of 23 October 2026 showed that the photographs of entries 17–19 are the works of the name in the next row. Her work, or the confirmation that none was photographed, is awaited.'
};
s3.sigurno = { do: 19, od: 21 };
s3.razjasni = s3.razjasni.filter(q => !['zapisi-17-20', 'rb20-cekaj-studenta'].includes(q.id));
s3.razjasni.unshift({
  id: 'miljana-bez-rada',
  sta: {
    sr: 'Zapis 20: razdvajanje od 23.10.2026. vratilo je sva tri sporna niza fotografija tačnim autorima, pa je ovo ime ostalo bez zavedenog rada. Da li je rad donet, a nije slikan, ili ga tog časa nije bilo?',
    en: 'Entry 20: the separation of 23 October 2026 returned all three disputed photograph sequences to their right authors, so this name is left without a filed work. Was the work brought but not photographed, or was there none that class?'
  }
});
const bezNaziva = s3.razjasni.find(q => q.id === 'bez-naziva');
if (bezNaziva) bezNaziva.sta = {
  sr: 'Zapisi 1, 2 i 26 nemaju zabeležen naziv rada.',
  en: 'Entries 1, 2 and 26 carry no recorded work title.'
};
await write('data/cas-03/spisak.json', s3);

// Spisak četvrtog časa: pitanje o dve fotografije je zatvoreno, ispravke se dopunjuju.
const s4 = await read('data/cas-04/spisak.json');
s4.razjasni = s4.razjasni.filter(q => q.id !== 'podela-dve-slike-brza-putanja');
for (const r of s4.radovi) if (r.razjasni === 'podela-dve-slike-brza-putanja') delete r.razjasni;
const fix = id => s4.ispravke.find(f => f.id === id);
fix('brza-putanja-3d-lavirint').sta = {
  sr: 'Zatvoreno 23.10.2026: obe fotografije pod „brza putanja” prikazuju „3d lavirint”, rad iz zapisa 8 ovog spiska. Rad je u registru preimenovan i vraćen u galeriju; naziv „brza putanja” više ne stoji ni uz jedan rad.',
  en: 'Closed on 23 October 2026: both photographs under „brza putanja” show „3d lavirint”, the work of entry 8 of this list. In the register the work is renamed and returned to the gallery; the title „brza putanja” no longer stands beside any work.'
};
fix('sanja-aleksa-vasic').sta = {
  sr: 'Zatvoreno 23.10.2026: fotografija koja je stajala uz „2d lavirint” (treći čas) pripisana je autoru zapisa 20 spiska trećeg časa, koji nije na ovom spisku. Rad je vraćen u galeriju; pisanje prezimena i indeks potvrđuju se na času.',
  en: 'Closed on 23 October 2026: the photograph that stood beside „2d lavirint” (third class) is attributed to the author of entry 20 of the third-class list, who is not on this list. The work is back in the gallery; the surname spelling and the student number are confirmed in class.'
};
s4.ispravke.push({
  id: 'miljana-bez-rada-c03',
  izvor: 'Nastavnik predmeta, 23.10.2026.',
  sta: {
    sr: 'Posledica razdvajanja: ime iz zapisa 20 spiska trećeg časa ostalo je bez zavedenog rada, jer su sva tri niza fotografija pripisana imenima iz sledećih redova. Zapis se vodi otvoren u spisku trećeg časa.',
    en: 'A consequence of the separation: the name in entry 20 of the third-class list is left without a filed work, because all three photograph sequences went to the names in the following rows. The entry stays open in the third-class list.'
  }
});
await write('data/cas-04/spisak.json', s4);
console.log('razdvajanje upisano, revizije do v' + v);
