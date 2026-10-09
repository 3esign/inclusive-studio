// Shared, pure next-class composition. The selected material supplies every topic.
import { esc, tr, tx } from './core.js';
import { validateTok } from './tok-core.js';
import { validateWeek, safeHref, toSlides, weekFile } from './material.js';
import { renderBlock } from './blocks.js';
import { exercises } from './exercises.js';
import { prototypeTeaser } from './prototipovi-core.js';

export function nextClassEntry(tok) {
  const errors = validateTok(tok);
  if (errors.length) throw Error(errors.join('\n'));
  const entries = tok.sledeci.filter(item => item.vrsta === 'cas');
  if (entries.some(item => !Number.isInteger(item.nedelja) || item.nedelja < 1 || item.nedelja > 30)) throw Error('Next class requires a valid material week.');
  const entry = [...entries].sort((a, b) => a.nedelja - b.nedelja)[0] || null;
  if (entry && tok.odrzano.some(item => item.vrsta === 'cas' && item.nedelja >= entry.nedelja)) throw Error('Next class must follow the held weeks.');
  return entry;
}
export function lastHeldClass(tok) {
  return [...tok.odrzano].filter(item => item.vrsta === 'cas').sort((a, b) => b.odrzan.localeCompare(a.odrzan) || b.nedelja - a.nedelja)[0] || null;
}
const preview = n => `predavanje.html?w=${n}&amp;preview=1`;
const sectionTitle = (id, eyebrow, title) => `<div class="section-heading"><div><p class="eyebrow">${eyebrow}</p><h2 id="${id}">${title}</h2></div></div>`;

function floorView(tok) {
  const last = lastHeldClass(tok);
  if (!last) return '';
  return `<section class="floor" aria-labelledby="floor-title">${sectionTitle('floor-title', tr('Where we start', 'Odakle polazimo'), tr('The class before, and what it left', 'Prethodni čas i ono što je ostavio'))}
  <div class="idea-grid"><article class="idea-card"><p class="idea-card-meta"><time datetime="${esc(last.odrzan)}">${esc(last.odrzan)}</time> · ${tr('Class', 'Čas')} · <a href="index.html?w=${last.nedelja}">${tr('week', 'nedelja')} ${last.nedelja}</a></p><h3>${esc(tx(last.naslov))}</h3>
  <ul class="cem-results">${last.rezultati.map(result => `<li>${esc(tx(result.sta))}<span class="idea-card-meta">— ${esc(result.izvor)}</span></li>`).join('')}</ul><p class="idea-card-meta"><a href="index.html">${tr('All held classes', 'Svi održani časovi')} →</a></p></article></div></section>`;
}
function photoView(photo) {
  if (!photo) return '';
  const dimensions = Number.isInteger(photo.width) && photo.width > 0 && Number.isInteger(photo.height) && photo.height > 0 ? ` width="${photo.width}" height="${photo.height}"` : '';
  return `<figure class="next-material-photo"><img src="${esc(safeHref(photo.src))}" alt="${esc(tx(photo.alt))}"${dimensions} loading="eager" decoding="async">${photo.caption ? `<figcaption>${esc(tx(photo.caption))}</figcaption>` : ''}</figure>`;
}
function exerciseCard(id, bank, draft) {
  const item = bank.find(item => item.id === id);
  if (!item) throw Error('Missing referenced exercise: ' + id);
  return `<article class="task-card${draft ? ' is-draft' : ''}" id="next-ex-${esc(id)}" data-next-exercise="${esc(id)}"><p class="idea-card-meta">${esc(tx(item.title))}${draft ? ` · ${tr('draft — awaiting the plan’s confirmation', 'nacrt — čeka potvrdu plana')}` : ''}</p><p>${esc(tx(item.task))}</p>
  <dl class="task-dl"><div><dt>${tr('Handed in', 'Predaje se')}</dt><dd>${esc(tx(item.hand))}</dd></div><div><dt>${tr('How it is checked', 'Kako se proverava')}</dt><dd>${esc(tx(item.check))}</dd></div></dl>${tx(item.source) ? `<p class="idea-card-meta">${tr('Source', 'Izvor')}: ${esc(tx(item.source))}</p>` : ''}</article>`;
}
function planView(week, firstPhoto, refs, bank) {
  if (!week.blocks.length) return `<section class="plan" aria-labelledby="plan-title">${sectionTitle('plan-title', tr('Working material', 'Radni materijal'), tr('The plan, in order', 'Plan, redom'))}<p class="idea-note">${tr('The detailed plan has not been entered yet.', 'Detaljan plan još nije upisan.')}</p></section>`;
  const blockView = block => {
    if (block === firstPhoto) return ''; // shown once beside the title, with the original caption
    if (block.kind === 'exercise') {
      const item = bank.find(item => item.id === block.ref);
      if (!item) throw Error('Missing referenced exercise: ' + block.ref);
      return `<p class="material-link"><a href="#next-ex-${esc(block.ref)}">${esc(tx(item.title))} →</a></p>${block.text ? `<p>${esc(tx(block.text))}</p>` : ''}`;
    }
    if (block.kind === 'decision') return `<div class="material-decision"><p class="meta-label">${tr('Proposed record for the class', 'Predlog zapisa za čas')}</p><p>${esc(tx(block.text))}</p></div>`;
    return renderBlock(block, refs);
  };
  return `<section class="plan" aria-labelledby="plan-title">${sectionTitle('plan-title', tr('Working material', 'Radni materijal'), tr('The plan, in order', 'Plan, redom'))}<ol class="plan-list">${toSlides(week).map(group => `<li><div>${group.heading ? `<h3>${esc(tx(group.heading.text))}</h3>` : ''}${group.blocks.map(blockView).join('')}</div><p class="idea-card-meta">${tr('Source', 'Izvor')}: ${esc(weekFile(week.n))}</p></li>`).join('')}</ol></section>`;
}
function sheetsView(week, bank) {
  const ids = [...new Set(week.blocks.filter(block => block.kind === 'exercise').map(block => block.ref))];
  if (!ids.length) return '';
  return `<section class="sheet" aria-labelledby="sheet-title">${sectionTitle('sheet-title', tr('The workbook', 'Radna sveska'), tr('Tasks in the preparation', 'Zadaci u pripremi'))}<p class="lede">${tr('These tasks belong to the working plan for the next class. The teacher confirms the final plan and assignments.', 'Ovi zadaci pripadaju radnom planu sledećeg časa. Nastavnik potvrđuje konačan plan i zadatke.')}</p><div class="task-grid">${ids.map(id => exerciseCard(id, bank, week.state === 'draft')).join('')}</div><p class="help"><a href="assets/sablon-a3.svg" download>${tr('A3 sheet template', 'Šablon A3 lista')} ↓</a> · <a href="vezbe.html">${tr('the exercise bank', 'banka vežbi')} →</a> · <a href="${preview(week.n)}">${tr('Working preview', 'Radni pregled')} →</a></p></section>`;
}
function bringView(week) {
  const bring = Array.isArray(week.bring) ? week.bring : [];
  return `<section class="bring-plan" aria-labelledby="bring-title">${sectionTitle('bring-title', tr('Before you come', 'Pre nego što dođeš'), tr('What to bring', 'Šta se donosi'))}${bring.length ? `<ul class="bring-list">${bring.map(item => `<li>${esc(tx(item))}</li>`).join('')}</ul>` : `<p class="idea-note">${tr('The list of things to bring has not been entered yet.', 'Spisak za donošenje još nije upisan.')}</p>`}</section>`;
}
function protocolsView(tok) {
  return tok.sledeci.filter(item => item.vrsta === 'protokol').map((item, index) => {
    const association = item.id === 'probavanje-u-udruzenju';
    return `<section class="protocol" aria-labelledby="protocol-title-${index}">${sectionTitle('protocol-title-' + index, tr('Preparation protocol', 'Protokol pripreme'), esc(tx(item.naslov)))}<div class="protocol-grid"><div><p>${esc(tx(item.kratko))}</p><p class="idea-note"><b>${tr('Waiting for', 'Čeka')}:</b> ${esc(tx(item.ceka))}</p><p class="idea-card-meta">${tr('Source', 'Izvor')}: ${esc(item.izvor)}</p>${association ? `<p class="actions"><a class="button secondary" href="udruzenje.html">${tr('The whole protocol', 'Ceo protokol')} →</a></p>` : ''}</div>${association ? `<figure class="protocol-figure"><img src="assets/fieldwork/zivimo-zajedno-sketch.jpg" alt="${tr('A hand-drawn sketch of the association’s interior: two floors, a stair and a ramp', 'Ručna skica unutrašnjeg prostora udruženja: dva nivoa, stepenište i rampa')}" loading="lazy" width="880" height="660"><figcaption>${tr('A field sketch of the association’s space — two levels, a stair, a ramp.', 'Terenska skica prostora udruženja — dva nivoa, stepenište, rampa.')}</figcaption></figure>` : ''}</div></section>`;
  }).join('');
}
function waitsView(tok) {
  return `<section class="waits" aria-labelledby="waits-title">${sectionTitle('waits-title', tr('Open decisions', 'Otvorene odluke'), tr('What this page still waits on', 'Šta ova strana još čeka'))}<ul class="wait-list">${tok.sledeci.map(item => `<li><b>${esc(tx(item.naslov))}</b><span>${esc(tx(item.ceka))}</span></li>`).join('')}</ul><p class="help">${tr('A held class and its results remain in the record; this page follows the next class named in the course flow.', 'Održani čas i njegovi rezultati ostaju u evidenciji; ova strana prati naredni čas naveden u toku predmeta.')} <a href="index.html">${tr('Held classes', 'Održani časovi')} →</a></p></section>`;
}
export function renderNextClass({ tok, week = null, prototypes = null, refs = { lab: {}, exercise: {} }, exerciseBank = exercises }) {
  const entry = nextClassEntry(tok);
  const teaser = prototypes ? `<!-- prototype-teaser:start -->${prototypeTeaser(prototypes)}<!-- prototype-teaser:end -->` : '';
  if (!entry) return `${teaser}<div class="next-intro no-photo"><div class="next-intro-heading"><h1>${tr('The next class has not been entered.', 'Naredni čas još nije upisan.')}</h1></div><div class="next-intro-copy"><p>${tr('No week or material is inferred from the last held class.', 'Nedelja i gradivo se ne izvode iz poslednjeg održanog časa.')}</p></div></div>${floorView(tok)}${protocolsView(tok)}${waitsView(tok)}`;
  const check = validateWeek(week);
  if (!check.ok || week.n !== entry.nedelja) throw Error(check.ok ? 'Material week does not match the next class.' : check.problems.join('\n'));
  const firstPhoto = week.blocks.find(block => block.kind === 'image');
  const date = week.date ? `<time datetime="${esc(week.date)}">${esc(week.date)}</time> · ${week.dateStatus === 'confirmed' ? tr('date confirmed', 'datum potvrđen') : tr('date proposed', 'datum predložen')}` : tr('date not entered', 'datum nije upisan');
  return `${teaser}<div class="next-intro${firstPhoto ? '' : ' no-photo'}" data-next-week="${week.n}"><div class="next-intro-heading"><p class="eyebrow">${tr('Preparation · week', 'Priprema · nedelja')} ${week.n}</p><h1>${esc(tx(week.title))}</h1><p class="idea-card-meta"><span class="tag">${date}</span> · ${tr(week.state === 'draft' ? 'draft — plan awaiting confirmation' : 'preparation — not yet held', week.state === 'draft' ? 'nacrt — plan čeka potvrdu' : 'priprema — još nije održano')}</p></div>${photoView(firstPhoto)}<div class="next-intro-copy">${week.aim ? `<p class="lede">${esc(tx(week.aim))}</p>` : ''}<p class="idea-note"><b>${tr('Waiting for', 'Čeka')}:</b> ${esc(tx(entry.ceka))}</p><div class="actions"><a class="button" href="${preview(week.n)}">${tr('Working preview', 'Radni pregled')} →</a><a class="button secondary" href="program.html">${tr('Calendar', 'Kalendar')}</a></div></div></div>
  ${floorView(tok)}${bringView(week)}${planView(week, firstPhoto, refs, exerciseBank)}${sheetsView(week, exerciseBank)}${protocolsView(tok)}${waitsView(tok)}`;
}
