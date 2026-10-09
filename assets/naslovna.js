// The cover: the workbook as a real lit stack of A3 sheets — one per held week,
// one more on its way. DOM is the contract (title, doors, counts); the canvas is only
// the stage. Without JavaScript, without WebGL, or with reduced motion, the drawn
// stack below the canvas is the page — nothing is claimed that is not rendered.

import { $, esc, tr, mount, loadJSON } from './core.js';
import { identity } from './identity.js';
import { validateTok } from './tok-core.js';

const PAPER = 0xf6f7f2;
const SHEET = 0xffffff;
const SIGNAL = 0xd9f88d;

let tok = null;          // live flow data — the sheet count is truth, not decoration
let scene = null;        // stays null until three.js loads and WebGL answers

/* ---------- the view: title block, doors, counts — all DOM ---------- */

function view() {
  const odrzano = tok ? tok.odrzano.length : Number($('.cover-stage')?.dataset.odrzano || 0);
  const sledeci = tok ? tok.sledeci.filter(item => item.vrsta === 'cas' && typeof item.nedelja === 'number')[0]?.nedelja
    : Number($('.cover-stage')?.dataset.sledeciNedelja || 0);
  return `
<div class="cover-stage" data-odrzano="${odrzano}" data-sledeci-nedelja="${sledeci ?? ''}">
  <div id="cover-scene" class="cover-scene" aria-hidden="true">
    <svg class="cover-fallback" viewBox="0 0 520 320" role="img" aria-label="${tr('A stack of A3 sheets; one more sheet is arriving.', 'Snop A3 listova; još jedan list je na putu.')}">
      <g fill="none" stroke="currentColor" stroke-width="2">
        <path d="M104 208 L300 148 L496 208 L300 268 Z" fill="var(--white)"/>
        <path d="M102 222 L298 162 L494 222 L298 282 Z" fill="var(--white)"/>
        <path d="M105 236 L301 176 L497 236 L301 296 Z" fill="var(--white)"/>
        <path d="M100 118 L296 58 L492 118 L296 178 Z" fill="var(--white)"/>
        <path d="M296 58 L492 118 L300 178" stroke="var(--signal)" stroke-width="5" opacity=".9"/>
      </g>
      <g stroke="currentColor" opacity=".45" stroke-dasharray="4 5" stroke-width="1.5" fill="none">
        <path d="M300 178 L300 196"/>
        <path d="M100 118 L104 188"/>
        <path d="M492 118 L496 188"/>
      </g>
    </svg>
  </div>
  <div class="cover-title">
    <p class="eyebrow">${tr('The course workbook · cover', 'Radna sveska predmeta · naslovna')}</p>
    <h1>${tr('A workbook<br>that grows.', 'Sveska<br>koja raste.')}</h1>
    <p class="lede">${tr(
      'Each week of this course ends as one A3 sheet — horizontal, printed and digital. Sheet by sheet, the weeks stack into the workbook you hand in at the exam. Three doors from here: the flow of the course, the space of the association, and the course itself.',
      'Svaka nedelja ovog predmeta završava se jednim A3 listom — horizontalnim, štampanim i digitalnim. List po list, nedelje se ređaju u svesku koju predaješ na ispitu. Odavde tri vrata: tok predmeta, prostor udruženja i sam predmet.')}</p>
    <p class="cover-count">${tr('Week', 'Nedelja')} <b data-count="odrzano">${odrzano}</b> ${tr('held · week', 'održana · nedelja')} <b data-count="sledeci-nedelja">${sledeci ?? '—'}</b> ${tr('on its way', 'na putu')}</p>
  </div>
</div>
<nav class="cover-doors" aria-label="${tr('Where to go from the cover', 'Kuda sa naslovne')}">
  <a class="cover-door" href="index.html"><span class="cover-door-num" aria-hidden="true">01</span><span><b>${tr('Held classes', 'Održano na času')}</b><span>${tr('Held classes in order with results, the material that helps, and each week’s A3 sheet.', 'Časovi redom sa rezultatima, materijal koji pomaže i A3 list svake nedelje.')}</span></span></a>
  <a class="cover-door" href="udruzenje.html"><span class="cover-door-num" aria-hidden="true">02</span><span><b>${tr('The association', 'Udruženje')}</b><span>${tr('Trying the prototypes: your rights, the steps, the practical space.', 'Probavanje prototipova: tvoja prava, koraci, praktični prostor.')}</span></span></a>
  <a class="cover-door" href="predmet.html"><span class="cover-door-num" aria-hidden="true">03</span><span><b>${tr('The course', 'Predmet')}</b><span>${tr('Aims, marking, and the exam format — A3 horizontal, printed and digital.', 'Ciljevi, bodovanje i format ispita — A3 horizontalno, štampano i digitalno.')}</span></span></a>
</nav>
<section class="print-only print-cover" aria-label="${tr('The printable A3 cover of the workbook', 'Naslovna A3 strana radne sveske za štampu')}">
  <div class="print-cover-mark" aria-hidden="true"><span></span></div>
  <h2>${esc(tr(identity.title.en, identity.title.sr))} — radna sveska</h2>
  <p class="print-cover-sub">A3 horizontalna radna sveska · štampana + digitalna · 2026/2027</p>
  <dl class="print-cover-fields">
    <div><dt>Ime i prezime / Name</dt><dd></dd></div>
    <div><dt>Tim / Team</dt><dd></dd></div>
    <div><dt>Fakultet / Faculty</dt><dd>Fakultet za graditeljski menadžment, Univerzitet „Union — Nikola Tesla”, Beograd</dd></div>
    <div><dt>Broj listova / Sheets</dt><dd></dd></div>
  </dl>
  <p class="print-cover-note">Svaka nastavna nedelja dodaje jedan list. Sveska se predaje na kolokvijumu/ispitu u formatu iznad.</p>
</section>`;
}

function render() {
  $('#main').innerHTML = view();
  if (scene) {
    const holder = $('#cover-scene');
    holder?.appendChild(scene.canvas);
    holder?.classList.add('has-canvas');
  }
}

/* ---------- the stage: three.js, loaded on demand, never required ---------- */

function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

async function bootScene() {
  const stage = $('.cover-stage');
  const holder = $('#cover-scene');
  if (!holder || !stage) return;
  let THREE;
  try {
    THREE = await import('./vendor/three.module.min.js');
  } catch { return; } // offline-first: the drawn stack stays, no third party is called
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  } catch { return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.setClearColor(PAPER, 1);

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 40);
  camera.position.set(3.6, 2.9, 4.8);
  camera.lookAt(0, 0.35, 0);

  const stack = new THREE.Group();
  const settled = Math.max(1, tok ? tok.odrzano.length : Number(stage.dataset.odrzano || 1));
  const paperMaterial = new THREE.MeshStandardMaterial({ color: SHEET, roughness: 0.85, metalness: 0 });
  const sheetGeometry = new THREE.BoxGeometry(4.2, 0.024, 2.97);
  const jitter = [[0.030, 0.012, -0.010], [-0.022, -0.014, 0.008], [0.014, 0.010, 0.020], [-0.030, 0.008, -0.014], [0.026, -0.010, 0.012]];
  for (let i = 0; i < settled; i++) {
    const sheet = new THREE.Mesh(sheetGeometry, paperMaterial);
    const [yaw, dx, dz] = jitter[i % jitter.length];
    sheet.rotation.y = yaw;
    sheet.position.set(dx, 0.012 + i * 0.027, dz);
    sheet.castShadow = true;
    sheet.receiveShadow = true;
    stack.add(sheet);
  }
  // The arriving sheet carries the studio's one accent: a signal bookmark at its edge.
  const arriving = new THREE.Group();
  const sheet = new THREE.Mesh(sheetGeometry, paperMaterial);
  sheet.castShadow = true;
  arriving.add(sheet);
  const bookmark = new THREE.Mesh(
    new THREE.BoxGeometry(4.24, 0.012, 0.18),
    new THREE.MeshStandardMaterial({ color: SIGNAL, roughness: 0.6, metalness: 0 })
  );
  bookmark.position.set(0, 0.012, 1.42);
  arriving.add(bookmark);
  const restY = 0.012 + settled * 0.027 + 0.014;
  arriving.position.set(0, restY, 0);
  arriving.rotation.y = -0.018;
  stack.add(arriving);
  if (!reduced) { arriving.position.y = restY + 1.6; arriving.rotation.y = 0.55; }

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 40),
    new THREE.MeshStandardMaterial({ color: PAPER, roughness: 1, metalness: 0 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;

  const key = new THREE.DirectionalLight(0xfff3e0, 1.7);
  key.position.set(4, 6, 3);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  Object.assign(key.shadow.camera, { left: -4, right: 4, top: 4, bottom: -4, near: 1, far: 16 });
  const fill = new THREE.HemisphereLight(0xffffff, 0xdfe6da, 0.55);

  const world = new THREE.Scene();
  world.add(ground, stack, key, fill);

  const stageBox = stage; // the stage element was captured before the scene graph was built
  function fit() {
    const box = stageBox.getBoundingClientRect();
    if (!box.width || !box.height) return;
    renderer.setSize(box.width, box.height, false);
    camera.aspect = box.width / box.height;
    camera.updateProjectionMatrix();
    needsFrame = true;
  }

  holder.appendChild(renderer.domElement);
  holder.classList.add('has-canvas');
  scene = { canvas: renderer.domElement };

  // One settling move, then the desk is still: frames are drawn only when something changed.
  const start = performance.now();
  const settleMs = 950;
  let needsFrame = true;
  let raf = 0;
  let parallax = { x: 0, y: 0, tx: 0, ty: 0 };

  function frame(now) {
    raf = 0;
    if (!reduced && now - start < settleMs + 350) {
      const t = Math.min(1, Math.max(0, (now - start - 350) / settleMs));
      const e = easeOutCubic(t);
      arriving.position.y = restY + 1.6 * (1 - e);
      arriving.rotation.y = -0.018 + 0.568 * (1 - e);
      needsFrame = true;
    } else if (!reduced && arriving.position.y !== restY) {
      arriving.position.y = restY;
      arriving.rotation.y = -0.018;
      needsFrame = true;
    }
    if (Math.abs(parallax.tx - parallax.x) > 0.0004 || Math.abs(parallax.ty - parallax.y) > 0.0004) {
      parallax.x += (parallax.tx - parallax.x) * 0.08;
      parallax.y += (parallax.ty - parallax.y) * 0.08;
      needsFrame = true;
    }
    stack.rotation.y = parallax.x;
    stack.rotation.x = parallax.y;
    renderer.render(world, camera);
    if (needsFrame) { needsFrame = false; raf = requestAnimationFrame(frame); }
  }
  const wake = () => { if (!raf) raf = requestAnimationFrame(frame); };

  if (!reduced) {
    stageBox.addEventListener('pointermove', event => {
      const box = stageBox.getBoundingClientRect();
      parallax.tx = ((event.clientX - box.left) / box.width - 0.5) * 0.10;
      parallax.ty = ((event.clientY - box.top) / box.height - 0.5) * -0.05;
      wake();
    });
    stageBox.addEventListener('pointerleave', () => { parallax.tx = 0; parallax.ty = 0; wake(); });
  }
  new ResizeObserver(fit).observe(stageBox);
  fit();
  wake();
}

/* ---------- boot ---------- */

mount({ view: 'cover', render, title: () => tr('Cover', 'Naslovna') });

try {
  const data = await loadJSON('data/tok.json');
  const problems = validateTok(data);
  if (!problems.length) {
    tok = data;
    render();
    bootScene();
  } else {
    bootScene(); // the drawn baseline keeps the counts; the stage still shows the stack
  }
} catch {
  bootScene();
}
