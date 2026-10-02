// The creative hub: the cloud where seeds, read sources and open questions live together.
// No login, upload or server state: the pair lives in the URL and the private note in this browser.

import { $, $$, esc, tr, tx, read, save, drop, download, copy, announce, mount, lang } from './core.js';
import { IDEA_BANK, IDEA_FIELDS, IDEA_STATUSES, ideaById, filterIdeas, connectIdeas } from './idea-bank.js';
import { RESEARCH, RESEARCH_KINDS, RESEARCH_THREADS, OPEN_QUESTIONS, filterResearch } from './research.js';

const params = new URLSearchParams(location.search);
let selected = [params.get('a'), params.get('b')].filter(id => ideaById(id)).slice(0, 2);
let filters = { status: 'all', field: 'all', principle: 'all', query: '' };
let shelf = { thread: 'all', kind: 'all', verified: 'all', query: '' };

const VERIFIED = [
  { id: 'full', label: { en: 'source read in full', sr: 'izvor pročitan u celini' } },
  { id: 'abstract', label: { en: 'abstract only', sr: 'samo apstrakt' } },
  { id: 'secondary', label: { en: 'from a summary — open it before quoting', sr: 'iz sažetka — otvori pre navođenja' } }
];
const verifiedLabel = id => tx(VERIFIED.find(item => item.id === id)?.label || { en: id, sr: id });
const kindLabel = id => tx(RESEARCH_KINDS.find(item => item.id === id)?.label || { en: id, sr: id });
const threadLabel = id => tx(RESEARCH_THREADS.find(item => item.id === id)?.label || { en: id, sr: id });

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

// The shelf: every source we have read for this course, with what it does not say kept
// beside what it says. `verified` is load-bearing, not decoration — see assets/research.js.
function shelfSection() {
  const list = filterResearch(shelf);
  const option = (value, label, current) => `<option value="${esc(value)}"${value === current ? ' selected' : ''}>${esc(label)}</option>`;
  return `<section class="idea-library" aria-labelledby="shelf-title"><div class="section-heading"><div><p class="eyebrow">${tr('The shelf', 'Polica')}</p><h2 id="shelf-title">${tr('What we have read, and what it does not say.', 'Šta smo pročitali, i šta to ne tvrdi.')}</h2></div><p id="shelf-count" class="tag" role="status">${list.length}/${RESEARCH.length}</p></div>
  <p class="help">${tr('Every entry carries how far we actually read it. An entry marked “from a summary” may not be quoted as a fact in an A3 before the original is opened — that rule is the only thing separating a library from a rumour.', 'Svaki zapis nosi dokle smo ga stvarno pročitali. Zapis označen sa „iz sažetka” ne sme da se navede kao činjenica na A3 pre nego što se otvori original — to pravilo je jedino što biblioteku razlikuje od glasine.')}</p>
  <div class="idea-filters" aria-label="${tr('Filter the shelf', 'Filtriraj policu')}">
    <div><label for="shelf-search">${tr('Search', 'Pretraga')}</label><input id="shelf-search" type="search" value="${esc(shelf.query)}" placeholder="${tr('rotation, toy, law…', 'rotacija, igračka, zakon…')}"></div>
    <div><label for="shelf-thread">${tr('Thread', 'Nit')}</label><select id="shelf-thread">${option('all', tr('All threads', 'Sve niti'), shelf.thread)}${RESEARCH_THREADS.map(item => option(item.id, tx(item.label), shelf.thread)).join('')}</select></div>
    <div><label for="shelf-kind">${tr('Kind', 'Vrsta')}</label><select id="shelf-kind">${option('all', tr('All kinds', 'Sve vrste'), shelf.kind)}${RESEARCH_KINDS.map(item => option(item.id, tx(item.label), shelf.kind)).join('')}</select></div>
    <div><label for="shelf-verified">${tr('How far read', 'Dokle pročitano')}</label><select id="shelf-verified">${option('all', tr('Any', 'Svejedno'), shelf.verified)}${VERIFIED.map(item => option(item.id, tx(item.label), shelf.verified)).join('')}</select></div>
  </div>
  <div class="shelf-grid">${list.length ? list.map(entry => `<article class="shelf-card verified-${esc(entry.verified)}">
    <div class="idea-card-meta"><span class="tag">${esc(kindLabel(entry.kind))}</span><span>${esc(threadLabel(entry.thread))}</span><span>${entry.year}</span></div>
    <h3>${esc(tx(entry.title))}</h3>
    <p class="shelf-who">${esc(entry.who)}</p>
    <p>${esc(tx(entry.says))}</p>
    <p class="shelf-limit"><b>${tr('What it does not say', 'Šta ne tvrdi')}:</b> ${esc(tx(entry.limit))}</p>
    <p class="shelf-use"><b>${tr('What it changes for us', 'Šta nama menja')}:</b> ${esc(tx(entry.use))}</p>
    <p class="small"><span class="tag">${esc(verifiedLabel(entry.verified))}</span> <a href="${esc(entry.url)}" target="_blank" rel="noopener">${tr('Open the source', 'Otvori izvor')} ↗</a></p>
  </article>`).join('') : `<p class="notice">${tr('Nothing on the shelf matches these filters.', 'Ništa na polici ne odgovara ovim filterima.')}</p>`}</div></section>`;
}

function questionsSection() {
  return `<section class="idea-library" aria-labelledby="questions-title"><div class="section-heading"><div><p class="eyebrow">${tr('Not answered yet', 'Još bez odgovora')}</p><h2 id="questions-title">${tr('The holes in the shelf.', 'Rupe na polici.')}</h2></div><p class="tag">${OPEN_QUESTIONS.length}</p></div>
  <p class="help">${tr('An open question is a piece of work, not an apology. Each one says what would change if it were answered, and what the next move is.', 'Otvoreno pitanje je posao, a ne izvinjenje. Svako kaže šta bi se promenilo da je odgovoreno i koji je sledeći potez.')}</p>
  <ol class="open-questions">${OPEN_QUESTIONS.map(item => `<li><h3>${esc(tx(item.question))}</h3><p>${esc(tx(item.why))}</p><p class="shelf-use"><b>${tr('Next move', 'Sledeći potez')}:</b> ${esc(tx(item.next))}</p></li>`).join('')}</ol></section>`;
}

function view() {
  const list = filterIdeas(filters);
  return `<div class="page-top"><div><p class="eyebrow">${tr('Research / Play / Selection', 'Istraživanje / Igra / Izbor')}</p><h1>${tr('Creative hub.', 'Creative hub.')}</h1><p class="lede">${tr('The cloud behind the course: seeds, the sources we have read, the examples and the questions nobody has answered yet. The weekly page is what we have settled; this is where everything is still moving. Nothing here is a hand-in and nothing here is assigned.', 'Oblak iza predmeta: ideje, izvori koje smo pročitali, primeri i pitanja na koja još niko nije odgovorio. Radna nedelja je ono što smo utvrdili; ovde je sve što se još pomera. Ništa ovde nije predaja i ništa se odavde ne zadaje.')}</p></div><span class="tag">${IDEA_BANK.length} ${tr('seeds', 'ideja')} · ${RESEARCH.length} ${tr('sources', 'izvora')} · ${OPEN_QUESTIONS.length} ${tr('open', 'otvorenih')}</span></div>
  <div class="atelier-rule"><strong>${tr('Nothing here is assigned automatically.', 'Odavde se ništa ne zadaje automatski.')}</strong> ${tr('A seed moves to the course only through a reviewed weekly file: purpose, source, activity, A3 outcome and a test.', 'Ideja prelazi u predmet tek kroz pregledan fajl radne nedelje: svrha, izvor, aktivnost, rezultat na A3 i provera.')}</div>
  <ol class="idea-pipeline" aria-label="${tr('From an idea to a teaching week', 'Od ideje do radne nedelje')}"><li><b>01</b><span>${tr('Notice', 'Opazi')}</span><small>${tr('Keep the unresolved question.', 'Sačuvaj nerešeno pitanje.')}</small></li><li><b>02</b><span>${tr('Connect', 'Poveži')}</span><small>${tr('Join distant fields.', 'Spoji udaljena polja.')}</small></li><li><b>03</b><span>${tr('Test', 'Proveri')}</span><small>${tr('Name the evidence.', 'Imenuj dokaz.')}</small></li><li><b>04</b><span>${tr('Select', 'Izaberi')}</span><small>${tr('Write one working week.', 'Napiši jednu radnu nedelju.')}</small></li></ol>
  ${connectionMarkup()}
  <section class="idea-library" aria-labelledby="idea-bank-title"><div class="section-heading"><div><p class="eyebrow">${tr('Living bank', 'Živa banka')}</p><h2 id="idea-bank-title">${tr('Seeds, not a syllabus.', 'Ideje, ne silabus.')}</h2></div><p id="idea-count" class="tag" role="status">${list.length}/${IDEA_BANK.length}</p></div>${filtersMarkup()}<div class="idea-bank-grid">${list.length ? list.map(cardMarkup).join('') : `<p class="notice">${tr('No idea matches these filters.', 'Nijedna ideja ne odgovara ovim filterima.')}</p>`}</div></section>
  ${shelfSection()}
  ${questionsSection()}`;
}

function markdown() {
  const ideas = selected.map(ideaById).filter(Boolean);
  const bridge = ideas.length === 2 ? connectIdeas(ideas[0].id, ideas[1].id, lang) : null;
  const note = $('#idea-note')?.value.trim() || '';
  const lines = [`# ${tr('Creative hub — working note', 'Creative hub — radna beleška')}`, '', `${tr('Date', 'Datum')}: ${new Date().toISOString().slice(0, 10)}`, ''];
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
  for (const [id, key] of [['shelf-thread','thread'],['shelf-kind','kind'],['shelf-verified','verified']]) {
    $('#'+id)?.addEventListener('change', event => { shelf[key] = event.target.value; render(); $('#'+id)?.focus(); });
  }
  $('#shelf-search')?.addEventListener('input', event => {
    shelf.query = event.target.value;
    const position = event.target.selectionStart;
    render();
    const input = $('#shelf-search');
    input?.focus();
    input?.setSelectionRange(position, position);
  });
  $('#idea-note')?.addEventListener('input', event => {
    const ok = save('idea-note', event.target.value);
    $('#idea-note-status').textContent = ok ? tr('Kept only in this browser. Not sent or published.', 'Beleška ostaje samo u ovom pregledaču. Nije poslata ni objavljena.') : tr('This browser could not keep the note. Download it before leaving.', 'Pregledač nije sačuvao belešku. Preuzmi je pre izlaska.');
  });
  $('#download-idea')?.addEventListener('click', () => { download('creative-hub.md', markdown(), 'text/markdown;charset=utf-8'); announce(tr('Working note downloaded.', 'Radna beleška je preuzeta.')); });
  $('#copy-link')?.addEventListener('click', async () => { const ok = await copy(location.href); announce(ok ? tr('Link copied.', 'Veza je kopirana.') : tr('Copy failed; use the address bar.', 'Kopiranje nije uspelo; upotrebi adresnu traku.')); });
  $('#clear-atelier')?.addEventListener('click', () => { selected = []; drop('idea-note'); syncAddress(); render(); $('#random-pair')?.focus(); announce(tr('The table is clear.', 'Sto je očišćen.')); });
}

function render() { $('#main').innerHTML = view(); bind(); }
mount({ view: 'ideas', render, title: () => tr('Creative hub', 'Creative hub') });
