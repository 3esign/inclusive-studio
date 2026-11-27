// Filter and viewer for pages whose content is re-rendered into place (class collage,
// journal). Everything is delegated from the document, so a re-render or a language switch
// needs no re-binding. Without this script the page still works: every card and every
// extra view is a plain link to its photograph, and every row is visible.
const norm = s => String(s || '').toLowerCase().replace(/đ/g, 'dj').normalize('NFD').replace(/\p{M}/gu, '');
const english = () => (document.documentElement.lang || '').startsWith('en');
const text = (en, sr) => english() ? en : sr;

function applyFilter(input) {
  const target = document.getElementById(input.dataset.filter);
  if (!target) return;
  // A final vowel is the case ending: "torba" also finds "torbe" and "torbica".
  const words = norm(input.value).split(/\s+/).filter(Boolean).map(w => w.length > 3 ? w.replace(/[aeiou]$/, '') : w);
  const items = [...target.querySelectorAll('[data-filter-item]')];
  let shown = 0;
  for (const item of items) {
    // "nadja" and "nada" both find Nađa: the text is searched in both spellings.
    const full = norm(`${item.textContent} ${item.dataset.search || ''}`);
    const hay = `${full} ${full.replace(/dj/g, 'd')}`;
    const hit = words.every(w => hay.includes(w));
    item.hidden = !hit;
    if (hit) shown++;
  }
  const count = document.querySelector(`[data-filter-count="${input.dataset.filter}"]`);
  if (count) count.textContent = words.length ? `${shown} / ${items.length}` : '';
  const empty = document.querySelector(`[data-filter-empty="${input.dataset.filter}"]`);
  if (empty) empty.hidden = shown > 0;
}
document.addEventListener('input', e => { if (e.target.matches?.('input[data-filter]')) applyFilter(e.target); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && e.target.matches?.('input[data-filter]') && e.target.value) { e.target.value = ''; applyFilter(e.target); e.preventDefault(); }
});

/* ---------- viewer ---------- */
let dialog = null, frames = [], at = 0, opener = null;

function build() {
  dialog = document.createElement('dialog');
  dialog.className = 'kolaz-viewer';
  dialog.innerHTML = '<div class="kolaz-viewer-top"><p class="kolaz-viewer-caption" aria-live="polite"></p><button type="button" data-kv="close"></button></div><div class="kolaz-viewer-stage"><button type="button" data-kv="prev">‹</button><img alt=""><button type="button" data-kv="next">›</button></div><div class="kolaz-viewer-strip"></div>';
  document.body.append(dialog);
  dialog.addEventListener('click', e => {
    const action = e.target.closest('[data-kv]')?.dataset.kv;
    const thumb = e.target.closest('[data-kv-at]');
    if (action === 'close' || e.target === dialog) dialog.close();
    else if (action === 'prev') show(at - 1);
    else if (action === 'next') show(at + 1);
    else if (thumb) show(Number(thumb.dataset.kvAt));
  });
  dialog.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { show(at - 1); e.preventDefault(); }
    if (e.key === 'ArrowRight') { show(at + 1); e.preventDefault(); }
  });
  let touchX = null;
  dialog.addEventListener('touchstart', e => { touchX = e.changedTouches?.[0]?.clientX ?? null; }, { passive: true });
  dialog.addEventListener('touchend', e => {
    if (touchX === null) return;
    const dx = (e.changedTouches?.[0]?.clientX ?? touchX) - touchX;
    touchX = null;
    if (Math.abs(dx) > 42) show(dx < 0 ? at + 1 : at - 1);
  }, { passive: true });
  dialog.addEventListener('close', () => { opener?.focus(); opener = null; });
}

// Every visible frame in page order: the arrows walk the whole (filtered) collage.
function collect() {
  frames = [];
  for (const card of document.querySelectorAll('.kolaz-card:not([hidden])')) {
    const titleEl = card.querySelector('[data-kolaz-title]');
    const jump = titleEl?.tagName === 'A' ? titleEl.getAttribute('href') : null;
    const links = [...card.querySelectorAll('a[data-kolaz-photo]')];
    links.forEach((link, k) => frames.push({ src: link.getAttribute('href'), alt: link.dataset.alt || '', rb: card.dataset.celina, title: titleEl?.textContent || '', jump, time: card.querySelector('time')?.textContent || '', k, of: links.length, link }));
  }
}

function show(index) {
  if (!frames.length) return;
  at = (index + frames.length) % frames.length;
  const f = frames[at];
  const img = dialog.querySelector('.kolaz-viewer-stage img');
  img.src = f.src; img.alt = f.alt;
  const badge = document.createElement('b');
  badge.textContent = String(f.rb).padStart(2, '0');
  const capNodes = [badge, ` ${f.title} · ${f.time} · ${f.k + 1}/${f.of}`];
  if (f.jump) {
    const jumpLink = document.createElement('a');
    jumpLink.className = 'kolaz-viewer-jump';
    jumpLink.href = f.jump;
    jumpLink.textContent = text('in collage ↗', 'u kolažu ↗');
    capNodes.push(' ', jumpLink);
  }
  dialog.querySelector('.kolaz-viewer-caption').replaceChildren(...capNodes);
  dialog.querySelector('[data-kv="close"]').textContent = text('Close', 'Zatvori');
  dialog.querySelector('[data-kv="prev"]').setAttribute('aria-label', text('Previous photograph', 'Prethodna fotografija'));
  dialog.querySelector('[data-kv="next"]').setAttribute('aria-label', text('Next photograph', 'Sledeća fotografija'));
  const strip = dialog.querySelector('.kolaz-viewer-strip');
  strip.replaceChildren(...frames.map((x, i) => ({ x, i })).filter(({ x }) => x.rb === f.rb).map(({ x, i }) => {
    const button = document.createElement('button');
    button.type = 'button'; button.dataset.kvAt = i;
    if (i === at) button.setAttribute('aria-current', 'true');
    const thumb = document.createElement('img');
    thumb.src = x.src; thumb.alt = `${x.k + 1}/${x.of}`;
    button.append(thumb);
    return button;
  }));
  strip.hidden = f.of < 2;
  // Warm the neighbours so the arrows feel immediate.
  for (const n of [at + 1, at - 1]) new Image().src = frames[(n + frames.length) % frames.length].src;
}

document.addEventListener('click', e => {
  const link = e.target.closest?.('a[data-kolaz-photo]');
  if (!link || e.ctrlKey || e.metaKey || e.shiftKey || e.button) return;
  if (typeof HTMLDialogElement === 'undefined') return;
  e.preventDefault();
  if (!dialog) build();
  collect();
  opener = link;
  dialog.showModal();
  show(Math.max(0, frames.findIndex(f => f.link === link)));
});
