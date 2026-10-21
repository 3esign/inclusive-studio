// 21.10.2026: the third class's photographs were re-cut against the teacher's list after the
// opening frames (trousers, degree presentations) were found to sit in front of the sequence.
// Each gallery now carries the identity the teacher supplied: student number, name, title.
export const withheldWorkIds = Object.freeze([]);
export const withheldPhotoDirectories = Object.freeze(['poseta-udruzenje']);
export const publicPhoto = photo => !withheldPhotoDirectories.some(id => photo.src.startsWith('data/prototipovi/' + id + '/'));
export function publishedPrototypes(data, { showPending = false } = {}) {
  const items = data.items.filter(item => item.documentedWeek !== 3 && (showPending || item.attributionStatus !== 'pending'));
  const observations = data.observations.filter(event => items.some(item => item.id === event.prototypeId));
  const sourceIds = new Set([...items, ...observations, ...(data.galleries || []), ...(data.cekaju || [])].flatMap(item => [item.sourceId, item.attribution?.sourceId, item.publication?.sourceId, ...(item.photos || []).map(p => p.sourceId)]).filter(Boolean));
  const revizije = (data.revizije || []).filter(r => items.some(i => i.id === r.prototypeId));
  for (const r of revizije) sourceIds.add(r.sourceId);
  // Withdrawn records are evidence of what was once claimed. They stay in the register and
  // out of the served excerpt: a reader of the course site is owed the corrected page, not
  // the trail of the correction.
  const { povuceno, ...rest } = data;
  return { ...rest, items, observations, revizije, sources: data.sources.filter(s => sourceIds.has(s.id)) };
}
