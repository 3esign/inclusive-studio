// The visit dossier: one page per association visit, read work by work.
// Teacher, 24.10.2026: the visit is the attachment that opens the class, and it must be
// openable on its own — every frame, grouped under the work recognised in it, with the
// reading of that work and the trial it asks for next. The grouping is a human claim
// about the picture; the register carries it as `radovi` on the frame and it is never
// inferred from the order in which the frames were shot. A fingerprint proves the file,
// never what the file shows.

import { esc, tr, tx } from './core.js';

// Serbian counts the noun by the last digit: 31 kadar, 22 kadra, 25 kadrova. The badge
// helper in core.js pads to two digits, which is right for an ordinal and wrong here.
const plural = (n, one, few, many) => `${n} ${n % 10 === 1 && n % 100 !== 11 ? one : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? few : many}`;
const frames = n => tr(`${n} frame${n === 1 ? '' : 's'}`, plural(n, 'kadar', 'kadra', 'kadrova'));
import { validateVisit } from './poseta-core.js';
import { authorMarkup } from './galleries.js';

const srDate = iso => iso.split('-').reverse().join('.');

// One frame: the picture, what it shows for a reader who cannot see it, and the reading.
export function photoFigure(p) {
  return `<figure class="prototype-photo" id="${esc(p.id)}"><a href="${esc(p.src)}" aria-label="${tr('Open full image', 'Otvori celu sliku')}"><img src="${esc(p.src)}" width="${p.width}" height="${p.height}" alt="${esc(tx(p.alt))}" loading="lazy" decoding="async"></a><figcaption>${esc(tx(p.caption))}</figcaption></figure>`;
}

// Works recognised in a visit, newest week first, then by how many frames they hold.
export function visitWorkOrder(visit, works) {
  const count = id => visit.photos.filter(p => (p.radovi || []).includes(id)).length;
  return [...new Set(visit.photos.flatMap(p => p.radovi || []))]
    .sort((a, b) => (works.get(b)?.documentedWeek ?? 0) - (works.get(a)?.documentedWeek ?? 0) || count(b) - count(a) || a.localeCompare(b));
}

export function renderVisitDossier(visit, prototypes) {
  const problems = validateVisit(visit);
  if (problems.length) throw Error(problems.join('\n'));
  const works = new Map((prototypes?.galleries || []).map(g => [g.id, g]));
  const position = new Map(visit.photos.map((p, i) => [p.id, i + 1]));
  const framesOf = id => visit.photos.filter(p => (p.radovi || []).includes(id));
  const ordered = visitWorkOrder(visit, works);
  for (const id of ordered) if (!works.has(id)) throw Error(`Visit names a work that is not in the register: ${id}`);
  const byWork = new Map((visit.findings || []).filter(f => f.work).map(f => [f.work, f]));
  const across = (visit.findings || []).filter(f => !f.work);
  const frameRef = ids => ids.map(id => `<a href="#${esc(id)}">${position.get(id)}</a>`).join(' · ');

  const workSection = id => {
    const work = works.get(id), shots = framesOf(id), finding = byWork.get(id);
    const reading = finding ? `<div class="visit-reading"><h4>${esc(tx(finding.title))}</h4>
    <p><span class="visit-label">${tr('Seen', 'Viđeno')}</span>${esc(tx(finding.seen))}</p>
    <p><span class="visit-label">${tr('Next trial', 'Sledeća proba')}</span>${esc(tx(finding.next))}</p></div>` : '';
    return `<article class="visit-work" id="poseta-${esc(id)}">
  <header class="visit-work-head"><p class="eyebrow">${frames(shots.length)} · ${tr('Week', 'Nedelja')} ${work.documentedWeek} · <a href="galerija-${esc(id)}.html">${tr('the work’s own page', 'stranica rada')} ↗</a></p><h3>${esc(tx(work.title))}</h3>${authorMarkup(work, 'work-author', 'p')}</header>
  ${reading}
  <div class="visit-photos">${shots.map(photoFigure).join('')}</div>
</article>`;
  };

  const loose = visit.photos.filter(p => !(p.radovi || []).length);
  const participants = visit.participants.map(person =>
    `<li><span data-participant-name>${esc(person.name)}</span><span data-participant-number>${esc(person.studentNumber)}</span></li>`).join('');

  return `<div class="page-top flow-intro"><div><p class="eyebrow">${tr('Week', 'Nedelja')} ${visit.week} · ${esc(tx(visit.place))} · <time datetime="${esc(visit.occurredOn)}">${esc(srDate(visit.occurredOn))}.</time></p>
  <h1>${tr('The prototypes in the association users’ hands.', 'Prototipi u rukama korisnika udruženja.')}</h1></div>
  <p class="lede">${esc(tx(visit.summary))}</p></div>
<p class="notice">${tr('What a frame proves and what it does not: the fingerprint proves the file was not replaced; which work a frame shows is a human claim, made by looking. A photograph records a position and a grip — never duration, independent use, understanding of a rule, or a successful outcome.', 'Šta kadar dokazuje, a šta ne: otisak dokazuje da fajl nije zamenjen; koji se rad na kadru vidi jeste ljudska tvrdnja, doneta gledanjem. Fotografija beleži položaj i hvat — nikad trajanje, samostalnost, razumevanje pravila ni uspešan ishod.')}</p>
<section aria-labelledby="dossier-works-title"><div class="section-heading"><div><p class="eyebrow">${tr('Work by work', 'Rad po rad')}</p><h2 id="dossier-works-title">${tr('What the hands did', 'Šta su ruke radile')}</h2></div><p>${tr(`${ordered.length} works recognised across ${visit.photos.length} frames. Each stands with its frames, its reading and the trial it asks for next.`, `${plural(ordered.length, 'rad', 'rada', 'radova')} prepoznato je na ${frames(visit.photos.length)}. Svaki stoji sa svojim kadrovima, čitanjem i probom koju traži dalje.`)}</p></div>
  ${ordered.map(workSection).join('')}
</section>
${across.length ? `<section aria-labelledby="dossier-across-title"><div class="section-heading"><div><p class="eyebrow">${tr('Across all works', 'Kroz sve radove')}</p><h2 id="dossier-across-title">${tr('What repeats', 'Šta se ponavlja')}</h2></div><p>${tr('Findings that belong to no single work, and therefore to the set.', 'Nalazi koji ne pripadaju nijednom radu pojedinačno, pa pripadaju setu.')}</p></div>
  ${across.map(f => `<article class="visit-finding"><h3>${esc(tx(f.title))}</h3><p><span class="visit-label">${tr('Seen', 'Viđeno')}</span>${esc(tx(f.seen))}</p><p><span class="visit-label">${tr('Next trial', 'Sledeća proba')}</span>${esc(tx(f.next))}</p><p class="note">${tr('Frames', 'Kadrovi')}: ${frameRef(f.photoIds)}</p></article>`).join('')}
</section>` : ''}
${loose.length ? `<section aria-labelledby="dossier-scenes-title"><div class="section-heading"><div><p class="eyebrow">${tr('The day itself', 'Sam dan')}</p><h2 id="dossier-scenes-title">${tr('Frames with no work in them', 'Kadrovi bez rada')}</h2></div><p>${tr('They stay published: a sequence cut only where it suits the story is no longer evidence.', 'Ostaju objavljeni: niz presečen samo tamo gde priči odgovara više nije dokaz.')}</p></div>
  <div class="visit-photos">${loose.map(photoFigure).join('')}</div>
</section>` : ''}
<section aria-labelledby="dossier-people-title"><div class="section-heading"><div><p class="eyebrow">${tr('Who was there', 'Ko je bio tamo')}</p><h2 id="dossier-people-title">${tr('Students on the visit', 'Studenti na poseti')}</h2></div><p>${tr('Each name carries its own record in the journal, with every week it appears in.', 'Svako ime nosi svoj zapis u dnevniku, sa svim nedeljama u kojima se pojavljuje.')}</p></div>
  <ul class="visit-participants" data-visit-participants="${esc(visit.id)}" aria-label="${tr('Students on the visit', 'Studenti na poseti')}">${participants}</ul>
  <p class="help"><a href="dnevnik.html">${tr('The journal: every student, every week, everything linked', 'Dnevnik: svaki student, svaka nedelja, sve povezano')} ↗</a></p>
</section>
<aside class="prototype-context"><h2>${tr('Sources of this page', 'Izvori ove strane')}</h2><p>${esc(tx(visit.source.description))}</p><p>${tr('Attribution of each work stands in the register of works; who was on the visit stands in this visit’s register. Nothing on this page is retold by hand.', 'Autorstvo svakog rada stoji u registru radova; ko je bio na poseti stoji u registru ove posete. Ništa na ovoj strani ne prepričava se rukom.')}</p></aside>`;
}
