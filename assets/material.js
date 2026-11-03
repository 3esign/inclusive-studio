// The working week: the one section the teacher fills, and the one the lecture is built from.
// A week is a small JSON file in data/material/. Nothing else on the site may invent a week.
// Pure functions only — the browser, the editor and the Node tests all use the same rules.

export const MATERIAL_INDEX = 'data/material/index.json';
export const MATERIAL_DIR = 'data/material/';
export const FORMAT = 'inclusive-studio-material';
export const VERSION = 1;

// kind → what it must carry. `text` fields are bilingual objects {en, sr}; one language is enough.
export const BLOCK_KINDS = {
  heading: { needs: ['text'], slide: 'start', label: { en: 'Heading (starts a slide)', sr: 'Naslov (počinje slajd)' } },
  text: { needs: ['text'], label: { en: 'Paragraph', sr: 'Pasus' } },
  list: { needs: ['items'], label: { en: 'List', sr: 'Lista' } },
  quote: { needs: ['text'], label: { en: 'Quote with a source', sr: 'Citat sa izvorom' } },
  measure: { needs: ['text', 'value'], label: { en: 'Measured value (value + instrument)', sr: 'Izmerena vrednost (vrednost + instrument)' } },
  image: { needs: ['src', 'alt'], label: { en: 'Image (description required)', sr: 'Slika (opis obavezan)' } },
  link: { needs: ['href', 'text'], label: { en: 'Link', sr: 'Veza' } },
  file: { needs: ['href', 'text'], label: { en: 'File to download', sr: 'Fajl za preuzimanje' } },
  lab: { needs: ['ref'], label: { en: 'Lab from the laboratory', sr: 'Ogled iz laboratorije' } },
  exercise: { needs: ['ref'], label: { en: 'Exercise from the bank', sr: 'Vežba iz banke' } },
  question: { needs: ['items'], label: { en: 'Questions for the room', sr: 'Pitanja za salu' } },
  decision: { needs: ['text'], label: { en: 'Decision to be recorded', sr: 'Odluka koja se upisuje' } }
};

const isText = value => value && typeof value === 'object' && !Array.isArray(value)
  ? ['en', 'sr'].some(k => typeof value[k] === 'string' && value[k].trim().length > 0)
  : typeof value === 'string' && value.trim().length > 0;

const isTextList = value => Array.isArray(value) && value.length > 0 && value.every(isText);

// Only http(s), same-origin relative paths and mailto are allowed to reach the page.
export function safeHref(href) {
  const value = String(href ?? '').trim();
  if (!value) return '';
  if (/^(https?:|mailto:)/i.test(value)) return value;
  if (/^[a-z][a-z0-9+.-]*:/i.test(value)) return '';          // javascript:, data:, file: and friends
  if (value.startsWith('//')) return '';                       // protocol-relative
  return value;
}

export function validateBlock(block, position = 0) {
  const problems = [];
  const where = `#${position + 1}`;
  if (!block || typeof block !== 'object') return [`${where}: not an object`];
  const spec = BLOCK_KINDS[block.kind];
  if (!spec) return [`${where}: unknown kind "${block.kind}"`];
  for (const field of spec.needs) {
    const value = block[field];
    const ok = field === 'items' ? isTextList(value)
      : field === 'src' || field === 'href' ? !!safeHref(value)
      : field === 'ref' ? typeof value === 'string' && value.trim().length > 0
      : field === 'value' ? typeof value === 'string' && value.trim().length > 0
      : isText(value);
    if (!ok) problems.push(`${where} ${block.kind}: "${field}" is missing or empty`);
  }
  if (block.kind === 'image' && !isText(block.alt)) problems.push(`${where} image: a description is required — an image without one is not material`);
  if (block.kind === 'measure' && !isText(block.instrument)) problems.push(`${where} measure: name the instrument — a value without one is an impression`);
  if (block.kind === 'quote' && !block.source) problems.push(`${where} quote: a quote without a source is a rumour`);
  return problems;
}

export function validateWeek(week) {
  const problems = [];
  if (!week || typeof week !== 'object') return { ok: false, problems: ['not an object'] };
  if (!Number.isInteger(week.n) || week.n < 1 || week.n > 30) problems.push('n must be a week number between 1 and 30');
  if (!isText(week.title)) problems.push('title is required');
  if (!['published', 'draft'].includes(week.state)) problems.push('state must be "published" or "draft"');
  if (week.date !== null && week.date !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(week.date)) problems.push('date must be null or YYYY-MM-DD');
  if (week.date && week.dateStatus !== 'confirmed' && week.dateStatus !== 'proposed') problems.push('a date needs dateStatus "confirmed" or "proposed"');
  // Revisions make the writing of the material visible: what changed, when, on whose word.
  // A published week without them is material that claims it never changed.
  if (week.revizije !== undefined) {
    if (!Array.isArray(week.revizije) || week.revizije.length === 0) problems.push('revizije must be a non-empty array when present');
    else week.revizije.forEach((r, i) => {
      const v = i + 1;
      if (!Number.isInteger(r.v) || r.v !== v) problems.push(`revizije #${v}: "v" must be ${v}, in order`);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(r.datum || '')) problems.push(`revizije #${v}: "datum" must be YYYY-MM-DD`);
      if (!isText(r.sta)) problems.push(`revizije #${v}: "sta" is required — a revision says what changed`);
    });
    const last = week.revizije[week.revizije.length - 1];
    if (last && week.updated && week.updated !== last.datum) problems.push('updated must equal the last revision date — the "Dopunjeno" line tells the truth');
  }
  if (week.state === 'published' && !(Array.isArray(week.revizije) && week.revizije.length)) problems.push('a published week carries revizije — published material has a visible history');
  const blocks = Array.isArray(week.blocks) ? week.blocks : null;
  if (!blocks) problems.push('blocks must be an array');
  else blocks.forEach((block, index) => problems.push(...validateBlock(block, index)));
  return { ok: problems.length === 0, problems };
}

export function validateIndex(index) {
  const problems = [];
  if (!index || typeof index !== 'object') return { ok: false, problems: ['not an object'] };
  if (index.format !== FORMAT) problems.push(`format must be "${FORMAT}"`);
  if (index.version !== VERSION) problems.push(`version must be ${VERSION}`);
  if (!Array.isArray(index.weeks) || index.weeks.length === 0) problems.push('weeks must be a non-empty array');
  else {
    const seen = new Set();
    index.weeks.forEach(entry => {
      if (!Number.isInteger(entry.n)) problems.push('a week entry without a number');
      else if (seen.has(entry.n)) problems.push(`week ${entry.n} listed twice`);
      else seen.add(entry.n);
      if (typeof entry.file !== 'string' || !/^w\d{2}\.json$/.test(entry.file)) problems.push(`week ${entry.n}: file must be wNN.json`);
      if (!['published', 'draft'].includes(entry.state)) problems.push(`week ${entry.n}: state must be published or draft`);
      if (!isText(entry.title)) problems.push(`week ${entry.n}: title is required`);
    });
    if (index.current !== null && index.current !== undefined && !seen.has(index.current)) problems.push('current points at a week that is not listed');
  }
  return { ok: problems.length === 0, problems };
}

// The week the room is working on: the declared one, else the last published one.
export function currentWeek(index) {
  const weeks = (index?.weeks || []).slice().sort((a, b) => a.n - b.n);
  if (!weeks.length) return null;
  const declared = weeks.find(w => w.n === index.current);
  if (declared) return declared;
  const published = weeks.filter(w => w.state === 'published');
  return published.length ? published[published.length - 1] : weeks[0];
}

export const weekFile = n => `${MATERIAL_DIR}w${String(n).padStart(2, '0')}.json`;

// A lecture is the week's blocks cut into slides at every heading.
// Material that carries no heading still becomes one slide — nothing is silently dropped.
export function toSlides(week) {
  const blocks = Array.isArray(week?.blocks) ? week.blocks : [];
  const slides = [];
  let open = null;
  for (const block of blocks) {
    if (block.kind === 'heading' || !open) {
      open = { heading: block.kind === 'heading' ? block : null, blocks: block.kind === 'heading' ? [] : [block] };
      slides.push(open);
    } else open.blocks.push(block);
  }
  return slides;
}

// How much of the week is actually filled — shown to the teacher, never guessed at.
export function weekStats(week) {
  const blocks = Array.isArray(week?.blocks) ? week.blocks : [];
  const counts = {};
  for (const block of blocks) counts[block.kind] = (counts[block.kind] || 0) + 1;
  const words = blocks.reduce((total, block) => {
    const texts = [block.text, block.alt, block.caption, ...(block.items || [])];
    return total + texts.reduce((sum, value) => {
      const text = value && typeof value === 'object' ? (value.sr || value.en || '') : (value || '');
      return sum + String(text).split(/\s+/).filter(Boolean).length;
    }, 0);
  }, 0);
  return { blocks: blocks.length, slides: toSlides(week).length, words, counts };
}

export function emptyWeek(n) {
  return {
    format: FORMAT, version: VERSION, n, state: 'draft', updated: '',
    title: { en: '', sr: '' }, date: null, dateStatus: 'proposed',
    aim: { en: '', sr: '' }, bring: [], blocks: []
  };
}

// Stable, diff-friendly JSON — the file lands in Git and is read by people.
export function serializeWeek(week) { return JSON.stringify(week, null, 2) + '\n'; }
