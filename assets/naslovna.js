import { $, mount, loadJSON, tr, lang } from './core.js';
import { validateTok } from './tok-core.js';
import { validatePrototypes } from './prototipovi-core.js';
import { renderCover } from './cover-core.js';
let tok, data, loading = null, renderedDynamic = false;
function ensureCover() {
  if (loading) return loading;
  loading = Promise.all([loadJSON('data/tok.json'), loadJSON('data/prototipovi-javno.json')]).then(([t, d]) => {
    const errors = [...validateTok(t), ...validatePrototypes(d)];
    if (errors.length) throw Error(errors.join('\n'));
    tok = t; data = d;
    if (lang !== 'sr' || renderedDynamic || !$('.cover-stage')) render();
  }).catch(console.warn);
  return loading;
}
function render() {
  if (!tok || !data) {
    if (lang !== 'sr' || !$('.cover-stage')) ensureCover();
    return;
  }
  renderedDynamic = true;
  $('#main').innerHTML = renderCover(tok, data);
}
mount({ view: 'cover', render, title: () => tr('Cover', 'Naslovna') });
