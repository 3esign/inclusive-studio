// A class list as course material: one register of photographed works per class
// (data/cas-03/spisak.json, data/cas-04/spisak.json …), rendered by the same code that
// stamps the static baseline. Students' names live only in the register — never as
// literals in this source.
// 21.10.2026: the third-class sequence was re-cut against the list after the twelve
// opening frames (trousers, degree presentations) were found to stand in front of it.
// Every work was then recognised in its own photographs. What is still open — a work with
// no frames in the transfer, a missing title or number — is published as open.
// 23.10.2026: the week, the ordinal, the title and the lede come from the register, so a
// new class is a new register plus a shell — never a second copy of this renderer. Rows
// with zero photographs are not dropped: attendance was recorded, so they stand in their
// own part („Šta se čeka”) with what that work announced. A class whose photographs are
// still on the phone has no gallery links at all; it says so through `prijem` instead of
// pretending every row waits for a frame that was already cut.

import { esc, tr, tx, number } from './core.js';
import { photograph } from './prototipovi-core.js';
import { withheldWorkIds } from './photo-publication.js';

const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const STUDENT = /^\d{1,4}\/\d{2}(?:\d{2})?$/;
const date = v => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) && Number.isFinite(Date.parse(v)) && new Date(v).toISOString().slice(0, 10) === v;
const bilingual = v => v && typeof v === 'object' && !Array.isArray(v) && typeof v.sr === 'string' && v.sr.trim() && typeof v.en === 'string' && v.en.trim();

export function validateCas03(spisak) {
  const problems = [];
  const fail = (condition, message) => { if (!condition) problems.push(message); };
  fail(spisak?.schema === 'course-class-list/v1', 'Unknown class-list schema.');
  fail(ID.test(spisak?.id || ''), 'List id required.');
  fail(date(spisak?.odrzan), 'List needs the class date.');
  fail(bilingual(spisak?.napomena) && bilingual(spisak?.analizaUdruzenja), 'The list note and the association note must be bilingual.');
  fail(keys(spisak?.source, ['id', 'recordedOn', 'description']) && ID.test(spisak.source?.id || '') && date(spisak.source?.recordedOn) && bilingual(spisak.source?.description), 'List source requires an id, a record date and a bilingual description.');
  // How the sequence was cut, and what the transfer is missing. A class whose frames are
  // still on the phone has neither yet, and states that through `prijem`.
  fail(spisak?.presek === undefined || bilingual(spisak.presek), 'presek must be bilingual.');
  fail(spisak?.prenos === undefined || bilingual(spisak.prenos), 'prenos must be bilingual.');
  fail(spisak?.sigurno === undefined || (keys(spisak.sigurno, ['do', 'od']) && spisak.sigurno?.do >= 1 && spisak.sigurno?.od > spisak.sigurno?.do), 'The certain zones, when given, are do/od row numbers.');
  // The week, the ordinal and the headline are register facts: a class names itself.
  fail(keys(spisak, ['schema', 'id', 'cas', 'odrzan', 'nedelja', 'redni', 'naslov', 'lede', 'source', 'napomena', 'sigurno', 'vezaneGalerije', 'presek', 'prenos', 'nizNapomena', 'udruzenjeNalazi', 'analizaUdruzenja', 'radovi', 'razjasni', 'ispravke', 'prijem', 'posetaRegistar', 'posetaStrana']), 'Unknown class-list fields.');
  fail(spisak?.nedelja === undefined || (Number.isInteger(spisak.nedelja) && spisak.nedelja >= 1), 'nedelja must be a week number.');
  fail(spisak?.redni === undefined || bilingual(spisak.redni), 'redni (the ordinal of the class) must be bilingual.');
  fail(spisak?.naslov === undefined || bilingual(spisak.naslov), 'naslov must be bilingual.');
  fail(spisak?.lede === undefined || bilingual(spisak.lede), 'lede must be bilingual.');
  fail(spisak?.nizNapomena === undefined || bilingual(spisak.nizNapomena), 'nizNapomena must be bilingual.');
  fail(spisak?.udruzenjeNalazi === undefined || (Array.isArray(spisak.udruzenjeNalazi) && spisak.udruzenjeNalazi.length > 0 && spisak.udruzenjeNalazi.every(bilingual)), 'udruzenjeNalazi must be a non-empty list of bilingual findings.');
  // A class whose field part has its own visit register names it here; the register stays
  // the single source of that day's roster (data/poseta-*.json, course-visit/v1).
  fail(spisak?.posetaRegistar === undefined || (typeof spisak.posetaRegistar === 'string' && /^data\/[\w./-]+\.json$/.test(spisak.posetaRegistar)), 'posetaRegistar must be a path to a visit register.');
  fail(spisak?.posetaStrana === undefined || (spisak.posetaRegistar !== undefined && /^[a-z0-9-]+\.html$/.test(spisak.posetaStrana || '')), 'posetaStrana names the page that opens that visit in full.');
  // Corrections to earlier records are published with their own source, like every result.
  fail(spisak?.ispravke === undefined || Array.isArray(spisak.ispravke), 'ispravke must be a list.');
  for (const fix of spisak?.ispravke || []) fail(keys(fix, ['id', 'sta', 'izvor']) && ID.test(fix?.id || '') && bilingual(fix?.sta) && typeof fix?.izvor === 'string' && fix.izvor.trim(), 'Each correction needs an id, bilingual text and a source.');
  // The intake anchor: which phone, which folder, which frame the sequence starts from.
  if (spisak?.prijem !== undefined) fail(keys(spisak.prijem, ['uredjaj', 'putanja', 'prviSnimak', 'prviSnimakVreme', 'napomena']) && bilingual(spisak.prijem?.napomena), 'prijem needs the device, the path, the first frame and a bilingual note.');
  fail(Array.isArray(spisak?.radovi) && spisak.radovi.length > 0, 'List rows required.');
  // A class whose frames were cut against the list declares it — `vezaneGalerije` — and
  // then every row must bind to its work or state that it waits. A class still waiting on
  // the transfer declares nothing and says so through `prijem`. The flag is a register
  // fact, never inferred from the rows: inferring it would let a row quietly lose its
  // binding and take the rule down with it.
  const bound = spisak?.vezaneGalerije === true;
  fail(spisak?.vezaneGalerije === undefined || spisak.vezaneGalerije === true, 'vezaneGalerije is declared or absent, never false.');
  fail(!bound || spisak?.prijem === undefined, 'A class either shows its cut galleries or states its pending intake — not both.');
  fail(bound || !(spisak?.radovi || []).some(row => 'galerija' in row), 'Only a class that declares vezaneGalerije may link its rows to works.');
  const questionIds = new Set((spisak?.razjasni || []).map(q => q?.id));
  (spisak?.radovi || []).forEach((row, i) => {
    const at = `Row ${i + 1}`;
    fail(row?.rb === i + 1, `${at}: rb must run 1..n in order.`);
    fail(row.ime === null || (typeof row.ime === 'string' && row.ime.trim()), `${at}: ime is a name or null.`);
    fail(row.indeks === null || STUDENT.test(row.indeks || ''), `${at}: indeks is a student number or null.`);
    fail(row.rad === null || (typeof row.rad === 'string' && row.rad.trim()), `${at}: rad is a title or null.`);
    fail(row.slike === null || (Number.isInteger(row.slike) && row.slike >= 0), `${at}: slike is a photograph count or null.`);
    fail(!('galerija' in row) || ID.test(row.galerija || ''), `${at}: galerija must be a work id.`);
    fail(!('razjasni' in row) || questionIds.has(row.razjasni), `${at}: razjasni must name a listed question.`);
    fail(row.napomena === undefined || bilingual(row.napomena), `${at}: napomena must be bilingual.`);
    // In a cut class a row either opens its work's page or openly waits for its
    // photographs. Never both and never neither — an unexplained row is how one object
    // came to wear several students' names.
    fail(!bound || ('galerija' in row) !== (row.ceka === true), `${at}: a row shows its work or states that it waits.`);
    fail(keys(row, ['rb', 'ime', 'indeks', 'rad', 'slike', ...(row.galerija ? ['galerija'] : []), ...(row.ceka ? ['ceka'] : []), ...(row.razjasni ? ['razjasni'] : []), ...(row.napomena ? ['napomena'] : [])]), `${at}: unknown row fields.`);
  });
  fail(Array.isArray(spisak?.razjasni), 'razjasni must be a list.');
  for (const q of spisak?.razjasni || []) fail(keys(q, ['id', 'sta']) && ID.test(q?.id || '') && bilingual(q?.sta), 'Each razjasni question needs an id and bilingual text.');
  return problems;
}

const keys = (obj, allowed) => obj && typeof obj === 'object' && !Array.isArray(obj) && Object.keys(obj).every(k => allowed.includes(k));
const srDate = iso => iso.split('-').reverse().join('.');

export function renderCas03(spisak, prototypes, poseta = null) {
  const problems = validateCas03(spisak);
  for (const row of spisak?.radovi || []) {
    if (row.galerija && !prototypes?.galleries?.some(g => g.id === row.galerija)) problems.push(`Row ${row.rb}: galerija "${row.galerija}" is not in the work register.`);
    if (row.ceka && !prototypes?.cekaju?.some(w => w.listOrder === row.rb)) problems.push(`Row ${row.rb}: an awaiting row must match an awaited work.`);
  }
  if (problems.length) throw new Error(problems.join('\n'));
  // The third class is the register that predates these fields; its defaults keep its
  // page byte-identical, and every later class states its own week and headline.
  const nedelja = spisak.nedelja ?? 3;
  const redni = spisak.redni ?? { sr: 'treći čas', en: 'third class' };
  const naslov = spisak.naslov ?? { sr: 'Spisak radova trećeg časa.', en: 'The list of the third class.' };
  const lede = spisak.lede ?? {
    sr: `${spisak.radovi.length} radova fotografisano na času, redom kojim su slikani. Svaki red otvara svoju stranicu: svi prikazi tog rada i sve nedelje u kojima je isti student nešto predao.`,
    en: `${spisak.radovi.length} works photographed in class, in shooting order. Each row opens its own page: every view of that work, and every week the same student handed something in.`,
  };
  const renderRow = row => {
    const name = row.ime || '—';
    const indeks = row.indeks || '—';
    const rad = row.rad ? esc(row.rad) : `<span class="cas03-missing">${tr('title not recorded', 'naziv nije zabeležen')}</span>`;
    const slike = row.slike === 0 ? `<span class="cas03-bez">${tr('no photographs', 'bez fotografija')}</span>`
      : row.slike === null ? `<span class="cas03-missing">${tr('count not recorded', 'broj nije zabeležen')}</span>`
        : tr(`${row.slike} photo${row.slike === 1 ? '' : 's'}`, `${row.slike} ${row.slike === 1 ? 'fotografija' : row.slike < 5 ? 'fotografije' : 'fotografija'}`);
    const wave = row.galerija && !withheldWorkIds.includes(row.galerija) ? ` <a class="cas03-wave" href="galerija-${esc(row.galerija)}.html">${tr('open the work', 'otvori rad')} ↗</a>` : '';
    const ask = row.razjasni ? ` <a class="cas03-ask" href="#${esc(row.razjasni)}">${tr('open question', 'otvoreno pitanje')} ↓</a>` : '';
    const confirm = row.ceka ? ` <span class="cas03-confirm">${tr('photographs still to come', 'fotografije tek stižu')}</span>` : '';
    const note = row.napomena ? `<span class="cas03-note">${esc(tx(row.napomena))}</span>` : '';
    return `<li data-cas03-row="${row.rb}"${row.ceka ? ' class="cas03-neizvesno"' : ''}><span data-cas03-name>${esc(name)}</span><span data-cas03-indeks>${esc(indeks)}</span><span class="cas03-rad">${rad}</span><span class="cas03-slike">${slike}</span>${confirm}${wave}${ask}${note}</li>`;
  };
  // Attendance without a photograph is still attendance: those rows leave the first
  // list and stand below, named, so nobody disappears for lacking a picture.
  const cekaju = spisak.radovi.filter(row => row.slike === 0);
  const rows = spisak.radovi.filter(row => row.slike !== 0).map(renderRow).join('');
  const certainty = spisak.presek ? esc(tx(spisak.presek))
    : !spisak.sigurno || spisak.sigurno.od > spisak.radovi.length
      ? tr('Every entry stands as recorded by the teacher on the day of the class.', 'Svaki zapis stoji onako kako ga je nastavnik zabeležio na dan časa.')
      : tr(`Entries 1–${number(spisak.sigurno.do)} and ${number(spisak.sigurno.od)}–${number(spisak.radovi.length)} stand as certain; the rows between are published as unconfirmed.`, `Zapisi 1–${number(spisak.sigurno.do)} i ${number(spisak.sigurno.od)}–${number(spisak.radovi.length)} stoje kao sigurni; redovi između objavljeni su kao nepotvrđeni.`);
  const cekajuSection = cekaju.length ? `
<section aria-labelledby="cas03-cekamo-title"><div class="section-heading"><div><p class="eyebrow">${tr('Recorded attendance', 'Zavedeno prisustvo')}</p><h2 id="cas03-cekamo-title">${tr('What we wait for', 'Šta se čeka')}</h2></div><p>${tr(`${cekaju.length} entries carry attendance without photographs. The attendance is recorded; what is missing is the photograph, and beside each entry stands what was announced for it.`, `${cekaju.length} zapisa nosi prisustvo bez fotografija. Prisustvo je zavedeno; nedostaje fotografija, a uz svaki zapis stoji ono što je za njega najavljeno.`)}</p></div>
  <ol class="cas03-rows cas03-cekamo" data-cas03-list="${esc(spisak.id)}" aria-label="${tr('Attendance without photographs', 'Prisustvo bez fotografija')}">${cekaju.map(renderRow).join('')}</ol>
</section>` : '';
  const ispravke = renderIspravke(spisak);
  const nizNapomena = spisak.nizNapomena ? esc(tx(spisak.nizNapomena)) : spisak.prenos ? esc(tx(spisak.prenos)) : '';
  const nizBlok = nizNapomena ? `\n  <p class="notice">${nizNapomena}</p>` : '';
  const nalazi = (spisak.udruzenjeNalazi || [
    { sr: 'Direktor udruženja pohvalio je studentske prototipe.', en: 'The director of the association praised the student prototypes.' },
    { sr: 'Primetna je želja korisnika da isprobavaju prototipe koje studenti kreiraju.', en: "The users' wish to try the prototypes the students create was clear." },
    { sr: 'Pomenut je mogući konkurs od strane udruženja.', en: 'A possible competition run by the association was mentioned.' },
  ]).map(n => `\n    <li>${esc(tx(n))}</li>`).join('');
  // 24.10.2026, teacher: the association visit is the attachment that opens the class.
  // It stands at the top with a handful of frames and one door to the whole dossier; the
  // roster and the reading come from that visit's own register, never retold here.
  const posetaPrilog = poseta && Array.isArray(poseta.participants) && poseta.participants.length ? `
<section class="field-visit visit-attachment" aria-labelledby="cas03-poseta-title"><div class="section-heading"><div><p class="eyebrow">${tr('Attachment', 'Prilog')} · ${tr('association visit', 'poseta udruženju')} · <time datetime="${esc(poseta.occurredOn)}">${esc(srDate(poseta.occurredOn))}.</time></p><h2 id="cas03-poseta-title">${esc(tx(poseta.place))}</h2></div><p>${esc(tx(poseta.summary))}</p></div>
  ${posetaKorice(poseta, spisak.posetaStrana)}
  <p class="visit-compact-label">${tr('On the visit', 'Na poseti')} · ${number(poseta.participants.length)}</p>
  <ul class="visit-participants visit-compact" data-visit-participants="${esc(poseta.id)}" aria-label="${tr('Students on the visit', 'Studenti na poseti')}">${poseta.participants.map(person => `<li><span data-participant-name>${esc(person.name)}</span><span data-participant-number>${esc(person.studentNumber)}</span></li>`).join('')}</ul>
  ${spisak.posetaStrana ? `<p><a class="button" href="${esc(spisak.posetaStrana)}">${tr('Open the whole visit: every frame, work by work', 'Otvori celu posetu: svi kadrovi, rad po rad')} ↗</a></p>` : ''}
</section>` : '';
  return `<div class="page-top flow-intro"><div><p class="eyebrow">${tr('Week', 'Nedelja')} ${nedelja} · ${esc(tx(redni))} · <time datetime="${esc(spisak.odrzan)}">${esc(srDate(spisak.odrzan))}.</time></p>
  <h1>${esc(tx(naslov))}</h1></div>
  <p class="lede">${esc(tx(lede))}</p></div>${posetaPrilog}
<section aria-labelledby="cas03-rows-title"><div class="section-heading"><div><p class="eyebrow">${tr('In class', 'Na času')}</p><h2 id="cas03-rows-title">${tr('Prototypes and photographs', 'Prototipi i slike')}</h2></div><p>${certainty}</p></div>
  <p class="notice">${esc(tx(spisak.napomena))}</p>
  <ol class="cas03-rows" data-cas03-list="${esc(spisak.id)}" aria-label="${tr('Works in shooting order', 'Radovi redom slikanja')}">${rows}</ol>${nizBlok}
  <p class="help"><a href="dnevnik.html">${tr('The journal: every student, every week, everything linked', 'Dnevnik: svaki student, svaka nedelja, sve povezano')} ↗</a></p>
</section>${cekajuSection}
<section aria-labelledby="cas03-udruzenje-title"><div class="section-heading"><div><p class="eyebrow">${tr('From the field', 'Sa terena')}</p><h2 id="cas03-udruzenje-title">${tr('From the association', 'Analiza iz udruženja')}</h2></div></div>
  <ol class="lesson-results">${nalazi}
  </ol>
  <p class="help">${esc(tx(spisak.analizaUdruzenja))}</p>
</section>${ispravke}${renderRazjasni(spisak)}
<aside class="prototype-context"><h2>${tr('Sources of this page', 'Izvori ove strane')}</h2><p>${esc(tx(spisak.source.description))}</p><p>${tr('Attribution of the documented works stands in the gallery of works; this list carries names and student numbers only beside the photographs they explain.', 'Autorstvo dokumentovanih radova stoji u galeriji radova; ovaj spisak nosi imena i brojeve indeksa samo uz fotografije koje objašnjava.')}</p></aside>`;
}


// The cover of the attachment: one frame per work recognised that day, up to four, each
// opening that work inside the dossier. A visit whose frames are not yet transferred has
// no cover and says so by its absence, not by a sentence about a phone.
function posetaKorice(poseta, strana) {
  const photos = (poseta.photos || []).filter(p => p && p.src && (p.radovi || []).length);
  if (!photos.length || !strana) return '';
  const seen = new Set();
  const picks = photos.filter(p => {
    const id = p.radovi[0];
    if (seen.has(id)) return false;
    seen.add(id); return true;
  }).slice(0, 4);
  return `<div class="visit-cover">${picks.map(p => `<a class="visit-cover-frame" href="${esc(strana)}#poseta-${esc(p.radovi[0])}"><img src="${esc(p.src)}" width="${p.width}" height="${p.height}" alt="${esc(tx(p.alt))}" loading="eager" decoding="async"></a>`).join('')}</div>`;
}

// Corrections and open questions are the same two blocks wherever a class is read: the
// list page prints them under its rows, the gallery page under its visit record. One
// renderer, so a question can never be answered on one surface and open on the other.
export function renderIspravke(spisak) {
  if (!(spisak.ispravke || []).length) return '';
  return `
<section aria-labelledby="cas03-ispravke-title"><div class="section-heading"><div><p class="eyebrow">${tr('Filed today', 'Zavedeno danas')}</p><h2 id="cas03-ispravke-title">${tr('Corrections to earlier records', 'Ispravke ranijih zapisa')}</h2></div><p>${tr('A correction never erases the earlier record — it is written down beside it, with its source and its date.', 'Ispravka ne briše raniji zapis — upisuje se uz njega, sa izvorom i datumom.')}</p></div>
  <ol class="lesson-results cas03-ispravke">${spisak.ispravke.map(fix => `<li id="${esc(fix.id)}">${esc(tx(fix.sta))} <span class="cas03-note">${esc(fix.izvor)}</span></li>`).join('')}</ol>
</section>`;
}

export function renderRazjasni(spisak) {
  if (!(spisak.razjasni || []).length) return '';
  return `
<section aria-labelledby="cas03-razjasni-title"><div class="section-heading"><div><p class="eyebrow">${tr('Marked as unclear', 'Označeno kao nejasno')}</p><h2 id="cas03-razjasni-title">${tr('Open for clarification', 'Otvoreno za razjašnjenje')}</h2></div><p>${tr('If your row is wrong or incomplete, say so at the class — the list is corrected with the correction written down.', 'Ako je tvoj zapis pogrešan ili nepotpun, javi na času — spisak se ispravlja uz upisanu ispravku.')}</p></div>
  <ol class="lesson-results cas03-questions">${spisak.razjasni.map(q => `<li id="${esc(q.id)}">${esc(tx(q.sta))}</li>`).join('')}</ol>
</section>`;
}
