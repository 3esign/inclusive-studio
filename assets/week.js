// The main screen: the week the room is working on, and the material the teacher put in it.
// It shows what is in data/material/ and nothing else. No week, no invented week.

import { $, $$, esc, tr, tx, lang, number, loadJSON, mount, announce, link, arrow, read, save } from './core.js';
import { notices } from './course.js';
import { MATERIAL_INDEX, weekFile, validateIndex, validateWeek, currentWeek, weekStats } from './material.js';
import { resolveRefs, renderBlocks, weekLine } from './blocks.js';

const params = new URLSearchParams(location.search);
const showDrafts = params.get('draft') === '1';
const wanted = Number(params.get('w'));

let state = { phase: 'loading', index: null, week: null, refs: null, problems: [] };

// The old home lived here; keep its links working instead of breaking published URLs.
if (params.has('stage')) location.replace('studio.html' + location.search);

async function load() {
  try {
    const index = await loadJSON(MATERIAL_INDEX);
    const check = validateIndex(index);
    if (!check.ok) { state = { phase: 'broken', problems: check.problems, index }; return; }
    const entries = index.weeks.slice().sort((a, b) => a.n - b.n);
    const entry = (Number.isInteger(wanted) && entries.find(item => item.n === wanted)) || currentWeek(index);
    if (!entry) { state = { phase: 'empty', index }; return; }
    if (entry.state === 'draft' && !showDrafts && !(Number.isInteger(wanted) && wanted === entry.n)) {
      state = { phase: 'empty', index };
      return;
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
    <div class="actions"><a class="button" href="${esc(taskHref)}">${tr('This week’s task', 'Zadatak nedelje')} →</a><a class="button secondary" href="predavanje.html?w=${week.n}">${tr('Open as a lecture', 'Otvori kao predavanje')}</a><a class="button secondary" href="laboratorija.html">${tr('Laboratory', 'Laboratorija')}</a></div>
  </div><div class="page-meta">
    <span class="meta-label">${tr('Material', 'Građa')}</span><span>${tr('Entries', 'Unosi')}: ${stats.blocks} · ${tr('Slides', 'Slajdovi')}: ${stats.slides} · ${tr('Words', 'Reči')}: ${stats.words}</span>
    <span class="meta-label">${tr('Updated', 'Dopunjeno')}</span><span>${esc(week.updated || '—')}</span>
    ${week.state === 'draft' ? `<span class="tag">${tr('draft — not yet taught', 'nacrt — čas još nije održan')}</span>` : ''}
  </div></div>
  ${noticesBoard(week.n)}
  ${bring.length ? `<section class="bring"><h2>${tr('Bring with you', 'Donesi sa sobom')}</h2><ul>${bring.map(item => `<li>${esc(tx(item))}</li>`).join('')}</ul></section>` : ''}
  <div class="material">${renderBlocks(week.blocks, state.refs)}</div>
  ${picker()}
  <section class="week-foot"><h2>${tr('Everything else is behind this page', 'Sve ostalo je iza ove strane')}</h2>
  <ul class="mini-links">
    ${[['predmet.html', tr('The course, the record and the teacher', 'Predmet, zapisnik i nastavnik')], ['program.html', tr('Calendar of meetings', 'Kalendar susreta')], ['standard.html', tr('The semester project', 'Projekat semestra')], ['vezbe.html', tr('All exercises', 'Sve vežbe')], ['resources.html', tr('Library and sources', 'Biblioteka i izvori')], ['ideja.html', tr('Creative hub — sources, seeds, open questions', 'Creative hub — izvori, ideje, otvorena pitanja')], ['ucestvuj.html', tr('Optional public board — not a hand-in', 'Neobavezna javna tabla — nije predaja')], ['studio.html', tr('Project stages', 'Faze projekta')], ['uredi.html', tr('Teacher: prepare a week', 'Nastavnik: pripremi nedelju')]]
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

function render() {
  const main = $('#main');
  main.innerHTML = state.phase === 'ready' ? readyView()
    : state.phase === 'broken' ? brokenView()
    : state.phase === 'offline' ? offlineView()
    : state.phase === 'empty' ? emptyView()
    : `<div class="page-top"><div><p class="eyebrow">${tr('Working week', 'Radna nedelja')}</p><h1>${tr('This week.', 'Radna nedelja.')}</h1><p class="loading">${tr('Reading the material…', 'Čitam građu…')}</p></div></div>`;
}

const draw = mount({
  view: 'week', render,
  title: () => (state.week ? `${tr('Week', 'Nedelja')} ${state.week.n} — ${tx(state.week.title)}` : tr('This week', 'Radna nedelja'))
});

load().then(() => {
  draw();
  if (state.phase === 'ready') announce(`${tr('Week', 'Nedelja')} ${state.week.n}: ${tx(state.week.title)}`);
});
