// The cover: the entrance to the subject, not a show. One sentence of truth, the live
// counts of the course flow, and the doors a student actually needs — held classes,
// the next class, the cloud of ideas, the works, the library, the association, the course.
// No animation for animation's sake (12 October 2026, course lead's note): the printable
// A3 cover stays for print, and the static markup carries the same words without JavaScript.

import { $, esc, tr, mount, loadJSON } from './core.js';
import { identity } from './identity.js';
import { validateTok } from './tok-core.js';

let tok = null;          // live flow data — the counts are truth, not decoration

function doors() {
  return `
<nav class="cover-doors" aria-label="${tr('Where to go from the cover', 'Kuda sa naslovne')}">
  <a class="cover-door" href="index.html"><span class="cover-door-num" aria-hidden="true">01</span><span><b>${tr('Held classes', 'Održano')}</b><span>${tr('The classes in order: results, photographs, material.', 'Časovi redom: rezultati, fotografije, gradivo.')}</span></span></a>
  <a class="cover-door" href="sledeci.html"><span class="cover-door-num" aria-hidden="true">02</span><span><b>${tr('Next class', 'Sledeći čas')}</b><span>${tr('What to bring and what we do — entered after each class.', 'Šta se donosi i šta se radi — upisuje se posle svakog časa.')}</span></span></a>
  <a class="cover-door" href="oblak.html"><span class="cover-door-num" aria-hidden="true">03</span><span><b>${tr('Cloud of ideas', 'Oblak ideja')}</b><span>${tr('Everything that has no week yet — proposals and inspiration.', 'Sve što još nema nedelju — predlozi i inspiracija.')}</span></span></a>
  <a class="cover-door" href="prototipovi.html"><span class="cover-door-num" aria-hidden="true">04</span><span><b>${tr('Works and examples', 'Radovi i primeri')}</b><span>${tr('Student prototypes, drawings and teacher examples.', 'Studentski prototipovi, crteži i nastavnički primeri.')}</span></span></a>
  <a class="cover-door" href="resources.html"><span class="cover-door-num" aria-hidden="true">05</span><span><b>${tr('Library and sources', 'Biblioteka i izvori')}</b><span>${tr('Standards, readings and reference pages.', 'Standardi, literatura i referentne strane.')}</span></span></a>
  <a class="cover-door" href="udruzenje.html"><span class="cover-door-num" aria-hidden="true">06</span><span><b>${tr('The association', 'Udruženje')}</b><span>${tr('Živimo zajedno: trying the prototypes, rights and steps.', 'Živimo zajedno: probavanje prototipova, prava i koraci.')}</span></span></a>
  <a class="cover-door" href="predmet.html"><span class="cover-door-num" aria-hidden="true">07</span><span><b>${tr('The course', 'Predmet')}</b><span>${tr('Aims, marking, and the exam format.', 'Ciljevi, bodovanje i format ispita.')}</span></span></a>
</nav>`;
}

function view() {
  const odrzano = tok ? tok.odrzano.length : Number($('.cover-stage')?.dataset.odrzano || 0);
  const sledeci = tok ? tok.sledeci.filter(item => item.vrsta === 'cas' && typeof item.nedelja === 'number')[0]?.nedelja
    : Number($('.cover-stage')?.dataset.sledeciNedelja || 0);
  const ideje = tok ? tok.ideje.length : Number($('.cover-stage')?.dataset.ideje || 0);
  return `
<div class="cover-stage" data-odrzano="${odrzano}" data-sledeci-nedelja="${sledeci ?? ''}" data-ideje="${ideje}">
  <div class="cover-title">
    <p class="eyebrow">${tr('The course workbook · cover', 'Radna sveska predmeta · naslovna')}</p>
    <h1>${tr('A workbook<br>that grows.', 'Sveska<br>koja raste.')}</h1>
    <p class="lede">${tr(
      'Each week of this course ends as one A3 sheet — horizontal, printed and digital. Sheet by sheet, the weeks stack into the workbook you hand in at the exam.',
      'Svaka nedelja ovog predmeta završava se jednim A3 listom — horizontalnim, štampanim i digitalnim. List po list, nedelje se ređaju u svesku koju predaješ na ispitu.')}</p>
    <p class="cover-count">${tr('Week', 'Nedelja')} <b data-count="odrzano">${odrzano}</b> ${tr('held', 'održana')} · <b data-count="oblak">${ideje}</b> ${tr('ideas in the cloud', 'ideja u oblaku')} · ${tr('week', 'nedelja')} <b data-count="sledeci-nedelja">${sledeci ?? '—'}</b> ${tr('on its way', 'na putu')}</p>
  </div>
</div>
${doors()}
<section class="print-only print-cover" aria-label="${tr('The printable A3 cover of the workbook', 'Naslovna A3 strana radne sveske za štampu')}">
  <div class="print-cover-mark" aria-hidden="true"><span></span></div>
  <h2>${esc(tr(identity.title.en, identity.title.sr))} — radna sveska</h2>
  <p class="print-cover-sub">A3 horizontalna radna sveska · štampana + digitalna · 2026/2027</p>
  <dl class="print-cover-fields">
    <div><dt>Ime i prezime / Name</dt><dd></dd></div>
    <div><dt>Tim / Team</dt><dd></dd></div>
    <div><dt>Fakultet / Faculty</dt><dd>Fakultet za graditeljski menadžment, Univerzitet „Union — Nikola Tesla”, Beograd</dd></div>
    <div><dt>Broj listova / Sheets</dt><dd></dd></div>
  </dl>
  <p class="print-cover-note">Svaka nastavna nedelja dodaje jedan list. Sveska se predaje na kolokvijumu/ispitu u formatu iznad.</p>
</section>`;
}

function render() {
  $('#main').innerHTML = view();
}

async function load() {
  try {
    const data = await loadJSON('data/tok.json');
    const problems = validateTok(data);
    if (problems.length) throw new Error(problems[0]);
    tok = data;
  } catch (error) {
    console.warn(error); // the static counts stand; nothing is invented
  }
  render();
}

mount({ view: 'cover', render: () => {}, title: () => tr('Cover', 'Naslovna') });
load();
