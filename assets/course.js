// Course identity, teaching plan, project themes and the exercise bank.
// Official course data from the faculty examination record (27.08.2026) and the course dossier
// !Projekti/Univerzitet/nastava/beograd-unt-fgm/pud/ (SILABUS.md, PROJEKTNI_ZADATAK.md), read 2026-10-01.
// Anything still unverified against the accreditation booklet is listed in course.unconfirmed.

import { identity } from './identity.js';

export const course = {
  // Identity lives in one place, assets/identity.js: the band, the page titles and every export read it there.
  ...identity,
  programmes: [
    { name: { en: 'Architecture and Urbanism 2023', sr: 'Arhitektura i urbanizam 2023' }, code: '22.OA0068', semester: 5, ects: 5, type: { en: 'elective', sr: 'izborni' } },
    { name: { en: 'Architecture and Urbanism 2016', sr: 'Arhitektura i urbanizam 2016' }, code: 'OAIPUD', semester: 6, ects: 4, type: { en: 'elective', sr: 'izborni' } }
  ],
  grading: '51–60 = 6 · 61–70 = 7 · 71–80 = 8 · 81–90 = 9 · 91–100 = 10',
  unconfirmed: {
    en: [
      'Contact hours per week are not stated in the examination record; they must be confirmed from the accreditation booklet.',
      'The fifteen-week plan below is the course dossier working version, not an approved syllabus text.',
      'Teaching dates, the room and the field visit have not been published.',
      'Two colloquia are declared by period (mid-November, mid-December). The fifteen points the dossier gave to one colloquium are split 8 + 7 between them; that split is the teacher’s proposal and is confirmed in class.'
    ],
    sr: [
      'Fond časova nije naveden u zapisniku; potvrđuje se iz knjige predmeta.',
      'Petnaestonedeljni plan je radna verzija iz dosijea predmeta, a ne odobren tekst silabusa.',
      'Termini nastave, učionica i termin terenskog obilaska nisu objavljeni.',
      'Dva kolokvijuma su najavljena po periodu (sredina novembra, sredina decembra). Petnaest bodova koje je dosije davao jednom kolokvijumu podeljeno je 8 + 7; ta podela je predlog nastavnika i potvrđuje se na času.'
    ]
  },
  thesis: {
    en: 'A solution that works for a wheelchair user, a four-year-old, a person with low vision and an eighty-year-old is a better solution for everyone else. The reverse does not hold.',
    sr: 'Rešenje koje odgovara osobi koja koristi kolica, detetu od četiri godine, osobi sa oštećenjem vida i osobi od osamdeset godina bolje je i za sve ostale. Suprotno ne važi.'
  }
};

// The three things a student has to know before anything else on this course.
// Declared by the teacher on 02.10.2026. The colloquia are declared by period, not by date:
// the exact week is written in only when the faculty publishes the timetable.
export const notices = [
  {
    id: 'a3',
    title: { en: 'One lecture — one A3.', sr: 'Jedno predavanje — jedan A3.' },
    body: {
      en: 'Every session ends with one A3 sheet that gathers that week’s work: measurements, sketches, drawings, images and the decision you made. The medium may change; the reasoning must stay visible on the sheet.',
      sr: 'Svaki čas se završava jednim A3 listom koji sabira rad te nedelje: mere, skice, crteže, slike i odluku koju si doneo. Medij sme da se menja; tok razmišljanja mora da ostane vidljiv na listu.'
    }
  },
  {
    id: 'signature',
    title: { en: 'The sheet is signed in the room.', sr: 'List se potpisuje u sali.' },
    body: {
      en: 'Write your name, index number and the week on the sheet. The teacher reviews it and signs it at the end of the session. The signature is the record of attendance and of work done — there is no upload, no account and no digital hand-in.',
      sr: 'Upiši ime, broj indeksa i nedelju na list. Nastavnik ga pregleda i potpisuje na kraju časa. Potpis je evidencija prisustva i urađenog rada — nema uploada, naloga ni digitalne predaje.'
    }
  },
  {
    id: 'colloquia',
    title: { en: 'Two colloquia: mid-November and mid-December.', sr: 'Dva kolokvijuma: sredina novembra i sredina decembra.' },
    body: {
      en: 'Colloquium 1 covers concepts and regulation (planned for week 5). Colloquium 2 covers the site, the analysis and the concept (planned for week 11). Both are held in the regular session. The exact dates are entered here when the faculty publishes the timetable.',
      sr: 'Kolokvijum 1 pokriva pojmove i propis (po planu 5. nedelja). Kolokvijum 2 pokriva lokaciju, analizu i koncept (po planu 11. nedelja). Oba se drže u redovnom terminu. Tačni datumi se upisuju ovde kad fakultet objavi raspored.'
    }
  }
];

export const outcomes = [
  { en: 'Distinguish accessibility (compliance with a regulation), universal design (one solution for all) and inclusive design (a process with users), and know when to use which term.', sr: 'Razlikuje pristupačnost (usklađenost sa propisom), univerzalni dizajn (jedno rešenje za sve) i inkluzivni dizajn (proces sa korisnicima) i zna kada koji pojam koristi.' },
  { en: 'Apply the Serbian Rulebook on technical standards of accessibility to a specific drawing and show exactly where the project fails.', sr: 'Primenjuje Pravilnik o tehničkim standardima pristupačnosti na konkretan crtež i ume da pokaže gde tačno projekat pada.' },
  { en: 'Derive an accessible route across sloping terrain from survey data, not from assumption.', sr: 'Izvodi pristupačnu trasu na terenu sa denivelacijom iz geodetskih podataka, a ne iz pretpostavke.' },
  { en: 'Carry out and document at least one participatory check and bring its result into the project.', sr: 'Sprovodi i dokumentuje bar jednu participativnu proveru i unosi njen rezultat u projekat.' },
  { en: 'Defend a design decision with evidence — a level, a slope, a width, a turning radius — not with a description of intent.', sr: 'Brani projektnu odluku dokazom — kotom, nagibom, širinom, radijusom okretanja — a ne opisom namere.' }
];

// The fifteen teaching weeks, as held in the course dossier. `stage` links a week to a project stage (1–6).
export const weeks = [
  { n: 1, block: 'A', stage: 1, lecture: { en: 'Introduction. What universal design is and is not. From barrier-free to UD. The project brief is issued.', sr: 'Uvod. Šta je univerzalni dizajn i šta nije. Od „barrier-free” do UD. Predstavljanje projektnog zadatka.' }, studio: { en: 'Teams formed; site sectors and project theme registered.', sr: 'Podela timova i sektora lokacije; prijava teme.' } },
  { n: 2, block: 'A', stage: 1, lecture: { en: 'The seven principles (NC State, 1997) — each with two built examples and one failure.', sr: 'Sedam principa (NC State, 1997) — svaki sa dva izvedena primera i jednim promašajem.' }, studio: { en: 'The prototype on the table: each team brings the toy it built from reclaimed material and judges it against all seven principles. One A3.', sr: 'Prototip na stolu: svaki tim donosi igračku koju je napravio od prikupljenog materijala i ocenjuje je po svih sedam principa. Jedan A3.' } },
  { n: 3, block: 'A', stage: 1, lecture: { en: 'The user is not an average: anthropometry, wheelchairs, canes, prams, cognitive diversity, ageing.', sr: 'Korisnik nije prosek: antropometrija, kolica, štap, kolica za bebe, kognitivna raznolikost, starenje.' }, studio: { en: 'Measure your own faculty: widths, slopes, handles, sanitary facilities. Findings in a table.', sr: 'Merenje sopstvenog fakulteta: širine, nagibi, kvake, sanitarije. Nalaz u tabeli.' } },
  { n: 4, block: 'A', stage: 2, lecture: { en: 'Serbian regulation: the Rulebook on technical standards of accessibility (Official Gazette RS 22/2015 and 10/2026). Slopes, widths, manoeuvring space, element heights.', sr: 'Regulativa Srbije: Pravilnik o tehničkim standardima pristupačnosti („Sl. glasnik RS” 22/2015 i 10/2026). Nagibi, širine, manevarski prostor, visine elemenata.' }, studio: { en: 'Check the week 3 drawing against the Rulebook; list every non-compliance.', sr: 'Kontrola crteža iz 3. nedelje prema Pravilniku; spisak neusaglašenosti.' } },
  { n: 5, block: 'A', stage: 2, milestone: true, lecture: { en: 'The wider normative frame: CRPD, EN 17210, SRPS ISO 21542. Where regulation ends and design begins.', sr: 'Širi normativni okvir: Konvencija UN, EN 17210, SRPS ISO 21542. Granica propisa — gde propis prestaje, a projektovanje počinje.' }, studio: { en: 'Colloquium 1 (concepts and regulation).', sr: 'Kolokvijum 1 (pojmovi i propis).' } },
  { n: 6, block: 'B', stage: 1, milestone: true, lecture: { en: 'Sloping terrain: the accessible route, switchbacks, landings, and when a ramp is not the answer.', sr: 'Teren sa denivelacijom: pristupačna trasa, serpentina, odmorišta, i kada rampa nije rešenje.' }, studio: { en: 'Field visit to the site. Photographic record of obstacles.', sr: 'Terenski obilazak lokacije. Foto-popis prepreka.' } },
  { n: 7, block: 'B', stage: 1, lecture: { en: 'Working with survey data: spot heights, contours, slope, fitting to orthophoto and cadastre.', sr: 'Rad sa geodetskim podlogama: visinske kote, izohipse, nagib i uklapanje sa ortofoto-snimkom i katastarskom podlogom.' }, studio: { en: 'Derive a terrain model and a slope map from the 151 measured points.', sr: 'Iz 151 izmerene tačke izvesti model terena i mapu nagiba.' } },
  { n: 8, block: 'B', stage: 2, lecture: { en: 'Public space for everyone: pedestrian surfaces, tactile paths, street furniture, lighting, safety.', sr: 'Javni prostor za sve: pešačke površine, taktilne staze, mobilijar, osvetljenje, sigurnost.' }, studio: { en: 'Diagram of existing flows and points of interruption, and an application for one person at one of those points.', sr: 'Dijagram postojećih tokova i tačaka prekida, i aplikacija za jednu osobu na jednoj od tih tačaka.' } },
  { n: 9, block: 'B', stage: 3, milestone: true, lecture: { en: 'Inclusive playgrounds and places for children; neurodivergent users — sensory load, retreat, predictability. Reading: James 2022, Kelly 2025.', sr: 'Inkluzivna igrališta i prostori za decu; neurodivergentni korisnici — senzorno opterećenje, povlačenje, predvidljivost. Literatura: James 2022, Kelly 2025.' }, studio: { en: 'Ten-minute paper presentation per team, applied to the site.', sr: 'Prikaz pročitanog rada (10 min po timu) i primena na lokaciju.' } },
  { n: 10, block: 'C', stage: 4, milestone: true, lecture: { en: 'Participatory and co-design: methods, ethics, limits. What may be asked, and what may not.', sr: 'Participativni i ko-dizajn: metode, etika, granice. Šta se pita, a šta ne.' }, studio: { en: 'Prepare and run the walkthrough. Minutes recorded.', sr: 'Priprema i izvođenje participativne provere. Zapisnik.' } },
  { n: 11, block: 'C', stage: 3, milestone: true, lecture: { en: 'From analysis to concept: programme, access matrix, strategy for overcoming the level difference.', sr: 'Od analize ka konceptu: program, pristupna matrica, izbor strategije savladavanja visine.' }, studio: { en: 'Colloquium 2 (site, analysis and concept). Concept review and correction; the project theme is fixed from here on.', sr: 'Kolokvijum 2 (lokacija, analiza i koncept). Koncept — pregled i korekcija; tema se od ovde ne menja.' } },
  { n: 12, block: 'C', stage: 5, lecture: { en: 'The building: entrance, vertical circulation, sanitary block, orientation and wayfinding.', sr: 'Objekat: ulaz, vertikalne komunikacije, sanitarni blok, orijentacija i prostorno snalaženje.' }, studio: { en: 'Work on plans and sections.', sr: 'Rad na osnovama i presecima.' } },
  { n: 13, block: 'C', stage: 5, lecture: { en: 'The detail that carries the project: threshold, handrail, tactile field, contrast. Material and maintenance.', sr: 'Detalj koji nosi projekat: prag, rukohvat, taktilno polje, kontrast. Materijal i održavanje.' }, studio: { en: 'Work on details at 1:20 / 1:10.', sr: 'Rad na detaljima 1:20 / 1:10.' } },
  { n: 14, block: 'C', stage: 6, lecture: { en: 'Evaluation: how accessibility is measured after construction (POE). Case studies from Belgrade.', sr: 'Evaluacija: kako se meri pristupačnost posle izgradnje (POE). Studije slučaja iz Beograda.' }, studio: { en: 'Cross-review: each team assesses another project against the Rulebook and the seven principles.', sr: 'Unakrsna provera: svaki tim ocenjuje tuđi projekat po Pravilniku i po sedam principa.' } },
  { n: 15, block: 'C', stage: 6, milestone: true, lecture: { en: 'Synthesis. Preparing the defence.', sr: 'Sinteza predmeta. Priprema odbrane.' }, studio: { en: 'Hand-in and public defence of the project.', sr: 'Predaja i javna odbrana projekta.' } }
];

export const blocks = {
  A: { en: 'Block A · Concepts and regulation (weeks 1–5)', sr: 'Blok A · Pojmovi i propis (nedelje 1–5)' },
  B: { en: 'Block B · Site and analysis (weeks 6–9)', sr: 'Blok B · Teren i analiza (nedelje 6–9)' },
  C: { en: 'Block C · Project and verification (weeks 10–15)', sr: 'Blok C · Projekat i provera (nedelje 10–15)' }
};

// The real site. Measured 24.11.2025 with a handheld device; figures recomputed from the source files 30.09.2026.
export const site = {
  name: 'Živimo zajedno',
  figures: [
    { label: { en: 'Height difference', sr: 'Visinska razlika' }, value: '22,5 m' },
    { label: { en: 'Straight-line distance', sr: 'Vazdušna linija' }, value: '151 m' },
    { label: { en: 'Average fall', sr: 'Prosečan pad' }, value: '14,9 %' },
    { label: { en: 'Steepest measured segment', sr: 'Najstrmiji izmereni segment' }, value: '63 % / 4,1 m' },
    { label: { en: 'Elevation range', sr: 'Raspon kota' }, value: '137,2 – 159,7 m' },
    { label: { en: 'Extent of measured points', sr: 'Obuhvat izmerenih tačaka' }, value: '≈ 129 × 131 m' },
    { label: { en: 'Measured points', sr: 'Izmerenih tačaka' }, value: '151' },
    { label: { en: 'Projection', sr: 'Projekcija' }, value: 'EPSG:32634' }
  ],
  problem: {
    en: 'A 5 % ramp for 22,5 m of height means 450 m of walking; even at the regulatory limit of 8,3 % it is 271 m, plus landings. On plots measuring roughly 129 × 131 m, that ramp has nowhere to go as a straight line. That is the whole task: you are not designing a ramp, you are designing a way to overcome the height so that everyone uses the same route.',
    sr: 'Rampa nagiba 5 % za visinsku razliku od 22,5 m zahteva 450 m hoda; i pri graničnom nagibu od 8,3 % zahteva 271 m, uz odmorišta. Na parceli približnih dimenzija 129 × 131 m takva rampa ne može da stane kao prava linija. To je suština zadatka: ne projektujete rampu, već način savladavanja visinske razlike istim putem za sve.'
  },
  caveat: {
    en: 'Declared device accuracy: 1,5–2,5 m horizontal, 2–3 m vertical. This is reconnaissance, not a survey for design. The 22,5 m total is reliable; a single spot height is not. A project that quotes a height from this base to the centimetre is lying. The cadastral view carries the note “not a public document” and is labelled that way on every board.',
    sr: 'Deklarisana tačnost uređaja: horizontalno 1,5–2,5 m, vertikalno 2–3 m. To je rekognosciranje, ne geodetski snimak za projektovanje. Ukupna visinska razlika od 22,5 m jeste pouzdana; pojedinačna kota nije. Projekat koji kotu sa ove podloge navodi na centimetar prikazuje lažnu preciznost. Katastarski prikaz nosi napomenu „nije javna isprava” i tako se označava na svakoj tabli.'
  }
};

// Three project themes. A team of 2–3 students takes one and develops it across the whole site.
export const themes = [
  { key: 'A', title: { en: 'Inclusive playground and place for children', sr: 'Inkluzivno igralište i prostor za decu' }, body: { en: 'Sensory load, a place to withdraw, predictability, play side by side rather than a separate “accessible” apparatus. James 2022 and Kelly 2025 are compulsory reading.', sr: 'Senzorno opterećenje, mesto za povlačenje, predvidljivost, igra rame uz rame umesto odvojene „pristupačne” sprave. James 2022 i Kelly 2025 su obavezno štivo.' } },
  { key: 'B', title: { en: 'Pedestrian connection through the level difference', sr: 'Pešačka veza kroz denivelaciju' }, body: { en: 'With supporting programme: landings, seating, shelter, a public toilet. The hardest geometry on the site.', sr: 'Sa pratećim programom: odmorišta, sedenje, sklonište, javni sanitarni čvor. Najteža geometrija na lokaciji.' } },
  { key: 'C', title: { en: 'A small public building', sr: 'Mali javni objekat' }, body: { en: 'Day centre, pavilion or community room: accessible entrance, vertical circulation, sanitary block and orientation.', sr: 'Dnevni centar, paviljon ili prostor mesne zajednice: pristupačan ulaz, vertikalna komunikacija, sanitarni blok i orijentacija.' } }
];

// Required content of the hand-in. core: compulsory in full for both programmes — these carry the course.
export const deliverables = [
  { n: 1, core: false, text: { en: 'Terrain analysis — a model from the 151 points and a slope map with zones below 5 %, 5–8,3 % and above 8,3 %, plus the line beyond which the slope cannot be negotiated.', sr: 'Analiza terena — model iz 151 tačke i mapa nagiba sa zonama < 5 %, 5–8,3 % i > 8,3 %, uz granicu iznad koje se nagib ne može savladati.' } },
  { n: 2, core: true, text: { en: 'Access matrix — for every entry point and every programme element: who arrives, from where, by which route, for how long. One column per user: wheelchair, pram, cane or walker, low vision, person without difficulty.', sr: 'Matrica pristupa — za svaku ulaznu tačku i svaki sadržaj: ko dolazi, odakle, kojim putem, koliko dugo. Kolona po korisniku: kolica, kolica za bebe, štap ili hodalica, oštećenje vida, osoba bez teškoća.' } },
  { n: 3, core: false, text: { en: 'Site plan 1:500 with levels and accessible routes.', sr: 'Situacija 1:500 sa kotama i pristupačnim trasama.' } },
  { n: 4, core: false, text: { en: 'Plans and sections 1:200 (1:100 for a building), with manoeuvring spaces drawn in.', sr: 'Osnove i preseci 1:200 (1:100 za objekat), sa ucrtanim manevarskim prostorima.' } },
  { n: 5, core: false, text: { en: 'Two details at 1:20 or 1:10 — at least one at a change of level: threshold, start or end of a ramp, tactile field.', sr: 'Dva detalja 1:20 ili 1:10 — obavezno jedan na mestu visinske razlike: prag, početak ili kraj rampe, taktilno polje.' } },
  { n: 6, core: true, text: { en: 'Compliance check — a table: element · requirement from the Rulebook (article) · achieved · compliant yes/no. Values are taken from the original text, not from the lecture and not from an AI tool.', sr: 'Kontrola po Pravilniku — tabela: element · zahtev iz Pravilnika (član) · postignuto · usklađeno da/ne. Vrednosti student vadi iz izvornog teksta, ne iz predavanja i ne iz AI alata.' } },
  { n: 7, core: true, text: { en: 'Minutes of the participatory check — who took part, what was tried, what was discovered, and what changed in the project because of it.', sr: 'Zapisnik participativne provere — ko je učestvovao, šta je probano, šta je otkriveno i šta je zbog toga promenjeno u projektu.' } },
  { n: 8, core: true, text: { en: 'Verification against the seven principles — one sentence of evidence for each; where a principle is not met, say why and at what cost.', sr: 'Provera kroz sedam principa — po jedna rečenica dokaza za svaki; gde princip nije zadovoljen, reći zašto i koja je cena.' } }
];

export const assessment = [
  { item: { en: 'Attendance and participation', sr: 'Prisustvo i aktivnost' }, a: 10, b: 10 },
  { item: { en: 'Exercises 3–4 (measurement and compliance check)', sr: 'Vežbe 3–4 (merenje i kontrola po Pravilniku)' }, a: 10, b: 10 },
  { item: { en: 'Colloquium 1 · concepts and regulation (mid-November)', sr: 'Kolokvijum 1 · pojmovi i propis (sredina novembra)' }, a: 8, b: 8 },
  { item: { en: 'Colloquium 2 · site, analysis and concept (mid-December)', sr: 'Kolokvijum 2 · lokacija, analiza i koncept (sredina decembra)' }, a: 7, b: 7 },
  { item: { en: 'Field analysis and slope map (weeks 6–8)', sr: 'Terenska analiza i mapa nagiba (6–8)' }, a: 15, b: 15 },
  { item: { en: 'Paper presentation (week 9)', sr: 'Prikaz literature (9)' }, a: 10, b: 10 },
  { item: { en: 'Project — graphic part', sr: 'Projekat — grafički deo' }, a: 25, b: 20 },
  { item: { en: 'Defence of the project', sr: 'Odbrana projekta' }, a: 15, b: 20 }
];

export const projectCriteria = [
  { share: 30, text: { en: 'Accuracy of the work with the terrain — whether the solution actually overcomes 22,5 m', sr: 'Tačnost rada sa terenom — da li rešenje stvarno savladava 22,5 m' } },
  { share: 25, text: { en: 'Compliance with the Rulebook, proven by a number', sr: 'Usklađenost sa Pravilnikom, dokazana brojem' } },
  { share: 20, text: { en: 'One solution for everyone — no separate “accessible” route', sr: 'Jedno rešenje za sve — bez odvojene „pristupačne” rute' } },
  { share: 15, text: { en: 'A finding from the participatory check built into the design', sr: 'Ugrađen nalaz participativne provere' } },
  { share: 10, text: { en: 'Graphic clarity and completeness of the hand-in', sr: 'Grafička jasnoća i kompletnost predaje' } }
];

export const automaticFail = {
  en: ['A project offering stairs for the majority and a ramp round the back for a minority.', 'A project without a single measured number.', 'A project presenting a reconnaissance height as a surveyed one.'],
  sr: ['Projekat koji nudi stepenište za većinu i zaobilaznu rampu za manjinu.', 'Projekat bez ijednog izmerenog broja.', 'Projekat koji kotu sa rekognoscirajuće podloge predstavlja kao geodetsku.']
};

export const notRequired = {
  en: 'Hydraulics, structure, energy analysis, bills of quantities and photorealistic renders are not required. What is required is evidence that the space works for everyone who enters it, on a drawing that can be measured with a ruler.',
  sr: 'Ne traže se hidrotehnika, statika, energetska analiza, predmer ni fotorealističan render. Traži se dokaz da prostor radi za sve koji u njega ulaze, i to na crtežu koji se može izmeriti lenjirom.'
};

export const houseRules = [
  { en: 'Every accessibility claim in the project is followed by a number: slope in per cent, width in centimetres, level in metres.', sr: 'Svaka tvrdnja o pristupačnosti u projektu prati se brojem: nagib u procentima, širina u centimetrima, kota u metrima.' },
  { en: 'AI tools are allowed and are declared: what the tool did and what the student verified. An unverified tool output is the student’s error, not the tool’s.', sr: 'AI alati su dozvoljeni i prijavljuju se: šta je alat uradio i šta je student proverio. Neproveren izlaz alata je greška studenta, ne alata.' },
  { en: 'The source of the base drawing is cited. A cadastral view from GeoSrbija is not a public document and is labelled as such on the board.', sr: 'Izvor podloge se navodi. Katastarski prikaz sa GeoSrbije nije javna isprava i tako se označava na tabli.' },
  { en: 'Admission to the defence requires the week 4 exercise and the week 10 participatory minutes. A project citing no measured number does not reach the defence.', sr: 'Uslov za odbranu: vežba iz 4. nedelje i zapisnik participativne provere iz 10. nedelje. Projekat bez ijednog izmerenog broja ne izlazi na odbranu.' }
];

// Teacher: the academic record. Counts are arithmetic from the census of the archive drive (2026-08-16);
// cross-checked against grad/ARC.md and grad/THEORY.md on 2026-10-01.
export const about = {
  name: 'Semir Poturak',
  role: { en: 'Assistant Professor, PhD, architect', sr: 'docent, doktor nauka, arhitekta' },
  lede: {
    en: 'Eighteen years of architectural work, read from the files it left behind. The record is counted, not recalled: where a number appears below, it comes from a file census, not from memory.',
    sr: 'Osamnaest godina arhitektonskog rada, pročitanih iz fajlova koje je ostavio. Zapis je prebrojan, a ne prepričan: broj koji stoji ispod dolazi iz popisa datoteka, ne iz sećanja.'
  },
  eras: [
    { period: '2008–2011', place: { en: 'Belgrade · Undergraduate studies', sr: 'Beograd · Osnovne studije' }, files: '674', body: { en: 'AutoCAD, 3ds Max, CorelDRAW, and a private versioning grammar invented because none was given: the number after the dot is the iteration. The exhibitions ArtIfAct and Duhovi grada run alongside coursework.', sr: 'AutoCAD, 3ds Max, CorelDRAW i sopstvena gramatika verzija, izmišljena jer je nije bilo: broj posle tačke je iteracija. Izložbe ArtIfAct i Duhovi grada teku uz nastavu.' } },
    { period: '2009–2012', place: { en: 'Warsaw · Master, Architecture for Society of Knowledge', sr: 'Varšava · Master, Architecture for Society of Knowledge' }, files: '3.265', body: { en: 'Generative processes, Robo Studio, computational design, visualisation and GIS site work. The method of this course is already present: the model must hold the whole truth about the space, not only a rendered picture.', sr: 'Generativni procesi, Robo Studio, računarsko projektovanje, vizuelizacija i GIS analiza lokacije. Metod ovog predmeta je već tu: model mora da drži celu istinu o prostoru, a ne samo renderovanu sliku.' } },
    { period: '2015–2023', place: { en: 'Istanbul · Doctoral studies', sr: 'Istanbul · Doktorske studije' }, files: '8.407', body: { en: 'Dissertation: Insecurity. Architecture. Architect (Güvensizlik. Mimarlık. Mimar). A thesis on resistance — reshaping the conditions in which weakness cannot endanger a person. That is the same move universal design makes when it stops treating difficulty as a property of the body and starts treating it as a property of the space.', sr: 'Disertacija: Insecurity. Architecture. Architect (Güvensizlik. Mimarlık. Mimar). Teza o otporu: o preoblikovanju uslova u kojima slabost ne ugrožava čoveka. To je isti potez koji univerzalni dizajn pravi kada teškoću prestane da smatra svojstvom tela i počne da je posmatra kao svojstvo prostora.' } },
    { period: '2013–2025', place: { en: 'Practice', sr: 'Projektantska praksa' }, files: '28.106', body: { en: 'Continuous residential, public and urban work. ArchiCAD, Grasshopper and CorelDRAW never die while five render engines do — a measured fact about which tools carry knowledge and which carry fashion.', sr: 'Neprekidan rad na stambenim, javnim i urbanističkim projektima. ArchiCAD, Grasshopper i CorelDRAW opstaju dok se pet programa za renderovanje smenjuje — izmerena činjenica o tome koji alati nose znanje, a koji modu.' } },
    { period: '2023–2026', place: { en: 'Teaching and research', sr: 'Nastava i istraživanje' }, files: '28.694', body: { en: 'University of Travnik (Urban Design 1 and 2, Interior Architecture, 2D/3D modelling, Computer graphics) and Union — Nikola Tesla University, Belgrade (Principles of Universal Design, Engineering Graphics 1, Fundamentals of Computing). International academic projects and Erasmus cooperation.', sr: 'Univerzitet u Travniku (Urbanističko projektiranje 1 i 2, Arhitektura unutrašnjih prostora, 2D/3D modeliranje, Računarska grafika) i Univerzitet „Union — Nikola Tesla”, Beograd (Principi univerzalnog dizajna, Inženjerska grafika 1, Osnove računarstva). Međunarodni akademski projekti i Erasmus saradnja.' } }
  ],
  note: {
    en: 'File counts come from a census of the archive drive taken on 2026-08-16. File dates give the shape of a period, not a biography; the record thins to almost nothing before 2008, where the digital practice begins.',
    sr: 'Brojevi datoteka dolaze iz popisa arhivskog diska od 16.08.2026. Datumi datoteka daju oblik perioda, ne biografiju; zapis se pre 2008. stanjuje do nule, tamo gde počinje digitalna praksa.'
  },
  why: {
    en: 'Why this course is taught this way: a dissertation on insecurity asks what makes a person vulnerable in space. Universal design answers in the only way an architect can — by changing the space. That is why the course does not begin with a checklist. It begins with a hill.',
    sr: 'Zašto se predmet drži ovako: disertacija o nesigurnosti pita šta čoveka čini ranjivim u prostoru. Univerzalni dizajn odgovara na jedini način na koji arhitekta može — menjanjem prostora. Zato predmet ne počinje kontrolnom listom. Počinje padinom.'
  }
};

export const links = [
  { group: { en: 'The course', sr: 'Predmet' }, items: [
    { label: { en: 'This studio (site)', sr: 'Ovaj studio (sajt)' }, url: 'https://3esign.github.io/inclusive-studio/' },
    { label: { en: 'Source repository and public pinboard', sr: 'Repozitorijum i javna tabla' }, url: 'https://github.com/3esign/inclusive-studio' },
    { label: { en: 'Faculty teaching system (iTeacher)', sr: 'Nastavni sistem fakulteta (iTeacher)' }, url: 'https://iteacher.unt.edu.rs' }
  ]},
  { group: { en: 'Universal design — the canon', sr: 'Univerzalni dizajn — kanon' }, items: [
    { label: { en: 'Center for Universal Design, NC State — the seven principles, 1997', sr: 'Center for Universal Design, NC State — sedam principa, 1997' }, url: 'https://design.ncsu.edu/research/center-for-universal-design/' },
    { label: { en: 'IDeA Center, University at Buffalo', sr: 'IDeA Center, University at Buffalo' }, url: 'https://idea.ap.buffalo.edu/' },
    { label: { en: 'Centre for Excellence in Universal Design (Ireland)', sr: 'Centre for Excellence in Universal Design (Irska)' }, url: 'https://nda.ie/about/what-we-do/centre-for-excellence-in-universal-design' },
    { label: { en: 'CRPD — article 2 (definition) and article 9 (accessibility)', sr: 'Konvencija UN o pravima OSI — član 2 (definicija) i član 9 (pristupačnost)' }, url: 'https://www.un.org/development/desa/disabilities/convention-on-the-rights-of-persons-with-disabilities.html' },
    { label: { en: 'DeafSpace guidelines, Gallaudet University', sr: 'DeafSpace smernice, Gallaudet University' }, url: 'https://gallaudet.edu/campus-design-facilities/campus-design-and-planning/deafspace/' }
  ]},
  { group: { en: 'Regulation and standards', sr: 'Propisi i standardi' }, items: [
    { label: { en: 'Legal information system of Serbia — find the Rulebook (22/2015, 10/2026)', sr: 'Pravno-informacioni sistem RS — Pravilnik (22/2015, 10/2026)' }, url: 'https://www.pravno-informacioni-sistem.rs/' },
    { label: { en: 'EN 17210 — accessibility and usability of the built environment', sr: 'EN 17210 — pristupačnost i upotrebljivost izgrađene sredine' }, url: 'https://standards.cencenelec.eu/' },
    { label: { en: 'ISO 21542 — building construction: accessibility and usability', sr: 'ISO 21542 — izgradnja objekata: pristupačnost i upotrebljivost' }, url: 'https://www.iso.org/standard/71860.html' },
    { label: { en: 'WCAG 2.2 — for the digital part of the work', sr: 'WCAG 2.2 — za digitalni deo rada' }, url: 'https://www.w3.org/TR/WCAG22/' }
  ]},
  { group: { en: 'Base data and tools', sr: 'Podloge i alati' }, items: [
    { label: { en: 'GeoSrbija — orthophoto and cadastre (the view is not a public document)', sr: 'GeoSrbija — ortofoto i katastar (prikaz nije javna isprava)' }, url: 'https://a3.geosrbija.rs/' },
    { label: { en: 'QGIS — free, for the terrain model and slope map', sr: 'QGIS — besplatan, za model terena i mapu nagiba' }, url: 'https://qgis.org/' },
    { label: { en: 'Colour Contrast Analyser — contrast in signage and on drawings', sr: 'Colour Contrast Analyser — kontrast u označavanju i na crtežima' }, url: 'https://www.tpgi.com/color-contrast-checker/' }
  ]}
];
