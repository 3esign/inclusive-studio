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
// Svaki održani čas sa spiskom; dnevnik ih vodi redom nedelja, poslednji je najnoviji.
const preseci = JSON.parse(fs.readFileSync(path.join(root, 'data/dnevnik.json'), 'utf8')).lists.map(l => {
  const radovi = JSON.parse(fs.readFileSync(path.join(root, l.file), 'utf8')).radovi;
  return [radovi.length, radovi.filter(r => r.slike > 0).length, radovi.reduce((s, r) => s + (r.slike || 0), 0)].join('/');
});
const [prisustva, fotografisanih, fotografija] = preseci.at(-1).split('/').map(Number);

test('registar ima smisla pre nego što ga uporedimo sa prozom', () => {
  assert.ok(prisustva > 0 && fotografisanih > 0 && fotografija > 0);
  assert.ok(fotografisanih <= prisustva);
});

test('brojevi u prozi naslovne, pregleda i „sledećeg časa" ponavljaju registar', () => {
  const bad = [];
  let recenica = 0, poslednjih = 0;
  for (const page of ['naslovna.html', 'index.html', 'sledeci.html']) {
    const text = fs.readFileSync(path.join(root, page), 'utf8');
    const re = /(\d+)\s+prisustava[^.<]*?(\d+)\s+radova je fotografisano[^.<]*?(\d+)\s+fotografij[ae]/g;
    for (const m of text.matchAll(re)) {
      recenica++;
      const [n, f, s] = m.slice(1).map(Number);
      if (!preseci.includes(`${n}/${f}/${s}`)) bad.push(`${page}: ${n}/${f}/${s} nije presek nijednog održanog časa (${preseci.join(', ')})`);
      if (`${n}/${f}/${s}` === preseci.at(-1)) poslednjih++;
    }
  }
  assert.ok(recenica >= 3, 'rečenica sa presekom se više ne prepoznaje — provera bi bila prazna');
  assert.ok(poslednjih >= 3, 'naslovna, pregled i „sledeći čas” moraju nositi presek poslednjeg časa');
  assert.deepEqual(bad, [], bad.join('; '));
});
