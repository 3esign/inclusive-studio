// The idea atelier is deliberately separate from the teaching schedule.
// These are research seeds: none becomes an assignment until it is selected,
// sourced and written into a weekly material file.

const t = (en, sr) => ({ en, sr });

export const IDEA_STATUSES = [
  { id: 'spark', label: t('Spark', 'Iskra') },
  { id: 'research', label: t('Needs research', 'Traži istraživanje') },
  { id: 'candidate', label: t('Candidate for a week', 'Kandidat za nedelju') },
  { id: 'in-use', label: t('Already in use', 'Već u nastavi') }
];

export const IDEA_FIELDS = [
  { id: 'space', label: t('Space', 'Prostor') },
  { id: 'digital', label: t('Digital interface', 'Digitalni interfejs') },
  { id: 'sensory', label: t('Senses and orientation', 'Čula i orijentacija') },
  { id: 'making', label: t('Making and material', 'Izrada i materijal') },
  { id: 'measurement', label: t('Evidence and measurement', 'Dokaz i merenje') },
  { id: 'children', label: t('Children, play and learning', 'Deca, igra i učenje') },
  { id: 'collaboration', label: t('Collaboration', 'Saradnja') }
];

export const IDEA_BANK = [
  // Open research additions, checked 4 October 2026; not assigned work.
  {
    "id": "braille-bricks-shared-symbol",
    "status": "research",
    "field": "children",
    "principles": [
      1,
      2,
      4
    ],
    "title": {
      "en": "One brick, two ways of reading",
      "sr": "Jedna kockica, dva načina čitanja"
    },
    "bridge": {
      "en": "touch and print ↔ a shared game",
      "sr": "dodir i štampa ↔ zajednička igra"
    },
    "question": {
      "en": "What might a shared game become when the same brick carries braille studs and printed symbols, while players choose how to read it?",
      "sr": "Kakva bi zajednička igra mogla da nastane kada ista kockica nosi Brajeve tačke i štampane simbole, a igrači biraju kako će je čitati?"
    },
    "move": {
      "en": "A shared building story could leave the next move to each player; blind participants could shape its rules and decide which tactile distinctions actually matter.",
      "sr": "Zajednička priča građenja mogla bi da prepusti sledeći potez svakom igraču; slepi učesnici mogli bi da oblikuju pravila i odlučuju koje taktilne razlike zaista znače."
    },
    "evidence": {
      "en": "Read LEGO's announcement of 20 August 2020: dual symbols, ordinary-brick compatibility and development with blind communities. This manufacturer account does not independently establish learning outcomes or current Serbian availability.",
      "sr": "Pročitana je objava LEGO-a od 20. avgusta 2020: dvostruki simboli, kompatibilnost sa običnim kockicama i razvoj sa zajednicama slepih. Navodi proizvođača nisu nezavisna potvrda učinka učenja ni sadašnje dostupnosti u Srbiji."
    },
    "source": {
      "label": "LEGO — LEGO Braille Bricks announcement, 20 August 2020",
      "url": "https://www.lego.com/en-us/aboutus/news/2020/august/lego-braille-bricks"
    }
  },
  {
    "id": "blind-builders-check-instructions",
    "status": "research",
    "field": "collaboration",
    "principles": [
      1,
      3,
      4
    ],
    "title": {
      "en": "The builder checks the language",
      "sr": "Graditelj proverava jezik uputstva"
    },
    "bridge": {
      "en": "spatial instructions ↔ paid experiential expertise",
      "sr": "prostorno uputstvo ↔ plaćeno iskustveno znanje"
    },
    "question": {
      "en": "How does a building description change when a blind builder can reject an ambiguous direction before the instructions are published for others?",
      "sr": "Kako se opis građenja menja kada slepi graditelj može da odbaci dvosmislen smer pre nego što uputstvo postane dostupno drugim ljudima?"
    },
    "move": {
      "en": "A shared object could connect written directions, touch and speech; the builder's corrections could become part of the description, with their contribution explicitly credited.",
      "sr": "Isti predmet mogao bi da poveže pisane smernice, dodir i govor; ispravke graditelja mogle bi da postanu deo opisa, uz jasno priznanje njihovog doprinosa."
    },
    "evidence": {
      "en": "Read Bricks for the Blind's undated FAQ: paid writers and blind testers, accessible text and example set 60376. The actual set instructions were not tested; initial piece sorting may require assistance.",
      "sr": "Pročitan je nedatirani FAQ organizacije Bricks for the Blind: plaćeni pisci i slepi proveravači, pristupačan tekst i primer kompleta 60376. Samo uputstvo nije isprobano; početno razvrstavanje delova može da zahteva pomoć."
    },
    "source": {
      "label": "Bricks for the Blind — Frequently Asked Questions",
      "url": "https://bricksfortheblind.org/faqs/"
    }
  },
  {
    "id": "tmap-shared-street-map",
    "status": "research",
    "field": "sensory",
    "principles": [
      1,
      3,
      4
    ],
    "title": {
      "en": "A street map with chosen detail",
      "sr": "Ulična mapa sa odabranim detaljima"
    },
    "bridge": {
      "en": "tactile streets ↔ shared route decisions",
      "sr": "taktilne ulice ↔ zajednički izbor putanje"
    },
    "question": {
      "en": "Which landmarks would people keep when raised lines, braille and large print must share limited space on the same street map?",
      "sr": "Koje bi orijentire ljudi zadržali kada izdignute linije, Brajevo pismo i krupna štampa moraju da dele ograničen prostor na istoj uličnoj mapi?"
    },
    "move": {
      "en": "Two map scales could open a conversation about orientation: participants could choose useful landmarks and explain when additional detail becomes clutter rather than help.",
      "sr": "Dve razmere mape mogle bi da otvore razgovor o orijentaciji: učesnici bi mogli da izaberu korisne orijentire i objasne kada dodatni detalj počinje da smeta."
    },
    "evidence": {
      "en": "Read MAD Lab's undated TMAP FAQ: tactile street maps, not indoor plans. Its SVG/PDF files are not screen-reader accessible. Geographic coverage varies; no account was opened and no map generated.",
      "sr": "Pročitan je nedatirani TMAP FAQ laboratorije MAD Lab: taktilne ulične mape, ne planovi enterijera. Njihovi SVG/PDF fajlovi nisu čitljivi čitačem ekrana. Geografska pokrivenost varira; nalog nije otvaran niti mapa generisana."
    },
    "source": {
      "label": "LightHouse MAD Lab — TMAP FAQ and Troubleshooting",
      "url": "https://madlabdesign.org/tmap-faq-and-troubleshooting/"
    }
  },
  {
    "id": "eyemine-player-chosen-goal",
    "status": "research",
    "field": "digital",
    "principles": [
      1,
      2,
      6
    ],
    "title": {
      "en": "The player chooses the destination",
      "sr": "Igrač bira odredište"
    },
    "bridge": {
      "en": "eye control ↔ ownership of play",
      "sr": "upravljanje pogledom ↔ samostalno određivanje igre"
    },
    "question": {
      "en": "What changes when an assistant supports eye-controlled movement but leaves the decision to explore, fly, build or simply watch to the player?",
      "sr": "Šta se menja kada pomagač podržava kretanje upravljano pogledom, ali igraču prepušta odluku da istražuje, leti, gradi ili samo posmatra svet?"
    },
    "move": {
      "en": "A shared world could allow different controls and tempos; the player's preferred activity could determine which options appear, rather than a helper's idea of progress.",
      "sr": "Zajednički svet mogao bi da dopušta različite kontrole i tempo; aktivnost koju igrač želi mogla bi da odredi ponuđene mogućnosti, umesto pomagačeve predstave o napretku."
    },
    "evidence": {
      "en": "Read SpecialEffect's 2021–2022 EyeMine v2 wiki: player autonomy and graduated controls. This historical Windows PC, eye-tracker and Minecraft Java setup is not a phone interface; current compatibility was not tested.",
      "sr": "Pročitana je SpecialEffect dokumentacija za EyeMine v2 iz 2021–2022: autonomija igrača i postepene kontrole. Taj istorijski spoj Windows računara, praćenja pogleda i Minecraft Java nije telefonski interfejs; današnja kompatibilnost nije isprobana."
    },
    "source": {
      "label": "SpecialEffect EyeMine v2 wiki — Get started playing, 20 January 2021",
      "url": "https://github.com/SpecialEffect/EyeMine/wiki/Get-started-playing"
    }
  },
  {
    "id": "vanabbe-replicas-shared-visit",
    "status": "research",
    "field": "space",
    "principles": [
      1,
      2,
      4
    ],
    "title": {
      "en": "Several approaches to the same artwork",
      "sr": "Više pristupa istom umetničkom delu"
    },
    "bridge": {
      "en": "experiential expertise ↔ a shared museum visit",
      "sr": "iskustveno znanje ↔ zajednička poseta muzeju"
    },
    "question": {
      "en": "Could a group remain together while each visitor chooses a replica, description or visual encounter, without one route becoming the standard for everyone?",
      "sr": "Može li grupa da ostane zajedno dok svaki posetilac bira repliku, opis ili vizuelni susret, bez pretvaranja jednog puta u standard za sve?"
    },
    "move": {
      "en": "A shared exhibition could offer optional sensory approaches; people with relevant lived experience could shape those choices and identify where an apparently helpful addition excludes someone.",
      "sr": "Zajednička izložba mogla bi da ponudi senzorne pristupe po izboru; ljudi sa relevantnim ličnim iskustvom mogli bi da oblikuju mogućnosti i prepoznaju kada naizgled koristan dodatak nekoga isključuje."
    },
    "evidence": {
      "en": "Read Van Abbemuseum's undated collectivity and multisensory pages: experiential experts, tactile objects and scent cards. Only replicas may be touched. No visit, sensory trial or whole-building accessibility assessment was performed.",
      "sr": "Pročitane su nedatirane stranice muzeja Van Abbe o zajedništvu i čulima: iskustveni stručnjaci, taktilni predmeti i mirisne kartice. Dodiruju se samo replike. Nisu sprovedeni poseta, senzorna proba ni procena pristupačnosti cele zgrade."
    },
    "source": {
      "label": "Van Abbemuseum — Collectivity and solidarity",
      "url": "https://vanabbemuseum.nl/en/museum/about-the-museum/themes/collectivity-solidarity"
    }
  },
  {
    id: 'printed-joint-only', status: 'candidate', field: 'making', principles: [2, 3, 5],
    title: t('Print the joint, find the rest', 'Štampaj spojnicu, ostalo nađi'),
    bridge: t('rubbish ↔ the one part that cannot be rubbish', 'otpad ↔ jedan deo koji ne može biti otpad'),
    question: t('If a toy may contain exactly one printed part, which part earns it — and what does the family do when that part breaks?', 'Ako igračka sme da sadrži tačno jedan štampan deo, koji ga deo zaslužuje — i šta porodica radi kad se taj deo slomi?'),
    move: t('Design a connector that joins two kinds of household waste at a dimension you had to decide, and publish the file beside the toy.', 'Projektuj spojnicu koja spaja dve vrste kućnog otpada na meri koju si morao da odrediš, i objavi fajl zajedno sa igračkom.'),
    evidence: t('The parts list with origins and prices, and the repair the family can do without us.', 'Spisak delova sa poreklom i cenama, i popravka koju porodica može da uradi bez nas.'),
    source: { label: 'EN 71-1 — small parts and sharp edges apply to printed parts too', url: 'https://law.resource.org/pub/eu/toys/en.71.1.2014.html' }
  },
  {
    id: 'gauge-in-the-hand', status: 'spark', field: 'making', principles: [5, 7],
    title: t('A gauge a parent can hold', 'Merilo koje roditelj drži u ruci'),
    bridge: t('a clause of a standard ↔ an object on a kitchen table', 'odredba standarda ↔ predmet na kuhinjskom stolu'),
    question: t('Can the choking-hazard check leave the laboratory and become a printed cylinder anyone can hold against a toy?', 'Može li provera opasnosti od gušenja da izađe iz laboratorije i postane štampan cilindar koji svako može da prisloni uz igračku?'),
    move: t('Print the ⌀31,7 mm cylinder at the standard depth, hand one to every team and one to the association, and count what fails.', 'Odštampaj cilindar ⌀31,7 mm na propisanoj dubini, daj po jedan svakom timu i jedan udruženju, i prebroj šta pada.'),
    evidence: t('How many toys already in the association’s rooms fail the check, counted rather than estimated.', 'Koliko igračaka koje već stoje u prostorijama udruženja pada na proveri, prebrojano a ne procenjeno.'),
    source: { label: 'EN 71-1 small parts cylinder', url: 'https://law.resource.org/pub/eu/toys/en.71.1.2014.html' }
  },
  {
    id: 'open-toy-shelf', status: 'research', field: 'collaboration', principles: [1, 2, 3],
    title: t('An open shelf of toys that can be rebuilt', 'Otvorena polica igračaka koje mogu da se naprave ponovo'),
    bridge: t('the gap after a diagnosis ↔ an open library of makeable things', 'praznina posle dijagnoze ↔ otvorena biblioteka stvari koje se prave'),
    question: t('Makers Making Change matches a request for an assistive device with a volunteer maker nearby. Does the same shape work for a toy, in Serbia, for the association’s families?', 'Makers Making Change spaja zahtev za pomagalom sa dobrovoljnim izrađivačem u blizini. Radi li isti oblik za igračku, u Srbiji, za porodice iz udruženja?'),
    move: t('Publish each tested student toy as a sheet anybody can build from: parts, origins, prices, the drawing, and the printed part’s file.', 'Objavi svaku isprobanu studentsku igračku kao list po kom bilo ko može da je napravi: delovi, poreklo, cene, crtež i fajl štampanog dela.'),
    evidence: t('One toy rebuilt by somebody who was not in the studio, from the sheet alone.', 'Jedna igračka koju je po samom listu ponovo napravio neko ko nije bio u studiju.'),
    source: { label: 'Makers Making Change — Neil Squire Society', url: 'https://www.makersmakingchange.com/' }
  },
  {
    id: 'one-person-app', status: 'in-use', field: 'digital', principles: [1, 2, 3, 4, 5],
    title: t('An application for one person', 'Aplikacija za jednu osobu'),
    bridge: t('observed situation ↔ interface', 'posmatrana situacija ↔ interfejs'),
    question: t('Can three screens remove one mismatch without pretending to solve a diagnosis?', 'Mogu li tri ekrana da uklone jedan nesklad, a da ne glume rešenje za dijagnozu?'),
    move: t('Draw three screens at real size and remove every element whose purpose you cannot name.', 'Nacrtaj tri ekrana u pravoj meri i ukloni svaki element čiju svrhu ne umeš da imenuješ.'),
    evidence: t('One observed situation, one constraint and three questions for the person.', 'Jedna posmatrana situacija, jedno ograničenje i tri pitanja za tu osobu.'),
    source: { label: 'Microsoft Inclusive Design', url: 'https://inclusive.microsoft.design/' }
  },
  {
    id: 'building-as-interface', status: 'spark', field: 'space', principles: [2, 3, 4, 5],
    title: t('A building behaves like an interface', 'Zgrada se ponaša kao interfejs'),
    bridge: t('interaction design ↔ architectural sequence', 'dizajn interakcije ↔ arhitektonski sled'),
    question: t('Where does a building ask for a decision, give feedback, hide a state or fail to offer recovery?', 'Gde zgrada traži odluku, daje povratnu informaciju, skriva stanje ili ne nudi oporavak posle greške?'),
    move: t('Redraw one route as a state diagram: invitation, action, feedback, error and recovery.', 'Precrtaj jednu putanju kao dijagram stanja: poziv, radnja, odgovor, greška i oporavak.'),
    evidence: t('Count decisions, reversals and places where help is required.', 'Prebroj odluke, vraćanja i mesta na kojima je potrebna pomoć.'),
    source: { label: 'W3C COGA — Making Content Usable', url: 'https://www.w3.org/TR/coga-usable/' }
  },
  {
    id: 'quiet-route', status: 'candidate', field: 'sensory', principles: [1, 2, 4, 6],
    title: t('The quiet route is not always the shortest', 'Mirna putanja nije uvek najkraća'),
    bridge: t('wayfinding ↔ sensory load', 'orijentacija ↔ senzorno opterećenje'),
    question: t('What changes when a route is chosen by glare, noise, crowding and places to pause, not distance alone?', 'Šta se menja kada se putanja bira prema bleštanju, buci, gužvi i mestima za predah, a ne samo prema dužini?'),
    move: t('Map two routes to the same destination and draw a sensory profile beside their lengths.', 'Mapiraj dve putanje do istog odredišta i uz njihove dužine nacrtaj senzorni profil.'),
    evidence: t('Time, sound, light, crowd density, rests and the user’s stated preference.', 'Vreme, zvuk, svetlo, gustina gužve, predasi i izbor koji je korisnik naveo.'),
    source: { label: 'Gallaudet University — DeafSpace', url: 'https://gallaudet.edu/campus-design-facilities/campus-design-and-planning/deafspace/' }
  },
  {
    id: 'haptic-threshold', status: 'spark', field: 'making', principles: [3, 4, 5],
    title: t('A threshold that can be read by hand and foot', 'Prag koji se čita rukom i stopalom'),
    bridge: t('haptics ↔ architectural detail', 'haptika ↔ arhitektonski detalj'),
    question: t('Can material, temperature, texture and edge geometry announce a transition without becoming a hazard?', 'Mogu li materijal, temperatura, tekstura i geometrija ivice da najave prelaz, a da ne postanu prepreka?'),
    move: t('Make three full-scale samples with one variable changed at a time.', 'Napravi tri uzorka u prirodnoj veličini, menjajući samo po jednu osobinu.'),
    evidence: t('Recognition, confusion, maintenance and wet-condition behaviour.', 'Prepoznavanje, zabune, održavanje i ponašanje u vlažnim uslovima.'),
    source: { label: 'ISO 21542 overview', url: 'https://www.iso.org/standard/71860.html' }
  },
  {
    id: 'tactile-site-model', status: 'candidate', field: 'making', principles: [1, 3, 4],
    title: t('A tactile model made with its readers', 'Taktilni model napravljen sa onima koji ga čitaju'),
    bridge: t('terrain ↔ tactile language', 'teren ↔ taktilni jezik'),
    question: t('Which few textures and landmarks make the site discussable without sight?', 'Koje malobrojne teksture i orijentiri čine lokaciju razumljivom bez vida?'),
    move: t('Build a relief model, test landmark recognition, then replace every symbol that is guessed rather than recognised.', 'Napravi reljefni model, proveri prepoznavanje orijentira, pa zameni svaki simbol koji se nagađa umesto da se prepoznaje.'),
    evidence: t('Recognition rate, reading time, wrong turns and the reader’s proposed symbols.', 'Stopa prepoznavanja, vreme čitanja, pogrešna skretanja i simboli koje predlaže čitalac.'),
    source: { label: 'TactIcons — CHI 2023', url: 'https://arxiv.org/html/2407.20674v1' }
  },
  {
    id: 'two-channel-alarm', status: 'candidate', field: 'sensory', principles: [2, 3, 4, 5],
    title: t('An alarm that never has only one channel', 'Alarm koji nikada nema samo jedan kanal'),
    bridge: t('emergency planning ↔ redundant interface', 'planiranje evakuacije ↔ redundantni interfejs'),
    question: t('Who misses the event when sound, light, vibration or text acts alone?', 'Ko ne dobija obaveštenje kada zvuk, svetlo, vibracija ili tekst deluju sami?'),
    move: t('Draw the same event through two independent channels and show the failure of each.', 'Prikaži isti događaj kroz dva nezavisna kanala i pokaži kvar svakog od njih.'),
    evidence: t('A coverage matrix for place, distance, attention and sensory conditions.', 'Matrica pokrivenosti prema mestu, udaljenosti, pažnji i čulnim uslovima.'),
    source: { label: 'WCAG 2.2 — sensory characteristics', url: 'https://www.w3.org/WAI/WCAG22/Understanding/sensory-characteristics.html' }
  },
  {
    id: 'one-switch-building', status: 'spark', field: 'space', principles: [1, 3, 5, 6],
    title: t('A building used with one switch', 'Zgrada kojom se upravlja jednim prekidačem'),
    bridge: t('switch scanning ↔ spatial choice', 'skeniranje prekidačem ↔ prostorni izbor'),
    question: t('How many activations does the main journey demand when pointing and simultaneous movement are removed?', 'Koliko aktivacija traži glavna putanja kada uklonimo pokazivanje i istovremene pokrete?'),
    move: t('Turn doors, lifts, intercoms and route choices into one ordered scan; then shorten it.', 'Pretvori vrata, liftove, interfone i izbore putanje u jedan uređeni niz, pa ga skrati.'),
    evidence: t('Activations, waiting time, missed states and a path that works without automation.', 'Broj aktivacija, čekanje, propuštena stanja i putanja koja radi i bez automatike.'),
    source: { label: 'W3C WAI — Input modalities', url: 'https://www.w3.org/WAI/WCAG22/Understanding/input-modalities' }
  },
  {
    id: 'ai-uncertainty', status: 'research', field: 'digital', principles: [3, 4, 5],
    title: t('An AI description that shows what it does not know', 'AI opis koji pokazuje šta ne zna'),
    bridge: t('machine vision ↔ architectural evidence', 'mašinski vid ↔ arhitektonski dokaz'),
    question: t('How can a description separate observed geometry, inference and uncertainty?', 'Kako opis može da razdvoji opaženu geometriju, zaključak i neizvesnost?'),
    move: t('Write three layers for one plan: what is visible, what is inferred and what needs human confirmation.', 'Napiši tri sloja za jednu osnovu: šta je vidljivo, šta je zaključeno i šta čovek mora da potvrdi.'),
    evidence: t('Compare the description with the drawing and with a reader who needs it.', 'Uporedi opis sa crtežom i sa čitaocem kome je opis potreban.'),
    source: { label: 'W3C WAI — Complex images', url: 'https://www.w3.org/WAI/tutorials/images/complex/' }
  },
  {
    id: 'seven-principles-ai', status: 'research', field: 'digital', principles: [1, 2, 3, 4, 5, 6, 7],
    title: t('Seven principles as tests for an AI system', 'Sedam principa kao testovi AI sistema'),
    bridge: t('universal design ↔ AI evaluation', 'univerzalni dizajn ↔ vrednovanje AI sistema'),
    question: t('What would each 1997 principle require from a contemporary AI assistant?', 'Šta bi svaki princip iz 1997. zahtevao od savremenog AI asistenta?'),
    move: t('Write one falsifiable test per principle and run all seven on three systems.', 'Napiši po jedan opovrgljiv test za svaki princip i primeni svih sedam na tri sistema.'),
    evidence: t('Comparable tasks, failures, recovery and user choice — not a single accessibility score.', 'Uporedivi zadaci, kvarovi, oporavak i izbor korisnika — ne jedna ocena pristupačnosti.'),
    source: { label: 'NC State — Principles of Universal Design', url: 'https://design.ncsu.edu/research/center-for-universal-design/' }
  },
  {
    id: 'usefulness-instrument', status: 'research', field: 'measurement', principles: [2, 3, 6, 7],
    title: t('Measure usefulness after the presentation', 'Izmeri korisnost posle odbrane'),
    bridge: t('post-occupancy evaluation ↔ learning assessment', 'postokupaciona evaluacija ↔ vrednovanje učenja'),
    question: t('What remains useful when the jury, author and explanatory speech are gone?', 'Šta ostaje korisno kada više nema žirija, autora ni usmenog objašnjenja?'),
    move: t('Adapt one validated assistive-technology instrument to the handover of a student proposal.', 'Prilagodi jedan validiran instrument iz asistivne tehnologije predaji studentskog projekta.'),
    evidence: t('Use, choice, effort, abandonment and one change made after feedback.', 'Upotreba, izbor, napor, napuštanje i jedna izmena nastala posle povratne informacije.'),
    source: { label: 'WHO — Assistive technology assessment', url: 'https://www.who.int/health-topics/assistive-technology' }
  },
  {
    id: 'post-occupancy-register', status: 'research', field: 'measurement', principles: [1, 2, 6, 7],
    title: t('A register of buildings after occupation', 'Registar zgrada posle useljenja'),
    bridge: t('course archive ↔ public evidence', 'arhiva predmeta ↔ javni dokaz'),
    question: t('What can four student generations learn that one semester cannot?', 'Šta četiri generacije studenata mogu da saznaju, a jedan semestar ne može?'),
    move: t('Audit the same ordinary tasks in three recent buildings every year, using one stable record.', 'Svake godine proveri iste svakodnevne zadatke u tri novije zgrade, istim stabilnim zapisnikom.'),
    evidence: t('Promised, built, used, changed later — with dates and comparable measures.', 'Obećano, izvedeno, korišćeno, naknadno promenjeno — uz datume i uporedive mere.'),
    source: { label: 'NDA — Universal Design', url: 'https://nda.ie/about/what-we-do/centre-for-excellence-in-universal-design' }
  },
  {
    id: 'association-brief-library', status: 'candidate', field: 'collaboration', principles: [1, 2, 3],
    title: t('A library of briefs written by associations', 'Biblioteka zadataka koje pišu udruženja'),
    bridge: t('community question ↔ design studio', 'pitanje zajednice ↔ projektantski studio'),
    question: t('What changes when the association owns the question, not only the feedback?', 'Šta se menja kada pitanje postavlja udruženje, umesto da samo daje komentar?'),
    move: t('Record one place in the association’s words, the evidence it permits and its right to withdraw the brief.', 'Zapiši jedno mesto rečima udruženja, dokaze koje ono dopušta i njegovo pravo da povuče zadatak.'),
    evidence: t('Authorship, decision rights, compensation, consent and the changes students made.', 'Autorstvo, pravo odlučivanja, naknada, saglasnost i izmene koje su studenti napravili.'),
    source: { label: 'Living Knowledge — Science Shops', url: 'https://livingknowledge.org/science-shops/faqs/' }
  },
  {
    id: 'decision-ledger', status: 'candidate', field: 'collaboration', principles: [2, 3],
    title: t('A drawing that remembers who changed it', 'Crtež koji pamti ko ga je promenio'),
    bridge: t('design iteration ↔ shared authorship', 'projektantska iteracija ↔ zajedničko autorstvo'),
    question: t('Can a critique record decisions without turning a coauthor into evidence for a student idea?', 'Može li kritika da zabeleži odluke, a da koautora ne pretvori u dokaz studentske ideje?'),
    move: t('Place before, comment, decision and after on one sheet; leave disagreement visible.', 'Na jedan list postavi stanje pre, komentar, odluku i stanje posle; ostavi neslaganje vidljivim.'),
    evidence: t('At least one accepted change, one rejected change and the reason for each.', 'Najmanje jedna prihvaćena i jedna odbačena izmena, uz razlog za obe.'),
    source: { label: 'W3C WAI — Involving users', url: 'https://www.w3.org/WAI/test-evaluate/involving-users/' }
  },
  {
    id: 'accessible-exhibition', status: 'spark', field: 'sensory', principles: [1, 3, 4, 5],
    title: t('An architecture review without the wall of boards', 'Arhitektonska kritika bez zida tabli'),
    bridge: t('studio jury ↔ multisensory exhibition', 'projektantska kritika ↔ višemodalna izložba'),
    question: t('How can the same argument be followed through sight, touch, sound and structured text?', 'Kako se isti argument može pratiti vidom, dodirom, zvukom i strukturisanim tekstom?'),
    move: t('Translate one board into a tactile object, a ninety-second audio route and a structured text outline.', 'Prevedi jednu tablu u taktilni predmet, zvučnu putanju od devedeset sekundi i strukturisan tekstualni pregled.'),
    evidence: t('Ask each reader to recover the design question, decision and critical dimension.', 'Traži od svakog čitaoca da pronađe projektantsko pitanje, odluku i ključnu meru.'),
    source: { label: 'W3C WAI — Audio and video', url: 'https://www.w3.org/WAI/media/av/' }
  },
  {
    id: 'energy-budget-plan', status: 'spark', field: 'space', principles: [2, 6, 7],
    title: t('Draw the effort budget, not only the distance', 'Nacrtaj budžet napora, ne samo dužinu'),
    bridge: t('spatial sequence ↔ fluctuating energy', 'prostorni sled ↔ promenljiva energija'),
    question: t('Where can a person pause, shorten, reverse or postpone a journey without losing access?', 'Gde osoba može da zastane, skrati put, vrati se ili odloži polazak, a da ne izgubi pristup?'),
    move: t('Give every segment an effort cost and design two points of recovery.', 'Dodeli svakom segmentu cenu napora i projektuj dve tačke oporavka.'),
    evidence: t('Distance, rise, doors, decisions, waiting, seating and a user-defined stopping point.', 'Dužina, uspon, vrata, odluke, čekanje, sedenje i tačka zaustavljanja koju bira korisnik.'),
    source: { label: 'AccessMap — Taskar Center', url: 'https://tcat.cs.washington.edu/accessmap/' }
  },
  {
    id: 'constraint-to-detail', status: 'candidate', field: 'making', principles: [2, 5, 6],
    title: t('Carry one digital constraint into a 1:10 detail', 'Prenesi jedno digitalno ograničenje u detalj 1:10'),
    bridge: t('interface rule ↔ construction detail', 'pravilo interfejsa ↔ građevinski detalj'),
    question: t('What is the spatial equivalent of undo, visible focus, a large target or an error message?', 'Šta je prostorni ekvivalent vraćanja poteza, vidljivog fokusa, velike mete ili poruke o grešci?'),
    move: t('Choose one interface rule and express it through geometry, material and maintenance.', 'Izaberi jedno pravilo interfejsa i izrazi ga geometrijom, materijalom i održavanjem.'),
    evidence: t('A full-scale interaction plus a 1:10 section that explains the same rule.', 'Interakcija u prirodnoj veličini i presek 1:10 koji objašnjava isto pravilo.'),
    source: { label: 'WCAG 2.2', url: 'https://www.w3.org/TR/WCAG22/' }
  },
  {
    id: 'failure-library', status: 'research', field: 'measurement', principles: [3, 5],
    title: t('A library of recoverable failures', 'Biblioteka grešaka iz kojih može da se oporavi'),
    bridge: t('incident record ↔ design alternative', 'zapis kvara ↔ projektantska varijanta'),
    question: t('Does the project explain what happens when the lift, sensor, sign, AI or helper is unavailable?', 'Da li projekat objašnjava šta se dešava kada lift, senzor, znak, AI ili pomagač nisu dostupni?'),
    move: t('Break one dependency on paper and draw the route back to agency.', 'Na papiru prekini jednu zavisnost i nacrtaj put povratka samostalnosti.'),
    evidence: t('Failure state, consequence, recovery time and a non-digital fallback.', 'Stanje kvara, posledica, vreme oporavka i nedigitalna rezerva.'),
    source: { label: 'W3C WCAG — Error prevention', url: 'https://www.w3.org/WAI/WCAG22/Understanding/error-prevention-all.html' }
  },
  {
    id: 'acoustic-zoning', status: 'candidate', field: 'sensory', principles: [2, 3, 4, 7],
    title: t('Acoustic zoning and reverberation control', 'Akustičko zoniranje i kontrola reverberacije'),
    bridge: t('acoustics ↔ sensory inclusion', 'akustika ↔ senzorna inkluzija'),
    question: t('Can spatial volume and absorption keep RT60 below 0.6s without turning a room into a recording booth?', 'Mogu li zapremina i apsorpcija da zadrže RT60 ispod 0,6 s a da prostor ne postane gluv?'),
    move: t('Calculate reverberation time using the Sabine formula and test speech clarity with hearing-aid users.', 'Izračunaj vreme reverberacije Sabinovom formulom i proveri razgovetnost sa korisnicima slušnih aparata.'),
    evidence: t('RT60 measurement, absorption area, background noise level in dBA and speech transmission index.', 'Merenje RT60, površina apsorpcije, nivo buke u dBA i indeks prenosa govora.'),
    source: { label: 'Gallaudet DeafSpace Design Guidelines', url: 'https://gallaudet.edu/campus-design-facilities/campus-design-and-planning/deafspace/' }
  },
  {
    id: 'tactile-guide-wall', status: 'candidate', field: 'making', principles: [1, 3, 4],
    title: t('A continuous tactile wall that leads the hand', 'Neprekidni taktilni zid koji vodi ruku'),
    bridge: t('material texture ↔ wayfinding', 'tekstura materijala ↔ orijentacija'),
    question: t('How can natural materials like cork or grooved timber provide continuous guidance without floor clutter?', 'Kako prirodni materijali poput plute ili profilisanog drveta mogu voditi ruku bez prepreka na podu?'),
    move: t('Design and mock up a 3-metre wall section with tactile height cues, transition nodes and room markers.', 'Projektuj i napravi uzorak zida od 3 metra sa taktilnim visinskim prelazima i oznakama prostorija.'),
    evidence: t('Hand-tracking video, speed of movement, recognition of destinations and participant feedback.', 'Video-praćenje kretanja ruke, brzina prolaza, prepoznavanje odredišta i zapažanja korisnika.'),
    source: { label: 'Hazelwood School — Alan Dunlop', url: 'https://alandunloparchitects.com/hazelwood-school/' }
  },
  {
    id: 'lrv-contrast-envelope', status: 'research', field: 'measurement', principles: [3, 4, 7],
    title: t('The light reflectance envelope of a doorway', 'Omotač svetlosnog kontrasta oko vrata'),
    bridge: t('photometry ↔ boundary legibility', 'fotometrija ↔ čitljivost prostorne granice'),
    question: t('Does a 30-point LRV difference make thresholds and frames readable across varying daylight conditions?', 'Da li razlika od 30 LRV bodova čini prag i štok čitljivim u svim uslovima dnevnog svetla?'),
    move: t('Measure LRV of five frame/wall combinations under direct sun, overcast sky and artificial LED lighting.', 'Izmeri LRV pet kombinacija štoka i zida na direktnom suncu, oblačnom danu i LED svetlu.'),
    evidence: t('LRV spectrophotometer readings, lux levels, recognition distance for low-vision readers.', 'Očitavanja spektrofotometrom, nivo luksa i udaljenost prepoznavanja za slabovide osobe.'),
    source: { label: 'ISO 21542:2021', url: 'https://www.iso.org/standard/71860.html' }
  },
  {
    id: 'sensory-retreat-pocket', status: 'candidate', field: 'space', principles: [1, 2, 6],
    title: t('A sensory refuge built into the circulation path', 'Senzorno utočište ugrađeno u hodnik'),
    bridge: t('spatial zoning ↔ neurodivergent safety', 'prostorno zoniranje ↔ neurodivergentna sigurnost'),
    question: t('Can a niche offer immediate withdrawal from sensory overload without segregating or concealing the occupant?', 'Može li niša ponuditi povlačenje od preopterećenja bez izolacije i skrivanja korisnika?'),
    move: t('Draw a plan and section of an alcove with indirect light, acoustic damping and predictable sightlines.', 'Nacrtaj osnovu i presek niše sa indirektnim svetlom, akustičkim prigušenjem i predvidljivim vizurama.'),
    evidence: t('Sound level drop in dBA, illuminance in lux, field of view and user heart-rate/recovery diary.', 'Pad nivoa zvuka u dBA, osvetljenost u luksima, vidno polje i zabeležen oporavak korisnika.'),
    source: { label: 'Magda Mostafa — Autism ASPECTSS™ Index', url: 'https://archnet.org/publications/9783' }
  },
  {
    id: 'toy-from-rubbish', status: 'in-use', field: 'children', principles: [1, 2, 3, 5, 7],
    title: t('A toy with the cost of rubbish', 'Igračka po ceni otpada'),
    bridge: t('waste material ↔ developmental task', 'otpadni materijal ↔ razvojni zadatak'),
    question: t('Can a cardboard box, three skewers and seven bottle caps train a hand movement and a spatial operation at once, and still let two different children play at one table?', 'Mogu li kartonska kutija, tri štapića i sedam čepova istovremeno da vežbaju pokret ruke i radnju nad prostorom, a da za istim stolom igraju dvoje različite dece?'),
    move: t('Measure the parts you already have in the bin, then draw the toy at 1:1 and put the ⌀31,7 mm cylinder around every loose piece.', 'Izmeri delove koje već imaš u kanti, pa nacrtaj igračku 1:1 i oko svakog odvojivog komada povuci cilindar ⌀31,7 mm.'),
    evidence: t('Parts list with real dimensions, the small-parts check, and one observable sentence about what a child does with it.', 'Spisak delova sa stvarnim merama, provera sitnih delova i jedna posmatriva rečenica o tome šta dete sa njom radi.'),
    source: { label: 'EN 71-1 — Safety of toys, small parts cylinder', url: 'https://law.resource.org/pub/eu/toys/en.71.1.2014.html' }
  },
  {
    id: 'deck-after-diagnosis', status: 'research', field: 'children', principles: [1, 2, 3, 5],
    title: t('The deck that starts where the assessment stops', 'Špil koji počinje tamo gde procena prestaje'),
    bridge: t('screening instrument ↔ the next morning', 'instrument procene ↔ sutra ujutru'),
    question: t('Assessment decks name what a child finds hard. What would a deck look like that names, for each of those operations, an object to practise it on — buildable at home, this week?', 'Špilovi za procenu imenuju šta je detetu teško. Kako bi izgledao špil koji za svaku od tih radnji imenuje predmet na kom se ona vežba — napravljiv kod kuće, ove nedelje?'),
    move: t('Take one published screening domain, list its items, and design one object per item. Then ask a therapist which three are wrong.', 'Uzmi jednu objavljenu oblast procene, ispiši njene stavke i projektuj po jedan predmet za svaku. Pa pitaj terapeuta koja su tri pogrešna.'),
    evidence: t('A domain-to-object table, the therapist’s corrections, and the cost of each object in what a household throws away.', 'Tabela oblast → predmet, ispravke terapeuta i cena svakog predmeta u onome što domaćinstvo baca.'),
    source: { label: 'NY State EI — list of developmental assessment instruments', url: 'https://health.ny.gov/community/infants_children/early_intervention/docs/2025-01_list_developmental_assessment_instruments.pdf' }
  },
  {
    id: 'rotation-in-the-hand', status: 'research', field: 'children', principles: [2, 3, 4, 6],
    title: t('Mental rotation that happens in the hand first', 'Mentalna rotacija koja se prvo dogodi u ruci'),
    bridge: t('cognitive task ↔ physical manipulative', 'kognitivni zadatak ↔ predmet u ruci'),
    question: t('Rotation tests put the turn on paper. What changes when the child turns the thing instead — and does the gain survive leaving the object behind?', 'Testovi rotacije stavljaju okretanje na papir. Šta se menja kad dete okrene samu stvar — i da li dobitak preživi kad predmet ostane iza?'),
    move: t('Build one shape in three versions — on paper, as a screen task, as a thing that turns — and run the same question on all three.', 'Napravi jedan oblik u tri verzije — na papiru, kao zadatak na ekranu, kao stvar koja se okreće — i postavi isto pitanje na sve tri.'),
    evidence: t('Time to answer, error on mirrored items, and whether the child turns their own head or the object.', 'Vreme do odgovora, greška na ogledalski obrnutim stavkama i da li dete okreće sopstvenu glavu ili predmet.'),
    source: { label: 'Gilligan-Lee et al., Hands-on — Child Development 2023', url: 'https://srcd.onlinelibrary.wiley.com/doi/10.1111/cdev.13963' }
  },
  {
    id: 'home-is-the-first-plan', status: 'candidate', field: 'children', principles: [3, 4, 7],
    title: t('The home is a child’s first floor plan', 'Dom je prvi crtež osnove koji dete napravi'),
    bridge: t('child cognition ↔ architectural drawing', 'dečje saznanje ↔ arhitektonski crtež'),
    question: t('A child’s mental map is built outward from the home, and by about seven they can draw it from memory. Is the floor plan a notation children already own, and we merely formalise?', 'Dečja mentalna mapa gradi se od doma nadalje, a oko sedme godine dete može da je nacrta po sećanju. Da li je osnova zapis koji deca već imaju, a mi ga samo formalizujemo?'),
    move: t('Collect drawn home maps from one age range, then put the same rooms in front of them as a model and record what moves.', 'Prikupi crtane mape doma iz jednog uzrasnog raspona, pa im iste prostorije stavi pred oči kao maketu i zabeleži šta se pomeri.'),
    evidence: t('Landmarks before relations, the order things are drawn in, and what the child says is missing from your model.', 'Orijentiri pre odnosa, redosled kojim se stvari crtaju i ono što dete kaže da u tvojoj maketi nedostaje.'),
    source: { label: 'Children’s spatial representation of their neighbourhood — J. Environmental Psychology', url: 'https://www.sciencedirect.com/science/article/pii/S0272494482800169/pdf' }
  },
  {
    id: 'primer-of-space', status: 'spark', field: 'children', principles: [1, 2, 3],
    title: t('A primer that teaches space without saying so', 'Bukvar koji uči prostor a da to ne kaže'),
    bridge: t('literacy primer ↔ spatial curriculum', 'bukvar ↔ nastavni program prostora'),
    question: t('A reading primer teaches letters while telling a story. What is the equivalent object for space — one that teaches rotation, scale and containment while a child is only playing?', 'Bukvar uči slova dok priča priču. Koji je ekvivalentan predmet za prostor — onaj koji uči rotaciju, razmeru i sadržavanje dok se dete samo igra?'),
    move: t('Write the table of contents first, as operations rather than chapters, then design one page — one object — for the hardest one.', 'Prvo napiši sadržaj, kao radnje a ne kao poglavlja, pa projektuj jednu stranu — jedan predmet — za najtežu.'),
    evidence: t('An age ladder from a published trajectory, and one object per rung that an adult can build in an afternoon.', 'Lestvica uzrasta iz objavljene putanje učenja i po jedan predmet za svaku prečagu, koji odrasla osoba napravi za jedno popodne.'),
    source: { label: 'Spatial Reasoning Toolkit — trajectory from birth to seven', url: 'https://earlymaths.org/spatial-reasoning/' }
  },
  {
    id: 'association-as-maker', status: 'candidate', field: 'collaboration', principles: [1, 2, 5],
    title: t('The association is the manufacturer, not the beneficiary', 'Udruženje je proizvođač, a ne korisnik'),
    bridge: t('student project ↔ real production', 'studentski projekat ↔ stvarna proizvodnja'),
    question: t('What has to be true of a student drawing for the association to build fifty of them, repair them, and tell us which three designs were wrong?', 'Šta mora da važi za studentski crtež da bi udruženje napravilo pedeset komada, popravljalo ih i reklo nam koja su tri rešenja bila pogrešna?'),
    move: t('Write the drawing as an instruction sheet for someone who is not a maker, then watch one be built from it without you speaking.', 'Napiši crtež kao uputstvo za nekoga ko nije majstor, pa gledaj kako se po njemu pravi jedan komad, a da ti ne progovoriš.'),
    evidence: t('Build time, the questions asked out loud, the parts substituted, and what broke in the first month.', 'Vreme izrade, pitanja izgovorena naglas, zamenjeni delovi i ono što se pokvarilo u prvom mesecu.'),
    source: { label: 'Inclusive Play Design Guide', url: 'https://www.accessibleplayground.net/wp-content/uploads/2016/05/Inclusive-Play-Design-Guide-LowRes-2.pdf' }
  }
];

export const ideaById = id => IDEA_BANK.find(idea => idea.id === id);

export function filterIdeas({ status = 'all', field = 'all', principle = 'all', query = '' } = {}) {
  const needle = String(query).trim().toLocaleLowerCase('sr-Latn');
  return IDEA_BANK.filter(idea => {
    if (status !== 'all' && idea.status !== status) return false;
    if (field !== 'all' && idea.field !== field) return false;
    if (principle !== 'all' && !idea.principles.includes(Number(principle))) return false;
    if (!needle) return true;
    const haystack = [idea.title.en, idea.title.sr, idea.bridge.en, idea.bridge.sr, idea.question.en, idea.question.sr]
      .join(' ').toLocaleLowerCase('sr-Latn');
    return haystack.includes(needle);
  });
}

export function connectIdeas(firstId, secondId, language = 'sr') {
  const first = ideaById(firstId);
  const second = ideaById(secondId);
  if (!first || !second || first.id === second.id) return null;
  const sr = language === 'sr';
  const pick = value => value[sr ? 'sr' : 'en'];
  const shared = first.principles.filter(number => second.principles.includes(number));
  return {
    title: `${pick(first.title)} × ${pick(second.title)}`,
    relation: `${pick(first.bridge)} + ${pick(second.bridge)}`,
    question: sr
      ? `Šta postaje moguće kada ideja „${first.title.sr}” pozajmi pravilo od ideje „${second.title.sr}”?`
      : `What becomes possible when “${first.title.en}” borrows a rule from “${second.title.en}”?`,
    move: sr
      ? `Na jednom A3 prikaži dve početne ideje, njihov zajednički princip i jednu novu odluku. Prvi potez: ${first.move.sr} Zatim: ${second.move.sr}`
      : `On one A3, show the two starting ideas, their shared principle and one new decision. First move: ${first.move.en} Then: ${second.move.en}`,
    evidence: `${pick(first.evidence)} + ${pick(second.evidence)}`,
    principles: shared,
    guardrail: sr
      ? 'Ovo je radna hipoteza i još nije nastavni zadatak. U radnu nedelju ulazi tek kada dobije izvor, jasan ishod i proverljiv kriterijum.'
      : 'This is a working hypothesis, not an assignment. It enters a teaching week only after it has a source, a clear outcome and a testable criterion.'
  };
}
