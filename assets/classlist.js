// The third-class list page: one class register and the work register's first wave,
// rendered by the same code that stamps the static baseline. Names never live in source.
import { mount, loadJSON, $, tr } from './core.js';
import { renderCas03 } from './cas03-core.js';

let spisak = null, prototypes = null;
function render() { if (spisak && prototypes) $('#cas03-content').innerHTML = renderCas03(spisak, prototypes); }
mount({ view: 'classlist', render, title: () => tr('The third-class list', 'Spisak radova trećeg časa') });
Promise.all([loadJSON('data/cas-03/spisak.json'), loadJSON('data/prototipovi-javno.json')]).then(([s, p]) => {
  spisak = s; prototypes = p; render();
}).catch(error => {
  // Keep the last generated, complete Serbian record when the live fetch fails.
  console.warn('Class list could not be refreshed:', error.message);
});
