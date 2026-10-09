// Rewrites the static navigation of every page from one source: assets/core.js → NAV,
// and the flow strip from data/tok.json. The shells carry a working baseline for readers
// without JavaScript, so the markup is duplicated in every file; it must never be
// maintained by hand. Run: node tools/shells.mjs — after every change to the flow.

import { readFile, writeFile, readdir } from 'node:fs/promises';
import { NAV, FLOW_ZONES } from '../assets/core.js';
import { validateTok } from '../assets/tok-core.js';

const root = new URL('../', import.meta.url);
const esc = value => String(value).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const primary = NAV.filter(item => item.group === 'primary');
const archive = NAV.filter(item => item.group === 'archive');
const footer = NAV.filter(item => item.group === 'footer');
const inArchive = page => archive.some(item => item.href === page);

// The strip is stamped from the flow data itself, so the static page tells the truth:
// how many classes are cemented, which week the next class is, how many ideas wait.
const tok = JSON.parse(await readFile(new URL('data/tok.json', root), 'utf8'));
const tokProblems = validateTok(tok);
if (tokProblems.length) {
  console.error('data/tok.json does not pass its own rules — the strip is not stamped:');
  for (const problem of tokProblems) console.error('  ' + problem);
  process.exit(1);
}
const nextCas = tok.pilot.filter(item => item.vrsta === 'cas' && typeof item.nedelja === 'number')[0];
const counts = {
  zacementirano: String(tok.cem.length),
  pilotNedelja: nextCas ? String(nextCas.nedelja) : '',
  'oblak-ideja': String(tok.ideje.length)
};

function mainNav(page) {
  const current = item => (item.href === page ? ' aria-current="page"' : '');
  const head = primary.map(item => `<a data-nav="${item.id}" href="${item.href}"${current(item)}>${esc(item.en)}</a>`).join('\n');
  const rest = archive.map(item => `<a data-nav="${item.id}" href="${item.href}"${current(item)}>${esc(item.en)}</a>`).join('');
  return `<nav class="main-nav" aria-label="Main navigation">${head}
<details class="nav-more"><summary${inArchive(page) ? ' aria-current="true"' : ''}>Material</summary><div>${rest}</div></details></nav>`;
}

function tabbar(page) {
  const current = item => (item.href === page ? ' aria-current="page"' : '');
  const head = primary.map(item => `<a href="${item.href}"${current(item)}>${esc(item.en)}</a>`).join('');
  const rest = archive.concat(footer).map(item => `<a href="${item.href}"${current(item)}>${esc(item.en)}</a>`).join('');
  return `<nav class="tabbar" aria-label="Sections">${head}<details class="tab-more"><summary${inArchive(page) ? ' aria-current="true"' : ''}>More</summary><div>${rest}</div></details></nav>`;
}

function flowStrip() {
  const anchor = zone => {
    const value = counts[zone.kind === 'nedelja' ? 'pilotNedelja' : zone.id];
    const suffix = zone.kind === 'nedelja'
      ? (value ? ` · week ${esc(value)}` : '')
      : (value ? ` · ${esc(value)}` : '');
    return `<a data-flow="${zone.id}" data-count="${esc(value)}" href="${zone.href}">${esc(zone.en)}${suffix}</a>`;
  };
  return `<nav class="flow-strip" aria-label="Course flow">${FLOW_ZONES.map(anchor).join('')}</nav>`;
}

const pages = (await readdir(root)).filter(name => name.endsWith('.html')).sort();
let changed = 0;
for (const page of pages) {
  const url = new URL(page, root);
  const before = await readFile(url, 'utf8');
  let after = before
    .replace(/<nav class="main-nav"[\s\S]*?<\/nav>/, mainNav(page))
    .replace(/<nav class="tabbar"[\s\S]*?<\/nav>/, tabbar(page));
  const strip = flowStrip();
  if (after.includes('<nav class="flow-strip"')) after = after.replace(/<nav class="flow-strip"[\s\S]*?<\/nav>/, strip);
  else after = after.replace(/(<div class="course-band">[\s\S]*?<\/div>)/, `$1\n${strip}`);
  // The cover tells the truth without scripting too: its stack count is stamped from the flow,
  // exactly like the strip. If the numbers no longer match, the cover test fails the build.
  if (page === 'naslovna.html') {
    after = after
      .replace(/(<div class="cover-stage" data-cem=")\d*(" data-pilot-nedelja=")\d*(")/, `$1${counts.zacementirano}$2${counts.pilotNedelja}$3`)
      .replace(/(<b data-count="cem">)[^<]*(<\/b>)/, `$1${counts.zacementirano}$2`)
      .replace(/(<b data-count="pilot-nedelja">)[^<]*(<\/b>)/, `$1${counts.pilotNedelja || '—'}$2`);
  }
  if (after !== before) { await writeFile(url, after); changed += 1; }
}
console.log(`${pages.length} pages, ${changed} rewritten`);
