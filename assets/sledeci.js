import { $, tr, lang, loadJSON, mount, announce } from './core.js';
import { weekFile } from './material.js';
import { resolveRefs } from './blocks.js';
import { nextClassEntry, renderNextClass } from './next-class.js';

let data = null, loading = null, renderedDynamic = false;
async function load() {
  try {
    const [tok, prototypes] = await Promise.all([loadJSON('data/tok.json'), loadJSON('data/prototipovi-javno.json')]);
    const entry = nextClassEntry(tok);
    const week = entry ? await loadJSON(weekFile(entry.nedelja)) : null;
    const refs = await resolveRefs(week?.blocks || []);
    const next = { tok, week, prototypes, refs };
    renderNextClass(next); // validate before replacing the static baseline
    data = next;
    if (lang !== 'sr' || renderedDynamic || !$('.next-intro')) render();
    announce(tr('The preparation for the next class is loaded.', 'Priprema sledećeg časa je učitana.'));
  } catch (error) {
    announce(tr('The preparation could not be fetched — the sections on this page stay as written.', 'Priprema nije mogla da se dohvati — odeljci na ovoj strani ostaju kako su upisani.'));
    console.warn(error);
  }
}
function ensureNext() { if (!loading) loading = load(); return loading; }
function render() {
  if (!data) {
    if (lang !== 'sr' || !$('.next-intro')) ensureNext();
    return;
  }
  renderedDynamic = true;
  if ($('#main')) $('#main').innerHTML = renderNextClass(data);
}
mount({ view: 'next', render, title: () => tr('Next class', 'Sledeći čas') });
