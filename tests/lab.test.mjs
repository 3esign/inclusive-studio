// The labs produce numbers that students will quote in a review. The arithmetic is tested against
// the published thresholds — WCAG 2.2 and Pravilnik RS 22/2015 — not against what looks plausible.
import test from 'node:test';
import assert from 'node:assert/strict';

const load = name => import(new URL(`../assets/${name}`, import.meta.url).href);
const lab = await load('lab-core.js');
const {
  contrastRatio, contrastVerdict, targetVerdict, relativeLuminance, parseColor,
  speak, stepsTo, bestRoute, auditNodes, scanCost, scanTotal, coverage, CHANNELS, PROFILES,
  analyzePlan, analyzeRamp, plainness, labs, labById,
  CELL_CM, CHAIR_CM, TURN_CM, DOOR_MIN_CM, CORRIDOR_ONE_WAY_CM
} = lab;

/* ---------- contrast ---------- */
test('contrast matches the WCAG formula at its known extremes', () => {
  assert.equal(contrastRatio('#000000', '#ffffff'), 21);
  assert.equal(contrastRatio('#ffffff', '#ffffff'), 1);
  assert.equal(contrastRatio('#000', '#fff'), 21, 'three-digit hex is accepted');
  assert.equal(contrastRatio('nonsense', '#fff'), null);
  assert.ok(Math.abs(relativeLuminance(parseColor('#ffffff')) - 1) < 1e-9);
});

test('4,5:1 is the floor for normal text and 3:1 for large text and icons', () => {
  // #767676 on white is the canonical 4,54:1 example.
  const ratio = contrastRatio('#767676', '#ffffff');
  assert.ok(ratio >= 4.5 && ratio < 4.6, String(ratio));
  assert.equal(contrastVerdict(ratio).pass, true);
  assert.equal(contrastVerdict(ratio).level, 'AA');
  const weak = contrastRatio('#949494', '#ffffff');
  assert.equal(contrastVerdict(weak).pass, false);
  assert.equal(contrastVerdict(weak, { large: true }).pass, true, '3:1 is enough for large text');
  assert.equal(contrastVerdict(weak, { nonText: true }).pass, true);
  assert.equal(contrastVerdict(21).level, 'AAA');
  assert.equal(contrastVerdict(null).pass, false);
});

/* ---------- target size, 2.5.8 and 2.5.5 ---------- */
test('a target passes at 24 px, or smaller only with spacing', () => {
  assert.equal(targetVerdict(24, 24).minimum, true);
  assert.equal(targetVerdict(23, 23).minimum, false);
  assert.equal(targetVerdict(20, 20, 6).minimum, true);
  assert.equal(targetVerdict(20, 20, 6).spacingUsed, true);
  assert.equal(targetVerdict(44, 44).enhanced, true);
  assert.equal(targetVerdict(44, 24).enhanced, false, 'the smallest side decides');
});

/* ---------- screen reader ---------- */
test('the machine says the role and the name, and the file name when there is no description', () => {
  assert.equal(speak({ role: 'heading', level: 2, name: { en: 'Deadline' } }, 'en'), 'heading level 2, Deadline');
  assert.equal(speak({ role: 'button', name: { en: 'Book' } }, 'en'), 'button, Book');
  assert.equal(speak({ role: 'image', file: 'dsc_0423.jpg' }, 'en'), 'image, no description: dsc_0423.jpg');
  assert.equal(speak({ role: 'image', name: { sr: 'Osnova prizemlja' } }, 'sr'), 'slika, Osnova prizemlja');
  assert.equal(speak({ role: 'link', name: '' }, 'en'), 'link, unnamed');
  assert.equal(speak({ role: 'unknown', name: { en: 'Book' } }, 'en'), 'clickable, no name, Book');
});

test('headings shorten the route, and their absence is the finding', () => {
  const structured = [
    { role: 'landmark', name: { en: 'main' } },
    { role: 'heading', level: 1, name: { en: 'Enrolment' } },
    { role: 'text', name: { en: 'body' } },
    { role: 'heading', level: 2, name: { en: 'Deadline' } },
    { role: 'text', name: { en: '15 October' } }
  ];
  const flat = [
    { role: 'text', name: { en: 'ENROLMENT' } }, { role: 'image', file: 'a.png' },
    { role: 'text', name: { en: 'body' } }, { role: 'text', name: { en: 'Rok' } },
    { role: 'text', name: { en: '15 October' } }
  ];
  assert.equal(stepsTo(structured, 4, 'element'), 5);
  assert.equal(stepsTo(structured, 3, 'heading'), 2);
  assert.ok(stepsTo(structured, 4, 'heading') < stepsTo(flat, 4, 'element') + 1);
  assert.equal(bestRoute(structured, 3).mode, 'heading');
  assert.equal(bestRoute(flat, 4).steps, 5, 'with no structure only element-by-element remains');
  assert.equal(stepsTo(structured, 99, 'element'), null);

  const problems = auditNodes(flat).map(problem => problem.code);
  assert.ok(problems.includes('image-no-alt'));
  assert.ok(problems.includes('no-headings'));
  assert.ok(problems.includes('no-landmarks'));
  assert.deepEqual(auditNodes(structured).map(p => p.code), [], 'the structured version has nothing to report');
});

/* ---------- one switch ---------- */
test('scanning costs what the order costs', () => {
  assert.deepEqual(scanCost(8, 0), { presses: 1, waits: 0, total: 1 });
  assert.equal(scanCost(8, 7).total, 8, 'the last item of a linear scan costs eight');
  assert.equal(scanCost(8, 7, { mode: 'group', groupSize: 4 }).total, 6, 'grouping is cheaper than the eight presses a linear scan costs');
  assert.equal(scanCost(8, 9), null);
  const order = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const front = scanTotal(order, ['a', 'b']);
  const back = scanTotal(order, ['g', 'h']);
  assert.ok(front < back, 'what is used most belongs at the top');
});

/* ---------- channels ---------- */
test('one channel always leaves somebody out; redundancy is the rule', () => {
  const siren = coverage(['siren']);
  assert.equal(siren.pass, false);
  assert.ok(siren.uncovered.includes('no-sound'), 'a siren does not reach someone who does not hear it');
  const everything = coverage(CHANNELS.map(channel => channel.id));
  assert.equal(everything.pass, true);
  assert.equal(everything.rows.length, PROFILES.length);
  for (const row of everything.rows) assert.ok(row.count >= 2);
  const none = coverage([]);
  assert.equal(none.uncovered.length, PROFILES.length);
});

/* ---------- plan geometry ---------- */
const plan = values => {
  const W = 800, H = 500, T = 10;
  const bottom = T + values.corridor;
  const wcLeft = W - T - values.wc;
  return {
    w: W, h: H,
    walls: [
      [0, 0, W, T], [0, H - T, W, T], [0, 0, T, H], [W - T, 0, T, H],
      [T, bottom, Math.max(0, values.doorX - T), T],
      [values.doorX + values.door, bottom, Math.max(0, W - T - values.doorX - values.door), T],
      [wcLeft, bottom + T, T, H - T - bottom - T]
    ],
    start: [60, T + values.corridor / 2],
    goal: [W - T - values.wc / 2, (bottom + T + H - T) / 2]
  };
};

test('a 70 cm corridor and a 70 cm door fail, and the report says by how much', () => {
  const result = analyzePlan(plan({ corridor: 70, door: 70, doorX: 240, wc: 130 }));
  assert.equal(result.pass, false);
  const codes = result.problems.map(problem => problem.code);
  assert.ok(codes.includes('no-route') || codes.includes('too-narrow'), JSON.stringify(result.problems));
  for (const problem of result.problems.filter(p => p.code === 'too-narrow' || p.code === 'no-turning-circle')) {
    assert.equal(typeof problem.cm, 'number');
    assert.ok(problem.needed > 0);
  }
});

test('widen the corridor, the door and the toilet and the route appears and turns', () => {
  const result = analyzePlan(plan({ corridor: 150, door: 90, doorX: 620, wc: 220 }));
  assert.equal(result.reachable, true);
  assert.ok(result.narrowestCm >= CORRIDOR_ONE_WAY_CM, String(result.narrowestCm));
  assert.ok(result.turnCm >= TURN_CM, String(result.turnCm));
  assert.equal(result.pass, true);
  assert.ok(result.path.length > 10);
});

test('the grid measures a gap exactly, because that is what a door is', () => {
  // A corridor pinched to exactly 90 cm by two walls must measure 90 cm.
  const pinched = {
    w: 600, h: 400,
    walls: [[0, 0, 600, 10], [0, 390, 600, 10], [0, 0, 10, 400], [590, 0, 10, 400], [300, 10, 10, 150], [300, 250, 10, 140]],
    start: [60, 200], goal: [500, 200]
  };
  const result = analyzePlan(pinched);
  assert.equal(result.narrowestCm, 90);
  assert.equal(CELL_CM, 10);
  assert.equal(CHAIR_CM, 80);
  assert.equal(DOOR_MIN_CM, 80);
});

test('a destination behind a wall is reported as unreachable, not as narrow', () => {
  const sealed = {
    w: 400, h: 300,
    walls: [[0, 0, 400, 10], [0, 290, 400, 10], [0, 0, 10, 300], [390, 0, 10, 300], [200, 10, 10, 280]],
    start: [60, 150], goal: [330, 150]
  };
  const result = analyzePlan(sealed);
  assert.equal(result.reachable, false);
  assert.equal(result.narrowestCm, null);
  assert.ok(result.problems.some(problem => problem.code === 'no-route'));
});

/* ---------- the arithmetic of height ---------- */
test('a 5 % ramp for 22,5 m is 450 m of walking, and it does not fit on the plot', () => {
  const result = analyzeRamp({ riseCm: 2250, slopePercent: 5, availableLengthCm: 15100 });
  assert.equal(result.runCm, 45000);
  assert.equal(result.maxRunCm, 900, 'at 5 % a flight may run up to 9 m between landings');
  assert.equal(result.landings, 49);
  assert.equal(result.totalCm, 45000 + 49 * 150);
  assert.equal(result.slopeOk, true);
  assert.equal(result.usesException, false);
  assert.equal(result.fits, false);
  assert.ok(result.shortfallCm > 30000);
});

test('8,3 % is the exception and is flagged as one; above it is not a ramp', () => {
  const exception = analyzeRamp({ riseCm: 120, slopePercent: 8.3, availableLengthCm: 3000 });
  assert.equal(exception.usesException, true);
  assert.equal(exception.overLimit, false);
  assert.equal(exception.maxRunCm, 600);
  assert.equal(exception.runCm, Math.round(120 / 0.083));
  const tooSteep = analyzeRamp({ riseCm: 120, slopePercent: 10 });
  assert.equal(tooSteep.overLimit, true);
  assert.equal(tooSteep.slopeOk, false);
  assert.equal(analyzeRamp({ riseCm: 0, slopePercent: 5 }), null);
});

test('a short ramp needs no landing', () => {
  const result = analyzeRamp({ riseCm: 30, slopePercent: 5, availableLengthCm: 1000 });
  assert.equal(result.landings, 0);
  assert.equal(result.flights, 1);
  assert.equal(result.fits, true);
});

/* ---------- time and language ---------- */
test('plainness measures length and says that is all it measures', () => {
  const heavy = plainness('U skladu sa odredbama odluke o uređenju postupka realizacije obaveza upisa, obaveštavaju se kandidati da su u obavezi da izvrše dostavljanje kompletne dokumentacije u propisanom roku.');
  const plain = plainness('Donesi sve dokumente do roka.');
  assert.equal(heavy.verdict, 'heavy');
  assert.equal(plain.verdict, 'plain');
  assert.ok(heavy.longWordShare > plain.longWordShare);
  assert.equal(plainness('').verdict, 'empty');
  assert.ok(plain.caveat.sr.includes('ne mera razumljivosti'));
});

/* ---------- the register ---------- */
test('every lab declares what it tests, what it measures and against which standard', () => {
  assert.equal(labs.length, 8);
  const ids = new Set();
  for (const item of labs) {
    assert.ok(!ids.has(item.id), 'duplicate lab id ' + item.id);
    ids.add(item.id);
    for (const field of ['title', 'aim', 'measures', 'tests']) {
      assert.ok(item[field]?.en && item[field]?.sr, `${item.id}: ${field} must be bilingual`);
    }
    assert.ok(item.standard.length > 5, item.id);
    assert.ok(Number.isInteger(item.minutes) && item.minutes >= 5, item.id);
  }
  assert.equal(labById('prolaz').id, 'prolaz');
  assert.equal(labById('nothing'), null);
});

test('no lab claims to simulate a person', async () => {
  const { readFile } = await import('node:fs/promises');
  const source = await readFile(new URL('../assets/labs.js', import.meta.url), 'utf8');
  assert.ok(source.includes('Nario-Redmond'), 'the framing must cite the evidence against simulations');
  for (const item of labs) {
    const words = (item.aim.en + ' ' + item.title.en).toLowerCase();
    assert.ok(!words.includes('simulate'), item.id);
    assert.ok(!words.includes('what it feels like'), item.id);
    assert.ok(!words.includes('pretend'), item.id);
  }
});
