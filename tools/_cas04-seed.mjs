// Jednokratni upis registra četvrtog časa iz nastavnikovog zapisa od 23.10.2026.
// Izvor je Semirova poruka tog dana; ovaj fajl je trag kako je registar nastao.
import { writeFile, mkdir } from 'node:fs/promises';

const R = [
  [1, 'Andrej Rackov', '41/24', 'Fliper 2', 4, null],
  [2, 'Vanja Trkulja', '124/24', 'uklopko', 8, null],
  [3, 'Maša Marković', '121/24', 'lavirint', 3, null],
  [4, 'Katarina Petrović', '79/24', 'brza putanja', 4, null],
  [5, 'Ivana Simić', '141/24', 'Zmijica', 3, null],
  [6, 'Nikola Pajić', '49/24', 'Music Box', 3, null],
  [7, 'Andrej Parezanović', '43/24', null, 0, ['prisustvo; prototip se čeka sledeće nedelje', 'present; the prototype is expected next week']],
  [8, 'Sanja Hornjaček', '74/24', '3d lavirint', 3, ['indeks je danas zapisan kao 74/24; u spisku trećeg časa stoji 84/24 uz isto ime', 'the number is recorded today as 74/24; the third-class list carries 84/24 beside the same name']],
  [9, 'Nađa Stanić', '151/24', 'Brojkice', 12, ['„Brojkice” je novi naziv umesto ranijeg „sudoku”', '„Brojkice” is the new title replacing the earlier „sudoku”']],
  [10, 'Tijana Velemir', '51/24', 'zekino polje', 4, null],
  [11, 'Karla Krdžovac', '109/24', 'zen garden', 0, ['prisustvo; novi prototip se čeka sledeće nedelje, danas bez fotografija', 'present; a new prototype is expected next week, no photographs today']],
  [12, 'Vasilije Jovanović', '115/24', 'sound box', 3, null],
  [13, 'Marko Jakovljević', '150/24', 'istraživanje', 0, ['prisustvo; rad je u fazi istraživanja, bez fotografisanog prototipa', 'present; the work is at the research stage, no photographed prototype']],
  [14, 'Katarina Ušjak', '86/24', 'edukativna', 2, null],
  [15, 'Luka Stanišić', '44/24', null, 1, ['danas je doneta skica; prototip se očekuje sledeći čas', 'a sketch was brought today; the prototype is expected at the next class']],
  [16, 'Andreja Bošković', '26/24', null, 0, ['prisustvo; još uvek bez prototipa', 'present; still without a prototype']],
  [17, 'Sara Janjić', '4/24', null, 0, ['prisustvo; bez fotografija', 'present; no photographs']],
  [18, 'Lena Kovačić', '132/24', 'lenin lavirint', 0, ['prisustvo; danas bez fotografija', 'present; no photographs today']],
  [19, 'Anđela Banković', '64/24', 'mozgalica', 3, null],
  [20, 'Ana Rangelov', '149/24', 'tragovi boja', 4, null],
  [21, 'Anđela Mićković', '37/24', 'hobotnica', 6, null],
  [22, 'Iva Žunić', '110/24', 'praćka', 5, null],
  [23, 'Dunja Ljubičić', '38/24', 'igra sa užetom', 2, null],
  [24, 'Elena Tagkiri', '196/25', 'stubići', 3, null],
  [25, 'Ksenija Kočić', '19/24', 'taktilna kutija', 9, ['naziv je zaveden danas kao preimenovanje; u spisku trećeg časa naziv rada nije bio zabeležen', 'the title was recorded today as a renaming; the third-class list carried no title for this work']],
  [26, 'Hana Demiri', '22/24', null, 3, ['naziv rada nije zabeležen', 'the work’s title was not recorded']],
  [27, 'Iva Mijanović', '24/28', 'fliper', 2, ['indeks je danas zapisan kao 24/28; u spisku trećeg časa stoji 28/24 uz isto ime', 'the number is recorded today as 24/28; the third-class list carries 28/24 beside the same name']],
];

const QMAP = { 8: 'indeksi-hornjacek-mijanovic', 27: 'indeksi-hornjacek-mijanovic', 15: 'stanisic-skica', 26: 'bez-naziva-c04' };

const radovi = R.map(([rb, ime, indeks, rad, slike, nap]) => ({
  rb, ime, indeks, rad, slike,
  ...(QMAP[rb] ? { razjasni: QMAP[rb] } : {}),
  ...(nap ? { napomena: { sr: nap[0], en: nap[1] } } : {}),
}));

const spisak = {
  schema: 'course-class-list/v1',
  id: 'cas-04-radovi-2026-10-23',
  cas: 'cas-w04',
  odrzan: '2026-10-23',
  nedelja: 4,
  redni: { sr: 'četvrti čas', en: 'fourth class' },
  naslov: { sr: 'Spisak radova četvrtog časa.', en: 'The list of the fourth class.' },
  lede: {
    sr: 'Dvadeset sedam zavedenih prisustava, redom kojim je nastavnik vodio spisak. Dvadeset jedan rad je fotografisan — ukupno 87 fotografija; šest zapisa nosi prisustvo bez fotografija i stoji u delu „Šta se čeka”. Posle prototipa snimljene su fotografije iz udruženja, gde su radovi dalje razrađivani, dokumentovani i testirani.',
    en: 'Twenty-seven recorded attendances, in the order the teacher kept the list. Twenty-one works were photographed — 87 photographs in all; six entries carry attendance without photographs and stand in the „What we wait for” part. After the prototypes came the photographs from the association, where the works were developed further, documented and tested.',
  },
  source: {
    id: 'teacher-2026-10-23-cas-04',
    recordedOn: '2026-10-23',
    description: {
      sr: 'Nastavnikov spisak četvrtog časa (23.10.2026), zapisivan redom vođenja spiska; broj uz zapis je broj fotografija tog rada. Čas je nastavak rada na prototipovima: razrada, dokumentovanje i testiranje u udruženju. Fotografije su na telefonu nastavnika (Galaxy S23 FE, /Internal storage/DCIM/Camera); niz počinje snimkom 20261023_112141.jpg. Prvo idu fotografije prototipa, pa fotografije iz udruženja. Uz spisak su zavedene i tri ispravke ranijih zapisa.',
      en: 'The teacher’s list of the fourth class (23 October 2026), recorded in the order the list was kept; the number beside an entry is that work’s photograph count. The class continued the prototype work: development, documentation and testing at the association. The photographs are on the teacher’s phone (Galaxy S23 FE, /Internal storage/DCIM/Camera); the sequence begins with 20261023_112141.jpg. The prototype photographs come first, then those from the association. Three corrections to earlier records are filed with the list.',
    },
  },
  napomena: {
    sr: 'Brojevi su brojevi fotografija, ne ocene. Zapisi bez fotografija nisu izostavljeni: oni nose zavedeno prisustvo i stoje u delu „Šta se čeka”, sa onim što je za taj rad najavljeno.',
    en: 'The numbers count photographs, not grades. Entries without photographs are not omitted: they carry recorded attendance and stand in the „What we wait for” part, with what was announced for that work.',
  },
  sigurno: { do: 27, od: 28 },
  nizNapomena: {
    sr: 'Svaka fotografija snimljena na četvrtom času objavljena je uz rad kome pripada, čitana redom slikanja. Broj uz svaki zapis jeste broj fotografija koje je taj rad dobio; prvo idu fotografije prototipa, pa fotografije iz udruženja.',
    en: 'Every photograph taken at the fourth class is published with the work it belongs to, read in shooting order. The number beside each entry is the number of photographs that work got; the prototype photographs come first, then those from the association.',
  },
  udruzenjeNalazi: [
    { sr: 'Prototipi su u udruženju dalje razrađivani — rad se nastavio na licu mesta, ne samo na času.',
      en: 'At the association the prototypes were developed further — the work continued on the spot, not only in class.' },
    { sr: 'Radovi su dokumentovani: fotografije iz udruženja idu u istom nizu, posle fotografija prototipa.',
      en: 'The works were documented: the photographs from the association follow in the same sequence, after the prototype photographs.' },
    { sr: 'Prototipi su testirani sa korisnicima udruženja.',
      en: 'The prototypes were tested with the association’s users.' },
  ],
  analizaUdruzenja: {
    sr: 'Posle rada na prototipovima otišli smo u udruženje: prototipi su dalje razrađivani, dokumentovani i testirani sa korisnicima. Fotografije iz udruženja slede u istom nizu, posle fotografija prototipa.',
    en: 'After the prototype work we went to the association: the prototypes were developed further, documented and tested with users. The photographs from the association follow in the same sequence, after the prototype photographs.',
  },
  radovi,
  razjasni: [
    { id: 'indeksi-hornjacek-mijanovic', sta: {
      sr: 'Zapisi 8 i 27 nose broj indeksa koji se razlikuje od onoga u spisku trećeg časa uz isto ime. Oba su objavljena onako kako su danas zapisana; tačan broj se potvrđuje na času.',
      en: 'Entries 8 and 27 carry a student number that differs from the third-class list beside the same name. Both are published exactly as recorded today; the correct number is confirmed in class.' } },
    { id: 'stanisic-skica', sta: {
      sr: 'Zapis 15: danas je doneta skica, ne prototip — jedna fotografija. Naziv rada nije zabeležen; prototip se očekuje sledeći čas.',
      en: 'Entry 15: a sketch was brought today, not a prototype — one photograph. The work’s title was not recorded; the prototype is expected at the next class.' } },
    { id: 'bez-naziva-c04', sta: {
      sr: 'Zapisi 15 i 26 nemaju zabeležen naziv rada, iako imaju fotografije.',
      en: 'Entries 15 and 26 carry no recorded work title, although they have photographs.' } },
    { id: 'podela-dve-slike-brza-putanja', sta: {
      sr: 'Dve fotografije zavedene pod „brza putanja” sa trećeg časa pripadaju dvama različitim radovima — jedna radu „putanja”, druga radu „3d lavirint” (zapis 8 ovog spiska). Koja je koja, razdvaja se gledanjem obe fotografije; do tada obe stoje povučene iz galerije.',
      en: 'The two photographs filed under „brza putanja” from the third class belong to two different works — one to „putanja”, the other to „3d lavirint” (entry 8 of this list). Which is which is settled by looking at both; until then both stay withdrawn from the gallery.' } },
  ],
  ispravke: [
    { id: 'putanja-katarina', izvor: 'Nastavnik predmeta, 23.10.2026.', sta: {
      sr: 'Rad „putanja” sa trećeg časa pripisuje se autorki zapisa 4 ovog spiska, a ne imenu koje je tada zavedeno: fotografija koja stoji pod „brza putanja” snimljena je njenog prototipa, koji sada nosi naziv „putanja”. Atribucija se menja u registru radova, ne na ovoj strani.',
      en: 'The „putanja” work from the third class is attributed to the author of entry 4 of this list, not to the name recorded then: the photograph filed under „brza putanja” shows her prototype, now titled „putanja”. The attribution changes in the work register, not on this page.' } },
    { id: 'brza-putanja-3d-lavirint', izvor: 'Nastavnik predmeta, 23.10.2026.', sta: {
      sr: 'Fotografija zavedena pod „brza putanja” nije tog rada — prikazuje „3d lavirint”, rad iz zapisa 8 ovog spiska.',
      en: 'The photograph filed under „brza putanja” is not of that work — it shows „3d lavirint”, the work of entry 8 of this list.' } },
    { id: 'sanja-aleksa-vasic', izvor: 'Nastavnik predmeta, 23.10.2026.', sta: {
      sr: 'Fotografija koja je u registru stajala uz „2d lavirint” (treći čas) prikazuje rad drugog studenta, koji nije u ovom spisku. Fotografija ostaje povučena iz galerije dok se njegov zapis ne zavede sa izvorom.',
      en: 'The photograph that stood in the register beside „2d lavirint” (third class) shows the work of another student, who is not in this list. The photograph stays withdrawn from the gallery until his record is filed with its source.' } },
  ],
  prijem: {
    uredjaj: 'Galaxy S23 FE',
    putanja: '/Internal storage/DCIM/Camera',
    prviSnimak: '20261023_112141.jpg',
    prviSnimakVreme: '2026-10-23T11:21:41',
    napomena: {
      sr: 'Prvi snimak niza prikazuje kutiju od kartona sa unutrašnjim pregradama i plastičnim čašama — prva fotografija prvog rada u spisku. Fotografije još nisu prenete sa telefona.',
      en: 'The first frame of the sequence shows a cardboard box with inner dividers and plastic cups — the first photograph of the first work in the list. The photographs have not yet been transferred from the phone.' },
  },
};

await mkdir(new URL('../data/cas-04/', import.meta.url), { recursive: true });
await writeFile(new URL('../data/cas-04/spisak.json', import.meta.url), JSON.stringify(spisak, null, 1) + '\n');
console.log(JSON.stringify({
  rows: radovi.length,
  photos: radovi.reduce((n, r) => n + r.slike, 0),
  bezSlika: radovi.filter(r => r.slike === 0).length,
}));
