import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { validateVisit, renderVisitRecord } from '../assets/poseta-core.js';
import { setLanguage } from '../assets/core.js';
const root = new URL('../', import.meta.url);
const v = JSON.parse(await readFile(new URL('data/poseta-w03.json', root), 'utf8'));
test('third-class visit keeps the teacher’s exact roster and separate date', () => {
  assert.deepEqual(validateVisit(v), []);
  assert.equal(v.week, 3); assert.equal(v.occurredOn, '2026-10-16');
  assert.deepEqual(v.participants.map(p => [p.name,p.studentNumber]), [
    ['Petra Nešić','94/2024'],['Jana Grujić','108/2023'],['Petra Kalanj','18/2024'],
    ['Aleksa Vesić','70/2021'],['Tijana Velemir','51/2024'],['Aleksa Tasković','36/2024'],
    ['Marija Bajić','114/2024'],['Sanja Hornjacek','74/2024'],['Ognjen Mijaljević','25/2024']]);
});
test('authorized visit images match their hashes and no extra image is silently served', async () => {
  assert.equal(v.photos.length,18);
  assert.equal(v.photos.filter(p => p.id.includes('camera')).length,11);
  assert.equal(v.photos.filter(p => p.id.includes('drive')).length,7);
  const hashes = new Set();
  for(const p of v.photos) {
    const b=await readFile(new URL(p.src,root));
    assert.equal(createHash('sha256').update(b).digest('hex'),p.sha256);
    assert.equal(b.readUInt16BE(0),0xffd8); hashes.add(p.sha256);
  }
  assert.equal(hashes.size,18);
  const files=await readdir(new URL('data/prototipovi/poseta-w03/',root));
  assert.deepEqual(files.sort(),v.photos.map(p=>p.src.split('/').at(-1)).sort());
});
test('visit findings cite their own photographs and render separately from proposed trials', () => {
  const bad=structuredClone(v); bad.findings[0].photoIds=['other-week-photo'];
  assert.ok(validateVisit(bad).length);
  const missing=structuredClone(v); delete missing.findings[0].seen.en;
  assert.ok(validateVisit(missing).length);
  for(const lang of ['sr','en']) {
    setLanguage(lang); const html=renderVisitRecord(v);
    for(const f of v.findings) for(const id of f.photoIds) assert.ok(html.includes(`href="#${id}"`));
    assert.ok(html.includes(lang==='sr'?'Predlog za sledeće probanje':'Proposal for the next trial'));
    assert.ok(!html.includes('pogodilica'));
  }
  setLanguage('sr');
});
test('third-class visit is present without scripts and inside its own held class', async () => {
  setLanguage('sr');
  const page=await readFile(new URL('cas-03.html',root),'utf8');
  assert.ok(page.includes(renderVisitRecord(v)));
  const held=await readFile(new URL('index.html',root),'utf8');
  assert.ok(held.includes(renderVisitRecord(v,{compact:true})));
  const pos=held.indexOf('id="poseta-w03-lead"');
  assert.ok(pos>held.indexOf('Nedelja 3</p>')&&pos<held.indexOf('Nedelja 2</p>'));
  const old=await readFile(new URL('poseta.html',root),'utf8');
  assert.ok(!old.includes('data/prototipovi/poseta-w03/'));
});
