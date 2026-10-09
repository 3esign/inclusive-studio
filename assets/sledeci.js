// The next class, on the shoulders of the last one: what was held and learned, what to bring,
// the plan of the session, the A3 sheet it leaves, the protocol for trying prototypes with
// users, and — plainly — what is still waited on. Prepared is not held: this page never
// carries results, only preparation. Data: data/tok.json, data/material/w02.json, w03.json,
// and the exercise bank — nothing is retold by hand.

import { $, esc, tr, tx, loadJSON, mount, announce, link } from './core.js';
import { validateTok } from './tok-core.js';
import { weekFile, validateWeek } from './material.js';
import { exercises } from './exercises.js';

let data = null; // { tok, w02, w03 }

const ex = id => exercises.find(item => item.id === id);

const VRSTA_LABEL = { cas: 'Čas', tema: 'Tema', protokol: 'Protokol', dogadjaj: 'Događaj' };

// One exercise from the bank: the task, what is handed in, how it is checked.
function exerciseCard(id, { draft = false } = {}) {
  const item = ex(id);
  if (!item) return '';
  return `<article class="task-card${draft ? ' is-draft' : ''}">
    <p class="idea-card-meta">${esc(tx(item.title))}${draft ? ` · ${tr('draft — awaiting the theme’s confirmation', 'nacrt — čeka potvrdu teme')}` : ''}</p>
    <p>${esc(tx(item.task))}</p>
    <dl class="task-dl">
      <div><dt>${tr('Handed in', 'Predaje se')}</dt><dd>${esc(tx(item.hand))}</dd></div>
      <div><dt>${tr('How it is checked', 'Kako se proverava')}</dt><dd>${esc(tx(item.check))}</dd></div>
    </dl>
    <p class="idea-card-meta">${tr('Source', 'Izvor')}: ${esc(tx(item.source))}</p>
  </article>`;
}

// What the last class left — the floor this one stands on.
function floorView(tok) {
  const last = tok.odrzano[tok.odrzano.length - 1];
  if (!last) return '';
  const items = last.rezultati.map(result => `<li>${esc(tx(result.sta))}<span class="idea-card-meta">— ${esc(result.izvor)}</span></li>`).join('');
  return `<section class="floor" aria-labelledby="floor-title">
  <div class="section-heading"><div><p class="eyebrow">${tr('Where we start', 'Odakle polazimo')}</p><h2 id="floor-title">${tr('The class before, and what it left', 'Prethodni čas i ono što je ostavio')}</h2></div></div>
  <div class="idea-grid"><article class="idea-card">
    <p class="idea-card-meta"><time>${esc(last.odrzan)}</time> · ${esc(VRSTA_LABEL[last.vrsta] || last.vrsta)} · <a href="index.html?w=${last.nedelja}">${tr('week', 'nedelja')} ${last.nedelja}</a></p>
    <h3>${esc(tx(last.naslov))}</h3>
    <ul class="cem-results">${items}</ul>
    <p class="idea-card-meta"><a href="index.html">${tr('All held classes', 'Svi održani časovi')} →</a></p>
  </article></div></section>`;
}

function bringView(w02) {
  const items = (w02?.bring || []).map(item => `<li>${esc(tx(item))}</li>`).join('');
  return `<section class="bring-plan" aria-labelledby="bring-title">
  <div class="section-heading"><div><p class="eyebrow">${tr('Before you come', 'Pre nego što dođeš')}</p><h2 id="bring-title">${tr('What to bring', 'Šta se donosi')}</h2></div></div>
  <ul class="bring-list">${items}</ul></section>`;
}

// The session's beats, pulled from the week's material: the material order, the two numbers,
// the seven principles — each with the source it came from.
function planView(w02) {
  if (!w02) return '';
  const blocks = w02.blocks;
  const listAfter = heading => {
    const at = blocks.findIndex(block => block.kind === 'heading' && (block.text?.sr || '').startsWith(heading));
    if (at < 0) return [];
    const out = [];
    for (let i = at + 1; i < blocks.length && blocks[i].kind !== 'heading'; i++) if (blocks[i].kind === 'list') out.push(blocks[i]);
    return out.flatMap(block => Array.isArray(block.items) ? block.items : []);
  };
  const materials = listAfter('Redosled po kom se bira');
  const measures = blocks.filter(block => block.kind === 'measure');
  const seven = blocks.findIndex(block => (block.text?.sr || '').startsWith('Sedam principa'));
  const sevenText = seven >= 0 ? blocks[seven + 1]?.text : null;
  const decision = blocks.find(block => block.kind === 'decision');
  return `<section class="plan" aria-labelledby="plan-title">
  <div class="section-heading"><div><p class="eyebrow">${tr('The session', 'Čas')}</p><h2 id="plan-title">${tr('The plan, in order', 'Plan, redom')}</h2></div></div>
  <ol class="plan-list">
    ${materials.length ? `<li><div><h3>${tr('The material order', 'Redosled materijala')}</h3><ul>${materials.map(item => `<li>${esc(tx(item))}</li>`).join('')}</ul></div><p class="idea-card-meta">${tr('Source', 'Izvor')}: data/material/w02.json</p></li>` : ''}
    ${measures.length ? `<li><div><h3>${tr('Two numbers measured on the object', 'Dva broja koja se mere na predmetu')}</h3><ul class="measure-list">${measures.map(block => `<li><b>${esc(block.value)}</b> — ${esc(tx(block.text))}<span class="idea-card-meta">${esc(tx(block.instrument))}</span></li>`).join('')}</ul></div><p class="idea-card-meta">${tr('Source', 'Izvor')}: data/material/w02.json — mere; EN 71-1</p></li>` : ''}
    ${sevenText ? `<li><div><h3>${tr('Seven principles, on one’s own prototype', 'Sedam principa, na sopstvenom prototipu')}</h3><p>${esc(tx(sevenText))}</p></div><p class="idea-card-meta">${tr('Source', 'Izvor')}: data/material/w02.json · <a href="predavanje.html?w=2">${tr('the lecture', 'predavanje')} →</a></p></li>` : ''}
  </ol>
  ${decision ? `<div class="notice decision-note"><p><b>${tr('What each team records', 'Šta svaki tim upisuje')}:</b> ${esc(tx(decision.text))}</p></div>` : ''}
  </section>`;
}

function sheetView(tok, w02, w03) {
  const tema = tok.sledeci.find(item => item.id === 'sledeci-list-ruka-koja-drzi');
  return `<section class="sheet" aria-labelledby="sheet-title">
  <div class="section-heading"><div><p class="eyebrow">${tr('The workbook', 'Radna sveska')}</p><h2 id="sheet-title">${tr('The sheets this class leaves', 'Listovi koje ovaj čas ostavlja')}</h2></div></div>
  <p class="lede">${tr('This week’s sheet is set at the end of the class; the one after it is drafted below, awaiting the theme’s confirmation.', 'List nedelje zadaje se na kraju časa; onaj posle njega je nacrt ispod, i čeka potvrdu teme.')}</p>
  <div class="task-grid">
    ${['prototype-from-waste', 'seven-principles-audit'].map(id => exerciseCard(id)).join('')}
    ${tema ? `<article class="task-card is-next"><p class="idea-card-meta">${tr('The next sheet', 'Sledeći list')} · ${tr('week', 'nedelja')} ${tema.nedelja} · ${tr('draft', 'nacrt')}</p><h3>${esc(tx(tema.naslov))}</h3><p>${esc(tx(tema.kratko))}</p><p class="idea-note"><b>${tr('Waiting for', 'Čeka')}:</b> ${esc(tx(tema.ceka))}</p><p class="idea-card-meta">${tr('Source', 'Izvor')}: ${esc(tema.izvor)}</p></article>` : ''}
    ${w03 ? ['hands-and-tolerances', 'measure-your-faculty'].map(id => exerciseCard(id, { draft: true })).join('') : ''}
  </div>
  <p class="help"><a href="assets/sablon-a3.svg" download>${tr('A3 sheet template', 'Šablon A3 lista')} ↓</a> · <a href="vezbe.html">${tr('the whole exercise bank', 'cela banka vežbi')} →</a>${w02 ? ` · <a href="index.html?w=2">${tr('the whole week’s material', 'celo gradivo nedelje')} →</a>` : ''}</p></section>`;
}

function protocolView(tok) {
  const protokol = tok.sledeci.find(item => item.vrsta === 'protokol');
  if (!protokol) return '';
  return `<section class="protocol" aria-labelledby="protocol-title">
  <div class="section-heading"><div><p class="eyebrow">${tr('With the users', 'Sa korisnicima')}</p><h2 id="protocol-title">${esc(tx(protokol.naslov))}</h2></div></div>
  <div class="protocol-grid">
    <div>
      <p>${esc(tx(protokol.kratko))}</p>
      <p class="idea-note"><b>${tr('Waiting for', 'Čeka')}:</b> ${esc(tx(protokol.ceka))}</p>
      <p class="idea-card-meta">${tr('Source', 'Izvor')}: ${esc(protokol.izvor)}</p>
      <p class="actions"><a class="button secondary" href="udruzenje.html">${tr('The whole protocol', 'Ceo protokol')} →</a></p>
    </div>
    <figure class="protocol-figure"><img src="assets/fieldwork/zivimo-zajedno-sketch.jpg" alt="${tr('A hand-drawn sketch of the association’s interior: two floors, a stair and a ramp', 'Ručna skica unutrašnjeg prostora udruženja: dva nivoa, stepenište i rampa')}" loading="lazy" width="880" height="660"><figcaption>${tr('A field sketch of the association’s space — two levels, a stair, a ramp.', 'Terenska skica prostora udruženja — dva nivoa, stepenište, rampa.')}</figcaption></figure>
  </div></section>`;
}

// Plainly: everything this preparation still waits on. No result ever appears here.
function waitsView(tok) {
  const items = tok.sledeci.map(item => `<li><b>${esc(tx(item.naslov))}</b><span>${esc(tx(item.ceka))}</span></li>`).join('');
  return `<section class="waits" aria-labelledby="waits-title">
  <div class="section-heading"><div><p class="eyebrow">${tr('Honesty', 'Poštenje')}</p><h2 id="waits-title">${tr('What this page still waits on', 'Šta ova strana još čeka')}</h2></div></div>
  <ul class="wait-list">${items}</ul>
  <p class="help">${tr('When the class is held and its results are written, it moves to the held classes — and this page turns to the class after it.', 'Kad se čas održi i upišu rezultati, prelazi na održane časove — a ova strana se okreće času posle njega.')} <a href="index.html">${tr('Held classes', 'Održani časovi')} →</a></p></section>`;
}

function view() {
  const { tok, w02 } = data;
  const cas = tok.sledeci.find(item => item.vrsta === 'cas');
  const dateNote = w02?.dateStatus === 'proposed'
    ? `<span class="tag">${tr('date proposed', 'datum predložen')}</span>`
    : `<span class="tag">${tr('date set', 'datum potvrđen')}</span>`;
  return `<div class="page-top week-top"><div>
    <p class="eyebrow">${tr('Preparation · week', 'Priprema · nedelja')} ${cas?.nedelja ?? ''}</p>
    <h1>${esc(tx(w02?.title || cas?.naslov))}</h1>
    ${w02?.aim ? `<p class="lede">${esc(tx(w02.aim))}</p>` : ''}
    <div class="actions"><a class="button" href="index.html?w=2">${tr('The week’s material', 'Gradivo nedelje')} →</a><a class="button secondary" href="predavanje.html?w=2">${tr('As a lecture', 'Kao predavanje')}</a><a class="button secondary" href="program.html">${tr('Calendar', 'Kalendar')}</a></div>
  </div><div class="page-meta">
    <span class="meta-label">${tr('Session', 'Čas')}</span><span>${cas ? `${tr('week', 'nedelja')} ${cas.nedelja}` : '—'}</span>
    <span class="meta-label">${tr('State', 'Stanje')}</span><span>${dateNote} ${tr('prepared — not yet held', 'pripremljeno — još nije održano')}</span>
  </div></div>
  ${floorView(tok)}
  ${bringView(w02)}
  ${planView(w02)}
  ${sheetView(tok, w02, data.w03)}
  ${protocolView(tok)}
  ${waitsView(tok)}`;
}

async function load() {
  try {
    const tok = await loadJSON('data/tok.json');
    const problems = validateTok(tok);
    if (problems.length) throw new Error(problems[0]);
    const cas = tok.sledeci.find(item => item.vrsta === 'cas' && typeof item.nedelja === 'number');
    if (!cas) throw new Error('no next class in the flow');
    const w02 = await loadJSON(weekFile(cas.nedelja));
    const check = validateWeek(w02);
    if (!check.ok) throw new Error(check.problems[0]);
    let w03 = null;
    const tema = tok.sledeci.find(item => item.vrsta === 'tema' && typeof item.nedelja === 'number');
    if (tema) { try { w03 = await loadJSON(weekFile(tema.nedelja)); } catch { w03 = null; } }
    data = { tok, w02, w03 };
    announce(tr('The preparation for the next class is loaded.', 'Priprema sledećeg časa je učitana.'));
  } catch (error) {
    announce(tr('The preparation could not be fetched — the sections on this page stay as written.', 'Priprema nije mogla da se dohvati — odeljci na ovoj strani ostaju kako su upisani.'));
    console.warn(error);
  }
  const main = $('#main');
  if (data && main) main.innerHTML = view();
}

mount({ view: 'next', render: () => {}, title: () => tr('Next class', 'Sledeći čas') });
load();
