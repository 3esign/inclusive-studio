// The laboratory, in the browser. One lab is mounted at a time and torn down on the way out:
// no interval, no animation frame and no canvas survives a lab you have left.
// Every lab produces a number and then asks for a design decision. The number is not the point.

import { $, $$, esc, tr, tx, lang, read, save, announce, download, mount, REPO, link, arrow } from './core.js';
import {
  labs, labById, contrastRatio, contrastVerdict, targetVerdict, speak, stepsTo, bestRoute,
  auditNodes, NAV_MODES, scanCost, CHANNELS, PROFILES, coverage, analyzePlan, analyzeRamp,
  plainness, CELL_CM, CHAIR_CM, TURN_CM, DOOR_MIN_CM, CORRIDOR_ONE_WAY_CM
} from './lab-core.js';

const params = new URLSearchParams(location.search);
let openLab = params.get('lab') || '';
let teardown = null;

const results = () => read('lab-results', {}) || {};
function recordResult(id, measure) {
  const all = results();
  all[id] = { measure, at: new Date().toISOString().slice(0, 16).replace('T', ' ') };
  save('lab-results', all);
  renderScore();
}

/* ---------------- shared pieces ---------------- */
const framing = () => `<div class="notice lab-framing"><p><strong>${tr('What this is.', 'Šta je ovo.')}</strong> ${tr('A lab tests a tool, an interface or a geometry — never a person. Nobody is blindfolded here. After disability simulations people report more empathy but also more pity and discomfort, and they are not more willing to work with disabled people on an accessibility project (Nario-Redmond et al., 2017). What measurably helps is a structured exercise with the real tool plus a debrief; what actually changes a project is a disabled coauthor. The lab is the warm-up. The coauthor is the measure.', 'Ogled proverava alat, interfejs ili geometriju — nikad osobu. Ovde nikome ne stavljamo povez na oči. Posle simulacija invaliditeta ljudi prijavljuju više empatije, ali i više sažaljenja i nelagode, i nisu spremniji da sa osobama sa invaliditetom rade na projektu pristupačnosti (Nario-Redmond i dr., 2017). Izmereno pomaže strukturirana vežba sa stvarnim alatom i debrif; projekat stvarno menja koautor sa invaliditetom. Ogled je zagrevanje. Koautor je mera.')}</p></div>`;

const decisionBox = id => {
  const stored = read('lab-decision-' + id, '') || '';
  return `<section class="lab-decision" aria-labelledby="decision-${id}">
  <h3 id="decision-${id}">${tr('The sentence that stays', 'Rečenica koja ostaje')}</h3>
  <p class="help">${tr('A number without a decision changes nothing. Write what you will do differently in your project because of this measurement.', 'Broj bez odluke ništa ne menja. Napiši šta ćeš u svom projektu uraditi drugačije zbog ove mere.')}</p>
  <label for="decision-input-${id}">${tr('In my project I will…', 'U svom projektu ću…')}</label>
  <textarea id="decision-input-${id}" rows="3">${esc(stored)}</textarea>
  <div class="actions"><button type="button" id="save-decision">${tr('Keep in this browser', 'Zadrži u pregledaču')}</button><button type="button" id="export-lab">${tr('Download the record', 'Preuzmi zapis')}</button><a class="button secondary" id="to-board" href="${REPO}/issues/new?template=ideja.yml" target="_blank" rel="noopener">${tr('Take it to the pinboard', 'Iznesi na tablu')} ${arrow}</a></div>
  <p class="help" id="decision-status" role="status"></p></section>`;
};

function bindDecision(id, getMeasure) {
  const input = $('#decision-input-' + id);
  const status = $('#decision-status');
  $('#save-decision')?.addEventListener('click', () => {
    const ok = save('lab-decision-' + id, input.value.trim());
    status.textContent = ok
      ? tr('Kept in this browser only. Not a hand-in.', 'Zadržano samo u ovom pregledaču. Nije predaja.')
      : tr('This browser refused to store it. Download the record instead.', 'Pregledač je odbio čuvanje. Preuzmi zapis.');
  });
  $('#export-lab')?.addEventListener('click', () => {
    const lab = labById(id);
    const measure = getMeasure ? getMeasure() : '';
    download(`ogled-${id}.md`, [
      `# ${tx(lab.title)} — ${tr('lab record', 'zapis ogleda')}`,
      '', `${tr('Lab', 'Ogled')}: ${id}`,
      `${tr('Standard', 'Standard')}: ${lab.standard}`,
      `${tr('Measured', 'Izmereno')}: ${measure || '—'}`,
      '', `## ${tr('Decision', 'Odluka')}`, input.value.trim() || '—',
      '', `_${tr('A tool measurement, not a test with a person.', 'Mera alata, ne proba sa osobom.')}_`, ''
    ].join('\n'), 'text/markdown;charset=utf-8');
  });
}

const liveBox = (id, label) => `<div class="lab-readout" id="${id}" role="status" aria-live="polite" aria-label="${esc(label)}"></div>`;
const field = (id, label, attrs) => `<div class="lab-field"><label for="${id}">${label}</label><input id="${id}" ${attrs}></div>`;

/* ---------------- 1. Screen reader ---------------- */
const DOC_GOOD = [
  { role: 'landmark', name: { en: 'Main content', sr: 'Glavni sadržaj' } },
  { role: 'heading', level: 1, name: { en: 'Enrolment of the winter semester', sr: 'Upis zimskog semestra' } },
  { role: 'text', name: { en: 'Enrolment is done at the student office, ground floor.', sr: 'Upis se obavlja u studentskoj službi, u prizemlju.' } },
  { role: 'image', name: { en: 'Floor plan: the student office is the second door on the right of the entrance hall.', sr: 'Osnova: studentska služba su druga vrata desno od ulaznog hola.' } },
  { role: 'heading', level: 2, name: { en: 'Deadline', sr: 'Rok' } },
  { role: 'text', name: { en: 'Documents are submitted until 15 October, 14:00.', sr: 'Dokumenti se predaju do 15. oktobra, 14.00.' } },
  { role: 'heading', level: 2, name: { en: 'What you bring', sr: 'Šta donosiš' } },
  { role: 'list', count: 3 },
  { role: 'text', name: { en: 'Index, two photographs, proof of payment.', sr: 'Indeks, dve fotografije, dokaz o plaćanju.' } },
  { role: 'link', name: { en: 'Form 3 (PDF, 120 kB)', sr: 'Obrazac 3 (PDF, 120 kB)' } },
  { role: 'button', name: { en: 'Book an appointment', sr: 'Zakaži termin' } }
];

const DOC_BAD = [
  { role: 'text', name: { en: 'UPIS 2026', sr: 'UPIS 2026' } },
  { role: 'image', file: 'naslov-final-v3.png' },
  { role: 'text', name: { en: 'Enrolment is done at the student office, ground floor.', sr: 'Upis se obavlja u studentskoj službi, u prizemlju.' } },
  { role: 'image', file: 'plan-prizemlja.jpg' },
  { role: 'text', name: { en: 'Rok', sr: 'Rok' } },
  { role: 'image', file: 'datum-grafika.png' },
  { role: 'text', name: { en: 'Documents are submitted until 15 October, 14:00.', sr: 'Dokumenti se predaju do 15. oktobra, 14.00.' } },
  { role: 'text', name: { en: 'Index, two photographs, proof of payment.', sr: 'Indeks, dve fotografije, dokaz o plaćanju.' } },
  { role: 'link', name: { en: 'click here', sr: 'klikni ovde' } },
  { role: 'unknown', name: { en: 'Zakaži termin', sr: 'Zakaži termin' } }
];

const readerLab = {
  id: 'citac',
  target: { good: 5, bad: 6 },
  state: { version: 'good', cursor: -1, mode: 'element', steps: 0, log: [] },
  render() {
    const s = this.state;
    const nodes = s.version === 'good' ? DOC_GOOD : DOC_BAD;
    const audit = auditNodes(nodes);
    const target = this.target[s.version];
    const optimal = bestRoute(nodes, target);
    return `<div class="lab-grid">
    <div class="lab-main">
      <p class="lab-question"><strong>${tr('Find this:', 'Nađi ovo:')}</strong> ${tr('until when are the documents submitted?', 'do kada se predaju dokumenti?')}</p>
      <div class="reader-shell">
        <p class="meta-label">${tr('What the machine says', 'Šta mašina izgovara')}</p>
        <p class="reader-utterance" id="utterance" role="status" aria-live="assertive">${s.cursor < 0 ? tr('Press “next” to start.', 'Pritisni „sledeće“ da počneš.') : esc(speak(nodes[s.cursor], lang))}</p>
        <p class="help">${tr('Position', 'Pozicija')} ${s.cursor < 0 ? 0 : s.cursor + 1}/${nodes.length} · ${tr('steps used', 'iskorišćeno koraka')}: <strong>${s.steps}</strong></p>
      </div>
      <fieldset class="lab-modes"><legend>${tr('How do you move?', 'Kako se pomeraš?')}</legend>
      ${NAV_MODES.map(mode => `<button type="button" data-mode="${mode}" aria-pressed="${s.mode === mode}">${esc({ element: tr('Next element', 'Sledeći element'), heading: tr('Next heading', 'Sledeći naslov'), link: tr('Next link or button', 'Sledeća veza ili taster'), landmark: tr('Next region', 'Sledeća oblast') }[mode])}</button>`).join('')}
      </fieldset>
      <div class="actions"><button type="button" id="reader-next" class="button">${tr('Next', 'Sledeće')} →</button><button type="button" id="reader-reset">${tr('Start again', 'Počni ponovo')}</button></div>
      <details class="reader-eye"><summary>${tr('Look at the screen (you may, at any time)', 'Pogledaj ekran (slobodno, kad god)')}</summary><div class="reader-page">${nodes.map((node, index) => `<div class="reader-node ${index === s.cursor ? 'at' : ''}">${renderFakeNode(node)}</div>`).join('')}</div></details>
    </div>
    <div class="lab-side">
      <fieldset><legend>${tr('Which version?', 'Koja verzija?')}</legend>
      <div class="role-choice"><button type="button" data-version="good" aria-pressed="${s.version === 'good'}">${tr('With structure', 'Sa strukturom')}</button><button type="button" data-version="bad" aria-pressed="${s.version === 'bad'}">${tr('As it is usually made', 'Kako se obično pravi')}</button></div></fieldset>
      <p class="help">${tr('The cheapest route in this version:', 'Najjeftiniji put u ovoj verziji:')} <strong>${optimal.steps}</strong> ${tr('steps, using', 'koraka, režimom')} “${esc(optimal.mode)}”.</p>
      <h3>${tr('What the machine exposes', 'Šta mašina otkriva')}</h3>
      ${audit.length ? `<ul class="lab-problems">${audit.map(problem => `<li>${esc(problemText(problem))}</li>`).join('')}</ul>` : `<p class="success">${tr('Nothing missing in this version.', 'U ovoj verziji ništa ne manjka.')}</p>`}
      <p class="small muted">${tr('This is how the markup sounds, not a recording of a screen reader. NVDA, JAWS, VoiceOver and TalkBack each differ. A test with someone who uses one every day is the measure.', 'Ovako zvuči kod, nije snimak čitača ekrana. NVDA, JAWS, VoiceOver i TalkBack se razlikuju. Mera je proba sa nekim ko ga koristi svaki dan.')}</p>
    </div></div>`;
  },
  bind(rerender) {
    const s = this.state;
    const nodes = () => (s.version === 'good' ? DOC_GOOD : DOC_BAD);
    $$('[data-mode]').forEach(button => button.addEventListener('click', () => { s.mode = button.dataset.mode; rerender(); }));
    $$('[data-version]').forEach(button => button.addEventListener('click', () => {
      s.version = button.dataset.version; s.cursor = -1; s.steps = 0; rerender();
    }));
    $('#reader-reset').addEventListener('click', () => { s.cursor = -1; s.steps = 0; rerender(); });
    $('#reader-next').addEventListener('click', () => {
      const list = nodes();
      let next = s.cursor + 1;
      while (next < list.length && s.mode !== 'element' && !matches(list[next], s.mode)) next++;
      if (next >= list.length) { announce(tr('End of the document.', 'Kraj dokumenta.')); return; }
      s.cursor = next; s.steps++;
      if (s.cursor === this.target[s.version]) {
        recordResult('citac', `${s.version}: ${s.steps} ${tr('steps', 'koraka')}`);
        announce(tr('Found. Steps: ', 'Nađeno. Koraka: ') + s.steps);
      }
      rerender();
      $('#reader-next')?.focus();
    });
    return () => {};
  },
  measure() {
    const stored = results().citac;
    return stored ? stored.measure : '';
  }
};

const matches = (node, mode) => (mode === 'heading' ? node.role === 'heading' : mode === 'link' ? node.role === 'link' || node.role === 'button' : mode === 'landmark' ? node.role === 'landmark' : true);

function problemText(problem) {
  const map = {
    'image-no-alt': tr('An image with no description — the machine reads the file name.', 'Slika bez opisa — mašina čita ime fajla.'),
    'clickable-not-a-button': tr('Something clickable that is not a button — the keyboard cannot reach it.', 'Nešto klikabilno što nije taster — tastatura ne može do njega.'),
    'control-unnamed': tr('A control with no name.', 'Kontrola bez imena.'),
    'no-headings': tr('No headings: the only way through is element by element.', 'Nema naslova: jedini put je element po element.'),
    'no-landmarks': tr('No regions: there is no way to jump to the content.', 'Nema oblasti: nema skoka na sadržaj.')
  };
  return map[problem.code] + (problem.index >= 0 ? ` (#${problem.index + 1})` : '');
}

function renderFakeNode(node) {
  const name = esc(node.name ? tx(node.name) : '');
  switch (node.role) {
    case 'heading': return `<strong class="fake-h${node.level || 2}">${name}</strong>`;
    case 'image': return `<span class="fake-image">▨ ${node.name ? name : esc(node.file || '')}</span>`;
    case 'link': return `<span class="fake-link">${name}</span>`;
    case 'button': return `<span class="fake-button">${name}</span>`;
    case 'unknown': return `<span class="fake-button">${name}</span>`;
    case 'list': return `<span class="muted">• • •</span>`;
    case 'landmark': return `<span class="muted small">⌞ ${name} ⌟</span>`;
    default: return `<span>${name}</span>`;
  }
}

/* ---------------- 2. Keyboard ---------------- */
const keyboardLab = {
  id: 'tastatura',
  state: { trap: true, presses: 0, escaped: false, done: false },
  render() {
    const s = this.state;
    return `<div class="lab-grid"><div class="lab-main">
    <p class="lab-question">${tr('Fill the three fields and send — without touching the mouse or the screen. Tab, Shift+Tab, Space, Enter. Escape always gets you out.', 'Popuni tri polja i pošalji — bez miša i bez ekrana na dodir. Tab, Shift+Tab, Space, Enter. Escape te uvek izvodi.')}</p>
    <div class="role-choice"><button type="button" data-trap="1" aria-pressed="${s.trap}">${tr('The usual version', 'Uobičajena verzija')}</button><button type="button" data-trap="0" aria-pressed="${!s.trap}">${tr('The corrected version', 'Ispravljena verzija')}</button></div>
    <form class="lab-form ${s.trap ? 'trap' : 'clean'}" id="kbd-form" novalidate>
      <div class="lab-field"><label for="kbd-name">${tr('Name', 'Ime')}</label><input id="kbd-name" autocomplete="off"></div>
      <div class="lab-field"><label for="kbd-room">${tr('Room', 'Prostorija')}</label><select id="kbd-room"><option>A1</option><option>A2</option><option>B3</option></select></div>
      <div class="lab-field"><label for="kbd-note">${tr('What is in the way', 'Šta je na putu')}</label><input id="kbd-note" autocomplete="off"></div>
      <div class="actions"><button type="submit" class="button">${tr('Send', 'Pošalji')}</button><button type="button" id="kbd-cancel">${tr('Stop the experiment', 'Prekini ogled')}</button></div>
    </form>
    ${liveBox('kbd-readout', tr('Measurement', 'Mera'))}
    </div><div class="lab-side">
    <h3>${tr('The difference', 'Razlika')}</h3>
    <ul><li>${tr('The usual version hides the focus outline and keeps Tab inside the form.', 'Uobičajena verzija skriva obris fokusa i drži Tab unutar forme.')}</li><li>${tr('The corrected version shows focus and lets you leave.', 'Ispravljena verzija pokazuje fokus i pušta te da izađeš.')}</li></ul>
    <p class="small muted">${tr('A focus trap in a real page is not a game: a keyboard user cannot reach the rest of the site. We put Escape in deliberately — a lab must be leavable.', 'Zamka fokusa na stvarnoj stranici nije igra: korisnik tastature ne može do ostatka sajta. Escape smo namerno ostavili — iz ogleda se mora izaći.')}</p>
    </div></div>`;
  },
  bind(rerender) {
    const s = this.state;
    const form = $('#kbd-form');
    const readout = $('#kbd-readout');
    const paint = () => {
      readout.innerHTML = `<p>${tr('Key presses', 'Pritisaka tastera')}: <strong>${s.presses}</strong> · ${tr('left the form', 'izašao iz forme')}: <strong>${s.escaped ? tr('yes', 'da') : tr('no', 'ne')}</strong>${s.done ? ` · ${tr('sent', 'poslato')}` : ''}</p>`;
    };
    const onKey = event => {
      if (event.key === 'Tab' || event.key === 'Enter' || event.key === ' ') s.presses++;
      if (event.key === 'Escape') { s.escaped = true; document.querySelector('#reading-toggle')?.focus(); }
      if (s.trap && event.key === 'Tab') {
        const stops = $$('input,select,button', form);
        const index = stops.indexOf(document.activeElement);
        if (index === stops.length - 1 && !event.shiftKey) { event.preventDefault(); stops[0].focus(); }
        if (index === 0 && event.shiftKey) { event.preventDefault(); stops[stops.length - 1].focus(); }
      }
      paint();
    };
    form.addEventListener('keydown', onKey);
    form.addEventListener('focusout', event => {
      if (!form.contains(event.relatedTarget) && event.relatedTarget) { s.escaped = true; paint(); }
    });
    form.addEventListener('submit', event => {
      event.preventDefault(); s.done = true;
      recordResult('tastatura', `${s.presses} ${tr('presses', 'pritisaka')}, ${s.trap ? tr('trapped version', 'verzija sa zamkom') : tr('corrected version', 'ispravljena verzija')}`);
      paint(); announce(tr('Sent. Nothing left this browser.', 'Poslato. Ništa nije izašlo iz pregledača.'));
    });
    $('#kbd-cancel').addEventListener('click', () => { s.presses = 0; s.done = false; s.escaped = false; paint(); });
    $$('[data-trap]').forEach(button => button.addEventListener('click', () => { s.trap = button.dataset.trap === '1'; s.presses = 0; s.done = false; s.escaped = false; rerender(); }));
    paint();
    return () => form.removeEventListener('keydown', onKey);
  },
  measure() { const stored = results().tastatura; return stored ? stored.measure : ''; }
};

/* ---------------- 3. One switch ---------------- */
const MENU = [
  { id: 'wc', en: 'Toilet', sr: 'Toalet' }, { id: 'exit', en: 'Exit', sr: 'Izlaz' },
  { id: 'help', en: 'Call for help', sr: 'Pozovi pomoć' }, { id: 'lift', en: 'Lift', sr: 'Lift' },
  { id: 'office', en: 'Student office', sr: 'Studentska služba' }, { id: 'library', en: 'Library', sr: 'Biblioteka' },
  { id: 'cafe', en: 'Canteen', sr: 'Menza' }, { id: 'amphi', en: 'Amphitheatre', sr: 'Amfiteatar' }
];
const TASKS = ['help', 'exit', 'wc'];

const switchLab = {
  id: 'prekidac',
  state: { order: MENU.map(item => item.id), group: false, rate: 1200, cursor: 0, activations: 0, taskIndex: 0, running: false, log: [] },
  render() {
    const s = this.state;
    const linear = TASKS.reduce((sum, id) => sum + scanCost(s.order.length, s.order.indexOf(id)).total, 0);
    const grouped = TASKS.reduce((sum, id) => sum + scanCost(s.order.length, s.order.indexOf(id), { mode: 'group', groupSize: 4 }).total, 0);
    return `<div class="lab-grid"><div class="lab-main">
    <p class="lab-question">${tr('Activate, in order:', 'Aktiviraj, po redu:')} ${TASKS.map((id, index) => `<strong class="${index === s.taskIndex ? 'at' : ''}">${esc(tx(MENU.find(m => m.id === id)))}</strong>`).join(' → ')}</p>
    <p class="help">${tr('The scan moves on its own. Press Space, Enter or the big button when the highlight is on what you want. That is one switch.', 'Skeniranje se pomera samo. Pritisni Space, Enter ili veliki taster kada je osvetljeno ono što želiš. To je jedan prekidač.')}</p>
    <ul class="scan-list" id="scan-list">${s.order.map((id, index) => {
      const item = MENU.find(m => m.id === id);
      return `<li data-index="${index}" class="${index === s.cursor ? 'at' : ''}">${esc(tx(item))}</li>`;
    }).join('')}</ul>
    <div class="actions"><button type="button" id="scan-switch" class="button signal big-switch">${tr('The switch', 'Prekidač')}</button><button type="button" id="scan-start">${s.running ? tr('Stop', 'Zaustavi') : tr('Start the scan', 'Pokreni skeniranje')}</button><button type="button" id="scan-reset">${tr('Reset', 'Resetuj')}</button></div>
    ${liveBox('scan-readout', tr('Measurement', 'Mera'))}
    </div><div class="lab-side">
    <div class="lab-field"><label for="scan-rate">${tr('Scan interval', 'Interval skeniranja')}: <output id="scan-rate-out">${(s.rate / 1000).toFixed(1)} s</output></label><input id="scan-rate" type="range" min="600" max="3000" step="200" value="${s.rate}"></div>
    <h3>${tr('The price of the order', 'Cena reda')}</h3>
    <p>${tr('For these three tasks:', 'Za ova tri zadatka:')}<br>${tr('linear scan', 'linearno skeniranje')}: <strong>${linear}</strong><br>${tr('scan by groups of four', 'skeniranje po grupama od četiri')}: <strong>${grouped}</strong></p>
    <p class="help">${tr('Move the items that are needed most to the top and the number falls. Ordering a menu is a design decision with a price in presses.', 'Pomeri gore ono što se najčešće traži i broj pada. Red u meniju je projektantska odluka sa cenom u pritiscima.')}</p>
    <ul class="reorder">${s.order.map((id, index) => `<li>${esc(tx(MENU.find(m => m.id === id)))} <button type="button" data-up="${index}" ${index === 0 ? 'disabled' : ''} aria-label="${tr('Move up', 'Pomeri gore')}: ${esc(tx(MENU.find(m => m.id === id)))}">↑</button></li>`).join('')}</ul>
    </div></div>`;
  },
  bind(rerender) {
    const s = this.state;
    let timer = null;
    const list = $('#scan-list');
    const readout = $('#scan-readout');
    const paint = () => {
      $$('#scan-list li').forEach((item, index) => item.classList.toggle('at', index === s.cursor));
      readout.innerHTML = `<p>${tr('Activations', 'Aktivacija')}: <strong>${s.activations}</strong> · ${tr('done', 'rešeno')}: ${s.taskIndex}/${TASKS.length}</p>`;
    };
    const stop = () => { if (timer) { clearInterval(timer); timer = null; } s.running = false; };
    const start = () => {
      stop(); s.running = true;
      timer = setInterval(() => { s.cursor = (s.cursor + 1) % s.order.length; paint(); }, s.rate);
    };
    const press = () => {
      s.activations++;
      const chosen = s.order[s.cursor];
      if (chosen === TASKS[s.taskIndex]) {
        s.taskIndex++;
        announce(tr('Correct.', 'Tačno.') + ' ' + s.taskIndex + '/' + TASKS.length);
        if (s.taskIndex === TASKS.length) {
          stop();
          recordResult('prekidac', `${s.activations} ${tr('activations', 'aktivacija')}, ${(s.rate / 1000).toFixed(1)} s`);
        }
      } else announce(tr('That was: ', 'To je bilo: ') + tx(MENU.find(m => m.id === chosen)));
      paint();
    };
    $('#scan-switch').addEventListener('click', press);
    $('#scan-start').addEventListener('click', () => { s.running ? stop() : start(); rerender(); });
    $('#scan-reset').addEventListener('click', () => { stop(); s.activations = 0; s.taskIndex = 0; s.cursor = 0; rerender(); });
    const onKey = event => {
      if ((event.key === ' ' || event.key === 'Enter') && document.activeElement?.id !== 'scan-switch' && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName || '')) { event.preventDefault(); press(); }
    };
    document.addEventListener('keydown', onKey);
    const rate = $('#scan-rate');
    rate.addEventListener('input', () => { s.rate = Number(rate.value); $('#scan-rate-out').textContent = (s.rate / 1000).toFixed(1) + ' s'; if (s.running) start(); });
    $$('[data-up]').forEach(button => button.addEventListener('click', () => {
      const index = Number(button.dataset.up);
      [s.order[index - 1], s.order[index]] = [s.order[index], s.order[index - 1]];
      rerender();
    }));
    paint();
    if (s.running) start();
    return () => { stop(); document.removeEventListener('keydown', onKey); };
  },
  measure() { const stored = results().prekidac; return stored ? stored.measure : ''; }
};

/* ---------------- 4. Contrast, target, reflow ---------------- */
const contrastLab = {
  id: 'kontrast',
  state: { fg: '#58655f', bg: '#f6f7f2', w: 24, h: 24, gap: 0, zoom: 100 },
  render() {
    const s = this.state;
    return `<div class="lab-grid"><div class="lab-main">
    <h3>${tr('Colour', 'Boja')}</h3>
    <div class="two-col">
      ${field('fg', tr('Text or icon', 'Tekst ili ikona'), `type="text" value="${esc(s.fg)}" inputmode="text" spellcheck="false"`)}
      ${field('bg', tr('Background', 'Podloga'), `type="text" value="${esc(s.bg)}" inputmode="text" spellcheck="false"`)}
    </div>
    <div class="actions"><input type="color" id="fg-pick" value="${esc(s.fg)}" aria-label="${tr('Pick the text colour', 'Izaberi boju teksta')}"><input type="color" id="bg-pick" value="${esc(s.bg)}" aria-label="${tr('Pick the background colour', 'Izaberi boju podloge')}"></div>
    <div class="contrast-sample" id="contrast-sample"><p>${tr('Normal text, 16 px', 'Običan tekst, 16 px')}</p><p class="big">${tr('Large text, 24 px bold', 'Veliki tekst, 24 px bold')}</p></div>
    ${liveBox('contrast-readout', tr('Contrast ratio', 'Odnos kontrasta'))}
    <h3>${tr('Target', 'Cilj')}</h3>
    <div class="three-col">
      ${field('tw', tr('Width (px)', 'Širina (px)'), `type="number" min="4" max="200" value="${s.w}"`)}
      ${field('th', tr('Height (px)', 'Visina (px)'), `type="number" min="4" max="200" value="${s.h}"`)}
      ${field('tgap', tr('Spacing around (px)', 'Razmak oko (px)'), `type="number" min="0" max="60" value="${s.gap}"`)}
    </div>
    <div class="target-sample" id="target-sample"><button type="button">A</button><button type="button">B</button><button type="button">C</button></div>
    ${liveBox('target-readout', tr('Target size', 'Veličina cilja'))}
    <h3>${tr('Reflow', 'Prelom')}</h3>
    <div class="lab-field"><label for="zoom">${tr('Text size', 'Veličina teksta')}: <output id="zoom-out">${s.zoom} %</output></label><input id="zoom" type="range" min="100" max="400" step="50" value="${s.zoom}"></div>
    <div class="reflow-frame" id="reflow-frame"><div class="reflow-inner"><h4>${tr('Enrolment', 'Upis')}</h4><p>${tr('Documents are submitted until 15 October at 14:00, student office, ground floor.', 'Dokumenti se predaju do 15. oktobra u 14.00, studentska služba, prizemlje.')}</p><table><tr><th>${tr('Programme', 'Program')}</th><th>${tr('Semester', 'Semestar')}</th><th>ESPB</th></tr><tr><td>22.OA0068</td><td>5</td><td>5</td></tr><tr><td>OAIPUD</td><td>6</td><td>4</td></tr></table></div></div>
    ${liveBox('reflow-readout', tr('Horizontal scroll', 'Horizontalni skrol'))}
    </div><div class="lab-side">
    <h3>${tr('The thresholds', 'Granice')}</h3>
    <ul><li>1.4.3 — ${tr('text 4,5:1; large text (24 px, or 19 px bold) 3:1', 'tekst 4,5:1; veliki tekst (24 px, ili 19 px bold) 3:1')}</li><li>1.4.11 — ${tr('icons, borders, states 3:1', 'ikone, obrisi, stanja 3:1')}</li><li>2.5.8 — ${tr('target 24 × 24 px, or smaller with 24 px of spacing', 'cilj 24 × 24 px, ili manji sa 24 px razmaka')}</li><li>2.5.5 — ${tr('44 × 44 px is the enhanced level', '44 × 44 px je pooštreni nivo')}</li><li>1.4.10 — ${tr('no horizontal scrolling at 320 px width or 400 % zoom', 'bez horizontalnog skrola na 320 px širine ili 400 % uvećanja')}</li></ul>
    <p class="small muted">${tr('A ratio is arithmetic, not a verdict on legibility: font weight, size, screen and daylight all still matter. The number is the floor, not the goal.', 'Odnos je aritmetika, ne presuda o čitljivosti: debljina pisma, veličina, ekran i dnevno svetlo i dalje odlučuju. Broj je pod, ne cilj.')}</p>
    </div></div>`;
  },
  bind() {
    const s = this.state;
    const paint = () => {
      const ratio = contrastRatio(s.fg, s.bg);
      const normal = contrastVerdict(ratio), large = contrastVerdict(ratio, { large: true }), nonText = contrastVerdict(ratio, { nonText: true });
      const sample = $('#contrast-sample');
      if (ratio !== null) { sample.style.background = s.bg; sample.style.color = s.fg; }
      $('#contrast-readout').innerHTML = ratio === null
        ? `<p class="error">${tr('Write a colour as #rrggbb.', 'Upiši boju kao #rrggbb.')}</p>`
        : `<p><strong>${ratio.toFixed(2)}:1</strong> — ${tr('normal text', 'običan tekst')}: ${verdictWord(normal)} · ${tr('large text', 'veliki tekst')}: ${verdictWord(large)} · ${tr('icons and borders', 'ikone i obrisi')}: ${verdictWord(nonText)}</p>`;
      if (ratio !== null) recordResult('kontrast', `${ratio.toFixed(2)}:1`);

      const target = targetVerdict(s.w, s.h, s.gap);
      $('#target-sample').style.setProperty('--tw', s.w + 'px');
      $('#target-sample').style.setProperty('--th', s.h + 'px');
      $('#target-sample').style.setProperty('--tgap', s.gap + 'px');
      $('#target-readout').innerHTML = `<p>${tr('Smallest side', 'Najmanja strana')} ${target.smallest} px${s.gap ? ` + ${s.gap} px ${tr('spacing', 'razmaka')} = ${target.effective} px` : ''} — 2.5.8: <strong>${target.minimum ? tr('passes', 'prolazi') : tr('fails', 'pada')}</strong>${target.spacingUsed ? ` (${tr('through the spacing exception', 'kroz izuzetak razmaka')})` : ''} · 2.5.5: <strong>${target.enhanced ? tr('passes', 'prolazi') : tr('fails', 'pada')}</strong></p>`;

      const frame = $('#reflow-frame');
      frame.style.fontSize = (16 * s.zoom / 100) + 'px';
      const inner = $('.reflow-inner', frame);
      const overflow = Math.max(0, inner.scrollWidth - frame.clientWidth);
      $('#reflow-readout').innerHTML = overflow > 1
        ? `<p class="error">${tr('Horizontal scroll of', 'Horizontalni skrol od')} ${overflow} px ${tr('at', 'na')} ${s.zoom} % — 1.4.10 ${tr('fails', 'pada')}.</p>`
        : `<p class="success">${tr('No horizontal scroll at', 'Bez horizontalnog skrola na')} ${s.zoom} %.</p>`;
    };
    const bindValue = (id, key, cast = Number) => {
      const input = $('#' + id);
      input?.addEventListener('input', () => { s[key] = cast(input.value); paint(); });
      return input;
    };
    bindValue('fg', 'fg', String); bindValue('bg', 'bg', String);
    bindValue('tw', 'w'); bindValue('th', 'h'); bindValue('tgap', 'gap');
    $('#fg-pick')?.addEventListener('input', event => { s.fg = event.target.value; $('#fg').value = s.fg; paint(); });
    $('#bg-pick')?.addEventListener('input', event => { s.bg = event.target.value; $('#bg').value = s.bg; paint(); });
    const zoom = $('#zoom');
    zoom.addEventListener('input', () => { s.zoom = Number(zoom.value); $('#zoom-out').textContent = s.zoom + ' %'; paint(); });
    paint();
    return () => {};
  },
  measure() { const stored = results().kontrast; return stored ? stored.measure : ''; }
};

const verdictWord = verdict => verdict.pass ? `<span class="success">${verdict.level}</span>` : `<span class="error">${tr('fails', 'pada')} (${tr('needs', 'traži')} ${verdict.needed}:1)</span>`;

/* ---------------- 5. Channels ---------------- */
const channelLab = {
  id: 'kanali',
  state: { selected: ['siren'] },
  render() {
    const s = this.state;
    return `<div class="lab-grid"><div class="lab-main">
    <p class="lab-question">${tr('The fire alarm goes off in your building. Choose how the message travels.', 'U tvojoj zgradi se aktivira alarm. Izaberi kojim putem poruka ide.')}</p>
    <div class="checkbox-list">${CHANNELS.map(channel => `<label class="check-line"><input type="checkbox" value="${channel.id}" ${s.selected.includes(channel.id) ? 'checked' : ''}> ${esc(tr(channel.en, channel.sr))}</label>`).join('')}</div>
    ${liveBox('channel-readout', tr('Coverage', 'Pokrivenost'))}
    <div class="table-wrap"><table id="channel-table"><caption class="sr-only">${tr('Who receives the alarm, through how many channels', 'Ko dobija alarm i kroz koliko kanala')}</caption><thead><tr><th scope="col">${tr('Situation', 'Situacija')}</th><th scope="col">${tr('Channels', 'Kanala')}</th><th scope="col">${tr('Verdict', 'Ocena')}</th></tr></thead><tbody></tbody></table></div>
    </div><div class="lab-side">
    <h3>${tr('The rule', 'Pravilo')}</h3>
    <p>${tr('Principle 04 asks for redundancy: critical information reaches each situation through at least two independent channels. One channel is a single point of failure, and in an evacuation that is not a metaphor.', 'Princip 04 traži redundansu: ključna informacija stiže do svake situacije kroz najmanje dva nezavisna kanala. Jedan kanal je jedna tačka otkaza, a u evakuaciji to nije metafora.')}</p>
    <p class="small muted">${tr('The channel-to-situation mapping here is a teaching model, not a certified matrix. A real building is checked with the people in it and against the fire regulations.', 'Veza kanala i situacija je nastavni model, ne sertifikovana matrica. Stvarna zgrada se proverava sa ljudima u njoj i po protivpožarnim propisima.')}</p>
    </div></div>`;
  },
  bind() {
    const s = this.state;
    const paint = () => {
      const result = coverage(s.selected);
      const body = $('#channel-table tbody');
      body.innerHTML = result.rows.map(row => {
        const profile = PROFILES.find(p => p.id === row.profile);
        const verdict = row.redundant ? `<span class="success">${tr('two or more', 'dva ili više')}</span>` : row.covered ? `<span class="warn">${tr('only one', 'samo jedan')}</span>` : `<span class="error">${tr('nothing', 'ništa')}</span>`;
        return `<tr><th scope="row">${esc(tr(profile.en, profile.sr))}</th><td>${row.count}</td><td>${verdict}</td></tr>`;
      }).join('');
      $('#channel-readout').innerHTML = `<p>${result.pass
        ? `<span class="success">${tr('Every situation is covered twice.', 'Svaka situacija je pokrivena dva puta.')}</span>`
        : `${tr('Without a channel', 'Bez kanala')}: <strong>${result.uncovered.length}</strong> · ${tr('with only one', 'sa samo jednim')}: <strong>${result.single.length}</strong>`} · ${tr('channels used', 'kanala u upotrebi')}: ${result.channelsUsed}</p>`;
      recordResult('kanali', `${result.uncovered.length} ${tr('without', 'bez')}, ${result.single.length} ${tr('single', 'jedan')}`);
    };
    $$('.checkbox-list input').forEach(input => input.addEventListener('change', () => {
      s.selected = $$('.checkbox-list input:checked').map(box => box.value);
      paint();
    }));
    paint();
    return () => {};
  },
  measure() { const stored = results().kanali; return stored ? stored.measure : ''; }
};

/* ---------------- 6. The plan ---------------- */
const KNOBS = [
  { id: 'corridor', min: 70, max: 220, step: 10, value: 70, en: 'Corridor width', sr: 'Širina hodnika' },
  { id: 'door', min: 70, max: 110, step: 10, value: 70, en: 'Clear door width of the toilet', sr: 'Svetla širina vrata toaleta' },
  { id: 'doorX', min: 100, max: 700, step: 10, value: 240, en: 'Door position along the wall', sr: 'Položaj vrata duž zida' },
  { id: 'wc', min: 120, max: 320, step: 10, value: 130, en: 'Toilet width', sr: 'Širina toaleta' }
];

function buildPlan(values) {
  const W = 800, H = 500, T = 10;
  const corridorBottom = T + values.corridor;
  const wcLeft = W - T - values.wc;
  const walls = [
    [0, 0, W, T], [0, H - T, W, T], [0, 0, T, H], [W - T, 0, T, H],      // outer walls
    [T, corridorBottom, Math.max(0, values.doorX - T), T],                 // dividing wall, left of the door
    [values.doorX + values.door, corridorBottom, Math.max(0, W - T - values.doorX - values.door), T], // right of the door
    [wcLeft, corridorBottom + T, T, H - T - corridorBottom - T]            // the toilet's left wall
  ];
  return {
    w: W, h: H, walls,
    start: [60, T + values.corridor / 2],
    goal: [W - T - values.wc / 2, (corridorBottom + T + H - T) / 2],
    labels: { corridorBottom, wcLeft }
  };
}

const planLab = {
  id: 'prolaz',
  state: { values: Object.fromEntries(KNOBS.map(knob => [knob.id, knob.value])), moves: 0 },
  render() {
    const s = this.state;
    return `<div class="lab-grid"><div class="lab-main">
    <p class="lab-question">${tr('Get a wheelchair from the entrance to the middle of the toilet, and let it turn when it arrives. Grid: 10 cm. Chair: 80 cm wide.', 'Dovedi kolica od ulaza do sredine toaleta, i neka se tu okrenu. Mreža: 10 cm. Kolica: 80 cm širine.')}</p>
    <div class="plan-wrap"><canvas id="plan-canvas" width="800" height="500" role="img" aria-labelledby="plan-alt"></canvas></div>
    <p id="plan-alt" class="sr-only"></p>
    ${liveBox('plan-readout', tr('Measurement of the plan', 'Mera osnove'))}
    <div class="table-wrap"><table><caption class="sr-only">${tr('Measured values and the required ones', 'Izmerene vrednosti i zahtevane')}</caption><thead><tr><th scope="col">${tr('What', 'Šta')}</th><th scope="col">${tr('Measured', 'Izmereno')}</th><th scope="col">${tr('Required', 'Zahtevano')}</th></tr></thead><tbody id="plan-table"></tbody></table></div>
    </div><div class="lab-side">
    <h3>${tr('Moves', 'Potezi')}: <span id="plan-moves">${s.moves}</span></h3>
    ${KNOBS.map(knob => `<div class="lab-field"><label for="knob-${knob.id}">${esc(tr(knob.en, knob.sr))}: <output id="out-${knob.id}">${s.values[knob.id]} cm</output></label><input id="knob-${knob.id}" type="range" min="${knob.min}" max="${knob.max}" step="${knob.step}" value="${s.values[knob.id]}"></div>`).join('')}
    <div class="actions"><button type="button" id="plan-reset">${tr('Back to the start', 'Vrati na početak')}</button></div>
    <p class="small muted">${tr('The sheet does not grow: a wider corridor is a shallower toilet. That trade is the exercise. Art. 14, 17, 18 and 19 of the Pravilnik; values rounded to the 10 cm grid.', 'List se ne povećava: širi hodnik je plići toalet. Ta trampa i jeste vežba. Čl. 14, 17, 18 i 19 Pravilnika; vrednosti zaokružene na mrežu od 10 cm.')}</p>
    </div></div>`;
  },
  bind() {
    const s = this.state;
    const canvas = $('#plan-canvas');
    const context = canvas.getContext('2d', { alpha: false });
    const ratio = Math.min(2, window.devicePixelRatio || 1);   // capped on purpose: memory is not free
    let frame = 0;

    const paint = () => {
      const plan = buildPlan(s.values);
      const analysis = analyzePlan(plan);
      const box = canvas.getBoundingClientRect();
      const width = Math.max(240, Math.round(box.width));
      const height = Math.round(width * plan.h / plan.w);
      if (canvas.width !== width * ratio || canvas.height !== height * ratio) {
        canvas.width = width * ratio; canvas.height = height * ratio; canvas.style.height = height + 'px';
      }
      const scale = (width * ratio) / plan.w;
      context.setTransform(scale, 0, 0, scale, 0, 0);
      context.fillStyle = '#ffffff'; context.fillRect(0, 0, plan.w, plan.h);
      // the route first, so the walls read on top of it
      if (analysis.path.length) {
        context.strokeStyle = '#d9f88d'; context.lineWidth = CHAIR_CM; context.lineJoin = 'round'; context.lineCap = 'round';
        context.beginPath();
        analysis.path.forEach((cell, index) => {
          const x = (cell % analysis.cols) * CELL_CM + CELL_CM / 2, y = Math.floor(cell / analysis.cols) * CELL_CM + CELL_CM / 2;
          index ? context.lineTo(x, y) : context.moveTo(x, y);
        });
        context.stroke();
      }
      context.fillStyle = '#192e27';
      for (const [x, y, w, h] of plan.walls) context.fillRect(x, y, w, h);
      // the turning circle where you arrive
      context.strokeStyle = analysis.turnCm >= TURN_CM ? '#245126' : '#9a352a';
      context.lineWidth = 3; context.setLineDash([12, 10]);
      context.beginPath(); context.arc(plan.goal[0], plan.goal[1], TURN_CM / 2, 0, Math.PI * 2); context.stroke();
      context.setLineDash([]);
      // entrance and goal
      context.fillStyle = '#326bdf';
      context.beginPath(); context.arc(plan.start[0], plan.start[1], 12, 0, Math.PI * 2); context.fill();

      const rows = [
        [tr('Narrowest point on the route', 'Najuža tačka na putanji'), analysis.narrowestCm === null ? tr('no route', 'nema putanje') : analysis.narrowestCm + ' cm', CORRIDOR_ONE_WAY_CM + ' cm'],
        [tr('Clear door width', 'Svetla širina vrata'), s.values.door + ' cm', DOOR_MIN_CM + ' cm (90 ' + tr('where it turns', 'gde se okreće') + ')'],
        [tr('Turning circle where you arrive', 'Obrtni krug na dolasku'), analysis.turnCm + ' cm', TURN_CM + ' cm']
      ];
      $('#plan-table').innerHTML = rows.map(([a, b, c]) => `<tr><th scope="row">${esc(a)}</th><td>${esc(b)}</td><td>${esc(c)}</td></tr>`).join('');
      $('#plan-readout').innerHTML = analysis.pass
        ? `<p class="success">${tr('It passes: the route exists, the narrowest point holds, the circle fits.', 'Prolazi: putanja postoji, najuža tačka drži, krug staje.')} ${tr('Moves used', 'Potrošeno poteza')}: ${s.moves}.</p>`
        : `<p class="error">${analysis.problems.map(problem => planProblem(problem)).join(' · ')}</p>`;
      $('#plan-alt').textContent = `${tr('Plan, 8 × 5 m.', 'Osnova, 8 × 5 m.')} ${rows.map(([a, b, c]) => `${a}: ${b} (${tr('required', 'zahtevano')} ${c})`).join('. ')}. ${analysis.pass ? tr('Passes.', 'Prolazi.') : tr('Does not pass.', 'Ne prolazi.')}`;
      if (analysis.pass) recordResult('prolaz', `${tr('passes in', 'prolazi u')} ${s.moves} ${tr('moves', 'poteza')}, ${analysis.narrowestCm} cm / ${analysis.turnCm} cm`);
    };

    const schedule = () => { if (frame) cancelAnimationFrame(frame); frame = requestAnimationFrame(() => { frame = 0; paint(); }); };

    KNOBS.forEach(knob => {
      const input = $('#knob-' + knob.id);
      input.addEventListener('input', () => {
        const next = Number(input.value);
        s.moves += Math.abs(next - s.values[knob.id]) / knob.step;
        s.values[knob.id] = next;
        $('#out-' + knob.id).textContent = next + ' cm';
        $('#plan-moves').textContent = String(Math.round(s.moves));
        schedule();
      });
    });
    $('#plan-reset').addEventListener('click', () => {
      KNOBS.forEach(knob => { s.values[knob.id] = knob.value; $('#knob-' + knob.id).value = String(knob.value); $('#out-' + knob.id).textContent = knob.value + ' cm'; });
      s.moves = 0; $('#plan-moves').textContent = '0'; schedule();
    });
    const onResize = () => schedule();
    window.addEventListener('resize', onResize, { passive: true });
    paint();
    return () => {
      window.removeEventListener('resize', onResize);
      if (frame) cancelAnimationFrame(frame);
      canvas.width = canvas.height = 0;   // release the backing store
    };
  },
  measure() { const stored = results().prolaz; return stored ? stored.measure : ''; }
};

function planProblem(problem) {
  const map = {
    'no-route': tr('No route for an 80 cm chair.', 'Nema putanje za kolica od 80 cm.'),
    'too-narrow': tr('The narrowest point is', 'Najuža tačka je') + ` ${problem.cm} cm (${tr('needs', 'traži')} ${problem.needed}).`,
    'no-turning-circle': tr('No 150 cm circle where you arrive:', 'Nema kruga od 150 cm na dolasku:') + ` ${problem.cm} cm.`,
    'goal-blocked': tr('The destination itself is blocked.', 'Samo odredište je zatvoreno.'),
    'start-blocked': tr('The entrance is blocked.', 'Ulaz je zatvoren.')
  };
  return map[problem.code] || problem.code;
}

/* ---------------- 7. Height ---------------- */
const heightLab = {
  id: 'visina',
  state: { rise: 2250, slope: 8.3, available: 15000 },
  render() {
    const s = this.state;
    return `<div class="lab-grid"><div class="lab-main">
    <p class="lab-question">${tr('Our site falls 22,5 m over a straight line of 151 m, on plots of about 129 × 131 m. Choose a slope and read what the ramp becomes.', 'Naša lokacija pada 22,5 m na vazdušnoj liniji od 151 m, na parcelama od oko 129 × 131 m. Izaberi nagib i pročitaj šta rampa postaje.')}</p>
    <div class="lab-field"><label for="rise">${tr('Height to overcome (cm)', 'Visina koja se savladava (cm)')}</label><input id="rise" type="number" min="10" max="3000" step="10" value="${s.rise}"></div>
    <div class="lab-field"><label for="slope">${tr('Slope', 'Nagib')}: <output id="slope-out">${s.slope} %</output></label><input id="slope" type="range" min="2" max="12" step="0.1" value="${s.slope}"></div>
    <div class="lab-field"><label for="available">${tr('Length you can actually develop (cm)', 'Dužina koju stvarno možeš da razviješ (cm)')}</label><input id="available" type="number" min="100" max="100000" step="100" value="${s.available}"></div>
    ${liveBox('ramp-readout', tr('The ramp', 'Rampa'))}
    <div class="ramp-bars" id="ramp-bars" aria-hidden="true"></div>
    </div><div class="lab-side">
    <h3>${tr('The rule', 'Pravilo')}</h3>
    <p>${tr('Art. 7: slope up to 5 % (1:20); exceptionally 8,3 % (1:12) for short runs. A ramp longer than 6 m — up to 9 m at a gentler slope — is broken by a landing of at least 150 cm. Handrails at 70 and 90 cm, extended 30 cm past both ends.', 'Čl. 7: nagib do 5 % (1:20); izuzetno 8,3 % (1:12) na kratkim rastojanjima. Rampa duža od 6 m — do 9 m kod manjeg nagiba — razdvaja se odmorištem od najmanje 150 cm. Rukohvati na 70 i 90 cm, produženi 30 cm preko oba kraja.')}</p>
    <p class="small muted">${tr('When the ramp does not fit, the answer is not a steeper ramp. It is a different way to overcome the height: terracing with the terrain, a lift everybody uses, a route that follows the contour. The measurement tells you when to stop drawing ramps.', 'Kada rampa ne staje, odgovor nije strmija rampa. Odgovor je drugi način da se visina savlada: terasiranje po terenu, lift koji koriste svi, put po izohipsi. Mera ti kaže kada da prestaneš da crtaš rampe.')}</p>
    </div></div>`;
  },
  bind() {
    const s = this.state;
    const paint = () => {
      const result = analyzeRamp({ riseCm: s.rise, slopePercent: s.slope, availableLengthCm: s.available });
      if (!result) return;
      const metres = cm => (cm / 100).toLocaleString(lang === 'sr' ? 'sr-RS' : 'en-GB', { maximumFractionDigits: 1 });
      $('#ramp-readout').innerHTML = `<p>${tr('Ramp run', 'Dužina rampe')}: <strong>${metres(result.runCm)} m</strong> · ${tr('landings', 'odmorišta')}: <strong>${result.landings}</strong> (${metres(result.landingTotalCm)} m) · ${tr('total', 'ukupno')}: <strong>${metres(result.totalCm)} m</strong></p>
      <p>${result.overLimit ? `<span class="error">${tr('Above 8,3 % this is not a ramp by the Pravilnik.', 'Iznad 8,3 % ovo po Pravilniku nije rampa.')}</span>` : result.usesException ? `<span class="warn">${tr('Uses the exception: 8,3 % is allowed only on short runs, with landings every', 'Koristi izuzetak: 8,3 % je dozvoljeno samo na kratkim rastojanjima, uz odmorišta svakih')} ${metres(result.maxRunCm)} m.</span>` : `<span class="success">${tr('Within 5 %.', 'U granicama 5 %.')}</span>`}</p>
      <p>${result.fits ? `<span class="success">${tr('It fits in', 'Staje u')} ${metres(s.available)} m.</span>` : `<span class="error">${tr('Does not fit: short by', 'Ne staje: manjka')} ${metres(result.shortfallCm)} m.</span>`}</p>`;
      const bars = [
        [tr('Ramp with landings', 'Rampa sa odmorištima'), result.totalCm],
        [tr('Length available', 'Raspoloživa dužina'), Number(s.available)],
        [tr('Straight line across the site', 'Vazdušna linija lokacije'), 15100]
      ];
      const max = Math.max(...bars.map(bar => bar[1]));
      $('#ramp-bars').innerHTML = bars.map(([label, value]) => `<div class="ramp-bar"><span>${esc(label)}</span><div><i style="width:${Math.round(value / max * 100)}%"></i></div><span>${metres(value)} m</span></div>`).join('');
      recordResult('visina', `${s.slope} % → ${metres(result.totalCm)} m${result.fits ? '' : ', ' + tr('does not fit', 'ne staje')}`);
    };
    ['rise', 'available'].forEach(id => $('#' + id).addEventListener('input', () => { s[id] = Number($('#' + id).value); paint(); }));
    $('#slope').addEventListener('input', () => { s.slope = Number($('#slope').value); $('#slope-out').textContent = s.slope + ' %'; paint(); });
    paint();
    return () => {};
  },
  measure() { const stored = results().visina; return stored ? stored.measure : ''; }
};

/* ---------------- 8. Time and language ---------------- */
const JARGON = {
  en: 'Pursuant to the provisions of the decision on the regulation of the procedure for the realisation of enrolment obligations, it is hereby notified that candidates are obliged to effectuate the submission of the complete documentation within the prescribed period, whereby incomplete submissions shall not be taken into consideration in the further course of the procedure.',
  sr: 'U skladu sa odredbama odluke o uređenju postupka realizacije obaveza upisa, obaveštavaju se kandidati da su u obavezi da izvrše dostavljanje kompletne dokumentacije u propisanom roku, pri čemu se nekompletne prijave u daljem toku postupka neće uzimati u razmatranje.'
};
const PLAIN_ANSWER = { en: 'Bring all the documents by the deadline, or your application is not considered.', sr: 'Donesi sve dokumente do roka, inače prijava ne ulazi u razmatranje.' };

const timeLab = {
  id: 'vreme',
  state: { seconds: 20, left: 20, running: false, countdown: true, rewrite: '', finished: null },
  render() {
    const s = this.state;
    return `<div class="lab-grid"><div class="lab-main">
    <p class="lab-question">${tr('Read the notice and write, in one sentence, what it asks of you.', 'Pročitaj obaveštenje i napiši, u jednoj rečenici, šta se od tebe traži.')}</p>
    <div class="jargon">${esc(JARGON[lang] || JARGON.en)}</div>
    <div class="actions"><button type="button" id="time-start" class="button">${s.running ? tr('Stop', 'Zaustavi') : tr('Start the countdown', 'Pokreni odbrojavanje')}</button><label class="check-line"><input type="checkbox" id="time-off" ${s.countdown ? '' : 'checked'}> ${tr('Turn the countdown off', 'Isključi odbrojavanje')}</label></div>
    <p class="countdown" id="countdown" role="timer" aria-live="off">${s.left} s</p>
    <div class="lab-field"><label for="rewrite">${tr('Your sentence', 'Tvoja rečenica')}</label><textarea id="rewrite" rows="3">${esc(s.rewrite)}</textarea></div>
    ${liveBox('time-readout', tr('Measurement', 'Mera'))}
    <details><summary>${tr('One possible plain version', 'Jedna moguća jasna verzija')}</summary><div><p>${esc(PLAIN_ANSWER[lang] || PLAIN_ANSWER.en)}</p></div></details>
    </div><div class="lab-side">
    <h3>${tr('What is measured', 'Šta se meri')}</h3>
    <p>${tr('Words, sentences, average sentence length and the share of words longer than nine letters. That is a length measure, not a comprehension measure — comprehension is measured with readers.', 'Reči, rečenice, prosečna dužina rečenice i udeo reči dužih od devet slova. To je mera dužine, ne mera razumljivosti — razumljivost se meri sa čitaocima.')}</p>
    <p class="help">${tr('2.2.1 Timing Adjustable: a time limit must be switchable, extendable or absent. The switch above is the whole lesson. 3.1.5 asks for plain language where the content allows it.', '2.2.1 Prilagodljivo vreme: vremensko ograničenje mora da se isključi, produži ili ne postoji. Prekidač iznad je cela lekcija. 3.1.5 traži jasan jezik gde sadržaj to dopušta.')}</p>
    </div></div>`;
  },
  bind() {
    const s = this.state;
    let timer = null;
    const paint = () => {
      const original = plainness(JARGON[lang] || JARGON.en);
      const mine = plainness(s.rewrite);
      $('#time-readout').innerHTML = `<p>${tr('The notice', 'Obaveštenje')}: ${original.words} ${tr('words', 'reči')}, ${tr('average sentence', 'prosečna rečenica')} ${original.avgSentence}, ${tr('long words', 'dugih reči')} ${Math.round(original.longWordShare * 100)} % → <strong>${verdictName(original.verdict)}</strong></p>
      <p>${tr('Your sentence', 'Tvoja rečenica')}: ${mine.words} ${tr('words', 'reči')}, ${tr('average sentence', 'prosečna rečenica')} ${mine.avgSentence}, ${tr('long words', 'dugih reči')} ${Math.round(mine.longWordShare * 100)} % → <strong>${verdictName(mine.verdict)}</strong>${s.finished === false ? ` · <span class="error">${tr('the counter ran out', 'brojač je istekao')}</span>` : s.finished ? ` · <span class="success">${tr('in time', 'na vreme')}</span>` : ''}</p>
      <p class="small muted">${tr('A length measure, not a comprehension measure.', 'Mera dužine, ne mera razumljivosti.')}</p>`;
      if (mine.words > 2) recordResult('vreme', `${mine.words} ${tr('words', 'reči')}, ${verdictName(mine.verdict)}${s.finished === false ? ', ' + tr('out of time', 'preko vremena') : ''}`);
    };
    const stop = () => { if (timer) { clearInterval(timer); timer = null; } s.running = false; $('#time-start').textContent = tr('Start the countdown', 'Pokreni odbrojavanje'); };
    const start = () => {
      if (!s.countdown) return;
      stop(); s.running = true; s.left = s.seconds; s.finished = null;
      $('#time-start').textContent = tr('Stop', 'Zaustavi');
      $('#countdown').textContent = s.left + ' s';
      timer = setInterval(() => {
        s.left--;
        $('#countdown').textContent = s.left + ' s';
        if (s.left <= 0) { stop(); s.finished = $('#rewrite').value.trim().length > 10; announce(s.finished ? tr('Time is up. You finished.', 'Vreme je prošlo. Stigao si.') : tr('Time is up. Unfinished — and that is the finding.', 'Vreme je prošlo. Nedovršeno — i to je nalaz.')); paint(); }
      }, 1000);
    };
    $('#time-start').addEventListener('click', () => { s.running ? stop() : start(); });
    $('#time-off').addEventListener('change', event => {
      s.countdown = !event.target.checked;
      if (!s.countdown) { stop(); $('#countdown').textContent = tr('off', 'isključeno'); }
      else $('#countdown').textContent = s.seconds + ' s';
    });
    const rewrite = $('#rewrite');
    rewrite.addEventListener('input', () => { s.rewrite = rewrite.value; paint(); });
    paint();
    return () => stop();
  },
  measure() { const stored = results().vreme; return stored ? stored.measure : ''; }
};

const verdictName = verdict => ({ plain: tr('plain', 'jasno'), dense: tr('dense', 'gusto'), heavy: tr('heavy', 'teško'), empty: tr('empty', 'prazno') }[verdict] || verdict);

/* ---------------- the page ---------------- */
const IMPLEMENTED = { citac: readerLab, tastatura: keyboardLab, prekidac: switchLab, kontrast: contrastLab, kanali: channelLab, prolaz: planLab, visina: heightLab, vreme: timeLab };

function renderScore() {
  const box = $('#lab-score');
  if (!box) return;
  const all = results();
  const done = labs.filter(lab => all[lab.id]);
  box.innerHTML = `<p><strong>${done.length}/${labs.length}</strong> ${tr('labs carry a measurement in this browser.', 'ogleda nosi meru u ovom pregledaču.')}</p>${done.length ? `<ul class="score-list">${done.map(lab => `<li><a href="laboratorija.html?lab=${lab.id}">${esc(tx(lab.title))}</a> <span>${esc(all[lab.id].measure)}</span></li>`).join('')}</ul><div class="actions"><button type="button" id="export-all">${tr('Download all records', 'Preuzmi sve zapise')}</button><button type="button" id="clear-all">${tr('Clear the measurements', 'Obriši mere')}</button></div>` : ''}`;
  $('#export-all')?.addEventListener('click', () => {
    const lines = [`# ${tr('Laboratory records', 'Zapisi laboratorije')}`, ''];
    for (const lab of labs) {
      const result = all[lab.id]; if (!result) continue;
      lines.push(`## ${tx(lab.title)}`, `${tr('Measured', 'Izmereno')}: ${result.measure} (${result.at})`, `${tr('Standard', 'Standard')}: ${lab.standard}`, `${tr('Decision', 'Odluka')}: ${read('lab-decision-' + lab.id, '') || '—'}`, '');
    }
    lines.push(`_${tr('Tool measurements. A test with a person is the measure, and it has not happened here.', 'Mere alata. Proba sa osobom je mera, i nije se ovde odigrala.')}_`);
    download('laboratorija.md', lines.join('\n'), 'text/markdown;charset=utf-8');
  });
  $('#clear-all')?.addEventListener('click', () => { save('lab-results', {}); renderScore(); announce(tr('Measurements cleared.', 'Mere obrisane.')); });
}

function listView() {
  return `<div class="page-top"><div><p class="eyebrow">${tr('Laboratory / Eight measurements', 'Laboratorija / Osam mera')}</p><h1>${tr('Measure it,<br>then decide.', 'Izmeri,<br>pa odluči.')}</h1><p class="lede">${tr('Eight short labs. Each one tests a tool, an interface or a geometry, produces one number, and then asks what you will change in your project.', 'Osam kratkih ogleda. Svaki proverava alat, interfejs ili geometriju, daje jedan broj, i onda pita šta menjaš u svom projektu.')}</p></div></div>
  ${framing()}
  <div id="lab-score" class="lab-score"></div>
  <ul class="lab-list">${labs.map(lab => `<li><a href="laboratorija.html?lab=${lab.id}">
    <span class="meta-label">${lab.minutes} ${tr('min', 'min')} · ${esc(tr(lab.tests.en, lab.tests.sr))}</span>
    <h2>${esc(tx(lab.title))}</h2>
    <p>${esc(tx(lab.aim))}</p>
    <p class="small muted">${tr('Measures', 'Meri')}: ${esc(tx(lab.measures))} · ${esc(lab.standard)}</p>
    ${IMPLEMENTED[lab.id] ? '' : `<span class="tag">${tr('in preparation', 'u pripremi')}</span>`}
  </a></li>`).join('')}</ul>`;
}

function labView(lab, implementation) {
  return `<div class="page-top"><div><p class="eyebrow"><a href="laboratorija.html">${tr('Laboratory', 'Laboratorija')}</a> / ${lab.minutes} ${tr('min', 'min')}</p><h1>${esc(tx(lab.title))}</h1><p class="lede">${esc(tx(lab.aim))}</p></div><div class="page-meta"><span class="meta-label">${tr('Tests', 'Proverava')}</span><span>${esc(tr(lab.tests.en, lab.tests.sr))}</span><span class="meta-label">${tr('Standard', 'Standard')}</span><span class="small">${esc(lab.standard)}</span></div></div>
  ${framing()}
  <div id="lab-body">${implementation.render()}</div>
  ${decisionBox(lab.id)}
  <p class="actions"><a class="button secondary" href="laboratorija.html">← ${tr('All labs', 'Svi ogledi')}</a></p>`;
}

function render() {
  if (teardown) { teardown(); teardown = null; }
  const main = $('#main');
  const lab = openLab ? labById(openLab) : null;
  const implementation = lab ? IMPLEMENTED[lab.id] : null;
  if (!lab || !implementation) {
    main.innerHTML = listView();
    renderScore();
    return;
  }
  main.innerHTML = labView(lab, implementation);
  const rerender = () => {
    if (teardown) { teardown(); teardown = null; }
    $('#lab-body').innerHTML = implementation.render();
    teardown = implementation.bind(rerender) || (() => {});
  };
  teardown = implementation.bind(rerender) || (() => {});
  bindDecision(lab.id, () => implementation.measure());
}

mount({ view: 'lab', render, title: () => (openLab && labById(openLab) ? tx(labById(openLab).title) : tr('Laboratory', 'Laboratorija')) });

addEventListener('popstate', () => { openLab = new URLSearchParams(location.search).get('lab') || ''; render(); });
addEventListener('pagehide', () => { if (teardown) teardown(); });
