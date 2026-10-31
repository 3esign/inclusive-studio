// The journal: one record per student, joined from the registers that already exist.
// Teacher, 24.10.2026: opening a work or a student must show the whole history — every
// week they appear in, every photographed work, every association visit, and what is
// still awaited. Nothing here is a new claim about a person: the journal only joins
// records that each already carry their own source, and it joins them on the student
// number. Attendance at the lecture is not kept, so this is not a roll-call: it says who
// appears in a register, never who was in the room.
// Names stand only inside the marked row of a person who exists in a register — the same
// field-level rule the class lists and the visit rosters follow.

import { esc, tr, tx, number } from './core.js';

// One number written two ways is one person: some registers write the year in full, others
// shorten it. The journal keys on the short form and keeps whichever form it was given.
export const indexKey = value => {
  if (typeof value !== 'string') return null;
  const m = value.trim().match(/^(\d{1,4})\/(\d{2})(\d{2})?$/);
  return m ? `${m[1]}/${m[3] || m[2]}` : null;
};
const personKey = (name, studentNumber) => indexKey(studentNumber) || `ime:${String(name || '').trim().toLowerCase()}`;
const srDate = iso => iso.split('-').reverse().join('.');

const thumbs = photos => (photos || []).filter(p => p && p.src).map(p => ({ src: p.src, width: p.width || null, height: p.height || null, alt: p.alt ? tx(p.alt) : '' }));

/* ---------- joining ---------- */

export function buildJournal({ lists = [], visits = [], prototypes = {} } = {}) {
  const people = new Map();
  // The latest register that names a person wins the spelling: a year written in full and
  // the same year shortened are one number, and a surname-first and a given-name-first
  // entry are one name. Neither is a conflict — the registers are read in the order the
  // manifest lists them, newest last.
  const person = (name, studentNumber, authoritative = false) => {
    const key = personKey(name, studentNumber);
    if (!people.has(key)) people.set(key, { key, name: name || null, studentNumber: studentNumber || null, weeks: new Map(), visits: [], problems: [] });
    const found = people.get(key);
    if (name && (authoritative || !found.name)) found.name = name;
    if (studentNumber && (authoritative || !found.studentNumber)) found.studentNumber = studentNumber;
    return found;
  };
  const weekOf = (found, week) => {
    if (!found.weeks.has(week)) found.weeks.set(week, { week, works: [], rows: [] });
    return found.weeks.get(week);
  };

  const galleryById = new Map((prototypes.galleries || []).map(g => [g.id, g]));
  // Works first: the register of works is the only place authorship is established.
  for (const g of prototypes.galleries || []) {
    const found = person(g.author?.name, g.author?.studentNumber);
    weekOf(found, g.documentedWeek).works.push({ kind: 'gallery', id: g.id, title: tx(g.title), photos: (g.photos || []).length, prilozi: thumbs(g.photos) });
  }
  for (const w of prototypes.cekaju || []) {
    const found = person(w.author?.name, w.author?.studentNumber);
    weekOf(found, w.documentedWeek).works.push({ kind: 'awaited', id: w.id, title: tx(w.title), photos: 0, reason: w.reason ? tx(w.reason) : '' });
  }
  for (const item of prototypes.items || []) {
    // The teacher's own examples are course material, not a student record.
    if (item.authorRole === 'teacher') continue;
    const found = person(item.author?.name, item.author?.studentNumber);
    weekOf(found, item.documentedWeek).works.push({ kind: 'item', id: item.id, title: tx(item.title), photos: (item.photos || []).length, prilozi: thumbs(item.photos) });
  }
  // Class lists add the row number a student looks for, and the note written beside it.
  for (const list of lists) {
    for (const row of list.radovi || []) {
      if (!row.ime && !row.indeks) continue;
      const found = person(row.ime, row.indeks, true);
      const week = weekOf(found, list.nedelja ?? 3);
      week.rows.push({ list: list.id, cas: list.cas, page: list.page, kotva: list.kotva || '', rb: row.rb, rad: row.rad, slike: row.slike, ceka: row.ceka === true, napomena: row.napomena ? tx(row.napomena) : '', galerija: row.galerija || null, odrzan: list.odrzan });
    }
  }
  // Visits: who went, and how many frames of their own work came back from that day.
  for (const visit of visits) {
    const bound = new Map(), framesOf = new Map();
    for (const photo of visit.photos || []) {
      for (const id of photo.radovi || []) {
        bound.set(id, (bound.get(id) || 0) + 1);
        framesOf.set(id, [...(framesOf.get(id) || []), photo]);
      }
    }
    for (const p of visit.participants || []) {
      const found = person(p.name, p.studentNumber);
      const mine = [...bound.entries()]
        .filter(([id]) => personKey(galleryById.get(id)?.author?.name, galleryById.get(id)?.author?.studentNumber) === found.key)
        .map(([id, count]) => ({ id, count, title: tx(galleryById.get(id).title), prilozi: thumbs(framesOf.get(id)) }));
      found.visits.push({ id: visit.id, week: visit.week, occurredOn: visit.occurredOn, place: tx(visit.place), page: visit.page, works: mine, bound: bound.size > 0 });
    }
  }
  const byName = new Map();
  for (const found of people.values()) {
    const name = String(found.name || '').trim().toLowerCase();
    if (!name) continue;
    byName.set(name, [...(byName.get(name) || []), found]);
  }
  // A row that carries a name but no number is folded into the one numbered record of
  // that exact name. This is a stated inference, not a silent one: the record says the
  // number comes from the register of works, and it is made only when the name is unique.
  for (const group of byName.values()) {
    const numbered = group.filter(p => p.studentNumber);
    const unnumbered = group.filter(p => !p.studentNumber);
    if (numbered.length !== 1 || !unnumbered.length) continue;
    const target = numbered[0];
    for (const loose of unnumbered) {
      for (const [week, entry] of loose.weeks) {
        const into = weekOf(target, week);
        into.works.push(...entry.works); into.rows.push(...entry.rows);
      }
      target.visits.push(...loose.visits);
      target.spojenoPoImenu = true;
      people.delete(loose.key);
    }
  }
  // The real conflict the join can see: one name standing under two different numbers.
  // That is two records for one person, and only the teacher can close it.
  for (const group of byName.values()) {
    const live = group.filter(p => people.has(p.key));
    if (live.length < 2) continue;
    for (const found of live) found.problems = live.filter(other => other !== found).map(other => other.studentNumber || '—');
  }
  // Order by student number, the way a student looks for their own row.
  const rank = p => {
    const key = indexKey(p.studentNumber);
    if (!key) return [1, 0, 0];
    const [n, y] = key.split('/').map(Number);
    return [0, y, n];
  };
  return [...people.values()].sort((a, b) => {
    const x = rank(a), y = rank(b);
    return x[0] - y[0] || x[1] - y[1] || x[2] - y[2] || String(a.name).localeCompare(String(b.name), 'sr');
  });
}

/* ---------- rendering ---------- */

// Serbian counts the noun by the last digit: 21 nedelja, 22 nedelje, 25 nedelja.
const plural = (n, one, few, many) => `${n} ${n % 10 === 1 && n % 100 !== 11 ? one : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? few : many}`;
const photoCount = n => tr(`${n} photo${n === 1 ? '' : 's'}`, plural(n, 'fotografija', 'fotografije', 'fotografija'));

// One format for every record: a dated head, the work, its attachments. The registers keep
// their notes and reasons; the record shows only what was done and where it stands.
const strip = (prilozi, href) => prilozi && prilozi.length
  ? `<div class="dnevnik-prilozi">${prilozi.map(p => `<a href="${esc(href)}"><img src="${esc(p.src)}" alt="${esc(p.alt)}" loading="lazy" decoding="async"${p.width && p.height ? ` width="${p.width}" height="${p.height}"` : ''}></a>`).join('')}</div>`
  : '';

function weekBlock(entry) {
  const row = entry.rows[0];
  const works = entry.works.map(work => {
    if (work.kind === 'awaited') return `<li class="dnevnik-awaited"><b>${esc(work.title)}</b> <small>${tr('no photograph yet', 'bez fotografije')}</small></li>`;
    const href = work.kind === 'item' ? `prototipovi.html#${work.id}` : `galerija-${work.id}.html`;
    return `<li><b>${esc(work.title)}</b> <small>${photoCount(work.photos)}</small> <a href="${esc(href)}">${tr('open', 'otvori')} ↗</a>${strip(work.prilozi, href)}</li>`;
  }).join('');
  const listLink = row && row.page ? ` · <a href="${esc(row.page)}${row.kotva ? '#' + esc(row.kotva) : ''}">${tr('entry', 'zapis')} ${row.rb}</a>` : '';
  const date = row && row.odrzan ? `<time datetime="${esc(row.odrzan)}">${esc(srDate(row.odrzan))}.</time> · ` : '';
  return `<li class="dnevnik-entry"><p class="dnevnik-week-head">${date}${tr('Class', 'Čas')} · ${tr('week', 'nedelja')} ${entry.week}${listLink}</p>${works ? `<ul class="dnevnik-works">${works}</ul>` : `<p class="dnevnik-note">${tr('no work', 'bez rada')}</p>`}</li>`;
}

function visitBlock(v) {
  const works = v.works.map(w => `<li><b>${esc(w.title)}</b> <small>${plural(w.count, 'kadar', 'kadra', 'kadrova')}</small> <a href="${esc(v.page)}#poseta-${esc(w.id)}">${tr('open', 'otvori')} ↗</a>${strip(w.prilozi, `${v.page}#poseta-${w.id}`)}</li>`).join('');
  return `<li class="dnevnik-entry dnevnik-visit"><p class="dnevnik-week-head"><time datetime="${esc(v.occurredOn)}">${esc(srDate(v.occurredOn))}.</time> · ${tr('Association visit', 'Poseta udruženju')} · <a href="${esc(v.page)}">${tr('the visit', 'poseta')} ↗</a></p>${works ? `<ul class="dnevnik-works">${works}</ul>` : ''}</li>`;
}

export function renderDnevnik(people, { weeks = [] } = {}) {
  const withWork = people.filter(p => [...p.weeks.values()].some(w => w.works.some(x => x.kind !== 'awaited')));
  const photos = people.reduce((sum, p) => sum + [...p.weeks.values()].reduce((s, w) => s + w.works.reduce((a, x) => a + x.photos, 0), 0), 0);

  const card = p => {
    const weeksSorted = [...p.weeks.values()].sort((a, b) => b.week - a.week);
    const visits = [...p.visits];
    // A visit is a week of work too: the count joins class weeks and visit weeks, photos include recognised visit frames.
    const weekCount = new Set([...weeksSorted.map(w => w.week), ...visits.map(v => v.week).filter(w => w != null)]).size;
    const total = weeksSorted.reduce((s, w) => s + w.works.reduce((a, x) => a + x.photos, 0), 0)
      + visits.reduce((s, v) => s + v.works.reduce((a, w) => a + (w.count || 0), 0), 0);
    const summary = tr(
      `${weekCount} week${weekCount === 1 ? '' : 's'} · ${total} photograph${total === 1 ? '' : 's'} · ${visits.length} visit${visits.length === 1 ? '' : 's'}`,
      `${plural(weekCount, 'nedelja', 'nedelje', 'nedelja')} · ${plural(total, 'fotografija', 'fotografije', 'fotografija')} · ${plural(visits.length, 'poseta', 'posete', 'poseta')}`);
    // One line of time: newest on top. The class of a week stands above that week's visit.
    const timeline = [
      ...weeksSorted.map(w => ({ week: w.week, order: 0, date: w.rows[0]?.odrzan || '', html: weekBlock(w) })),
      ...visits.map(v => ({ week: v.week ?? 0, order: 1, date: v.occurredOn || '', html: visitBlock(v) }))
    ].sort((a, b) => b.week - a.week || String(b.date).localeCompare(String(a.date)) || a.order - b.order);
    const open = [
      p.problems.length ? `${tr('also under student number', 'isto ime i pod brojem')} ${p.problems.map(esc).join(', ')}` : '',
      !p.studentNumber ? tr('student number not recorded', 'broj indeksa nije zaveden') : ''
    ].filter(Boolean);
    const id = `dnevnik-${p.key.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`;
    return `<details class="dnevnik-student" id="${esc(id)}">
  <summary><header data-dnevnik-student="${esc(p.studentNumber || p.name || '')}"><h3><span data-author-name>${esc(p.name || '—')}</span><span data-author-number>${esc(p.studentNumber || '—')}</span></h3></header>
  <span class="dnevnik-summary">${summary}</span>${open.length ? `<span class="dnevnik-note dnevnik-open">${open.join(' · ')}</span>` : ''}</summary>
  <ol class="dnevnik-timeline">${timeline.map(e => e.html).join('')}</ol>
</details>`;
  };

  return `<div class="page-top flow-intro"><div><p class="eyebrow">${tr('Journal', 'Dnevnik')}</p>
  <h1>${tr('Every name, and everything that stands beside it.', 'Svako ime, i sve što stoji uz njega.')}</h1></div>
  <p class="lede">${tr(`${people.length} people appear in the registers of this course: ${withWork.length} with a photographed work, ${photos} photographs in all. Each record joins the class lists, the register of works and the association visits — open a name and the whole history stands under it.`, `${number(people.length)} osoba pojavljuje se u registrima ovog predmeta: ${number(withWork.length)} sa fotografisanim radom, ukupno ${number(photos)} fotografija. Svaki zapis spaja spiskove časova, registar radova i posete udruženju — otvoriš ime i ispod njega stoji cela istorija.`)}</p></div>
<p class="notice">${tr('This is not a roll-call. Attendance at the lecture has not been kept, so the journal says who appears in a register — on a class list, in the register of works, on a visit — never who was in the room. Association visits are the exception: their lists are attendance and count as a week. If your record is wrong or missing, say so in class.', 'Ovo nije prozivka. Evidencija prisustva na predavanju nije vođena, pa dnevnik govori ko se pojavljuje u registru — na spisku časa, u registru radova, na poseti — a ne ko je bio u sali. Izuzetak su posete udruženju: njihov spisak je evidencija prisustva i računa se kao nedelja. Ako je tvoj zapis pogrešan ili ga nema, javi na času.')}</p>
<section aria-labelledby="dnevnik-list-title"><div class="section-heading"><div><p class="eyebrow">${tr('By student number', 'Po broju indeksa')}</p><h2 id="dnevnik-list-title">${tr('The records', 'Zapisi')}</h2></div><p>${tr(`Weeks covered: ${weeks.join(', ')}. Open a name for the whole record, newest first.`, `Obuhvaćene nedelje: ${weeks.join(', ')}. Klik na ime otvara ceo dosije, od najnovijeg ka starijem.`)}</p></div>
  <div class="dnevnik-list">${people.map(card).join('')}</div>
</section>
<aside class="prototype-context"><h2>${tr('Sources of this page', 'Izvori ove strane')}</h2><p>${tr('The journal creates no record of its own. It joins the class lists (data/cas-NN/spisak.json), the register of works (data/prototipovi.json) and the visit registers (data/poseta-*.json) on the student number; each of those carries its own source and date.', 'Dnevnik ne stvara nijedan svoj zapis. On spaja spiskove časova (data/cas-NN/spisak.json), registar radova (data/prototipovi.json) i registre poseta (data/poseta-*.json) po broju indeksa; svaki od njih nosi svoj izvor i datum.')}</p></aside>`;
}
