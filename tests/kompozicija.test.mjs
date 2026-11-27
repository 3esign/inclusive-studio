// Jedna traka, jedan broj. Izmereno 24.10.2026 na širini 1920: zaglavlje, telo i
// podnožje počinjali su na 271 px, red predmeta na 352 px, a traka toka na 35 px —
// tri leve ivice na istoj strani. Uz to je zapis časa bez fotografija držao kolonu
// od 780 px unutar trake od 1378 px, pa je desna polovina ostajala prazna.
// Ovaj test čuva ispravku na nivou izvora: širina i uvlačenje svake trake idu kroz
// --rail i --gutter, a zapis bez fotografija nema svoju užu, zakucanu kolonu.
// Ne meri izgled u pregledaču — potvrđuje da drugi broj nije vraćen u stilove.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const css = await readFile(new URL('../assets/style.css', import.meta.url), 'utf8');

// Isti selektor ume da se javi više puta; gleda se sve što je za njega zapisano.
const pravilo = (selektor) => {
  const delovi = [];
  for (let i = css.indexOf(selektor + '{'); i !== -1; i = css.indexOf(selektor + '{', i + 1)) {
    const pre = css[i - 1];
    if (pre && !'{};\n '.includes(pre)) continue;
    delovi.push(css.slice(i + selektor.length + 1, css.indexOf('}', i)));
  }
  assert.notEqual(delovi.length, 0, 'nema pravila za ' + selektor);
  return delovi.join(';');
};

test('sve trake strane dele istu širinu i isto uvlačenje', () => {
  assert.match(pravilo(':root'), /--rail:\s*\d+px/, ':root ne imenuje --rail');
  assert.match(pravilo(':root'), /--gutter:/, ':root ne imenuje --gutter');
  for (const selektor of ['.site-header', '.shell', '.site-footer', '#course-line']) {
    const telo = pravilo(selektor);
    assert.match(telo, /max-width:\s*var\(--rail\)/, selektor + ' ima sopstvenu širinu');
    assert.match(telo, /padding[^;]*var\(--gutter\)/, selektor + ' ima sopstveno uvlačenje');
  }
});

// Izmereno 25.10.2026 na 320 i 390 px: red predmeta počinjao je na 16 px, a sve
// ostale trake na 18 px — u @media(max-width:600px) ostao je `padding:.55rem 1rem`.
// Osnovno pravilo je bilo ispravno, pa ga test iznad nije video: dovoljno je da
// JEDNO pojavljivanje selektora računa po --gutter. Zato se gleda svako posebno.
test('nijedno pravilo uže širine ne vraća zakucano uvlačenje', () => {
  for (const selektor of ['.site-header', '.shell', '.site-footer', '#course-line']) {
    for (let i = css.indexOf(selektor + '{'); i !== -1; i = css.indexOf(selektor + '{', i + 1)) {
      const pre = css[i - 1];
      if (pre && !'{};\n '.includes(pre)) continue;
      const telo = css.slice(i + selektor.length + 1, css.indexOf('}', i));
      for (const pad of telo.matchAll(/(?:^|;)\s*padding(-inline|-left|-right)?\s*:([^;]*)/g)) {
        // gleda se samo vodoravna vrednost; `padding-top` i reset na 0 (štampa) prolaze
        const delovi = pad[2].trim().split(/\s+(?![^(]*\))/);
        const vodoravno = pad[1] ? delovi[0] : (delovi[1] ?? delovi[0]);
        if (/^0(px|rem|%)?$/.test(vodoravno)) continue;
        assert.match(vodoravno, /var\(--gutter\)/,
          selektor + ' ima uvlačenje mimo --gutter: padding:' + pad[2].trim());
      }
    }
  }
});

test('traka toka pada na istu levu ivicu, a podloga ostaje preko cele širine', () => {
  const telo = pravilo('.flow-strip');
  assert.match(telo, /var\(--rail\)/, 'traka toka ne računa po --rail');
  assert.match(telo, /var\(--gutter\)/, 'traka toka ne računa po --gutter');
  assert.doesNotMatch(telo, /max-width/, 'podloga trake toka ne sme da se sužava');
});

// Izmereno 25.10.2026 na 320 px: prva stavka trake toka padala je na 20 px, ostale
// trake na 18 px. Traka se uvlači za `.9rem` manje jer prva stavka ima svoje
// uvlačenje — a @media(max-width:760px) joj je davao 1rem. Oduzeto i dodato moraju
// biti isti broj, inače se red pomeri tačno za razliku.
test('uvlačenje prve stavke trake toka jednako je onome što traka oduzme', () => {
  const kompenzacija = pravilo('.flow-strip').match(/-\s*([\d.]+)rem\)/);
  assert.ok(kompenzacija, 'traka toka više ne oduzima uvlačenje prve stavke');
  for (let i = css.indexOf('.flow-strip a:first-child{'); i !== -1;
       i = css.indexOf('.flow-strip a:first-child{', i + 1)) {
    const telo = css.slice(i, css.indexOf('}', i));
    const pad = telo.match(/padding-left:\s*([\d.]+)rem/);
    if (!pad) continue;
    assert.equal(pad[1], kompenzacija[1],
      'prva stavka ima ' + pad[1] + 'rem, a traka oduzima ' + kompenzacija[1] + 'rem');
  }
});

test('čas bez fotografija koristi celu traku, bez svoje uže kolone', () => {
  const telo = pravilo('.held-record:not(.has-photos) .lesson-spread');
  assert.match(telo, /grid-template-columns:\s*minmax\(0,\s*1fr\)/, 'vraćena je zakucana kolona');
  assert.doesNotMatch(telo, /780px/, '780 px je bio uzrok prazne polovine');
});

test('broj časa stoji uz naslov, ne na suprotnom kraju trake', () => {
  const telo = pravilo('.lesson-heading');
  assert.doesNotMatch(telo, /justify-content:\s*space-between/, 'broj se opet odguruje na kraj trake');
  assert.match(telo, /display:\s*grid/, 'zaglavlje časa više nije rešetka');
});
