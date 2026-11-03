// A class-list page: one class register and the work register's first wave, rendered by
// the same code that stamps the static baseline. Names never live in source.
// 23.10.2026: the page names its own register in data-classlist, so a new class is a new
// register plus a shell — this module is never copied per class.
import { mount, loadJSON, $, tr } from './core.js';
import { renderCas03 } from './cas03-core.js';

const holder = document.querySelector('[data-classlist]');
const registar = holder?.dataset.classlist || 'data/cas-03/spisak.json';
const naslov = { sr: holder?.dataset.classlistTitleSr || 'Spisak radova trećeg časa', en: holder?.dataset.classlistTitleEn || 'The third-class list' };

let spisak = null, prototypes = null, poseta = null;
function render() { if (spisak && prototypes) $('#cas03-content').innerHTML = renderCas03(spisak, prototypes, poseta); }
mount({ view: 'classlist', render, title: () => tr(naslov.en, naslov.sr) });
Promise.all([loadJSON(registar), loadJSON('data/prototipovi-javno.json')]).then(async ([s, p]) => {
  spisak = s; prototypes = p;
  // The field part of a class names its own visit register; a missing one is not an error.
  if (s.posetaRegistar) poseta = await loadJSON(s.posetaRegistar).catch(() => null);
  render();
}).catch(error => {
  // Keep the last generated, complete Serbian record when the live fetch fails.
  console.warn('Class list could not be refreshed:', error.message);
});
