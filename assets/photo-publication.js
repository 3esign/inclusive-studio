// 21.10.2026: photo grouping and author attribution are separate relations.
// The third-class roster does not establish the identity of a photographed object.
// Its historical records stay outside the Pages surface; visually reviewed galleries carry no authors.
export const withheldWorkIds = Object.freeze([]);
export const withheldPhotoDirectories = Object.freeze(['poseta-udruzenje']);
export const publicPhoto = photo => !withheldPhotoDirectories.some(id => photo.src.startsWith('data/prototipovi/' + id + '/'));
export function publishedPrototypes(data, { showPending = false } = {}) {
  const items = data.items.filter(item => item.documentedWeek !== 3 && (showPending || item.attributionStatus !== 'pending'));
  const observations = data.observations.filter(event => items.some(item => item.id === event.prototypeId));
  const sourceIds = new Set([...items, ...observations, ...(data.galleries || [])].flatMap(item => [item.sourceId, item.attribution?.sourceId, item.publication?.sourceId, ...(item.photos || []).map(p => p.sourceId)]).filter(Boolean));
  const revizije = (data.revizije || []).filter(r => items.some(i => i.id === r.prototypeId));
  for (const r of revizije) sourceIds.add(r.sourceId);
  return { ...data, items, observations, revizije, sources: data.sources.filter(s => sourceIds.has(s.id)) };
}
