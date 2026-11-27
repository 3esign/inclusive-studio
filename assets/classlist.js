// A class-list page: one class register and the work register's first wave, rendered by
// the same code that stamps the static baseline. Names never live in source.
// 23.10.2026: the page names its own register in data-classlist, so a new class is a new
// register plus a shell — this module is never copied per class.
import { mount, loadJSON, $, $$, tr, lang } from './core.js';
import './kolaz.js';
import { renderCas03 } from './cas03-core.js';

const holder = document.querySelector('[data-classlist]');
const registar = holder?.dataset.classlist || 'data/cas-03/spisak.json';
const naslov = { sr: holder?.dataset.classlistTitleSr || 'Spisak radova trećeg časa', en: holder?.dataset.classlistTitleEn || 'The third-class list' };

let spisak = null, prototypes = null, poseta = null, kolaz = null, loading = null, renderedDynamic = false;

function ensureLoaded() {
  if (loading) return loading;
  loading = loadJSON(registar).then(async s => {
    const [p, pos, kol] = await Promise.all([
      s.kolazRegistar ? Promise.resolve({ galleries: [], cekaju: [] }) : loadJSON('data/prototipovi-javno.json'),
      s.posetaRegistar ? loadJSON(s.posetaRegistar).catch(() => null) : Promise.resolve(null),
      s.kolazRegistar ? loadJSON(s.kolazRegistar) : Promise.resolve(null)
    ]);
    spisak = s; prototypes = p; poseta = pos; kolaz = kol;
    if (lang !== 'sr' || renderedDynamic || !$('#cas03-content')?.children.length) render();
  }).catch(error => {
    console.warn('Class list could not be refreshed:', error.message);
  });
  return loading;
}

function render() {
  const host = $('#cas03-content');
  if (!spisak || !prototypes) {
    if (lang !== 'sr' || !host?.children.length) ensureLoaded();
    return;
  }
  const filters = new Map($$('input[data-filter]', host).filter(i => i.value).map(i => [i.id, i.value]));
  renderedDynamic = true;
  host.innerHTML = renderCas03(spisak, prototypes, poseta, kolaz);
  for (const [id, val] of filters) {
    const input = document.getElementById(id);
    if (input) { input.value = val; input.dispatchEvent(new Event('input', { bubbles: true })); }
  }
}

mount({ view: 'classlist', render, title: () => tr(naslov.en, naslov.sr) });
