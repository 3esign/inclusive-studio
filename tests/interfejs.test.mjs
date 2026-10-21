// Roles remain the default. The explicit 09.10.2026 instruction permits only author name
// and, when supplied, student number attached to the supplied work. This is a field-level exception,
// not a page/directory whitelist or permission for other people, contacts or grades.
// This bounded guard detects the known legacy identities and misplaced attributed strings;
// it is not a classifier capable of discovering every personal datum in arbitrary prose.
// The dossier, LOG.md, the kit and the tests themselves keep their internal records — this
// scans what a reader can open: pages, assets, data and docs.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const registry = JSON.parse(await readFile(new URL('data/prototipovi.json', root), 'utf8'));
const visit = JSON.parse(await readFile(new URL('data/poseta.json', root), 'utf8'));
const visitW03 = JSON.parse(await readFile(new URL('data/poseta-w03.json', root), 'utf8'));
const visits = [visit, visitW03];
const cas03 = JSON.parse(await readFile(new URL('data/cas-03/spisak.json', root), 'utf8'));
const GALLERY_SURFACES = new Set(['cas-03.html', 'naslovna.html', 'index.html', 'sledeci.html']);
const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function attributionRows(data) {
  assert.equal(data.schema, 'course-prototypes/v1');
  const sources = new Set(data.sources.map(source => source.id));
  const rows = [...data.items, ...(data.revizije || []).flatMap(revision => [revision.before, revision.after])];
  // 21.10.2026: a third-class work publishes the identity the teacher supplied — student
  // number, name, prototype title. Its source stands on the work itself, not a separate grant.
  const works = [...(data.galleries || []), ...(data.cekaju || [])];
  for (const work of works) {
    const numbered = Object.hasOwn(work.author, 'studentNumber');
    assert.deepEqual(Object.keys(work.author).sort(), numbered ? ['name', 'studentNumber'] : ['name'], 'only the authorized author fields may be public');
    assert.ok(sources.has(work.sourceId), 'a published work needs a recorded source');
    assert.ok(typeof work.author.name === 'string' && work.author.name.trim());
    if (numbered) assert.ok(/^\d{1,4}\/\d{2}(?:\d{2})?$/.test(work.author.studentNumber));
  }
  rows.push(...works);
  for (const row of rows.filter(row => row.attribution)) {
    const numbered = Object.hasOwn(row.author, 'studentNumber');
    const fields = numbered ? ['name', 'studentNumber'] : ['name'];
    assert.deepEqual(Object.keys(row.author).sort(), fields, 'only the authorized author fields may be public');
    assert.deepEqual([...row.attribution.fields].sort(), fields, 'attribution scope must stay exact');
    assert.ok(sources.has(row.attribution.sourceId), 'attribution needs a recorded source');
    assert.ok(typeof row.author.name === 'string' && row.author.name.trim());
    if (numbered) assert.ok(typeof row.author.studentNumber === 'string' && /^\d{1,4}\/\d{2}(?:\d{2})?$/.test(row.author.studentNumber));
  }
  return rows;
}

// The 12.10.2026 instruction permits exactly the visit participants' names and student
// numbers, on exactly two surfaces: the held page panel and the visit page. Field-level and
// surface-level, like the author exception — no contacts, grades or other persons.
function visitRows(data) {
  assert.equal(data.schema, 'course-visit/v1');
  assert.ok(Array.isArray(data.participants) && data.participants.length > 0, 'visit participants required');
  assert.ok(data.source && typeof data.source.id === 'string' && data.source.id.trim());
  for (const person of data.participants) {
    assert.deepEqual(Object.keys(person).sort(), ['name', 'studentNumber'], 'only the authorized participant fields may be public');
    assert.ok(typeof person.name === 'string' && person.name.trim());
    assert.ok(/^\d{1,4}\/\d{2}(?:\d{2})?$/.test(person.studentNumber));
  }
  return data.participants;
}

// The 18.10.2026 instruction permits the third-class list: each row carries a student's
// name and student number beside the photographs it explains, on exactly one surface —
// the class-list page. Field-level and surface-level, like the visit exception.
function cas03Rows(data) {
  assert.equal(data.schema, 'course-class-list/v1');
  assert.ok(Array.isArray(data.radovi) && data.radovi.length > 0, 'class-list rows required');
  assert.ok(data.source && typeof data.source.id === 'string' && data.source.id.trim());
  for (const row of data.radovi) {
    const fields = Object.keys(row).filter(key => key !== 'ime' && key !== 'indeks');
    assert.deepEqual(fields.sort(), ['ceka', 'galerija', 'napomena', 'rad', 'razjasni', 'rb', 'slike'].filter(key => key in row), 'only the authorized list fields may be public');
    assert.ok(row.ime === null || (typeof row.ime === 'string' && row.ime.trim()));
    assert.ok(row.indeks === null || /^\d{1,4}\/\d{2}(?:\d{2})?$/.test(row.indeks));
  }
  return data.radovi;
}

function withoutAuthorizedAttribution(file, text, data) {
  attributionRows(data);
  if (file === 'data/poseta.json' || file === 'data/poseta-w03.json') {
    visitRows(visit);
    const copy = JSON.parse(text);
    visitRows(copy);
    assert.deepEqual(copy.participants, (file === 'data/poseta.json' ? visit : visitW03).participants);
    copy.participants = copy.participants.map(() => ({ name: '[visit-participant]', studentNumber: '[visit-number]' }));
    return JSON.stringify(copy);
  }
  if (file === 'data/prototipovi.json' || file === 'data/prototipovi-javno.json' || file === 'data/cas-03/predlog-registra.json') {
    const copy = JSON.parse(text);
    for (const row of attributionRows(copy)) row.author = { name: '[attributed-author]', ...(Object.hasOwn(row.author, 'studentNumber') ? { studentNumber: '[attributed-number]' } : {}) };
    for (const title of [...(copy.galleries || []), ...(copy.cekaju || [])]) { title.title = { sr: '[work-title]', en: '[work-title]' }; for (const photo of title.photos || []) photo.alt = { sr: '[work-alt]', en: '[work-alt]' }; }
    // A withdrawn record keeps the author it once named; it is evidence, not a public field.
    for (const gone of copy.povuceno || []) gone.zapis = { id: gone.id, redacted: '[withdrawn-record]' };
    return JSON.stringify(copy);
  }
  if (file === 'data/cas-03/spisak.json') {
    cas03Rows(cas03);
    const copy = JSON.parse(text);
    cas03Rows(copy);
    copy.radovi = copy.radovi.map(() => ({ ime: '[cas03-name]', indeks: '[cas03-number]' }));
    return JSON.stringify(copy);
  }
  // Renderer source contains template placeholders, not an emitted HTML attribution.
  // Keep source text fully visible to the name/data scan; redact only actual HTML.
  if (!file.endsWith('.html')) return text;
  return text.replace(/<(p|small)\b[^>]*\bdata-prototype-attribution="([^"]+)"[^>]*>([\s\S]*?)<\/\1>/g, (whole, tag, id, inner) => {
    assert.ok(file === 'prototipovi.html' || GALLERY_SURFACES.has(file) || /^galerija-[a-z0-9-]+\.html$/.test(file), 'only the work surfaces publish attribution');
    const row = [...data.items, ...(data.galleries || []), ...(data.cekaju || [])].find(item => item.id === id);
    assert.ok(row, 'attribution marker must name an existing prototype');
    const expected = `<span data-author-name>${escape(row.author.name)}</span>${Object.hasOwn(row.author, 'studentNumber') ? `<span data-author-number>${escape(row.author.studentNumber)}</span>` : ''}`;
    assert.equal(inner.trim().replace(/>\s+</g, '><'), expected, 'gallery attribution must match the exact authorized fields');
    return `<${tag}>[attributed-author-fields]</${tag}>`;
  }).replace(/<ul\b[^>]*\bdata-visit-participants="([^"]+)"[^>]*>([\s\S]*?)<\/ul>/g, (whole, id, inner) => {
    const recorded = visits.find(v => v.id === id);
    assert.ok(recorded, 'participant list must name the recorded visit');
    const surfaces = recorded.week === 2 ? ['index.html', 'poseta.html'] : ['index.html', 'cas-03.html'];
    assert.ok(surfaces.includes(file), 'only the held page and the visit page publish participants');
    const expected = recorded.participants.map(person => `<li><span data-participant-name>${escape(person.name)}</span><span data-participant-number>${escape(person.studentNumber)}</span></li>`).join('');
    assert.equal(inner.trim(), expected, 'participant list must match the exact authorized fields');
    return '<ul>[visit-participant-fields]</ul>';
  }).replace(/<li\b[^>]*\bdata-cas03-row="(\d+)"[^>]*>([\s\S]*?)<\/li>/g, (whole, rb, inner) => {
    assert.equal(file, 'cas-03.html', 'only the class-list page publishes the third-class rows');
    const row = cas03.radovi.find(item => item.rb === Number(rb));
    assert.ok(row, 'class-list row must match a recorded entry');
    const expected = `<span data-cas03-name>${escape(row.ime || '—')}</span><span data-cas03-indeks>${escape(row.indeks || '—')}</span>`;
    assert.ok(inner.startsWith(expected), 'class-list row must open with the exact authorized fields');
    return '<li>[cas03-row-fields]</li>';
  });
}

const collect = async (dir, exts, out = []) => {
  for (const entry of await readdir(new URL(dir, root), { withFileTypes: true })) {
    if (entry.name === 'vendor') continue; // third-party code, hashed in cover.test.mjs
    const path = dir + '/' + entry.name;
    if (entry.isDirectory()) await collect(path, exts, out);
    else if (exts.some(ext => entry.name.endsWith(ext))) out.push(path);
  }
  return out;
};

const files = [
  ...(await readdir(root)).filter(name => name.endsWith('.html')),
  ...(await collect('assets', ['.js', '.svg'])),
  ...(await collect('data', ['.json', '.md'])),
  ...(await collect('docs', ['.md'])),
  'README.md',
  'README.sr.md'
];

// People the interface once named; a name here means it came back.
const NAMES = /(dejan|kozić|koći|kocić|semir|poturak)/i;
// Entries whose publication waited on a consent decision.
const CONSENT_GATED = /(saglasnost za fotografije|photo consent|termin i saglasnost|ime uz saglasnost|name with consent|čeka saglasnost)/i;

test('the published surface is inventoried — the scan sees the whole site', () => {
  assert.ok(files.length >= 40, `only ${files.length} files collected`);
  for (const must of ['index.html', 'udruzenje.html', 'naslovna.html', 'assets/udruzenje.js', 'data/tok.json', 'docs/probavanje-u-udruzenju.md']) {
    assert.ok(files.includes(must), `the scan misses ${must}`);
  }
});

test('known private identities and attributed author data occur only in their explicit prototype fields', async () => {
  const authors = attributionRows(registry);
  for (const path of files) {
    const raw = await readFile(new URL(path, root), 'utf8');
    const text = withoutAuthorizedAttribution(path, raw, registry);
    const name = text.match(NAMES);
    assert.ok(!name, `${path} carries a personal name: ${name?.[0]}`);
    for (const row of authors) for (const value of Object.values(row.author)) {
      for (const form of [value, escape(value)]) assert.ok(!text.includes(form), `${path} repeats attributed data outside its authorized field`);
    }
    for (const person of visits.flatMap(visitRows)) for (const value of Object.values(person)) {
      for (const form of [value, escape(value)]) assert.ok(!text.includes(form), `${path} repeats participant data outside its authorized field`);
    }
  }
});

test('the attribution exception cannot hide unrelated text, extra identifiers or another page', () => {
  const data = { schema: 'course-prototypes/v1', sources: [{ id: 'fixture-permission' }], items: [{ id: 'fixture-work', author: { name: 'Semir Fixture', studentNumber: '49/24' }, attribution: { sourceId: 'fixture-permission', fields: ['name', 'studentNumber'] } }], revizije: [] };
  const author = '<p class="prototype-author" data-prototype-attribution="fixture-work"><span data-author-name>Semir Fixture</span><span data-author-number>49/24</span></p>';
  assert.doesNotMatch(withoutAuthorizedAttribution('prototipovi.html', author, data), NAMES);
  assert.match(withoutAuthorizedAttribution('prototipovi.html', author + '<p>Dejan</p>', data), NAMES);
  assert.match(withoutAuthorizedAttribution('assets/prototipovi-core.js', author, data), NAMES, 'source literals do not receive an HTML exception');
  assert.throws(() => withoutAuthorizedAttribution('udruzenje.html', author, data), /the work surfaces publish attribution/);
  assert.throws(() => withoutAuthorizedAttribution('prototipovi.html', author.replace('</p>', '<span>Dejan</span></p>'), data), /exact authorized/);
  const extra = structuredClone(data); extra.items[0].author.email = 'fixture@example.invalid';
  assert.throws(() => attributionRows(extra), /authorized author fields/);
  const unknown = structuredClone(data); unknown.items[0].attribution.sourceId = 'missing';
  assert.throws(() => attributionRows(unknown), /recorded source/);
});
test('name-only teacher attribution is limited to the sourced author field and exact gallery markup', () => {
  const data = { schema: 'course-prototypes/v1', sources: [{ id: 'fixture-permission' }], items: [{ id: 'fixture-work', authorRole: 'teacher', author: { name: 'Semir Fixture' }, attribution: { sourceId: 'fixture-permission', fields: ['name'] } }], revizije: [] };
  const author = '<p class="prototype-author" data-prototype-attribution="fixture-work"><span data-author-name>Semir Fixture</span></p>';
  assert.doesNotMatch(withoutAuthorizedAttribution('prototipovi.html', author, data), NAMES);
  assert.doesNotMatch(withoutAuthorizedAttribution('data/prototipovi.json', JSON.stringify(data), data), NAMES);
  assert.match(withoutAuthorizedAttribution('prototipovi.html', author + '<p>Semir Fixture</p>', data), NAMES);
  assert.match(withoutAuthorizedAttribution('assets/prototipovi-core.js', author, data), NAMES);
  assert.throws(() => withoutAuthorizedAttribution('etika.html', author, data), /the work surfaces publish attribution/);
  for (const extra of ['<span data-author-number>49/24</span>', '<span>Teacher</span>', '<a href="mailto:fixture@example.invalid">contact</a>']) {
    assert.throws(() => withoutAuthorizedAttribution('prototipovi.html', author.replace('</p>', extra + '</p>'), data), /exact authorized/);
  }
  for (const mutate of [
    d => { d.items[0].author.email = 'fixture@example.invalid'; },
    d => { d.items[0].author.studentNumber = ''; },
    d => { d.items[0].attribution.fields.push('studentNumber'); },
    d => { d.items[0].attribution.sourceId = 'missing'; }
  ]) { const invalid = structuredClone(data); mutate(invalid); assert.throws(() => attributionRows(invalid)); }
  const misplaced = structuredClone(data); misplaced.items[0].description = 'Semir Fixture';
  assert.match(withoutAuthorizedAttribution('data/prototipovi.json', JSON.stringify(misplaced), data), NAMES, 'descriptions do not gain an identity exception');
});

test('the interface waits on no consent', async () => {
  for (const path of files) {
    const text = await readFile(new URL(path, root), 'utf8');
    const gated = text.match(CONSENT_GATED);
    assert.ok(!gated, `${path} carries a consent-gated item: ${gated?.[0]}`);
  }
});

test('the visit exception is bounded to its two surfaces, its visit and its exact markup', () => {
  const li = p => `<li><span data-participant-name>${escape(p.name)}</span><span data-participant-number>${escape(p.studentNumber)}</span></li>`;
  const list = `<ul class="visit-participants" data-visit-participants="${visit.id}">${visit.participants.map(li).join('')}</ul>`;
  const truncated = `<ul class="visit-participants" data-visit-participants="${visit.id}">${visit.participants.slice(0, 2).map(li).join('')}</ul>`;
  assert.doesNotThrow(() => withoutAuthorizedAttribution('index.html', list, registry));
  assert.doesNotThrow(() => withoutAuthorizedAttribution('poseta.html', list, registry));
  assert.throws(() => withoutAuthorizedAttribution('udruzenje.html', list, registry), /held page and the visit page/);
  assert.throws(() => withoutAuthorizedAttribution('index.html', truncated, registry), /exact authorized/);
  assert.throws(() => withoutAuthorizedAttribution('index.html', list.replace('data-participant-name', 'data-participant-full-name'), registry), /exact authorized/);
  const extra = structuredClone(visit); extra.participants[0].studentNumber = extra.participants[0].studentNumber + 'x';
  assert.throws(() => visitRows(extra), /studentNumber/);
  const leaked = withoutAuthorizedAttribution('index.html', list + '<p>' + visit.participants[0].name + '</p>', registry);
  assert.ok(leaked.includes(visit.participants[0].name), 'a participant name outside the list must stay visible to the scan');
});

test('the class-list exception is bounded to its one surface, its rows and its exact markup', () => {
  cas03Rows(cas03);
  const row = cas03.radovi.find(item => item.ime) || cas03.radovi[0];
  const li = `<li data-cas03-row="${row.rb}"><span data-cas03-name>${escape(row.ime || '—')}</span><span data-cas03-indeks>${escape(row.indeks || '—')}</span><span class="cas03-rad">x</span></li>`;
  assert.doesNotThrow(() => withoutAuthorizedAttribution('cas-03.html', li, registry));
  assert.throws(() => withoutAuthorizedAttribution('index.html', li, registry), /class-list page/);
  const renamed = li.replace(`<span data-cas03-name>${escape(row.ime || '—')}</span>`, `<span data-cas03-name>${escape(row.ime || '—')} plus</span>`);
  assert.throws(() => withoutAuthorizedAttribution('cas-03.html', renamed, registry), /exact authorized/);
  assert.throws(() => withoutAuthorizedAttribution('cas-03.html', li.replace('data-cas03-name', 'data-cas03-full-name'), registry), /exact authorized/);
  assert.throws(() => withoutAuthorizedAttribution('cas-03.html', `<li data-cas03-row="99">${li.slice(li.indexOf('<span'))}</li>`, registry), /recorded entry/);
  const extra = structuredClone(cas03); extra.radovi[0].email = 'fixture@example.invalid';
  assert.throws(() => cas03Rows(extra), /authorized list fields/);
  const badNumber = structuredClone(cas03); badNumber.radovi[1].indeks = badNumber.radovi[1].indeks + 'x';
  assert.throws(() => cas03Rows(badNumber), /indeks/);
  assert.ok(withoutAuthorizedAttribution('data/cas-03/spisak.json', JSON.stringify(cas03), registry).includes('[cas03-name]'), 'the register copy is redacted before the scan');
});

test('third-class participants are authorized only on their own class and held page', () => {
  const inner = visitW03.participants.map(p => `<li><span data-participant-name>${escape(p.name)}</span><span data-participant-number>${escape(p.studentNumber)}</span></li>`).join('');
  const html = `<ul data-visit-participants="${visitW03.id}">${inner}</ul>`;
  for (const page of ['index.html', 'cas-03.html']) assert.doesNotThrow(() => withoutAuthorizedAttribution(page, html, registry));
  for (const page of ['poseta.html', 'naslovna.html', 'udruzenje.html']) assert.throws(() => withoutAuthorizedAttribution(page, html, registry));
  assert.throws(() => withoutAuthorizedAttribution('cas-03.html', html.replace('74/2024', '84/2024'), registry), /exact authorized/);
  assert.throws(() => withoutAuthorizedAttribution('cas-03.html', html.replace(inner, inner + '<li>extra person</li>'), registry), /exact authorized/);
});
