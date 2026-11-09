// The visit dossier: one page per association visit, told as a chronological event story
// with superintelligence observations on how hands, space and prototypes met.

import { esc, tr, tx } from './core.js';
import { validateVisit } from './poseta-core.js';
import { authorMarkup } from './galleries.js';

// Serbian counts the noun by the last digit: 31 kadar, 22 kadra, 25 kadrova.
const plural = (n, one, few, many) => `${n} ${n % 10 === 1 && n % 100 !== 11 ? one : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? few : many}`;
const frames = n => tr(`${n} frame${n === 1 ? '' : 's'}`, plural(n, 'kadar', 'kadra', 'kadrova'));

const srDate = iso => iso.split('-').reverse().join('.');

// One frame: the picture, what it shows for a reader who cannot see it, and the story caption.
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
  const photoById = new Map(visit.photos.map(p => [p.id, p]));
  const ordered = visitWorkOrder(visit, works);
  for (const id of ordered) if (!works.has(id)) throw Error(`Visit names a work that is not in the register: ${id}`);

  const byWork = new Map((visit.findings || []).filter(f => f.work).map(f => [f.work, f]));
  const frameRef = ids => ids.map(id => `<a href="#${esc(id)}">${position.get(id)}</a>`).join(' · ');

  // Place each work commentary (and each scene-focused commentary whose frames are consecutive)
  // right at the culminating frame of its moment in the chronological story.
  const isConsecutive = ids => {
    if (!ids || ids.length <= 1) return true;
    const nums = ids.map(id => position.get(id)).filter(Boolean).sort((a, b) => a - b);
    return nums.every((n, i) => i === 0 || n === nums[i - 1] + 1);
  };
  const targetFrameId = f => {
    if (f.work) {
      const primary = f.photoIds.filter(id => (photoById.get(id)?.radovi || [])[0] === f.work);
      return (primary.length ? primary : f.photoIds).at(-1);
    }
    return isConsecutive(f.photoIds) ? f.photoIds.at(-1) : null;
  };

  const findingsByFrame = new Map();
  const across = [];
  for (const f of visit.findings || []) {
    const target = targetFrameId(f);
    if (target) {
      findingsByFrame.set(target, [...(findingsByFrame.get(target) || []), f]);
    } else {
      across.push(f);
    }
  }

  const anchored = new Set();
  const storyEntry = (p, i) => {
    const step = String(i + 1).padStart(2, '0');
    const frameWorks = (p.radovi || []).map(id => works.get(id)).filter(Boolean);
    const chips = frameWorks.length
      ? `<div class="visit-frame-tags">${frameWorks.map(w => {
          const fallbackAnchor = !byWork.has(w.id) && !anchored.has(w.id) ? (anchored.add(w.id), ` id="poseta-${esc(w.id)}"`) : '';
          const fallbackAuthor = !byWork.has(w.id) ? ` ${authorMarkup(w, 'work-author', 'small')}` : '';
          return `<span class="visit-work-chip"${fallbackAnchor}><a href="galerija-${esc(w.id)}.html">${esc(tx(w.title))} ↗</a>${fallbackAuthor}</span>`;
        }).join('')}</div>`
      : '';
    const notes = (findingsByFrame.get(p.id) || []).map(f => {
      const work = f.work ? works.get(f.work) : null;
      const anchorAttr = work && !anchored.has(work.id) ? (anchored.add(work.id), ` id="poseta-${esc(work.id)}"`) : '';
      const head = work
        ? `<header class="visit-commentary-head"><p class="eyebrow">${tr('Superintelligence commentary', 'Komentar superinteligencije')} · <a href="galerija-${esc(work.id)}.html">${esc(tx(work.title))} ↗</a></p><h3>${esc(tx(f.title))}</h3>${authorMarkup(work, 'work-author', 'p')}</header>`
        : `<header class="visit-commentary-head"><p class="eyebrow">${tr('Superintelligence commentary', 'Komentar superinteligencije')}</p><h3>${esc(tx(f.title))}</h3></header>`;
      const refs = f.photoIds.length > 1
        ? `<p class="visit-commentary-refs">${tr('Frames in the story', 'Kadrovi u priči')}: ${frameRef(f.photoIds)}</p>`
        : '';
      return `<aside class="visit-commentary"${anchorAttr}>${head}<p><span class="visit-label">${tr('Seen', 'Viđeno')}</span>${esc(tx(f.seen))}</p><p><span class="visit-label">${tr('Next trial', 'Sledeća proba')}</span>${esc(tx(f.next))}</p>${refs}</aside>`;
    }).join('');

    return `<article class="visit-story-entry">
  <div class="visit-story-step"><span class="visit-step-num">${step}</span></div>
  <div class="visit-story-body">
    ${photoFigure(p)}
    ${chips}
    ${notes}
  </div>
</article>`;
  };

  const participants = visit.participants.map(person =>
    `<li><span data-participant-name>${esc(person.name)}</span><span data-participant-number>${esc(person.studentNumber)}</span></li>`).join('');

  return `<div class="page-top flow-intro"><div><p class="eyebrow">${tr('Week', 'Nedelja')} ${visit.week} · ${esc(tx(visit.place))} · <time datetime="${esc(visit.occurredOn)}">${esc(srDate(visit.occurredOn))}.</time></p>
  <h1>${tr('Story from the association visit.', 'Priča sa posete udruženju.')}</h1></div>
  <p class="lede">${esc(tx(visit.summary))}</p></div>
<section aria-labelledby="dossier-works-title"><div class="section-heading"><div><p class="eyebrow">${tr('Event blog', 'Događaj kroz slike')}</p><h2 id="dossier-works-title">${tr('How the visit unfolded', 'Tok posete i zapažanja')}</h2></div><p>${tr(`${visit.photos.length} frames in chronological order, with ${ordered.length} recognised works and observations on what happened in the users’ hands.`, `${frames(visit.photos.length)} redom kojim se poseta odvijala, sa ${plural(ordered.length, 'prepoznatim radom', 'prepoznata rada', 'prepoznatih radova')} i zapažanjima o onome što se dogodilo u rukama korisnika.`)}</p></div>
  <div class="visit-story">${visit.photos.map(storyEntry).join('')}</div>
</section>
${across.length ? `<section aria-labelledby="dossier-across-title"><div class="section-heading"><div><p class="eyebrow">${tr('Across the whole visit', 'Kroz celu posetu')}</p><h2 id="dossier-across-title">${tr('What repeats across the event', 'Šta se ponavlja kroz događaj')}</h2></div><p>${tr('Patterns observed across multiple scenes and works.', 'Obrasci uočeni kroz više scena i radova.')}</p></div>
  ${across.map(f => `<article class="visit-finding"><h3>${esc(tx(f.title))}</h3><p><span class="visit-label">${tr('Seen', 'Viđeno')}</span>${esc(tx(f.seen))}</p><p><span class="visit-label">${tr('Next trial', 'Sledeća proba')}</span>${esc(tx(f.next))}</p><p class="note">${tr('Frames', 'Kadrovi')}: ${frameRef(f.photoIds)}</p></article>`).join('')}
</section>` : ''}
<section aria-labelledby="dossier-people-title"><div class="section-heading"><div><p class="eyebrow">${tr('Who was there', 'Ko je bio tamo')}</p><h2 id="dossier-people-title">${tr('Students on the visit', 'Studenti na poseti')}</h2></div><p>${tr('Each name carries its own record in the journal, with every week it appears in.', 'Svako ime nosi svoj zapis u dnevniku, sa svim nedeljama u kojima se pojavljuje.')}</p></div>
  <ul class="visit-participants" data-visit-participants="${esc(visit.id)}" aria-label="${tr('Students on the visit', 'Studenti na poseti')}">${participants}</ul>
  <p class="help"><a href="dnevnik.html">${tr('The journal: every student, every week, everything linked', 'Dnevnik: svaki student, svaka nedelja, sve povezano')} ↗</a></p>
</section>`;
}
