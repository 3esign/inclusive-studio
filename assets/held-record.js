// The same reading order and source images serve the static page and the live view.
// These are photographs in the lesson material, not evidence of an unrecorded class.
import { esc, tr, tx, number, plural } from './core.js';
import { exercises } from './exercises.js';
import { renderVisitLead, renderVisitRecord, validateVisit } from './poseta-core.js';
import { prototypeTeaser, validatePrototypes } from './prototipovi-core.js';
import { validateKolaz } from './cas03-core.js';

export function lessonImages(week) {
  return (week?.blocks || []).filter(b => b.kind === 'image' && typeof b.src === 'string'
    && /^(?:data|assets)\/[a-z0-9_./-]+\.(?:jpe?g|png|webp|avif|svg)$/i.test(b.src)
    && !b.src.split('/').includes('..'));
}

function photo(block, i, eager) {
  const dims = Number.isInteger(block.width) && block.width > 0 && Number.isInteger(block.height) && block.height > 0 ? ` width="${block.width}" height="${block.height}"` : '';
  return `<figure class="lesson-photo${i ? ' lesson-photo-detail' : ''}">
    <a href="${esc(block.src)}" aria-label="${tr('Open photograph', 'Otvori fotografiju')} ${i + 1}">
      <img src="${esc(block.src)}"${dims} alt="${esc(tx(block.alt))}" ${eager ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'} decoding="async">
    </a><figcaption><span aria-hidden="true">${number(i + 1)}</span><span>${esc(tx(block.caption))}</span></figcaption>
  </figure>`;
}

export function renderHeldKolaz(kolaz, { first = false } = {}) {
  if (!kolaz || validateKolaz(kolaz).length) return '';
  const all = kolaz.celine || [];
  const byRb = new Map(all.map(c => [c.rb, c]));
  const picks = Array.isArray(kolaz.izbor) && kolaz.izbor.length
    ? kolaz.izbor.map(rb => byRb.get(rb)).filter(Boolean)
    : all.filter((_, i) => i % Math.max(1, Math.floor(all.length / 12)) === 0).slice(0, 12);
  if (!picks.length) return '';
  const total = all.reduce((n, c) => n + c.photos.length, 0);
  const pieces = all.length;
  const strana = kolaz.strana || `cas-${number(kolaz.nedelja || 7)}.html`;
  const wid = `kolaz-w${number(kolaz.nedelja || 7)}`;
  const cards = picks.map((c, idx) => {
    const [lead, ...rest] = c.photos;
    const extra = (p, k) => `<a href="${esc(p.src)}" data-kolaz-photo data-alt="${esc(tx(p.alt))}">${k + 2}</a>`;
    const loadAttr = first && idx === 0 ? 'loading="eager" fetchpriority="high"' : idx < 6 ? 'loading="eager"' : 'loading="lazy"';
    return `<li class="kolaz-card" data-celina="${c.rb}"><a class="kolaz-open" href="${esc(lead.src)}" data-kolaz-photo data-alt="${esc(tx(lead.alt))}"><img src="${esc(lead.src)}" width="${lead.width}" height="${lead.height}" alt="${esc(tx(lead.alt))}" ${loadAttr} decoding="async"><b class="kolaz-n">${number(c.rb)}</b>${rest.length ? `<span class="kolaz-count" aria-hidden="true">${c.photos.length}</span>` : ''}</a><p class="kolaz-title"><a href="${esc(strana)}#celina-${c.rb}" data-kolaz-title>${esc(tx(c.naslov))}</a> <time>${esc(c.vreme)}</time></p>${rest.length ? `<p class="kolaz-more"><span>${tr('Other views', 'Ostali prikazi')}: </span>${rest.map(extra).join(' ')}</p>` : ''}</li>`;
  }).join('');
  return `<section class="held-kolaz" id="${wid}" aria-labelledby="${wid}-title"><header class="held-kolaz-head"><div><p class="eyebrow">${tr('Class', 'Čas')} ${kolaz.nedelja} · ${tr(`${picks.length} of ${pieces} works · ${total} photographs`, `izbor ${picks.length} od ${plural(pieces, 'rada', 'rada', 'radova')} · ${plural(total, 'fotografija', 'fotografije', 'fotografija')}`)}</p><h4 id="${wid}-title">${tr('From the table of works.', 'Sa stola sa radovima.')}</h4></div><div class="held-kolaz-actions"><a class="button" href="${esc(strana)}#kolaz">${tr(`Searchable collage (${pieces})`, `Ceo pretraživi kolaž (${pieces})`)} ↗</a><a class="button secondary" href="${esc(strana)}#prisutni">${tr('Attendance & records', 'Spisak i dosijei')} ↗</a></div></header><ol class="kolaz held-kolaz-grid" data-kolaz="${esc(kolaz.id)}">${cards}</ol></section>`;
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
      <div class="lesson-reading">
        ${(item.prilog || []).map((p, i) => `<p class="lesson-prilog${i ? '' : ' lesson-prilog-lead'}"><a href="${esc(p.href)}">${esc(tx(p.text))} ↗</a></p>`).join('')}
        <p class="eyebrow">${tr('Recorded in class', 'Zabeleženo na času')}</p>
        <ul class="lesson-results">${item.rezultati.map(r => `<li>${esc(tx(r.sta))}</li>`).join('')}</ul>
      </div>
    </div>
  </article>`.replace(/[ \t]+\r?\n/g, '\n');
}

export function heldIntro() {
  return `<div class="page-top flow-intro"><div><p class="eyebrow">${tr('Principles of universal design', 'Principi univerzalnog dizajna')}</p>
    <h1>${tr('Held in class.', 'Održano na času.')}</h1></div>
    <p class="lede">${tr('Lesson material, photographs and recorded outcomes.', 'Gradivo, fotografije i zabeleženi ishodi održanih časova.')}</p></div>`;
}

// Professor, 21.10.2026: newest held class first; each attachment stays with its own class.
// Professor, 24.10.2026: the attachments open the record — a reader reaches the visit and the
// class list before the summary, not after it.
export function heldSection(tok, weeks, extras = {}) {
  const items = [...tok.odrzano].sort((a, b) => String(b.odrzan).localeCompare(String(a.odrzan)));
  const visit = extras.visit && !validateVisit(extras.visit).length ? extras.visit : null;
  const prototypes = extras.prototypes && !validatePrototypes(extras.prototypes).length ? extras.prototypes : null;
  const collages = (extras.collages || []).filter(k => k && !validateKolaz(k).length);
  const record = (item, i) => {
    const w = weeks.get(item.nedelja);
    const parts = [heldRecord(item, w, { first: i === 0 })];
    for (const kolaz of collages) if (kolaz.nedelja === item.nedelja) parts.push(renderHeldKolaz(kolaz, { first: i === 0 && !lessonImages(w).length }));
    if (visit && visit.week === item.nedelja) parts.push(renderVisitLead(visit, prototypes));
    for (const extra of extras.visits || []) if (extra.week === item.nedelja) parts.push(renderVisitRecord(extra, { compact: true }));
    if (prototypes) parts.push(prototypeTeaser(prototypes, item.nedelja));
    return parts.filter(Boolean).join('\n');
  };
  return `<section id="odrzano" aria-labelledby="odrzano-title"><h2 id="odrzano-title" class="sr-only">${tr('Held classes and their material', 'Održani časovi i njihovo gradivo')}</h2>
    <div class="held-records">${items.map(record).join('')}</div>
    ${items.length ? '' : `<p class="notice">${tr('No held class has been recorded yet.', 'Još nije upisan nijedan održani čas.')}</p>`}</section>`;
}
