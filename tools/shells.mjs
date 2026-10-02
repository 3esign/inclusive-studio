// Rewrites the static navigation of every page from one source: assets/core.js → NAV.
// The shells carry a working baseline for readers without JavaScript, so the markup is
// duplicated in fourteen files; it must never be maintained by hand. Run: node tools/shells.mjs

import { readFile, writeFile, readdir } from 'node:fs/promises';
import { NAV } from '../assets/core.js';

const root = new URL('../', import.meta.url);
const esc = value => String(value).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const primary = NAV.filter(item => item.group === 'primary');
const archive = NAV.filter(item => item.group === 'archive');
const footer = NAV.filter(item => item.group === 'footer');
const inArchive = page => archive.some(item => item.href === page);

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

const pages = (await readdir(root)).filter(name => name.endsWith('.html')).sort();
let changed = 0;
for (const page of pages) {
  const url = new URL(page, root);
  const before = await readFile(url, 'utf8');
  const after = before
    .replace(/<nav class="main-nav"[\s\S]*?<\/nav>/, mainNav(page))
    .replace(/<nav class="tabbar"[\s\S]*?<\/nav>/, tabbar(page));
  if (after !== before) { await writeFile(url, after); changed += 1; }
}
console.log(`${pages.length} pages, ${changed} rewritten`);
