// Laboratory — the measuring part, with no DOM in it.
// Every lab tests a tool, an interface or a geometry. None of them simulates being a person:
// after simulations people report more empathy but also more pity, and they are not more willing
// to work with disabled people (Nario-Redmond et al., Rehabilitation Psychology, 2017).
// What measurably works: structured exercises with the real tools plus a debrief, and above all
// direct work with disabled coauthors. The labs are the warm-up; the coauthor is the measure.

/* ------------------------------------------------------------------ *
 * 1. Contrast and target size — arithmetic from WCAG 2.2
 * ------------------------------------------------------------------ */
export function parseColor(value) {
  const text = String(value || '').trim();
  const hex = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(text);
  if (!hex) return null;
  let digits = hex[1];
  if (digits.length === 3) digits = digits.split('').map(c => c + c).join('');
  return [0, 2, 4].map(i => parseInt(digits.slice(i, i + 2), 16));
}

export function relativeLuminance(rgb) {
  const [r, g, b] = rgb.map(channel => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(foreground, background) {
  const a = parseColor(foreground), b = parseColor(background);
  if (!a || !b) return null;
  const l1 = relativeLuminance(a), l2 = relativeLuminance(b);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  return Math.round(ratio * 100) / 100;
}

// WCAG 2.2: 1.4.3 text 4.5:1 (AA) and 3:1 for large text; 1.4.6 7:1 (AAA); 1.4.11 non-text 3:1.
export function contrastVerdict(ratio, { large = false, nonText = false } = {}) {
  if (ratio === null) return { pass: false, level: 'none', needed: null, reason: 'colour not understood' };
  const needed = nonText ? 3 : large ? 3 : 4.5;
  const aaa = nonText ? 3 : large ? 4.5 : 7;
  return {
    pass: ratio >= needed,
    level: ratio >= aaa ? 'AAA' : ratio >= needed ? 'AA' : 'fail',
    needed, aaa, ratio
  };
}

// WCAG 2.2: 2.5.8 Target Size (Minimum) AA = 24 × 24 CSS px, or smaller with 24 px spacing.
// 2.5.5 Target Size (Enhanced) AAA = 44 × 44.
export function targetVerdict(width, height, spacing = 0) {
  const w = Number(width) || 0, h = Number(height) || 0, s = Number(spacing) || 0;
  const smallest = Math.min(w, h);
  const effective = smallest + s;
  return {
    smallest, effective,
    minimum: smallest >= 24 || effective >= 24,
    enhanced: smallest >= 44,
    spacingUsed: smallest < 24 && effective >= 24
  };
}

/* ------------------------------------------------------------------ *
 * 2. Screen reader: what the machine actually says, and how many steps it costs
 * ------------------------------------------------------------------ */
const ROLE_WORDS = {
  heading: { en: 'heading level', sr: 'naslov nivo' },
  link: { en: 'link', sr: 'veza' },
  button: { en: 'button', sr: 'taster' },
  image: { en: 'image', sr: 'slika' },
  text: { en: '', sr: '' },
  list: { en: 'list, items:', sr: 'lista, stavki:' },
  field: { en: 'edit field', sr: 'polje za unos' },
  landmark: { en: 'region', sr: 'oblast' },
  table: { en: 'table', sr: 'tabela' },
  unknown: { en: 'clickable, no name', sr: 'može se aktivirati, bez imena' }
};

// One node → one utterance. An unnamed control is announced as what it is: nothing useful.
export function speak(node, lang = 'en') {
  const word = (ROLE_WORDS[node.role] || ROLE_WORDS.unknown)[lang];
  const name = node.name && typeof node.name === 'object' ? (node.name[lang] ?? node.name.en ?? '') : (node.name || '');
  switch (node.role) {
    case 'heading': return `${word} ${node.level || 2}, ${name}`;
    case 'image': return name ? `${word}, ${name}` : (lang === 'sr' ? 'slika, bez opisa: ' : 'image, no description: ') + (node.file || 'image');
    case 'link': case 'button': case 'field': case 'landmark': case 'table':
      return name ? `${word}, ${name}` : `${word}, ${lang === 'sr' ? 'bez imena' : 'unnamed'}`;
    case 'list': return `${word} ${node.count ?? 0}`;
    case 'unknown': return word + (name ? `, ${name}` : '');
    default: return name;
  }
}

export const NAV_MODES = ['element', 'heading', 'link', 'landmark'];

export function matchesMode(node, mode) {
  if (mode === 'element') return true;
  if (mode === 'heading') return node.role === 'heading';
  if (mode === 'link') return node.role === 'link' || node.role === 'button';
  if (mode === 'landmark') return node.role === 'landmark';
  return true;
}

// The cheapest honest route to a node: how many key presses in the best available mode.
// A document without headings or landmarks leaves only "next element", and that is the finding.
export function stepsTo(nodes, targetIndex, mode = 'element') {
  if (targetIndex < 0 || targetIndex >= nodes.length) return null;
  let steps = 0;
  for (let i = 0; i <= targetIndex; i++) if (matchesMode(nodes[i], mode)) steps++;
  if (!matchesMode(nodes[targetIndex], mode)) {
    // Land on the nearest earlier stop in this mode, then walk element by element.
    let anchor = -1;
    for (let i = targetIndex; i >= 0; i--) if (matchesMode(nodes[i], mode)) { anchor = i; break; }
    if (anchor === -1) return stepsTo(nodes, targetIndex, 'element');
    return stepsTo(nodes, anchor, mode) + (targetIndex - anchor);
  }
  return steps;
}

export function bestRoute(nodes, targetIndex) {
  return NAV_MODES.map(mode => ({ mode, steps: stepsTo(nodes, targetIndex, mode) }))
    .filter(entry => entry.steps !== null)
    .sort((a, b) => a.steps - b.steps)[0];
}

// Problems a screen reader exposes and the eye does not.
export function auditNodes(nodes) {
  const problems = [];
  nodes.forEach((node, index) => {
    if (node.role === 'image' && !node.name) problems.push({ index, code: 'image-no-alt' });
    if (node.role === 'unknown') problems.push({ index, code: 'clickable-not-a-button' });
    if ((node.role === 'link' || node.role === 'button' || node.role === 'field') && !node.name) problems.push({ index, code: 'control-unnamed' });
  });
  if (!nodes.some(node => node.role === 'heading')) problems.push({ index: -1, code: 'no-headings' });
  if (!nodes.some(node => node.role === 'landmark')) problems.push({ index: -1, code: 'no-landmarks' });
  return problems;
}

/* ------------------------------------------------------------------ *
 * 3. Switch scanning: the price of the order you chose
 * ------------------------------------------------------------------ */
// A single switch with an automatic scan: the user waits, then presses. One press = one activation.
// Linear scanning costs one press per item passed; group scanning costs a press for the group
// and a press for the item. Ordering is a design decision with a measurable price.
export function scanCost(count, targetIndex, { mode = 'linear', groupSize = 4 } = {}) {
  if (!Number.isInteger(targetIndex) || targetIndex < 0 || targetIndex >= count) return null;
  if (mode === 'linear') return { presses: 1, waits: targetIndex, total: targetIndex + 1 };
  const group = Math.floor(targetIndex / groupSize);
  const inGroup = targetIndex % groupSize;
  return { presses: 2, waits: group + inGroup, total: group + inGroup + 2 };
}

export function scanTotal(order, targets, options) {
  return targets.reduce((sum, name) => {
    const index = order.indexOf(name);
    const cost = scanCost(order.length, index, options);
    return sum + (cost ? cost.total : 0);
  }, 0);
}

/* ------------------------------------------------------------------ *
 * 4. Perceptible information: who gets nothing
 * ------------------------------------------------------------------ */
export const CHANNELS = [
  { id: 'siren', en: 'Siren', sr: 'Sirena', reaches: ['no-screen', 'reads-slowly', 'no-language', 'hands-busy'] },
  { id: 'voice', en: 'Spoken announcement', sr: 'Govorna najava', reaches: ['no-screen', 'reads-slowly', 'hands-busy'] },
  { id: 'strobe', en: 'Visual strobe', sr: 'Svetlosni blic', reaches: ['no-sound', 'no-language', 'reads-slowly', 'hands-busy'] },
  { id: 'screen', en: 'Text on a screen', sr: 'Tekst na ekranu', reaches: ['no-sound', 'hands-busy'] },
  { id: 'pager', en: 'Vibrating pager', sr: 'Vibracioni prijemnik', reaches: ['no-sound', 'no-screen', 'no-language', 'reads-slowly'] },
  { id: 'person', en: 'A person who comes to tell you', sr: 'Osoba koja dođe da kaže', reaches: ['no-sound', 'no-screen', 'reads-slowly', 'no-language', 'hands-busy'] },
  { id: 'tactile', en: 'Tactile plan at the exit', sr: 'Taktilni plan kod izlaza', reaches: ['no-screen', 'no-language', 'no-sound'] }
];

export const PROFILES = [
  { id: 'no-sound', en: 'Does not hear the siren', sr: 'Ne čuje sirenu' },
  { id: 'no-screen', en: 'Does not see the screen', sr: 'Ne vidi ekran' },
  { id: 'reads-slowly', en: 'Cannot read a wall of text in ten seconds', sr: 'Ne može da pročita zid teksta u deset sekundi' },
  { id: 'no-language', en: 'Does not know the language', sr: 'Ne zna jezik' },
  { id: 'hands-busy', en: 'Hands and eyes are busy', sr: 'Ruke i oči su zauzete' }
];

// Principle 04 asks for redundancy: critical information needs two independent channels per profile.
export function coverage(selected) {
  const chosen = CHANNELS.filter(channel => selected.includes(channel.id));
  const rows = PROFILES.map(profile => {
    const by = chosen.filter(channel => channel.reaches.includes(profile.id)).map(channel => channel.id);
    return { profile: profile.id, channels: by, count: by.length, covered: by.length >= 1, redundant: by.length >= 2 };
  });
  return {
    rows,
    uncovered: rows.filter(row => !row.covered).map(row => row.profile),
    single: rows.filter(row => row.covered && !row.redundant).map(row => row.profile),
    pass: rows.every(row => row.redundant),
    channelsUsed: chosen.length
  };
}

/* ------------------------------------------------------------------ *
 * 5. Plan geometry: does the chair get there, and does it turn when it arrives
 * ------------------------------------------------------------------ */
export const CELL_CM = 10;             // the grid everything is rounded to
export const CHAIR_CM = 80;            // occupied width of a manual wheelchair in motion
export const TURN_CM = 150;            // free circle required by Art. 19
export const DOOR_MIN_CM = 80;         // Art. 17
export const DOOR_TURN_CM = 90;        // Art. 17, where a chair has to turn
export const CORRIDOR_ONE_WAY_CM = 90; // Art. 14
export const CORRIDOR_TWO_WAY_CM = 180;

// A plan is rectangles in centimetres. Rasterised at 10 cm, then measured.
// walls: [x, y, w, h] filled; openings are simply not drawn.
export function rasterise(plan) {
  const cols = Math.round(plan.w / CELL_CM), rows = Math.round(plan.h / CELL_CM);
  const grid = new Uint8Array(cols * rows); // 1 = wall
  const put = (x, y, w, h) => {
    const x0 = Math.max(0, Math.round(x / CELL_CM)), y0 = Math.max(0, Math.round(y / CELL_CM));
    const x1 = Math.min(cols, Math.round((x + w) / CELL_CM)), y1 = Math.min(rows, Math.round((y + h) / CELL_CM));
    for (let yy = y0; yy < y1; yy++) for (let xx = x0; xx < x1; xx++) grid[yy * cols + xx] = 1;
  };
  for (const [x, y, w, h] of plan.walls || []) put(x, y, w, h);
  return { grid, cols, rows };
}

// Distance from every free cell to the nearest wall face, in centimetres (two-pass chamfer).
export function clearanceMap({ grid, cols, rows }) {
  const INF = 1e9;
  const dist = new Float32Array(cols * rows);
  for (let i = 0; i < dist.length; i++) dist[i] = grid[i] ? 0 : INF;
  const relax = (i, j, cost) => { if (dist[j] + cost < dist[i]) dist[i] = dist[j] + cost; };
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
    const i = y * cols + x;
    if (x > 0) relax(i, i - 1, 1);
    if (y > 0) relax(i, i - cols, 1);
    if (x > 0 && y > 0) relax(i, i - cols - 1, 1.414);
    if (x + 1 < cols && y > 0) relax(i, i - cols + 1, 1.414);
  }
  for (let y = rows - 1; y >= 0; y--) for (let x = cols - 1; x >= 0; x--) {
    const i = y * cols + x;
    if (x + 1 < cols) relax(i, i + 1, 1);
    if (y + 1 < rows) relax(i, i + cols, 1);
    if (x + 1 < cols && y + 1 < rows) relax(i, i + cols + 1, 1.414);
    if (x > 0 && y + 1 < rows) relax(i, i + cols - 1, 1.414);
  }
  // Outside the walls there is nothing: cells on the sheet edge are bounded by the sheet.
  const clear = new Float32Array(cols * rows);
  for (let i = 0; i < clear.length; i++) clear[i] = grid[i] ? 0 : Math.max(0, (dist[i] - 0.5) * CELL_CM);
  return clear;
}

export function analyzePlan(plan) {
  const raster = rasterise(plan);
  const { cols, rows, grid } = raster;
  const clear = clearanceMap(raster);
  const index = point => Math.round(point[1] / CELL_CM) * cols + Math.round(point[0] / CELL_CM);
  const start = index(plan.start), goal = index(plan.goal);
  const needed = CHAIR_CM / 2;
  const open = i => !grid[i] && clear[i] >= needed - 0.001;

  const problems = [];
  if (!open(start)) problems.push({ code: 'start-blocked' });
  if (!open(goal)) problems.push({ code: 'goal-blocked', clearCm: Math.round(clear[goal] * 2) });

  // Widest-bottleneck first search: the best route is the one whose narrowest point is widest.
  const best = new Float32Array(cols * rows); // widest bottleneck known to reach a cell
  const from = new Int32Array(cols * rows).fill(-1);
  if (open(start)) best[start] = clear[start];
  const queue = open(start) ? [start] : [];
  while (queue.length) {
    queue.sort((a, b) => best[b] - best[a]);
    const current = queue.shift();
    if (current === goal) break;
    const x = current % cols, y = (current - x) / cols;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
      const next = ny * cols + nx;
      if (!open(next)) continue;
      const bottleneck = Math.min(best[current], clear[next]);
      if (bottleneck > best[next] + 0.001) { best[next] = bottleneck; from[next] = current; queue.push(next); }
    }
  }

  const reachable = best[goal] > 0;
  const path = [];
  if (reachable) { let cursor = goal; while (cursor !== -1) { path.push(cursor); cursor = from[cursor]; } path.reverse(); }
  const narrowestCm = reachable ? Math.round(best[goal] * 2) : null;

  // Can it turn where it arrives? Look for a 150 cm circle within 150 cm of the goal.
  const goalX = goal % cols, goalY = (goal - goalX) / cols;
  const reach = Math.round(TURN_CM / CELL_CM);
  let turnCm = 0;
  for (let y = Math.max(0, goalY - reach); y < Math.min(rows, goalY + reach); y++)
    for (let x = Math.max(0, goalX - reach); x < Math.min(cols, goalX + reach); x++)
      turnCm = Math.max(turnCm, clear[y * cols + x] * 2);
  turnCm = Math.round(turnCm);

  if (!reachable) problems.push({ code: 'no-route' });
  if (reachable && narrowestCm < CORRIDOR_ONE_WAY_CM) problems.push({ code: 'too-narrow', cm: narrowestCm, needed: CORRIDOR_ONE_WAY_CM });
  if (turnCm < TURN_CM) problems.push({ code: 'no-turning-circle', cm: turnCm, needed: TURN_CM });

  return {
    reachable, narrowestCm, turnCm, path, cols, rows, grid, clear,
    pass: reachable && narrowestCm >= CORRIDOR_ONE_WAY_CM && turnCm >= TURN_CM,
    problems,
    gridNote: { en: 'Rounded to a 10 cm grid.', sr: 'Zaokruženo na mrežu od 10 cm.' }
  };
}

/* ------------------------------------------------------------------ *
 * 6. The arithmetic of height: a ramp either fits on the plot or it does not
 * ------------------------------------------------------------------ */
// Art. 7: max 5 % (1:20); exceptionally 8,3 % (1:12) for short runs up to 6 m.
// Landings: "rampe duže od 6 m, a najviše do 9 m u slučaju da su manjeg nagiba, razdvajaju se
// odmorištima najmanje dužine 150 cm" — so a flight runs 6 m, or up to 9 m at a gentler slope.
// Handrails at 70 and 90 cm on both sides, extended 30 cm beyond each end.
export function analyzeRamp({ riseCm, slopePercent, availableLengthCm, landingLengthCm = 150, maxRunCm }) {
  const slope = Number(slopePercent);
  const rise = Number(riseCm);
  if (!(slope > 0) || !(rise > 0)) return null;
  if (!maxRunCm) maxRunCm = slope <= 5 ? 900 : 600;
  const runCm = rise / (slope / 100);
  const flights = Math.max(1, Math.ceil(runCm / maxRunCm));
  const landings = flights - 1;
  const totalCm = runCm + landings * landingLengthCm;
  const exception = slope > 5 && slope <= 8.3;
  const runPerFlight = runCm / flights;
  return {
    runCm: Math.round(runCm), landings, totalCm: Math.round(totalCm),
    landingTotalCm: landings * landingLengthCm, maxRunCm,
    flights, runPerFlightCm: Math.round(runPerFlight),
    slopeOk: slope <= 5 || (exception && runPerFlight <= maxRunCm),
    usesException: exception,
    overLimit: slope > 8.3,
    fits: availableLengthCm ? totalCm <= Number(availableLengthCm) : null,
    shortfallCm: availableLengthCm ? Math.max(0, Math.round(totalCm - Number(availableLengthCm))) : null
  };
}

/* ------------------------------------------------------------------ *
 * 7. Time and language: a measure of length, not of understanding
 * ------------------------------------------------------------------ */
export function plainness(text) {
  const clean = String(text || '').trim();
  if (!clean) return { words: 0, sentences: 0, avgSentence: 0, longWordShare: 0, verdict: 'empty' };
  const sentences = clean.split(/[.!?]+\s|\n+/).filter(part => part.trim().length > 0);
  const words = clean.split(/\s+/).filter(Boolean);
  const long = words.filter(word => word.replace(/[^\p{L}]/gu, '').length > 9);
  const avgSentence = words.length / Math.max(1, sentences.length);
  const longWordShare = long.length / Math.max(1, words.length);
  const verdict = avgSentence > 25 || longWordShare > 0.2 ? 'heavy' : avgSentence > 18 || longWordShare > 0.12 ? 'dense' : 'plain';
  return {
    words: words.length, sentences: sentences.length,
    avgSentence: Math.round(avgSentence * 10) / 10,
    longWordShare: Math.round(longWordShare * 100) / 100,
    verdict,
    caveat: { en: 'A length measure, not a comprehension measure.', sr: 'Mera dužine, ne mera razumljivosti.' }
  };
}

/* ------------------------------------------------------------------ *
 * 7b. Architectural & Universal Design Calculations: Acoustics, LRV, Maneuver
 * ------------------------------------------------------------------ */
export const ABSORPTION_COEFFICIENTS = {
  plaster_concrete: 0.02,
  glass: 0.04,
  wood: 0.10,
  carpet: 0.25,
  curtain_heavy: 0.50,
  acoustic_panel: 0.75,
  audience: 0.70
};

// Sabine formula: RT60 = 0.161 * V / A
// DeafSpace & ANSI/ASA S12.60: lecture/classroom RT60 <= 0.60 s; quiet retreat RT60 <= 0.40 s
export function analyzeAcoustics({ volumeM3, surfaces = [], roomType = 'classroom' } = {}) {
  const v = Number(volumeM3);
  if (!(v > 0) || !Array.isArray(surfaces) || surfaces.length === 0) return null;
  let totalA = 0;
  for (const s of surfaces) {
    const area = Number(s.areaM2) || 0;
    const coeff = typeof s.coeff === 'number' ? s.coeff : (ABSORPTION_COEFFICIENTS[s.material] ?? 0.05);
    totalA += area * coeff;
  }
  if (!(totalA > 0)) return null;
  const rt60 = Math.round((0.161 * v / totalA) * 100) / 100;
  const targetRt60 = roomType === 'quiet_retreat' ? 0.40 : roomType === 'classroom' ? 0.60 : 1.00;
  const pass = rt60 <= targetRt60;
  const targetA = 0.161 * v / targetRt60;
  const shortfallA = Math.max(0, targetA - totalA);
  const neededPanelsM2 = Math.round((shortfallA / 0.75) * 10) / 10;
  return {
    volumeM3: v,
    totalAbsorptionA: Math.round(totalA * 10) / 10,
    rt60,
    targetRt60,
    pass,
    neededPanelsM2,
    verdict: pass ? 'optimal' : rt60 > targetRt60 * 1.5 ? 'severe_overload' : 'echoey',
    standard: 'DeafSpace Acoustics · ANSI/ASA S12.60 · ASPECTSS™'
  };
}

// Light Reflectance Value (LRV) difference: ISO 21542:2021 & BS 8300
// Standard contrast: Delta LRV >= 30; Low-vision contrast: Delta LRV >= 40
export function analyzeLRV({ lrvForeground, lrvBackground, isLowVision = false } = {}) {
  const f = Number(lrvForeground), b = Number(lrvBackground);
  if (isNaN(f) || isNaN(b) || f < 0 || f > 100 || b < 0 || b > 100) return null;
  const deltaLRV = Math.round(Math.abs(f - b) * 10) / 10;
  const needed = isLowVision ? 40 : 30;
  const pass = deltaLRV >= needed;
  return {
    lrvForeground: f,
    lrvBackground: b,
    deltaLRV,
    needed,
    pass,
    level: deltaLRV >= 40 ? 'enhanced' : deltaLRV >= 30 ? 'standard' : 'fail',
    standard: 'ISO 21542:2021 · BS 8300-2'
  };
}

// Doorway maneuvering clearance check: Pravilnik RS 22/2015 čl. 14 i 17
export function analyzeManeuvering({ corridorWidthCm, doorClearWidthCm, approachType = 'frontal' } = {}) {
  const cw = Number(corridorWidthCm), dw = Number(doorClearWidthCm);
  if (!(cw > 0) || !(dw > 0)) return null;
  const minDoor = 90; // čl. 17: min 90 cm svetle širine
  const minCorridor = approachType === 'hinge_side' ? 140 : 120; // čl. 14
  const neededLatchCm = approachType === 'latch_side' ? 50 : approachType === 'hinge_side' ? 30 : 0;
  const doorPass = dw >= minDoor;
  const corridorPass = cw >= minCorridor;
  return {
    corridorWidthCm: cw,
    doorClearWidthCm: dw,
    approachType,
    minDoor,
    minCorridor,
    neededLatchCm,
    doorPass,
    corridorPass,
    pass: doorPass && corridorPass,
    standard: 'Pravilnik RS 22/2015 čl. 14 i 17 · ISO 21542'
  };
}

// Ramp geometry and landing calculations: Pravilnik RS 22/2015 čl. 7
export function analyzeRampGeometry({ totalRiseM, slopePct = 5, landingLengthM = 1.5, maxFlightRunM = 9.0 } = {}) {
  const rise = Number(totalRiseM), slope = Number(slopePct);
  if (!(rise > 0) || !(slope > 0)) return null;

  const isStandardSlope = slope <= 5.0;
  const isExceptionSlope = slope > 5.0 && slope <= 8.33;
  const isSlopeAllowed = slope <= 8.33;

  // Max run per single flight: at 5% is 9.0 m; at 8.3% is 6.0 m (čl. 7)
  const allowedMaxRun = isStandardSlope ? Math.min(Number(maxFlightRunM) || 9.0, 9.0) : 6.0;

  const totalRunM = Math.round((rise / (slope / 100)) * 100) / 100;
  const numFlights = Math.ceil(totalRunM / allowedMaxRun);
  const flightRunM = Math.round((totalRunM / numFlights) * 100) / 100;
  const numIntermediateLandings = Math.max(0, numFlights - 1);
  const totalLandingLengthM = Math.round(numIntermediateLandings * Number(landingLengthM || 1.5) * 100) / 100;
  const totalDevelopedLengthM = Math.round((totalRunM + totalLandingLengthM) * 100) / 100;
  const risePerFlightM = Math.round((rise / numFlights) * 1000) / 1000;

  return {
    totalRiseM: rise,
    slopePct: slope,
    isStandardSlope,
    isExceptionSlope,
    isSlopeAllowed,
    allowedMaxRun,
    totalRunM,
    numFlights,
    flightRunM,
    numIntermediateLandings,
    landingLengthM: Number(landingLengthM || 1.5),
    totalLandingLengthM,
    totalDevelopedLengthM,
    risePerFlightM,
    pass: isSlopeAllowed && flightRunM <= allowedMaxRun,
    standard: 'Pravilnik RS 22/2015 i 10/2026 čl. 7 · ISO 21542 §10'
  };
}

// Vestibule clearances and door swing checks: Pravilnik RS 22/2015 čl. 13
export function analyzeVestibule({ depthCm, widthCm, outerDoorSwing = 'out', innerDoorSwing = 'in', doorWidthCm = 90 } = {}) {
  const d = Number(depthCm), w = Number(widthCm), dw = Number(doorWidthCm);
  if (!(d > 0) || !(w > 0)) return null;

  const minWidth = 180; // čl. 13: min 180 cm širine
  const hasInwardSwing = outerDoorSwing === 'in' || innerDoorSwing === 'in';
  const minDepth = hasInwardSwing ? 240 : 200; // čl. 13: min 200 cm spolja, 240 cm unutra
  const minDoorWidth = 90; // čl. 17: min 90 cm

  const widthPass = w >= minWidth;
  const depthPass = d >= minDepth;
  const doorPass = dw >= minDoorWidth;

  // Turning circle clearance Ø 150 cm between door swings
  const netDepthBetweenSwings = d - (outerDoorSwing === 'in' ? dw : 0) - (innerDoorSwing === 'in' ? dw : 0);
  const turningPass = netDepthBetweenSwings >= 150 && w >= 150;

  return {
    depthCm: d,
    widthCm: w,
    doorWidthCm: dw,
    outerDoorSwing,
    innerDoorSwing,
    hasInwardSwing,
    minDepth,
    minWidth,
    minDoorWidth,
    netDepthBetweenSwings,
    widthPass,
    depthPass,
    doorPass,
    turningPass,
    pass: widthPass && depthPass && doorPass && turningPass,
    standard: 'Pravilnik RS 22/2015 čl. 13 i 17 · EN 17210 §10'
  };
}

// Stair ergonomics and statutory dimensions: Pravilnik RS 22/2015 čl. 16
export function analyzeStairs({ riserCm, treadCm } = {}) {
  const r = Number(riserCm), b = Number(treadCm);
  if (!(r > 0) || !(b > 0)) return null;

  const maxRiser = 15.0; // čl. 16: čelo max 15 cm
  const minTread = 30.0; // čl. 16: gazište min 30 cm
  const blondel = Math.round((2 * r + b) * 10) / 10; // 2h + b
  const blondelPass = blondel >= 60.0 && blondel <= 65.0;
  const riserPass = r <= maxRiser;
  const treadPass = b >= minTread;

  return {
    riserCm: r,
    treadCm: b,
    maxRiser,
    minTread,
    blondel,
    blondelPass,
    riserPass,
    treadPass,
    pass: riserPass && treadPass && blondelPass,
    standard: 'Pravilnik RS 22/2015 čl. 16 · ISO 21542 §11'
  };
}

// Passenger elevator statutory dimensions: Pravilnik RS 22/2015 čl. 21
export function analyzeElevator({ cabinWidthCm, cabinDepthCm, doorClearWidthCm, isThroughCar = false } = {}) {
  const cw = Number(cabinWidthCm), cd = Number(cabinDepthCm), dw = Number(doorClearWidthCm);
  if (!(cw > 0) || !(cd > 0) || !(dw > 0)) return null;

  const minWidth = isThroughCar ? 140 : 110; // čl. 21: min 110 cm / 140 cm
  const minDepth = 140; // čl. 21: min 140 cm
  const minDoor = 90; // čl. 21: min 90 cm

  const widthPass = cw >= minWidth;
  const depthPass = cd >= minDepth;
  const doorPass = dw >= minDoor;

  return {
    cabinWidthCm: cw,
    cabinDepthCm: cd,
    doorClearWidthCm: dw,
    isThroughCar,
    minWidth,
    minDepth,
    minDoor,
    widthPass,
    depthPass,
    doorPass,
    pass: widthPass && depthPass && doorPass,
    standard: 'Pravilnik RS 22/2015 čl. 21 · ISO 21542 §15'
  };
}

/* ------------------------------------------------------------------ *
 * 8. The register of labs
 * ------------------------------------------------------------------ */
export const labs = [
  {
    id: 'citac', minutes: 15, tests: { en: 'a screen reader and your markup', sr: 'čitač ekrana i tvoj kod' },
    title: { en: 'The machine reads your page', sr: 'Mašina čita tvoju stranicu' },
    aim: { en: 'Find one fact in a notice, hearing only what a screen reader announces. Then do it again in the version without headings, alternative text or real buttons. Compare the number of steps.', sr: 'Nađi jedan podatak u obaveštenju, čujući samo ono što čitač ekrana izgovori. Zatim ponovi isto u verziji bez naslova, alternativnog teksta i pravih tastera. Uporedi broj koraka.' },
    measures: { en: 'steps to the fact, in both versions', sr: 'korake do podatka, u obe verzije' },
    standard: 'WCAG 2.2 — 1.1.1, 1.3.1, 2.4.6, 4.1.2'
  },
  {
    id: 'tastatura', minutes: 10, tests: { en: 'the keyboard path through a form', sr: 'put tastaturom kroz formu' },
    title: { en: 'Without a mouse', sr: 'Bez miša' },
    aim: { en: 'Complete a short form using Tab, Shift+Tab, Space and Enter only. One version has a focus trap and invisible focus; the other does not.', sr: 'Popuni kratku formu samo pomoću Tab, Shift+Tab, Space i Enter. Jedna verzija ima zamku fokusa i nevidljiv fokus, druga ne.' },
    measures: { en: 'key presses, and whether you escaped', sr: 'pritiske tastera i da li si izašao' },
    standard: 'WCAG 2.2 — 2.1.1, 2.1.2, 2.4.7'
  },
  {
    id: 'prekidač', minutes: 10, tests: { en: 'one switch and the order you designed', sr: 'jedan prekidač i red koji si projektovao' },
    title: { en: 'One button', sr: 'Jedan taster' },
    aim: { en: 'Operate a menu with a single switch and an automatic scan. Reorder and group the items, and watch the number of activations fall.', sr: 'Upravljaj menijem jednim prekidačem i automatskim skeniranjem. Promeni red i grupisanje, i gledaj kako broj aktivacija pada.' },
    measures: { en: 'switch activations for the same three tasks', sr: 'aktivacija prekidača za ista tri zadatka' },
    standard: 'WCAG 2.2 — 2.1.1, 2.4.3; ISO 9241-171'
  },
  {
    id: 'kontrast', minutes: 10, tests: { en: 'your own colours and your own buttons', sr: 'tvoje boje i tvoje tastere' },
    title: { en: 'Measure the colour, measure the target', sr: 'Izmeri boju, izmeri dodirnu metu' },
    aim: { en: 'Put in the two colours from your project and read the ratio. Then set a button size and see when it stops satisfying the minimum. Zoom the sample to 400 % and look for the horizontal scrollbar.', sr: 'Upiši dve boje iz svog projekta i pročitaj odnos. Zatim postavi veličinu tastera i vidi kada prestaje da zadovoljava minimum. Uvećaj uzorak na 400 % i traži horizontalno pomeranje.' },
    measures: { en: 'contrast ratio, target size, reflow at 400 %', sr: 'odnos kontrasta, veličinu dodirne mete i prelom na 400 %' },
    standard: 'WCAG 2.2 — 1.4.3, 1.4.11, 1.4.10, 2.5.8'
  },
  {
    id: 'kanali', minutes: 10, tests: { en: 'the redundancy of your information', sr: 'redundansu tvoje informacije' },
    title: { en: 'Who does not get the alarm', sr: 'Ko ne dobija alarm' },
    aim: { en: 'Choose the channels for an evacuation alarm in your building. The table shows who is reached once, twice, or not at all.', sr: 'Izaberi kanale za alarm evakuacije u svojoj zgradi. Tabela pokazuje do koga poruka stiže jednom, dva puta ili nikako.' },
    measures: { en: 'profiles with no channel, profiles with only one', sr: 'profile bez kanala i profile sa samo jednim' },
    standard: 'Principle 04; ISO 21542; Pravilnik RS 22/2015'
  },
  {
    id: 'prolaz', minutes: 20, tests: { en: 'your plan against Art. 14, 17, 18 and 19', sr: 'tvoju osnovu po čl. 14, 17, 18 i 19' },
    title: { en: 'Does the chair get there, and does it turn', sr: 'Da li kolica stižu i da li se okreću' },
    aim: { en: 'A real-size plan on a 10 cm grid. Move the walls and widen the doors until the route exists, the narrowest point holds and a 150 cm circle fits where you arrive. Fewer moves is a better score.', sr: 'Osnova u pravoj meri na mreži od 10 cm. Pomeraj zidove i proširuj vrata dok putanja ne postane prohodna, najuža tačka ne dostigne potrebnu širinu i krug od 150 cm ne stane na odredištu. Što manje poteza, to bolji rezultat.' },
    measures: { en: 'narrowest point, turning circle, number of moves', sr: 'najužu tačku, obrtni krug i broj poteza' },
    standard: 'Pravilnik RS 22/2015 — čl. 14, 17, 18, 19'
  },
  {
    id: 'visina', minutes: 15, tests: { en: 'the arithmetic of our own site', sr: 'aritmetiku naše lokacije' },
    title: { en: '22,5 metres of height', sr: 'Visinska razlika od 22,5 metara' },
    aim: { en: 'Our site falls 22,5 m over 151 m. Choose a slope and read how long the ramp becomes, how many landings it needs and whether it fits on a plot of about 129 × 131 m. This is where the project starts.', sr: 'Na lokaciji postoji visinska razlika od 22,5 m na vazdušnoj dužini od 151 m. Izaberi nagib i izračunaj potrebnu dužinu rampe, broj odmorišta i da li rampa staje na parcelu od oko 129 × 131 m. Tu projekat počinje.' },
    measures: { en: 'ramp length, landings, shortfall in metres', sr: 'dužinu rampe, odmorišta i manjak u metrima' },
    standard: 'Pravilnik RS 22/2015 — čl. 7'
  },
  {
    id: 'vreme', minutes: 10, tests: { en: 'a deadline and a sentence', sr: 'rok i rečenicu' },
    title: { en: 'Twenty seconds and a long sentence', sr: 'Dvadeset sekundi i duga rečenica' },
    aim: { en: 'Read an administrative notice under a countdown, then rewrite it. The counter is a design property, not a fact of nature.', sr: 'Pročitaj administrativno obaveštenje uz odbrojavanje, pa ga prepiši. Brojač je svojstvo dizajna, ne činjenica prirode.' },
    measures: { en: 'sentence length, share of long words, whether you finished in time', sr: 'dužinu rečenice, udeo dugih reči i da li si stigao' },
    standard: 'WCAG 2.2 — 2.2.1, 3.1.5'
  }
];

export const labById = id => labs.find(lab => lab.id === id) || null;
