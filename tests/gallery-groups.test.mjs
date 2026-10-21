import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { validatePrototypes } from '../assets/prototipovi-core.js';
import { galleryDetail } from '../assets/galleries.js';
import { setLanguage } from '../assets/core.js';
const read = p => readFile(new URL('../'+p,import.meta.url));
const data=JSON.parse(await read('data/prototipovi.json'));
test('reviewed objects are grouped independently from names and the old roster order', async()=>{
  assert.deepEqual(validatePrototypes(data),[]);
  const counts={kutija:7,touch:5,'visoka-staza':6,'prostorna-staza':4,castle:3,'sudoku-skica':2};
  for(const [id,n] of Object.entries(counts)) assert.equal(data.galleries.find(g=>g.id===id).photos.length,n,id);
  const hashes=new Set();
  for(const g of data.galleries){
    assert.ok(!('author' in g));
    for(const p of g.photos){
      assert.ok(!hashes.has(p.sha256),'same photograph used in two groups');hashes.add(p.sha256);
      assert.equal(createHash('sha256').update(await read(p.src)).digest('hex'),p.sha256);
    }
  }
  // The schema must reject an author being silently attached to a reviewed photo group.
  const bad=structuredClone(data);bad.galleries[0].author={name:'Inferred from roster'};
  assert.ok(validatePrototypes(bad).length);
});
test('each group has its own complete static page and bilingual runtime',async()=>{
  for(const g of data.galleries){
    setLanguage('sr');const html=(await read(`galerija-${g.id}.html`)).toString();
    assert.ok(html.includes(galleryDetail(data,g.id)));
    for(const p of g.photos) assert.ok(html.includes(`src="${p.src}"`));
    setLanguage('en');assert.ok(galleryDetail(data,g.id).includes(g.title.en));
  }
  setLanguage('sr');
});
