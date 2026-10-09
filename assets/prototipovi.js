import { mount, loadJSON, $, tr } from './core.js';
import { renderPrototypes } from './prototipovi-core.js';
let data = null;
function render() { if (data) $('#prototype-content').innerHTML = renderPrototypes(data); }
mount({ view: 'prototypes', render, title: () => tr('Works and examples', 'Radovi i primeri') });
loadJSON('data/prototipovi.json').then(value => { const html = renderPrototypes(value); data = value; $('#prototype-content').innerHTML = html; }).catch(error => {
  // Keep the last generated, complete Serbian record when the live fetch fails.
  console.warn('Prototype register could not be refreshed:', error.message);
});
