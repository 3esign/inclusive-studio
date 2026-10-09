// The flow window's rules: what each shelf demands before an item may sit on it.
// Pure data logic only — no DOM, no fetch — so the tests and the page import the same law.
// The shelves are a promise: prepared is not held, held without recorded results is not
// cemented, and an idea carries no week until it becomes a pilot.

export const FORMAT = 'inclusive-studio-tok';
export const VERSION = 1;
export const VRSTE = ['cas', 'tema', 'protokol', 'dogadjaj'];
export const POLICE = ['cem', 'pilot', 'ideje'];

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const hasText = value => typeof value === 'string' && value.trim().length > 0;
const bilingual = value => !!(value && typeof value === 'object' && (hasText(value.sr) || hasText(value.en)));

export function emptyTok() {
  return { format: FORMAT, version: VERSION, nacelo: { sr: '', en: '' }, cem: [], pilot: [], ideje: [] };
}

export function validateTok(tok) {
  if (!tok || typeof tok !== 'object') return ['tok must be an object'];
  const problems = [];
  if (tok.format !== FORMAT) problems.push(`format must be "${FORMAT}"`);
  if (tok.version !== VERSION) problems.push(`version must be ${VERSION}`);
  if (!bilingual(tok.nacelo)) problems.push('nacelo must state the rule of the shelves in both languages');
  for (const shelf of POLICE) if (!Array.isArray(tok[shelf])) problems.push(`${shelf} must be an array`);
  if (problems.length) return problems;

  const where = new Map();
  for (const shelf of POLICE) {
    tok[shelf].forEach((item, i) => {
      const at = `${shelf}[${i}]`;
      if (!KEBAB.test(item.id || '')) problems.push(`${at}: id must be kebab-case`);
      if (where.has(item.id)) problems.push(`${at}: "${item.id}" already sits on ${where.get(item.id)} — an item lives on one shelf`);
      else where.set(item.id, shelf);
      if (shelf !== 'ideje' && !VRSTE.includes(item.vrsta)) problems.push(`${at}: vrsta must be one of ${VRSTE.join(', ')}`);
      if (!bilingual(item.naslov)) problems.push(`${at}: needs a title in both languages`);
      if (!hasText(item.izvor)) problems.push(`${at}: needs a source (izvor) — nothing enters unattributed`);
    });
  }

  tok.cem.forEach((item, i) => {
    const at = `cem[${i}]`;
    if (!DATE.test(item.odrzan || '')) problems.push(`${at}: cement requires the date the class was held (odrzan)`);
    if (!Array.isArray(item.rezultati) || item.rezultati.length === 0) problems.push(`${at}: held without recorded results is not cemented — add rezultati`);
    (item.rezultati || []).forEach((result, j) => {
      if (!bilingual(result.sta)) problems.push(`${at}.rezultati[${j}]: must say what happened (sta)`);
      if (!hasText(result.izvor)) problems.push(`${at}.rezultati[${j}]: each result carries its own source (izvor)`);
    });
  });

  tok.pilot.forEach((item, i) => {
    const at = `pilot[${i}]`;
    if (!bilingual(item.ceka)) problems.push(`${at}: a pilot must say what it waits for (ceka) — prepared is not held`);
    if ('odrzan' in item) problems.push(`${at}: a pilot carries no held date — that would look finished`);
    if ('rezultati' in item) problems.push(`${at}: a pilot carries no results — results come after the class`);
  });

  tok.ideje.forEach((item, i) => {
    const at = `ideje[${i}]`;
    if ('nedelja' in item) problems.push(`${at}: an idea carries no week — the week is gained when it becomes a pilot`);
    if (!DATE.test(item.datum || '')) problems.push(`${at}: needs a date (YYYY-MM-DD)`);
    if (!bilingual(item.tekst)) problems.push(`${at}: must say what the idea is (tekst)`);
  });

  tok.pilot.forEach((item, i) => {
    if ('izIdeje' in item && !tok.ideje.some(idea => idea.id === item.izIdeje))
      problems.push(`pilot[${i}]: pulls from idea "${item.izIdeje}" which is not in the cloud`);
  });
  for (const item of tok.cem) {
    if (tok.pilot.some(pilot => pilot.id === item.id)) problems.push(`"${item.id}" is cemented and still sits on the pilot shelf`);
  }
  return problems;
}

export const shelfOf = (tok, id) => POLICE.find(shelf => tok[shelf].some(item => item.id === id)) || null;
