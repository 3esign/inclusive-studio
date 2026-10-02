// Day one: design a toy. Paper is the hand-in; this page is the scaffold around it.
// The three decks are the method the association's director described — cards that hold a task —
// turned the other way round: here they do not sort children, they constrain the designer.
// Sources for every number and claim on this page are in assets/research.js (Creative hub).

import { $, $$, esc, tr, tx, read, save, announce, download, mount, arrow } from './core.js';

/* The object we start from, measured from the photographs taken at the association on 02.10.2026.
   Dimensions are stated as the ranges of the standard parts, not as a survey of that one toy. */
const REFERENCE = {
  title: { en: 'The toy that already exists', sr: 'Igračka koja već postoji' },
  body: {
    en: 'A cardboard carton with one side removed. Bamboo skewers (⌀ about 3 mm, 20–25 cm long) pushed through both walls so they span the opening. Plastic bottle caps (⌀ 28–38 mm) glued back to back in pairs and threaded onto the skewers, where they slide left and right and spin. Colours: blue, white, violet, yellow, red, green, orange. Total cost: packaging waste, a pack of skewers and hot glue.',
    sr: 'Kartonska kutija kojoj je jedna strana uklonjena. Štapići za ražnjiće (⌀ oko 3 mm, dužine 20–25 cm) probodeni kroz obe stranice tako da premošćuju otvor. Plastični čepovi od flaša (⌀ 28–38 mm) slepljeni leđa uz leđa u parove i nanizani na štapiće, po kojima klize levo-desno i okreću se. Boje: plava, bela, ljubičasta, žuta, crvena, zelena, narandžasta. Ukupna cena: otpad od ambalaže, paklo štapića i topli lepak.'
  },
  reading: [
    { en: 'Hand: pincer grip on a 30 mm disc, both hands at once, the arm crossing the body’s midline to reach the far rod.', sr: 'Ruka: pincetni hvat na disku od 30 mm, obe ruke istovremeno, ruka koja prelazi srednju liniju tela da bi stigla do daljeg štapića.' },
    { en: 'Space: order along a line, left and right, near rod and far rod, the same colour found on another row — and rotation, because a cap turns while it travels.', sr: 'Prostor: red duž linije, levo i desno, bliži i dalji štapić, ista boja nađena u drugom redu — i rotacija, jer se čep okreće dok putuje.' },
    { en: 'What it does not do: it does not score, it does not name a diagnosis, and it does not stop a second child from playing on the other side of the same box.', sr: 'Šta ne radi: ne boduje, ne imenuje dijagnozu i ne sprečava drugo dete da se igra sa druge strane iste kutije.' }
  ]
};

/* Deck one — the hand. Movements an occupational therapist would name, not adjectives. */
const HAND = [
  { id: 'pincer', en: 'Pincer grip: thumb and index finger on something thinner than 10 mm.', sr: 'Pincetni hvat: palac i kažiprst na nečemu tanjem od 10 mm.' },
  { id: 'both-hands', en: 'Both hands at once, doing two different things: one holds, one acts.', sr: 'Obe ruke istovremeno, a svaka radi svoje: jedna drži, druga dela.' },
  { id: 'midline', en: 'The hand must cross the midline of the body to finish the move.', sr: 'Ruka mora da pređe srednju liniju tela da bi dovršila potez.' },
  { id: 'release', en: 'Controlled release: letting go at a chosen moment, not dropping.', sr: 'Kontrolisano puštanje: ispuštanje u izabranom trenutku, a ne ispadanje.' },
  { id: 'aim', en: 'Aim: the hand arrives at a target smaller than the object it carries.', sr: 'Nišanjenje: ruka stiže na metu manju od predmeta koji nosi.' },
  { id: 'rotate-wrist', en: 'Forearm rotation: the palm must turn over for the piece to fit.', sr: 'Rotacija podlaktice: dlan mora da se okrene da bi deo ušao.' },
  { id: 'force', en: 'Graded force: it works gently and breaks if pushed hard.', sr: 'Doziranje sile: radi nežno, a popušta ako se gurne jako.' },
  { id: 'one-hand', en: 'It must be fully playable with one hand only.', sr: 'Mora da bude potpuno upotrebljiva samo jednom rukom.' }
];

/* Deck two — space. Operations, in the vocabulary of spatial reasoning research. */
const SPACE = [
  { id: 'mental-rotation', en: 'Mental rotation: the same piece has to be recognised after a turn.', sr: 'Mentalna rotacija: isti deo mora da se prepozna posle okretanja.' },
  { id: 'composition', en: 'Composition: two pieces together make a third shape.', sr: 'Sastavljanje: dva dela zajedno daju treći oblik.' },
  { id: 'perspective', en: 'Perspective taking: what the child sees differs from what the person opposite sees.', sr: 'Zauzimanje tuđe tačke gledišta: dete i osoba naspram njega ne vide isto.' },
  { id: 'order', en: 'Order along a line: before, after, between.', sr: 'Red duž linije: pre, posle, između.' },
  { id: 'inside-outside', en: 'Containment: inside, outside, through, behind.', sr: 'Sadržavanje: unutra, spolja, kroz, iza.' },
  { id: 'scale', en: 'Scale: the same thing exists small and large and stays the same thing.', sr: 'Razmera: ista stvar postoji mala i velika i ostaje ista stvar.' },
  { id: 'map', en: 'Map: a flat drawing stands for the solid thing in front of the child.', sr: 'Mapa: ravan crtež zamenjuje telo koje stoji pred detetom.' },
  { id: 'symmetry', en: 'Symmetry and mirroring: the left piece is not the right piece.', sr: 'Simetrija i ogledanje: levi deo nije isto što i desni.' }
];

/* Deck three — the second child. The toy is never an apparatus for one kind of body. */
const BESIDE = [
  { id: 'no-sight', en: 'A child who does not look at it: it has to be readable by hand and by sound.', sr: 'Dete koje je ne gleda: mora da se čita rukom i zvukom.' },
  { id: 'no-speech', en: 'A child who does not speak: the turn has to be taken without a word.', sr: 'Dete koje ne govori: red na potez mora da se preuzme bez reči.' },
  { id: 'seated', en: 'A child seated in a wheelchair at the same table: everything within 40 cm of the edge.', sr: 'Dete u kolicima za istim stolom: sve u pojasu od 40 cm od ivice stola.' },
  { id: 'younger', en: 'A younger sibling, under three: nothing may fit whole into the ⌀31,7 mm cylinder.', sr: 'Mlađi brat ili sestra, ispod tri godine: ništa ne sme celo da stane u cilindar ⌀31,7 mm.' },
  { id: 'overload', en: 'A child who withdraws when it is loud: there must be a quiet way to play it.', sr: 'Dete koje se povlači kad je bučno: mora da postoji tih način igre.' },
  { id: 'tremor', en: 'A child whose hand does not hold still: the piece must not be lost when it is dropped.', sr: 'Dete čija ruka ne miruje: deo ne sme da se izgubi kad ispadne.' },
  { id: 'adult', en: 'The adult who made it: they must be able to repair it in five minutes.', sr: 'Odrasla osoba koja ju je napravila: mora da je popravi za pet minuta.' }
];

/* The gate before the sheet leaves the table. Each line is a yes or a stated exception. */
const GATE = [
  { id: 'small-parts', en: 'No loose part fits entirely inside the ⌀31,7 mm cylinder (depth 25,4–57,1 mm), or the sheet states the toy is not for under-threes.', sr: 'Nijedan odvojiv deo ne staje ceo u cilindar ⌀31,7 mm (dubina 25,4–57,1 mm), ili list izričito kaže da igračka nije za uzrast ispod tri godine.' },
  { id: 'ends', en: 'No sharp end, no splinter, no point: a skewer is cut and capped at both ends.', sr: 'Nema oštrog kraja, iverja ni šiljka: štapić je skraćen i zatvoren na oba kraja.' },
  { id: 'string', en: 'No cord longer than 22 cm anywhere near a neck.', sr: 'Nigde blizu vrata nema uzice duže od 22 cm.' },
  { id: 'clean', en: 'It can be wiped or washed, and it survives being wiped.', sr: 'Može da se obriše ili opere i to preživljava.' },
  { id: 'repair', en: 'Every part is replaceable with another piece of rubbish of the same size.', sr: 'Svaki deo se zamenjuje drugim komadom otpada iste veličine.' },
  { id: 'two-children', en: 'Two children with different bodies can play at the same time, at the same table.', sr: 'Dvoje dece različitih tela mogu da se igraju istovremeno, za istim stolom.' },
  { id: 'observable', en: 'The sheet states one thing you would see a child do if it worked.', sr: 'Na listu stoji jedna stvar koju bi video da dete uradi ako igračka radi.' },
  { id: 'no-diagnosis', en: 'No diagnosis is written anywhere on the sheet.', sr: 'Nijedna dijagnoza nije upisana na listu.' }
];

const FIELDS = [
  { id: 'name', en: 'What the toy is, in one sentence a parent would repeat', sr: 'Šta je igračka, u jednoj rečenici koju bi roditelj ponovio', rows: 2 },
  { id: 'parts', en: 'Parts and materials — what was thrown away to make each one', sr: 'Delovi i materijali — šta je bačeno da bi svaki nastao', rows: 3 },
  { id: 'observable', en: 'What you would see a child do if it worked (not “it develops”)', sr: 'Šta bi video da dete uradi ako radi (ne „razvija”)', rows: 2 },
  { id: 'refuses', en: 'What the toy refuses to do, on purpose', sr: 'Šta igračka namerno odbija da radi', rows: 2 },
  { id: 'after', en: 'The hard part: who uses the result, and on what day, after the assessment is over', sr: 'Teži deo: ko koristi rezultat i kog dana, kad se procena završi', rows: 3 }
];

let state = {
  hand: read('toy-hand', '') || '',
  space: read('toy-space', '') || '',
  beside: read('toy-beside', '') || '',
  gate: read('toy-gate', {}) || {}
};

const card = (deck, id) => deck.find(item => item.id === id);
const label = item => esc(tr(item.en, item.sr));

function deckBox(key, deck, titleEn, titleSr, helpEn, helpSr) {
  const drawn = card(deck, state[key]);
  return `<section class="card-box" aria-labelledby="deck-${key}">
  <h2 id="deck-${key}">${tr(titleEn, titleSr)}</h2>
  ${drawn
    ? `<blockquote class="constraint"><p>${label(drawn)}</p></blockquote>`
    : `<p class="help">${tr(helpEn, helpSr)}</p>`}
  <div class="actions"><button type="button" class="button signal" data-deck="${key}">${drawn ? tr('Draw another', 'Izvuci drugu') : tr('Draw a card', 'Izvuci karticu')}</button>
  <details class="all-cards"><summary>${tr('See the whole deck', 'Vidi ceo špil')} (${deck.length})</summary><ul>${deck.map(item => `<li>${label(item)}</li>`).join('')}</ul></details></div>
  </section>`;
}

function brief() {
  return `<section class="brief-sheet">
  <h2>${tr('What is handed in', 'Šta se predaje')}</h2>
  <ol class="deliverables">
    <li>${tr('One A3: the toy drawn at 1:1 or 1:2, with real dimensions written on it.', 'Jedan A3: igračka nacrtana 1:1 ili 1:2, sa upisanim stvarnim merama.')}</li>
    <li>${tr('An exploded view: every part, and the material each part was before it was a part.', 'Razloženi prikaz: svaki deo i materijal koji je taj deo bio pre nego što je postao deo.')}</li>
    <li>${tr('One sentence naming the hand movement, one naming the spatial operation — the two cards you drew.', 'Jedna rečenica koja imenuje pokret ruke, jedna koja imenuje radnju nad prostorom — dve kartice koje si izvukao.')}</li>
    <li>${tr('The second child: how somebody with a different body plays at the same table at the same time.', 'Drugo dete: kako neko sa drugačijim telom igra za istim stolom u isto vreme.')}</li>
    <li>${tr('The observable: one thing you would see a child do if the toy worked.', 'Posmatriv znak: jedna stvar koju bi video da dete uradi ako igračka radi.')}</li>
    <li>${tr('The small-parts check marked on every loose part: ⌀31,7 mm, depth 25,4–57,1 mm.', 'Provera sitnih delova označena na svakom odvojivom delu: ⌀31,7 mm, dubina 25,4–57,1 mm.')}</li>
  </ol>
  <h2>${tr('When it passes', 'Kada prolazi')}</h2>
  <ul class="rule-list">
    <li>${tr('A toy only one kind of child can use fails. A separate apparatus announces who it was not built for.', 'Igračka koju može da koristi samo jedna vrsta deteta pada. Odvojena sprava objavljuje za koga nije pravljena.')}</li>
    <li>${tr('“It develops the child” fails. Name what you would see, in a room, on a Tuesday.', '„Razvija dete” pada. Imenuj šta bi video, u sobi, u utorak.')}</li>
    <li>${tr('A toy that cannot be built from rubbish in one afternoon fails. Cost is part of access.', 'Igračka koja ne može da se napravi od otpada za jedno popodne pada. Cena je deo pristupačnosti.')}</li>
    <li>${tr('A diagnosis written on the sheet fails. We design for a body doing something, not for a label.', 'Dijagnoza upisana na listu pada. Projektujemo za telo koje nešto radi, a ne za oznaku.')}</li>
  </ul>
  <div class="notice"><p>${tr('Why a toy, on an architecture course: it is the smallest building we design. It has a structure, a material, a cost, a user who was not consulted, and a rule about who may enter. Everything the course does later to a hillside, you do today to a cardboard box.', 'Zašto igračka, na predmetu iz arhitekture: ona je najmanja građevina koju projektujemo. Ima konstrukciju, materijal, cenu, korisnika koji nije pitan i pravilo o tome ko sme da uđe. Sve što predmet kasnije radi sa padinom, danas radiš sa kartonskom kutijom.')}</p></div>
  </section>`;
}

function referenceBox() {
  return `<section class="brief-sheet reference-toy" aria-labelledby="reference-title">
  <h2 id="reference-title">${tr(REFERENCE.title.en, REFERENCE.title.sr)}</h2>
  <p>${esc(tx(REFERENCE.body))}</p>
  <ul class="rule-list">${REFERENCE.reading.map(item => `<li>${label(item)}</li>`).join('')}</ul>
  <p class="help">${tr('Made at the association “Živimo zajedno”. Dimensions are the ranges of the standard parts — a bottle cap, a skewer — not a survey of that one object.', 'Napravljeno u udruženju „Živimo zajedno”. Mere su rasponi standardnih delova — čep, štapić — a ne snimak tog jednog predmeta.')}</p>
  </section>`;
}

function gateBox() {
  const done = GATE.filter(item => state.gate[item.id]).length;
  return `<section class="task-notes" aria-labelledby="gate-title">
  <h2 id="gate-title">${tr('Before the sheet leaves the table', 'Pre nego što list ode sa stola')} <span class="tag">${done}/${GATE.length}</span></h2>
  ${GATE.map(item => `<label class="check-line"><input type="checkbox" data-gate="${item.id}"${state.gate[item.id] ? ' checked' : ''}> ${label(item)}</label>`).join('')}
  <p class="help">${tr('An unticked line is not a failure — it is a sentence you owe the sheet: say what you traded away and why.', 'Nepotvrđen red nije pad — to je rečenica koju duguješ listu: napiši čega si se odrekao i zašto.')}</p>
  </section>`;
}

function notes() {
  return `<section class="task-notes" aria-labelledby="notes-title"><h2 id="notes-title">${tr('A short account of the toy', 'Kratak opis igračke')}</h2>
  ${FIELDS.map(field => `<div class="lab-field"><label for="field-${field.id}">${label(field)}</label><textarea id="field-${field.id}" rows="${field.rows}">${esc(read('toy-' + field.id, '') || '')}</textarea></div>`).join('')}
  <div class="actions"><button type="button" id="save-notes">${tr('Keep in this browser', 'Zadrži u pregledaču')}</button><button type="button" id="export-toy">${tr('Download the sheet', 'Preuzmi list')}</button><a class="button secondary" href="ideja.html">${tr('Continue in the creative hub', 'Nastavi u creative hubu')} ${arrow}</a></div>
  <p class="help" id="notes-status" role="status">${tr('Text stays in this browser if it allows storage. The A3 on paper is the hand-in; this page never receives it.', 'Tekst ostaje u ovom pregledaču ako dopušta čuvanje. A3 na papiru je predaja; ova strana ga nikada ne prima.')}</p></section>`;
}

function evidenceBox() {
  return `<section class="brief-sheet" aria-labelledby="evidence-title">
  <h2 id="evidence-title">${tr('Why this is not an arts and crafts hour', 'Zašto ovo nije čas ručnog rada')}</h2>
  <ul class="rule-list">
    <li>${tr('Spatial skill is not fixed. A meta-analysis of 217 training studies puts the average gain at g = 0,47; the gain survives the delay to a later test and shows up on spatial tasks that were never trained. Children gain most.', 'Prostorna sposobnost nije data jednom zauvek. Meta-analiza 217 studija obuke daje prosečan dobitak g = 0,47; dobitak preživljava pauzu do kasnijeg testiranja i pojavljuje se na prostornim zadacima koji nisu vežbani. Deca dobijaju najviše.')} <span class="muted small">Uttal et al., Psychological Bulletin 139(2), 2013</span></li>
    <li>${tr('Things in the hand matter. In spatial training with 6–8-year-olds, physical manipulatives were tested against the same task on a screen — which is the argument for a box of caps rather than an application.', 'Predmet u ruci nije svejedno. U obuci prostornog mišljenja sa decom od 6 do 8 godina fizički predmeti poređeni su sa istim zadatkom na ekranu — to je razlog za kutiju sa čepovima umesto aplikacije.')} <span class="muted small">Gilligan-Lee et al., Child Development, 2023</span></li>
    <li>${tr('Transfer to mathematics is contested. Some trials find it, others train rotation successfully and find no transfer. So a toy is justified by what it does today, not by a promise about school results.', 'Prenos na matematiku je sporan. Jedni ogledi ga nalaze, drugi uspešno uvežbaju rotaciju i ne nađu prenos. Zato se igračka brani onim što radi danas, a ne obećanjem o uspehu u školi.')} <span class="muted small">Hawes et al. 2015 · Gilligan et al. 2020</span></li>
    <li>${tr('Simulation is not a method. Blindfolds and borrowed wheelchairs raise pity and discomfort without raising willingness to work on access. We test tools and objects, never other people’s lives.', 'Simulacija nije metod. Povez na očima i pozajmljena kolica podižu sažaljenje i nelagodu, a ne spremnost da se radi na pristupačnosti. Proveravamo alate i predmete, nikad tuđe živote.')} <span class="muted small">Nario-Redmond et al., Rehabilitation Psychology, 2017</span></li>
  </ul>
  <p class="help">${tr('Full entries, with links and with what each one does not say, are in the creative hub.', 'Puni zapisi, sa vezama i sa onim što svaki od njih ne tvrdi, nalaze se u creative hubu.')} <a href="ideja.html">${tr('Creative hub', 'Creative hub')} →</a></p>
  </section>`;
}

function render() {
  $('#main').innerHTML = `<div class="page-top"><div><p class="eyebrow">${tr('Week 1 / Day one / By hand', 'Nedelja 1 / Prvi dan / Rukom')}</p><h1>${tr('A toy<br>that teaches space.', 'Igračka<br>koja uči prostor.')}</h1><p class="lede">${tr('Not a toy for a diagnosis, and not a therapy device. One object that trains a movement of the hand and an operation on space at the same time, built from what a household throws away, playable by two different children at one table.', 'Ne igračka za dijagnozu i ne terapijsko pomagalo. Jedan predmet koji istovremeno vežba pokret ruke i radnju nad prostorom, napravljen od onoga što domaćinstvo baca, a za njim mogu dvoje različite dece za istim stolom.')}</p>
  <div class="actions"><a class="button secondary" href="index.html">${tr('Back to the week', 'Natrag na nedelju')}</a><a class="button secondary" href="assets/sablon-a3.svg" download>${tr('A3 template', 'A3 šablon')} ↓</a><a class="button secondary" href="vezbe.html#ex-toy-for-coordination">${tr('All exercises', 'Sve vežbe')}</a></div></div>
  <div class="page-meta"><span class="meta-label">${tr('Time', 'Vreme')}</span><span>${tr('90 minutes in the studio', '90 minuta u studiju')}</span><span class="meta-label">${tr('Medium', 'Medij')}</span><span>${tr('pencil, A3, the parts in your hand', 'olovka, A3, delovi u ruci')}</span></div></div>
  <div class="atelier-rule"><strong>${tr('The course record is the A3 on paper.', 'Evidencija na predmetu je A3 na papiru.')}</strong> ${tr('Write your name, index and week on it; the teacher reviews and signs it at the end of class. This site does not receive or grade the sheet.', 'Upiši ime, indeks i nedelju; nastavnik ga pregleda i potpisuje na kraju časa. Sajt ne prima niti ocenjuje list.')}</div>
  ${referenceBox()}${brief()}
  <div class="deck-row">
  ${deckBox('hand', HAND, 'The hand', 'Ruka', 'Draw one. The movement is given, not chosen: a constraint you chose is a preference.', 'Izvuci jednu. Pokret se dobija, ne bira: ograničenje koje si izabrao je ukus.')}
  ${deckBox('space', SPACE, 'The space', 'Prostor', 'Draw one. This is the operation the toy must make the child perform on space.', 'Izvuci jednu. To je radnja koju igračka mora da izazove kod deteta, nad prostorom.')}
  ${deckBox('beside', BESIDE, 'Beside, at the same table', 'Pored, za istim stolom', 'Draw one. Somebody else is playing too, and they are not an afterthought.', 'Izvuci jednu. Neko drugi se takođe igra, i nije naknadna misao.')}
  </div>
  ${gateBox()}${notes()}${evidenceBox()}`;
  bind();
}

function bind() {
  $$('[data-deck]').forEach(button => button.addEventListener('click', () => {
    const key = button.dataset.deck;
    const deck = { hand: HAND, space: SPACE, beside: BESIDE }[key];
    const pool = deck.filter(item => item.id !== state[key]);
    const picked = pool[Math.floor(Math.random() * pool.length)];
    state[key] = picked.id;
    save('toy-' + key, picked.id);
    render();
    $(`[data-deck="${key}"]`)?.focus();
    announce(tr(picked.en, picked.sr));
  }));

  $$('[data-gate]').forEach(box => box.addEventListener('change', event => {
    state.gate = { ...state.gate, [box.dataset.gate]: event.target.checked };
    save('toy-gate', state.gate);
    const done = GATE.filter(item => state.gate[item.id]).length;
    const tag = $('#gate-title .tag');
    if (tag) tag.textContent = `${done}/${GATE.length}`;
  }));

  $('#save-notes')?.addEventListener('click', () => {
    let ok = true;
    for (const field of FIELDS) ok = save('toy-' + field.id, $('#field-' + field.id).value.trim()) && ok;
    $('#notes-status').textContent = ok
      ? tr('Kept in this browser only. Not a hand-in.', 'Zadržano samo u ovom pregledaču. Nije predaja.')
      : tr('This browser refused to store it. Download the sheet instead.', 'Pregledač je odbio čuvanje. Preuzmi list.');
  });

  $('#export-toy')?.addEventListener('click', () => {
    const drawn = [['The hand', 'Ruka', card(HAND, state.hand)], ['The space', 'Prostor', card(SPACE, state.space)], ['Beside', 'Pored', card(BESIDE, state.beside)]];
    const lines = [`# ${tr('A toy that teaches space', 'Igračka koja uči prostor')}`, '', `${tr('Week', 'Nedelja')} 1 · ${new Date().toISOString().slice(0, 10)}`, ''];
    for (const [en, sr, item] of drawn) lines.push(`**${tr(en, sr)}:** ${item ? tr(item.en, item.sr) : '—'}`, '');
    for (const field of FIELDS) lines.push(`## ${tr(field.en, field.sr)}`, ($('#field-' + field.id).value.trim() || '—'), '');
    lines.push(`## ${tr('Gate', 'Kapija')}`, '');
    for (const item of GATE) lines.push(`- [${state.gate[item.id] ? 'x' : ' '}] ${tr(item.en, item.sr)}`);
    lines.push('', `_${tr('The toy is drawn by hand on A3. This file is the text that goes with it.', 'Igračka se crta rukom na A3. Ovaj fajl je tekst koji ide uz nju.')}_`);
    download('igracka-01.md', lines.join('\n'), 'text/markdown;charset=utf-8');
  });
}

mount({ view: 'toy', render, title: () => tr('A toy that teaches space', 'Igračka koja uči prostor') });
