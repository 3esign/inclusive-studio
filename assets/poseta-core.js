import { publicPhoto } from './photo-publication.js';
// The association visit as course material: one visit register (data/poseta.json) and the
// prototype register's observations feed the held page panel and the analysis page.
// The same renderer serves the static baseline and the live view; nothing is retold by hand.
// Participants' names live only in the visit register — never as literals in this source.

import { esc, tr, tx, number } from './core.js';
import { photograph } from './prototipovi-core.js';

const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const STUDENT = /^\d{1,4}\/\d{2}(?:\d{2})?$/;
const PHOTO = /^data\/prototipovi\/[a-z0-9-]+\/[a-z0-9-]+\.jpg$/;
const SHA = /^[a-f0-9]{64}$/;
const date = v => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) && Number.isFinite(Date.parse(v)) && new Date(v).toISOString().slice(0, 10) === v;
const bilingual = v => v && typeof v === 'object' && !Array.isArray(v) && typeof v.sr === 'string' && v.sr.trim() && typeof v.en === 'string' && v.en.trim();
const keys = (obj, allowed) => obj && typeof obj === 'object' && !Array.isArray(obj) && Object.keys(obj).every(k => allowed.includes(k));

export function validateVisit(visit) {
  const problems = [];
  const fail = (condition, message) => { if (!condition) problems.push(message); };
  fail(visit?.schema === 'course-visit/v1', 'Unknown visit register schema.');
  fail(keys(visit, ['schema', 'id', 'week', 'occurredOn', 'place', 'source', 'participants', 'summary', 'photos', 'findings']), 'Unknown visit register fields.');
  fail(ID.test(visit?.id || ''), 'Visit id required.');
  fail(Number.isInteger(visit?.week) && visit.week > 0, 'Visit week must be a positive integer.');
  fail(date(visit?.occurredOn), 'Visit needs an actual date.');
  fail(bilingual(visit?.place) && bilingual(visit?.summary), 'Visit place and summary must be bilingual.');
  fail(keys(visit?.source, ['id', 'recordedOn', 'description']) && ID.test(visit.source?.id || '') && date(visit.source?.recordedOn) && bilingual(visit.source?.description), 'Visit source requires an id, a record date and a bilingual description.');
  fail(Array.isArray(visit?.participants) && visit.participants.length > 0, 'Visit participants required.');
  const names = new Set();
  for (const person of visit?.participants || []) {
    fail(keys(person, ['name', 'studentNumber']) && typeof person.name === 'string' && person.name.trim() && STUDENT.test(person.studentNumber || ''), 'Each participant needs exactly a name and a student number.');
    fail(!names.has(person?.name), 'Duplicate participant name.');
    names.add(person?.name);
  }
  // Scenes of the visit: photographs of the day that belong to no single registered work.
  // Same rule as the work register: fingerprint and dimensions from the final file, bilingual alt and caption.
  const sceneSrc = new Set();
  if (visit.photos !== undefined) fail(Array.isArray(visit.photos), 'Visit photos must be a list.');
  for (const p of visit?.photos || []) {
    const label = 'Visit photo ' + (p?.id || '?');
    fail(keys(p, ['id', 'src', 'sha256', 'width', 'height', 'alt', 'caption', 'sourceId', 'radovi']), label + ': unknown photo fields.');
    // 24.10.2026: a frame names the work or works recognised in it, so the visit and the
    // work register point at each other. Recognition is a human claim about the picture —
    // the fingerprint proves the file, never what the picture shows.
    fail(p?.radovi === undefined || (Array.isArray(p.radovi) && p.radovi.length > 0 && p.radovi.every(id => ID.test(id || ''))), label + ': radovi must be a non-empty list of work ids.');
    fail(ID.test(p?.id || ''), label + ': id required.');
    fail(PHOTO.test(p?.src || '') && !sceneSrc.has(p.src), label + ': unique local photograph path required.');
    sceneSrc.add(p.src);
    fail(SHA.test(p?.sha256 || ''), label + ': photograph fingerprint required.');
    fail(Number.isInteger(p?.width) && p.width > 0 && Number.isInteger(p?.height) && p.height > 0, label + ': image dimensions required.');
    fail(bilingual(p?.alt) && bilingual(p?.caption), label + ': bilingual alt and caption required.');
    fail(p?.sourceId === visit?.source?.id, label + ': sourceId must point at the visit source.');
  }
  if (visit.findings !== undefined) {
    fail(Array.isArray(visit.findings), 'Visit findings must be a list.');
    const photoIds = new Set((visit.photos || []).map(p => p.id));
    for (const f of visit.findings || []) {
      fail(keys(f, ['title', 'photoIds', 'seen', 'next', 'work']) && bilingual(f.title) && bilingual(f.seen) && bilingual(f.next), 'Finding needs bilingual title, observation and proposed next step.');
      fail(Array.isArray(f.photoIds) && f.photoIds.length > 0 && f.photoIds.every(id => photoIds.has(id)), 'Finding must cite photographs in this visit.');
      // A finding about one work names it; a finding across the set names none.
      fail(f.work === undefined || ID.test(f.work || ''), 'A finding about one work names it by its work id.');
      fail(f.work === undefined || f.photoIds.every(id => ((visit.photos || []).find(p => p.id === id)?.radovi || []).includes(f.work)), 'A work finding may only cite frames in which that work was recognised.');
    }
  }
  return problems;
}

const srDate = iso => iso.split('-').reverse().join('.');

/* ---------- the lead on the held page: standing rule, course lead 12.10.2026 ----------
   The newest association material opens the held page: summary and photographs first,
   the participants discreetly, one door to the full analysis. */
export function renderVisitLead(visit, prototypes) {
  if (validateVisit(visit).length) throw new Error('Invalid visit register.');
  const photoById = new Map((prototypes?.observations || []).flatMap(o => (o.photos || []).map(ph => [ph.id, ph])));
  const picks = ['poseta-2026-10-09-zmijica-1', 'poseta-2026-10-09-upadalica-1', 'poseta-2026-10-09-muzicka-kutija-2']
    .map(id => photoById.get(id)).filter(Boolean).slice(0, 3);
  const items = visit.participants.map(person =>
    `<li><span data-participant-name>${esc(person.name)}</span><span data-participant-number>${esc(person.studentNumber)}</span></li>`).join('');
  return `<section class="field-visit visit-lead" aria-labelledby="visit-lead-title">
  <p class="eyebrow" id="visit-lead-title">${tr('Association visit', 'Poseta udruženju')} · <time datetime="${esc(visit.occurredOn)}">${esc(srDate(visit.occurredOn))}.</time></p>
  <p>${tr('The users took the brought prototypes in their hands at the table, without a word of guidance. What the hands did with each work, what that means and what each prototype gains next stand on the analysis page.',
          'Korisnici su donete prototipove uzeli u ruke za stolom, bez ijedne reči usmeravanja. Šta su ruke radile sa svakim radom, šta to znači i šta dobija svaki prototip dalje — stoji na strani analize.')}</p>
  ${picks.length ? `<div class="visit-lead-photos">${picks.map(ph => `<figure class="visit-lead-photo"><a href="${esc(ph.src)}" aria-label="${tr('Open full image', 'Otvori celu sliku')}"><img src="${esc(ph.src)}" width="${ph.width}" height="${ph.height}" alt="${esc(tx(ph.alt))}" loading="lazy" decoding="async"></a></figure>`).join('')}</div>` : ''}
  <p class="visit-compact-label">${tr('On the visit', 'Na poseti')}</p>
  <ul class="visit-participants visit-compact" data-visit-participants="${esc(visit.id)}" aria-label="${tr('Students on the visit', 'Studenti na poseti')}">${items}</ul>
  <a class="button secondary" href="poseta.html">${tr('The full analysis of the visit', 'Temeljna analiza posete')} ↗</a>
</section>`;
}

/* ---------- the analysis page ---------- */

const FINDINGS = [
  {
    work: 'zmijica-2026',
    seen: { sr: 'Korisnica je sama navlačila zeleni element po žičanoj putanji — jednom rukom po žici, drugom pritežući podlogu da ne klizi. Igra je tekla bez podsticaja, iz sedećeg položaja za stolom.', en: 'A user pulled the green element along the wire path by herself — one hand on the wire, the other steadying the base so it would not slide. The play went on without prompting, seated at the table.' },
    reading: { sr: 'Putanja jasno saopštava šta se radi: cilj je vidljiv, a greška se oseti — element zatitra na žici. Najslabija tačka nije žica nego podloga: dok je sto gladak, druga ruka troši se na stabilizaciju umesto na igru.', en: 'The path states its own task clearly: the goal is visible, and a miss is felt — the element trembles on the wire. The weakest point is not the wire but the base: while the table is smooth, the second hand is spent steadying instead of playing.' },
    next: { sr: 'Antiklizni sloj ispod podloga — gotovo besplatna izmena koja oslobađa drugu ruku; razmotriti oslonac koji žicu drži u visini stola, da radi i iz fotelje.', en: 'A non-slip layer under the base — a near-free change that frees the second hand; consider a support holding the wire at table height, so it works from an armchair too.' }
  },
  {
    work: 'zgradica-2026',
    seen: { sr: 'Na snimku od 23 sekunde korisnica pomera i okreće zgradu za stolom: na svakom spratu je rupa, i kad se zgrada pomeri, loptica prođe kroz rupu i spusti se sprat niže. Bez ijedne reči usmeravanja; u pozadini aplauz i „svaka čast”.', en: 'On the 23-second recording a user moves and turns the building at the table: every floor has a hole, and when the building is shifted the ball passes through and drops one floor down. Without a single word of guidance; applause and „svaka čast” in the background.' },
    reading: { sr: 'Najduže neprekinuto istraživanje cele posete — i potpuno samostalno. Igra uči kontrolisanom pokretu: loptica pada tek kad se zgrada pomeri, pa je veza pokreta i spuštanja vidljiva i ponovljiva — svaki sprat je jedan korak naniže. Aplauz u pozadini slavi pokušaj, ne samo rezultat: zajednica je deo igre.', en: 'The longest unbroken exploration of the whole visit — and entirely self-directed. The play teaches a controlled movement: the ball drops only when the building is shifted, so the link between the movement and the descent is visible and repeatable — every floor is one step down. The applause in the background celebrates the attempt, not only the result: the community is part of the play.' },
    next: { sr: 'Rupe različitih veličina ili boja po spratu (teži spratovi ka dole), tihi klik na svakom prolazu loptice i brojanje spratova kroz koje je prošla — igra već broji sama sobom; razmotriti i ivicu koja pomaže hvat pri pomeranju zgrade.', en: 'Holes of different sizes or colours per floor (harder floors towards the bottom), a soft click as the ball passes and counting the floors it has crossed — the game already counts by itself; consider a lip that helps the grip when shifting the building.' }
  },
  {
    work: 'upadalica-2026',
    seen: { sr: 'Na snimku od deset sekundi čuje se brojanje naglas do pogotka — „tri, četiri… pao!” — i aplauz. Dva para ruku drže kutiju istovremeno; žuta loptica pada između štapića u narandžaste čašice.', en: 'On the ten-second recording a user counts aloud up to the drop — „three, four… it fell!” — followed by applause. Two pairs of hands hold the box at once; the yellow ball falls between the sticks into the orange cups.' },
    reading: { sr: 'Igra je sama sebi izvela nivoe: što je veći razmak štapića, to je pogodak lakši. Brojanje se gradi glasom podrške („ti ćeš drži… tri, četiri…“) — ritam ne nameće igrač, nego ga zajednica meri sa korisnikom. Rad drži jednu i dve osobe istovremeno.', en: 'The play produced its own difficulty levels: the wider the gap between the sticks, the easier the drop. The counting is built by a voice of support (“you will hold… three, four…”) — the rhythm is not imposed by the player; the community keeps time with the user. The work holds one and two people at once.' },
    next: { sr: 'Čašicama dati vrednosti po boji (poeni), a razmak štapića učiniti podesivim — igra raste sa veštinom i ostaje zajednička.', en: 'Give the cups values by colour (points) and make the stick gap adjustable — the game grows with skill and stays shared.' }
  },
  {
    work: 'sudoku-2026',
    seen: { sr: 'Pločice sa reljefnim brojevima slagane su i razvrstavane po stolu; kontakti su bili kraći i mirniji nego kod ostalih radova — slaganje bez utrke.', en: 'Tiles with raised numbers were laid out and sorted on the table; the contact was shorter and quieter than with the other works — arranging without a race.' },
    reading: { sr: 'Najviši kontrast zbirke (crno na belom) i reljef koji se čita prstom — jak dizajn za slabovidne. Ali broj je apstrakcija: na materijalu se vidi slaganje, ne i igra sa pravilom. Nedostaje most od broja do zadatka.', en: 'The highest contrast of the collection (black on white) and a relief that can be read by finger — strong design for low-vision users. But a number is an abstraction: the material shows arranging, not yet a game with a rule. The bridge from number to task is missing.' },
    next: { sr: 'Uz svaki broj dati količinu ili boju (1●, 2●●…) — pariranje umesto računanja; zadržati reljef i kontrast, dodati podlogu sa udubljenjima po broju.', en: 'Give each number a quantity or a colour (1●, 2●●…) — matching instead of counting; keep the relief and contrast, add a base with hollows by number.' }
  },
  {
    work: 'muzicka-kutija-2026',
    seen: { sr: 'Aplikacija za praćenje pokreta na laptopu: korisnik diže i spušta ruku ispred ekrana, cvet na ekranu odgovara, zvuk potvrđuje. Viđeno i iz daljine, sa druge strane stola.', en: 'A hand-tracking application on a laptop: the user raises and lowers a hand in front of the screen, a flower on the screen answers, sound confirms. Seen from a distance too, across the table.' },
    reading: { sr: 'Ravnopravna igra: ne traži hvat, silu ni preciznost — pokret je dovoljan. Ali ekran vuče pažnju ka sebi: korisnik je u igri, a izvan sobe. Odziv je trenutan i pošten — to drži pažnju.', en: 'An equalising play: it asks for no grip, force or precision — a movement is enough. But the screen pulls attention to itself: the user is in the game and out of the room. The response is instant and honest — that is what holds attention.' },
    next: { sr: 'Preusmeriti odziv u sobu: zvučnik na stolu umesto u ekranu, cvet na zidu — igra ostaje društvena, a prostor postaje instrument.', en: 'Redirect the response into the room: a speaker on the table instead of in the screen, the flower on a wall — the play stays social and the room becomes the instrument.' }
  }
];

const VIDEOS = {
  'zgradica-2026': { file: 'assets/visit/poseta-2026-10-09-zgradica.mp4', caption: { sr: 'Dvadeset tri sekunde samostalne igre: pomeranjem zgrade loptica spušta se sprat po sprat; na kraju aplauz.', en: 'Twenty-three seconds of self-directed play: shifting the building lowers the ball floor by floor; applause at the end.' } },
  'upadalica-2026': { file: 'assets/visit/poseta-2026-10-09-upadalica.mp4', caption: { sr: 'Brojanje do pogotka i aplauz — deset sekundi.', en: 'Counting up to the drop and applause — ten seconds.' } },
  'muzicka-kutija-2026': { file: 'assets/visit/poseta-2026-10-09-muzicka.mp4', caption: { sr: 'Pokret rukom ispred ekrana i odziv aplikacije — pet sekundi.', en: 'A hand movement in front of the screen and the application’s answer — five seconds.' } }
};

const SPACE = [
  { sr: 'Soba je dom, ne laboratorija: krevet, sofe i poster na zidu — igračke su žive u dnevnoj sobi udruženja, bez belih mantila. Prostor je već univerzalan; pitanje je samo da li je i igračka.', en: 'The room is a home, not a laboratory: a bed, sofas and a poster on the wall — the toys live in the association’s living room, no white coats. The room is already universal; the only question is whether the toy is.' },
  { sr: 'Igračka ide čoveku: Zgradica je probavana i na krevetu — rad je došao tamo gde je korisnik, a ne obrnuto. Svaka verzija 2 treba da radi u krilu, na krevetu i uz sto.', en: 'The toy goes to the person: Zgradica was tried on the bed too — the work came to where the user was, not the other way round. Every Version 2 should work in a lap, on a bed and at a table.' },
  { sr: 'Klupa uz zid je gledalište: oni koji ne igraju prate igru i aplaudiraju. Publika je deo mehanizma — prostor već zna za red čekanja, i igračka koja vodi računa o publici dobija viče.', en: 'The bench by the wall is the auditorium: those not playing follow the game and applaud. The audience is part of the mechanism — the room already knows turn-taking, and a toy that respects its audience gets more.' },
  { sr: 'Glas podrške: na snimku Upadalice čuje se „ti ćeš drži… tri, četiri…“ — brojanje se ne nameće, nego se s prisutnim gradi zajedno. Podrška meri vreme sa korisnikom, umesto da mu pokazuje ruku.', en: 'A voice of support: on the Upadalica recording you hear “you will hold… three, four…” — the counting is not imposed, it is built together with those present. Support keeps time with the user instead of showing her hand.' },
  { sr: 'Šema presipanja: ruke sipaju štapiće u kutiju i nazad — prenošenje materijala je igra sama po sebi. Verzija 2 može da joj da svrhu: broj prenetih štapića postaje rezultat.', en: 'The pouring schema: hands pour sticks into the box and back — transferring material is a game in itself. Version 2 can give it a purpose: the number of sticks carried becomes the score.' },
  { sr: 'Otvorena prednja strana Zgradice: loptica se vidi na svakom spratu, pa mehanizam ne treba objašnjavati. Rad koji pokazuje svoj put uči brže od uputstva — zakon za svaki sledeći prototip.', en: 'Zgradica’s open front: the ball is visible on every floor, so the mechanism needs no explaining. A work that shows its own path teaches faster than an instruction — a rule for every next prototype.' }
];

const PATTERNS = [
  { sr: 'Četiri stila korišćenja u jednoj sobi: duboki samostalni istraživač, par ruku, grupa oko table i posmatrač sa strane. Nijedan dizajn ne pokriva sve — rotacija radova po stolu je najjeftinija univerzalna mera.', en: 'Four styles of use in one room: the deep solo explorer, a pair of hands, a group around a board, and a watcher from the side. No single design covers them all — rotating the works around the table is the cheapest universal measure.' },
  { sr: 'Proslava pokušaja: aplauz prati i promašaj. Dizajnirati tako da i promašaj daje povratnu informaciju — zvuk, pokret, promenu boje.', en: 'The celebration of the attempt: applause follows a miss too. Design so that a miss also gives feedback — a sound, a movement, a change of colour.' },
  { sr: 'Sto je arena: svi fizički radovi korišćeni su na stolu. Stabilnost podloge je univerzalni uslov — vidljivo kod Zmijice, čija se podloga klizala dok se igralo.', en: 'The table is the arena: every physical work was used on the table. A steady base is a universal condition — visible with Zmijica, whose base slid during play.' },
  { sr: 'Zvuk drži pažnju bez ekrana: brojanje, aplauz, odziv aplikacije. Igračka koja „odgovara” zvukom ostaje u sobi.', en: 'Sound holds attention without a screen: counting, applause, the application’s response. A work that „answers” with sound stays in the room.' },
  { sr: 'Materijal i boju treba birati sa korisnicima: fotografije ne dokazuju koja paleta duže zadržava pažnju.', en: 'Choose materials and colours with users: photographs do not establish which palette holds attention longer.' }
];

function ready(visit, prototypes) {
  const problems = [...validateVisit(visit)];
  if (problems.length) throw new Error(problems.join('\n'));
}

export function renderPoseta(visit, prototypes) {
  ready(visit, prototypes);
  const byWork = new Map();
  for (const o of prototypes?.observations || []) {
    const list = byWork.get(o.prototypeId) || [];
    list.push(...o.photos); byWork.set(o.prototypeId, list);
  }
  const title = id => prototypes.items.find(item => item.id === id)?.title || id;
  const findings = FINDINGS.filter(f => byWork.has(f.work)).map((finding, i) => {
    const observation = byWork.get(finding.work);
    const collected = byWork.get(finding.work) || [];
    const photos = collected.length
      ? `<div class="visit-photos">${collected.map(p => photograph(p)).join('')}</div>`
      : `<p class="visit-no-photo">${tr('The material of this work stays in the working notebook.', 'Materijal ovog rada ostaje u radnoj svesci.')}</p>`;
    const video = VIDEOS[finding.work]
      ? `<figure class="visit-video"><video controls preload="metadata" src="${VIDEOS[finding.work].file}"></video><figcaption>${esc(tx(VIDEOS[finding.work].caption))}</figcaption></figure>`
      : '';
    return `<article class="visit-finding" id="${esc(finding.work)}">
  <h3><span aria-hidden="true">${number(i + 1)}</span> ${esc(title(finding.work))} <a class="gallery-link" href="prototipovi.html#${esc(finding.work)}">${tr('authorship in the gallery', 'autorstvo u galeriji')} ↗</a></h3>
  ${photos}${video}
  <p><span class="visit-label">${tr('Seen', 'Viđeno')}</span>${esc(tx(finding.seen))}</p>
  <p><span class="visit-label">${tr('Reading', 'Čitanje')}</span>${esc(tx(finding.reading))}</p>
  <p><span class="visit-label">${tr('Next step', 'Sledeći korak')}</span>${esc(tx(finding.next))}</p>
</article>`;
  }).join('');
  const participants = visit.participants.map(person =>
    `<li><span data-participant-name>${esc(person.name)}</span><span data-participant-number>${esc(person.studentNumber)}</span></li>`).join('');
  const patterns = PATTERNS.map(p => `<li>${esc(tx(p))}</li>`).join('');
  return `<div class="page-top flow-intro"><div><p class="eyebrow">${tr('Week', 'Nedelja')} ${visit.week} · ${tr('association visit', 'poseta udruženju')} · <time datetime="${esc(visit.occurredOn)}">${esc(srDate(visit.occurredOn))}.</time></p>
  <h1>${tr('The visit to the association.', 'Poseta udruženju.')}</h1></div>
  <p class="lede">${tr('The same day as the second class, the students brought the prototypes to the Živimo zajedno association and handed them to the users — without explanation, without guidance. This page is a full reading of what was seen: how each work was taken in hand, what those hands did on their own, and what that says about the next step of each prototype.', 'Isti dan kad i drugi čas, studenti su doneli prototipove u prostor udruženja „Živimo zajedno” i predali ih korisnicima — bez objašnjenja, bez usmeravanja. Ova strana je temeljno čitanje viđenog: kako je svaki rad primljen u ruke, šta su te ruke same od sebe radile i šta to govori o sledećem koraku svakog prototipa.')}</p></div>
<p class="notice">${tr('How this was read: 45 photographs, three recordings (10, 23 and 5 seconds) and their sound, taken on 9 October 2026 between 13:54 and 14:11. It is not a test: there were no interviews and no one is graded — the work is judged, never the person. The recordings are published beside the findings they support.', 'Kako je ovo pročitano: 45 fotografija, tri snimka (10, 23 i 5 sekundi) i njihov zvuk, nastali 09.10.2026. između 13:54 i 14:11. Nije ispitivanje: nije bilo intervjua i niko se ne ocenjuje — ocenjuje se rad, nikad osoba. Snimci su objavljeni uz nalaze koje potkrepljuju.')}</p>
<section aria-labelledby="visit-participants-title"><div class="section-heading"><div><p class="eyebrow">${tr('Who was there', 'Ko je bio tamo')}</p><h2 id="visit-participants-title">${tr('Students on the visit', 'Studenti na poseti')}</h2></div><p>${tr('Nine students, the same day as the second class.', 'Devetoro studenata, isti dan kad i drugi čas.')}</p></div>
  <ul class="visit-participants" data-visit-participants="${esc(visit.id)}" aria-label="${tr('Students on the visit', 'Studenti na poseti')}">${participants}</ul>
</section>
<section aria-labelledby="visit-findings-title"><div class="section-heading"><div><p class="eyebrow">${tr('Work by work', 'Rad po rad')}</p><h2 id="visit-findings-title">${tr('What was seen', 'Šta se videlo')}</h2></div><p>${tr('Seen — reading — next step: three separate claims, kept apart.', 'Viđeno — čitanje — sledeći korak: tri odvojene tvrdnje, čuvaju se odvojeno.')}</p></div>
  ${findings}
</section>
${(visit.photos || []).some(publicPhoto) ? `<section aria-labelledby="visit-scenes-title"><div class="section-heading"><div><p class="eyebrow">${tr('The rest of the day', 'Ostatak dana')}</p><h2 id="visit-scenes-title">${tr('Scenes without a single work', 'Scene bez jednog rada')}</h2></div><p>${tr('Photographs of the visit that belong to the day itself — materials, sketches, works still without a place in the register. They stand here untied, until a teacher’s word ties them.', 'Fotografije posete koje pripadaju danu samom — materijal, skice, radovi još bez mesta u registru. Stoje nevezani, dok nastavnička reč ne veže.')}</p></div>
  <div class="visit-photos">${(visit.photos || []).filter(publicPhoto).map(p => photograph(p)).join('')}</div>
</section>` : ''}
<section aria-labelledby="visit-space-title"><div class="section-heading"><div><p class="eyebrow">${tr('A second, closer look', 'Drugi, bliži pogled')}</p><h2 id="visit-space-title">${tr('The room and the people', 'Prostor i ljudi')}</h2></div><p>${tr('What the material shows beyond the toys themselves.', 'Šta materijal pokazuje i preko samih igračaka.')}</p></div>
  <ol class="lesson-results visit-space">${SPACE.map(item => `<li>${esc(tx(item))}</li>`).join('')}</ol>
</section>
<section aria-labelledby="visit-patterns-title"><div class="section-heading"><div><p class="eyebrow">${tr('Across all works', 'Presjek kroz sve radove')}</p><h2 id="visit-patterns-title">${tr('What repeats', 'Šta se ponavlja')}</h2></div></div>
  <ol class="lesson-results visit-patterns">${patterns}</ol>
</section>
<section aria-labelledby="visit-next-title"><div class="section-heading"><div><p class="eyebrow">${tr('For the next prototype', 'Za sledeću verziju prototipa')}</p><h2 id="visit-next-title">${tr('Version 2 — and a first one.', 'Verzija 2 — i prvi prototip.')}</h2></div></div>
  <p>${tr('The next class carries two orders: whoever brought a prototype brings the improved version, read against the findings above; whoever did not, brings the first one. This visit material is the appendix of that class — a record of real hands, not a report.', 'Sledeći čas nosi dve stavke: ko je doneo prototip, donosi unapređenu verziju, pročitanu kroz nalaze iznad; ko nije doneo, donosi prvi. Ovaj materijal posete je prilog tog časa — zapis stvarnih ruku, ne izveštaj.')}</p>
  <h3 class="visit-moves-title">${tr('The moves the visit asks for', 'Potezi koje poseta traži')}</h3>
  <ol class="lesson-results visit-patterns">
    <li>${tr('Steady base: a non-slip layer under Zmijica, and under every work played on a smooth table — the second hand returns to play.', 'Stabilna podloga: antiklizni sloj ispod Zmijice, i ispod svakog rada koji se igra na gladnom stolu — druga ruka se vraća igri.')}</li>
    <li>${tr('Adjustable difficulty: the Upadalica stick gap becomes a setting, the cups get values by colour — the game grows with skill.', 'Podesiva težina: razmak štapića Upadalice postaje podešavanje, čašice dobijaju vrednost po boji — igra raste sa veštinom.')}</li>
    <li>${tr('A response outside the screen: the Music Box answers through the room — a speaker on the table, the flower on a wall.', 'Odziv van ekrana: Muzička Kutija odgovara kroz sobu — zvučnik na stolu, cvet na zidu.')}</li>
    <li>${tr('Offer material and colour alternatives and ask users about their preferences.', 'Ponuditi različite materijale i boje i pitati korisnike šta im odgovara.')}</li>
    <li>${tr('A number with a quantity: the Sudoku tiles pair with 1·, 2·· — matching instead of counting.', 'Broj sa količinom: pločice Sudokua se uparuju sa 1·, 2·· — pariranje umesto računanja.')}</li>
  </ol>
  <h3 class="visit-moves-title">${tr('Checked paths from the web', 'Provereni putevi sa mreže')}</h3>
  <ul class="visit-links">
    <li><a href="https://design.ncsu.edu/research/">Center for Universal Design, NC State ↗</a> — ${tr('the original text of the seven principles of universal design; measure every version against them.', 'izvorni tekst sedam principa univerzalnog dizajna; svaka verzija meri se o njima.')}</li>
    <li><a href="https://www.makersmakingchange.com/">Makers Making Change ↗</a> — ${tr('step-by-step guides for adapting an off-the-shelf toy to a single switch (the battery-interrupter method) — the cheapest upgrade path for Version 2.', 'uputstva korak po korak za prilagođavanje postojeće igračke jednom prekidačem (metoda prekidača u bateriji) — najjeftiniji put unapređenja u verziji 2.')}</li>
    <li><a href="https://universaldesign.ie/about-universal-design/">Centre for Excellence in Universal Design ↗</a> — ${tr('the seven principles explained through everyday examples, useful when writing the A3 sheet.', 'sedam principa objašnjenih na svakodnevnim primerima; koristi se kad se piše A3 list.')}</li>
    <li><a href="resources.html">${tr('The course library', 'Biblioteka predmeta')}</a> — ${tr('standards, readings and reference pages already checked for the course.', 'standardi, čitanja i referentne strane već provereni za predmet.')}</li>
  </ul>
  <p class="help">${tr('Links checked 12.10.2026. They are directions for reading, not tasks: a Version 2 change is judged by what it does in real hands.', 'Veze proverene 12.10.2026. To su pravci za čitanje, ne zadaci: izmenu verzije 2 ocenjujemo po onome što uradi u stvarnim rukama.')}</p>
</section>
<aside class="prototype-context visit-source"><h2>${tr('Sources of this page', 'Izvori ove strane')}</h2><p>${esc(tx(visit.source.description))}</p><p>${tr('Attribution of each work stands in the gallery of works; the participants of the visit in the visit register. The members’ names are not published, nor is a face tied to a finding.', 'Autorstvo svakog rada stoji u galeriji radova; učesnici posete u registru posete. Imena korisnika udruženja se ne objavljuju, niti se lice vezuje za nalaz.')}</p></aside>`;
}

// A dated visit record: camera scenes stay separate from work attribution.
export function renderVisitRecord(visit, { compact = false } = {}) {
  const problems = validateVisit(visit);
  if (problems.length) throw Error(problems.join('\n'));
  const anchor = `poseta-w${String(visit.week).padStart(2, '0')}`;
  const participants = visit.participants.map(p => `<li><span data-participant-name>${esc(p.name)}</span><span data-participant-number>${esc(p.studentNumber)}</span></li>`).join('');
  const photos = compact ? [visit.photos[0], visit.photos[2], visit.photos.at(-1)] : visit.photos;
  const figures = photos.map(p => `<figure id="${compact ? 'lead-' : ''}${esc(p.id)}"><a href="${esc(p.src)}" aria-label="${tr('Open full image', 'Otvori celu sliku')}"><img src="${esc(p.src)}" width="${p.width}" height="${p.height}" alt="${esc(tx(p.alt))}" loading="lazy" decoding="async"></a>${compact ? '' : `<figcaption>${esc(tx(p.caption))}</figcaption>`}</figure>`).join('');
  const findings = compact ? '' : `<section class="visit-readings"><h3>${tr('From observation to the next trial', 'Od zapažanja do sledećeg probanja')}</h3><p>${tr('These photographs document positions and grips. They do not establish duration, independent use, understanding of rules or a successful outcome.', 'Fotografije beleže položaje i hvatove. Ne potvrđuju trajanje, samostalnost, razumevanje pravila ili uspešan ishod.')}</p>${(visit.findings || []).map(f => `<article class="visit-finding"><h4>${esc(tx(f.title))}</h4><p><strong>${tr('Visible in the photographs', 'Vidljivo na fotografijama')}.</strong> ${esc(tx(f.seen))}</p><p><strong>${tr('Proposal for the next trial', 'Predlog za sledeće probanje')}.</strong> ${esc(tx(f.next))}</p><p>${tr('Photographs', 'Fotografije')}: ${f.photoIds.map(id => `<a href="#${esc(id)}">${visit.photos.findIndex(p => p.id === id)+1}</a>`).join(' · ')}</p></article>`).join('')}</section>`;
  return `<section class="field-visit visit-record" id="${anchor}${compact ? '-lead' : ''}" aria-labelledby="${anchor}${compact ? '-lead' : ''}-title"><p class="eyebrow">${tr('Class', 'Čas')} ${visit.week} · <time datetime="${esc(visit.occurredOn)}">${esc(srDate(visit.occurredOn))}.</time></p><h2 id="${anchor}${compact ? '-lead' : ''}-title">${tr('Visit to the association', 'Poseta udruženju')}</h2><p class="lede">${esc(tx(visit.summary))}</p><div class="${compact ? 'visit-lead-photos' : 'gallery-detail'}">${figures}</div><h3>${tr('Students on the visit', 'Studenti na poseti')}</h3><ul class="visit-participants visit-compact" data-visit-participants="${esc(visit.id)}">${participants}</ul>${compact ? `<p><a class="button secondary" href="cas-03.html#${anchor}">${tr('All photographs and observations', 'Sve fotografije i zapažanja')} ↗</a></p>` : findings}</section>`;
}
