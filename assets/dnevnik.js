// The journal page: the same renderer the static baseline uses, fed by the manifest of
// registers (data/dnevnik.json). The journal owns no record — it joins the ones that do.
import { mount, loadJSON, $, $$, tr, lang } from './core.js';
import './kolaz.js';
import { buildJournal, renderDnevnik } from './dnevnik-core.js';

let journalData = null, loading = null, renderedDynamic = false;
// A link to one record (dnevnik.html#dnevnik-28-24) opens that record.
const openFromHash = () => {
  const target = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (target && target.tagName === 'DETAILS') { target.open = true; target.scrollIntoView({ block: 'start' }); }
};
addEventListener('hashchange', openFromHash);

function ensureJournal() {
  if (loading) return loading;
  loading = loadJSON('data/dnevnik.json').then(async manifest => {
    const read = entry => loadJSON(entry.file).then(value => Object.assign(value, entry)).catch(() => null);
    const [listsRaw, visitsRaw, prototypes] = await Promise.all([
      Promise.all(manifest.lists.map(read)),
      Promise.all(manifest.visits.map(read)),
      loadJSON('data/prototipovi-javno.json')
    ]);
    const lists = listsRaw.filter(Boolean);
    const visits = visitsRaw.filter(Boolean);
    if (lists.length < manifest.lists.length || visits.length < manifest.visits.length) return;
    journalData = { people: buildJournal({ lists, visits, prototypes }), weeks: manifest.weeks };
    if (lang !== 'sr' || renderedDynamic || !$('#dnevnik-content')?.children.length) render();
  }).catch(error => {
    console.warn('Journal could not be refreshed:', error.message);
  });
  return loading;
}

function render() {
  const host = $('#dnevnik-content');
  if (!journalData) {
    if (lang !== 'sr' || !host?.children.length) ensureJournal();
    openFromHash();
    return;
  }
  const query = $('#dnevnik-trazi')?.value || '';
  const openIds = new Set($$('details[open]', host).map(d => d.id).filter(Boolean));
  renderedDynamic = true;
  host.innerHTML = renderDnevnik(journalData.people, { weeks: journalData.weeks });
  for (const id of openIds) { const el = document.getElementById(id); if (el) el.open = true; }
  if (query) {
    const input = $('#dnevnik-trazi');
    if (input) { input.value = query; input.dispatchEvent(new Event('input', { bubbles: true })); }
  }
  openFromHash();
}

mount({ view: 'journal', render, title: () => tr('Journal', 'Dnevnik') });
