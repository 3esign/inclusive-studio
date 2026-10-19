// Emergency withdrawal, 19 October 2026: teacher requested removal of unrelated images.
// The imported sequence has unverified photo-to-work attribution. Preserve evidence;
// do not republish these records until each relationship has been reviewed.
export const withheldWorkIds = Object.freeze([
  "03-slovo-prsti",
  "04-touch",
  "05-music-box",
  "06-iggyblox",
  "07-hansgadget-starlight",
  "08-zekino-polje",
  "09-zen-garden",
  "10-lavirint",
  "11-zmijica",
  "12-sudoku",
  "13-kubismo",
  "14-koncici",
  "15-padalica",
  "16-obojilica",
  "17-putanja",
  "18-brza-putanja",
  "19-2d-lavirint",
  "21-vijugava-staza",
  "22-lenin-lavirint",
  "23-edukativna",
  "24-amaze",
  "25-stapici",
  "26-jana-grujic",
  "27-fliper",
  "28-stilopol",
  "29-castle"
]);
export const withheldPhotoDirectories = Object.freeze([...withheldWorkIds, 'poseta-udruzenje']);
export const publicPhoto = photo => !withheldPhotoDirectories.some(id => photo.src.startsWith('data/prototipovi/' + id + '/'));
export function publishedPrototypes(data) {
  const items = data.items.filter(item => !withheldWorkIds.includes(item.id));
  return { ...data, items, observations: data.observations.filter(event => items.some(item => item.id === event.prototypeId)) };
}
