import { esc, tx, tr } from './core.js';

export const galleryHref = g => `galerija-${g.id}.html`;
export function galleryTiles(galleries, limit = Infinity) {
  return `<div class="work-gallery-grid">${galleries.slice(0, limit).map(g => {
    const p = g.id === 'castle' ? g.photos[1] : g.photos[0];
    return `<a class="work-gallery-tile" href="${galleryHref(g)}"><img src="${esc(p.src)}" width="${p.width}" height="${p.height}" alt="${esc(tx(p.alt))}" loading="lazy" decoding="async"><span><b>${esc(tx(g.title))}</b><small>${g.photos.length} ${tr('images', 'slika')} ↗</small></span></a>`;
  }).join('')}</div>`;
}
export function gallerySection(data, week = null) {
  if (week === null) return [...new Set((data.galleries || []).map(g => g.documentedWeek))].sort((a,b) => b-a).map(n => gallerySection(data, n)).join('');
  const groups = (data.galleries || []).filter(g => week === null || g.documentedWeek === week);
  if (!groups.length) return '';
  return `<section class="work-galleries" id="galerije-w${String(week).padStart(2,'0')}"><header class="work-gallery-heading"><div><p class="eyebrow">${tr('Class', 'Čas')} ${week}</p><h2>${tr('From sketch to object.', 'Od skice do predmeta.')}</h2></div><p>${tr('Open a work to see its different views.', 'Otvori rad i pogledaj ga iz više uglova.')}</p></header>${galleryTiles(groups)}</section>`;
}
export function galleryDetail(data, id) {
  const g = (data.galleries || []).find(g => g.id === id);
  if (!g) throw Error('Unknown gallery: ' + id);
  const anchor = 'galerije-w' + String(g.documentedWeek).padStart(2,'0');
  const groups = data.galleries, next = groups[(groups.indexOf(g) + 1) % groups.length];
  return `<p class="eyebrow"><a href="prototipovi.html#${anchor}">${tr('Works and examples', 'Radovi i primeri')}</a> / ${tr('Class', 'Čas')} ${g.documentedWeek}</p><h1>${esc(tx(g.title))}</h1><p class="lede">${g.photos.length} ${tr('views of the work', 'prikaza rada')} · <a href="index.html?w=${g.documentedWeek}">${tr('Class material', 'Gradivo časa')}</a></p><div class="gallery-detail">${g.photos.map((p, i) => `<figure><a href="${esc(p.src)}" aria-label="${tr('Open image', 'Otvori sliku')} ${i + 1}"><img src="${esc(p.src)}" width="${p.width}" height="${p.height}" alt="${esc(tx(p.alt))}" loading="${i ? 'lazy' : 'eager'}" decoding="async"></a><figcaption>${i + 1} / ${g.photos.length}</figcaption></figure>`).join('')}</div><nav class="gallery-onward"><a class="button secondary" href="prototipovi.html#${anchor}">← ${tr('All works', 'Svi radovi')}</a><a class="button" href="${galleryHref(next)}">${esc(tx(next.title))} →</a></nav>`;
}
