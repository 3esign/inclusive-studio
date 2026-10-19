import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { setLanguage } from '../assets/core.js';
import { renderPrototypes, prototypeTeaser, photograph } from '../assets/prototipovi-core.js';
import { renderPoseta } from '../assets/poseta-core.js';
import { renderCas03 } from '../assets/cas03-core.js';
import { publishedPrototypes, withheldWorkIds, withheldPhotoDirectories } from '../assets/photo-publication.js';
const read = p => fs.readFileSync(new URL('../' + p, import.meta.url), 'utf8');
const data = JSON.parse(read('data/prototipovi.json'));
const visit = JSON.parse(read('data/poseta.json'));
const list = JSON.parse(read('data/cas-03/spisak.json'));

test('withdrawal preserves the complete evidence and all eight earlier works', () => {
  const before = JSON.stringify(data);
  assert.equal(withheldWorkIds.length, 26);
  assert.equal(publishedPrototypes(data).items.length, 8);
  assert.deepEqual(publishedPrototypes(data).items, data.items.filter(i => i.documentedWeek === 2));
  assert.deepEqual(publishedPrototypes(data).observations, data.observations);
  assert.equal(JSON.stringify(data), before);
});
test('no withdrawn photo or attribution appears in SR/EN gallery, teasers or visit', () => {
  for (const language of ['sr', 'en']) {
    setLanguage(language);
    const html = renderPrototypes(data) + prototypeTeaser(data) + renderPoseta(visit, data);
    for (const id of withheldPhotoDirectories) assert.ok(!html.includes('data/prototipovi/' + id + '/'), id);
    for (const id of withheldWorkIds) assert.ok(!html.includes('data-prototype="' + id + '"'), id);
    assert.equal(prototypeTeaser(data, 3), '');
    assert.ok(!html.includes('visit-scenes-title'));
    for (const photo of visit.photos) assert.equal(photograph(photo), '');
    const listHtml = renderCas03(list, data);
    assert.equal((listHtml.match(/data-cas03-row=/g) || []).length, 29);
    assert.match(listHtml, language === 'sr' ? /privremeno su povučene/ : /temporarily withdrawn/);
  }
});
test('static pages and Pages exclusions enforce the same withdrawal', () => {
  const html = ['index.html','prototipovi.html','sledeci.html','poseta.html'].map(read).join('\n');
  const config = read('_config.yml');
  for (const id of withheldPhotoDirectories) {
    assert.ok(!html.includes('data/prototipovi/' + id + '/'), id);
    assert.ok(config.split(/\r?\n/).includes('  - data/prototipovi/' + id), id);
  }
  assert.ok(!config.includes('data/prototipovi/zmijica-2026'));
});
