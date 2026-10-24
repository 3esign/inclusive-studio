// The journal page: the same renderer the static baseline uses, fed by the manifest of
// registers (data/dnevnik.json). The journal owns no record — it joins the ones that do.
import { mount, loadJSON, $, tr } from './core.js';
import { buildJournal, renderDnevnik } from './dnevnik-core.js';

let html = null;
function render() { if (html) $('#dnevnik-content').innerHTML = html; }
mount({ view: 'journal', render, title: () => tr('Journal', 'Dnevnik') });

loadJSON('data/dnevnik.json').then(async manifest => {
  // A register that is not served (an older class list stays out of publication) simply
  // does not join: the stamped baseline already carries it, and a 404 must not blank the
  // whole journal.
  const read = async entry => loadJSON(entry.file).then(value => Object.assign(value, entry)).catch(() => null);
  const lists = (await Promise.all(manifest.lists.map(read))).filter(Boolean);
  const visits = (await Promise.all(manifest.visits.map(read))).filter(Boolean);
  if (lists.length < manifest.lists.length || visits.length < manifest.visits.length) return;
  const prototypes = await loadJSON('data/prototipovi-javno.json');
  html = renderDnevnik(buildJournal({ lists, visits, prototypes }), { weeks: manifest.weeks });
  render();
}).catch(error => {
  // Keep the last generated, complete Serbian record when the live fetch fails.
  console.warn('Journal could not be refreshed:', error.message);
});
