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
const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function attributionRows(data) {
  assert.equal(data.schema, 'course-prototypes/v1');
  const sources = new Set(data.sources.map(source => source.id));
  const rows = [...data.items, ...(data.revizije || []).flatMap(revision => [revision.before, revision.after])];
  for (const row of rows) {
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

function withoutAuthorizedAttribution(file, text, data) {
  attributionRows(data);
  if (file === 'data/prototipovi.json') {
    const copy = JSON.parse(text);
    for (const row of attributionRows(copy)) row.author = { name: '[attributed-author]', ...(Object.hasOwn(row.author, 'studentNumber') ? { studentNumber: '[attributed-number]' } : {}) };
    return JSON.stringify(copy);
  }
  // Renderer source contains template placeholders, not an emitted HTML attribution.
  // Keep source text fully visible to the name/data scan; redact only actual HTML.
  if (!file.endsWith('.html')) return text;
  return text.replace(/<p\b[^>]*\bdata-prototype-attribution="([^"]+)"[^>]*>([\s\S]*?)<\/p>/g, (whole, id, inner) => {
    assert.equal(file, 'prototipovi.html', 'only the canonical gallery publishes attribution');
    const row = data.items.find(item => item.id === id);
    assert.ok(row, 'attribution marker must name an existing prototype');
    const expected = `<span data-author-name>${escape(row.author.name)}</span>${Object.hasOwn(row.author, 'studentNumber') ? `<span data-author-number>${escape(row.author.studentNumber)}</span>` : ''}`;
    assert.equal(inner.trim().replace(/>\s+</g, '><'), expected, 'gallery attribution must match the exact authorized fields');
    return '<p>[attributed-author-fields]</p>';
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
  }
});

test('the attribution exception cannot hide unrelated text, extra identifiers or another page', () => {
  const data = { schema: 'course-prototypes/v1', sources: [{ id: 'fixture-permission' }], items: [{ id: 'fixture-work', author: { name: 'Semir Fixture', studentNumber: '49/24' }, attribution: { sourceId: 'fixture-permission', fields: ['name', 'studentNumber'] } }], revizije: [] };
  const author = '<p class="prototype-author" data-prototype-attribution="fixture-work"><span data-author-name>Semir Fixture</span><span data-author-number>49/24</span></p>';
  assert.doesNotMatch(withoutAuthorizedAttribution('prototipovi.html', author, data), NAMES);
  assert.match(withoutAuthorizedAttribution('prototipovi.html', author + '<p>Dejan</p>', data), NAMES);
  assert.match(withoutAuthorizedAttribution('assets/prototipovi-core.js', author, data), NAMES, 'source literals do not receive an HTML exception');
  assert.throws(() => withoutAuthorizedAttribution('udruzenje.html', author, data), /canonical gallery/);
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
  assert.throws(() => withoutAuthorizedAttribution('index.html', author, data), /canonical gallery/);
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
