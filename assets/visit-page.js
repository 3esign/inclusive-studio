// A visit dossier page: the page names its own visit register, so a new visit is a new
// register plus a shell — this module is never copied per visit.
import { mount, loadJSON, $, tr, lang } from './core.js';
import { renderVisitDossier } from './visit-dossier.js';

const holder = document.querySelector('[data-visit]');
const registar = holder?.dataset.visit;
const stampedWeek = $('#visit-dossier .eyebrow')?.textContent.match(/\b(\d+)\b/)?.[1] || '';
let visit = null, prototypes = null, loading = null, renderedDynamic = false;

function ensureVisit() {
  if (loading || !registar) return loading;
  loading = Promise.all([loadJSON(registar), loadJSON('data/prototipovi-javno.json')]).then(([v, p]) => {
    visit = v; prototypes = p;
    if (lang !== 'sr' || renderedDynamic || !$('#visit-dossier')?.children.length) render();
  }).catch(error => {
    // Keep the last generated, complete Serbian record when the live fetch fails.
    console.warn('Visit dossier could not be refreshed:', error.message);
  });
  return loading;
}

function render() {
  const host = $('#visit-dossier');
  if (!visit || !prototypes) {
    if (lang !== 'sr' || !host?.children.length) ensureVisit();
    return;
  }
  renderedDynamic = true;
  host.innerHTML = renderVisitDossier(visit, prototypes);
}

mount({
  view: 'visit',
  render,
  title: () => {
    const w = visit?.week || stampedWeek;
    return w ? tr(`Association visit · week ${w}`, `Poseta udruženju · ${w}. nedelja`) : tr('Association visit', 'Poseta udruženju');
  }
});
