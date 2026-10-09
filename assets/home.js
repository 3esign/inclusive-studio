// The landing holds what the course has actually done: held classes in order, each with its
// results, its material and its A3 sheet of the exam workbook — plus the material that helps.
// The next class and the cloud of ideas have their own pages; here they are one line each.
// A deep link (?w=N) still opens the week itself — published URLs keep working.
// Data comes from data/tok.json and data/material/wNN.json; nothing is retold by hand here.

import { $, esc, tr, tx, number, loadJSON, mount, announce, link, setFlowCounts } from './core.js';
import { notices } from './course.js';
import { MATERIAL_INDEX, weekFile, validateIndex, validateWeek, currentWeek, weekStats } from './material.js';
import { resolveRefs, renderBlocks, weekLine } from './blocks.js';
import { validateTok } from './tok-core.js';
import { exercises } from './exercises.js';

const params = new URLSearchParams(location.search);
const showDrafts = params.get('draft') === '1';
const wanted = Number(params.get('w'));
const weekMode = Number.isInteger(wanted) && wanted > 0;

// The old home lived here; keep its links working instead of breaking published URLs.
if (params.has('stage')) location.replace('studio.html' + location.search);

/* ============================ the week view (?w=N) ============================ */

let state = { phase: 'loading', index: null, week: null, refs: null, problems: [] };

async function loadWeek() {
  try {
    const index = await loadJSON(MATERIAL_INDEX);
    const check = validateIndex(index);
    if (!check.ok) { state = { phase: 'broken', problems: check.problems, index }; return; }
    const entries = index.weeks.slice().sort((a, b) => a.n - b.n);
    const entry = (Number.isInteger(wanted) && entries.find(item => item.n === wanted)) || currentWeek(index);
    if (!entry) { state = { phase: 'empty', index }; return; }
    if (entry.state === 'draft' && !showDrafts && !(Number.isInteger(wanted) && wanted === entry.n)) {
      state = { phase: 'empty', index }; return;
    }
    const week = await loadJSON(weekFile(entry.n));
    const weekCheck = validateWeek(week);
    if (!weekCheck.ok) { state = { phase: 'broken', problems: weekCheck.problems, index, week }; return; }
    const refs = await resolveRefs(week.blocks);
    state = { phase: 'ready', index, week, refs, problems: [] };
  } catch (error) {
    state = { phase: 'offline', problems: [String(error.message || error)], index: state.index };
  }
}

function picker() {
  const index = state.index;
  if (!index) return '';
  const entries = index.weeks.slice().sort((a, b) => a.n - b.n).filter(entry => entry.state === 'published' || showDrafts);
  const current = state.week ? state.week.n : null;
  return `<nav class="week-picker" aria-label="${tr('Weeks', 'Nedelje')}"><ol>${entries.map(entry => `<li><a href="index.html?w=${entry.n}${showDrafts ? '&draft=1' : ''}"${entry.n === current ? ' aria-current="page"' : ''}><span>${String(entry.n).padStart(2, '0')}</span> ${esc(tx(entry.title))}${entry.state === 'draft' ? ` <em>${tr('draft', 'nacrt')}</em>` : ''}</a></li>`).join('')}</ol>
  ${showDrafts ? '' : `<p class="help">${link('index.html?draft=1', tr('Show the weeks still in draft', 'Prikaži nedelje koje su još u nacrtu'))}</p>`}</nav>`;
}

// The whole announcement board of this course is three facts. Everything else is material,
// and material lives further down the page. Source of the three: assets/course.js → notices.
function noticesBoard(weekNumber = null) {
  return `<section class="week-contract notices" aria-labelledby="week-contract-title">
  <div><p class="eyebrow">${tr('Notices — all of them', 'Obaveštenja — sva')}</p>
  <h2 id="week-contract-title">${tr('One week. One A3. One conversation.', 'Jedna nedelja. Jedan A3. Jedan razgovor.')}</h2></div>
  <ol class="notice-list">${notices.map((item, index) => `<li><b>${number(index + 1)}</b><div><h3>${esc(tx(item.title))}</h3><p>${esc(tx(item.body))}</p></div></li>`).join('')}</ol>
  <dl class="a3-strip"><div><dt>${tr('Student', 'Student')}</dt><dd>${tr('name and index', 'ime i indeks')}</dd></div><div><dt>${tr('Week', 'Nedelja')}</dt><dd>${weekNumber ? number(weekNumber) : '—'}</dd></div><div><dt>${tr('Review', 'Pregled')}</dt><dd>${tr('conversation in class', 'razgovor na času')}</dd></div><div><dt>${tr('Signature', 'Potpis')}</dt><dd>${tr('on the paper, after review', 'na papiru, posle pregleda')}</dd></div></dl>
  <p class="help">${tr('The teacher signs on the paper, after the review. The course rules determine how the signed sheets count toward assessment.', 'Nastavnik potpisuje na papiru, posle pregleda. Pravila predmeta određuju kako se potpisani listovi vrednuju.')} <a href="predmet.html">${tr('The course and the marking', 'Predmet i ocenjivanje')} →</a> · <a href="assets/sablon-a3.svg" download>${tr('A3 template', 'A3 šablon')} ↓</a></p>
  </section>`;
}

// How this sheet came to be: the week's revisions, visible — not just in the file.
// v1 is the first published state; every later entry says what changed and when.
function revisionsView(week) {
  const revs = Array.isArray(week.revizije) ? week.revizije : [];
  if (!revs.length) return '';
  const items = revs.map(r => `<li><b>v${r.v}</b> · <time>${esc(r.datum)}</time> — ${esc(tx(r.sta))}</li>`).join('');
  return `<details class="revisions"><summary>${tr('How this sheet was written', 'Kako je ovaj list nastajao')} · v${revs[revs.length - 1].v}</summary><ol>${items}</ol><p class="help">${tr('Full history travels with the material file in the repository.', 'Cela istorija ide uz fajl gradiva u repozitorijumu.')}</p></details>`;
}

function readyView() {
  const week = state.week;
  const stats = weekStats(week);
  const bring = Array.isArray(week.bring) ? week.bring : [];
  const taskBlock = week.blocks.find(block => block.kind === 'exercise');
  const ownPage = { 'toy-for-coordination': 'igracka.html', 'app-for-one': 'zadatak.html' };
  const taskHref = (taskBlock && ownPage[taskBlock.ref]) || (taskBlock && state.refs.exercise[taskBlock.ref]?.href) || 'vezbe.html';
  return `<div class="page-top week-top"><div>
    <p class="eyebrow">${esc(weekLine(week))}</p>
    <h1>${esc(tx(week.title))}</h1>
    ${week.aim ? `<p class="lede">${esc(tx(week.aim))}</p>` : ''}
    <div class="actions"><a class="button" href="${esc(taskHref)}">${tr('This week’s task', 'Zadatak nedelje')} →</a><a class="button secondary" href="predavanje.html?w=${week.n}">${tr('Open as a lecture', 'Otvori kao predavanje')}</a><a class="button secondary" href="index.html">${tr('Held classes', 'Održani časovi')} ↑</a></div>
  </div><div class="page-meta">
    <span class="meta-label">${tr('Material', 'Građa')}</span><span>${tr('Entries', 'Unosi')}: ${stats.blocks} · ${tr('Slides', 'Slajdovi')}: ${stats.slides} · ${tr('Words', 'Reči')}: ${stats.words}</span>
    <span class="meta-label">${tr('Updated', 'Dopunjeno')}</span><span>${esc(week.updated || '—')}${week.revizije?.length ? ` · v${week.revizije[week.revizije.length - 1].v}` : ''}</span>
    ${week.state === 'draft' ? `<span class="tag">${tr('draft — not yet taught', 'nacrt — čas još nije održan')}</span>` : ''}
  </div></div>
  ${revisionsView(week)}
  ${noticesBoard(week.n)}
  ${bring.length ? `<section class="bring"><h2>${tr('Bring with you', 'Donesi sa sobom')}</h2><ul>${bring.map(item => `<li>${esc(tx(item))}</li>`).join('')}</ul></section>` : ''}
  <div class="material">${renderBlocks(week.blocks, state.refs)}</div>
  ${picker()}
  <section class="week-foot"><h2>${tr('Everything else is behind this page', 'Sve ostalo je iza ove strane')}</h2>
  <ul class="mini-links">
    ${[['index.html', tr('Held classes with results', 'Održani časovi sa rezultatima')], ['sledeci.html', tr('Next class — the preparation', 'Sledeći čas — priprema')], ['oblak.html', tr('Cloud of ideas', 'Oblak ideja')], ['predmet.html', tr('The course, the record and the marking', 'Predmet, zapisnik i ocenjivanje')], ['program.html', tr('Calendar of meetings', 'Kalendar susreta')], ['standard.html', tr('The semester project', 'Projekat semestra')], ['vezbe.html', tr('All exercises', 'Sve vežbe')], ['resources.html', tr('Library and sources', 'Biblioteka i izvori')], ['ideja.html', tr('Creative hub — sources, seeds, open questions', 'Creative hub — izvori, ideje, otvorena pitanja')], ['ucestvuj.html', tr('Optional public board — not a hand-in', 'Neobavezna javna tabla — nije predaja')], ['studio.html', tr('Project stages', 'Faze projekta')], ['uredi.html', tr('Teacher: prepare a week', 'Nastavnik: pripremi nedelju')]]
      .map(([href, label]) => `<li><a class="mini-link" href="${href}">${esc(label)} <span aria-hidden="true">→</span></a></li>`).join('')}
  </ul></section>`;
}

function emptyView() {
  return `<div class="page-top"><div><p class="eyebrow">${tr('Working week', 'Radna nedelja')}</p><h1>${tr('No week is open yet.', 'Nijedna nedelja još nije otvorena.')}</h1><p class="lede">${tr('The material for a session lives in one small file. Until the teacher puts one in, this page says so instead of inventing a lesson.', 'Građa jednog časa stoji u jednom malom fajlu. Dok ga nastavnik ne unese, ova strana to i kaže, umesto da izmisli čas.')}</p>
  <div class="actions"><a class="button" href="uredi.html">${tr('Prepare material', 'Pripremi gradivo')} →</a><a class="button secondary" href="laboratorija.html">${tr('Laboratory', 'Laboratorija')}</a></div></div></div>${noticesBoard()}${picker()}`;
}

function brokenView() {
  return `<div class="page-top"><div><p class="eyebrow">${tr('Working week', 'Radna nedelja')}</p><h1>${tr('The material does not pass its own rules.', 'Građa ne prolazi sopstvena pravila.')}</h1><p class="lede">${tr('The file was read but refused. Nothing is shown half-right.', 'Fajl je pročitan i odbijen. Ništa se ne prikazuje napola tačno.')}</p></div></div>
  <div class="notice error"><ul>${state.problems.map(problem => `<li>${esc(problem)}</li>`).join('')}</ul></div>
  <p class="actions"><a class="button secondary" href="uredi.html">${tr('Open the editor', 'Otvori uređivač')}</a></p>${picker()}`;
}

function offlineView() {
  return `<div class="page-top"><div><p class="eyebrow">${tr('Working week', 'Radna nedelja')}</p><h1>${tr('The material could not be fetched.', 'Građa nije mogla da se dohvati.')}</h1><p class="lede">${tr('The first load needs the network. The rest of the site works: the labs, the task and the library are static pages.', 'Prvo učitavanje traži mrežu. Ostatak sajta radi: ogledi, zadatak i biblioteka su statične strane.')}</p>
  <div class="actions"><a class="button" href="laboratorija.html">${tr('Laboratory', 'Laboratorija')}</a><a class="button secondary" href="zadatak.html">${tr('The task', 'Zadatak')}</a></div></div></div>
  <p class="small muted">${state.problems.map(esc).join(' ')}</p>`;
}

function weekRender() {
  const main = $('#main');
  main.innerHTML = state.phase === 'ready' ? readyView()
    : state.phase === 'broken' ? brokenView()
    : state.phase === 'offline' ? offlineView()
    : state.phase === 'empty' ? emptyView()
    : `<div class="page-top"><div><p class="eyebrow">${tr('Working week', 'Radna nedelja')}</p><h1>${tr('This week.', 'Radna nedelja.')}</h1><p class="loading">${tr('Reading the material…', 'Čitam građu…')}</p></div></div>`;
}

/* ============= the landing: held classes, in order, with what helps ============= */

let flow = null;

const VRSTA_LABEL = {
  cas: { en: 'Class', sr: 'Čas' },
  tema: { en: 'Theme', sr: 'Tema' },
  protokol: { en: 'Protocol', sr: 'Protokol' },
  dogadjaj: { en: 'Event', sr: 'Događaj' }
};

const weekHref = item => (typeof item.nedelja === 'number' ? `index.html?w=${item.nedelja}` : null);

// The A3 line of a held week: its exercise blocks, titled from the bank — the sheet that
// goes into the exam workbook. Derived from the week file, never retold.
function a3View(week) {
  const blocks = (week?.blocks || []).filter(block => block.kind === 'exercise');
  if (!blocks.length) return '';
  const items = blocks.map(block => {
    const known = exercises.find(exercise => exercise.id === block.ref);
    const title = known ? tx(known.title) : block.ref;
    return `<li><b>${esc(title)}</b>${block.text ? ` — ${esc(tx(block.text))}` : ''}</li>`;
  }).join('');
  return `<div class="a3-assignment"><p class="idea-card-meta">${tr('The A3 sheet of this week — a page of the exam workbook', 'A3 list ove nedelje — strana radne sveske za ispit')}</p><ul>${items}</ul></div>`;
}

function heldCard(item, week) {
  const results = item.rezultati.map(result =>
    `<li>${esc(tx(result.sta))}<span class="idea-card-meta">— ${esc(result.izvor)}</span></li>`).join('');
  const weekLink = weekHref(item);
  return `<article class="idea-card held-card">
    <p class="idea-card-meta"><time>${esc(item.odrzan)}</time> · ${esc(tx(VRSTA_LABEL[item.vrsta] || { sr: item.vrsta }))}${weekLink ? ` · <a href="${esc(weekLink)}">${tr('week', 'nedelja')} ${item.nedelja}</a>` : ''}</p>
    <h3>${esc(tx(item.naslov))}</h3>
    ${week ? a3View(week) : ''}
    <ul class="cem-results">${results}</ul>
    <p class="idea-card-meta">${tr('Source', 'Izvor')}: ${esc(item.izvor)}${weekLink ? ` · <a href="${esc(weekLink)}">${tr('the whole week', 'cela nedelja')} →</a>` : ''}</p>
  </article>`;
}

// The exam format line comes from the subject manifest, not from memory.
function examLine(verzije) {
  const format = verzije?.predmet?.formatIspita;
  if (!format) return '';
  const nacin = Array.isArray(format.nacin) ? format.nacin.join(' + ') : (format.nacin || '');
  return `<p>${tr('Every week adds one sheet to the exam workbook:', 'Svaka nedelja dodaje jedan list u radnu svesku za ispit:')} <b>${esc(format.oblik)}${nacin ? ` — ${esc(nacin)}` : ''}</b>.${tr(' The format is recorded in the subject manifest with its source.', ' Format je upisan u manifest predmeta sa svojim izvorom.')} <a href="predmet.html">${tr('The course and the marking', 'Predmet i ocenjivanje')} →</a></p>`;
}

// Helping material: what a student needs beside the held classes — honest, linked, visual.
function helpingView() {
  return `<section class="helping" aria-labelledby="helping-title">
  <div class="section-heading"><div><p class="eyebrow">${tr('Material that helps', 'Materijal koji pomaže')}</p><h2 id="helping-title">${tr('What you keep beside the workbook', 'Šta stoji uz svesku')}</h2></div></div>
  <div class="help-grid">
    <a class="help-card" href="assets/sablon-a3.svg" download><b>${tr('A3 sheet template', 'Šablon A3 lista')}</b><span>${tr('the blank sheet of the workbook, for print and for digital', 'prazan list radne sveske, za štampu i digitalno')}</span></a>
    <a class="help-card" href="vezbe.html"><b>${tr('Exercise bank', 'Banka vežbi')}</b><span>${tr('every exercise of the course, with limits and measures', 'sve vežbe predmeta, sa granicama i merama')}</span></a>
    <a class="help-card" href="resources.html"><b>${tr('Library and sources', 'Biblioteka i izvori')}</b><span>${tr('standards, readings and reference pages', 'standardi, čitanja i referentne strane')}</span></a>
    <a class="help-card" href="godista.html"><b>${tr('Limits by age', 'Granice po godištima')}</b><span>${tr('what is law, what is standard, what is data', 'šta je zakon, šta standard, šta podatak')}</span></a>
    <a class="help-card" href="program.html"><b>${tr('Calendar', 'Kalendar')}</b><span>${tr('meetings and deadlines of the semester', 'susreti i rokovi semestra')}</span></a>
    <a class="help-card" href="predmet.html"><b>${tr('The course and the marking', 'Predmet i ocenjivanje')}</b><span>${tr('how the signed sheets count', 'kako se potpisani listovi vrednuju')}</span></a>
    <a class="help-card" href="etika.html"><b>${tr('How we work together', 'Kako sarađujemo')}</b><span>${tr('the working rules: with people, with responsibility', 'pravila rada: sa ljudima, sa odgovornošću')}</span></a>
  </div></section>`;
}

// The standards a designer of inclusive space reads at a glance — our own diagrams.
function standardsView() {
  const diagrams = [
    { file: 'assets/vizuali/manevarski-prostor.svg', title: { sr: 'Manevraski prostor', en: 'Turning space' }, note: { sr: 'koliko mesta treba točku', en: 'how much room a wheel needs' } },
    { file: 'assets/vizuali/rampa-standard.svg', title: { sr: 'Rampa po standardu', en: 'A ramp to standard' }, note: { sr: 'nagib, dužina, odmorište', en: 'slope, length, rest' } },
    { file: 'assets/vizuali/taktilne-staze.svg', title: { sr: 'Taktilne staze', en: 'Tactile paths' }, note: { sr: 'vođenje nogom i štapom', en: 'guiding foot and cane' } },
    { file: 'assets/vizuali/pristupacni-toalet.svg', title: { sr: 'Pristupačan toalet', en: 'An accessible toilet' }, note: { sr: 'mere i grabljive tačke', en: 'measures and grip points' } }
  ];
  return `<section class="standards" aria-labelledby="standards-title">
  <div class="section-heading"><div><p class="eyebrow">${tr('Standards at a glance', 'Standardi na prvi pogled')}</p><h2 id="standards-title">${tr('Diagrams we drew ourselves', 'Dijagrami koje smo sami nacrtali')}</h2></div></div>
  <div class="standards-grid">${diagrams.map(d => `<a class="standard-tile" href="resources.html"><img src="${d.file}" alt="${esc(tx(d.title))} — ${esc(tx(d.note))}" loading="lazy" width="480" height="360"><b>${esc(tx(d.title))}</b><span>${esc(tx(d.note))}</span></a>`).join('')}</div>
  <p class="help">${tr('Full set with measures: ', 'Ceo skup sa merama: ')}<a href="resources.html">${tr('the library', 'biblioteka')} →</a></p></section>`;
}

function landingView() {
  const tok = flow.tok;
  return `
  <section id="odrzano" aria-labelledby="odrzano-title">
    <div class="section-heading"><div><p class="eyebrow">${tr('Held in class', 'Održano na času')}</p><h2 id="odrzano-title">${tr('Classes that happened, with what they left', 'Časovi koji su se održali, sa onim što su ostavili')}</h2></div></div>
    <p class="lede held-lede">${examLine(flow.verzije) || tr('Every held class is written down with its results and its sources — nothing else sits here.', 'Svaki održani čas je upisan sa rezultatima i izvorima — ništa drugo ne stoji ovde.')}</p>
    <div class="idea-grid">${tok.odrzano.map(item => heldCard(item, flow.weeks.get(item.nedelja))).join('')}</div>
    ${tok.odrzano.length === 0 ? `<p class="notice">${tr('No class has been held and recorded yet. When it is, it appears here with its results.', 'Nijedan čas još nije održan ni upisan. Kad se održi, pojavljuje se ovde sa rezultatima.')}</p>` : ''}
  </section>
  <nav class="onward" aria-label="${tr('Where the course goes next', 'Kuda predmet ide dalje')}">
    <a href="sledeci.html"><b>${tr('Next class', 'Sledeći čas')}</b><span>${tr('the preparation, on the shoulders of the last one', 'priprema, naslonjena na prethodni čas')} →</span></a>
    <a href="oblak.html"><b>${tr('Cloud of ideas', 'Oblak ideja')}</b><span>${tr('everything that still has no week', 'sve što još nema nedelju')} →</span></a>
  </nav>
  ${helpingView()}
  ${standardsView()}`;
}

// The static baseline on the page is already true, so it is not traded for a loading line:
// the live sections replace it only when the data has arrived and passed its rules.
// If the fetch fails, the baseline stays and the live region says so.
function landingRender() {
  if (!flow) return;
  const host = $('#landing-view');
  if (host) host.innerHTML = landingView();
}

async function loadLanding() {
  try {
    const [tok, verzije] = await Promise.all([loadJSON('data/tok.json'), loadJSON('data/verzije.json')]);
    const problems = validateTok(tok);
    if (problems.length) throw new Error(problems[0]);
    const weeks = new Map();
    for (const item of tok.odrzano) {
      if (typeof item.nedelja === 'number' && !weeks.has(item.nedelja)) {
        const week = await loadJSON(weekFile(item.nedelja));
        const check = validateWeek(week);
        if (!check.ok) throw new Error(`w${item.nedelja}: ${check.problems[0]}`);
        weeks.set(item.nedelja, week);
      }
    }
    flow = { tok, verzije, weeks };
    const nextCas = tok.sledeci.filter(item => item.vrsta === 'cas' && typeof item.nedelja === 'number')[0];
    setFlowCounts({ odrzano: tok.odrzano.length, sledeciNedelja: nextCas ? nextCas.nedelja : '', 'oblak-ideja': tok.ideje.length });
    announce(tr('The held classes are loaded.', 'Održani časovi su učitani.'));
  } catch {
    announce(tr('The flow data could not be fetched — the sections on this page stay as written.', 'Podaci toka nisu mogli da se dohvate — odeljci na ovoj strani ostaju kako su upisani.'));
  }
  landingRender();
}

/* ============================ boot ============================ */

const render = weekMode ? weekRender : landingRender;

const draw = mount({
  view: 'flow', render,
  title: () => weekMode
    ? (state.week ? `${tr('Week', 'Nedelja')} ${state.week.n} — ${tx(state.week.title)}` : tr('This week', 'Radna nedelja'))
    : tr('Held classes', 'Održano na času')
});

if (weekMode) {
  loadWeek().then(() => {
    draw();
    if (state.phase === 'ready') announce(`${tr('Week', 'Nedelja')} ${state.week.n}: ${tx(state.week.title)}`);
  });
} else {
  loadLanding().then(() => { landingRender(); });
}
