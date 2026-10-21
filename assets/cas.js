import { $, mount, loadJSON, tr } from './core.js';
import { gallerySection } from './galleries.js';
let data; function render(){if(data) $('#class-galleries').innerHTML='<h1>'+tr('Third class','Treći čas')+'</h1>'+gallerySection(data,3);}
mount({view:'prototypes',render,title:()=>tr('Third class','Treći čas')});
loadJSON('data/prototipovi-javno.json').then(d=>{data=d;render();}).catch(console.warn);
