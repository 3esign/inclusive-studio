// Jednokratni upis četvrtog časa (23.10.2026) u tok predmeta i u gradivo nedelje 4.
// Izvor: nastavnikov zapis od 23.10.2026 (spisak radova i ispravke ranijih zapisa).
// Ono što je bilo pripremljeno a nije održano ne briše se — seli se u revizije.
import { readFile, writeFile } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const read = async p => JSON.parse(await readFile(new URL(p, root), 'utf8'));
const write = (p, data) => writeFile(new URL(p, root), JSON.stringify(data, null, p.includes('material') ? 2 : 1) + '\n');

const IZVOR = 'Nastavnik predmeta, 23.10.2026.; data/cas-04/spisak.json — izvor teacher-2026-10-23-cas-04; cas-04.html.';

const held = {
  id: 'cas-w04',
  vrsta: 'cas',
  nedelja: 4,
  naslov: {
    sr: 'Prototip u rukama korisnika — četvrti čas',
    en: 'The prototype in the users’ hands — fourth class',
  },
  odrzan: '2026-10-23',
  rezultati: [
    { sta: {
        sr: 'Rad na prototipovima je nastavljen: razrada, dokumentovanje i testiranje. Zavedeno je 27 prisustava, redom vođenja spiska; 21 rad je fotografisan, ukupno 87 fotografija. Spisak stoji na zasebnoj strani.',
        en: 'The prototype work continued: development, documentation and testing. Twenty-seven attendances were recorded, in the order the list was kept; 21 works were photographed, 87 photographs in all. The list stands on its own page.' },
      izvor: IZVOR },
    { sta: {
        sr: 'Posle rada na prototipovima otišli smo u udruženje: prototipi su tamo dalje razrađivani, dokumentovani i testirani sa korisnicima. Fotografije iz udruženja idu u istom nizu, posle fotografija prototipa.',
        en: 'After the prototype work we went to the association: there the prototypes were developed further, documented and tested with users. The photographs from the association follow in the same sequence, after the prototype photographs.' },
      izvor: IZVOR },
    { sta: {
        sr: 'Šest zapisa nosi prisustvo bez fotografija i nije izostavljeno iz evidencije: stoje u delu „Šta se čeka”, sa onim što je za svaki najavljeno — prototip sledeće nedelje, novi prototip, ili rad još u fazi istraživanja.',
        en: 'Six entries carry attendance without photographs and are not left out of the record: they stand in the „What we wait for” part, each with what it announced — a prototype next week, a new prototype, or work still at the research stage.' },
      izvor: IZVOR },
    { sta: {
        sr: 'Zavedene su tri ispravke ranijih zapisa trećeg časa: pripisivanje rada „putanja”, fotografija pogrešno zavedena pod „brza putanja” i fotografija koja je stajala uz „2d lavirint”. Ispravke ne brišu raniji zapis — upisane su uz njega, sa izvorom i datumom, a pogođene fotografije stoje povučene iz galerije dok se ne razdvoje.',
        en: 'Three corrections to earlier third-class records were filed: the attribution of „putanja”, the photograph wrongly filed under „brza putanja”, and the photograph that stood beside „2d lavirint”. A correction never erases the earlier record — it is written beside it, with its source and date, and the affected photographs stay withdrawn from the gallery until they are separated.' },
      izvor: IZVOR },
    { sta: {
        sr: 'Dva naziva rada su zavedena kao preimenovanja: „Brojkice” umesto ranijeg „sudoku” i „taktilna kutija” za rad kome naziv nije bio zabeležen na trećem času.',
        en: 'Two work titles were filed as renamings: „Brojkice” replacing the earlier „sudoku”, and „taktilna kutija” for the work whose title was not recorded at the third class.' },
      izvor: IZVOR },
    { sta: {
        sr: 'Fotografije su na telefonu nastavnika (Galaxy S23 FE, /Internal storage/DCIM/Camera); niz počinje snimkom 20261023_112141.jpg. Nisu prenete: strana spiska i registar radova ih čekaju, pa se unos dopunjuje.',
        en: 'The photographs are on the teacher’s phone (Galaxy S23 FE, /Internal storage/DCIM/Camera); the sequence begins with 20261023_112141.jpg. They have not been transferred: the list page and the work register wait for them, and the entries are completed then.' },
      izvor: 'Nastavnik predmeta, 23.10.2026.: „slike su na telefonu”; data/cas-04/spisak.json — prijem.' },
  ],
  prilog: [{ href: 'cas-04.html', text: {
    sr: 'Spisak radova četvrtog časa — 27 zavedenih prisustava, 21 fotografisan rad, deo „Šta se čeka” i ispravke ranijih zapisa',
    en: 'The list of the fourth class — 27 recorded attendances, 21 photographed works, the „What we wait for” part and the corrections to earlier records' } }],
  izvor: 'Nastavnik predmeta, 23.10.2026. (spisak radova četvrtog časa, ispravke ranijih zapisa i put do fotografija); data/material/w04.json — Zapisano posle časa.',
};

const tok = await read('data/tok.json');
tok.odrzano = tok.odrzano.filter(item => item.id !== 'cas-w04').concat([held]);
await write('data/tok.json', tok);

// Gradivo nedelje 4: ono što je stvarno održano. Pripremljena tema „Pravilnik naspram
// tvog crteža” nije održana 23.10 — ostaje zapisana u revizijama i čeka svoju nedelju.
const w04 = await read('data/material/w04.json');
const pripremljeno = { title: w04.title, aim: w04.aim, bring: w04.bring, blocks: w04.blocks };
const zapisano = [
  { kind: 'heading', text: { sr: 'Zapisano posle časa — 23.10.2026.', en: 'Recorded after class — 23 October 2026' } },
  { kind: 'list', items: [
    { sr: 'Nastavak rada na prototipovima: razrada, dokumentovanje i testiranje. Zavedeno 27 prisustava, 21 rad fotografisan, ukupno 87 fotografija.',
      en: 'The prototype work continued: development, documentation and testing. 27 attendances recorded, 21 works photographed, 87 photographs in all.' },
    { sr: 'Posle prototipova — udruženje: prototipi su tamo dalje razrađivani, dokumentovani i testirani sa korisnicima.',
      en: 'After the prototypes — the association: there the prototypes were developed further, documented and tested with users.' },
    { sr: 'Šest zapisa nosi prisustvo bez fotografija; stoje u delu „Šta se čeka”, sa onim što je za svaki najavljeno.',
      en: 'Six entries carry attendance without photographs; they stand in the „What we wait for” part, each with what it announced.' },
    { sr: 'Tri ispravke ranijih zapisa trećeg časa su zavedene sa izvorom; pogođene fotografije stoje povučene iz galerije dok se ne razdvoje.',
      en: 'Three corrections to earlier third-class records were filed with their source; the affected photographs stay withdrawn from the gallery until they are separated.' },
    { sr: 'Fotografije su još na telefonu nastavnika — nisu prenete; strana spiska i registar radova ih čekaju.',
      en: 'The photographs are still on the teacher’s phone — not yet transferred; the list page and the work register wait for them.' },
  ] },
  { kind: 'link', href: 'cas-04.html', text: {
    sr: 'Nedelja 4 — spisak radova četvrtog časa: 27 zavedenih prisustava, 21 fotografisan rad, deo „Šta se čeka” i ispravke ranijih zapisa',
    en: 'Week 4 — the list of the fourth class: 27 recorded attendances, 21 photographed works, the „What we wait for” part and the corrections to earlier records' } },
];

w04.state = 'published';
w04.updated = '2026-10-23';
w04.date = '2026-10-23';
w04.dateStatus = 'confirmed';
w04.title = { sr: 'Prototip u rukama korisnika', en: 'The prototype in the users’ hands' };
w04.aim = {
  sr: 'Na kraju časa tvoj prototip ima zapis: fotografisan je redom, probala ga je korisnica u udruženju, i ono što si tom prilikom video upisano je kao nalaz, a ne kao utisak.',
  en: 'By the end of the session your prototype carries a record: it was photographed in order, a user at the association tried it, and what you saw is written down as a finding, not an impression.',
};
w04.bring = [
  { sr: 'Prototip — doneti ga je ono što se evidentira. Ko ga nije doneo, zaveden je kao prisutan sa onim što je najavio.',
    en: 'The prototype — bringing it is what gets recorded. Whoever did not bring one is recorded as present with what they announced.' },
  { sr: 'Naziv rada. Zapis bez naziva ostaje otvoren dok se naziv ne javi.',
    en: 'The work’s title. An entry without a title stays open until the title is supplied.' },
  { sr: 'Spremnost da prototip neko drugi uzme u ruke: test u udruženju je deo časa, ne dodatak.',
    en: 'Readiness for someone else to pick the prototype up: the test at the association is part of the class, not an extra.' },
];
w04.blocks = zapisano.concat(pripremljeno.blocks);
w04.revizije = (w04.revizije || []).concat([{
  v: (w04.revizije || []).length + 1,
  datum: '2026-10-23',
  izvor: 'Nastavnik predmeta, 23.10.2026.',
  sta: {
    sr: 'Nedelja 4 je održana kao nastavak rada na prototipovima i testiranja u udruženju. Pripremljena tema „Pravilnik naspram tvog crteža” nije održana tog dana; njeni blokovi ostaju na strani, ispod zapisa sa časa, i čekaju nedelju u kojoj se stvarno drže.',
    en: 'Week 4 was held as a continuation of the prototype work and the testing at the association. The prepared theme „The Rulebook against your own drawing” was not held that day; its blocks remain on the page, below the record of the class, and wait for the week in which they are actually taught.',
  },
}]);
await write('data/material/w04.json', w04);
console.log(JSON.stringify({ odrzano: tok.odrzano.map(i => i.id), w04: w04.state, blokova: w04.blocks.length }));
