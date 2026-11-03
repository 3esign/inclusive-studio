// ==========================================================================
// FIRSTEX · Inclusive Studio — Interaktivni kontroler Tekstilnog atlasa
// Stalno dostupni header, brzi filteri (P1–P6, V1–V4, A1–F4), Vizuelni vodič (32 foto),
// Kalkulator bilansa suve mase i vremena (8 procesa), Lightbox modal i 100 dokaznih kartica.
// ==========================================================================

import { applyComfort, bindChrome, chrome } from './core.js';

(function () {
  applyComfort();
  const drawShell = () => chrome('atlas');
  drawShell();
  bindChrome(drawShell);

  const searchInput = document.getElementById('atlas-search');
  const clearBtn = document.getElementById('atlas-clear');
  const showAllBtn = document.getElementById('atlas-toggle-all');
  const statusPill = document.getElementById('atlas-filter-status');

  const pathBtns = Array.from(document.querySelectorAll('[data-filter-path]'));
  const skillBtns = Array.from(document.querySelectorAll('[data-filter-skill]'));
  const decisionBtns = Array.from(document.querySelectorAll('[data-filter-decision]'));
  const themeSpreads = Array.from(document.querySelectorAll('.theme-spread[data-theme-id]'));
  const allCards = Array.from(document.querySelectorAll('.atlas-card[data-card-id]'));
  const totalCardsCount = allCards.length || 100;
  const themePills = Array.from(document.querySelectorAll('.theme-pill[data-target-theme]'));
  const trackedSections = Array.from(document.querySelectorAll('[data-nav-section]'));

  // Vizuelni vodič (32 fotografije) filteri
  const vgFilterBtns = Array.from(document.querySelectorAll('[data-vg-filter]'));
  const vgCards = Array.from(document.querySelectorAll('.vg-card[data-vg-cat]'));

  // Lightbox elementi
  const lightbox = document.getElementById('atlas-lightbox');
  const lbImg = document.getElementById('lb-img');
  const lbBadge = document.getElementById('lb-badge');
  const lbTitle = document.getElementById('lb-title');
  const lbWhat = document.getElementById('lb-what');
  const lbRecognize = document.getElementById('lb-recognize');
  const lbSource = document.getElementById('lb-source');
  const lbCards = document.getElementById('lb-cards');
  const lbClose = document.getElementById('lb-close');

  let activePath = '';
  let activeSkill = '';
  let activeDecision = '';
  let searchQuery = '';

  const norm = (s) =>
    String(s || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'dj');

  function syncFilterButtons() {
    for (const b of pathBtns) {
      b.setAttribute('aria-pressed', b.getAttribute('data-filter-path') === activePath ? 'true' : 'false');
    }
    for (const b of skillBtns) {
      b.setAttribute('aria-pressed', b.getAttribute('data-filter-skill') === activeSkill ? 'true' : 'false');
    }
    for (const b of decisionBtns) {
      b.setAttribute('aria-pressed', b.getAttribute('data-filter-decision') === activeDecision ? 'true' : 'false');
    }
  }

  function applyFilters() {
    const q = norm(searchQuery.trim());
    const isFiltering = Boolean(q || activePath || activeSkill || activeDecision);

    if (isFiltering) {
      document.body.classList.add('show-all-cards');
    } else if (showAllBtn && showAllBtn.getAttribute('aria-pressed') !== 'true') {
      document.body.classList.remove('show-all-cards');
    }

    let visibleCardsCount = 0;

    for (const spread of themeSpreads) {
      const cardsInTheme = Array.from(spread.querySelectorAll('.atlas-card[data-card-id]'));
      let themeMatchCount = 0;

      for (const card of cardsInTheme) {
        const cardPaths = (card.getAttribute('data-paths') || '').split(',').filter(Boolean);
        const cardSkills = (card.getAttribute('data-skills') || '').split(',').filter(Boolean);
        const cardDecisions = (card.getAttribute('data-decisions') || '').split(',').filter(Boolean);
        const searchBlob = card.getAttribute('data-search') || '';

        const matchPath = !activePath || cardPaths.includes(activePath);
        const matchSkill = !activeSkill || cardSkills.includes(activeSkill);
        const matchDecision = !activeDecision || cardDecisions.includes(activeDecision);
        const matchQuery = !q || searchBlob.includes(q);

        const visible = matchPath && matchSkill && matchDecision && matchQuery;
        card.hidden = !visible;
        if (visible) {
          themeMatchCount++;
          visibleCardsCount++;
        }
      }

      const countBadge = spread.querySelector('[data-theme-visible-count]');
      if (countBadge) {
        countBadge.textContent = isFiltering
          ? `Prikazano ${themeMatchCount} od ${cardsInTheme.length} kartica`
          : `${cardsInTheme.length} kartica u ovoj temi`;
      }

      spread.hidden = isFiltering ? themeMatchCount === 0 : false;
    }

    if (statusPill) {
      const parts = [];
      if (activePath) parts.push(`Put ${activePath}`);
      if (activeSkill) parts.push(`Veština ${activeSkill}`);
      if (activeDecision) parts.push(`Odluka ${activeDecision}`);
      if (q) parts.push(`„${searchQuery.trim()}“`);

      if (parts.length > 0) {
        statusPill.textContent = `${visibleCardsCount} / ${totalCardsCount} kartica (${parts.join(' + ')})`;
      } else {
        statusPill.textContent = `${totalCardsCount} kartica · 32 foto`;
      }
    }

    if (clearBtn) {
      clearBtn.hidden = !isFiltering;
    }
  }

  function revealResults() {
    const first = themeSpreads.find((sp) => !sp.hidden);
    const target = (first && first.querySelector('.atlas-card:not([hidden])')) || first || statusPill;
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Filter po putevima P1–P6
  for (const btn of pathBtns) {
    btn.addEventListener('click', () => {
      const pid = btn.getAttribute('data-filter-path') || '';
      activePath = activePath === pid ? '' : pid;
      syncFilterButtons();
      applyFilters();
      if (activePath) revealResults();
    });
  }

  // Filter po veštinama V1–V4
  for (const btn of skillBtns) {
    btn.addEventListener('click', () => {
      const sid = btn.getAttribute('data-filter-skill') || '';
      activeSkill = activeSkill === sid ? '' : sid;
      syncFilterButtons();
      applyFilters();
      if (activeSkill) revealResults();
    });
  }

  // Filter po 31 dizajnerskoj odluci A1–F4 (u matrici i na bedževima kartica)
  for (const btn of decisionBtns) {
    btn.addEventListener('click', () => {
      const did = btn.getAttribute('data-filter-decision') || '';
      activeDecision = activeDecision === did ? '' : did;
      syncFilterButtons();
      applyFilters();
      if (activeDecision) revealResults();
    });
  }

  // Pretraga
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      searchQuery = searchInput.value || '';
      applyFilters();
    });
  }

  // Poništavanje filtera
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      activePath = '';
      activeSkill = '';
      activeDecision = '';
      searchQuery = '';
      if (searchInput) searchInput.value = '';
      syncFilterButtons();
      applyFilters();
    });
  }

  // Globalno dugme: Otvori svih 100 kartica odjednom
  if (showAllBtn) {
    showAllBtn.addEventListener('click', () => {
      const pressed = showAllBtn.getAttribute('aria-pressed') === 'true';
      const next = !pressed;
      showAllBtn.setAttribute('aria-pressed', next ? 'true' : 'false');
      showAllBtn.textContent = next ? 'Sažmi kartice' : `Sve kartice (${totalCardsCount})`;
      document.body.classList.toggle('show-all-cards', next);
    });
  }

  // Filter kategorija u Vizuelnom vodiču (32 fotografije)
  for (const fbtn of vgFilterBtns) {
    fbtn.addEventListener('click', () => {
      const cat = fbtn.getAttribute('data-vg-filter') || 'all';
      for (const b of vgFilterBtns) {
        b.setAttribute('aria-pressed', b === fbtn ? 'true' : 'false');
      }
      for (const card of vgCards) {
        const cCat = card.getAttribute('data-vg-cat') || '';
        card.hidden = cat !== 'all' && cCat !== cat;
      }
    });
  }

  // Dugmad za proširivanje pojedinačne teme
  for (const spread of themeSpreads) {
    const expandBtn = spread.querySelector('.theme-expand-btn');
    if (!expandBtn) continue;
    const total = Number(expandBtn.getAttribute('data-total') || '0');
    const initial = Number(expandBtn.getAttribute('data-initial') || '4');
    const rest = Math.max(0, total - initial);

    expandBtn.addEventListener('click', () => {
      const expanded = spread.classList.toggle('is-expanded');
      expandBtn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      expandBtn.textContent = expanded
        ? `Sažmi kartice ove teme (prikaži prvih ${initial})`
        : `+ Prikaži sve kartice ove teme (još ${rest} · ukupno ${total})`;
    });
  }

  // Skok na karticu (#kartica-XX) automatski otvara njenu temu i ističe je
  function revealCardByHash(hash) {
    if (!hash || !hash.startsWith('#kartica-')) return;
    const target = document.querySelector(hash);
    if (!target) return;
    if (lightbox && !lightbox.hidden) {
      lightbox.hidden = true;
    }
    const parentSpread = target.closest('.theme-spread');
    if (parentSpread) {
      parentSpread.hidden = false;
      if (!parentSpread.classList.contains('is-expanded')) {
        const expandBtn = parentSpread.querySelector('.theme-expand-btn');
        if (expandBtn) expandBtn.click();
        else parentSpread.classList.add('is-expanded');
      }
    }
    target.hidden = false;
    for (const c of allCards) c.classList.remove('is-highlighted');
    target.classList.add('is-highlighted');
    setTimeout(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 40);
  }

  // Lightbox otvaranje klikom na bilo koju fotografiju sa [data-photo-open]
  function openPhotoModal(el) {
    if (!lightbox) return;
    const src = el.getAttribute('data-photo-src') || '';
    const code = el.getAttribute('data-photo-id') || '';
    const cat = el.getAttribute('data-photo-cat') || '';
    const title = el.getAttribute('data-photo-title') || '';
    const what = el.getAttribute('data-photo-what') || '';
    const rec = el.getAttribute('data-photo-rec') || '';
    const source = el.getAttribute('data-photo-source') || '';
    const sourceUrl = el.getAttribute('data-photo-url') || '';
    const cards = (el.getAttribute('data-photo-cards') || '').split(',').filter(Boolean);

    if (lbImg) {
      lbImg.src = src;
      lbImg.alt = title;
    }
    if (lbBadge) lbBadge.textContent = `${code} · ${cat}`;
    if (lbTitle) lbTitle.textContent = title;
    if (lbWhat) lbWhat.textContent = what;
    if (lbRecognize) lbRecognize.textContent = rec;
    if (lbSource) {
      lbSource.innerHTML = sourceUrl
        ? `Izvor fotografije: <a href="${sourceUrl}" target="_blank" rel="noopener noreferrer">${source} ↗</a>`
        : `Izvor fotografije: ${source}`;
    }
    if (lbCards) {
      lbCards.innerHTML = cards.length
        ? 'Povezane dokazne kartice: ' +
          cards.map((cid) => `<a href="#kartica-${cid}" class="vg-jump-link">#${cid}</a>`).join(' ')
        : '';
    }
    lightbox.hidden = false;
  }

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#kartica-"]');
    if (link) {
      const href = link.getAttribute('href');
      if (href) revealCardByHash(href);
      return;
    }

    const photoTrigger = e.target.closest('[data-photo-open]');
    if (photoTrigger && !e.target.closest('a')) {
      openPhotoModal(photoTrigger);
      return;
    }

    if (lightbox && !lightbox.hidden && e.target === lightbox) {
      lightbox.hidden = true;
    }
  });

  if (lbClose && lightbox) {
    lbClose.addEventListener('click', () => {
      lightbox.hidden = true;
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && !lightbox.hidden) {
      lightbox.hidden = true;
    }
  });

  if (window.location.hash && window.location.hash.startsWith('#kartica-')) {
    revealCardByHash(window.location.hash);
  }

  // Interaktivni kalkulator bilansa suve mase tekstila i vremena rada (8 radioničkih procesa)
  const presetBtns = Array.from(document.querySelectorAll('.process-preset-btn[data-preset-id]'));
  const inpUnits = document.getElementById('calc-units');
  const inpMass = document.getElementById('calc-unit-mass');
  const inpPct = document.getElementById('calc-textile-pct');
  const inpMin = document.getElementById('calc-minutes');

  const outDryMass = document.getElementById('out-dry-mass');
  const outTotalMass = document.getElementById('out-total-mass');
  const outFor10kg = document.getElementById('out-for-10kg');
  const outHours = document.getElementById('out-hours');
  const outThroughput = document.getElementById('out-throughput');
  const outLaborRef = document.getElementById('out-labor-ref');
  const outProcessNote = document.getElementById('out-process-note');

  const fmtNum = (n, dec = 2) =>
    Number(n || 0).toLocaleString('sr-RS', {
      minimumFractionDigits: dec,
      maximumFractionDigits: dec
    });

  function updateCalculator() {
    if (!inpUnits || !inpMass || !inpPct || !inpMin) return;
    const units = Math.max(1, Number(inpUnits.value) || 1);
    const unitMassKg = Math.max(0.005, Number(inpMass.value) || 0.05);
    const pct = Math.min(100, Math.max(0.1, Number(inpPct.value) || 100));
    const minsPerUnit = Math.max(0.5, Number(inpMin.value) || 5);

    const dryTextilePerUnitKg = unitMassKg * (pct / 100);
    const totalDryTextileKg = units * dryTextilePerUnitKg;
    const totalCompositeMassKg = units * unitMassKg;
    const nonTextileMassKg = Math.max(0, totalCompositeMassKg - totalDryTextileKg);

    const unitsFor10kg = Math.ceil(10 / Math.max(0.0001, dryTextilePerUnitKg));
    const unitsFor100kg = Math.ceil(100 / Math.max(0.0001, dryTextilePerUnitKg));

    const totalMinutes = units * minsPerUnit;
    const totalHours = totalMinutes / 60;
    const kgPerHour = totalHours > 0 ? totalDryTextileKg / totalHours : 0;
    const refLaborRsd = Math.round(totalHours * 371);
    const rsdPerKg = totalDryTextileKg > 0 ? Math.round(refLaborRsd / totalDryTextileKg) : 0;

    if (outDryMass) {
      outDryMass.textContent = `${fmtNum(totalDryTextileKg, 2)} kg`;
    }
    if (outTotalMass) {
      outTotalMass.textContent =
        pct < 99.5
          ? `Ukupna masa sklopa: ${fmtNum(totalCompositeMassKg, 2)} kg (od toga ${fmtNum(nonTextileMassKg, 2)} kg vezivo/matrica/ram — računamo samo suvi tekstil!)`
          : `100% suva tekstilna frakcija (${fmtNum(dryTextilePerUnitKg * 1000, 0)} g po jedinici)`;
    }
    if (outFor10kg) {
      outFor10kg.textContent = `${unitsFor10kg.toLocaleString('sr-RS')} kom`;
      const lbl = outFor10kg.nextElementSibling;
      if (lbl) {
        lbl.textContent = `Za 10 kg suvog tekstila (za 100 kg: ${unitsFor100kg.toLocaleString('sr-RS')} kom)`;
      }
    }
    if (outHours) {
      outHours.textContent = `${fmtNum(totalHours, 1)} h (${Math.round(totalMinutes)} min)`;
    }
    if (outThroughput) {
      outThroughput.textContent = `Propusnost stanice: ${fmtNum(kgPerHour, 2)} kg suvog tekstila / sat aktivnog rada`;
    }
    if (outLaborRef) {
      outLaborRef.textContent = `${refLaborRsd.toLocaleString('sr-RS')} RSD`;
      const lbl = outLaborRef.nextElementSibling;
      if (lbl) {
        lbl.textContent = `Referentni fond rada po ≥ 371 RSD/sat (#73) · ~${rsdPerKg.toLocaleString('sr-RS')} RSD po 1 kg tekstila`;
      }
    }
  }

  for (const pbtn of presetBtns) {
    pbtn.addEventListener('click', () => {
      for (const b of presetBtns) {
        b.setAttribute('aria-pressed', b === pbtn ? 'true' : 'false');
      }
      if (inpUnits) inpUnits.value = pbtn.getAttribute('data-units') || '25';
      if (inpMass) inpMass.value = pbtn.getAttribute('data-mass') || '0.08';
      if (inpPct) inpPct.value = pbtn.getAttribute('data-pct') || '100';
      if (inpMin) inpMin.value = pbtn.getAttribute('data-min') || '3';
      if (outProcessNote) {
        const note = pbtn.getAttribute('data-note') || '';
        const gate = pbtn.getAttribute('data-gate') || '';
        const cards = (pbtn.getAttribute('data-cards') || '')
          .split(',')
          .filter(Boolean)
          .map((c) => `<a href="#kartica-${c}">#${c}</a>`)
          .join(' ');
        outProcessNote.innerHTML = `<b>Operacije i uloga ljudi:</b> ${note}<br><b>Kapija pre serije:</b> ${gate} ${
          cards ? `· <b>Kartice:</b> ${cards}` : ''
        }`;
      }
      updateCalculator();
    });
  }

  for (const inp of [inpUnits, inpMass, inpPct, inpMin]) {
    if (inp) {
      inp.addEventListener('input', updateCalculator);
    }
  }
  updateCalculator();

  // Interaktivna provera spremnosti predloga (7 kapija pre posete udruženju)
  const gateBtns = Array.from(document.querySelectorAll('.gate-item-btn[data-gate-id]'));
  const gateCounter = document.getElementById('gate-counter-pill');
  const gateResetBtn = document.getElementById('gate-reset-btn');

  function updateGateCounter() {
    if (!gateCounter) return;
    const checked = gateBtns.filter((b) => b.getAttribute('aria-pressed') === 'true').length;
    gateCounter.textContent =
      checked === gateBtns.length
        ? `✓ Svih ${checked} / ${gateBtns.length} kapija potvrđeno — spremno za probu`
        : `Potvrđeno ${checked} / ${gateBtns.length} kapija pre posete`;
    if (gateResetBtn) {
      gateResetBtn.hidden = checked === 0;
    }
  }

  for (const gbtn of gateBtns) {
    gbtn.addEventListener('click', () => {
      const next = gbtn.getAttribute('aria-pressed') !== 'true';
      gbtn.setAttribute('aria-pressed', next ? 'true' : 'false');
      const box = gbtn.querySelector('.gate-check-box');
      if (box) box.textContent = next ? '✓' : gbtn.getAttribute('data-gate-id') || '';
      updateGateCounter();
    });
  }

  if (gateResetBtn) {
    gateResetBtn.addEventListener('click', () => {
      for (const gbtn of gateBtns) {
        gbtn.setAttribute('aria-pressed', 'false');
        const box = gbtn.querySelector('.gate-check-box');
        if (box) box.textContent = gbtn.getAttribute('data-gate-id') || '';
      }
      updateGateCounter();
    });
  }

  // Praćenje aktivne sekcije/teme pri skrolu u uvek dostupnom zaglavlju
  const observedEls = trackedSections.length > 0 ? trackedSections : themeSpreads;
  if ('IntersectionObserver' in window && observedEls.length > 0) {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const tid = entry.target.getAttribute('data-nav-section') || entry.target.getAttribute('data-theme-id') || entry.target.id;
            for (const pill of themePills) {
              const active = pill.getAttribute('data-target-theme') === tid;
              pill.classList.toggle('is-active', active);
            }
          }
        }
      },
      { rootMargin: '-18% 0px -68% 0px', threshold: 0 }
    );
    for (const s of observedEls) obs.observe(s);
  }

  // Pomoćni režim za vizuelnu verifikaciju pojedinačnih poglavlja (?snimak=tema-2&sirina=390)
  const params = new URLSearchParams(window.location.search);
  if (params.get('sirina') === '390') {
    document.documentElement.classList.add('mobile-preview-390');
  }
  const snimakId = params.get('snimak');
  if (snimakId) {
    const targetSec = document.getElementById(snimakId);
    const mainEl = document.getElementById('main');
    if (targetSec && mainEl) {
      const headerEl = document.querySelector('.site-header');
      const bandEl = document.querySelector('.course-band');
      if (headerEl) headerEl.style.display = 'none';
      if (bandEl) bandEl.style.display = 'none';
      for (const child of Array.from(mainEl.children)) {
        if (child !== targetSec && !child.classList.contains('sticky-atlas-nav')) {
          child.style.display = 'none';
        }
      }
      targetSec.style.paddingTop = '0.8rem';
      window.scrollTo(0, 0);
    }
  }
})();
