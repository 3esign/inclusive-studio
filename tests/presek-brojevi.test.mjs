/* Naslovna, pregled časova i „sledeći čas" govore u prozi koliko je prisustava
   zavedeno, koliko radova fotografisano i koliko ima fotografija. Ti brojevi su
   nekad bili otkucani rukom („21 rad" dok je registar imao 20 sa slikama) pa
   su se tiho razilazili sa stranicom časa, koja se gradi iz podatka.
   Provera: svaka rečenica oblika „N prisustava … M radova je fotografisano —
   ukupno K fotografija" na ovim stranama mora ponoviti brojeve registra. */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = import.meta.dirname + '/..';
const spisak = JSON.parse(fs.readFileSync(path.join(root, 'data/cas-04/spisak.json'), 'utf8'));
const prisustva = spisak.radovi.length;
const fotografisanih = spisak.radovi.filter(r => r.slike > 0).length;
const fotografija = spisak.radovi.reduce((s, r) => s + (r.slike || 0), 0);

test('registar ima smisla pre nego što ga uporedimo sa prozom', () => {
  assert.ok(prisustva > 0 && fotografisanih > 0 && fotografija > 0);
  assert.ok(fotografisanih <= prisustva);
});

test('brojevi u prozi naslovne, pregleda i „sledećeg časa" ponavljaju registar', () => {
  const bad = [];
  let recenica = 0;
  for (const page of ['naslovna.html', 'index.html', 'sledeci.html']) {
    const text = fs.readFileSync(path.join(root, page), 'utf8');
    const re = /(\d+)\s+prisustava[^.<]*?(\d+)\s+radova je fotografisano[^.<]*?(\d+)\s+fotografija/g;
    for (const m of text.matchAll(re)) {
      recenica++;
      const [n, f, s] = m.slice(1).map(Number);
      if (n !== prisustva || f !== fotografisanih || s !== fotografija)
        bad.push(`${page}: ${n}/${f}/${s} umesto ${prisustva}/${fotografisanih}/${fotografija}`);
    }
  }
  assert.ok(recenica >= 3, 'rečenica sa presekom se više ne prepoznaje — provera bi bila prazna');
  assert.deepEqual(bad, [], bad.join('; '));
});
