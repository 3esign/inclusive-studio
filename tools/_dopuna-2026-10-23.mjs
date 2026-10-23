// Četvrti nastavnikov zapis od 23.10.2026 (dopuna uz spisak četvrtog časa).
// Zatvara pitanja koja su do sada stajala otvorena, dodaje naziv radu koji je ostao bez
// njega i zavodi spisak sa posete udruženju istog dana. Ništa se ne briše: svaka izmena
// ide kroz reviziju sa before/after ili kroz zapis u „ispravke”.
//
// Izvor (Semir Poturak, nastavnik predmeta, 23.10.2026, poruka uveče):
//  - „putanja je Katarina Petrovic” → zapis 4 četvrtog časa nosi naziv „putanja”.
//  - „brza putanja ne znam ciji je verovatno Miljane Lukic … samo da proverimo” →
//    naziv „brza putanja” uslovno se pripisuje imenu zapisa 20 trećeg časa; čeka potvrdu.
//  - „3D lavirint … pripisati Sanji i 2D Aleksi” → potvrda zatečenog stanja u registru.
//  - „ne znam za indeks ostavi kao sto je bilo prvobitno za Sanju” → 84/24, kako je
//    zapisano 18.10; razlika iz spiska od 23.10 (74/24) se povlači.
//  - „ok je da je generacija 21 ima onih koji nisu jos polozili godinu” → godište van
//    generacije 2024 nije greška; pitanja o godištima se zatvaraju.
//  - „starlight je drugi projekat istog studenta … jedan student koji je doneo 2
//    prototipa” → „starlight 6 + 3” su dva rada istog autora.
//  - „kubismo/lego4all zna se ko je” → autorstvo nije sporno; ostaje samo naziv.
//  - „evidenciju prisustva na samom predavanju do sad nisam vodio” → spisak časa je
//    spisak radova i zavedenih prisustava, ne prozivka.
//  - spisak sa posete udruženju 23.10.2026 (17 imena).
import { readFile, writeFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const read = async p => JSON.parse(await readFile(new URL(p, root), 'utf8'));
const write = (p, data) => writeFile(new URL(p, root), JSON.stringify(data, null, 1) + '\n');
const clone = v => JSON.parse(JSON.stringify(v));

const IZVOR_ID = 'teacher-2026-10-23-dopuna';
const IZVOR_TXT = 'Nastavnik predmeta, 23.10.2026. (dopuna uz spisak četvrtog časa).';

/* ---------- 1. registar radova ---------- */

const reg = await read('data/prototipovi.json');

if (!reg.sources.some(s => s.id === IZVOR_ID)) reg.sources.push({
  id: IZVOR_ID,
  recordedOn: '2026-10-23',
  description: {
    sr: 'Četvrti zapis nastavnika od 23.10.2026: rad autorke zapisa 4 četvrtog časa zove se „putanja”; naziv „brza putanja” uslovno pripada imenu zapisa 20 trećeg časa i čeka potvrdu; „3d lavirint” i „2d lavirint” potvrđeni su autorima kod kojih stoje. Broj indeksa autorke „3d lavirinta” vraća se na onaj zapisan 18.10, jer razlika nije bila prijavljena kao greška. Godište van generacije 2024 nije greška — ima studenata koji nisu položili godinu. „starlight 6 + 3” su dva rada istog autora. Evidencija prisustva na predavanju do sada nije vođena.',
    en: 'The teacher’s fourth record of 23 October 2026: the work of entry 4 of the fourth class is titled „putanja”; the title „brza putanja” provisionally belongs to the name in entry 20 of the third class and awaits confirmation; „3d lavirint” and „2d lavirint” are confirmed with the authors they stand beside. The student number of the author of „3d lavirint” returns to the one recorded on 18 October, because the difference was not reported as an error. A year outside the 2024 cohort is not an error — some students have not passed the year. „starlight 6 + 3” are two works by the same author. Attendance at the lecture has not been kept so far.',
  },
});

const item = id => reg.items.find(i => i.id === id);
const revise = (id, sta, mutate) => {
  const target = item(id);
  if (!target) throw Error('Nema rada ' + id);
  const before = clone(target);
  mutate(target);
  reg.revizije.push({
    v: reg.revizije.length + 1,
    datum: '2026-10-23',
    sta,
    sourceId: IZVOR_ID,
    prototypeId: id,
    before,
    after: clone(target),
  });
};

revise('18-brza-putanja', {
  sr: 'Broj indeksa autorke vraćen je na onaj iz spiska od 18.10.2026. Razlika zapisana 23.10. nije bila prijavljena kao greška — autorka je prijavila pogrešno pripisanu fotografiju, ne broj indeksa. Pitanje o broju se zatvara.',
  en: 'The author’s student number is returned to the one from the list of 18 October 2026. The difference recorded on 23 October was not reported as an error — the author reported a wrongly attributed photograph, not her student number. The question about the number is closed.',
}, work => {
  work.author.studentNumber = '84/24';
  work.attribution.sourceId = IZVOR_ID;
  work.description = {
    sr: 'Prototip sa trećeg časa (16.10.2026). Rad je 23.10.2026. zaveden pod tačnim nazivom „3d lavirint”; ranije je stajao kao „brza putanja” sa pogrešnim autorstvom. Autorstvo i broj indeksa potvrđeni su istog dana. Putanje fotografija zadržavaju stari naziv foldera da otisci ostanu proverivi.',
    en: 'Prototype from the third class (2026-10-16). On 23 October 2026 the work was filed under its correct title „3d lavirint”; it earlier stood as „brza putanja” with the wrong authorship. The authorship and the student number were confirmed the same day. The photograph paths keep the old folder name so the fingerprints stay verifiable.',
  };
});

revise('19-2d-lavirint', {
  sr: 'Broj indeksa potvrđen: godište 2021 nije greška, jer ima studenata koji slušaju predmet a nisu položili godinu. Zapis više ne stoji kao nepotvrđen.',
  en: 'The student number is confirmed: the year 2021 is not an error, because some students attend the course without having passed the year. The record no longer stands as unconfirmed.',
}, work => {
  work.attribution.sourceId = IZVOR_ID;
  work.description = {
    sr: 'Prototip sa trećeg časa (16.10.2026). Autorstvo zavedeno 23.10.2026. gledanjem fotografije: rad pripada autoru zapisa 19 spiska trećeg časa. Prezime i broj indeksa potvrđeni su istog dana; godište van generacije 2024 nije greška.',
    en: 'Prototype from the third class (2026-10-16). Authorship filed on 23 October 2026 by looking at the photograph: the work belongs to the author of entry 19 of the third-class list. The surname and the student number were confirmed the same day; a year outside the 2024 cohort is not an error.',
  };
});

revise('07-hansgadget-starlight', {
  sr: 'Zapis „starlight 6 + 3” sa trećeg časa objašnjen je 23.10.2026: to su dva rada istog autora, a ne jedan rad sa devet fotografija. Ovaj zapis nosi prvi od njih; drugi se zavodi kad mu fotografije budu razdvojene.',
  en: 'The „starlight 6 + 3” entry from the third class was explained on 23 October 2026: these are two works by the same author, not one work with nine photographs. This record carries the first of them; the second is filed when its photographs are separated.',
}, work => {
  work.description = {
    sr: 'Prototip sa trećeg časa (16.10.2026), zapis nastavnika. Nastavnik je 23.10.2026. potvrdio da je isti autor doneo dva prototipa: „hansgadget” i „starlight”. Niz od devet fotografija deli se na dva rada; razdvajanje čeka prenos fotografija.',
    en: 'Prototype from the third class (2026-10-16), the teacher’s record. On 23 October 2026 the teacher confirmed that the same author brought two prototypes: „hansgadget” and „starlight”. The sequence of nine photographs splits between two works; the separation waits for the photographs to be transferred.',
  };
});

await write('data/prototipovi.json', reg);

/* ---------- 2. spisak trećeg časa ---------- */

const c03 = await read('data/cas-03/spisak.json');
const red03 = rb => c03.radovi.find(r => r.rb === rb);

const r18 = red03(18);
r18.indeks = '84/24';
delete r18.razjasni;
r18.napomena = {
  sr: 'naziv ispravljen 23.10.2026: zavedeno je bilo „brza putanja”, fotografije prikazuju „3d lavirint”; broj indeksa je istog dana potvrđen onakav kakav stoji ovde — razlika iz spiska četvrtog časa (74/24) se povlači',
  en: 'title corrected on 23 October 2026: it was filed as „brza putanja”, the photographs show „3d lavirint”; the student number was confirmed that day as it stands here — the difference from the fourth-class list (74/24) is withdrawn',
};

const r19 = red03(19);
delete r19.razjasni;
r19.napomena = {
  sr: 'autorstvo zavedeno 23.10.2026. gledanjem fotografije; prezime i broj indeksa potvrđeni su istog dana — godište van generacije 2024 nije greška',
  en: 'authorship filed on 23 October 2026 by looking at the photograph; the surname and the student number were confirmed the same day — a year outside the 2024 cohort is not an error',
};

const r20 = red03(20);
r20.rad = 'brza putanja';
r20.slike = 0;
r20.razjasni = 'miljana-brza-putanja';
r20.napomena = {
  sr: 'posle razdvajanja fotografija 23.10.2026. ovo ime je ostalo bez rada, a naziv „brza putanja” bez autora. Nastavnik ih je istog dana spojio kao najverovatnije rešenje — rad je zaveden, fotografija nema, i potvrda se traži od studentkinje',
  en: 'after the photographs were separated on 23 October 2026 this name was left without a work, and the title „brza putanja” without an author. The teacher joined them the same day as the most likely answer — the work is filed, there is no photograph, and the student’s confirmation is sought',
};

c03.razjasni = c03.razjasni.filter(q => !['miljana-bez-rada', 'starlight-6-i-3', 'hornjacek-indeks', 'vasic-indeks', 'godista-van-generacije'].includes(q.id));
c03.razjasni.unshift({
  id: 'miljana-brza-putanja',
  sta: {
    sr: 'Zapis 20: rad „brza putanja” pripisan je ovom imenu 23.10.2026, kao najverovatnije rešenje posle razdvajanja fotografija — nijedan drugi zapis nije ostao bez autora. Fotografija nema. Potvrdi: je li to tvoj rad i da li je bio donet na čas?',
    en: 'Entry 20: the work „brza putanja” was attributed to this name on 23 October 2026, as the most likely answer after the photographs were separated — no other entry was left without an author. There is no photograph. Please confirm: is this your work, and was it brought to the class?',
  },
});
c03.razjasni.push({
  id: 'kubismo-ili-lego4all',
  sta: {
    sr: 'Autorka zapisa 13 je poznata i nije sporna; otvoren je samo naziv. U ovom spisku rad se zove „kubismo”, a tehnički crtež u galeriji stoji kao „Lego4ll”. Koji naziv ostaje, ili su to dva rada?',
    en: 'The author of entry 13 is known and not in question; only the title is open. In this list the work is called „kubismo”, while the technical drawing in the gallery stands as „Lego4ll”. Which title remains, or are these two works?',
  },
});
c03.razjasni = c03.razjasni.filter((q, i, all) => all.findIndex(o => o.id === q.id) === i);

c03.ispravke = [
  {
    id: 'c03-naziv-brza-putanja',
    izvor: IZVOR_TXT,
    sta: {
      sr: 'Naziv „brza putanja” vraćen je u spisak: posle razdvajanja fotografija 23.10. ostao je bez rada, a zapis 20 bez naziva. Nastavnik ih je spojio kao najverovatnije rešenje, bez fotografije i uz izričitu molbu za potvrdu.',
      en: 'The title „brza putanja” is back in the list: after the photographs were separated on 23 October it was left without a work, and entry 20 without a title. The teacher joined them as the most likely answer, without a photograph and with an explicit request for confirmation.',
    },
  },
  {
    id: 'c03-indeks-18-vracen',
    izvor: IZVOR_TXT,
    sta: {
      sr: 'Zapis 18: broj indeksa vraćen je na onaj zapisan 18.10. Razlika upisana 23.10. povlači se — autorka je prijavila pogrešno pripisanu fotografiju, ne broj indeksa. Pitanje je zatvoreno.',
      en: 'Entry 18: the student number is returned to the one recorded on 18 October. The difference written on 23 October is withdrawn — the author reported a wrongly attributed photograph, not her student number. The question is closed.',
    },
  },
  {
    id: 'c03-godista-potvrdjena',
    izvor: IZVOR_TXT,
    sta: {
      sr: 'Godišta van generacije 2024 (zapisi 7, 19 i 26) potvrđena su kao ispravna: predmet slušaju i studenti koji nisu položili godinu. Tri pitanja o godištima su zatvorena.',
      en: 'The years outside the 2024 cohort (entries 7, 19 and 26) are confirmed as correct: the course is also attended by students who have not passed the year. Three questions about years are closed.',
    },
  },
  {
    id: 'c03-starlight-dva-rada',
    izvor: IZVOR_TXT,
    sta: {
      sr: '„starlight 6 + 3” su dva rada istog autora, ne jedan rad sa devet fotografija. Pitanje je zatvoreno; razdvajanje fotografija po radovima čeka njihov prenos.',
      en: '„starlight 6 + 3” are two works by the same author, not one work with nine photographs. The question is closed; splitting the photographs between the works waits for them to be transferred.',
    },
  },
  {
    id: 'c03-prisustvo-nije-prozivka',
    izvor: IZVOR_TXT,
    sta: {
      sr: 'Evidencija prisustva na predavanju do sada nije vođena. Ovaj spisak je spisak radova i zavedenih prisustava redom slikanja — iz njega se ne može izvesti ko je bio, a nije zaveden.',
      en: 'Attendance at the lecture has not been kept so far. This list is a list of works and recorded attendances in shooting order — who was present but not recorded cannot be derived from it.',
    },
  },
];

await write('data/cas-03/spisak.json', c03);

/* ---------- 3. spisak četvrtog časa ---------- */

const c04 = await read('data/cas-04/spisak.json');
const red04 = rb => c04.radovi.find(r => r.rb === rb);

const q4 = red04(4);
q4.rad = 'putanja';
delete q4.razjasni;
q4.napomena = {
  sr: 'naziv potvrđen 23.10.2026: rad se zove „putanja”; „brza putanja” je naziv drugog rada, sa spiska trećeg časa',
  en: 'title confirmed on 23 October 2026: the work is called „putanja”; „brza putanja” is another work’s title, from the third-class list',
};

const q8 = red04(8);
q8.indeks = '84/24';
delete q8.razjasni;
q8.napomena = {
  sr: 'broj indeksa ispravljen 23.10.2026: važi onaj iz spiska trećeg časa; danas je zapisan sa zamenjenim ciframa',
  en: 'student number corrected on 23 October 2026: the one from the third-class list holds; today it was written with the digits swapped',
};

const q24 = red04(24);
delete q24.razjasni;
q24.napomena = {
  sr: 'godište van generacije 2024 potvrđeno je 23.10.2026. kao ispravno — predmet slušaju i studenti koji nisu položili godinu',
  en: 'the year outside the 2024 cohort was confirmed as correct on 23 October 2026 — the course is also attended by students who have not passed the year',
};

c04.razjasni = c04.razjasni.filter(q => !['naziv-zapis-4', 'indeks-hornjacek', 'godiste-zapis-24'].includes(q.id));
c04.razjasni.push({
  id: 'copic-van-spiska',
  sta: {
    sr: 'Na spisku posete udruženju stoji jedno ime koje nije na ovom spisku radova — osamnaesto prisustvo tog dana, bez zavedenog rada. Prisustvo je zavedeno u registru posete; rad se čeka.',
    en: 'The association-visit list carries one name that is not on this list of works — an eighteenth attendance that day, without a filed work. The attendance is recorded in the visit register; the work is awaited.',
  },
});
c04.razjasni.push({
  id: 'prisustvo-nije-prozivka',
  sta: {
    sr: 'Evidencija prisustva na predavanju do sada nije vođena. Ovaj spisak zavodi one koji su se pojavili u spisku radova i na poseti; ko je bio na času a nije zaveden, iz njega se ne vidi. Ako nedostaješ, javi na času.',
    en: 'Attendance at the lecture has not been kept so far. This list records those who appeared in the list of works and on the visit; whoever was in class without being recorded is not visible here. If you are missing, say so in class.',
  },
});

c04.ispravke = c04.ispravke.filter(f => f.id !== 'mijanovic-indeks').concat(c04.ispravke.filter(f => f.id === 'mijanovic-indeks'));
c04.ispravke.push(
  {
    id: 'c04-naziv-putanja',
    izvor: IZVOR_TXT,
    sta: {
      sr: 'Zatvoreno: rad zapisa 4 zove se „putanja”. Naziv „brza putanja” pripada drugom radu — zapisu 20 spiska trećeg časa, uslovno i uz traženu potvrdu.',
      en: 'Closed: the work of entry 4 is called „putanja”. The title „brza putanja” belongs to another work — entry 20 of the third-class list, provisionally and with confirmation requested.',
    },
  },
  {
    id: 'c04-indeks-zapis-8',
    izvor: IZVOR_TXT,
    sta: {
      sr: 'Zatvoreno: broj indeksa zapisa 8 je onaj iz spiska trećeg časa. Razlika zapisana danas bila je greška u prepisu, ne prijava studentkinje.',
      en: 'Closed: the student number of entry 8 is the one from the third-class list. The difference written today was a transcription slip, not a report by the student.',
    },
  },
  {
    id: 'c04-godista-potvrdjena',
    izvor: IZVOR_TXT,
    sta: {
      sr: 'Zatvoreno: godište koje odudara od generacije 2024 nije greška. Predmet slušaju i studenti koji nisu položili godinu, pa takav broj indeksa ostaje kako je zapisan.',
      en: 'Closed: a year that differs from the 2024 cohort is not an error. The course is also attended by students who have not passed the year, so such a student number stands as recorded.',
    },
  },
  {
    id: 'c04-poseta-spisak',
    izvor: IZVOR_TXT,
    sta: {
      sr: 'Spisak sa posete udruženju istog dana zaveden je kao zaseban registar: sedamnaest imena, redom kojim ih je nastavnik zapisao. Fotografije iz udruženja još nisu prenete, pa analiza posete čeka.',
      en: 'The list from the same day’s association visit is filed as its own register: seventeen names, in the order the teacher wrote them. The photographs from the association have not been transferred, so the visit analysis waits.',
    },
  },
);

c04.posetaRegistar = 'data/poseta-2026-10-23.json';

await write('data/cas-04/spisak.json', c04);

console.log(JSON.stringify({
  revizije: reg.revizije.length,
  c03: { razjasni: c03.razjasni.length, ispravke: c03.ispravke.length },
  c04: { razjasni: c04.razjasni.length, ispravke: c04.ispravke.length },
}));
