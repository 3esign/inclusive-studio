// Tri ispravke registra radova, po nastavnikovom zapisu od 23.10.2026. Ispravka ne briše
// raniji zapis: before/after stoje u revizijama, a sporne fotografije se povlače iz
// galerije dok se ne razdvoje — dokaz ostaje, tvrdnja ne.
import { readFile, writeFile } from 'node:fs/promises';
import { validatePrototypes } from '../assets/prototipovi-core.js';

const root = new URL('../', import.meta.url);
const p = new URL('data/prototipovi.json', root);
const data = JSON.parse(await readFile(p, 'utf8'));
const SRC = 'teacher-2026-10-23-cas-04';

if (!data.sources.some(s => s.id === SRC)) data.sources.push({
  id: SRC, recordedOn: '2026-10-23',
  description: {
    sr: 'Nastavnikov zapis četvrtog časa (23.10.2026) sa tri ispravke zapisa trećeg časa: pripisivanje rada „putanja”, fotografija pogrešno zavedena pod „brza putanja” i fotografija koja je stajala uz „2d lavirint”.',
    en: 'The teacher’s record of the fourth class (23 October 2026) with three corrections to third-class records: the attribution of „putanja”, the photograph wrongly filed under „brza putanja”, and the photograph that stood beside „2d lavirint”.',
  },
});

const byId = id => data.items.find(i => i.id === id);
const revizije = data.revizije ||= [];
const fix = (id, sta, change) => {
  const item = byId(id);
  if (!item) throw Error(`${id} is not in the register.`);
  const before = structuredClone(item);
  change(item);
  revizije.push({ v: revizije.length + 1, datum: '2026-10-23', sta, sourceId: SRC, prototypeId: id, before, after: structuredClone(item) });
};

// 1. „putanja” — autorka je studentkinja zapisa 4 četvrtog časa; ime stoji u registru.
fix('17-putanja', {
  sr: 'Atribucija je ispravljena: rad je pripisan autorki koju je nastavnik naveo 23.10.2026, umesto imena zavedenog na trećem času. Fotografija snimljena pod nazivom „brza putanja” pripada ovom radu.',
  en: 'The attribution is corrected: the work is attributed to the author the teacher named on 23 October 2026, replacing the name recorded at the third class. The photograph taken under the title „brza putanja” belongs to this work.',
}, item => {
  item.author = { name: 'Katarina Petrović', studentNumber: '79/24' };
  item.attribution = { sourceId: SRC, fields: ['name', 'studentNumber'] };
  delete item.attributionStatus;
  item.description = {
    sr: 'Prototip sa trećeg časa (16.10.2026). Autorstvo ispravljeno 23.10.2026. po nastavnikovom zapisu; jedna fotografija zavedena pod „brza putanja” pripada ovom radu i čeka razdvajanje.',
    en: 'Prototype from the third class (2026-10-16). Authorship corrected on 23 October 2026 by the teacher’s record; one photograph filed under „brza putanja” belongs to this work and awaits separation.',
  };
});

// 2. „brza putanja” — njene dve fotografije pripadaju dvama drugim radovima.
fix('18-brza-putanja', {
  sr: 'Fotografije zavedene pod ovim radom nisu njegove: jedna pripada radu „putanja”, druga radu „3d lavirint”. Rad je povučen iz galerije dok se fotografije ne razdvoje; zapis i heševi ostaju.',
  en: 'The photographs filed under this work are not its own: one belongs to „putanja”, the other to „3d lavirint”. The work is withdrawn from the gallery until the photographs are separated; the record and the hashes remain.',
}, item => {
  item.attributionStatus = 'pending';
  item.description = {
    sr: 'Zapis sa trećeg časa (16.10.2026). Nastavnik je 23.10.2026. utvrdio da dve fotografije pod ovim nazivom pripadaju dvama drugim radovima; dok se ne razdvoje, rad stoji povučen iz galerije.',
    en: 'Record from the third class (2026-10-16). On 23 October 2026 the teacher established that the two photographs under this title belong to two other works; until they are separated, the work stands withdrawn from the gallery.',
  };
});

// 3. „2d lavirint” — fotografija prikazuje rad studenta koji nije u ovom spisku.
fix('19-2d-lavirint', {
  sr: 'Fotografija zavedena uz ovaj rad prikazuje rad drugog studenta, koji nije u spisku četvrtog časa. Rad je povučen iz galerije dok se njegov zapis ne zavede sa izvorom.',
  en: 'The photograph filed beside this work shows the work of another student, who is not in the fourth-class list. The work is withdrawn from the gallery until his record is filed with its source.',
}, item => {
  item.attributionStatus = 'pending';
  item.description = {
    sr: 'Zapis sa trećeg časa (16.10.2026). Nastavnik je 23.10.2026. utvrdio da priložena fotografija nije ovog rada; rad stoji povučen iz galerije dok se autorstvo fotografije ne zavede.',
    en: 'Record from the third class (2026-10-16). On 23 October 2026 the teacher established that the attached photograph is not of this work; the work stands withdrawn from the gallery until the photograph’s authorship is filed.',
  };
});

const problems = validatePrototypes(data);
if (problems.length) throw Error(problems.join('\n'));
await writeFile(p, JSON.stringify(data, null, 1) + '\n');
console.log(JSON.stringify({ sources: data.sources.length, revizije: revizije.length, povuceno: ['18-brza-putanja', '19-2d-lavirint'] }));
