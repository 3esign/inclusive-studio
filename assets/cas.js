import { $, mount, loadJSON, tr } from './core.js';
import { gallerySection } from './galleries.js';
import { renderVisitRecord } from './poseta-core.js';
let data, visit; function render(){if(data && visit) $('#class-galleries').innerHTML='<h1>'+tr('Third class','Treći čas')+'</h1><p><a href="#poseta-w03">'+tr('Visit to the association','Poseta udruženju')+' ↓</a></p>'+gallerySection(data,3)+renderVisitRecord(visit);}
mount({view:'prototypes',render,title:()=>tr('Third class','Treći čas')});
Promise.all([loadJSON('data/prototipovi-javno.json'),loadJSON('data/poseta-w03.json')]).then(([d,v])=>{data=d;visit=v;render();}).catch(console.warn);
