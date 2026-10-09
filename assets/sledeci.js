import { $, tr, loadJSON, mount, announce } from './core.js';
import { weekFile } from './material.js';
import { resolveRefs } from './blocks.js';
import { nextClassEntry, renderNextClass } from './next-class.js';

let data = null;
async function load() {
  try {
    const [tok, prototypes] = await Promise.all([loadJSON('data/tok.json'), loadJSON('data/prototipovi.json')]);
    const entry = nextClassEntry(tok);
    const week = entry ? await loadJSON(weekFile(entry.nedelja)) : null;
    const refs = await resolveRefs(week?.blocks || []);
    const next = { tok, week, prototypes, refs };
    const html = renderNextClass(next); // validate before replacing the static baseline
    data = next;
    if ($('#main')) $('#main').innerHTML = html;
    announce(tr('The preparation for the next class is loaded.', 'Priprema sledećeg časa je učitana.'));
  } catch (error) {
    announce(tr('The preparation could not be fetched — the sections on this page stay as written.', 'Priprema nije mogla da se dohvati — odeljci na ovoj strani ostaju kako su upisani.'));
    console.warn(error);
  }
}
mount({ view: 'next', render: () => { if (data && $('#main')) $('#main').innerHTML = renderNextClass(data); }, title: () => tr('Next class', 'Sledeći čas') });
load();
