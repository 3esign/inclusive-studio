// A small, local-first instrument for connecting research seeds.
// No login, upload or server state: the pair lives in the URL and the private note in this browser.

import { $, $$, esc, tr, tx, read, save, drop, download, copy, announce, mount, lang } from './core.js';
import { IDEA_BANK, IDEA_FIELDS, IDEA_STATUSES, ideaById, filterIdeas, connectIdeas } from './idea-bank.js';

const params = new URLSearchParams(location.search);
let selected = [params.get('a'), params.get('b')].filter(id => ideaById(id)).slice(0, 2);
let filters = { status: 'all', field: 'all', principle: 'all', query: '' };

const statusLabel = id => tx(IDEA_STATUSES.find(item => item.id === id)?.label || { en: id, sr: id });
const fieldLabel = id => tx(IDEA_FIELDS.find(item => item.id === id)?.label || { en: id, sr: id });

function syncAddress() {
  const url = new URL(location.href);
  url.searchParams.delete('a');
  url.searchParams.delete('b');
  if (selected[0]) url.searchParams.set('a', selected[0]);
  if (selected[1]) url.searchParams.set('b', selected[1]);
  history.replaceState(null, '', url);
}

function connectionMarkup() {
  const ideas = selected.map(ideaById).filter(Boolean);
  const bridge = ideas.length === 2 ? connectIdeas(ideas[0].id, ideas[1].id, lang) : null;
  const track = ideas.length
    ? ideas.map((idea, index) => `<span>${esc(tx(idea.title))}</span>${index === 0 && ideas.length === 2 ? '<i aria-hidden="true">↔</i>' : ''}`).join('')
    : `<span>${tr('Choose two cards below', 'Izaberi dve kartice ispod')}</span>`;
  return `<section class="idea-workbench" aria-labelledby="workbench-title">
    <div class="workbench-head"><div><p class="eyebrow">${tr('Connection table', 'Sto za povezivanje')}</p><h2 id="workbench-title">${tr('Put two distant ideas together.', 'Spoji dve udaljene ideje.')}</h2></div><button type="button" id="random-pair" class="button signal">${tr('Draw a pair', 'Izvuci par')}</button></div>
    <div class="bridge-track" aria-live="polite">${track}</div>
    ${bridge ? `<article class="connection-result" id="connection-result" tabindex="-1">
      <p class="meta-label">${esc(bridge.relation)}</p><h3>${esc(bridge.title)}</h3>
      <p class="connection-question">${esc(bridge.question)}</p>
      <dl><dt>${tr('First drawing', 'Prvi crtež')}</dt><dd>${esc(bridge.move)}</dd><dt>${tr('Evidence to seek', 'Dokaz koji tražimo')}</dt><dd>${esc(bridge.evidence)}</dd>${bridge.principles.length ? `<dt>${tr('Shared principles', 'Zajednički principi')}</dt><dd>${bridge.principles.join(', ')}</dd>` : ''}</dl>
      <p class="help">${esc(bridge.guardrail)}</p>
    </article>` : `<p class="help">${tr('A connection appears after two ideas are selected. Selection changes no teaching material.', 'Veza se pojavljuje kada izabereš dve ideje. Izbor ne menja nastavno gradivo.')}</p>`}
    <div class="idea-note"><label for="idea-note">${tr('Working note', 'Radna beleška')}</label><textarea id="idea-note" rows="6" maxlength="12000" placeholder="${tr('A question, a sketch in words, a source to check…', 'Pitanje, skica rečima, izvor koji treba proveriti…')}">${esc(read('idea-note', '') || '')}</textarea><p class="help" id="idea-note-status" role="status">${tr('Kept only in this browser. It is not sent or published.', 'Ostaje samo u ovom pregledaču. Ne šalje se i ne objavljuje.')}</p></div>
    <div class="actions"><button type="button" id="download-idea">${tr('Download the working note', 'Preuzmi radnu belešku')}</button><button type="button" id="copy-link">${tr('Copy this pair’s link', 'Kopiraj vezu ovog para')}</button><button type="button" id="clear-atelier">${tr('Clear the table', 'Očisti sto')}</button></div>
  </section>`;
}

function filtersMarkup() {
  const option = (value, label, current) => `<option value="${esc(value)}"${value === current ? ' selected' : ''}>${esc(label)}</option>`;
  return `<div class="idea-filters" aria-label="${tr('Filter the idea bank', 'Filtriraj banku ideja')}">
    <div><label for="idea-search">${tr('Search', 'Pretraga')}</label><input id="idea-search" type="search" value="${esc(filters.query)}" placeholder="${tr('route, touch, AI…', 'putanja, dodir, AI…')}"></div>
    <div><label for="idea-status">${tr('State', 'Stanje')}</label><select id="idea-status">${option('all', tr('All states', 'Sva stanja'), filters.status)}${IDEA_STATUSES.map(item => option(item.id, tx(item.label), filters.status)).join('')}</select></div>
    <div><label for="idea-field">${tr('Field', 'Polje')}</label><select id="idea-field">${option('all', tr('All fields', 'Sva polja'), filters.field)}${IDEA_FIELDS.map(item => option(item.id, tx(item.label), filters.field)).join('')}</select></div>
    <div><label for="idea-principle">${tr('Principle', 'Princip')}</label><select id="idea-principle">${option('all', tr('All seven', 'Svih sedam'), filters.principle)}${[1,2,3,4,5,6,7].map(number => option(String(number), `${tr('Principle', 'Princip')} ${number}`, filters.principle)).join('')}</select></div>
  </div>`;
}

function cardMarkup(idea) {
  const on = selected.includes(idea.id);
  return `<article class="idea-card${on ? ' is-selected' : ''}" data-idea="${esc(idea.id)}">
    <div class="idea-card-meta"><span class="tag">${esc(statusLabel(idea.status))}</span><span>${esc(fieldLabel(idea.field))}</span></div>
    <h3>${esc(tx(idea.title))}</h3><p class="idea-bridge">${esc(tx(idea.bridge))}</p><p>${esc(tx(idea.question))}</p>
    <details><summary>${tr('Open the seed', 'Otvori ideju')}</summary><div><p><strong>${tr('First move', 'Prvi potez')}:</strong> ${esc(tx(idea.move))}</p><p><strong>${tr('Evidence', 'Dokaz')}:</strong> ${esc(tx(idea.evidence))}</p><p class="small"><a href="${esc(idea.source.url)}" target="_blank" rel="noopener">${esc(idea.source.label)} ↗</a></p></div></details>
    <button type="button" class="idea-pick" data-pick="${esc(idea.id)}" aria-pressed="${on}">${on ? tr('Remove from the connection', 'Ukloni iz spoja') : tr('Add to the connection', 'Dodaj u spoj')}</button>
  </article>`;
}

function view() {
  const list = filterIdeas(filters);
  return `<div class="page-top"><div><p class="eyebrow">${tr('Research / Play / Selection', 'Istraživanje / Igra / Izbor')}</p><h1>${tr('The idea atelier.', 'Atelje ideja.')}</h1><p class="lede">${tr('A shared experimental space for the teacher, students and coauthors: unfinished connections, research questions, possible exercises and projects. The weekly page remains the course; here we make possibilities before choosing one.', 'Zajednički eksperimentalni prostor za nastavnika, studente i koautore: nedovršene veze, istraživačka pitanja, moguće vežbe i projekti. Radna nedelja ostaje predmet; ovde pravimo mogućnosti pre nego što jednu izaberemo.')}</p></div><span class="tag">${IDEA_BANK.length} ${tr('seeds', 'ideja')}</span></div>
  <div class="atelier-rule"><strong>${tr('Nothing here is assigned automatically.', 'Odavde se ništa ne zadaje automatski.')}</strong> ${tr('A seed moves to the course only through a reviewed weekly file: purpose, source, activity, A3 outcome and a test.', 'Ideja prelazi u predmet tek kroz pregledan fajl radne nedelje: svrha, izvor, aktivnost, rezultat na A3 i provera.')}</div>
  <ol class="idea-pipeline" aria-label="${tr('From an idea to a teaching week', 'Od ideje do radne nedelje')}"><li><b>01</b><span>${tr('Notice', 'Opazi')}</span><small>${tr('Keep the unresolved question.', 'Sačuvaj nerešeno pitanje.')}</small></li><li><b>02</b><span>${tr('Connect', 'Poveži')}</span><small>${tr('Join distant fields.', 'Spoji udaljena polja.')}</small></li><li><b>03</b><span>${tr('Test', 'Proveri')}</span><small>${tr('Name the evidence.', 'Imenuj dokaz.')}</small></li><li><b>04</b><span>${tr('Select', 'Izaberi')}</span><small>${tr('Write one working week.', 'Napiši jednu radnu nedelju.')}</small></li></ol>
  ${connectionMarkup()}
  <section class="idea-library" aria-labelledby="idea-bank-title"><div class="section-heading"><div><p class="eyebrow">${tr('Living bank', 'Živa banka')}</p><h2 id="idea-bank-title">${tr('Seeds, not a syllabus.', 'Ideje, ne silabus.')}</h2></div><p id="idea-count" class="tag" role="status">${list.length}/${IDEA_BANK.length}</p></div>${filtersMarkup()}<div class="idea-bank-grid">${list.length ? list.map(cardMarkup).join('') : `<p class="notice">${tr('No idea matches these filters.', 'Nijedna ideja ne odgovara ovim filterima.')}</p>`}</div></section>`;
}

function markdown() {
  const ideas = selected.map(ideaById).filter(Boolean);
  const bridge = ideas.length === 2 ? connectIdeas(ideas[0].id, ideas[1].id, lang) : null;
  const note = $('#idea-note')?.value.trim() || '';
  const lines = [`# ${tr('Idea atelier — working note', 'Atelje ideja — radna beleška')}`, '', `${tr('Date', 'Datum')}: ${new Date().toISOString().slice(0, 10)}`, ''];
  if (bridge) lines.push(`## ${bridge.title}`, '', bridge.question, '', `**${tr('First drawing', 'Prvi crtež')}:** ${bridge.move}`, '', `**${tr('Evidence', 'Dokaz')}:** ${bridge.evidence}`, '', `_${bridge.guardrail}_`, '');
  else lines.push(`_${tr('No pair selected.', 'Nije izabran par ideja.')}_`, '');
  if (note) lines.push(`## ${tr('Working note', 'Radna beleška')}`, '', note, '');
  return lines.join('\n');
}

function chooseRandomPair() {
  const pool = filterIdeas(filters);
  if (pool.length < 2) { announce(tr('At least two visible ideas are needed.', 'Potrebne su najmanje dve vidljive ideje.')); return; }
  const first = Math.floor(Math.random() * pool.length);
  let second = Math.floor(Math.random() * (pool.length - 1));
  if (second >= first) second += 1;
  selected = [pool[first].id, pool[second].id];
  syncAddress();
  render();
  $('#connection-result')?.focus();
}

function bind() {
  $$('.idea-pick').forEach(button => button.addEventListener('click', () => {
    const id = button.dataset.pick;
    if (selected.includes(id)) selected = selected.filter(item => item !== id);
    else selected = [...selected.slice(-1), id];
    syncAddress();
    render();
    if (selected.length === 2) $('#connection-result')?.focus();
    else $(`[data-pick="${id}"]`)?.focus();
  }));
  $('#random-pair')?.addEventListener('click', chooseRandomPair);
  for (const [id, key] of [['idea-status','status'],['idea-field','field'],['idea-principle','principle']]) {
    $('#'+id)?.addEventListener('change', event => { filters[key] = event.target.value; render(); $('#'+id)?.focus(); });
  }
  $('#idea-search')?.addEventListener('input', event => {
    filters.query = event.target.value;
    const position = event.target.selectionStart;
    render();
    const input = $('#idea-search');
    input?.focus();
    input?.setSelectionRange(position, position);
  });
  $('#idea-note')?.addEventListener('input', event => {
    const ok = save('idea-note', event.target.value);
    $('#idea-note-status').textContent = ok ? tr('Kept only in this browser. Not sent or published.', 'Beleška ostaje samo u ovom pregledaču. Nije poslata ni objavljena.') : tr('This browser could not keep the note. Download it before leaving.', 'Pregledač nije sačuvao belešku. Preuzmi je pre izlaska.');
  });
  $('#download-idea')?.addEventListener('click', () => { download('atelje-ideja.md', markdown(), 'text/markdown;charset=utf-8'); announce(tr('Working note downloaded.', 'Radna beleška je preuzeta.')); });
  $('#copy-link')?.addEventListener('click', async () => { const ok = await copy(location.href); announce(ok ? tr('Link copied.', 'Veza je kopirana.') : tr('Copy failed; use the address bar.', 'Kopiranje nije uspelo; upotrebi adresnu traku.')); });
  $('#clear-atelier')?.addEventListener('click', () => { selected = []; drop('idea-note'); syncAddress(); render(); $('#random-pair')?.focus(); announce(tr('The table is clear.', 'Sto je očišćen.')); });
}

function render() { $('#main').innerHTML = view(); bind(); }
mount({ view: 'ideas', render, title: () => tr('Idea atelier', 'Atelje ideja') });
