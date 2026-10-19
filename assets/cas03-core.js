// The third-class list as course material: one register of photographed works
// (data/cas-03/spisak.json), rendered by the same code that stamps the static baseline.
// Students' names live only in the register — never as literals in this source.
// What the teacher has not confirmed is published as unconfirmed: the uncertain rows
// (17–20), the open questions (razjasni) and the photographs still on the phone.

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

export function renderCas03(spisak, prototypes) {
  const problems = validateCas03(spisak);
  for (const row of spisak?.radovi || []) if (row.prviTalas && !prototypes?.items?.some(item => item.id === row.prviTalas)) problems.push(`Row ${row.rb}: prviTalas "${row.prviTalas}" is not in the work register.`);
  if (problems.length) throw new Error(problems.join('\n'));
  const rows = spisak.radovi.map(row => {
    const name = row.ime || '—';
    const indeks = row.indeks || '—';
    const rad = row.rad ? esc(row.rad) : `<span class="cas03-missing">${tr('title not recorded', 'naziv nije zabeležen')}</span>`;
    const slike = row.slike === null ? `<span class="cas03-missing">${tr('count not recorded', 'broj nije zabeležen')}</span>` : tr(`${row.slike} photo${row.slike === 1 ? '' : 's'}`, `${row.slike} ${row.slike === 1 ? 'fotografija' : row.slike < 5 ? 'fotografije' : 'fotografija'}`);
    const wave = row.prviTalas && !withheldWorkIds.includes(row.prviTalas) ? ` <a class="cas03-wave" href="prototipovi.html#${esc(row.prviTalas)}">${tr('first wave — gallery', 'prvi talas — galerija')} ↗</a>` : '';
    const ask = row.razjasni ? ` <a class="cas03-ask" href="#${esc(row.razjasni)}">${tr('open question', 'otvoreno pitanje')} ↓</a>` : '';
    const confirm = row.potvrditi ? ` <span class="cas03-confirm">${tr('awaits confirmation', 'čeka potvrdu')}</span>` : '';
    const note = row.napomena ? `<span class="cas03-note">${esc(tx(row.napomena))}</span>` : '';
    return `<li data-cas03-row="${row.rb}"${row.potvrditi ? ' class="cas03-neizvesno"' : ''}><span data-cas03-name>${esc(name)}</span><span data-cas03-indeks>${esc(indeks)}</span><span class="cas03-rad">${rad}</span><span class="cas03-slike">${slike}</span>${confirm}${wave}${ask}${note}</li>`;
  }).join('');
  const questions = spisak.razjasni.map(q => `<li id="${esc(q.id)}">${esc(tx(q.sta))}</li>`).join('');
  return `<div class="page-top flow-intro"><div><p class="eyebrow">${tr('Week', 'Nedelja')} 3 · ${tr('third class', 'treći čas')} · <time datetime="${esc(spisak.odrzan)}">${esc(srDate(spisak.odrzan))}.</time></p>
  <h1>${tr('The list of the third class.', 'Spisak radova trećeg časa.')}</h1></div>
  <p class="lede">${tr('Twenty-nine works photographed in class, in shooting order. The number beside each entry counts photographs, and every sequence is read the same way: it starts with the box and the degree photographs and ends with the picture of the environment in which a user tries the prototype.', 'Dvadeset devet radova fotografisano na času, redom kojim su slikani. Broj uz svaki zapis broji fotografije, a svaki niz se čita isto: počinje kutijom odnosno slikama sa diplomskih, a završava se slikom iz okruženja u kome korisnica proba prototip.')}</p></div>
<p class="notice">${esc(tx(spisak.napomena))}</p>
<section aria-labelledby="cas03-rows-title"><div class="section-heading"><div><p class="eyebrow">${tr('Segment one', 'Prvi segment')}</p><h2 id="cas03-rows-title">${tr('Prototypes and photographs', 'Prototipi i slike')}</h2></div><p>${tr(`Entries 1–${number(spisak.sigurno.do)} and ${number(spisak.sigurno.od)}–${number(spisak.radovi.length)} stand as certain; the rows between are published as unconfirmed.`, `Zapisi 1–${number(spisak.sigurno.do)} i ${number(spisak.sigurno.od)}–${number(spisak.radovi.length)} stoje kao sigurni; redovi između objavljeni su kao nepotvrđeni.`)}</p></div>
  <ol class="cas03-rows" data-cas03-list="${esc(spisak.id)}" aria-label="${tr('Works in shooting order', 'Radovi redom slikanja')}">${rows}</ol>
  <p class="notice">${tr('New photographs from the third class are temporarily withdrawn while their content and links to the work list are checked. The list remains below; previous class records are unchanged.', 'Nove fotografije trećeg časa privremeno su povučene dok se provere njihov sadržaj i veze sa spiskom radova. Spisak ostaje ispod; zapisi prethodnih časova su sačuvani.')}</p>
</section>
<section aria-labelledby="cas03-udruzenje-title"><div class="section-heading"><div><p class="eyebrow">${tr('Segment two', 'Drugi segment')}</p><h2 id="cas03-udruzenje-title">${tr('From the association', 'Analiza iz udruženja')}</h2></div></div>
  <ol class="lesson-results">
    <li>${tr('The director of the association praised the student prototypes.', 'Direktor udruženja pohvalio je studentske prototipe.')}</li>
    <li>${tr("The users' wish to try the prototypes the students create was clear.", 'Primetna je želja korisnika da isprobavaju prototipe koje studenti kreiraju.')}</li>
    <li>${tr('A possible competition run by the association was mentioned.', 'Pomenut je mogući konkurs od strane udruženja.')}</li>
  </ol>
  <p class="help">${esc(tx(spisak.analizaUdruzenja))}</p>
</section>
<section aria-labelledby="cas03-razjasni-title"><div class="section-heading"><div><p class="eyebrow">${tr('Marked as unclear', 'Označeno kao nejasno')}</p><h2 id="cas03-razjasni-title">${tr('Open for clarification', 'Otvoreno za razjašnjenje')}</h2></div><p>${tr('If your row is wrong or incomplete, say so at the class — the list is corrected with the correction written down.', 'Ako je tvoj zapis pogrešan ili nepotpun, javi na času — spisak se ispravlja uz upisanu ispravku.')}</p></div>
  <ol class="lesson-results cas03-questions">${questions}</ol>
</section>
<aside class="prototype-context"><h2>${tr('Sources of this page', 'Izvori ove strane')}</h2><p>${esc(tx(spisak.source.description))}</p><p>${tr('Attribution of the documented works stands in the gallery of works; this list carries names and student numbers only beside the photographs they explain.', 'Autorstvo dokumentovanih radova stoji u galeriji radova; ovaj spisak nosi imena i brojeve indeksa samo uz fotografije koje objašnjava.')}</p></aside>`;
}
