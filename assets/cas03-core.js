// A class list as course material: one register of photographed works per class
// (data/cas-03/spisak.json, data/cas-04/spisak.json …), rendered by the same code that
// stamps the static baseline. Students' names live only in the register — never as
// literals in this source. What the teacher has not confirmed is published as
// unconfirmed: the uncertain rows, the open questions (razjasni), the corrections filed
// against earlier records (ispravke) and the photographs still on the phone.
// 23.10.2026: the week, the ordinal, the title and the lede come from the register, so a
// new class is a new register plus a shell — never a second copy of this renderer.
// Rows with zero photographs are not dropped: attendance was recorded, so they stand in
// their own part ("Šta se čeka") with what that work announced.

import { esc, tr, tx, number } from './core.js';
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
  fail(keys(spisak?.sigurno, ['do', 'od']) && spisak.sigurno?.do >= 1 && spisak.sigurno?.od > spisak.sigurno?.do, 'The certain zones must be given as do/od row numbers.');
  // The week, the ordinal and the headline are register facts: a class names itself.
  fail(spisak?.nedelja === undefined || Number.isInteger(spisak.nedelja) && spisak.nedelja >= 1, 'nedelja must be a week number.');
  fail(spisak?.redni === undefined || bilingual(spisak.redni), 'redni (the ordinal of the class) must be bilingual.');
  fail(spisak?.naslov === undefined || bilingual(spisak.naslov), 'naslov must be bilingual.');
  fail(spisak?.lede === undefined || bilingual(spisak.lede), 'lede must be bilingual.');
  fail(spisak?.nizNapomena === undefined || bilingual(spisak.nizNapomena), 'nizNapomena must be bilingual.');
  fail(spisak?.udruzenjeNalazi === undefined || (Array.isArray(spisak.udruzenjeNalazi) && spisak.udruzenjeNalazi.length > 0 && spisak.udruzenjeNalazi.every(bilingual)), 'udruzenjeNalazi must be a non-empty list of bilingual findings.');
  // A class whose field part has its own visit register names it here; the register stays
  // the single source of that day's roster (data/poseta-*.json, course-visit/v1).
  fail(spisak?.posetaRegistar === undefined || (typeof spisak.posetaRegistar === 'string' && /^data\/[\w./-]+\.json$/.test(spisak.posetaRegistar)), 'posetaRegistar must be a path to a visit register.');
  // Corrections to earlier records are published with their own source, like every result.
  fail(spisak?.ispravke === undefined || Array.isArray(spisak.ispravke), 'ispravke must be a list.');
  for (const fix of spisak?.ispravke || []) fail(keys(fix, ['id', 'sta', 'izvor']) && ID.test(fix?.id || '') && bilingual(fix?.sta) && typeof fix?.izvor === 'string' && fix.izvor.trim(), 'Each correction needs an id, bilingual text and a source.');
  // The intake anchor: which phone, which folder, which frame the sequence starts from.
  if (spisak?.prijem !== undefined) fail(keys(spisak.prijem, ['uredjaj', 'putanja', 'prviSnimak', 'prviSnimakVreme', 'napomena']) && bilingual(spisak.prijem?.napomena), 'prijem needs the device, the path, the first frame and a bilingual note.');
  fail(Array.isArray(spisak?.radovi) && spisak.radovi.length > 0, 'List rows required.');
  const questionIds = new Set((spisak?.razjasni || []).map(q => q?.id));
  (spisak?.radovi || []).forEach((row, i) => {
    const at = `Row ${i + 1}`;
    fail(row?.rb === i + 1, `${at}: rb must run 1..n in order.`);
    fail(row.ime === null || (typeof row.ime === 'string' && row.ime.trim()), `${at}: ime is a name or null.`);
    fail(row.indeks === null || STUDENT.test(row.indeks || ''), `${at}: indeks is a student number or null.`);
    fail(row.rad === null || (typeof row.rad === 'string' && row.rad.trim()), `${at}: rad is a title or null.`);
    fail(row.slike === null || (Number.isInteger(row.slike) && row.slike >= 0), `${at}: slike is a photograph count or null.`);
    fail(!('prviTalas' in row) || ID.test(row.prviTalas || ''), `${at}: prviTalas must be a registry id.`);
    fail(!('razjasni' in row) || questionIds.has(row.razjasni), `${at}: razjasni must name a listed question.`);
    fail(row.napomena === undefined || bilingual(row.napomena), `${at}: napomena must be bilingual.`);
    fail(keys(row, ['rb', 'ime', 'indeks', 'rad', 'slike', ...(row.prviTalas ? ['prviTalas'] : []), ...(row.razjasni ? ['razjasni'] : []), ...(row.potvrditi ? ['potvrditi'] : []), ...(row.napomena ? ['napomena'] : [])]), `${at}: unknown row fields.`);
  });
  // The uncertain zone must be exactly the gap between the certain zones — no more, no less.
  const gap = (spisak?.radovi || []).filter(row => row.potvrditi).map(row => row.rb);
  const expected = spisak?.radovi ? (spisak.radovi.slice(spisak.sigurno?.do, spisak.sigurno?.od - 1).map(row => row.rb)) : [];
  fail(JSON.stringify(gap) === JSON.stringify(expected), 'The potvrditi rows must be exactly the rows between the certain zones.');
  fail(Array.isArray(spisak?.razjasni), 'razjasni must be a list.');
  for (const q of spisak?.razjasni || []) fail(keys(q, ['id', 'sta']) && ID.test(q?.id || '') && bilingual(q?.sta), 'Each razjasni question needs an id and bilingual text.');
  return problems;
}

const keys = (obj, allowed) => obj && typeof obj === 'object' && !Array.isArray(obj) && Object.keys(obj).every(k => allowed.includes(k));
const srDate = iso => iso.split('-').reverse().join('.');

export function renderCas03(spisak, prototypes, poseta = null) {
  const problems = validateCas03(spisak);
  for (const row of spisak?.radovi || []) if (row.prviTalas && !prototypes?.items?.some(item => item.id === row.prviTalas)) problems.push(`Row ${row.rb}: prviTalas "${row.prviTalas}" is not in the work register.`);
  if (problems.length) throw new Error(problems.join('\n'));
  // The third class is the register that predates these fields; its defaults keep its
  // page byte-identical, and every later class states its own week and headline.
  const nedelja = spisak.nedelja ?? 3;
  const redni = spisak.redni ?? { sr: 'treći čas', en: 'third class' };
  const naslov = spisak.naslov ?? { sr: 'Spisak radova trećeg časa.', en: 'The list of the third class.' };
  const lede = spisak.lede ?? {
    sr: 'Dvadeset devet radova fotografisano na času, redom kojim su slikani. Broj uz svaki zapis broji fotografije, a svaki niz se čita isto: počinje kutijom odnosno slikama sa diplomskih, a završava se slikom iz okruženja u kome korisnica proba prototip.',
    en: 'Twenty-nine works photographed in class, in shooting order. The number beside each entry counts photographs, and every sequence is read the same way: it starts with the box and the degree photographs and ends with the picture of the environment in which a user tries the prototype.',
  };
  const renderRow = row => {
    const name = row.ime || '—';
    const indeks = row.indeks || '—';
    const rad = row.rad ? esc(row.rad) : `<span class="cas03-missing">${tr('title not recorded', 'naziv nije zabeležen')}</span>`;
    const slike = row.slike === 0 ? `<span class="cas03-bez">${tr('no photographs', 'bez fotografija')}</span>` : row.slike === null ? `<span class="cas03-missing">${tr('count not recorded', 'broj nije zabeležen')}</span>` : tr(`${row.slike} photo${row.slike === 1 ? '' : 's'}`, `${row.slike} ${row.slike === 1 ? 'fotografija' : row.slike < 5 ? 'fotografije' : 'fotografija'}`);
    const wave = row.prviTalas && !withheldWorkIds.includes(row.prviTalas) ? ` <a class="cas03-wave" href="prototipovi.html#${esc(row.prviTalas)}">${tr('first wave — gallery', 'prvi talas — galerija')} ↗</a>` : '';
    const ask = row.razjasni ? ` <a class="cas03-ask" href="#${esc(row.razjasni)}">${tr('open question', 'otvoreno pitanje')} ↓</a>` : '';
    const confirm = row.potvrditi ? ` <span class="cas03-confirm">${tr('awaits confirmation', 'čeka potvrdu')}</span>` : '';
    const note = row.napomena ? `<span class="cas03-note">${esc(tx(row.napomena))}</span>` : '';
    return `<li data-cas03-row="${row.rb}"${row.potvrditi ? ' class="cas03-neizvesno"' : ''}><span data-cas03-name>${esc(name)}</span><span data-cas03-indeks>${esc(indeks)}</span><span class="cas03-rad">${rad}</span><span class="cas03-slike">${slike}</span>${confirm}${wave}${ask}${note}</li>`;
  };
  // Attendance without a photograph is still attendance: those rows leave the first
  // list and stand below, named, so nobody disappears for lacking a picture.
  const cekaju = spisak.radovi.filter(row => row.slike === 0);
  const rows = spisak.radovi.filter(row => row.slike !== 0).map(renderRow).join('');
  const questions = spisak.razjasni.map(q => `<li id="${esc(q.id)}">${esc(tx(q.sta))}</li>`).join('');
  const svisigurni = spisak.sigurno.od > spisak.radovi.length;
  const certainty = svisigurni
    ? tr('Every entry stands as recorded by the teacher on the day of the class.', 'Svaki zapis stoji onako kako ga je nastavnik zabeležio na dan časa.')
    : tr(`Entries 1–${number(spisak.sigurno.do)} and ${number(spisak.sigurno.od)}–${number(spisak.radovi.length)} stand as certain; the rows between are published as unconfirmed.`, `Zapisi 1–${number(spisak.sigurno.do)} i ${number(spisak.sigurno.od)}–${number(spisak.radovi.length)} stoje kao sigurni; redovi između objavljeni su kao nepotvrđeni.`);
  const cekajuSection = cekaju.length ? `
<section aria-labelledby="cas03-cekamo-title"><div class="section-heading"><div><p class="eyebrow">${tr('Recorded attendance', 'Zavedeno prisustvo')}</p><h2 id="cas03-cekamo-title">${tr('What we wait for', 'Šta se čeka')}</h2></div><p>${tr(`${cekaju.length} entries carry attendance without photographs. The attendance is recorded; what is missing is the photograph, and beside each entry stands what was announced for it.`, `${cekaju.length} zapisa nosi prisustvo bez fotografija. Prisustvo je zavedeno; nedostaje fotografija, a uz svaki zapis stoji ono što je za njega najavljeno.`)}</p></div>
  <ol class="cas03-rows cas03-cekamo" data-cas03-list="${esc(spisak.id)}" aria-label="${tr('Attendance without photographs', 'Prisustvo bez fotografija')}">${cekaju.map(renderRow).join('')}</ol>
</section>` : '';
  const ispravke = (spisak.ispravke || []).length ? `
<section aria-labelledby="cas03-ispravke-title"><div class="section-heading"><div><p class="eyebrow">${tr('Filed today', 'Zavedeno danas')}</p><h2 id="cas03-ispravke-title">${tr('Corrections to earlier records', 'Ispravke ranijih zapisa')}</h2></div><p>${tr('A correction never erases the earlier record — it is written down beside it, with its source and its date.', 'Ispravka ne briše raniji zapis — upisuje se uz njega, sa izvorom i datumom.')}</p></div>
  <ol class="lesson-results cas03-ispravke">${spisak.ispravke.map(fix => `<li id="${esc(fix.id)}">${esc(tx(fix.sta))} <span class="cas03-note">${esc(fix.izvor)}</span></li>`).join('')}</ol>
</section>` : '';
  const nizNapomena = spisak.nizNapomena ? esc(tx(spisak.nizNapomena))
    : tr('Every photograph taken in the third class is published with the work it belongs to, read in shooting order: each sequence starts with the box and the degree photographs and ends with the picture of the environment in which a user tries the prototype. The number beside each entry is the number of photographs that work got.', 'Svaka fotografija snimljena na trećem času objavljena je uz rad kome pripada, čitana redom slikanja: svaki niz počinje kutijom odnosno slikama sa diplomskih, a završava se slikom iz okruženja u kome korisnica proba prototip. Broj uz svaki zapis jeste broj fotografija koje je taj rad dobio.');
  const nalazi = (spisak.udruzenjeNalazi || [
    { sr: 'Direktor udruženja pohvalio je studentske prototipe.', en: 'The director of the association praised the student prototypes.' },
    { sr: 'Primetna je želja korisnika da isprobavaju prototipe koje studenti kreiraju.', en: "The users' wish to try the prototypes the students create was clear." },
    { sr: 'Pomenut je mogući konkurs od strane udruženja.', en: 'A possible competition run by the association was mentioned.' },
  ]).map(n => `\n    <li>${esc(tx(n))}</li>`).join('');
  // The field part of the class has its own register: who went to the association that
  // day. It is a roster, not a finding — the findings wait for the photographs.
  const posetaSection = poseta && Array.isArray(poseta.participants) && poseta.participants.length ? `
<section class="field-visit" aria-labelledby="cas03-poseta-title"><div class="section-heading"><div><p class="eyebrow">${tr('Recorded attendance', 'Zavedeno prisustvo')} · <time datetime="${esc(poseta.occurredOn)}">${esc(srDate(poseta.occurredOn))}.</time></p><h2 id="cas03-poseta-title">${tr('On the association visit', 'Na poseti udruženju')}</h2></div><p>${tr(`${poseta.participants.length} students are recorded on the visit, in the order the teacher wrote them.`, `${number(poseta.participants.length)} studenata je zavedeno na poseti, redom kojim ih je nastavnik zapisao.`)}</p></div>
  <ul class="visit-participants visit-compact" data-visit-participants="${esc(poseta.id)}" aria-label="${tr('Students on the visit', 'Studenti na poseti')}">${poseta.participants.map(person => `<li><span data-participant-name>${esc(person.name)}</span><span data-participant-number>${esc(person.studentNumber)}</span></li>`).join('')}</ul>
  <p class="help">${esc(tx(poseta.summary))}</p>
</section>` : '';
  const prijem = spisak.prijem ? `<p class="help">${tr('Intake', 'Prijem')}: ${esc(spisak.prijem.uredjaj)} · ${esc(spisak.prijem.putanja)} · ${tr('sequence begins with', 'niz počinje snimkom')} <code>${esc(spisak.prijem.prviSnimak)}</code>. ${esc(tx(spisak.prijem.napomena))}</p>` : '';
  return `<div class="page-top flow-intro"><div><p class="eyebrow">${tr('Week', 'Nedelja')} ${nedelja} · ${esc(tx(redni))} · <time datetime="${esc(spisak.odrzan)}">${esc(srDate(spisak.odrzan))}.</time></p>
  <h1>${esc(tx(naslov))}</h1></div>
  <p class="lede">${esc(tx(lede))}</p></div>
<p class="notice">${esc(tx(spisak.napomena))}</p>
<section aria-labelledby="cas03-rows-title"><div class="section-heading"><div><p class="eyebrow">${tr('Segment one', 'Prvi segment')}</p><h2 id="cas03-rows-title">${tr('Prototypes and photographs', 'Prototipi i slike')}</h2></div><p>${certainty}</p></div>
  <ol class="cas03-rows" data-cas03-list="${esc(spisak.id)}" aria-label="${tr('Works in shooting order', 'Radovi redom slikanja')}">${rows}</ol>
  <p class="notice">${nizNapomena}</p>${prijem}
</section>${cekajuSection}
<section aria-labelledby="cas03-udruzenje-title"><div class="section-heading"><div><p class="eyebrow">${tr('Segment two', 'Drugi segment')}</p><h2 id="cas03-udruzenje-title">${tr('From the association', 'Analiza iz udruženja')}</h2></div></div>
  <ol class="lesson-results">${nalazi}
  </ol>
  <p class="help">${esc(tx(spisak.analizaUdruzenja))}</p>
</section>${posetaSection}${ispravke}
<section aria-labelledby="cas03-razjasni-title"><div class="section-heading"><div><p class="eyebrow">${tr('Marked as unclear', 'Označeno kao nejasno')}</p><h2 id="cas03-razjasni-title">${tr('Open for clarification', 'Otvoreno za razjašnjenje')}</h2></div><p>${tr('If your row is wrong or incomplete, say so at the class — the list is corrected with the correction written down.', 'Ako je tvoj zapis pogrešan ili nepotpun, javi na času — spisak se ispravlja uz upisanu ispravku.')}</p></div>
  <ol class="lesson-results cas03-questions">${questions}</ol>
</section>
<aside class="prototype-context"><h2>${tr('Sources of this page', 'Izvori ove strane')}</h2><p>${esc(tx(spisak.source.description))}</p><p>${tr('Attribution of the documented works stands in the gallery of works; this list carries names and student numbers only beside the photographs they explain.', 'Autorstvo dokumentovanih radova stoji u galeriji radova; ovaj spisak nosi imena i brojeve indeksa samo uz fotografije koje objašnjava.')}</p></aside>`;
}
