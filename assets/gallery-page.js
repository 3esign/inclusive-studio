import { $, mount, loadJSON, tx } from './core.js';
import { galleryDetail } from './galleries.js';
let data;
const id = document.body.dataset.gallery;
function render() { if (data) $('#main').innerHTML = galleryDetail(data, id); }
mount({ view: 'prototypes', render, title: () => data ? tx(data.galleries.find(g => g.id === id).title) : document.title.split(' — ')[0] });
loadJSON('data/prototipovi-javno.json').then(value => { data = value; render(); }).catch(console.warn);
