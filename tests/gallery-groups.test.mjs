import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { validatePrototypes } from '../assets/prototipovi-core.js';
import { galleryDetail, authorLine } from '../assets/galleries.js';
import { setLanguage } from '../assets/core.js';
const read = p => readFile(new URL('../'+p,import.meta.url));
const data=JSON.parse(await read('data/prototipovi.json'));

// The teacher's list of 21.10.2026 as corrected on 23.10.2026, in shooting order: student
// number, name, title, frame count. Rows 18–21 carry the photo/name separation of 23.10
// (the frames stayed, the names moved up one row); rows 1 and 13 carry that day's renamings.
// A work with no count on the list, or whose frames never reached the transfer, is awaited —
// it keeps its place and its name and is never illustrated with someone else's photograph.
const LIST=[
  [1,'w3-kocic','19/24','Ksenija Kočić','taktilna kutija',7],
  [2,'w3-demiri','22/24','Hana Demiri',null,5],
  [3,'w3-slovo-prsti','106/24','Lazović Sara','Slovo Prsti',4],
  [4,'w3-touch','134/24','Maša Jotić','Touch',2],
  [5,'w3-music-box','49/24','Nikola Pajić','Music box',1],
  [6,'w3-iggyblox','6/24','Igor Stablović','iggyblox',2],
  [7,'w3-hansgadget','1/2024','Imre Halas','hansgadget',6],
  [8,'w3-starlight','1/2024','Imre Halas','starlight',3],
  [9,'w3-zekino-polje','51/24','Velemir Tijana','zekino polje',4],
  [10,'w3-zen-garden','109/24','Karla Krdzovac','zen garden',4],
  [11,'w3-lavirint','121/24','Maša Marković','lavirint',5],
  [12,'w3-zmijica','141/2024','Ivana Simić','Zmijica',1],
  [13,'w3-sudoku','151/24','Nađa Stanić','Brojkice',2],
  [14,'w3-kubismo','138/24','Sofia Ocanto Jovičić','kubismo',3],
  [15,'w3-koncici','126/24','Marija Stojković','končići',1],
  [16,'w3-padalica','161/24','Ivana Cvetković','padalica',4],
  [17,'w3-obojilica','85/24','Anja Bukurović','obojilica',6],
  [18,'w3-putanja','79/24','Katarina Petrović','putanja',6],
  [19,'w3-brza-putanja','84/24','Sanja Hornjaček','3d lavirint',4],
  [20,'w3-2d-lavirint','70/21','Aleksa Vasić','2d lavirint',2],
  [21,'w3-lukic','58/24','Lukić Miljana','brza putanja',null],
  [22,'w3-vijugava-staza','36/24','Aleksa Tašković','vijugava staza',2],
  [23,'w3-lenin-lavirint','132/24','Lena Kovačić','lenin lavirint',2],
  [24,'w3-edukativna','86/24','Katarina Ušjak','edukativna',2],
  [25,'w3-amaze','68/24','Mihailo Maksimović','amaze',1],
  [26,'w3-stapici','18/24','Petra Kalenj','stapici',1],
  [27,'w3-grujic','108/23','Jana Grujić',null,1],
  [28,'w3-fliper','28/24','Iva Mijanović','fliper',3],
  [29,'w3-stilopol','131/24','Lena Dukić','stilopol',2],
  [30,'w3-castle',null,'Filip Doljanovič','Castle',3]
];
// The twelve frames that stand in front of the sequence: trousers caught by the camera, then
// the degree presentations. Cutting the list from frame one instead of from the box is the
// error that gave one object several students' names. These bytes must never reach a work.
const PREFIX_FRAMES=new Set([
  '479c9c96530045ce5e6db3352218c9c6cbf65211befbd8da82928976247a82c5',
  '604983ffeb92ac5f617fc632471d843c28269ddc331208f67f2ae0483cca3fcd',
  '948245d1781340ae7ee8c34239e5d9abbb9cf663f09c429a66307445779d58c2',
  'a044c5f2e933da1c73eaa5257c41fe901b7d19c957175ea9dd61ce88f27313c0',
  'e714674552e373e816fd73939424f14a11cb743656393068f69697c23d142b96',
  '9ac3a9fa01e0533478548152bfd288612cb33594caf05ad6f4ebaa6c9c880ffb',
  'c512ee2686e5904146296e685e73cc7b60af58acb75d1ccf7df1fc5ffceff7de',
  'e7301dfd25499ed77937b8000f9b4e2fff718a6e0815af0db5e1a392c83019b3',
  '717a27df06f47f32e3e434980bd32196dd7130c912bfb056ae8aa9f33146855c',
  '1b1c5dffddf4d352bfd604e0466e1fad7ddfaf5bf3c10435eed299890bb9a137',
  '13f982ee7c4adbd1bb872fefc6e6293b06ec7c8cbf06ee6f05c14cdb9d15b5a3',
  '2320b7909cc1c0e97020b314a0b1e850010614b2b52c0717ac1ac1610ac61d77'
]);

test('every work carries the supplied identity and exactly the listed number of frames', async()=>{
  assert.deepEqual(validatePrototypes(data),[]);
  // LIST je spisak trećeg časa; registar od 24.10.2026 nosi i četvrti, pa se gleda nedelja.
  const shown=new Map(data.galleries.filter(g=>g.documentedWeek===3).map(g=>[g.id,g]));
  const waiting=new Map((data.cekaju||[]).filter(w=>w.documentedWeek===3).map(w=>[w.id,w]));
  assert.equal(shown.size+waiting.size,LIST.length,'the list and the register hold the same works');
  const hashes=new Set();
  for(const [order,id,number,name,title,count] of LIST){
    const work=shown.get(id)??waiting.get(id);
    assert.ok(work,'missing from the register: '+id);
    assert.equal(work.listOrder,order,id+' keeps its place in the shooting order');
    assert.equal(work.author.name,name,id);
    assert.equal(work.author.studentNumber,number??undefined,id);
    assert.equal(work.title.sr,title??'Bez naziva',id);
    assert.equal(work.title.en,title??'Untitled',id);
    if(shown.has(id)){
      assert.equal(work.photos.length,count,id+' shows exactly the frames the teacher counted');
      for(const p of work.photos){
        assert.ok(!hashes.has(p.sha256),'same photograph used in two works: '+p.src);hashes.add(p.sha256);
        assert.ok(!PREFIX_FRAMES.has(p.sha256),'a frame from in front of the sequence reached '+id);
        assert.equal(createHash('sha256').update(await read(p.src)).digest('hex'),p.sha256);
      }
    } else {
      assert.equal(waiting.get(id).expectedPhotos,count,id+' records how many frames are owed');
    }
  }
});

test('the identity line reads as student number, name, and the title the teacher gave', ()=>{
  const kocic=data.galleries.find(g=>g.id==='w3-kocic');
  assert.equal(authorLine(kocic.author),'19/24 — Ksenija Kočić');
  const demiri=data.galleries.find(g=>g.id==='w3-demiri');
  assert.equal(demiri.title.sr,'Bez naziva','a work with no title is marked, never invented');
  const castle=data.galleries.find(g=>g.id==='w3-castle');
  assert.equal(authorLine(castle.author),'Filip Doljanovič','no student number was supplied for Castle');
  // A title or number that nobody supplied must not be inferred from a neighbour on the list.
  const bad=structuredClone(data);bad.galleries[0].author.studentNumber='pogodjeno';
  assert.ok(validatePrototypes(bad).length);
});

test('a continued work gathers every week the same student handed in',async()=>{
  const continued=data.galleries.filter(g=>g.continues);
  assert.ok(continued.length>=4,'Music box, Zmijica, Sudoku and kubismo continue earlier submissions');
  for(const g of continued){
    const earlier=data.items.find(it=>it.id===g.continues);
    assert.ok(earlier,g.id+' names a prototype already in the register');
    setLanguage('sr');
    const page=galleryDetail(data,g.id);
    for(const p of [...g.photos,...earlier.photos]) assert.ok(page.includes(`src="${p.src}"`),g.id+' shows '+p.src);
    assert.ok(page.includes('Čas 3')&&page.includes('Čas '+earlier.documentedWeek),g.id+' separates the weeks');
  }
  // A continuation can only point at a work the register already holds.
  const bad=structuredClone(data);bad.galleries[0].continues='nepostojeci-rad';
  assert.ok(validatePrototypes(bad).length);
});

test('each work has its own complete static page and bilingual runtime',async()=>{
  for(const g of data.galleries){
    setLanguage('sr');const html=(await read(`galerija-${g.id}.html`)).toString();
    assert.ok(html.includes(galleryDetail(data,g.id)));
    assert.ok(html.includes(g.author.name),g.id+' names its author on the page');
    for(const p of g.photos) assert.ok(html.includes(`src="${p.src}"`));
    setLanguage('en');assert.ok(galleryDetail(data,g.id).includes(g.title.en));
  }
  setLanguage('sr');
});
