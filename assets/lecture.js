// Lecture mode: the same week's material, cut into slides at every heading.
// No new content is written here — if a slide is thin, the material is thin, and that shows.

import { $, $$, esc, tr, tx, loadJSON, mount, announce, read, save } from './core.js';
import { MATERIAL_INDEX, weekFile, validateIndex, validateWeek, currentWeek, toSlides } from './material.js';
import { resolveRefs, renderBlocks, weekLine } from './blocks.js';

const params = new URLSearchParams(location.search);
const wanted = Number(params.get('w'));
let state = { phase: 'loading', week: null, slides: [], refs: null, at: 0, all: false, problems: [] };
let detach = null;

async function load() {
  try {
    const index = await loadJSON(MATERIAL_INDEX);
    if (!validateIndex(index).ok) { state.phase = 'broken'; state.problems = validateIndex(index).problems; return; }
    const entry = (Number.isInteger(wanted) && index.weeks.find(item => item.n === wanted)) || currentWeek(index);
    if (!entry) { state.phase = 'empty'; return; }
    const week = await loadJSON(weekFile(entry.n));
    const check = validateWeek(week);
    if (!check.ok) { state.phase = 'broken'; state.problems = check.problems; return; }
    state.week = week;
    state.slides = toSlides(week);
    state.refs = await resolveRefs(week.blocks);
    state.phase = state.slides.length ? 'ready' : 'empty';
    const fromHash = Number((location.hash.match(/^#s(\d+)$/) || [])[1]);
    state.at = Number.isInteger(fromHash) && fromHash >= 1 && fromHash <= state.slides.length ? fromHash - 1 : 0;
  } catch (error) {
    state.phase = 'offline'; state.problems = [String(error.message || error)];
  }
}

function slideMarkup(slide, index) {
  return `<section class="slide" aria-label="${tr('Slide', 'Slajd')} ${index + 1}">
    ${slide.heading ? `<h2>${esc(tx(slide.heading.text))}</h2>` : ''}
    <div class="slide-body">${renderBlocks(slide.blocks, state.refs)}</div>
  </section>`;
}

function readyView() {
  const week = state.week;
  if (state.all) {
    return `${head()}<div class="slides-all">${state.slides.map(slideMarkup).join('')}</div>`;
  }
  return `${head()}
  <div class="stage" id="stage">${slideMarkup(state.slides[state.at], state.at)}</div>
  <div class="stage-bar">
    <button type="button" id="prev" ${state.at === 0 ? 'disabled' : ''}>← ${tr('Back', 'Nazad')}</button>
    <p id="counter" role="status" aria-live="polite">${state.at + 1} / ${state.slides.length}</p>
    <button type="button" id="next" class="button" ${state.at === state.slides.length - 1 ? 'disabled' : ''}>${tr('Next', 'Dalje')} →</button>
  </div>
  <p class="help lecture-help">${tr('Arrows, Space, Home and End move the slides. Swipe works on a phone. Nothing moves on its own.', 'Strelice, Space, Home i End pomeraju slajdove. Na telefonu radi i prevlačenje. Ništa se ne pomera samo.')}</p>`;
}

function head() {
  const week = state.week;
  return `<div class="lecture-head">
    <div><p class="eyebrow">${esc(weekLine(week))}</p><h1>${esc(tx(week.title))}</h1></div>
    <div class="lecture-actions">
      <button type="button" id="toggle-all" aria-pressed="${state.all}">${state.all ? tr('Slide by slide', 'Slajd po slajd') : tr('Show everything', 'Prikaži sve')}</button>
      <button type="button" id="print-lecture">${tr('Print', 'Štampaj')}</button>
      <a class="button secondary" href="index.html?w=${week.n}">${tr('Back to the week', 'Natrag na nedelju')}</a>
    </div>
  </div>`;
}

function render() {
  if (detach) { detach(); detach = null; }
  const main = $('#main');
  main.innerHTML = state.phase === 'ready' ? readyView()
    : state.phase === 'broken' ? `<h1>${tr('The material does not pass its own rules.', 'Građa ne prolazi sopstvena pravila.')}</h1><div class="notice error"><ul>${state.problems.map(p => `<li>${esc(p)}</li>`).join('')}</ul></div>`
    : state.phase === 'offline' ? `<h1>${tr('The material could not be fetched.', 'Građa nije mogla da se dohvati.')}</h1><p class="small muted">${state.problems.map(esc).join(' ')}</p>`
    : state.phase === 'empty' ? `<h1>${tr('Nothing to show yet.', 'Još nema šta da se prikaže.')}</h1><p><a class="button" href="uredi.html">${tr('Prepare material', 'Pripremi gradivo')}</a></p>`
    : `<p class="loading">${tr('Reading the material…', 'Čitam građu…')}</p>`;
  if (state.phase !== 'ready') return;
  document.body.classList.toggle('lecture-mode', !state.all);

  const go = step => {
    const next = Math.min(state.slides.length - 1, Math.max(0, state.at + step));
    if (next === state.at) return;
    state.at = next;
    history.replaceState(null, '', '#s' + (state.at + 1));
    render();
    $('#stage')?.focus?.();
    announce(`${state.at + 1} / ${state.slides.length}`);
  };
  $('#next')?.addEventListener('click', () => go(1));
  $('#prev')?.addEventListener('click', () => go(-1));
  $('#toggle-all')?.addEventListener('click', () => { state.all = !state.all; render(); });
  $('#print-lecture')?.addEventListener('click', () => { state.all = true; render(); setTimeout(() => window.print(), 50); });

  const onKey = event => {
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName || '')) return;
    if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') { event.preventDefault(); go(1); }
    else if (event.key === 'ArrowLeft' || event.key === 'PageUp') { event.preventDefault(); go(-1); }
    else if (event.key === 'Home') { event.preventDefault(); go(-state.slides.length); }
    else if (event.key === 'End') { event.preventDefault(); go(state.slides.length); }
  };
  document.addEventListener('keydown', onKey);

  let startX = null;
  const stage = $('#stage');
  const onStart = event => { startX = event.touches[0].clientX; };
  const onEnd = event => {
    if (startX === null) return;
    const dx = event.changedTouches[0].clientX - startX;
    startX = null;
    if (Math.abs(dx) > 60) go(dx < 0 ? 1 : -1);
  };
  stage?.addEventListener('touchstart', onStart, { passive: true });
  stage?.addEventListener('touchend', onEnd, { passive: true });

  detach = () => {
    document.removeEventListener('keydown', onKey);
    stage?.removeEventListener('touchstart', onStart);
    stage?.removeEventListener('touchend', onEnd);
    document.body.classList.remove('lecture-mode');
  };
}

const draw = mount({ view: 'lecture', render, title: () => (state.week ? `${tr('Lecture', 'Predavanje')} ${state.week.n}` : tr('Lecture', 'Predavanje')) });
load().then(draw);
addEventListener('pagehide', () => { if (detach) detach(); });
