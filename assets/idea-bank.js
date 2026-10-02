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
  { id: 'collaboration', label: t('Collaboration', 'Saradnja') }
];

export const IDEA_BANK = [
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
