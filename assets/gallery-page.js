import { $, mount, loadJSON, tx } from './core.js';
import { galleryDetail } from './galleries.js';
let data, visits = [];
const id = document.body.dataset.gallery;
function render() { if (data) $('#main').innerHTML = galleryDetail(data, id, visits); }
mount({ view: 'prototypes', render, title: () => data ? tx(data.galleries.find(g => g.id === id).title) : document.title.split(' — ')[0] });
loadJSON('data/prototipovi-javno.json').then(value => { data = value; render(); }).catch(console.warn);
// The visit frames of this work arrive second: the page is complete without them.
loadJSON('data/dnevnik.json')
  .then(manifest => Promise.all(manifest.visits.map(async entry => Object.assign(await loadJSON(entry.file), { page: entry.page }))))
  .then(value => { visits = value; render(); }).catch(console.warn);
