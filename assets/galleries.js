import { esc, tx, tr, plural } from './core.js';

// Broj kadrova uz naziv rada ide kroz množinu: „4 slike”, ne „4 slika”.
const slike = n => tr(`${n} image${n === 1 ? '' : 's'}`, plural(n, 'slika', 'slike', 'slika'));

export const galleryHref = g => `galerija-${g.id}.html`;

// 08.11.2026, professor: from the sixth class on every student keeps two dossiers — the toy
// prototype carried from the earlier weeks, and the textile-recycling exercise opened in
// class six. A work names its dossier; works from before the split carry none and stand as
// they always did. The class page, the work page and the journal all read the same field.
export const DOSIJEI = ['igracka', 'tekstil'];
export const dosijeLabel = d => d === 'tekstil' ? tr('Textile recycling', 'Reciklaža tekstila') : d === 'igracka' ? tr('Toy prototype', 'Prototip igračke') : '';
export const dosijeTag = work => work && work.dosije ? `<span class="work-dosije" data-dosije="${esc(work.dosije)}">${dosijeLabel(work.dosije)}</span>` : '';

// A work is named the way the professor supplied it: student number, full name, then the
// prototype's own title. A missing title stays visibly missing; it is never invented.
export function authorLine(author) {
  if (!author || !author.name) return '';
  return author.studentNumber ? `${author.studentNumber} — ${author.name}` : author.name;
}
// The identity travels in its own marked element so the privacy scan can tell an authorized
// attribution from a name that leaked into ordinary prose. Same fields, same order, everywhere.
export function authorMarkup(work, cls, tag = 'small') {
  const a = work.author || {};
  const number = a.studentNumber ? `<span data-author-number>${esc(a.studentNumber)}</span>` : '';
  return `<${tag} class="${cls}" data-prototype-attribution="${esc(work.id)}"><span data-author-name>${esc(a.name)}</span>${number}</${tag}>`;
}
const coverPhoto = g => g.photos[0];

// 24.10.2026: a work page shows the work in the users' hands, not only on the class
// table. The frames come from the visit registers, which name the work on the frame —
// the page never guesses which picture belongs to which work.
function association(work, visits) {
  const blocks = visits.map(visit => {
    const frames = (visit.photos || []).filter(p => (p.radovi || []).includes(work.id));
    if (!frames.length) return '';
    const finding = (visit.findings || []).find(f => f.work === work.id);
    const date = String(visit.occurredOn).split('-').reverse().join('.');
    const figures = frames.map(p => `<figure><a href="${esc(p.src)}" aria-label="${tr('Open image', 'Otvori sliku')}"><img src="${esc(p.src)}" width="${p.width}" height="${p.height}" alt="${esc(tx(p.alt))}" loading="lazy" decoding="async"></a><figcaption>${esc(tx(p.caption))}</figcaption></figure>`).join('');
    const read = finding ? `<div class="visit-reading"><h3>${esc(tx(finding.title))}</h3><p><span class="visit-label">${tr('Seen', 'Viđeno')}</span>${esc(tx(finding.seen))}</p><p><span class="visit-label">${tr('Next trial', 'Sledeća proba')}</span>${esc(tx(finding.next))}</p></div>` : '';
    const page = visit.page || 'poseta.html';
    return `<section class="work-week work-association"><h2>${tr('In the users’ hands', 'U rukama korisnika')} · ${esc(date)}.</h2><p class="lede">${frames.length} ${frames.length === 1 ? tr('frame', 'kadar') : tr('frames', 'kadrova')} ${tr('from the association visit', 'sa posete udruženju')} · <a href="${esc(page)}#poseta-${esc(work.id)}">${tr('the whole visit', 'cela poseta')} ↗</a></p>${read}<div class="gallery-detail">${figures}</div></section>`;
  }).filter(Boolean);
  return blocks.join('');
}

// Everything the same hand handed in: one student, every week, in one place.
function sameHand(data, work) {
  const key = value => String(value || '').trim().toLowerCase();
  const mine = item => key(item.author?.studentNumber) === key(work.author?.studentNumber) && key(item.author?.name) === key(work.author?.name);
  const others = (data.galleries || []).filter(g => g.id !== work.id && mine(g)).sort((a, b) => b.documentedWeek - a.documentedWeek);
  const awaited = (data.cekaju || []).filter(mine);
  if (!others.length && !awaited.length) return '';
  // The other dossier of the same class stands first: one student, two dossiers, side by side.
  const sibling = g => g.documentedWeek === work.documentedWeek && g.dosije && work.dosije && g.dosije !== work.dosije ? ` · ${tr('the other dossier of this class', 'drugi dosije ovog časa')}` : '';
  const rows = others.map(g => `<li><a href="${galleryHref(g)}"><b>${esc(tx(g.title))}</b></a> ${dosijeTag(g)}<small>${tr('week', 'nedelja')} ${g.documentedWeek} · ${slike(g.photos.length)}${sibling(g)}</small></li>`).join('')
    + awaited.map(w => `<li><b>${esc(tx(w.title))}</b> ${dosijeTag(w)}<small>${tr('week', 'nedelja')} ${w.documentedWeek} · ${tr('photographs still to come', 'fotografije tek stižu')}</small></li>`).join('');
  return `<section class="work-week work-samehand"><h2>${tr('The same hand, other weeks', 'Ista ruka, ostale nedelje')}</h2><ul class="work-trail">${rows}</ul><p class="note"><a href="dnevnik.html">${tr('The whole record of this student in the journal', 'Ceo zapis ovog studenta u dnevniku')} ↗</a></p></section>`;
}

export function galleryTiles(galleries, limit = Infinity) {
  return `<div class="work-gallery-grid">${galleries.slice(0, limit).map(g => {
    const p = coverPhoto(g);
    return `<a class="work-gallery-tile" href="${galleryHref(g)}"><img src="${esc(p.src)}" width="${p.width}" height="${p.height}" alt="${esc(tx(p.alt))}" loading="lazy" decoding="async"><span><b>${esc(tx(g.title))}</b>${authorMarkup(g, 'work-author')}${dosijeTag(g)}<small>${slike(g.photos.length)} ↗</small></span></a>`;
  }).join('')}</div>`;
}

// Works that are on the list but whose photographs have not arrived. They are named so a
// reader can see the class whole, and marked so no one mistakes absence for a missing work.
export function awaitedList(data, week) {
  const waiting = (data.cekaju || []).filter(w => w.documentedWeek === week);
  if (!waiting.length) return '';
  return `<div class="work-awaited"><h3>${tr('On the list, photographs still to come', 'Na spisku, fotografije tek stižu')}</h3><ul>${waiting.map(w => `<li><b>${esc(tx(w.title))}</b> ${authorMarkup(w, 'work-author')}${dosijeTag(w)}</li>`).join('')}</ul><p class="note">${tr('These names stand on the class list without a photographed work.', 'Ova imena stoje na spisku časa bez fotografisanog rada.')}</p></div>`;
}

export function gallerySection(data, week = null) {
  if (week === null) return [...new Set((data.galleries || []).map(g => g.documentedWeek))].sort((a, b) => b - a).map(n => gallerySection(data, n)).join('');
  const groups = (data.galleries || []).filter(g => g.documentedWeek === week);
  if (!groups.length) return '';
  // A week with two dossiers shows them as two shelves, toy first, so a student finds each
  // of their works under its own heading rather than mixed in one grid.
  const dossiers = DOSIJEI.filter(d => groups.some(g => g.dosije === d));
  const tiles = dossiers.length > 1
    ? dossiers.map(d => { const mine = groups.filter(g => g.dosije === d); return `<div class="work-dosije-shelf" data-dosije="${d}"><h3>${dosijeLabel(d)} <small>${mine.length} ${mine.length === 1 ? tr('work', 'rad') : mine.length < 5 ? tr('works', 'rada') : tr('works', 'radova')}</small></h3>${galleryTiles(mine)}</div>`; }).join('')
    : galleryTiles(groups);
  const intro = dossiers.length > 1
    ? tr('From this class every student keeps two dossiers: the toy prototype and the textile-recycling exercise. Open a work to see every view the student handed in.', 'Od ovog časa svaki student vodi dva dosijea: prototip igračke i reciklažu tekstila. Otvori rad i pogledaj sve što je student predao.')
    : tr('Open a work to see every view the student handed in.', 'Otvori rad i pogledaj sve što je student predao.');
  return `<section class="work-galleries" id="galerije-w${String(week).padStart(2, '0')}"><header class="work-gallery-heading"><div><p class="eyebrow">${tr('Class', 'Čas')} ${week}</p><h2>${tr('From sketch to object.', 'Od skice do predmeta.')}</h2></div><p>${intro}</p></header>${tiles}${awaitedList(data, week)}</section>`;
}

function photoGrid(photos) {
  return `<div class="gallery-detail">${photos.map((p, i) => `<figure><a href="${esc(p.src)}" aria-label="${tr('Open image', 'Otvori sliku')} ${i + 1}"><img src="${esc(p.src)}" width="${p.width}" height="${p.height}" alt="${esc(tx(p.alt))}" loading="${i ? 'lazy' : 'eager'}" decoding="async"></a><figcaption>${esc(tx(p.caption))}</figcaption></figure>`).join('')}</div>`;
}

// The work page: everything one student handed in for one prototype, newest class first,
// then the earlier weeks it grew out of. Each week keeps its own date and its own source.
export function galleryDetail(data, id, visits = []) {
  const g = (data.galleries || []).find(g => g.id === id);
  if (!g) throw Error('Unknown gallery: ' + id);
  const anchor = 'galerije-w' + String(g.documentedWeek).padStart(2, '0');
  const groups = data.galleries, next = groups[(groups.indexOf(g) + 1) % groups.length];
  const earlier = g.continues ? (data.items || []).find(it => it.id === g.continues) : null;
  const earlierTrials = earlier ? (data.observations || []).filter(o => o.prototypeId === earlier.id) : [];

  const head = `<p class="eyebrow"><a href="prototipovi.html#${anchor}">${tr('Works and examples', 'Radovi i primeri')}</a> / ${tr('Class', 'Čas')} ${g.documentedWeek}${g.dosije ? ` / ${dosijeLabel(g.dosije)}` : ''}</p><h1>${esc(tx(g.title))}</h1>${authorMarkup(g, 'work-identity', 'p')}${g.dosije ? `<p class="work-dosije-line">${tr('Dossier', 'Dosije')}: ${dosijeTag(g)}</p>` : ''}`;
  const thisWeek = `<section class="work-week"><h2>${tr('Class', 'Čas')} ${g.documentedWeek}</h2><p class="lede">${tr(`${g.photos.length} view${g.photos.length === 1 ? '' : 's'} of the work`, plural(g.photos.length, 'prikaz', 'prikaza', 'prikaza') + ' rada')} · <a href="index.html?w=${g.documentedWeek}">${tr('Class material', 'Gradivo časa')}</a></p>${photoGrid(g.photos)}</section>`;

  const trial = g.probanje ? `<section class="work-week work-trial"><h2>${tr('Tried by users', 'Probali korisnici')} · ${esc(g.probanje.occurredOn.split('-').reverse().join('.'))}.</h2><p class="lede">${esc(tx(g.probanje.sta))}</p><p class="note"><a href="cas-03.html#poseta-w03">${tr('Photographs from the third-class visit', 'Fotografije posete sa trećeg časa')} ↗</a></p></section>` : '';
  let history = '';
  if (earlier) {
    history += `<section class="work-week"><h2>${tr('Class', 'Čas')} ${earlier.documentedWeek}</h2><p class="lede">${esc(tx(earlier.description))}</p>${photoGrid(earlier.photos)}</section>`;
    for (const o of earlierTrials) history += `<section class="work-week"><h2>${tr('Tried at the association', 'Isprobano u udruženju')} · ${esc(o.occurredOn.split('-').reverse().join('.'))}.</h2><p class="lede">${esc(tx(o.summary))}</p>${photoGrid(o.photos)}</section>`;
  }

  return `${head}${thisWeek}${association(g, visits)}${trial}${history}${sameHand(data, g)}<nav class="gallery-onward"><a class="button secondary" href="prototipovi.html#${anchor}">← ${tr('All works', 'Svi radovi')}</a><a class="button" href="${galleryHref(next)}">${esc(tx(next.title))} →</a></nav>`;
}
