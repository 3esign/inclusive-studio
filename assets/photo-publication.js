// Publication gate. The 19 October 2026 withdrawal of the third-class batch is lifted.
// Basis: the teacher's own list (data/cas-03/spisak.json) states how many photographs
// were taken for each work, in shooting order — some more, some fewer. That list is the
// proof of the photo-to-work link, and frame hashing confirms it per file: every
// published photograph matches an original in its own folder (distance 0-5, see
// data/brain/scratch/foto-povezivanje/frame-veza.txt). Rows 1-2 (Ksenija, Sara) were
// shot before class and stay in the list as "not recorded", so they carry no photographs.
// The visit keeps its own withdrawal until the teacher confirms its captions.
// 23.10.2026 (nastavnik predmeta, drugi zapis): the three disputed third-class frames were
// looked at and separated. „Putanja” keeps its corrected author, the frames filed under
// „brza putanja” are „3d lavirint”, and the frame beside „2d lavirint” belongs to the
// author of list row 20. All three works are published again; one name from the list is
// now left without a work and stands open in data/cas-03/spisak.json.
export const withheldWorkIds = Object.freeze([]);
export const withheldPhotoDirectories = Object.freeze([...withheldWorkIds, 'poseta-udruzenje']);
export const publicPhoto = photo => !withheldPhotoDirectories.some(id => photo.src.startsWith('data/prototipovi/' + id + '/'));
// A work whose attribution still waits for the student's confirmation (attributionStatus
// 'pending', list rows 17–19 of the third class) is not published by default. The teacher
// may later decide to show it with its marker; until then the evidence stays recorded,
// out of the public gallery.
const attributionPending = item => item.attributionStatus === 'pending';
// showPending is the internal review view (the teacher's own look at the record, or a
// future explicit decision to publish a pending work with its marker). Every public
// page renders without it, so a pending attribution never reaches the gallery silently.
export function publishedPrototypes(data, { showPending = false } = {}) {
  const items = data.items.filter(item => !withheldWorkIds.includes(item.id) && (showPending || !attributionPending(item)));
  return { ...data, items, observations: data.observations.filter(event => items.some(item => item.id === event.prototypeId)) };
}
