// 08.11.2026, professor: a page for students carries the work — concise and concrete.
// Nothing about the bookkeeping behind it: no corrections ledger, no open-question list,
// no "sources of this page", no phone, no file paths, no sentences about how transparent
// the page is. The role is "profesor", never "nastavnik". This test checks every published
// HTML page, client-side renderer strings, and rendered JSON fields in both Serbian and
// English so a leak cannot hide in a translation, a lecture block or a client-side overwrite.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { setLanguage, chrome } from '../assets/core.js';

const root = new URL('../', import.meta.url);
const pages = (await readdir(root)).filter(name => name.endsWith('.html')).sort();

const text = html => html
  .replace(/<script[\s\S]*?<\/script>/g, ' ')
  .replace(/<style[\s\S]*?<\/style>/g, ' ')
  .replace(/<img[^>]*\salt="([^"]*)"[^>]*>/g, ' $1 ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;|&#160;/g, ' ')
  .replace(/\s+/g, ' ');

// Each pattern is one kind of leak. Keep the list short and literal: a ban nobody can read
// is a ban nobody maintains.
const LEAKS = [
  [/\bnastavni[kc]\w*/i, 'the role is "profesor"'],
  [/Ispravke ranijih zapisa|ispravke (?:imena iz )?ranijih zapisa|corrections to earlier[\w -]* records|Otvoreno za razjašnjenje|Označeno kao nejasno|otvoreno pitanje ↓/i, 'bookkeeping block printed'],
  [/Izvori ove strane|Izvor sadržaja|Sources of this page|Content source/, 'sources-of-this-page block printed'],
  [/(?:slik\w+|kadr\w+|fotografij\w+|prenet\w*)[^.]{0,40}\b(?:sa telefona|na telefonu)\b|\b(?:sa telefona|na telefonu)\b[^.]{0,40}(?:slik\w+|kadr\w+|fotografij\w+|prenet\w*)|telefona? profesora|professor[’']s phone|frames? from the phone|photographs? on the phone|DCIM|Galaxy S23|202\d{5}_\d{6}\.jpg/i, 'the phone and its files are not for students'],
  [/\bdata\/[\w./-]+\.json\b/, 'a data path printed as text'],
  [/otvoren[ao]? za doradu|open to revision|Bez JavaScript-a|pečene statike|ne prepričava se rukom|virtue/i, 'a sentence about the page instead of the work'],
  [/u spisku staja|na telefonu (su|je) \d+ kadr|photographs expected|očekuje se fotografija/i, 'a reconciliation note between the list and the phone'],
  [/Šta kadar dokazuje|otisak dokazuje|ljudska tvrdnja/, 'a sentence about evidence instead of the work'],
];

function checkLeaks(label, body, leaks) {
  for (const [pattern, why] of LEAKS) {
    const hit = body.match(pattern);
    if (hit) leaks.push(`${label}: ${why} — "…${body.slice(Math.max(0, hit.index - 50), hit.index + hit[0].length + 50).trim()}…"`);
  }
}

test('no published page leaks bookkeeping, the phone, file paths or the word "nastavnik"', async () => {
  const leaks = [];
  for (const page of pages) {
    const body = text(await readFile(new URL(page, root), 'utf8'));
    checkLeaks(page, body, leaks);
  }
  assert.deepEqual(leaks, []);
});

test('rendered JSON data (both sr and en) and client-side JS strings carry no leaks', async () => {
  const leaks = [];
  const json = async p => JSON.parse(await readFile(new URL(p, root), 'utf8'));
  const pair = (label, v) => {
    if (!v) return;
    if (typeof v === 'string') checkLeaks(label, v, leaks);
    else if (typeof v === 'object') {
      if (typeof v.sr === 'string') checkLeaks(`${label}.sr`, v.sr, leaks);
      if (typeof v.en === 'string') checkLeaks(`${label}.en`, v.en, leaks);
    }
  };

  // 1. Lecture material blocks (w01..wNN)
  const matFiles = (await readdir(new URL('data/material', root))).filter(n => /^w\d+\.json$/.test(n)).sort();
  for (const f of matFiles) {
    const w = await json(`data/material/${f}`);
    pair(`${f}:title`, w.title);
    pair(`${f}:aim`, w.aim);
    for (const [i, b] of (w.bring || []).entries()) pair(`${f}:bring[${i}]`, b);
    for (const [i, blk] of (w.blocks || []).entries()) {
      pair(`${f}:blocks[${i}].text`, blk.text);
      pair(`${f}:blocks[${i}].alt`, blk.alt);
      pair(`${f}:blocks[${i}].caption`, blk.caption);
      for (const [j, it] of (blk.items || []).entries()) pair(`${f}:blocks[${i}].items[${j}]`, it);
    }
  }

  // 2. Held class records in data/tok.json
  const tok = await json('data/tok.json');
  for (const item of tok.odrzano || []) {
    pair(`tok:${item.id}.naslov`, item.naslov);
    for (const [i, r] of (item.rezultati || []).entries()) pair(`tok:${item.id}.rezultati[${i}]`, r.sta);
    for (const [i, p] of (item.prilog || []).entries()) pair(`tok:${item.id}.prilog[${i}]`, p.text);
  }

  // 3. Visit registers and class lists from data/dnevnik.json
  const dnevnik = await json('data/dnevnik.json');
  for (const v of dnevnik.visits || []) {
    const d = await json(v.file);
    pair(`${v.file}:title`, d.title);
    pair(`${v.file}:lede`, d.lede);
    if (Array.isArray(d.summary)) {
      for (const [i, s] of d.summary.entries()) pair(`${v.file}:summary[${i}]`, s);
    } else {
      pair(`${v.file}:summary`, d.summary);
    }
    for (const [i, p] of (d.photos || []).entries()) { pair(`${v.file}:photos[${i}].alt`, p.alt); pair(`${v.file}:photos[${i}].caption`, p.caption); }
    for (const [i, f] of (d.findings || []).entries()) {
      pair(`${v.file}:findings[${i}].title`, f.title);
      pair(`${v.file}:findings[${i}].seen`, f.seen);
      pair(`${v.file}:findings[${i}].reading`, f.reading);
      pair(`${v.file}:findings[${i}].next`, f.next);
    }
  }
  for (const l of dnevnik.lists || []) {
    const d = await json(l.file);
    pair(`${l.file}:naslov`, d.naslov);
    pair(`${l.file}:lede`, d.lede);
    pair(`${l.file}:napomena`, d.napomena);
    for (const [i, r] of (d.radovi || []).entries()) pair(`${l.file}:radovi[${i}].napomena`, r.napomena);
  }

  // 4. Public prototypes register
  const pub = await json('data/prototipovi-javno.json');
  for (const g of [...(pub.items || []), ...(pub.galleries || [])]) {
    pair(`prototipovi:${g.id}.title`, g.title);
    pair(`prototipovi:${g.id}.summary`, g.summary);
    pair(`prototipovi:${g.id}.description`, g.description);
    for (const [i, p] of (g.photos || []).entries()) {
      pair(`prototipovi:${g.id}.photos[${i}].alt`, p.alt);
      pair(`prototipovi:${g.id}.photos[${i}].caption`, p.caption);
    }
  }

  // 5. Client-side JS modules (strip comments and regex/path literals so code validation does not false-trigger)
  const jsFiles = (await readdir(new URL('assets', root))).filter(n => n.endsWith('.js')).sort();
  for (const f of jsFiles) {
    const raw = await readFile(new URL(`assets/${f}`, root), 'utf8');
    const code = raw.replace(/^\s*\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\.[a-z0-9_-]*\.jpg\b|\\\.jpe\?g/gi, '');
    for (const [pattern, why] of LEAKS) {
      if (pattern.source.includes('data\\/')) continue; // fetch('data/...') in JS is normal
      const hit = code.match(pattern);
      if (hit) leaks.push(`assets/${f}: ${why} — "${hit[0]}"`);
    }
  }

  assert.deepEqual(leaks, []);
});

test('every page has a footer that names the course, not a slogan — both static and after core.js chrome()', async () => {
  const { identity } = await import(new URL('../assets/identity.js', import.meta.url).href);
  for (const page of pages) {
    const html = await readFile(new URL(page, root), 'utf8');
    const note = html.match(/<p id="footer-note">([^<]*)<\/p>/);
    assert.ok(note, page + ': footer note missing');
    assert.ok(note[1].includes(identity.title.sr), page + ': footer note does not name the course');
    assert.ok(!/otvoren|open to revision/i.test(note[1]), page + ': footer note is a slogan');
  }
  const coreJs = await readFile(new URL('../assets/core.js', import.meta.url), 'utf8');
  assert.ok(!/open to revision|otvoren za doradu/i.test(coreJs), 'assets/core.js must not overwrite #footer-note with a slogan');
});
