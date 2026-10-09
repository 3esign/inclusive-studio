// The cloud of ideas: everything that still has no week. Ordered by date, each idea carries
// its source; when an idea is pulled into the preparation for the next class, it says so —
// but it keeps no week here. Data: data/tok.json — nothing is retold by hand.

import { $, esc, tr, tx, loadJSON, mount, announce } from './core.js';
import { validateTok } from './tok-core.js';

let tok = null;

function ideaCard(item, pulled) {
  return `<article class="idea-card cloud-card${pulled ? ' is-pulled' : ''}">
    <p class="idea-card-meta"><time>${esc(item.datum)}</time>${pulled ? ` · ${tr('pulled into the next class', 'izvučena u pripremu sledećeg časa')}` : ` · ${tr('waits', 'čeka')}`}</p>
    <h3>${esc(tx(item.naslov))}</h3>
    <p>${esc(tx(item.tekst))}</p>
    <p class="idea-card-meta">${tr('Source', 'Izvor')}: ${esc(item.izvor)}</p>
  </article>`;
}

function view() {
  const order = tok.ideje.slice().sort((a, b) => (a.datum < b.datum ? 1 : a.datum > b.datum ? -1 : 0));
  const pulledIds = new Set(tok.sledeci.map(item => item.izIdeje).filter(Boolean));
  return `<p class="lede">${tr('Everything that is not held and not next: ideas in development, in order, each with its source and date. An idea gains a week only when it enters the preparation for a class — and then it says so here.', 'Sve što nije održano i nije sledeće: ideje u razvoju, redom, svaka sa izvorom i datumom. Ideja dobija nedelju tek kad uđe u pripremu časa — i tada to ovde piše.')}</p>
  <div class="idea-grid cloud-grid">${order.map(item => ideaCard(item, pulledIds.has(item.id))).join('')}</div>
  <p class="help">${tr('The cloud lives in data/tok.json. When an idea becomes a class, it moves to the next-class page — and after the class is held, to the held classes.', 'Oblak živi u data/tok.json. Kad ideja postane čas, prelazi na stranu sledećeg časa — a posle održanog časa, na održane časove.')} <a href="sledeci.html">${tr('Next class', 'Sledeći čas')} →</a> · <a href="index.html">${tr('Held classes', 'Održani časovi')} →</a></p>`;
}

async function load() {
  try {
    const data = await loadJSON('data/tok.json');
    const problems = validateTok(data);
    if (problems.length) throw new Error(problems[0]);
    tok = data;
    announce(tr('The cloud of ideas is loaded.', 'Oblak ideja je učitan.'));
  } catch (error) {
    announce(tr('The cloud could not be fetched — the ideas on this page stay as written.', 'Oblak nije mogao da se dohvati — ideje na ovoj strani ostaju kako su upisane.'));
    console.warn(error);
  }
  const host = $('#cloud-view');
  if (tok && host) host.innerHTML = view();
}

mount({ view: 'cloud', render: () => {}, title: () => tr('Cloud of ideas', 'Oblak ideja') });
load();
