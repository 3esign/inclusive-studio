// The page that sums up what changes with the age of the user: ten bands, the limits that
// apply to each, and the obligation behind them. One filter, three classes, no invented number.

import { $, $$, esc, tr, tx, mount, announce, download } from './core.js';
import { AGE_DOCTRINE, AGE_BANDS, AGE_LIMITS, AGE_LIMIT_KINDS, AGE_LAWS, AGE_GAPS, filterLimits, bandById } from './age-rules.js';

let filters = { band: 'all', kind: 'all', query: '' };
let open = null; // the band whose detail is expanded

const kindLabel = id => tx(AGE_LIMIT_KINDS.find(item => item.id === id)?.label || { en: id, sr: id });
const sourceLabel = value => (typeof value === 'string' ? value : tx(value));

const VERIFIED = {
  full: { en: 'source read in full', sr: 'izvor pročitan u celini' },
  abstract: { en: 'front matter only', sr: 'samo prednji deo' },
  secondary: { en: 'from a summary — open it before quoting', sr: 'iz sažetka — otvori pre navođenja' }
};
const verifiedLabel = id => tx(VERIFIED[id] || { en: id, sr: id });

// Months are the honest unit below three years; years stop lying after that.
function span(band) {
  const [from, to] = band.months;
  if (to < 36) return `${from}–${to} ${tr('months', 'meseci')}`;
  const first = Math.floor(from / 12);
  const last = Math.floor(to / 12);
  return first === last
    ? `${first} ${tr('years', 'godine')}`
    : `${first}–${last} ${tr('years', 'godine')}`;
}

function doctrineSection() {
  return `<section class="age-doctrine" aria-labelledby="doctrine-title">
    <div class="section-heading"><div><p class="eyebrow">${tr('Before the table', 'Pre tabele')}</p><h2 id="doctrine-title">${tr('Three rules that decide how every number below is used.', 'Tri pravila koja odlučuju kako se svaki broj ispod koristi.')}</h2></div></div>
    <ol class="doctrine-list">${AGE_DOCTRINE.map((rule, index) => `<li><b>${index + 1}</b><div>
      <h3>${esc(tx(rule.title))}</h3>
      <p>${esc(tx(rule.body))}</p>
      <p class="shelf-use"><b>${tr('In this studio', 'U ovom studiju')}:</b> ${esc(tx(rule.studio))}</p>
    </div></li>`).join('')}</ol></section>`;
}

function bandCard(band) {
  const limits = filterLimits({ ...filters, band: band.id });
  const expanded = open === band.id;
  const counts = AGE_LIMIT_KINDS.map(kind => ({ kind: kind.id, n: limits.filter(limit => limit.kind === kind.id).length })).filter(item => item.n);
  return `<article class="age-band${expanded ? ' is-open' : ''}" data-band="${esc(band.id)}">
    <header><p class="meta-label">${esc(span(band))}</p><h3>${esc(tx(band.label))}</h3>
      <p class="age-counts">${counts.map(item => `<span class="tag kind-${item.kind}">${item.n} × ${esc(kindLabel(item.kind))}</span>`).join('') || `<span class="tag">${tr('nothing under these filters', 'ništa pod ovim filterima')}</span>`}</p></header>
    <dl class="age-facts">
      <dt>${tr('The hand and the mind', 'Ruka i um')}</dt><dd>${esc(tx(band.does))}</dd>
      <dt>${tr('The operation on space', 'Radnja nad prostorom')}</dt><dd>${esc(tx(band.space))}</dd>
      <dt>${tr('What that means for an object', 'Šta to znači za predmet')}</dt><dd>${esc(tx(band.product))}</dd>
      <dt>${tr('The trap at this band', 'Klopka u ovom razredu')}</dt><dd class="age-trap">${esc(tx(band.trap))}</dd>
    </dl>
    <button type="button" class="band-toggle" data-toggle="${esc(band.id)}" aria-expanded="${expanded}">${expanded ? tr('Hide the limits', 'Sakrij granice') : `${tr('Show the limits', 'Prikaži granice')} (${limits.length})`}</button>
    ${expanded ? `<ul class="age-limits">${limits.length ? limits.map(limitRow).join('') : `<li class="notice">${tr('No limit matches the current filters for this band.', 'Nijedna granica ne odgovara trenutnim filterima za ovaj razred.')}</li>`}</ul>` : ''}
  </article>`;
}

function limitRow(limit) {
  return `<li class="age-limit kind-${esc(limit.kind)}">
    <p class="limit-head"><span class="tag kind-${esc(limit.kind)}">${esc(kindLabel(limit.kind))}</span> <b class="limit-value">${esc(limit.value)}</b></p>
    <p class="limit-rule">${esc(tx(limit.rule))}</p>
    <p class="limit-detail">${esc(tx(limit.detail))}</p>
    <p class="small"><a href="${esc(limit.url)}" target="_blank" rel="noopener">${esc(sourceLabel(limit.source))} ↗</a> · <span class="tag">${esc(verifiedLabel(limit.verified))}</span></p>
  </li>`;
}

function tableSection() {
  const list = filterLimits(filters);
  const option = (value, label, current) => `<option value="${esc(value)}"${value === current ? ' selected' : ''}>${esc(label)}</option>`;
  return `<section class="age-table" aria-labelledby="table-title">
    <div class="section-heading"><div><p class="eyebrow">${tr('The limits', 'Granice')}</p><h2 id="table-title">${tr('What applies, to whom, and under which clause.', 'Šta važi, za koga, i po kom članu.')}</h2></div><p id="limit-count" class="tag" role="status">${list.length}/${AGE_LIMITS.length}</p></div>
    <p class="help">${tr('Every row carries its class, its clause and how far we read the source. A row without a clause does not belong here. The ten bands are the CPSC 2020 groups, adopted unchanged so the numbers stay traceable.', 'Svaki red nosi svoju klasu, svoj član i to dokle smo izvor pročitali. Red bez člana ovde ne pripada. Deset razreda su grupe CPSC-a iz 2020, uzete nepromenjene da brojevi ostanu proverljivi.')}</p>
    <div class="idea-filters" aria-label="${tr('Filter the limits', 'Filtriraj granice')}">
      <div><label for="age-search">${tr('Search', 'Pretraga')}</label><input id="age-search" type="search" value="${esc(filters.query)}" placeholder="${tr('cord, ramp, 36 months…', 'kanap, rampa, 36 meseci…')}"></div>
      <div><label for="age-band">${tr('Band', 'Razred')}</label><select id="age-band">${option('all', tr('All ten bands', 'Svih deset razreda'), filters.band)}${AGE_BANDS.map(band => option(band.id, tx(band.label), filters.band)).join('')}</select></div>
      <div><label for="age-kind">${tr('Class', 'Klasa')}</label><select id="age-kind">${option('all', tr('All three classes', 'Sve tri klase'), filters.kind)}${AGE_LIMIT_KINDS.map(kind => option(kind.id, tx(kind.label), filters.kind)).join('')}</select></div>
    </div>
    <div class="age-grid">${(filters.band === 'all' ? AGE_BANDS : AGE_BANDS.filter(band => band.id === filters.band)).map(bandCard).join('')}</div>
  </section>`;
}

function lawSection() {
  return `<section class="idea-library" aria-labelledby="law-title">
    <div class="section-heading"><div><p class="eyebrow">${tr('Behind the numbers', 'Iza brojeva')}</p><h2 id="law-title">${tr('The obligation that has no number.', 'Obaveza koja nema broj.')}</h2></div><p class="tag">${AGE_LAWS.length}</p></div>
    <div class="shelf-grid">${AGE_LAWS.map(law => `<article class="shelf-card verified-${esc(law.verified)}">
      <div class="idea-card-meta"><span class="tag">${law.year}</span></div>
      <h3>${esc(tx(law.title))}</h3>
      <p>${esc(tx(law.says))}</p>
      <p class="shelf-use"><b>${tr('What it changes for us', 'Šta nama menja')}:</b> ${esc(tx(law.forUs))}</p>
      <p class="small"><span class="tag">${esc(verifiedLabel(law.verified))}</span> <a href="${esc(law.url)}" target="_blank" rel="noopener">${tr('Open the source', 'Otvori izvor')} ↗</a></p>
    </article>`).join('')}</div></section>`;
}

function gapSection() {
  return `<section class="idea-library" aria-labelledby="gap-title">
    <div class="section-heading"><div><p class="eyebrow">${tr('Missing', 'Nedostaje')}</p><h2 id="gap-title">${tr('What this page does not have.', 'Šta ova strana nema.')}</h2></div><p class="tag">${AGE_GAPS.length}</p></div>
    <ol class="open-questions">${AGE_GAPS.map(item => `<li><h3>${esc(tx(item.gap))}</h3><p class="shelf-use"><b>${tr('Next move', 'Sledeći potez')}:</b> ${esc(tx(item.next))}</p></li>`).join('')}</ol></section>`;
}

function view() {
  return `<div class="page-top"><div><p class="eyebrow">${tr('Reference · design, rules, limits, law', 'Referenca · dizajn, pravila, ograničenja, zakon')}</p>
    <h1>${tr('By age.', 'Po godištima.')}</h1>
    <p class="lede">${tr('Everything in this course that changes when the user’s age changes, on one page: ten bands of development, the limits that attach to each, and the law behind them. Three classes of statement are kept apart — an obligation, a technical limit with its test, and an observation about development — because quoting one as another is the most common mistake in a studio and the easiest to catch.', 'Sve u ovom predmetu što se menja kad se menja uzrast korisnika, na jednoj strani: deset razvojnih razreda, granice koje se vezuju za svaki, i zakon iza njih. Tri klase tvrdnji drže se odvojeno — obaveza, tehnička granica sa svojim ispitivanjem, i zapažanje o razvoju — jer je navođenje jedne kao druge najčešća greška u studiju i najlakša za uhvatiti.')}</p></div>
    <span class="tag">${AGE_BANDS.length} ${tr('bands', 'razreda')} · ${AGE_LIMITS.length} ${tr('limits', 'granica')} · ${AGE_LAWS.length} ${tr('laws', 'zakona')}</span></div>
  ${doctrineSection()}
  ${tableSection()}
  ${lawSection()}
  ${gapSection()}
  <div class="actions"><button type="button" id="download-ages">${tr('Download this as one sheet', 'Preuzmi ovo kao jedan list')}</button></div>`;
}

function markdown() {
  const lines = [`# ${tr('By age — design, rules, limits, law', 'Po godištima — dizajn, pravila, ograničenja, zakon')}`, ''];
  for (const rule of AGE_DOCTRINE) lines.push(`## ${tx(rule.title)}`, '', tx(rule.body), '', `> ${tx(rule.studio)}`, '');
  for (const band of AGE_BANDS) {
    lines.push(`## ${tx(band.label)} (${span(band)})`, '', `- ${tr('Hand and mind', 'Ruka i um')}: ${tx(band.does)}`,
      `- ${tr('Space', 'Prostor')}: ${tx(band.space)}`, `- ${tr('Object', 'Predmet')}: ${tx(band.product)}`,
      `- ${tr('Trap', 'Klopka')}: ${tx(band.trap)}`, '');
    for (const limit of filterLimits({ band: band.id })) {
      lines.push(`  - [${kindLabel(limit.kind)}] **${limit.value}** — ${tx(limit.rule)} (${sourceLabel(limit.source)}, ${verifiedLabel(limit.verified)})`);
    }
    lines.push('');
  }
  for (const gap of AGE_GAPS) lines.push(`- ${tr('MISSING', 'NEDOSTAJE')}: ${tx(gap.gap)} → ${tx(gap.next)}`);
  return lines.join('\n');
}

function bind() {
  $$('.band-toggle').forEach(button => button.addEventListener('click', () => {
    const id = button.dataset.toggle;
    open = open === id ? null : id;
    render();
    $(`[data-toggle="${id}"]`)?.focus();
    announce(open ? tr('Limits shown for ', 'Granice prikazane za ') + tx(bandById(id).label) : tr('Limits hidden.', 'Granice sakrivene.'));
  }));
  for (const [id, key] of [['age-band', 'band'], ['age-kind', 'kind']]) {
    $('#' + id)?.addEventListener('change', event => { filters[key] = event.target.value; render(); $('#' + id)?.focus(); });
  }
  $('#age-search')?.addEventListener('input', event => {
    filters.query = event.target.value;
    const position = event.target.selectionStart;
    render();
    const input = $('#age-search');
    input?.focus();
    input?.setSelectionRange(position, position);
  });
  $('#download-ages')?.addEventListener('click', () => {
    download('po-godistima.md', markdown(), 'text/markdown;charset=utf-8');
    announce(tr('Downloaded.', 'Preuzeto.'));
  });
}

function render() { $('#main').innerHTML = view(); bind(); }
mount({ view: 'ages', render, title: () => tr('By age', 'Po godištima') });
