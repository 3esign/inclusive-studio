// Rewrites the static shell of every page from one source: assets/core.js → NAV and
// identity.js, and the flow strip from data/tok.json. The shells carry a working baseline
// for readers without JavaScript, so the markup is duplicated in every file; it must never
// be maintained by hand. The surface is Serbian — the course is taught in Serbian — and the
// toggle to English is a runtime choice, never a mixed first paint.
// Run: node tools/shells.mjs — after every change to the navigation or the flow.

import { readFile, writeFile, readdir } from 'node:fs/promises';
import { NAV, FLOW_ZONES } from '../assets/core.js';
import { identity } from '../assets/identity.js';
import { validateTok } from '../assets/tok-core.js';

const root = new URL('../', import.meta.url);
const esc = value => String(value).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const primary = NAV.filter(item => item.group === 'primary');
const archive = NAV.filter(item => item.group === 'archive');
const footer = NAV.filter(item => item.group === 'footer');
const inArchive = page => archive.some(item => item.href === page);

// One true Serbian sentence per page, stamped into <title> and meta description.
const DESC = {
  'naslovna.html': 'Naslovna strana predmeta: radna sveska koja raste nedelju po nedelju.',
  'index.html': 'Održani časovi redom, sa rezultatima, gradivom i A3 listom nedelje — plus materijal koji pomaže.',
  'sledeci.html': 'Priprema sledećeg časa: šta se radi, šta se donosi, koji list se pravi — naslonjeno na prošli čas.',
  'oblak.html': 'Oblasti i ideje u razvoju: sve što još nema nedelju, sa izvorom i datumom.',
  'udruzenje.html': 'Prostor za udruženje: protokol probavanja prototipova, prava korisnika i bezbednosna provera.',
  'predmet.html': 'Predmet, ispit i način ocenjivanja: A3 radna sveska, štampana i digitalna.',
  'predavanje.html': 'Gradivo časa kao predavanje: slajdovi, mere i pitanja.',
  'prototipovi.html': 'Radovi i primeri iz nastave: studentski prototipovi, tehnički crteži i nastavnički primeri sa fotografijama, autorstvom i nedeljom dokumentovanja.',
  'laboratorija.html': 'Ogledi pristupačnosti u pregledaču: šta se oseća, šta se meri, šta se zaključuje.',
  'igracka.html': 'Igračka koja uči prostor: referentne igračke i način analize.',
  'godista.html': 'Granice po godištima: šta je zakon, šta standard, šta podatak.',
  'ideja.html': 'Radionica ideja: izvori, semena i otvorena pitanja.',
  'studio.html': 'Faze projekta kroz semestar.',
  'zadatak.html': 'Aplikacija za jednu osobu: zadatak semestra.',
  'program.html': 'Kalendar susreta i rokova.',
  'standard.html': 'Projektni zadatak: uslovi, merila i predaja.',
  'vezbe.html': 'Banka vežbi celog predmeta.',
  'resources.html': 'Biblioteka i izvori.',
  'ucestvuj.html': 'Javna tabla — neobavezno, nije predaja.',
  'uredi.html': 'Nastavnik: priprema gradiva nedelje.',
  'etika.html': 'Kako sarađujemo: pravila rada u studiju.',
  'pristupacnost.html': 'Pristupačnost ovog sajta: šta je urađeno i kako se proverava.'
};

// The strip is stamped from the flow data itself, so the static page tells the truth:
// how many classes are held, which week the next class is, how many ideas wait.
const tok = JSON.parse(await readFile(new URL('data/tok.json', root), 'utf8'));
const tokProblems = validateTok(tok);
if (tokProblems.length) {
  console.error('data/tok.json does not pass its own rules — the strip is not stamped:');
  for (const problem of tokProblems) console.error('  ' + problem);
  process.exit(1);
}
const nextCas = tok.sledeci.filter(item => item.vrsta === 'cas' && typeof item.nedelja === 'number')[0];
const counts = {
  odrzano: String(tok.odrzano.length),
  sledeciNedelja: nextCas ? String(nextCas.nedelja) : '',
  'oblak-ideja': String(tok.ideje.length)
};

function mainNav(page) {
  const current = item => (item.href === page ? ' aria-current="page"' : '');
  const head = primary.map(item => `<a data-nav="${item.id}" href="${item.href}"${current(item)}>${esc(item.sr)}</a>`).join('\n');
  const rest = archive.map(item => `<a data-nav="${item.id}" href="${item.href}"${current(item)}>${esc(item.sr)}</a>`).join('');
  return `<nav class="main-nav" aria-label="Glavna navigacija">${head}\n<details class="nav-more"><summary${inArchive(page) ? ' aria-current="true"' : ''}>Materijal</summary><div>${rest}</div></details></nav>`;
}

function tabbar(page) {
  const current = item => (item.href === page ? ' aria-current="page"' : '');
  const head = primary.map(item => `<a href="${item.href}"${current(item)}>${esc(item.sr)}</a>`).join('');
  const rest = archive.concat(footer).map(item => `<a href="${item.href}"${current(item)}>${esc(item.sr)}</a>`).join('');
  return `<nav class="tabbar" aria-label="Odeljci">${head}<details class="tab-more"><summary${inArchive(page) ? ' aria-current="true"' : ''}>Više</summary><div>${rest}</div></details></nav>`;
}

function flowStrip() {
  const anchor = zone => {
    const value = counts[zone.kind === 'nedelja' ? 'sledeciNedelja' : zone.id];
    const suffix = zone.kind === 'nedelja'
      ? (value ? ` · nedelja ${esc(value)}` : '')
      : (value ? ` · ${esc(value)}` : '');
    return `<a data-flow="${zone.id}" data-count="${esc(value)}" href="${zone.href}">${esc(zone.sr)}${suffix}</a>`;
  };
  return `<nav class="flow-strip" aria-label="Tok predmeta">${FLOW_ZONES.map(anchor).join('')}</nav>`;
}

const courseBand = () => `<p id="course-line"><strong>${esc(identity.title.sr)}</strong> <span>${esc(identity.institution.sr)} · ${esc(identity.faculty.sr)}</span> <span>${esc(identity.term.sr)}</span></p>`;

// The brand is chrome like the band and the strip: one Serbian mark on every page,
// stamped from identity.js — never half the site „Universal Design”, half „Univerzalni dizajn”.
const brandSr = esc(identity.short.sr).replace(' ', '<br>');

const pages = (await readdir(root)).filter(name => name.endsWith('.html')).sort();
let changed = 0;
for (const page of pages) {
  const url = new URL(page, root);
  const before = await readFile(url, 'utf8');
  const srTitle = page === 'index.html' ? 'Održano na času' : NAV.find(item => item.href === page)?.sr || identity.short.sr;
  const description = DESC[page] || `Strana predmeta „${identity.title.sr}”.`;
  let after = before
    .replace(/<html lang="en">/, '<html lang="sr-Latn">')
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(srTitle)} — ${esc(identity.title.sr)} · ${esc(identity.institution.sr)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(description)}$2`)
    .replace(/<a id="skip-link" class="skip" href="#main">[^<]*<\/a>/, '<a id="skip-link" class="skip" href="#main">Pređi na sadržaj</a>')
    .replace(/<a class="brand" href="(?:naslovna|index)\.html"><span class="brand-mark" aria-hidden="true"><\/span><span>[\s\S]*?<\/span><\/a>/, `<a class="brand" href="naslovna.html"><span class="brand-mark" aria-hidden="true"></span><span>${brandSr}</span></a>`)
    .replace(/<nav class="main-nav"[\s\S]*?<\/nav>/, mainNav(page))
    .replace(/<nav class="tabbar"[\s\S]*?<\/nav>/, tabbar(page))
    .replace(/<p id="course-line">[\s\S]*?<\/p>/, courseBand())
    .replace(/<button id="reading-toggle" aria-pressed="false" hidden>[^<]*<\/button>/, '<button id="reading-toggle" aria-pressed="false" hidden>Jednostavan prikaz</button>')
    .replace(/<button id="language-toggle" class="language" lang="sr-Latn" hidden>[^<]*<\/button>/, '<button id="language-toggle" class="language" lang="en" hidden>English</button>')
    .replace(/<p id="footer-note">[^<]*<\/p>/, '<p id="footer-note">Zajednički studio otvoren za doradu.</p>')
    .replace(/<a id="footer-ethics" href="etika.html">[^<]*<\/a>/, '<a id="footer-ethics" href="etika.html">Kako sarađujemo</a>')
    .replace(/<a id="footer-access" href="pristupacnost.html">[^<]*<\/a>/, '<a id="footer-access" href="pristupacnost.html">Pristupačnost</a>');
  const strip = flowStrip();
  if (after.includes('<nav class="flow-strip"')) after = after.replace(/<nav class="flow-strip"[\s\S]*?<\/nav>/, strip);
  else after = after.replace(/(<div class="course-band">[\s\S]*?<\/div>)/, `$1\n${strip}`);
  // The cover tells the truth without scripting too: its counts are stamped from the flow,
  // exactly like the strip. If the numbers no longer match, the cover test fails the build.
  if (page === 'naslovna.html') {
    after = after
      .replace(/(<div class="cover-stage" data-odrzano=")\d*(" data-sledeci-nedelja=")\d*(")/, `$1${counts.odrzano}$2${counts.sledeciNedelja}$3`)
      .replace(/(<b data-count="odrzano">)[^<]*(<\/b>)/, `$1${counts.odrzano}$2`)
      .replace(/(<b data-count="sledeci-nedelja">)[^<]*(<\/b>)/, `$1${counts.sledeciNedelja || '—'}$2`);
  }
  if (after !== before) { await writeFile(url, after); changed += 1; }
}
console.log(`${pages.length} pages, ${changed} rewritten`);
