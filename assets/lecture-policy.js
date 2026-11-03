// Public reading modes. This is a content-status boundary, not authentication.
export const PUBLICATION_FILE = 'data/course-publication.json';
const HASH = /^[a-f0-9]{64}$/;
const hasText = value => typeof value === 'string' && value.trim().length > 0;

export function validatePublication(manifest) {
  const problems = [];
  if (manifest?.schema !== 'course-publication/v1') problems.push('Unknown publication register.');
  if (!Array.isArray(manifest?.items)) return [...problems, 'Publication items are missing.'];
  const seen = new Set();
  for (const item of manifest.items) {
    if (!Number.isInteger(item?.week) || item.week < 1 || item.week > 99) problems.push('Invalid week.');
    if (seen.has(item?.week)) problems.push('Duplicate week.');
    seen.add(item?.week);
    if (!['held-record', 'teacher-finalized'].includes(item?.kind)) problems.push('Unknown publication status.');
    if (!HASH.test(item?.materialSha256 || '')) problems.push('Material fingerprint is missing.');
    if (!hasText(item?.source)) problems.push('Publication source is missing.');
    if (!hasText(item?.recordedAt) || !Number.isFinite(Date.parse(item.recordedAt))) problems.push('Publication record date is missing.');
  }
  return problems;
}

export function lecturePolicy(week, manifest, observedHash, { preview = false } = {}) {
  if (preview) return { allowed: true, mode: 'preparation', reason: 'preview' };
  if (validatePublication(manifest).length) return { allowed: false, reason: 'invalid-register' };
  const entry = manifest.items.find(item => item.week === week?.n);
  if (!entry || week?.state !== 'published') return { allowed: false, reason: 'not-recorded' };
  if (!HASH.test(observedHash || '') || entry.materialSha256 !== observedHash) return { allowed: false, reason: 'changed-material' };
  return { allowed: true, mode: entry.kind, source: entry.source };
}

export function selectLecture(index, manifest, wanted, { preview = false } = {}) {
  const weeks = Array.isArray(index?.weeks) ? index.weeks : [];
  if (wanted !== null && wanted !== undefined) return weeks.find(item => item.n === wanted) || null;
  if (preview) return weeks.find(item => item.n === index.current) || null;
  if (validatePublication(manifest).length) return null;
  return weeks.filter(item => item.state === 'published' && manifest.items.some(record => record.week === item.n))
    .sort((a, b) => b.n - a.n)[0] || null;
}
