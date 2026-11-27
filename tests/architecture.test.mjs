// Architectural Knowledge, Spatial Standards, Precedents and Engineering Calculations Test Suite
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';

const load = name => import(new URL(`../assets/${name}`, import.meta.url).href);
const arch = await load('architecture.js');
const lab = await load('lab-core.js');

const { SPATIAL_STANDARDS, SEVEN_PRINCIPLES, DEAFSPACE_PATTERNS, ASPECTSS_INDEX, PRECEDENTS, VISUAL_ATLAS } = arch;
const { analyzeAcoustics, analyzeLRV, analyzeManeuvering } = lab;

const root = new URL('../', import.meta.url);
const bilingual = value => value && typeof value.en === 'string' && typeof value.sr === 'string' && value.en.trim() && value.sr.trim();

test('spatial standards cover all mandatory Rulebook articles with verified vector diagrams', async () => {
  assert.ok(SPATIAL_STANDARDS.length >= 6, 'at least 6 spatial standards');
  const requiredIds = ['rampa', 'taktilne-staze', 'hodnici', 'vrata', 'manevarski-prostor', 'toalet'];
  for (const id of requiredIds) {
    const item = SPATIAL_STANDARDS.find(s => s.id === id);
    assert.ok(item, `missing standard ${id}`);
    assert.ok(bilingual(item.title), `${id} title must be bilingual`);
    assert.ok(item.article.includes('čl.'), `${id} must cite article`);
    assert.ok(item.regulation.includes('Pravilnik RS'), `${id} must cite Serbian regulation`);
    assert.ok(item.rules.length >= 3, `${id} must have multiple rules`);
    for (const rule of item.rules) {
      assert.ok(bilingual(rule), `${id} rule must be bilingual`);
    }
    if (item.visual) {
      assert.ok(item.visual.endsWith('.svg'), `${id} visual must be SVG`);
      await access(new URL(item.visual, root));
    }
  }
});

test('seven principles of universal design are operationalized with rules and failure modes', () => {
  assert.equal(SEVEN_PRINCIPLES.length, 7, 'exactly 7 principles');
  for (let i = 0; i < 7; i++) {
    const p = SEVEN_PRINCIPLES[i];
    assert.equal(p.n, i + 1);
    assert.ok(bilingual(p.title), `principle ${i+1} title`);
    assert.ok(bilingual(p.definition), `principle ${i+1} definition`);
    assert.ok(bilingual(p.rule), `principle ${i+1} rule`);
    assert.ok(bilingual(p.fail), `principle ${i+1} fail`);
  }
});

test('DeafSpace patterns cover the five core dimensions of visual and spatial communication', () => {
  assert.equal(DEAFSPACE_PATTERNS.length, 5, '5 DeafSpace dimensions');
  const ids = ['space-proximity', 'sensory-reach', 'mobility-proximity', 'light-color', 'acoustics'];
  for (const id of ids) {
    const item = DEAFSPACE_PATTERNS.find(d => d.id === id);
    assert.ok(item, `missing pattern ${id}`);
    assert.ok(bilingual(item.title), `${id} title`);
    assert.ok(bilingual(item.body), `${id} body`);
  }
});

test('Autism ASPECTSS index covers all seven evidence-based architectural criteria', () => {
  assert.equal(ASPECTSS_INDEX.length, 7, '7 ASPECTSS criteria');
  const letters = ASPECTSS_INDEX.map(a => a.letter).join('');
  assert.equal(letters, 'ASPECTS', 'matches ASPECTSS acronym');
  for (const item of ASPECTSS_INDEX) {
    assert.ok(bilingual(item.title), `${item.letter} title`);
    assert.ok(bilingual(item.body), `${item.letter} body`);
  }
});

test('built precedents document canonical universal architecture with verified metrics', () => {
  assert.ok(PRECEDENTS.length >= 6, 'at least 6 precedent studies');
  const required = ['ed-roberts-campus', 'helsinki-oodi', 'gallaudet-sorensen', 'acropolis-museum', 'hazelwood-school', 'msub-beograd'];
  for (const id of required) {
    const p = PRECEDENTS.find(x => x.id === id);
    assert.ok(p, `missing precedent ${id}`);
    assert.ok(bilingual(p.title), `${id} title`);
    assert.ok(bilingual(p.category), `${id} category`);
    assert.ok(bilingual(p.hero), `${id} hero`);
    assert.ok(bilingual(p.lesson), `${id} lesson`);
    assert.ok(p.measured.length >= 3, `${id} must have measured data`);
    for (const m of p.measured) assert.ok(bilingual(m), `${id} measurement`);
  }
});

test('visual atlas contains valid vector SVGs with dimensions and standard citations', async () => {
  assert.ok(VISUAL_ATLAS.length >= 5, 'at least 5 visual atlas items');
  for (const v of VISUAL_ATLAS) {
    assert.ok(bilingual(v.title), `${v.id} title`);
    assert.ok(bilingual(v.summary), `${v.id} summary`);
    assert.ok(v.file.endsWith('.svg'), `${v.id} file`);
    const svgPath = new URL(v.file, root);
    const content = await readFile(svgPath, 'utf8');
    assert.ok(content.includes('<svg'), `${v.file} must contain svg tag`);
    assert.ok(content.includes('viewBox='), `${v.file} must declare viewBox`);
    assert.ok(content.includes('</svg>'), `${v.file} must be closed`);
  }
});

test('Sabine reverberation calculation computes RT60 and required acoustic treatment', () => {
  // Volume: 100 m³, Plaster/concrete surface: 160 m² (absorption coeff 0.02 -> A = 3.2 m² Sabins)
  // RT60 = 0.161 * 100 / 3.2 = 5.03 s (highly reverberant!)
  const result = analyzeAcoustics({
    volumeM3: 100,
    surfaces: [{ material: 'plaster_concrete', areaM2: 160 }],
    roomType: 'classroom'
  });
  assert.ok(result.rt60 > 2.0, `RT60 should be reverberant: ${result.rt60}`);
  assert.equal(result.pass, false);
  assert.ok(result.neededPanelsM2 > 0, 'must compute panel treatment needed');

  // Now treated with acoustic panels (coeff 0.75):
  // 120 m² plaster (120*0.02 = 2.4) + 40 m² acoustic_panel (40*0.75 = 30) -> A = 32.4
  // RT60 = 0.161 * 100 / 32.4 = 0.50 s <= 0.60 s target
  const treated = analyzeAcoustics({
    volumeM3: 100,
    surfaces: [
      { material: 'plaster_concrete', areaM2: 120 },
      { material: 'acoustic_panel', areaM2: 40 }
    ],
    roomType: 'classroom'
  });
  assert.ok(treated.rt60 <= 0.60, `Treated RT60 should be <= 0.60s: ${treated.rt60}`);
  assert.equal(treated.pass, true);
  assert.equal(treated.neededPanelsM2, 0);

  // Invalid input safely handled
  const empty = analyzeAcoustics({ volumeM3: 0, surfaces: [] });
  assert.equal(empty, null);
});

test('LRV luminance difference evaluates visual accessibility thresholds', () => {
  // White ceiling / wall (LRV 85) vs dark door frame (LRV 20) -> Delta = 65 (complies)
  const highContrast = analyzeLRV({ lrvForeground: 85, lrvBackground: 20 });
  assert.equal(highContrast.deltaLRV, 65);
  assert.equal(highContrast.pass, true);
  assert.equal(highContrast.level, 'enhanced');

  // Grey wall (LRV 50) vs light grey trim (LRV 40) -> Delta = 10 (fails)
  const lowContrast = analyzeLRV({ lrvForeground: 50, lrvBackground: 40 });
  assert.equal(lowContrast.deltaLRV, 10);
  assert.equal(lowContrast.pass, false);
  assert.equal(lowContrast.level, 'fail');

  // Delta 35 complies for standard (>=30) but fails for low vision (>=40)
  const standardOnly = analyzeLRV({ lrvForeground: 65, lrvBackground: 30, isLowVision: false });
  assert.equal(standardOnly.pass, true);
  assert.equal(standardOnly.level, 'standard');

  const lowVisionFail = analyzeLRV({ lrvForeground: 65, lrvBackground: 30, isLowVision: true });
  assert.equal(lowVisionFail.pass, false);
});

test('maneuvering calculations verify corridor and door approach clearances', () => {
  // Compliant: 150 cm corridor, 95 cm door, frontal approach
  const good = analyzeManeuvering({
    corridorWidthCm: 150,
    doorClearWidthCm: 95,
    approachType: 'frontal'
  });
  assert.equal(good.doorPass, true);
  assert.equal(good.corridorPass, true);
  assert.equal(good.pass, true);

  // Non-compliant door: 80 cm (< 90 cm statutory minimum)
  const badDoor = analyzeManeuvering({
    corridorWidthCm: 150,
    doorClearWidthCm: 80,
    approachType: 'frontal'
  });
  assert.equal(badDoor.doorPass, false);
  assert.equal(badDoor.pass, false);

  // Non-compliant corridor: 100 cm (< 120 cm statutory minimum)
  const badCorridor = analyzeManeuvering({
    corridorWidthCm: 100,
    doorClearWidthCm: 90,
    approachType: 'frontal'
  });
  assert.equal(badCorridor.corridorPass, false);
  assert.equal(badCorridor.pass, false);
});
