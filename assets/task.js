// Day one: an application for one person. Paper is the primary medium; this page is the scaffold
// around it — the brief, a constraint drawn from the labs, and an optional phone-sized sketchpad
// that keeps showing you the real minimum sizes while you draw.

import { $, $$, esc, tr, tx, lang, read, save, announce, download, mount, REPO, arrow } from './core.js';

/* The constraint cards are the labs, turned into design rules. Drawing one is the point:
   a constraint you chose is a preference, a constraint you were given is a design problem. */
const CARDS = [
  { id: 'linear', en: 'The screen must still make sense read in one line, top to bottom, with no layout: that is what a screen reader hands over.', sr: 'Ekran mora da ima smisla i kad se pročita u jednoj liniji, odozgo nadole, bez rasporeda: to je ono što čitač ekrana predaje.', lab: 'citac' },
  { id: 'keyboard', en: 'Every action must be reachable without pointing: one switch, one key, or voice.', sr: 'Svaka radnja mora biti dostupna bez pokazivanja: jednim prekidačem, jednim tasterom ili glasom.', lab: 'tastatura' },
  { id: 'three-presses', en: 'The main action must be reachable in at most three activations.', sr: 'Glavna radnja mora biti dostupna u najviše tri aktivacije.', lab: 'prekidac' },
  { id: 'no-colour', en: 'No information may be carried by colour alone, and no target smaller than 24 px.', sr: 'Nijedna informacija ne sme da stoji samo na boji, i nijedan cilj nije manji od 24 px.', lab: 'kontrast' },
  { id: 'two-channels', en: 'Anything urgent must arrive through two channels at once.', sr: 'Sve što je hitno mora da stigne kroz dva kanala istovremeno.', lab: 'kanali' },
  { id: 'one-hand', en: 'It must work with one hand, in a moving bus, with gloves on.', sr: 'Mora da radi jednom rukom, u autobusu koji se kreće, sa rukavicama.', lab: 'kontrast' },
  { id: 'no-clock', en: 'Nothing may expire. No countdown, no session that drops the work.', sr: 'Ništa ne sme da istekne. Bez odbrojavanja i bez sesije koja gubi rad.', lab: 'vreme' },
  { id: 'no-reading', en: 'It must be usable by someone who does not read the language of the interface.', sr: 'Mora da je upotrebljiva nekome ko ne čita jezik interfejsa.', lab: 'vreme' },
  { id: 'offline', en: 'It must work with no network, in a basement, at 6 % battery.', sr: 'Mora da radi bez mreže, u podrumu, na 6 % baterije.', lab: 'kanali' },
  { id: 'no-account', en: 'It must work without an account, without a name, without a phone number.', sr: 'Mora da radi bez naloga, bez imena i bez broja telefona.', lab: 'citac' }
];

const FIELDS = [
  { id: 'person', en: 'Who is it for — one person, in one sentence, with no diagnosis in it', sr: 'Za koga je — jedna osoba, u jednoj rečenici, bez dijagnoze u njoj', rows: 2 },
  { id: 'situation', en: 'Where and when did you observe the situation', sr: 'Gde i kada si posmatrao tu situaciju', rows: 2 },
  { id: 'purpose', en: 'What the application does — one sentence, one thing', sr: 'Šta aplikacija radi — jedna rečenica, jedna stvar', rows: 2 },
  { id: 'refuses', en: 'What it refuses to do, on purpose', sr: 'Šta namerno odbija da radi', rows: 2 },
  { id: 'questions', en: 'Three questions you would ask that person first', sr: 'Tri pitanja koja bi tu osobu prvo pitao', rows: 3 }
];

const SCREENS = [
  { id: 1, en: 'The moment it opens', sr: 'Trenutak kad se otvori' },
  { id: 2, en: 'The one action', sr: 'Jedna radnja' },
  { id: 3, en: 'When something goes wrong', sr: 'Kada nešto krene naopako' }
];

const PHONE = { w: 360, h: 760 };     // logical drawing surface, kept small on purpose

let state = {
  card: read('task-card', '') || '',
  slot: 1,
  shots: {},                          // slot → PNG data URL, in memory only
  overlay: { targets: true, text: true, thumb: false },
  tool: 'pen'
};

function brief() {
  return `<section class="brief-sheet">
  <h2>${tr('What is handed in', 'Šta se predaje')}</h2>
  <ol class="deliverables">
    <li>${tr('One A4, drawn by hand: three screens at real size, about 7 × 15 cm each.', 'Jedan A4, crtan rukom: tri ekrana u pravoj meri, oko 7 × 15 cm svaki.')}</li>
    <li>${tr('A purpose written next to every element on the screen. An element with no purpose is removed.', 'Svrha upisana uz svaki element na ekranu. Element bez svrhe se briše.')}</li>
    <li>${tr('The person and the observed situation — where, when, what you saw.', 'Osoba i posmatrana situacija — gde, kada, šta si video.')}</li>
    <li>${tr('The constraint card you drew, and how the design obeys it.', 'Kartica ograničenja koju si izvukao i kako je projekat ispunjava.')}</li>
    <li>${tr('One sentence: what the application refuses to do.', 'Jedna rečenica: šta aplikacija odbija da radi.')}</li>
    <li>${tr('Three questions for the person. You are not expected to have the answers today.', 'Tri pitanja za tu osobu. Danas se ne očekuje da znaš odgovore.')}</li>
  </ol>
  <h2>${tr('When it passes', 'Kada prolazi')}</h2>
  <ul class="rule-list">
    <li>${tr('An invented user fails. Write where and when you observed the situation.', 'Izmišljen korisnik pada. Upiši gde i kada si situaciju posmatrao.')}</li>
    <li>${tr('An application that does everything fails. The refusal is part of the design.', 'Aplikacija koja radi sve pada. Odbijanje je deo projekta.')}</li>
    <li>${tr('A screen that only works with a drawing fails: say it out loud, in one line, and it must still hold.', 'Ekran koji radi samo kao slika pada: izgovori ga naglas, u jednoj liniji, i mora da drži.')}</li>
    <li>${tr('“An app for the blind” fails. One person, one situation, one thing.', '„Aplikacija za slepe“ pada. Jedna osoba, jedna situacija, jedna stvar.')}</li>
  </ul>
  <div class="notice"><p>${tr('Today you design for someone, not with someone — and that is the weakness of day one, not a method. In week two the person is in the room, and the questions you wrote are what you ask.', 'Danas projektuješ za nekoga, a ne sa nekim — i to je slabost prvog dana, ne metod. U drugoj nedelji je osoba u sali, i pitanja koja si napisao su ono što pitaš.')}</p></div>
  </section>`;
}

function cardBox() {
  const card = CARDS.find(item => item.id === state.card);
  return `<section class="card-box" aria-labelledby="card-title">
  <h2 id="card-title">${tr('The constraint', 'Ograničenje')}</h2>
  ${card
    ? `<blockquote class="constraint"><p>${esc(tr(card.en, card.sr))}</p><cite><a href="laboratorija.html?lab=${card.lab}">${tr('Measure it in the lab', 'Izmeri u laboratoriji')} ${arrow}</a></cite></blockquote>`
    : `<p class="help">${tr('Draw one. You do not choose it: a constraint you chose is a preference.', 'Izvuci jednu. Ne biraš je: ograničenje koje si izabrao je ukus.')}</p>`}
  <div class="actions"><button type="button" id="draw-card" class="button signal">${card ? tr('Draw another', 'Izvuci drugu') : tr('Draw a constraint', 'Izvuci ograničenje')}</button>
  <details class="all-cards"><summary>${tr('See all ten', 'Vidi svih deset')}</summary><ul>${CARDS.map(item => `<li>${esc(tr(item.en, item.sr))}</li>`).join('')}</ul></details></div>
  </section>`;
}

function notes() {
  return `<section class="task-notes" aria-labelledby="notes-title"><h2 id="notes-title">${tr('Six lines', 'Šest redova')}</h2>
  ${FIELDS.map(field => `<div class="lab-field"><label for="field-${field.id}">${esc(tr(field.en, field.sr))}</label><textarea id="field-${field.id}" rows="${field.rows}">${esc(read('task-' + field.id, '') || '')}</textarea></div>`).join('')}
  <div class="actions"><button type="button" id="save-notes">${tr('Keep in this browser', 'Zadrži u pregledaču')}</button><button type="button" id="export-task">${tr('Download the sheet', 'Preuzmi list')}</button><a class="button secondary" href="${REPO}/issues/new?template=predaja.yml" target="_blank" rel="noopener">${tr('Hand in on the pinboard', 'Predaj na tabli')} ${arrow}</a></div>
  <p class="help" id="notes-status" role="status">${tr('Text stays in this browser if it allows storage. Sketches are never stored automatically — download them.', 'Tekst ostaje u ovom pregledaču ako dopušta čuvanje. Skice se nikada ne čuvaju automatski — preuzmi ih.')}</p></section>`;
}

function pad() {
  return `<section class="sketch" aria-labelledby="sketch-title">
  <h2 id="sketch-title">${tr('Optional: the same three screens on glass', 'Neobavezno: ista tri ekrana na staklu')}</h2>
  <p class="help">${tr('Paper is the hand-in. This pad exists for one reason: while you draw it keeps showing the real minimum sizes — a 24 px target, a 16 px line of text, and the arc a thumb reaches on a 6 inch phone.', 'Papir je predaja. Ovo platno postoji zbog jedne stvari: dok crtaš, stalno pokazuje stvarne minimume — cilj od 24 px, red teksta od 16 px i luk koji palac dohvata na telefonu od 6 inča.')}</p>
  <div class="sketch-layout">
    <div class="phone-wrap">
      <div class="phone"><canvas id="pad" width="${PHONE.w}" height="${PHONE.h}" aria-label="${tr('Drawing surface for screen', 'Površina za crtanje ekrana')} ${state.slot}"></canvas><div class="phone-overlay" id="overlay" aria-hidden="true"></div></div>
    </div>
    <div class="sketch-tools">
      <fieldset><legend>${tr('Screen', 'Ekran')}</legend><div class="role-choice">${SCREENS.map(screen => `<button type="button" data-slot="${screen.id}" aria-pressed="${state.slot === screen.id}">${screen.id}</button>`).join('')}</div>
      <p class="help" id="slot-name">${esc(tr(SCREENS[state.slot - 1].en, SCREENS[state.slot - 1].sr))}</p></fieldset>
      <fieldset><legend>${tr('Tool', 'Alat')}</legend><div class="role-choice"><button type="button" data-tool="pen" aria-pressed="${state.tool === 'pen'}">${tr('Pen', 'Olovka')}</button><button type="button" data-tool="eraser" aria-pressed="${state.tool === 'eraser'}">${tr('Eraser', 'Gumica')}</button></div></fieldset>
      <fieldset><legend>${tr('Guides', 'Pomoćne linije')}</legend>
        <label class="check-line"><input type="checkbox" id="g-targets" ${state.overlay.targets ? 'checked' : ''}> ${tr('24 px targets', 'Ciljevi 24 px')}</label>
        <label class="check-line"><input type="checkbox" id="g-text" ${state.overlay.text ? 'checked' : ''}> ${tr('16 px text lines', 'Redovi teksta 16 px')}</label>
        <label class="check-line"><input type="checkbox" id="g-thumb" ${state.overlay.thumb ? 'checked' : ''}> ${tr('Thumb reach', 'Dohvat palca')}</label>
      </fieldset>
      <div class="actions"><button type="button" id="pad-clear">${tr('Clear this screen', 'Očisti ekran')}</button><button type="button" id="pad-save">${tr('Download PNG', 'Preuzmi PNG')}</button><button type="button" id="pad-sheet">${tr('Download all three', 'Preuzmi sva tri')}</button></div>
      <p class="help">${tr('Drawing needs a pointer or a finger. If you cannot draw here, the paper route and the six written lines carry the same weight — that is the rule for the hand-in too.', 'Crtanje traži pokazivač ili prst. Ako ovde ne možeš da crtaš, put preko papira i šest upisanih redova vrede isto — to pravilo važi i za predaju.')}</p>
    </div>
  </div></section>`;
}

function render() {
  $('#main').innerHTML = `<div class="page-top"><div><p class="eyebrow">${tr('Week 1 / Day one / By hand', 'Nedelja 1 / Prvi dan / Rukom')}</p><h1>${tr('An application<br>for one person.', 'Aplikacija<br>za jednu osobu.')}</h1><p class="lede">${tr('Not an app for a group, not an app for a diagnosis. One person you have watched in one situation, and the first three screens of something that does one thing for them.', 'Ne aplikacija za grupu, ne aplikacija za dijagnozu. Jedna osoba koju si gledao u jednoj situaciji, i prva tri ekrana nečega što za nju radi jednu stvar.')}</p>
  <div class="actions"><a class="button secondary" href="index.html">${tr('Back to the week', 'Natrag na nedelju')}</a><a class="button secondary" href="vezbe.html">${tr('All exercises', 'Sve vežbe')}</a></div></div>
  <div class="page-meta"><span class="meta-label">${tr('Time', 'Vreme')}</span><span>${tr('90 minutes in the studio', '90 minuta u studiju')}</span><span class="meta-label">${tr('Medium', 'Medij')}</span><span>${tr('pencil, A4', 'olovka, A4')}</span></div></div>
  ${brief()}${cardBox()}${notes()}${pad()}`;
  bind();
}

function bind() {
  $('#draw-card').addEventListener('click', () => {
    const pool = CARDS.filter(card => card.id !== state.card);
    const picked = pool[Math.floor(Math.random() * pool.length)];
    state.card = picked.id;
    save('task-card', state.card);
    render();
    $('#draw-card').focus();
    announce(tr('Constraint: ', 'Ograničenje: ') + tr(picked.en, picked.sr));
  });

  $('#save-notes').addEventListener('click', () => {
    let ok = true;
    for (const field of FIELDS) ok = save('task-' + field.id, $('#field-' + field.id).value.trim()) && ok;
    $('#notes-status').textContent = ok
      ? tr('Kept in this browser only. Not a hand-in.', 'Zadržano samo u ovom pregledaču. Nije predaja.')
      : tr('This browser refused to store it. Download the sheet instead.', 'Pregledač je odbio čuvanje. Preuzmi list.');
  });

  $('#export-task').addEventListener('click', () => {
    const card = CARDS.find(item => item.id === state.card);
    const lines = [`# ${tr('An application for one person', 'Aplikacija za jednu osobu')}`, '',
      `${tr('Constraint', 'Ograničenje')}: ${card ? tr(card.en, card.sr) : '—'}`, ''];
    for (const field of FIELDS) lines.push(`## ${tr(field.en, field.sr)}`, ($('#field-' + field.id).value.trim() || '—'), '');
    lines.push(`_${tr('Three screens are drawn by hand on A4. This file is the text that goes with them.', 'Tri ekrana se crtaju rukom na A4. Ovaj fajl je tekst koji ide sa njima.')}_`);
    download('zadatak-01.md', lines.join('\n'), 'text/markdown;charset=utf-8');
  });

  bindPad();
}

/* ---------------- the sketchpad ---------------- */
let padTeardown = null;

function bindPad() {
  if (padTeardown) { padTeardown(); padTeardown = null; }
  const canvas = $('#pad');
  if (!canvas) return;
  const ratio = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = PHONE.w * ratio;
  canvas.height = PHONE.h * ratio;
  const context = canvas.getContext('2d', { alpha: false });
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, PHONE.w, PHONE.h);
  context.lineJoin = context.lineCap = 'round';

  const restore = () => {
    const shot = state.shots[state.slot];
    if (!shot) return;
    const image = new Image();
    image.onload = () => context.drawImage(image, 0, 0, PHONE.w, PHONE.h);
    image.src = shot;
  };
  restore();

  const keep = () => { try { state.shots[state.slot] = canvas.toDataURL('image/png'); } catch { /* tainted canvas cannot happen here */ } };

  let drawing = false;
  const point = event => {
    const box = canvas.getBoundingClientRect();
    return [(event.clientX - box.left) * PHONE.w / box.width, (event.clientY - box.top) * PHONE.h / box.height];
  };
  const down = event => {
    drawing = true;
    canvas.setPointerCapture?.(event.pointerId);
    context.strokeStyle = state.tool === 'eraser' ? '#ffffff' : '#192e27';
    context.lineWidth = state.tool === 'eraser' ? 18 : 2.2;
    const [x, y] = point(event);
    context.beginPath(); context.moveTo(x, y); context.lineTo(x + 0.01, y);
    context.stroke();
  };
  const move = event => {
    if (!drawing) return;
    const [x, y] = point(event);
    context.lineTo(x, y); context.stroke();
  };
  const up = () => { if (!drawing) return; drawing = false; keep(); };
  canvas.addEventListener('pointerdown', down);
  canvas.addEventListener('pointermove', move);
  canvas.addEventListener('pointerup', up);
  canvas.addEventListener('pointerleave', up);

  const overlay = $('#overlay');
  const paintOverlay = () => {
    const pieces = [];
    if (state.overlay.text) pieces.push(`repeating-linear-gradient(to bottom, rgba(25,46,39,.10) 0 1px, transparent 1px 24px)`);
    if (state.overlay.targets) pieces.push(`repeating-linear-gradient(to right, rgba(25,46,39,.10) 0 1px, transparent 1px 24px)`);
    overlay.style.background = pieces.join(',');
    overlay.classList.toggle('thumb', state.overlay.thumb);
  };
  paintOverlay();

  $$('[data-slot]').forEach(button => button.addEventListener('click', () => {
    keep();
    state.slot = Number(button.dataset.slot);
    $$('[data-slot]').forEach(other => other.setAttribute('aria-pressed', String(Number(other.dataset.slot) === state.slot)));
    $('#slot-name').textContent = tr(SCREENS[state.slot - 1].en, SCREENS[state.slot - 1].sr);
    context.fillStyle = '#ffffff'; context.fillRect(0, 0, PHONE.w, PHONE.h);
    restore();
    announce(tr('Screen', 'Ekran') + ' ' + state.slot);
  }));
  $$('[data-tool]').forEach(button => button.addEventListener('click', () => {
    state.tool = button.dataset.tool;
    $$('[data-tool]').forEach(other => other.setAttribute('aria-pressed', String(other.dataset.tool === state.tool)));
  }));
  const toggles = { 'g-targets': 'targets', 'g-text': 'text', 'g-thumb': 'thumb' };
  Object.entries(toggles).forEach(([id, key]) => $('#' + id).addEventListener('change', event => {
    state.overlay[key] = event.target.checked; paintOverlay();
  }));
  $('#pad-clear').addEventListener('click', () => {
    context.fillStyle = '#ffffff'; context.fillRect(0, 0, PHONE.w, PHONE.h);
    delete state.shots[state.slot];
    announce(tr('Screen cleared.', 'Ekran očišćen.'));
  });
  $('#pad-save').addEventListener('click', () => {
    keep();
    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url; anchor.download = `ekran-${state.slot}.png`; anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 20000);
    }, 'image/png');
  });
  $('#pad-sheet').addEventListener('click', async () => {
    keep();
    const gap = 20;
    const sheet = document.createElement('canvas');
    sheet.width = PHONE.w * 3 + gap * 4;
    sheet.height = PHONE.h + gap * 2;
    const paper = sheet.getContext('2d');
    paper.fillStyle = '#ffffff'; paper.fillRect(0, 0, sheet.width, sheet.height);
    for (const screen of SCREENS) {
      const x = gap + (screen.id - 1) * (PHONE.w + gap);
      paper.strokeStyle = '#c5ccc4'; paper.strokeRect(x, gap, PHONE.w, PHONE.h);
      const shot = state.shots[screen.id];
      if (!shot) continue;
      await new Promise(resolve => {
        const image = new Image();
        image.onload = () => { paper.drawImage(image, x, gap, PHONE.w, PHONE.h); resolve(); };
        image.onerror = resolve;
        image.src = shot;
      });
    }
    sheet.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url; anchor.download = 'tri-ekrana.png'; anchor.click();
      setTimeout(() => { URL.revokeObjectURL(url); sheet.width = sheet.height = 0; }, 20000);
    }, 'image/png');
  });

  padTeardown = () => {
    canvas.removeEventListener('pointerdown', down);
    canvas.removeEventListener('pointermove', move);
    canvas.removeEventListener('pointerup', up);
    canvas.removeEventListener('pointerleave', up);
  };
}

mount({ view: 'task', render, title: () => tr('An application for one person', 'Aplikacija za jednu osobu') });
addEventListener('pagehide', () => { if (padTeardown) padTeardown(); });
