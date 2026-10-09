import { esc, tr, tx, number } from './core.js';

const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SHA = /^[a-f0-9]{64}$/;
const PHOTO = /^data\/prototipovi\/[a-z0-9-]+\/[a-z0-9-]+\.jpg$/;
const text = v => typeof v === 'string' && v.trim().length > 0;
const date = v => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) && Number.isFinite(Date.parse(v)) && new Date(v).toISOString().slice(0, 10) === v;
const bilingual = v => v && text(v.sr) && text(v.en);
const keys = (obj, allowed) => obj && typeof obj === 'object' && !Array.isArray(obj) && Object.keys(obj).every(k => allowed.includes(k));

// Source assertions record the teacher's instruction; they are not authentication.
// Baseline continuity and asset bytes are checked independently by the release tools.
export function validatePrototypes(data) {
  const errors = [], fail = (condition, message) => { if (!condition) errors.push(message); };
  fail(data?.schema === 'course-prototypes/v1', 'Unknown prototype register.');
  if (!Array.isArray(data?.sources) || !Array.isArray(data?.items) || !Array.isArray(data?.observations)) return [...errors, 'sources, items and observations must be arrays.'];
  fail(keys(data, ['schema', 'sources', 'items', 'observations', 'revizije']), 'Unknown register fields.');
  const sources = new Set();
  for (const s of data.sources) {
    fail(s && ID.test(s.id || '') && !sources.has(s.id), 'Invalid or duplicate source id.');
    sources.add(s?.id);
    fail(keys(s, ['id', 'recordedOn', 'description']) && date(s?.recordedOn) && bilingual(s?.description), 'Source requires a record date and bilingual description.');
  }
  const photoIds = new Set(), photoPaths = new Set();
  function photos(list, label) {
    fail(Array.isArray(list) && list.length > 0, label + ': photographs required.');
    for (const p of Array.isArray(list) ? list : []) {
      fail(keys(p, ['id', 'src', 'sha256', 'width', 'height', 'alt', 'caption', 'sourceId']), label + ': unknown photo fields.');
      fail(ID.test(p?.id || '') && !photoIds.has(p.id), label + ': unique photo id required.'); photoIds.add(p?.id);
      fail(PHOTO.test(p?.src || '') && !photoPaths.has(p.src), label + ': unique local photograph path required.'); photoPaths.add(p?.src);
      fail(SHA.test(p?.sha256 || ''), label + ': photograph fingerprint required.');
      fail(Number.isInteger(p?.width) && p.width > 0 && Number.isInteger(p?.height) && p.height > 0, label + ': image dimensions required.');
      fail(bilingual(p?.alt) && bilingual(p?.caption), label + ': bilingual image meaning required.');
      fail(sources.has(p?.sourceId), label + ': unknown photo source.');
    }
  }
  const ids = new Set();
  for (const item of data.items) {
    fail(keys(item, ['id', 'title', 'author', 'attribution', 'originWeek', 'documentedWeek', 'medium', 'status', 'sourceId', 'description', 'photos']), 'Unknown prototype fields.');
    fail(ID.test(item?.id || '') && !ids.has(item.id), 'Invalid or duplicate prototype id.'); ids.add(item?.id);
    fail(text(item?.title) && bilingual(item?.description), 'Prototype title and bilingual description required.');
    fail(keys(item?.author, ['name', 'studentNumber']) && text(item?.author?.name) && /^\d{1,4}\/\d{2}(?:\d{2})?$/.test(item?.author?.studentNumber || ''), 'Exact supplied name and student number required.');
    fail(keys(item?.attribution, ['sourceId', 'fields']) && sources.has(item?.attribution?.sourceId) && Array.isArray(item?.attribution?.fields) && [...item.attribution.fields].sort().join('|') === 'name|studentNumber', 'Explicit source for the two attribution fields required.');
    fail(Number.isInteger(item?.originWeek) && item.originWeek > 0, 'Origin week required.');
    fail(Number.isInteger(item?.documentedWeek) && item.documentedWeek > 0 && item.documentedWeek >= item.originWeek, 'Documented week must be a positive integer at or after the origin week.');
    fail(['physical', 'digital'].includes(item?.medium) && item?.status === 'brought', 'Unknown prototype medium or documented status.');
    fail(sources.has(item?.sourceId), 'Unknown prototype source.');
    photos(item?.photos, item?.id || 'Prototype');
  }
  const events = new Set();
  for (const event of data.observations) {
    fail(keys(event, ['id', 'prototypeId', 'kind', 'occurredOn', 'sourceId', 'summary', 'photos', 'publication']), 'Unknown observation fields.');
    fail(ID.test(event?.id || '') && !events.has(event.id), 'Unique observation id required.'); events.add(event?.id);
    fail(ids.has(event?.prototypeId) && event?.kind === 'association-use', 'Observation must identify its prototype and context.');
    fail(date(event?.occurredOn) && sources.has(event?.sourceId) && bilingual(event?.summary), 'Observation needs an actual date, source and bilingual account.');
    fail(keys(event?.publication, ['sourceId', 'scope']) && sources.has(event?.publication?.sourceId) && event?.publication?.scope === 'association-observation', 'Observation publication context required.');
    photos(event?.photos, event?.id || 'Observation');
  }
  fail(data.revizije === undefined || Array.isArray(data.revizije), 'Revision history must be an array.');
  for (const r of Array.isArray(data.revizije) ? data.revizije : []) {
    fail(Number.isInteger(r?.v) && r.v > 0 && date(r?.datum) && bilingual(r?.sta) && sources.has(r?.sourceId) && ids.has(r?.prototypeId) && r?.before?.id === r.prototypeId && r?.after?.id === r.prototypeId, 'Revision requires a source, date and before/after for the same prototype.');
  }
  return errors;
}

function ready(data) { const errors = validatePrototypes(data); if (errors.length) throw new Error(errors.join('\n')); }
function photograph(p, eager = false) {
  return `<figure class="prototype-photo"><a href="${esc(p.src)}" aria-label="${tr('Open full photograph', 'Otvori celu fotografiju')}"><img src="${esc(p.src)}" width="${p.width}" height="${p.height}" alt="${esc(tx(p.alt))}" loading="${eager ? 'eager' : 'lazy'}"${eager ? ' fetchpriority="high"' : ''} decoding="async"></a><figcaption>${esc(tx(p.caption))}</figcaption></figure>`;
}
const weekLabel = week => `${tr('Week', 'Nedelja')} ${week}`;
const weeksOf = (data, field) => [...new Set(data.items.map(item => item[field]))].sort((a, b) => a - b);
function card(item, index) {
  return `<article class="prototype-card" id="${esc(item.id)}" data-prototype="${esc(item.id)}"><header><p class="prototype-meta"><span>${number(index + 1)}</span> <a href="index.html?w=${item.documentedWeek}">${weekLabel(item.documentedWeek)}</a> · ${tr(item.medium === 'digital' ? 'Digital prototype' : 'Physical prototype', item.medium === 'digital' ? 'Digitalni prototip' : 'Fizički prototip')}</p><h2>${esc(item.title)}</h2><p class="prototype-author" data-prototype-attribution="${esc(item.id)}"><span data-author-name>${esc(item.author.name)}</span><span data-author-number>${esc(item.author.studentNumber)}</span></p></header><div class="prototype-photos">${item.photos.map((p, j) => photograph(p, index === 0 && j === 0)).join('')}</div><p class="prototype-description">${esc(tx(item.description))}</p><p class="prototype-status">${tr('Brought prototype', 'Donet prototip')} · ${tr('work begun in week', 'izrada započeta u nedelji')} ${item.originWeek}</p></article>`;
}

export function renderPrototypes(data) {
  ready(data);
  const n = data.items.length;
  const documentedWeeks = weeksOf(data, 'documentedWeek'), originWeeks = weeksOf(data, 'originWeek');
  const materialLinks = documentedWeeks.map(week => `<a class="button secondary" href="index.html?w=${week}">${tr('Documented material', 'Dokumentovano gradivo')} · ${weekLabel(week)}</a>`).join('');
  const originLinks = originWeeks.filter(week => !documentedWeeks.includes(week)).map(week => `<a class="button secondary" href="index.html?w=${week}">${tr('Starting material', 'Polazno gradivo')} · ${weekLabel(week)}</a>`).join('');
  const observations = data.observations.length ? `<section class="prototype-observations" aria-labelledby="observation-title"><h2 id="observation-title">${tr('Observations from the association', 'Zapažanja iz udruženja')}</h2>${data.observations.map(e => `<article id="${esc(e.id)}"><h3>${esc(data.items.find(i => i.id === e.prototypeId).title)}</h3><time datetime="${esc(e.occurredOn)}">${esc(e.occurredOn.split('-').reverse().join('.'))}.</time><p>${esc(tx(e.summary))}</p>${e.photos.map(p => photograph(p)).join('')}</article>`).join('')}</section>` : '';
  return `<div class="prototype-intro"><div><p class="eyebrow">${tr('Course workbook · students’ work', 'Radna sveska predmeta · studentski radovi')}</p><h1>${tr('Brought prototypes.', 'Doneti prototipovi.')}</h1></div><div><p class="lede">${tr('A growing photographic record of brought student prototypes and their authors.', 'Pregled donetih studentskih prototipova, njihovih autora i dostavljenih fotografija.')}</p><p class="prototype-count">${number(n)} ${tr('works recorded', 'evidentiranih radova')} <span>· ${tr('the collection will grow', 'pregled se dopunjuje')}</span></p></div></div>
  <nav class="prototype-index" aria-label="${tr('Find a prototype', 'Pronađi prototip')}">${data.items.map((i, k) => `<a href="#${esc(i.id)}"><span>${number(k + 1)}</span>${esc(i.title)}</a>`).join('')}</nav>
  <div class="prototype-grid">${data.items.map(card).join('')}</div>${observations}
  <aside class="prototype-context"><h2>${tr('From the prototype to use', 'Od prototipa do korišćenja')}</h2><p>${tr('Photographs and observations of use at the association belong to a separate record for each work. This gallery documents the brought prototypes; it does not assess their safety, effectiveness or suitability for a particular person.', 'Fotografije i zapažanja o korišćenju u udruženju pripadaju zasebnom zapisu uz svaki rad. Ovaj pregled dokumentuje donete prototipove; ne predstavlja ocenu njihove bezbednosti, delotvornosti ili pogodnosti za određenu osobu.')}</p><div class="actions">${materialLinks}${originLinks}<a class="button secondary" href="udruzenje.html">${tr('Working with the association', 'Rad sa udruženjem')}</a></div></aside>
  <details class="prototype-sources"><summary>${tr('Record sources', 'Izvori zapisa')}</summary><ul>${data.sources.map(s => `<li>${esc(tx(s.description))} <span>${tr('Recorded', 'Zabeleženo')}: <time datetime="${esc(s.recordedOn)}">${esc(s.recordedOn.split('-').reverse().join('.'))}.</time></span></li>`).join('')}</ul></details>`;
}

export function prototypeTeaser(data) {
  ready(data);
  return `<section class="prototype-teaser" aria-labelledby="prototype-teaser-title"><div><p class="eyebrow">${tr('Students’ work', 'Studentski radovi')} · ${number(data.items.length)}</p><h2 id="prototype-teaser-title">${tr('From an idea to a prototype.', 'Od zamisli do prototipa.')}</h2><p>${tr('Documented', 'Dokumentovano')}: ${weeksOf(data, 'documentedWeek').map(weekLabel).join(' · ')}. ${tr('Work begun', 'Početak izrade')}: ${weeksOf(data, 'originWeek').map(weekLabel).join(' · ')}.</p><a class="button" href="prototipovi.html">${tr('View the prototypes', 'Pogledaj prototipove')} ↗</a></div><div class="prototype-strip" aria-label="${tr('Preview of the collected work', 'Pregled prikupljenih radova')}">${data.items.map((i, k) => `<a href="prototipovi.html#${esc(i.id)}"><img src="${esc(i.photos[0].src)}" alt="${esc(i.title)}" width="${i.photos[0].width}" height="${i.photos[0].height}" loading="lazy"><span>${number(k + 1)} · ${esc(i.title)} · ${weekLabel(i.documentedWeek)}</span></a>`).join('')}</div></section>`;
}
