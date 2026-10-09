import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { setLanguage } from '../assets/core.js';
import { validatePrototypes, renderPrototypes, prototypeTeaser } from '../assets/prototipovi-core.js';

const root = new URL('../', import.meta.url);
const data = JSON.parse(await readFile(new URL('data/prototipovi.json', root), 'utf8'));
const initial = [
  ['zmijica-2026', 'Zmijica', 'Ivana Simić', '141/2024', 'bd720059492d0db434998c7d2f39923e83d4a3e5a316d4bab93ebfa8130eaa9c'],
  ['muzicka-kutija-2026', 'Muzička Kutija', 'Nikola Pajić', '49/24', 'b287f28a4f0ddf3f036d3ffb4d8e84a61647250836ef7d49cc037ae122205c97'],
  ['zgradica-2026', 'Zgradica', 'Teodora Radojičić', '72/24', '548460e82415964a00ca0ced18618e21db98e1183174cdf199ac60ff1184e4c3'],
  ['sudoku-2026', 'Sudoku', 'Nađa Stanić', '151/24', '0f8dbac6f927a3d4ca052830609b41231fb119b77b4f4b6d3827f138faeecf2a'],
  ['pogodilica-2026', 'Pogodilica', 'Todorić Teodora', '39/24', 'e78005d77caa5ea1ea28b6f755d1518cde2e07070e1cc68bdafe02d6364aa7ac']
];
const clone = () => structuredClone(data);
function additionalWorks() {
  const d = clone(), base = d.items[0];
  const work = (id, kind, authorRole, medium, count) => {
    const item = structuredClone(base);
    Object.assign(item, { id, title: id, kind, authorRole, medium, status: 'documented', documentedWeek: 2, author: { name: `${authorRole} fixture` }, attribution: { sourceId: base.sourceId, fields: ['name'] } });
    delete item.originWeek;
    item.photos = Array.from({ length: count }, (_, i) => ({ ...base.photos[0], id: `${id}-${i + 1}`, src: `data/prototipovi/${id}/${i + 1}.jpg` }));
    return item;
  };
  const drawing = work('fixture-drawing', 'technical-drawing', 'student', 'drawing', 1);
  const teacher = work('fixture-teacher', 'prototype', 'teacher', 'physical', 4);
  d.items.push(drawing, teacher);
  return { d, drawing, teacher };
}
test('the supplied five photographs retain their exact teacher-provided titles and attribution in current or recorded earlier editions', async () => {
  assert.deepEqual(validatePrototypes(data), []);
  for (const [id, title, name, studentNumber, hash] of initial) {
    const editions = [...data.items, ...(data.revizije || []).flatMap(r => [r.before, r.after])].filter(i => i.id === id);
    const edition = editions.find(i => i.title === title && i.author.name === name && i.author.studentNumber === studentNumber && i.photos[0].sha256 === hash);
    assert.ok(edition, 'Preserve the original evidence when revising ' + id);
    assert.equal(createHash('sha256').update(await readFile(new URL(edition.photos[0].src, root))).digest('hex'), hash);
  }
});
test('an additional independent prototype renders without modifying templates or erasing existing records', () => {
  const next = clone(), item = structuredClone(next.items[0]);
  Object.assign(item, { id: 'new-example', title: 'Novi rad' });
  item.photos = item.photos.map(p => ({ ...p, id: 'new-example-photo', src: 'data/prototipovi/new-example/01.jpg' }));
  next.items.push(item);
  assert.deepEqual(validatePrototypes(next), []);
  const html = renderPrototypes(next);
  assert.match(html, /id="new-example"/);
  for (const original of data.items) assert.ok(html.includes(`id="${original.id}"`));
  assert.equal((html.match(/data-prototype-attribution=/g) || []).length, data.items.length + 1);
});
test('documented week is required, positive and never precedes the start of work', () => {
  for (const value of [undefined, null, 0, -1, 1.5, '2', Infinity]) {
    const invalid = clone(); invalid.items[0].documentedWeek = value;
    assert.ok(validatePrototypes(invalid).some(problem => problem.includes('Documented week')));
    assert.throws(() => renderPrototypes(invalid), /Documented week/);
    assert.throws(() => prototypeTeaser(invalid), /Documented week/);
  }
  const invalid = clone(); invalid.items[0].originWeek = 3; invalid.items[0].documentedWeek = 2;
  assert.ok(validatePrototypes(invalid).some(problem => problem.includes('Documented week')));
});
test('cards and summaries distinguish documented material from origin and derive future week links from each record', t => {
  const d = clone();
  for (const item of d.items) { item.originWeek = 1; item.documentedWeek = 2; }
  d.items[1].originWeek = 3; d.items[1].documentedWeek = 4;
  assert.deepEqual(validatePrototypes(d), []);
  t.after(() => setLanguage('sr'));
  for (const language of ['sr', 'en']) {
    setLanguage(language);
    const html = renderPrototypes(d), teaser = prototypeTeaser(d);
    const card = id => html.split(`data-prototype="${id}"`)[1].split('</article>')[0];
    assert.ok(card(d.items[0].id).includes(`href="index.html?w=2">${language === 'sr' ? 'Nedelja' : 'Week'} 2</a>`));
    assert.ok(card(d.items[1].id).includes(`href="index.html?w=4">${language === 'sr' ? 'Nedelja' : 'Week'} 4</a>`));
    assert.ok(card(d.items[0].id).includes(language === 'sr' ? 'izrada započeta u nedelji 1' : 'work begun in week 1'));
    assert.ok(card(d.items[1].id).includes(language === 'sr' ? 'izrada započeta u nedelji 3' : 'work begun in week 3'));
    assert.ok(teaser.includes(language === 'sr' ? 'Dokumentovano: Nedelja 2 · Nedelja 4' : 'Documented: Week 2 · Week 4'));
    assert.ok(!teaser.includes(language === 'sr' ? 'Početak izrade:' : 'Work begun:'), 'the collection summary does not imply a shared start week');
    const context = html.split('<aside class="prototype-context">')[1].split('</aside>')[0];
    assert.ok(context.indexOf('index.html?w=2') < context.indexOf('index.html?w=1'), 'documented material is the primary contextual link');
    for (const week of [1, 2, 3, 4]) assert.ok(context.includes(`href="index.html?w=${week}"`));
  }
});
test('drawings and teacher examples omit unknown personal data and origin without changing the legacy records', t => {
  const { d, drawing, teacher } = additionalWorks();
  assert.deepEqual(d.items.slice(0, data.items.length), data.items);
  assert.deepEqual(validatePrototypes(d), []);
  t.after(() => setLanguage('sr'));
  for (const language of ['sr', 'en']) {
    setLanguage(language);
    const html = renderPrototypes(d), teaser = prototypeTeaser(d);
    const card = id => html.split(`data-prototype="${id}"`)[1].split('</article>')[0];
    const drawingCard = card(drawing.id), teacherCard = card(teacher.id);
    assert.match(drawingCard, /data-work-kind="technical-drawing" data-author-role="student"/);
    assert.match(teacherCard, /data-work-kind="prototype" data-author-role="teacher"/);
    assert.ok(drawingCard.includes(language === 'sr' ? 'Tehnički crtež' : 'Technical drawing'));
    assert.ok(teacherCard.includes(language === 'sr' ? 'Nastavnikov primer' : 'Teacher’s example'));
    assert.doesNotMatch(drawingCard.replace(/class="[^"]*"/g, ''), /Physical prototype|Digital prototype|Fizički prototip|Digitalni prototip/);
    for (const item of [drawing, teacher]) {
      const shown = card(item.id);
      assert.ok(shown.includes(`<span data-author-name>${item.author.name}</span></p>`));
      assert.doesNotMatch(shown, /data-author-number|undefined|null|work begun|izrada započeta/);
      assert.ok(shown.includes(language === 'sr' ? 'Dokumentovan rad' : 'Documented work'));
      assert.match(shown, /href="index.html\?w=2"/);
      assert.equal((shown.match(/<figure class="prototype-photo">/g) || []).length, item.photos.length);
      assert.ok(!teaser.includes(item.author.name), 'the teaser does not duplicate personal attribution');
    }
    assert.ok(html.includes(language === 'sr' ? 'Radovi i primeri.' : 'Works and examples.'));
    assert.doesNotMatch(teaser, /undefined|null|Work begun|Početak izrade/);
    const onlyNew = { ...d, items: [drawing, teacher], revizije: [], observations: [] };
    assert.deepEqual(validatePrototypes(onlyNew), []);
    assert.doesNotMatch(renderPrototypes(onlyNew), /index\.html\?w=1(?:"|&)/, 'unknown origin is never replaced with week one');
  }
});
test('optional identity and origin fields must be omitted or contain valid explicitly attributed values', () => {
  for (const mutate of [
    i => { i.author.studentNumber = ''; i.attribution.fields.push('studentNumber'); },
    i => { i.author.studentNumber = null; i.attribution.fields.push('studentNumber'); },
    i => { i.author.studentNumber = 49; i.attribution.fields.push('studentNumber'); },
    i => { i.author.studentNumber = '49/24'; },
    i => { i.attribution.fields.push('studentNumber'); },
    i => { i.attribution.fields = ['name', 'name']; },
    i => { i.author.role = 'student'; },
    i => { i.authorRole = 'approved'; },
    i => { i.authorRole = null; },
    i => { i.kind = 'approved-device'; },
    i => { i.kind = null; },
    ...[undefined, null, 0, -1, 1.5, '1', Infinity, 3].map(value => i => { i.originWeek = value; })
  ]) {
    const { d, drawing } = additionalWorks(); mutate(drawing);
    assert.ok(validatePrototypes(d).length, 'reject invalid or mismatched optional evidence');
    assert.throws(() => renderPrototypes(d));
  }
  const { d, drawing } = additionalWorks();
  drawing.author.studentNumber = '0049/24'; drawing.attribution.fields.push('studentNumber'); drawing.originWeek = 1;
  assert.deepEqual(validatePrototypes(d), []);
  assert.match(renderPrototypes(d), /data-author-number>0049\/24<\/span>/, 'supplied formatting is preserved');
});
test('display-only rotation preserves source bytes metadata and is identical in gallery and teaser', () => {
  for (const rotation of [-90, 90, 180]) {
    const { d, drawing } = additionalWorks(), p = drawing.photos[0];
    Object.assign(p, { width: 1000, height: 2000, rotation });
    const before = structuredClone(d);
    assert.deepEqual(validatePrototypes(d), []);
    const gallery = renderPrototypes(d), teaser = prototypeTeaser(d);
    const ratio = rotation === 180 ? '1000/2000' : '2000/1000';
    const dimensions = rotation === 180 ? '--rotated-width:100%;--rotated-height:100%' : '--rotated-width:50%;--rotated-height:200%';
    const wrapper = `<span class="prototype-image rotated-image" style="aspect-ratio:${ratio};--rotation:${rotation}deg;${dimensions}">`;
    for (const html of [gallery, teaser]) {
      assert.ok(html.includes(wrapper));
      assert.ok(html.includes(`<img src="${p.src}" width="1000" height="2000"`));
    }
    assert.ok(gallery.includes(`<a href="${p.src}"`), 'full image link remains the unchanged original');
    assert.deepEqual(d, before, 'rendering never changes original src, SHA, dimensions or history');
  }
  for (const rotation of [undefined, null, 0, 45, -180, 270, '-90', '-90deg;display:none']) {
    const { d, drawing } = additionalWorks(); drawing.photos[0].rotation = rotation;
    assert.ok(validatePrototypes(d).some(problem => problem.includes('rotation')));
    assert.throws(() => renderPrototypes(d), /rotation/);
    assert.throws(() => prototypeTeaser(d), /rotation/);
  }
});
test('invalid attribution, duplicates, foreign fields and unsafe photo paths are rejected', () => {
  for (const mutate of [
    d => { d.items[0].attribution = null; },
    d => { d.items[0].attribution.sourceId = 'unknown-source'; },
    d => { d.items[0].author.email = 'private@example.invalid'; },
    d => { d.items.push(structuredClone(d.items[0])); },
    d => { d.items[0].photos[0].src = '../private.jpg'; },
    d => { d.items[0].photos[0].src = 'https://example.invalid/track.jpg'; },
    d => { d.items[0].photos[0].sha256 = 'unverified'; },
    d => { d.items[0].photos[0].width = 0; },
    d => { d.items[0].description.en = ''; },
    d => { d.items[0].status = 'approved-for-users'; }
  ]) { const invalid = clone(); mutate(invalid); assert.ok(validatePrototypes(invalid).length); assert.throws(() => renderPrototypes(invalid)); }
});
test('source text is escaped rather than executed in names, descriptions and captions', () => {
  const d = clone(); d.items[0].title = '<script>alert(1)</script>';
  d.items[0].author.name = '<img src=x onerror=alert(1)>';
  d.items[0].description.sr = '<b>untrusted</b>';
  d.items[0].photos[0].alt.sr = '" onerror="alert(1)';
  setLanguage('sr'); const html = renderPrototypes(d);
  assert.ok(!html.includes('<script>')); assert.ok(!html.includes('<img src=x')); assert.ok(html.includes('&lt;b&gt;untrusted&lt;/b&gt;'));
  assert.ok(html.includes('&quot; onerror=&quot;alert(1)'));
});
test('association-use observations need their own date, source, photograph and publication context', () => {
  const d = clone();
  const event = { id: 'observation-example', prototypeId: d.items[0].id, kind: 'association-use', occurredOn: '2026-10-15', sourceId: d.sources[0].id, summary: { sr: 'Zabeleženo opažanje.', en: 'Recorded observation.' }, photos: [{ ...d.items[0].photos[0], id: 'observation-photo', src: 'data/prototipovi/observation-example/01.jpg' }], publication: { sourceId: d.sources[0].id, scope: 'association-observation' } };
  d.observations.push(event); assert.deepEqual(validatePrototypes(d), []);
  setLanguage('sr'); assert.match(renderPrototypes(d), /Zapažanja iz udruženja/);
  for (const key of ['occurredOn', 'sourceId', 'publication', 'prototypeId']) { const invalid = structuredClone(d); delete invalid.observations[0][key]; assert.ok(validatePrototypes(invalid).length); }
  d.observations[0].occurredOn = '2026-02-31'; assert.ok(validatePrototypes(d).length);
});
test('static, live and translated views preserve every author and prototype; summaries use the same registry', async () => {
  setLanguage('sr');
  for (const [file, marker, expected] of [['prototipovi.html', 'prototipovi', renderPrototypes(data)], ['index.html', 'prototype-teaser', prototypeTeaser(data)], ['sledeci.html', 'prototype-teaser', prototypeTeaser(data)]]) {
    const html = await readFile(new URL(file, root), 'utf8');
    assert.equal(html.split(`<!-- ${marker}:start -->`)[1].split(`<!-- ${marker}:end -->`)[0], expected);
  }
  setLanguage('en'); const english = renderPrototypes(data);
  assert.match(english, /Works and examples/);
  for (const item of data.items) { assert.ok(english.includes(item.author.name)); if (item.author.studentNumber !== undefined) assert.ok(english.includes(item.author.studentNumber)); assert.ok(english.includes(item.title)); }
  setLanguage('sr');
});
