import { esc, tx, tr } from './core.js';

export const galleryHref = g => `galerija-${g.id}.html`;

// A work is named the way the teacher supplied it: student number, full name, then the
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

export function galleryTiles(galleries, limit = Infinity) {
  return `<div class="work-gallery-grid">${galleries.slice(0, limit).map(g => {
    const p = coverPhoto(g);
    return `<a class="work-gallery-tile" href="${galleryHref(g)}"><img src="${esc(p.src)}" width="${p.width}" height="${p.height}" alt="${esc(tx(p.alt))}" loading="lazy" decoding="async"><span><b>${esc(tx(g.title))}</b>${authorMarkup(g, 'work-author')}<small>${g.photos.length} ${tr('images', 'slika')} ↗</small></span></a>`;
  }).join('')}</div>`;
}

// Works that are on the list but whose photographs have not arrived. They are named so a
// reader can see the class whole, and marked so no one mistakes absence for a missing work.
export function awaitedList(data, week) {
  const waiting = (data.cekaju || []).filter(w => w.documentedWeek === week);
  if (!waiting.length) return '';
  return `<div class="work-awaited"><h3>${tr('On the list, photographs still to come', 'Na spisku, fotografije tek stižu')}</h3><ul>${waiting.map(w => `<li><b>${esc(tx(w.title))}</b> ${authorMarkup(w, 'work-author')}${w.expectedPhotos ? ` <small>${w.expectedPhotos} ${tr('images expected', 'slika se očekuje')}</small>` : ''}</li>`).join('')}</ul><p class="note">${tr('These works were photographed in class; the frames have not reached the site yet.', 'Ovi radovi su slikani na času; kadrovi još nisu stigli do sajta.')}</p></div>`;
}

export function gallerySection(data, week = null) {
  if (week === null) return [...new Set((data.galleries || []).map(g => g.documentedWeek))].sort((a, b) => b - a).map(n => gallerySection(data, n)).join('');
  const groups = (data.galleries || []).filter(g => g.documentedWeek === week);
  if (!groups.length) return '';
  return `<section class="work-galleries" id="galerije-w${String(week).padStart(2, '0')}"><header class="work-gallery-heading"><div><p class="eyebrow">${tr('Class', 'Čas')} ${week}</p><h2>${tr('From sketch to object.', 'Od skice do predmeta.')}</h2></div><p>${tr('Open a work to see every view the student handed in.', 'Otvori rad i pogledaj sve što je student predao.')}</p></header>${galleryTiles(groups)}${awaitedList(data, week)}</section>`;
}

function photoGrid(photos) {
  return `<div class="gallery-detail">${photos.map((p, i) => `<figure><a href="${esc(p.src)}" aria-label="${tr('Open image', 'Otvori sliku')} ${i + 1}"><img src="${esc(p.src)}" width="${p.width}" height="${p.height}" alt="${esc(tx(p.alt))}" loading="${i ? 'lazy' : 'eager'}" decoding="async"></a><figcaption>${esc(tx(p.caption))}</figcaption></figure>`).join('')}</div>`;
}

// The work page: everything one student handed in for one prototype, newest class first,
// then the earlier weeks it grew out of. Each week keeps its own date and its own source.
export function galleryDetail(data, id) {
  const g = (data.galleries || []).find(g => g.id === id);
  if (!g) throw Error('Unknown gallery: ' + id);
  const anchor = 'galerije-w' + String(g.documentedWeek).padStart(2, '0');
  const groups = data.galleries, next = groups[(groups.indexOf(g) + 1) % groups.length];
  const earlier = g.continues ? (data.items || []).find(it => it.id === g.continues) : null;
  const visits = earlier ? (data.observations || []).filter(o => o.prototypeId === earlier.id) : [];

  const head = `<p class="eyebrow"><a href="prototipovi.html#${anchor}">${tr('Works and examples', 'Radovi i primeri')}</a> / ${tr('Class', 'Čas')} ${g.documentedWeek}</p><h1>${esc(tx(g.title))}</h1>${authorMarkup(g, 'work-identity', 'p')}`;
  const thisWeek = `<section class="work-week"><h2>${tr('Class', 'Čas')} ${g.documentedWeek}</h2><p class="lede">${g.photos.length} ${tr('views of the work', 'prikaza rada')} · <a href="index.html?w=${g.documentedWeek}">${tr('Class material', 'Gradivo časa')}</a></p>${photoGrid(g.photos)}</section>`;

  const trial = g.probanje ? `<section class="work-week work-trial"><h2>${tr('Tried by users', 'Probali korisnici')} · ${esc(g.probanje.occurredOn.split('-').reverse().join('.'))}.</h2><p class="lede">${esc(tx(g.probanje.sta))}</p><p class="note">${tr('The photographs of this trial show the people who tried the work and are not published.', 'Fotografije ovog probanja prikazuju ljude koji su rad isprobali i ne objavljuju se.')}</p></section>` : '';
  let history = '';
  if (earlier) {
    history += `<section class="work-week"><h2>${tr('Class', 'Čas')} ${earlier.documentedWeek}</h2><p class="lede">${esc(tx(earlier.description))}</p>${photoGrid(earlier.photos)}</section>`;
    for (const o of visits) history += `<section class="work-week"><h2>${tr('Tried at the association', 'Isprobano u udruženju')} · ${esc(o.occurredOn.split('-').reverse().join('.'))}.</h2><p class="lede">${esc(tx(o.summary))}</p>${photoGrid(o.photos)}</section>`;
  }

  return `${head}${thisWeek}${trial}${history}<nav class="gallery-onward"><a class="button secondary" href="prototipovi.html#${anchor}">← ${tr('All works', 'Svi radovi')}</a><a class="button" href="${galleryHref(next)}">${esc(tx(next.title))} →</a></nav>`;
}
