// A visit dossier page: the page names its own visit register, so a new visit is a new
// register plus a shell — this module is never copied per visit.
import { mount, loadJSON, $, tr } from './core.js';
import { renderVisitDossier } from './visit-dossier.js';

const holder = document.querySelector('[data-visit]');
const registar = holder?.dataset.visit;
let visit = null, prototypes = null;
function render() { if (visit && prototypes) $('#visit-dossier').innerHTML = renderVisitDossier(visit, prototypes); }
mount({ view: 'visit', render, title: () => tr('Association visit', 'Poseta udruženju') });

Promise.all([loadJSON(registar), loadJSON('data/prototipovi-javno.json')]).then(([v, p]) => {
  visit = v; prototypes = p; render();
}).catch(error => {
  // Keep the last generated, complete Serbian record when the live fetch fails.
  console.warn('Visit dossier could not be refreshed:', error.message);
});
