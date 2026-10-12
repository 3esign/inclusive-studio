// The visit page: one register of the visit and the prototype register's observations,
// rendered by the same code that stamps the static baseline. Names never live in source.
import { mount, loadJSON, $, tr } from './core.js';
import { renderPoseta } from './poseta-core.js';

let visit = null, prototypes = null;
function render() { if (visit && prototypes) $('#visit-content').innerHTML = renderPoseta(visit, prototypes); }
mount({ view: 'visit', render, title: () => tr('The visit', 'Poseta udruženju') });
Promise.all([loadJSON('data/poseta.json'), loadJSON('data/prototipovi.json')]).then(([v, p]) => {
  visit = v; prototypes = p; render();
}).catch(error => {
  // Keep the last generated, complete Serbian record when the live fetch fails.
  console.warn('Visit register could not be refreshed:', error.message);
});
