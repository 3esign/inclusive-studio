// The association's space: a practical, plain-language page for members of „Živimo zajedno”
// and their staff. Serbian comes first on this page — its readers are. The safety gate keeps
// its state in this browser only (nothing is sent anywhere), and the recording sheet prints.

import { $, $$, esc, tr, read, save, setLanguage, mount, announce } from './core.js';
import { GATE_ITEMS, gateVerdict, STEPS, RIGHTS, MEASURED, NEVER } from './udruzenje-core.js';

// This page's audience reads Serbian: unless the reader has chosen a language themselves,
// Serbian is the default here — without touching anyone's stored choice.
try { if (localStorage.getItem('is3:language') === null) setLanguage('sr'); } catch {}

let gate = read('udruzenje-kapija', {});
if (typeof gate !== 'object' || !gate) gate = {};

function gateTool() {
  const verdict = gateVerdict(gate);
  return `<div class="gate-tool">
  <p class="meta-label">${tr('Safety gate — prototype check (runs in this browser; nothing is sent anywhere)', 'Kapija bezbednosti — provera prototipa (radi u pregledaču, ništa se ne šalje nigde)')}</p>
  <label class="field-line" for="gate-name">${tr('Prototype / team name', 'Ime prototipa / tima')}</label>
  <input id="gate-name" type="text" autocomplete="off" placeholder="${tr('e.g. Tower — team 3', 'npr. Toranj — tim 3')}" value="${esc(gate.ime || '')}">
  <ul class="gate-checks">${GATE_ITEMS.map(item => `<li><label class="check-line"><input type="checkbox" data-gate-check="${item.id}"${gate[item.id] ? ' checked' : ''}><span>${esc(tr(item.en, item.sr))}</span></label></li>`).join('')}</ul>
  <p class="gate-verdict ${verdict.pass ? 'is-pass' : 'is-fail'}" role="status">${esc(tr(verdict.message.en, verdict.message.sr))}</p>
</div>`;
}

function view() {
  return `<div class="page-top"><div><p class="eyebrow">${tr('Association “Živimo zajedno” · a space for members and staff', 'Udruženje „Živimo zajedno” · prostor za članove i osoblje')}</p>
  <h1>${tr('You try it with your own hands.', 'Probate na svojim rukama.')}</h1>
  <p class="lede">${tr(
    'Architecture students make toys and bring them to the association for you to try. You are a coauthor of the finding, not a subject: the object is judged, never the person. This page is the practical meeting place — the steps, your rights and the safety gate in one place.',
    'Studenti arhitekture prave igračke i donose ih u udruženje da ih probate. Vi ste koautor nalaza, ne ispitanik: ocenjuje se predmet, nikad osoba. Ova strana je praktično mesto sastanka — koraci probavanja, vaša prava i kapija bezbednosti na jednom mestu.')}</p></div></div>

  <section aria-labelledby="korak-title"><div class="section-heading"><div><p class="eyebrow">${tr('How a try-out runs', 'Kako izgleda probavanje')}</p><h2 id="korak-title">${tr('Four steps, no surprises.', 'Četiri koraka, bez iznenađenja.')}</h2></div></div>
  <ol class="partner-steps">${STEPS.map((step, index) => `<li><b aria-hidden="true">${index + 1}</b><div><h3>${esc(tr(step.en[0], step.sr[0]))}</h3><p>${esc(tr(step.en[1], step.sr[1]))}</p></div></li>`).join('')}</ol></section>

  <section aria-labelledby="prava-title"><div class="section-heading"><div><p class="eyebrow">${tr('Your rights', 'Vaša prava')}</p><h2 id="prava-title">${tr('Five rights, in plain words.', 'Pet prava, crno na belo.')}</h2></div></div>
  <ul class="partner-rights">${RIGHTS.map(right => `<li>${tr(right.en, right.sr)}</li>`).join('')}</ul></section>

  <section aria-labelledby="osoblje-title"><div class="section-heading"><div><p class="eyebrow">${tr('For the association staff', 'Za osoblje udruženja')}</p><h2 id="osoblje-title">${tr('The protocol in brief.', 'Protokol u kratko.')}</h2></div></div>
  <details open><summary>${tr('Before the visit — gates', 'Pre dolaska — kapije')}</summary><div>
  <ul>
    <li>${tr('<b>Time and space</b> are agreed in advance with the association — how many members, how much time.', '<b>Termin i prostor</b> se dogovaraju unapred, sa udruženjem — koliko članova, koliko vremena.')}</li>
    <li>${tr('<b>Every prototype passes the safety gate</b> before it reaches anyone’s hands: small parts (the small-parts cylinder, EN 71-1), edges and tips (deburred), cord and string (the 220 mm limit), the pull test. A prototype that fails <b>does not go into hands</b> — it stays on the table, for conversation only.', '<b>Svaki prototip prolazi bezbednosnu kapiju</b> pre nego što ikome stane u ruke: mali delovi (cilindar za male delove, EN 71-1), ivice i vrhovi (brušene), kanap i šnura (granica dužine 220 mm), ispitivanje na čupanje. Prototip koji ne prođe <b>ne ide u ruke</b> — ostaje na stolu samo za razgovor.')}</li>
    <li>${tr('The student brings <b>their own A3 sheet</b> and the recording sheet.', 'Student donosi <b>svoj A3 list</b> i list za zapisivanje.')}</li>
  </ul>
  ${gateTool()}
  </div></details>
  <details><summary>${tr('What is measured and written down, per user–prototype pair', 'Šta se meri i upisuje po paru korisnik–prototip')}</summary><div>
  <div class="table-wrap"><table>
  <caption>${tr('What · how it is recorded', 'Šta · kako se beleži')}</caption>
  <thead><tr><th>${tr('What', 'Šta')}</th><th>${tr('How', 'Kako')}</th></tr></thead>
  <tbody>${MEASURED.map(row => `<tr><td>${esc(tr(row.what.en, row.what.sr))}</td><td>${esc(tr(row.how.en, row.how.sr))}</td></tr>`).join('')}</tbody></table></div>
  </div></details>
  <details><summary>${tr('What is never done', 'Čega se ne radi')}</summary><div>
  <ul>${NEVER.map(item => `<li>${tr(item.en, item.sr)}</li>`).join('')}</ul>
  </div></details></section>

  <div class="actions"><button type="button" id="print-list">${tr('Print the recording sheet', 'Odštampaj list za zapisivanje')}</button> <a class="button secondary" href="etika.html">${tr('Working together', 'Kako sarađujemo')}</a> <a class="button secondary" href="pristupacnost.html">${tr('Accessibility', 'Pristupačnost')}</a></div>

  <section class="print-only print-sheet" aria-label="${tr('Recording sheet for the try-out', 'List za zapisivanje probavanja')}">
  <h2>${tr('Recording sheet — trying the prototype at the association', 'List za zapisivanje — probavanje prototipa u udruženju')}</h2>
  <p class="print-sheet-sub">${tr('Prototype: ______________________ · Team: ______________ · Date: ______________ · Space: ______________________', 'Prototip: ______________________ · Tim: ______________ · Datum: ______________ · Prostor: ______________________')}</p>
  <div class="table-wrap"><table>
  <caption>${tr('Per user–prototype pair; “no” is a finding too', 'Po paru korisnik–prototip; „nije” je takođe nalaz')}</caption>
  <thead><tr><th>${tr('User (anonymous)', 'Korisnik (anonimno)')}</th><th>${tr('First action', 'Prva radnja')}</th><th>${tr('Time to first success', 'Vreme do prvog uspeha')}</th><th>${tr('Where it sticks', 'Gde zapinje')}</th><th>${tr('What changed', 'Šta je promenio')}</th><th>${tr('Hand measurement (optional)', 'Mera ruke (po želji korisnika)')}</th><th>${tr('Statement', 'Izjava')}</th></tr></thead>
  <tbody>${'<tr class="blank-row"><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>'.repeat(4)}</tbody></table></div>
  <p class="print-sheet-note">${tr('Safety gate signed off before hands: small parts ☐ · edges ☐ · cord ☐ · pull ☐ — student’s signature: ______________________', 'Kapija bezbednosti potpisana pre ruku: mali delovi ☐ · ivice ☐ · kanap ☐ · čupanje ☐ — potpis studenta: ______________________')}</p>
  <p class="print-sheet-note">${tr('No disability simulation · no scoring of persons · stopping allowed at any moment · no publishing without consent.', 'Bez simulacije invaliditeta · bez ocenjivanja osoba · prekid u svakom trenutku · bez objave bez saglasnosti.')}</p>
  </section>

  <div class="readable" lang="${tr('en', 'sr-Latn')}">
  <h2>${tr('English summary', 'Srpski je primarni jezik ove strane')}</h2>
  <p>${tr(
    'A practical space for members and staff of the association “Živimo zajedno”: how a try-out session runs (the toy is handed over without explanation, the student observes and never corrects), five rights in plain words, and the staff-side protocol in brief — the safety gate every prototype passes before touching hands (small parts, edges, cords, pull test, EN 71-1), what is measured per user–prototype pair, and what is never done. The date and space are arranged with the association; the page carries no names, photographs or statements of members. Source: docs/probavanje-u-udruzenju.md.',
    'Ova strana je prvo na srpskom jer su njeni čitaoci članovi i osoblje udruženja. Sadržaj: četiri koraka probavanja, pet prava, protokol za osoblje — bezbednosna kapija (mali delovi, ivice, kanap, čupanje, EN 71-1), šta se meri po paru korisnik–prototip, i čega se ne radi. Strana ne nosi imena, fotografije ni izjave članova. Izvor: docs/probavanje-u-udruzenju.md.')}</p>
  </div>
  <p class="help">${tr('Content source: docs/probavanje-u-udruzenju.md (the try-out protocol) · this page is part of the pilot, open to revision. Without JavaScript: everything above is readable without scripting; the interactive gate and the sheet printing need the script.', 'Izvor sadržaja: docs/probavanje-u-udruzenju.md (protokol probavanja) · strana je deo pilota, otvorena za doradu. Bez JavaScript-a: sve gore čitljivo je i bez skripte; interaktivna kapija i štampa lista traže skriptu.')}</p>`;
}

function bind() {
  const nameField = $('#gate-name');
  nameField?.addEventListener('input', () => {
    gate.ime = nameField.value;
    save('udruzenje-kapija', gate);
  });
  $$('#main [data-gate-check]').forEach(box => box.addEventListener('change', () => {
    gate = { ...gate, [box.dataset.gateCheck]: box.checked };
    save('udruzenje-kapija', gate);
    const verdict = gateVerdict(gate);
    const line = $('#main .gate-verdict');
    if (line) {
      line.textContent = tr(verdict.message.en, verdict.message.sr);
      line.classList.toggle('is-pass', verdict.pass);
      line.classList.toggle('is-fail', !verdict.pass);
    }
    announce(tr(verdict.message.en, verdict.message.sr));
  }));
  $('#print-list')?.addEventListener('click', () => window.print());
}

function render() { $('#main').innerHTML = view(); bind(); }
mount({ view: 'partner', render, title: () => tr('The association', 'Udruženje') });
