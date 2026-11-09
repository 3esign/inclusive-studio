// The rules of the course flow: what each part demands before an item may sit in it.
// Pure data logic only — no DOM, no fetch — so the tests and the page import the same law.
// The three parts keep an honest order: prepared is not held, held without recorded
// results is not complete, and an idea carries no week until it enters the next class prep.

export const FORMAT = 'inclusive-studio-tok';
export const VERSION = 2;
export const VRSTE = ['cas', 'tema', 'protokol', 'dogadjaj'];
export const DELTOVI = ['odrzano', 'sledeci', 'ideje'];

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const hasText = value => typeof value === 'string' && value.trim().length > 0;
const bilingual = value => !!(value && typeof value === 'object' && (hasText(value.sr) || hasText(value.en)));

export function emptyTok() {
  return { format: FORMAT, version: VERSION, nacelo: { sr: '', en: '' }, odrzano: [], sledeci: [], ideje: [] };
}

export function validateTok(tok) {
  if (!tok || typeof tok !== 'object') return ['tok must be an object'];
  const problems = [];
  if (tok.format !== FORMAT) problems.push(`format must be "${FORMAT}"`);
  if (tok.version !== VERSION) problems.push(`version must be ${VERSION}`);
  if (!bilingual(tok.nacelo)) problems.push('nacelo must state the rule of the three parts in both languages');
  for (const deo of DELTOVI) if (!Array.isArray(tok[deo])) problems.push(`${deo} must be an array`);
  if (problems.length) return problems;

  const where = new Map();
  for (const deo of DELTOVI) {
    tok[deo].forEach((item, i) => {
      const at = `${deo}[${i}]`;
      if (!KEBAB.test(item.id || '')) problems.push(`${at}: id must be kebab-case`);
      if (where.has(item.id)) problems.push(`${at}: "${item.id}" already sits in ${where.get(item.id)} — an item lives in one part only`);
      else where.set(item.id, deo);
      if (deo !== 'ideje' && !VRSTE.includes(item.vrsta)) problems.push(`${at}: vrsta must be one of ${VRSTE.join(', ')}`);
      if (!bilingual(item.naslov)) problems.push(`${at}: needs a title in both languages`);
      if (!hasText(item.izvor)) problems.push(`${at}: needs a source (izvor) — nothing enters unattributed`);
    });
  }

  tok.odrzano.forEach((item, i) => {
    const at = `odrzano[${i}]`;
    if (!DATE.test(item.odrzan || '')) problems.push(`${at}: a held class requires the date it was held (odrzan)`);
    if (!Array.isArray(item.rezultati) || item.rezultati.length === 0) problems.push(`${at}: held without recorded results is not complete — add rezultati`);
    (item.rezultati || []).forEach((result, j) => {
      if (!bilingual(result.sta)) problems.push(`${at}.rezultati[${j}]: must say what happened (sta)`);
      if (!hasText(result.izvor)) problems.push(`${at}.rezultati[${j}]: each result carries its own source (izvor)`);
    });
  });

  tok.sledeci.forEach((item, i) => {
    const at = `sledeci[${i}]`;
    if (!bilingual(item.ceka)) problems.push(`${at}: the preparation must say what it waits for (ceka) — prepared is not held`);
    if ('odrzan' in item) problems.push(`${at}: a preparation carries no held date — that would look finished`);
    if ('rezultati' in item) problems.push(`${at}: a preparation carries no results — results come after the class`);
  });

  tok.ideje.forEach((item, i) => {
    const at = `ideje[${i}]`;
    if ('nedelja' in item) problems.push(`${at}: an idea carries no week — the week is gained when it enters the next class prep`);
    if (!DATE.test(item.datum || '')) problems.push(`${at}: needs a date (YYYY-MM-DD)`);
    if (!bilingual(item.tekst)) problems.push(`${at}: must say what the idea is (tekst)`);
  });

  tok.sledeci.forEach((item, i) => {
    if ('izIdeje' in item && !tok.ideje.some(idea => idea.id === item.izIdeje))
      problems.push(`sledeci[${i}]: pulls from idea "${item.izIdeje}" which is not in the cloud`);
  });
  for (const item of tok.odrzano) {
    if (tok.sledeci.some(next => next.id === item.id)) problems.push(`"${item.id}" is held and still sits in the next-class part`);
  }
  return problems;
}

export const shelfOf = (tok, id) => DELTOVI.find(deo => tok[deo].some(item => item.id === id)) || null;
