// Shared shell: navigation, language, comfort settings, storage and small helpers.
// Every page loads only this plus its own view module, so no page pays for the rest of the site.
// Safe to import in Node (no DOM or storage access at module top level) — the tests rely on it.

import { identity } from './identity.js';

export const REPO = identity.repo;
export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
export const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export const NAV = [
  { id: 'week', href: 'index.html', group: 'primary', en: 'This week', sr: 'Nedelja' },
  { id: 'lecture', href: 'predavanje.html', group: 'primary', en: 'Lecture', sr: 'Predavanje' },
  { id: 'lab', href: 'laboratorija.html', group: 'primary', en: 'Labs', sr: 'Laboratorija' },
  { id: 'toy', href: 'igracka.html', group: 'primary', en: 'The toy', sr: 'Igračka' },
  { id: 'ages', href: 'godista.html', group: 'primary', en: 'By age', sr: 'Po godištima' },
  { id: 'ideas', href: 'ideja.html', group: 'primary', en: 'Creative hub', sr: 'Creative hub' },
  { id: 'studio', href: 'studio.html', group: 'archive', en: 'Project stages', sr: 'Faze projekta' },
  { id: 'task', href: 'zadatak.html', group: 'archive', en: 'An application for one person', sr: 'Aplikacija za jednu osobu' },
  { id: 'subject', href: 'predmet.html', group: 'archive', en: 'The course', sr: 'Predmet' },
  { id: 'schedule', href: 'program.html', group: 'archive', en: 'Calendar', sr: 'Kalendar' },
  { id: 'brief', href: 'standard.html', group: 'archive', en: 'Project brief', sr: 'Projektni zadatak' },
  { id: 'work', href: 'vezbe.html', group: 'archive', en: 'Exercises', sr: 'Vežbe' },
  { id: 'library', href: 'resources.html', group: 'archive', en: 'Library', sr: 'Biblioteka' },
  { id: 'participate', href: 'ucestvuj.html', group: 'archive', en: 'Public board', sr: 'Javna tabla' },
  { id: 'editor', href: 'uredi.html', group: 'archive', en: 'Teacher: material', sr: 'Nastavnik: gradivo' },
  { id: 'ethics', href: 'etika.html', group: 'footer', en: 'Working together', sr: 'Kako sarađujemo' },
  { id: 'accessibility', href: 'pristupacnost.html', group: 'footer', en: 'Accessibility', sr: 'Pristupačnost' }
];

export const navItem = id => NAV.find(item => item.id === id);

/* ---------- storage: never throws, never grows without a limit ---------- */
const PREFIX = 'is3:';
export const STORAGE_LIMIT = 48_000; // characters per key; a draft larger than this is refused, not silently cut

export function read(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw === null) return fallback;
    const value = JSON.parse(raw);
    return value ?? fallback;
  } catch { return fallback; }
}

export function save(key, value) {
  try {
    const raw = JSON.stringify(value);
    if (raw.length > STORAGE_LIMIT) return false;
    localStorage.setItem(PREFIX + key, raw);
    return true;
  } catch { return false; }
}

export function drop(key) { try { localStorage.removeItem(PREFIX + key); return true; } catch { return false; } }

/* ---------- language and role ---------- */
const browserLanguage = typeof navigator !== 'undefined' && /^sr\b/i.test(navigator.language || '') ? 'sr' : 'en';
export let lang = read('language', browserLanguage) === 'sr' ? 'sr' : 'en';
export let role = read('role', 'student') === 'partner' ? 'partner' : 'student';
export const tr = (en, sr) => (lang === 'sr' ? sr : en);
export const tx = object => (object && typeof object === 'object' ? object[lang] ?? object.en ?? '' : object ?? '');
export function setLanguage(next) { lang = next === 'sr' ? 'sr' : 'en'; save('language', lang); return lang; }
export function setRole(next) { role = next === 'partner' ? 'partner' : 'student'; save('role', role); return role; }

export const number = id => String(id).padStart(2, '0');
export const arrow = '<span class="arrow" aria-hidden="true">↗</span>';
export const link = (href, label, cls = '') => `<a class="${cls}" href="${esc(href)}">${label}</a>`;

export function announce(message) {
  const region = $('#announcements');
  if (region) region.textContent = message;
}

export function download(name, content, type = 'text/plain;charset=utf-8') {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement('a');
  anchor.href = url; anchor.download = name; anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

export async function copy(text) {
  try { await navigator.clipboard.writeText(text); return true; } catch { return false; }
}

/* ---------- JSON over the network, fetched once per page ---------- */
const jsonCache = new Map();
export async function loadJSON(url) {
  if (jsonCache.has(url)) return jsonCache.get(url);
  const promise = fetch(url, { cache: 'no-cache' }).then(response => {
    if (!response.ok) throw new Error(url + ' → ' + response.status);
    return response.json();
  });
  jsonCache.set(url, promise);
  try { return await promise; } catch (error) { jsonCache.delete(url); throw error; }
}

/* ---------- comfort settings: presentation only, never content ---------- */
export function applyComfort() {
  try {
    document.documentElement.classList.toggle('large-text', read('largeText', false) === true);
    document.documentElement.classList.toggle('strong-contrast', read('contrast', false) === true);
    document.body.classList.toggle('reading-mode', read('reading', false) === true);
  } catch { /* presentation only */ }
}

export function toggleComfort(key) {
  const next = read(key, false) !== true;
  save(key, next);
  applyComfort();
  return next;
}

/* ---------- the shell around every page ---------- */
function navMarkup(view) {
  const primary = NAV.filter(i => i.group === 'primary');
  const archive = NAV.filter(i => i.group === 'archive');
  const label = item => esc(tr(item.en, item.sr));
  const current = item => (item.id === view ? ' aria-current="page"' : '');
  const inArchive = archive.some(i => i.id === view);
  return `${primary.map(i => `<a data-nav="${i.id}" href="${i.href}"${current(i)}>${label(i)}</a>`).join('')}
<details class="nav-more"><summary${inArchive ? ' aria-current="true"' : ''}>${esc(tr('Material', 'Građa'))}</summary><div>${archive.map(i => `<a data-nav="${i.id}" href="${i.href}"${current(i)}>${label(i)}</a>`).join('')}</div></details>`;
}

function tabbarMarkup(view) {
  const primary = NAV.filter(i => i.group === 'primary');
  const archive = NAV.filter(i => i.group === 'archive');
  const inArchive = archive.some(i => i.id === view);
  const label = item => esc(tr(item.en, item.sr));
  return `${primary.map(i => `<a href="${i.href}"${i.id === view ? ' aria-current="page"' : ''}>${label(i)}</a>`).join('')}
<details class="tab-more"><summary${inArchive ? ' aria-current="true"' : ''}>${esc(tr('More', 'Više'))}</summary><div>${archive.concat(NAV.filter(i => i.group === 'footer')).map(i => `<a href="${i.href}"${i.id === view ? ' aria-current="page"' : ''}>${label(i)}</a>`).join('')}</div></details>`;
}

// Renders navigation, the course band, the footer and the document title.
// Call it after every language change; it is cheap and idempotent.
export function chrome(view, pageTitle) {
  document.documentElement.lang = lang === 'sr' ? 'sr-Latn' : 'en';
  const nav = $('.main-nav');
  if (nav) { nav.innerHTML = navMarkup(view); nav.setAttribute('aria-label', tr('Main navigation', 'Glavna navigacija')); }
  const tabbar = $('.tabbar');
  if (tabbar) { tabbar.innerHTML = tabbarMarkup(view); tabbar.setAttribute('aria-label', tr('Sections', 'Odeljci')); }

  const language = $('#language-toggle');
  if (language) {
    language.hidden = false;
    language.textContent = tr('Srpski', 'English');
    language.lang = tr('sr-Latn', 'en');
    language.setAttribute('aria-label', tr('Prebaci na srpski', 'Switch to English'));
  }
  const reading = $('#reading-toggle');
  if (reading) {
    reading.hidden = false;
    reading.textContent = tr('Simple view', 'Jednostavan prikaz');
    reading.setAttribute('aria-pressed', String(document.body.classList.contains('reading-mode')));
  }
  const skip = $('#skip-link');
  if (skip) skip.textContent = tr('Skip to content', 'Pređi na sadržaj');

  const band = $('#course-line');
  if (band) band.innerHTML = `<strong>${esc(tx(identity.title))}</strong> <span>${esc(tx(identity.institution))} · ${esc(tx(identity.faculty))}</span> <span>${esc(tx(identity.teacher))}</span> <span>${esc(tx(identity.term))}</span>`;

  const note = $('#footer-note');
  if (note) note.textContent = tr('A shared architecture studio. A pilot, open to revision.', 'Zajednički arhitektonski studio. Pilot otvoren za doradu.');
  const ethics = $('#footer-ethics');
  if (ethics) ethics.textContent = tr('Working together', 'Kako sarađujemo');
  const access = $('#footer-access');
  if (access) access.textContent = tr('Accessibility', 'Pristupačnost');

  const item = navItem(view);
  const name = pageTitle || (item ? tr(item.en, item.sr) : tx(identity.short));
  document.title = `${name} — ${tx(identity.title)} · ${tr('Union — Nikola Tesla University', 'Univerzitet Union — Nikola Tesla')}`;
}

// One place that wires the two chrome buttons to a view's render function.
export function bindChrome(render) {
  const language = $('#language-toggle');
  if (language) language.addEventListener('click', () => { setLanguage(lang === 'sr' ? 'en' : 'sr'); render(); });
  const reading = $('#reading-toggle');
  if (reading) reading.addEventListener('click', () => {
    const on = toggleComfort('reading');
    render();
    announce(on ? tr('Simple view on.', 'Jednostavan prikaz uključen.') : tr('Simple view off.', 'Jednostavan prikaz isključen.'));
  });
}

// Boots a page: comfort settings, chrome, first render, chrome bindings.
export function mount({ view, render, title }) {
  applyComfort();
  const draw = () => { chrome(view, typeof title === 'function' ? title() : title); render(); };
  draw();
  bindChrome(draw);
  return draw;
}

export { identity };
