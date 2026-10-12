// The same reading order and source images serve the static page and the live view.
// These are photographs in the lesson material, not evidence of an unrecorded class.
import { esc, tr, tx, number } from './core.js';
import { exercises } from './exercises.js';

export function lessonImages(week) {
  return (week?.blocks || []).filter(b => b.kind === 'image' && typeof b.src === 'string'
    && /^(?:data|assets)\/[a-z0-9_./-]+\.(?:jpe?g|png|webp|avif|svg)$/i.test(b.src)
    && !b.src.split('/').includes('..'));
}

function photo(block, i, eager) {
  return `<figure class="lesson-photo${i ? ' lesson-photo-detail' : ''}">
    <a href="${esc(block.src)}" aria-label="${tr('Open photograph', 'Otvori fotografiju')} ${i + 1}">
      <img src="${esc(block.src)}" alt="${esc(tx(block.alt))}" ${eager ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'} decoding="async">
    </a><figcaption><span aria-hidden="true">${number(i + 1)}</span><span>${esc(tx(block.caption))}</span></figcaption>
  </figure>`;
}

export function heldRecord(item, week, { first = false } = {}) {
  const n = Number.isInteger(item.nedelja) && item.nedelja > 0 ? item.nedelja : null;
  const href = n ? `index.html?w=${n}` : null;
  const images = lessonImages(week);
  const date = /^\d{4}-\d{2}-\d{2}$/.test(item.odrzan || '') ? item.odrzan.split('-').reverse().join('.') + '.' : item.odrzan;
  return `<article class="held-record${images.length ? ' has-photos' : ''}">
    <header class="lesson-heading"><div><p class="eyebrow"><span class="lesson-state">${tr('Held', 'Održano')}</span> <time datetime="${esc(item.odrzan)}">${esc(date)}</time>${n ? ` · ${tr('Week', 'Nedelja')} ${n}` : ''}</p>
    <h3>${esc(tx(item.naslov))}</h3></div>${n ? `<span class="lesson-number" aria-hidden="true">${number(n)}</span>` : ''}</header>
    <div class="lesson-spread">
      ${images.length ? `<div class="lesson-gallery${images.length === 3 ? ' count-3' : images.length === 1 ? ' count-1' : ''}" aria-label="${tr('Photographs from the lesson material', 'Fotografije iz gradiva časa')}">${images.map((b, i) => photo(b, i, first && i === 0)).join('')}</div>` : ''}
      <div class="lesson-reading"><p class="eyebrow">${tr('Recorded in class', 'Zabeleženo na času')}</p>
        <ul class="lesson-results">${item.rezultati.map(r => `<li>${esc(tx(r.sta))}</li>`).join('')}</ul>
        <details class="lesson-provenance"><summary>${tr('Records and sources', 'Zapisi i izvori')}</summary>
          <p>${esc(item.izvor)}</p><ol>${item.rezultati.map(r => `<li>${esc(tx(r.sta))}<br><small>${esc(r.izvor)}</small></li>`).join('')}</ol>
        </details>
      </div>
    </div>
  </article>`;
}

export function heldIntro() {
  return `<div class="page-top flow-intro"><div><p class="eyebrow">${tr('Principles of universal design', 'Principi univerzalnog dizajna')}</p>
    <h1>${tr('Held in class.', 'Održano na času.')}</h1></div>
    <p class="lede">${tr('Lesson material, photographs and recorded outcomes.', 'Gradivo, fotografije i zabeleženi ishodi održanih časova.')}</p></div>`;
}

export function heldSection(tok, weeks) {
  const items = [...tok.odrzano].sort((a, b) => String(b.odrzan).localeCompare(String(a.odrzan)));
  return `<section id="odrzano" aria-labelledby="odrzano-title"><h2 id="odrzano-title" class="sr-only">${tr('Held classes and their material', 'Održani časovi i njihovo gradivo')}</h2>
    <div class="held-records">${items.map((item, i) => heldRecord(item, weeks.get(item.nedelja), { first: i === 0 })).join('')}</div>
    ${items.length ? '' : `<p class="notice">${tr('No held class has been recorded yet.', 'Još nije upisan nijedan održani čas.')}</p>`}</section>`;
}
