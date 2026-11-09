import { $, mount, loadJSON, tr } from './core.js';
import { validateTok } from './tok-core.js';
import { validatePrototypes } from './prototipovi-core.js';
import { renderCover } from './cover-core.js';
let tok, data;
function render() { if (tok && data) $('#main').innerHTML = renderCover(tok, data); }
mount({view:'cover', render, title:() => tr('Cover', 'Naslovna')});
Promise.all([loadJSON('data/tok.json'),loadJSON('data/prototipovi-javno.json')]).then(([t,d])=>{
  const errors=[...validateTok(t),...validatePrototypes(d)];
  if(errors.length) throw Error(errors.join('\n'));
  tok=t; data=d; render();
}).catch(console.warn);
