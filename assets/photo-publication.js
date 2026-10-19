// Publication gate. The 19 October 2026 withdrawal of the third-class batch is lifted.
// Basis: the teacher's own list (data/cas-03/spisak.json) states how many photographs
// were taken for each work, in shooting order — some more, some fewer. That list is the
// proof of the photo-to-work link, and frame hashing confirms it per file: every
// published photograph matches an original in its own folder (distance 0-5, see
// data/brain/scratch/foto-povezivanje/frame-veza.txt). Rows 1-2 (Ksenija, Sara) were
// shot before class and stay in the list as "not recorded", so they carry no photographs.
// The visit keeps its own withdrawal until the teacher confirms its captions.
export const withheldWorkIds = Object.freeze([]);
export const withheldPhotoDirectories = Object.freeze([...withheldWorkIds, 'poseta-udruzenje']);
export const publicPhoto = photo => !withheldPhotoDirectories.some(id => photo.src.startsWith('data/prototipovi/' + id + '/'));
export function publishedPrototypes(data) {
  const items = data.items.filter(item => !withheldWorkIds.includes(item.id));
  return { ...data, items, observations: data.observations.filter(event => items.some(item => item.id === event.prototypeId)) };
}
