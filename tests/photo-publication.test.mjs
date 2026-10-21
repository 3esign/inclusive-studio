// Teacher correction 21.10.2026: counts and sequence are not author attribution.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { setLanguage } from '../assets/core.js';
import { renderPrototypes, prototypeTeaser } from '../assets/prototipovi-core.js';
import { renderPoseta } from '../assets/poseta-core.js';
import { publishedPrototypes } from '../assets/photo-publication.js';
const root=new URL('../',import.meta.url),read=p=>fs.readFileSync(new URL(p,root),'utf8');
const data=JSON.parse(read('data/prototipovi.json')),visit=JSON.parse(read('data/poseta.json'));
test('the served excerpt is exactly the public gate and retains the earlier eight works',()=>{
 const out=publishedPrototypes(data);
 assert.deepEqual(JSON.parse(read('data/prototipovi-javno.json')),out);
 assert.deepEqual(out.items,data.items.filter(i=>i.documentedWeek===2));
 assert.equal(out.items.length,8);
 assert.equal(out.galleries.length,20);
});
test('historical third-class author associations never travel in public data or cards',()=>{
 const out=publishedPrototypes(data),html=renderPrototypes(data),text=JSON.stringify(out);
 assert.equal(data.items.filter(i=>i.documentedWeek===3).length,26,'historical evidence must remain');
 for(const i of data.items.filter(i=>i.documentedWeek===3)){
   assert.ok(!out.items.some(p=>p.id===i.id));
   assert.ok(!html.includes('data-prototype="'+i.id+'"'));
   for(const p of i.photos) assert.ok(!text.includes(p.src));
 }
});
test('pending attribution in an earlier class is withheld, including related observations',()=>{
 const copy=structuredClone(data),item=copy.items.find(i=>i.documentedWeek===2);item.attributionStatus='pending';
 const out=publishedPrototypes(copy);
 assert.ok(!out.items.some(i=>i.id===item.id));
 assert.ok(!out.observations.some(i=>i.prototypeId===item.id));
});
test('the visit keeps its existing withdrawal and evidence',()=>{
 assert.ok(visit.photos.length>=23);
 const html=renderPoseta(visit,data);
 for(const p of visit.photos) assert.ok(!html.includes(p.src));
});
test('public gallery and third-class teaser link to one page per reviewed object',()=>{
 setLanguage('sr');const html=read('prototipovi.html'),teaser=prototypeTeaser(data,3);
 for(const g of data.galleries){
   const link='href="galerija-'+g.id+'.html"';
   assert.equal(teaser.split(link).length-1,1);
   assert.equal(html.split(link).length-1,1);
 }
 assert.ok(html.includes(renderPrototypes(data)));
 assert.ok(!read('cas-03.html').includes('data-cas03-row='));
});
test('processing status and roster uncertainty do not return to the teaching summary',()=>{
 const tok=JSON.parse(read('data/tok.json'));
 for(const item of tok.odrzano) for(const r of item.rezultati){
   assert.doesNotMatch(r.sta.sr,/nisu prenete|još nisu prenete|zapisi 17|29 zapisa|redom slikanja/i);
 }
});
test('old third-class directories and roster are excluded from the served package',()=>{
 const excluded=new Set([...read('_config.yml').matchAll(/^\s*-\s*(\S+)\s*$/gm)].map(m=>m[1]));
 assert.ok(excluded.has('data/cas-03/spisak.json'));
 for(const item of data.items.filter(i=>i.documentedWeek===3))for(const p of item.photos)assert.ok(excluded.has(p.src.split('/').slice(0,-1).join('/')));
 for(const g of data.galleries)for(const p of g.photos)assert.ok(!excluded.has(p.src.split('/').slice(0,-1).join('/')));
});
