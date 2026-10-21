import { esc, tr, tx } from './core.js';
import { identity } from './identity.js';
import { galleryTiles } from './galleries.js';


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

export function renderCover(tok, data) {
  const odrzano = tok.odrzano.length;
  const sledeci = tok.sledeci.find(i => i.vrsta === 'cas' && Number.isInteger(i.nedelja))?.nedelja;
  const ideje = tok.ideje.length;
  const latest = [...tok.odrzano].sort((a,b) => b.odrzan.localeCompare(a.odrzan))[0];
  const groups = data.galleries || [];
  const selected = ['castle', 'touch', 'kutija'].map(id => groups.find(g => g.id === id)).filter(Boolean);
  return `
<div class="cover-stage" data-odrzano="${odrzano}" data-sledeci-nedelja="${sledeci ?? ''}" data-ideje="${ideje}">
  <div class="cover-title">
    <p class="eyebrow">${tr('Principles of universal design', 'Principi univerzalnog dizajna')}</p>
    <h1>${tr('Design begins<br>with a person.', 'Dizajn počinje<br>od čoveka.')}</h1>
    <p class="lede">${tr('Different hands, needs and ways of living. Through sketches, objects and encounters, we explore how design can open more possibilities.', 'Različite ruke, potrebe i načini života. Kroz skice, predmete i susrete istražujemo kako dizajn može da otvori više mogućnosti.')}</p>
    <a class="button" href="index.html">${tr('Explore our work', 'Pogledaj šta radimo')} ↗</a>
    <p class="cover-count"><b data-count="odrzano">${odrzano}</b> ${tr('held classes', 'održana časa')} · <b data-count="oblak">${ideje}</b> ${tr('ideas', 'ideja')}</p>
  </div>
  <div class="cover-exhibit">${galleryTiles(selected)}<p>${tr('From our classroom · sketches become objects.', 'Iz naše učionice · skice postaju predmeti.')}</p></div>
</div>
<section class="cover-latest"><div><p class="eyebrow">${tr('Latest class', 'Poslednji čas')} · ${latest ? esc(latest.odrzan.split('-').reverse().join('.')) : ''}</p><h2>${latest ? esc(tx(latest.naslov)) : ''}</h2><p>${latest?.rezultati[0] ? esc(tx(latest.rezultati[0].sta)) : ''}</p><a href="index.html#odrzano">${tr('Read the class record', 'Otvori zapis časa')} →</a></div><div class="cover-workbook"><span class="cover-a3" aria-hidden="true">A3</span><h2>${tr('A workbook that grows.', 'Sveska koja raste.')}</h2><p>${tr('One landscape A3 sheet each week, printed and digital. Sketches, measurements and discoveries become your course workbook.', 'Jedan horizontalni A3 list svake nedelje, štampan i digitalan. Skice, mere i otkrića postaju tvoja radna sveska.')}</p><a href="predmet.html">${tr('The course and the workbook', 'Predmet i radna sveska')} →</a><span class="sr-only">${tr('Next week', 'Sledeća nedelja')}: <b data-count="sledeci-nedelja">${sledeci ?? '—'}</b></span></div></section>
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
