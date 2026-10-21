// Teacher correction, 21 October: this URL now presents galleries, not processing records.
import { readFile, writeFile } from 'node:fs/promises';
import { setLanguage } from '../assets/core.js';
import { gallerySection } from '../assets/galleries.js';
const root=new URL('../',import.meta.url);setLanguage('sr');
const data=JSON.parse(await readFile(new URL('data/prototipovi-javno.json',root),'utf8'));
const url=new URL('cas-03.html',root),before=await readFile(url,'utf8');
const after=before.replace(/<main([^>]*)>[\s\S]*?<\/main>/,'<main$1><div id="class-galleries"><h1>Treći čas</h1>'+gallerySection(data,3)+'</div></main>');
if(before!==after) await writeFile(url,after);
console.log('Third-class galleries generated.');
