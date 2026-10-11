// The shared renderer of the cloud of ideas: the browser page and the static baseline
// generator print the same markup from data/tok.json, so the no-JS view never retells
// the cloud by hand. Pure rendering only — no DOM, no fetch — like tok-core and held-record.

import { esc, tr, tx } from './core.js';
import { validateTok } from './tok-core.js';

export function cloudCard(item, pulled) {
  return `<article class="idea-card cloud-card${pulled ? ' is-pulled' : ''}">
    <p class="idea-card-meta"><time>${esc(item.datum)}</time>${pulled ? ` · ${tr('pulled into the next class', 'izvučena u pripremu sledećeg časa')}` : ` · ${tr('waits', 'čeka')}`}</p>
    <h3>${esc(tx(item.naslov))}</h3>
    <p>${esc(tx(item.tekst))}</p>
    <p class="idea-card-meta">${tr('Source', 'Izvor')}: ${esc(item.izvor)}</p>
  </article>`;
}

export function cloudView(tok) {
  const problems = validateTok(tok);
  if (problems.length) throw new Error('data/tok.json: ' + problems.join(' | '));
  const order = tok.ideje.slice().sort((a, b) => (a.datum < b.datum ? 1 : a.datum > b.datum ? -1 : 0));
  const pulledIds = new Set(tok.sledeci.map(item => item.izIdeje).filter(Boolean));
  return `<p class="lede">${tr('Everything that is not held and not next: ideas in development, in order, each with its source and date. An idea gains a week only when it enters the preparation for a class — and then it says so here.', 'Sve što nije održano i nije sledeće: ideje u razvoju, redom, svaka sa izvorom i datumom. Ideja dobija nedelju tek kad uđe u pripremu časa — i tada to ovde piše.')}</p>
  <div class="idea-grid cloud-grid">${order.map(item => cloudCard(item, pulledIds.has(item.id))).join('')}</div>
  <p class="help">${tr('The cloud lives in data/tok.json. When an idea becomes a class, it moves to the next-class page — and after the class is held, to the held classes.', 'Oblak živi u data/tok.json. Kad ideja postane čas, prelazi na stranu sledećeg časa — a posle održanog časa, na održane časove.')} <a href="sledeci.html">${tr('Next class', 'Sledeći čas')} →</a> · <a href="index.html">${tr('Held classes', 'Održani časovi')} →</a> · <a href="ideja.html">${tr('Idea atelier', 'Radionica ideja')} →</a></p>`;
}
