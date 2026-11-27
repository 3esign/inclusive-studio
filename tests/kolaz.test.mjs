/* Čas-kolaž (14.11.2026): čas čije fotografije još nisu povezane sa imenima. Spisak nosi
   prisustvo, kolaž nosi kadrove po celinama. Provera: registar kolaža je ispravan, svaka
   slika postoji sa upisanim otiskom, strana prikazuje svaku sliku tačno jednom i nijedan
   red prisustva ne nosi rad ni fotografiju dok autor nije poznat. */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { setLanguage } from '../assets/core.js';
import { renderCas03, validateCas03, validateKolaz } from '../assets/cas03-core.js';

const root = import.meta.dirname + '/..';
const json = p => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const lists = json('data/dnevnik.json').lists.map(l => ({ ...l, spisak: json(l.file) })).filter(l => l.spisak.kolazRegistar);

test('postoji bar jedan čas-kolaž i njegov registar je ispravan', () => {
  assert.ok(lists.length >= 1);
  for (const l of lists) {
    assert.deepEqual(validateCas03(l.spisak), []);
    assert.deepEqual(validateKolaz(json(l.spisak.kolazRegistar)), []);
  }
});

test('svaka slika kolaža postoji i nosi upisani otisak', () => {
  for (const l of lists) for (const c of json(l.spisak.kolazRegistar).celine) for (const p of c.photos) {
    const buf = fs.readFileSync(path.join(root, p.src));
    assert.equal(createHash('sha256').update(buf).digest('hex'), p.sha256, p.src);
  }
});

test('strana prikazuje svaku sliku jednom, a prisustvo bez rada i bez fotografije', () => {
  setLanguage('sr');
  for (const l of lists) {
    const kolaz = json(l.spisak.kolazRegistar);
    const html = renderCas03(l.spisak, json('data/prototipovi.json'), null, kolaz);
    // 14.11.2026: jedna kartica po celini. Vodeći kadar je slika kartice, a svaki kadar
    // (i vodeći i ostali) stoji tačno jednom kao veza koju pregledač otvara.
    const srcs = [...html.matchAll(/<a [^>]*href="([^"]+)" data-kolaz-photo/g)].map(m => m[1]);
    const expected = kolaz.celine.flatMap(c => c.photos.map(p => p.src));
    assert.deepEqual(srcs, expected);
    assert.equal(new Set(srcs).size, srcs.length);
    assert.deepEqual([...html.matchAll(/<img src="([^"]+)"/g)].map(m => m[1]), kolaz.celine.map(c => c.photos[0].src));
    assert.equal((html.match(/class="kolaz-card"/g) || []).length, kolaz.celine.length);
    assert.ok(html.includes('data-filter="kolaz"') && html.includes('data-filter="prisutni"'), 'pretraga radova i imena');
    assert.equal((html.match(/data-cas03-row=/g) || []).length, l.spisak.radovi.length);
    assert.ok(!html.includes('cas03-rad') && !html.includes('cas03-slike'), 'red prisustva ne nosi rad ni broj fotografija');
    assert.ok(l.spisak.radovi.every(r => r.rad === null && r.slike === null && !('galerija' in r)));
    const page = fs.readFileSync(path.join(root, l.page), 'utf8');
    assert.ok(page.includes(`<div id="cas03-content">${html}</div>`), `${l.page}: statika nije iz istog renderera`);
  }
});

test('kolaž bez registra ne prolazi tiho', () => {
  setLanguage('sr');
  assert.throws(() => renderCas03(lists[0].spisak, json('data/prototipovi.json'), null, null), /collage register is missing/);
});
