// The surface speaks Serbian before scripting: every page's static headline is the Serbian
// one, and the pre-contract English baselines ("Creative hub.", "Work, not topics." …)
// cannot return. A headline is structural vocabulary, so it names things plainly.
// This guard mirrors the sr strings of the page-top renderers in assets/*.js.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

const root = new URL('../', import.meta.url);

// Headlines without diacritics that are still Serbian; everything else must carry one.
const BEZ_DIJAKRITIKA = new Set([
  'Aplikacija za jednu osobu.',
  'Ideje za rad.',
  'Kalendar studija.',
  'Oblak ideja.',
  'Principi univerzalnog dizajna',
  'Pripremi nedelju.',
  'Probate na svojim rukama.',
  'Prostor, zajedno.',
  'Rad, ne teme.',
  'Radionica ideja.',
  'Radovi i primeri.',
  'Slajd po slajd.',
  'Stavi ideju na sto.',
  'Sveska koja raste.'
]);

const DIACRITICS = /[čćžšđ]/i;

test('every static headline greets in Serbian', async () => {
  const pages = (await readdir(root)).filter(name => name.endsWith('.html')).sort();
  for (const page of pages) {
    const text = await readFile(new URL(page, root), 'utf8');
    const h1 = text.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
    if (!h1) continue; // the cover composes its own headline markup
    const plain = h1[1].replace(/<br\s*\/?>/g, ' ').replace(/<[^>]+>/g, '').trim();
    assert.ok(
      DIACRITICS.test(plain) || BEZ_DIJAKRITIKA.has(plain),
      `${page}: the static headline is not the Serbian one ("${plain}")`
    );
  }
});

test('the pre-contract English surface labels are gone from every page', async () => {
  const pages = (await readdir(root)).filter(name => name.endsWith('.html')).sort();
  const banned = [/>Creative hub</, />Work, not topics</, />Ideas to work with</, />By age</, />Slide by slide</, />Prepare the week</];
  for (const page of pages) {
    const text = await readFile(new URL(page, root), 'utf8');
    for (const pattern of banned) {
      assert.ok(!pattern.test(text), `${page}: an English structural label is stamped in the shell (${pattern})`);
    }
  }
});

test('the idea cloud and the idea atelier point at each other', async () => {
  const cloudPage = await readFile(new URL('oblak.html', root), 'utf8');
  const atelierPage = await readFile(new URL('ideja.html', root), 'utf8');
  assert.match(cloudPage, /href="ideja.html"[^>]*>Radionica ideja/);
  assert.match(atelierPage, /href="oblak\.html"/);
});
