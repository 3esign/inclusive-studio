// Prepare the material for a week. The teacher writes here; the output is one JSON file
// that goes into data/material/ and becomes the working week and the lecture.
// The tool enforces the site's own rules: an image without a description cannot be committed.

import { $, $$, esc, tr, tx, lang, read, save, drop, announce, download, copy, loadJSON, mount, REPO, arrow } from './core.js';
import {
  MATERIAL_INDEX, BLOCK_KINDS, emptyWeek, serializeWeek, validateWeek, weekFile, weekStats, FORMAT, VERSION
} from './material.js';
import { resolveRefs, renderBlocks } from './blocks.js';

const DRAFT_KEY = 'editor-week';
let index = null;
let week = null;
let refs = { lab: {}, exercise: {} };
let problems = [];
let labIds = [], exerciseIds = [];

const bilingual = (id, label, value, rows = 2) => `<div class="two-col editor-pair">
  <div class="lab-field"><label for="${id}-sr">${esc(label)} — srpski</label><textarea id="${id}-sr" rows="${rows}" lang="sr-Latn">${esc(value?.sr || '')}</textarea></div>
  <div class="lab-field"><label for="${id}-en">${esc(label)} — English</label><textarea id="${id}-en" rows="${rows}" lang="en">${esc(value?.en || '')}</textarea></div></div>`;

const linesOf = value => (Array.isArray(value) ? value : []).map(item => (item && typeof item === 'object' ? item : { sr: item, en: item }));

function blockFields(block, position) {
  const id = `b${position}`;
  const spec = BLOCK_KINDS[block.kind];
  const parts = [];
  if (spec.needs.includes('text') || block.kind === 'lab' || block.kind === 'exercise') {
    parts.push(bilingual(`${id}-text`, block.kind === 'lab' || block.kind === 'exercise' ? tr('Note beside the card (optional)', 'Napomena uz karticu (neobavezno)') : tr('Text', 'Tekst'), block.text, block.kind === 'heading' ? 1 : 3));
  }
  if (spec.needs.includes('items')) {
    const items = linesOf(block.items);
    parts.push(`<div class="two-col editor-pair">
      <div class="lab-field"><label for="${id}-items-sr">${tr('One per line', 'Jedno po redu')} — srpski</label><textarea id="${id}-items-sr" rows="4" lang="sr-Latn">${esc(items.map(item => item.sr || '').join('\n'))}</textarea></div>
      <div class="lab-field"><label for="${id}-items-en">${tr('One per line', 'Jedno po redu')} — English</label><textarea id="${id}-items-en" rows="4" lang="en">${esc(items.map(item => item.en || '').join('\n'))}</textarea></div></div>`);
  }
  if (block.kind === 'measure') {
    parts.push(`<div class="lab-field"><label for="${id}-value">${tr('The value, written as it is read', 'Vrednost, napisana kako se čita')}</label><input id="${id}-value" value="${esc(block.value || '')}"></div>`);
    parts.push(bilingual(`${id}-instrument`, tr('Instrument and its accuracy — required', 'Instrument i njegova tačnost — obavezno'), block.instrument, 2));
  }
  if (block.kind === 'quote') {
    parts.push(`<div class="lab-field"><label for="${id}-source">${tr('Source — required', 'Izvor — obavezno')}</label><input id="${id}-source" value="${esc(block.source || '')}"></div>`);
  }
  if (block.kind === 'image') {
    parts.push(`<div class="lab-field"><label for="${id}-src">${tr('Image address', 'Adresa slike')}</label><input id="${id}-src" value="${esc(block.src || '')}" inputmode="url" spellcheck="false"></div>`);
    parts.push(bilingual(`${id}-alt`, tr('Description — what the image shows, required', 'Opis — šta slika pokazuje, obavezno'), block.alt, 2));
    parts.push(bilingual(`${id}-caption`, tr('Caption under the image (optional)', 'Potpis pod slikom (neobavezno)'), block.caption, 1));
    parts.push(`<p class="help">${tr('An image file has to live somewhere first: commit it to assets/material/ in the repository, or drop it into a GitHub issue and copy the address GitHub gives back.', 'Fajl slike prvo mora negde da stoji: upiši ga u assets/material/ u repozitorijumu, ili ga ubaci u GitHub temu i prekopiraj adresu koju GitHub vrati.')}</p>`);
  }
  if (block.kind === 'link' || block.kind === 'file') {
    parts.push(`<div class="lab-field"><label for="${id}-href">${tr('Address', 'Adresa')}</label><input id="${id}-href" value="${esc(block.href || '')}" inputmode="url" spellcheck="false"></div>`);
  }
  if (block.kind === 'lab' || block.kind === 'exercise') {
    const options = block.kind === 'lab' ? labIds : exerciseIds;
    parts.push(`<div class="lab-field"><label for="${id}-ref">${tr('Which one', 'Koji')}</label><select id="${id}-ref">${options.map(option => `<option value="${esc(option.id)}" ${option.id === block.ref ? 'selected' : ''}>${esc(option.label)}</option>`).join('')}${options.some(option => option.id === block.ref) ? '' : `<option value="${esc(block.ref || '')}" selected>${esc(block.ref || '')}</option>`}</select></div>`);
  }
  return parts.join('');
}

function blockCard(block, position) {
  const spec = BLOCK_KINDS[block.kind];
  const mine = problems.filter(problem => problem.startsWith(`#${position + 1} `) || problem.startsWith(`#${position + 1}:`));
  return `<li class="editor-block ${mine.length ? 'has-problem' : ''}" data-at="${position}">
    <div class="editor-block-head">
      <span class="meta-label">${position + 1} · ${esc(tx(spec.label))}</span>
      <span class="editor-block-tools">
        <button type="button" data-move="up" data-at="${position}" ${position === 0 ? 'disabled' : ''} aria-label="${tr('Move up', 'Pomeri gore')}">↑</button>
        <button type="button" data-move="down" data-at="${position}" aria-label="${tr('Move down', 'Pomeri dole')}">↓</button>
        <button type="button" data-remove="${position}" aria-label="${tr('Remove', 'Ukloni')}">✕</button>
      </span>
    </div>
    ${blockFields(block, position)}
    ${mine.length ? `<p class="error small">${mine.map(esc).join(' · ')}</p>` : ''}
  </li>`;
}

function view() {
  const stats = weekStats(week);
  const json = serializeWeek(week);
  const existing = index?.weeks?.some(entry => entry.n === week.n);
  const prefillable = json.length <= 6000;
  const newUrl = `${REPO}/new/main?filename=${encodeURIComponent('data/material/' + weekFile(week.n).split('/').pop())}${prefillable ? '&value=' + encodeURIComponent(json) : ''}`;
  const editUrl = `${REPO}/edit/main/${weekFile(week.n)}`;
  return `<div class="page-top"><div><p class="eyebrow">${tr('Teacher / Material for one session', 'Nastavnik / Građa za jedan čas')}</p><h1>${tr('Prepare the week.', 'Pripremi nedelju.')}</h1><p class="lede">${tr('Write the material here, check it against the site’s own rules, then commit one small file. The working week and the lecture are built from that file and from nothing else.', 'Upiši građu ovde, proveri je po pravilima samog sajta, pa upiši jedan mali fajl. Radna nedelja i predavanje nastaju iz tog fajla i ni iz čega drugog.')}</p></div>
  <div class="page-meta"><span class="meta-label">${tr('Size', 'Veličina')}</span><span>${stats.blocks} ${tr('entries', 'upisa')} · ${stats.slides} ${tr('slides', 'slajdova')} · ${(json.length / 1024).toFixed(1)} kB</span></div></div>

  <section class="editor-head">
    <div class="three-col">
      <div class="lab-field"><label for="week-n">${tr('Week number', 'Broj nedelje')}</label><input id="week-n" type="number" min="1" max="30" value="${week.n}"></div>
      <div class="lab-field"><label for="week-state">${tr('State', 'Stanje')}</label><select id="week-state"><option value="draft" ${week.state === 'draft' ? 'selected' : ''}>${tr('draft — visible only with ?draft=1', 'nacrt — vidi se samo uz ?draft=1')}</option><option value="published" ${week.state === 'published' ? 'selected' : ''}>${tr('published', 'objavljeno')}</option></select></div>
      <div class="lab-field"><label for="week-date">${tr('Date of the session (optional)', 'Datum časa (neobavezno)')}</label><input id="week-date" type="date" value="${esc(week.date || '')}"></div>
    </div>
    <div class="lab-field"><label for="week-datestatus">${tr('Is that date confirmed?', 'Da li je datum potvrđen?')}</label><select id="week-datestatus"><option value="proposed" ${week.dateStatus !== 'confirmed' ? 'selected' : ''}>${tr('proposed — shown as a proposal', 'predlog — prikazuje se kao predlog')}</option><option value="confirmed" ${week.dateStatus === 'confirmed' ? 'selected' : ''}>${tr('confirmed by the faculty', 'potvrđeno od fakulteta')}</option></select></div>
    ${bilingual('week-title', tr('Title of the session', 'Naslov časa'), week.title, 1)}
    ${bilingual('week-aim', tr('What the student can do at the end', 'Šta student ume na kraju'), week.aim, 3)}
    <div class="two-col editor-pair">
      <div class="lab-field"><label for="week-bring-sr">${tr('Bring with you — one per line', 'Donesi sa sobom — jedno po redu')} — srpski</label><textarea id="week-bring-sr" rows="3" lang="sr-Latn">${esc(linesOf(week.bring).map(item => item.sr || '').join('\n'))}</textarea></div>
      <div class="lab-field"><label for="week-bring-en">${tr('Bring with you — one per line', 'Donesi sa sobom — jedno po redu')} — English</label><textarea id="week-bring-en" rows="3" lang="en">${esc(linesOf(week.bring).map(item => item.en || '').join('\n'))}</textarea></div>
    </div>
  </section>

  <section class="editor-blocks"><div class="section-heading"><h2>${tr('The material', 'Građa')}</h2><span class="small muted">${tr('A heading starts a new slide.', 'Naslov počinje nov slajd.')}</span></div>
    <ol class="editor-list">${week.blocks.map(blockCard).join('') || `<li class="empty"><p>${tr('Nothing yet. Add the first entry below.', 'Još ništa. Dodaj prvi upis ispod.')}</p></li>`}</ol>
    <div class="editor-add"><label for="add-kind">${tr('Add', 'Dodaj')}</label><select id="add-kind">${Object.entries(BLOCK_KINDS).map(([kind, spec]) => `<option value="${kind}">${esc(tx(spec.label))}</option>`).join('')}</select><button type="button" id="add-block" class="button">${tr('Add the entry', 'Dodaj upis')}</button></div>
  </section>

  <section class="editor-check"><div class="section-heading"><h2>${tr('Does it pass?', 'Prolazi li?')}</h2></div>
    ${problems.length
      ? `<div class="notice error"><p><strong>${problems.length} ${tr('things block the commit', 'stvari blokiraju upis')}:</strong></p><ul>${problems.map(problem => `<li>${esc(problem)}</li>`).join('')}</ul></div>`
      : `<p class="success">${tr('It passes. The file can be committed.', 'Prolazi. Fajl može da se upiše.')}</p>`}
    <div class="actions">
      <button type="button" id="copy-json" ${problems.length ? 'disabled' : ''}>${tr('Copy the file', 'Prekopiraj fajl')}</button>
      <button type="button" id="download-json">${tr('Download (even unfinished)', 'Preuzmi (i nedovršeno)')}</button>
      <a class="button ${problems.length ? 'secondary' : ''}" id="commit-link" href="${esc(existing ? editUrl : newUrl)}" target="_blank" rel="noopener">${existing ? tr('Open the file on GitHub and paste', 'Otvori fajl na GitHubu i zalepi') : tr('Create the file on GitHub', 'Napravi fajl na GitHubu')} ${arrow}</a>
    </div>
    <p class="help">${existing
      ? tr('This week already exists in the repository: copy the file, open it on GitHub, select everything and paste. A commit on main publishes it within a minute or two.', 'Ova nedelja već postoji u repozitorijumu: prekopiraj fajl, otvori ga na GitHubu, označi sve i zalepi. Upis na main je objavljuje u roku od minut-dva.')
      : prefillable
        ? tr('GitHub opens a new file with the name filled in, and usually with the content too. If the editor is empty, paste what you copied.', 'GitHub otvara nov fajl sa upisanim imenom, obično i sa sadržajem. Ako je uređivač prazan, zalepi ono što si prekopirao.')
        : tr('The file is too large to carry in a link: copy it first, then paste it into the GitHub editor.', 'Fajl je prevelik da bi išao u vezi: prvo ga prekopiraj, pa zalepi u GitHub uređivač.')}</p>
    ${index && !index.weeks.some(entry => entry.n === week.n) ? `<div class="notice"><p><strong>${tr('One more line', 'Još jedan red')}:</strong> ${tr('a new week also has to be listed in data/material/index.json, otherwise the site does not know it exists. Add this entry:', 'nova nedelja mora i da se upiše u data/material/index.json, inače sajt ne zna da postoji. Dodaj ovaj red:')}</p><pre class="code">${esc(JSON.stringify({ n: week.n, file: weekFile(week.n).split('/').pop(), state: week.state, title: week.title }, null, 2))}</pre><p><a href="${REPO}/edit/main/data/material/index.json" target="_blank" rel="noopener">${tr('Open index.json', 'Otvori index.json')} ${arrow}</a> · ${tr('and set "current" to', 'i postavi „current“ na')} ${week.n} ${tr('when the session is the one being taught.', 'kada je taj čas onaj koji se drži.')}</p></div>` : ''}
    <details><summary>${tr('See the file', 'Pogledaj fajl')}</summary><div><pre class="code json">${esc(json)}</pre></div></details>
  </section>

  <section class="editor-preview"><div class="section-heading"><h2>${tr('Preview', 'Pregled')}</h2><span class="small muted">${tr('Exactly what the room sees.', 'Tačno ono što sala vidi.')}</span></div>
    <div class="material">${renderBlocks(week.blocks, refs)}</div>
  </section>
  <p class="actions"><button type="button" id="reload-week">${tr('Load this week from the repository', 'Učitaj ovu nedelju iz repozitorijuma')}</button><button type="button" id="clear-draft">${tr('Throw away my draft', 'Odbaci moj nacrt')}</button></p>`;
}

/* ---------------- reading the form back into the object ---------------- */
function readPair(id) {
  return { en: ($('#' + id + '-en')?.value || '').trim(), sr: ($('#' + id + '-sr')?.value || '').trim() };
}
function readItems(id) {
  const sr = ($('#' + id + '-sr')?.value || '').split('\n').map(line => line.trim());
  const en = ($('#' + id + '-en')?.value || '').split('\n').map(line => line.trim());
  const count = Math.max(sr.length, en.length);
  const items = [];
  for (let i = 0; i < count; i++) {
    const entry = { en: en[i] || '', sr: sr[i] || '' };
    if (entry.en || entry.sr) items.push(entry);
  }
  return items;
}

function harvest() {
  week.n = Math.min(30, Math.max(1, Number($('#week-n').value) || 1));
  week.state = $('#week-state').value === 'published' ? 'published' : 'draft';
  week.date = $('#week-date').value || null;
  week.dateStatus = $('#week-datestatus').value === 'confirmed' ? 'confirmed' : 'proposed';
  week.title = readPair('week-title');
  week.aim = readPair('week-aim');
  week.bring = readItems('week-bring');
  week.blocks = week.blocks.map((block, position) => {
    const id = `b${position}`;
    const next = { kind: block.kind };
    const spec = BLOCK_KINDS[block.kind];
    if ($('#' + id + '-text-sr')) next.text = readPair(id + '-text');
    if (spec.needs.includes('items')) next.items = readItems(id + '-items');
    if (block.kind === 'measure') { next.value = $('#' + id + '-value').value.trim(); next.instrument = readPair(id + '-instrument'); }
    if (block.kind === 'quote') next.source = $('#' + id + '-source').value.trim();
    if (block.kind === 'image') { next.src = $('#' + id + '-src').value.trim(); next.alt = readPair(id + '-alt'); const caption = readPair(id + '-caption'); if (caption.en || caption.sr) next.caption = caption; }
    if (block.kind === 'link' || block.kind === 'file') next.href = $('#' + id + '-href').value.trim();
    if (block.kind === 'lab' || block.kind === 'exercise') next.ref = $('#' + id + '-ref').value;
    if (next.text && !next.text.en && !next.text.sr && !spec.needs.includes('text')) delete next.text;
    return next;
  });
  week.updated = new Date().toISOString().slice(0, 10);
  week.format = FORMAT; week.version = VERSION;
}

/* ---------------- the page ---------------- */
let draw = null;

async function refresh({ keepFocus = true } = {}) {
  const active = document.activeElement?.id;
  const caret = document.activeElement && 'selectionStart' in document.activeElement ? document.activeElement.selectionStart : null;
  problems = validateWeek(week).problems;
  refs = await resolveRefs(week.blocks);
  if (!save(DRAFT_KEY, week)) announce(tr('The draft is too large for browser storage — download the file.', 'Nacrt je prevelik za memoriju pregledača — preuzmi fajl.'));
  draw();
  if (keepFocus && active) {
    const element = document.getElementById(active);
    if (element) { element.focus(); if (caret !== null && 'setSelectionRange' in element) try { element.setSelectionRange(caret, caret); } catch { /* not a text field */ } }
  }
}

function bind() {
  const onInput = () => { harvest(); problems = validateWeek(week).problems; save(DRAFT_KEY, week); };
  // #add-kind is not part of the week: re-rendering on its change would throw the choice away.
  $$('#main textarea, #main input, #main select').forEach(element => {
    if (element.id === 'add-kind') return;
    element.addEventListener('input', onInput);
    element.addEventListener('change', () => { harvest(); refresh(); });
  });
  $('#add-block').addEventListener('click', () => {
    harvest();
    const kind = $('#add-kind').value;
    const block = { kind };
    if (BLOCK_KINDS[kind].needs.includes('items')) block.items = [];
    if (kind === 'lab') block.ref = labIds[0]?.id || 'citac';
    if (kind === 'exercise') block.ref = exerciseIds[0]?.id || 'app-for-one';
    week.blocks.push(block);
    refresh({ keepFocus: false }).then(() => {
      const cards = $$('.editor-block');
      cards[cards.length - 1]?.querySelector('textarea,input,select')?.focus();
    });
  });
  $$('[data-move]').forEach(button => button.addEventListener('click', () => {
    harvest();
    const at = Number(button.dataset.at);
    const to = button.dataset.move === 'up' ? at - 1 : at + 1;
    if (to < 0 || to >= week.blocks.length) return;
    [week.blocks[at], week.blocks[to]] = [week.blocks[to], week.blocks[at]];
    refresh({ keepFocus: false });
  }));
  $$('[data-remove]').forEach(button => button.addEventListener('click', () => {
    harvest();
    const at = Number(button.dataset.remove);
    week.blocks.splice(at, 1);
    refresh({ keepFocus: false });
    announce(tr('Entry removed.', 'Upis uklonjen.'));
  }));
  $('#copy-json').addEventListener('click', async () => {
    harvest();
    const ok = await copy(serializeWeek(week));
    announce(ok ? tr('The file is on the clipboard.', 'Fajl je u ostavi.') : tr('The browser refused the clipboard — download the file.', 'Pregledač je odbio ostavu — preuzmi fajl.'));
  });
  $('#download-json').addEventListener('click', () => { harvest(); download(weekFile(week.n).split('/').pop(), serializeWeek(week), 'application/json;charset=utf-8'); });
  $('#reload-week').addEventListener('click', async () => {
    try {
      const fetched = await loadJSON(weekFile(week.n) + '?t=' + Date.now());
      week = fetched;
      refresh({ keepFocus: false });
      announce(tr('Loaded from the repository.', 'Učitano iz repozitorijuma.'));
    } catch {
      announce(tr('That week is not in the repository yet.', 'Ta nedelja još ne postoji u repozitorijumu.'));
    }
  });
  $('#clear-draft').addEventListener('click', () => {
    drop(DRAFT_KEY);
    week = emptyWeek(week.n);
    refresh({ keepFocus: false });
    announce(tr('Draft thrown away.', 'Nacrt odbačen.'));
  });
}

function render() {
  // The shell is drawn before the week is read; say so instead of throwing.
  if (!week) { $('#main').innerHTML = `<p class="loading">${tr('Opening the material…', 'Otvaram građu…')}</p>`; return; }
  $('#main').innerHTML = view();
  bind();
}

draw = mount({ view: 'editor', render, title: () => tr('Prepare material', 'Pripremi gradivo') });

(async () => {
  const stored = read(DRAFT_KEY, null);
  const wanted = Number(new URLSearchParams(location.search).get('w'));
  try { index = await loadJSON(MATERIAL_INDEX); } catch { index = null; }
  try {
    const { labs } = await import('./lab-core.js');
    labIds = labs.map(lab => ({ id: lab.id, label: tx(lab.title) }));
  } catch { labIds = []; }
  try {
    const { exercises } = await import('./exercises.js');
    exerciseIds = exercises.map(exercise => ({ id: exercise.id, label: `${exercise.week}. ${tx(exercise.title)}` }));
  } catch { exerciseIds = []; }

  if (Number.isInteger(wanted) && wanted >= 1) {
    try { week = await loadJSON(weekFile(wanted)); } catch { week = emptyWeek(wanted); }
  } else if (stored && typeof stored === 'object' && Array.isArray(stored.blocks)) {
    week = stored;
  } else {
    const next = index ? Math.max(...index.weeks.map(entry => entry.n)) + 1 : 1;
    week = emptyWeek(Math.min(30, next));
  }
  await refresh({ keepFocus: false });
})();
