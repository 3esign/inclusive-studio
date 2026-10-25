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
    weekOf(found, g.documentedWeek).works.push({ kind: 'gallery', id: g.id, title: tx(g.title), photos: (g.photos || []).length });
  }
  for (const w of prototypes.cekaju || []) {
    const found = person(w.author?.name, w.author?.studentNumber);
    weekOf(found, w.documentedWeek).works.push({ kind: 'awaited', id: w.id, title: tx(w.title), photos: 0, reason: w.reason ? tx(w.reason) : '' });
  }
  for (const item of prototypes.items || []) {
    // The teacher's own examples are course material, not a student record.
    if (item.authorRole === 'teacher') continue;
    const found = person(item.author?.name, item.author?.studentNumber);
    weekOf(found, item.documentedWeek).works.push({ kind: 'item', id: item.id, title: item.title, photos: (item.photos || []).length });
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
    const bound = new Map();
    for (const photo of visit.photos || []) {
      for (const id of photo.radovi || []) bound.set(id, (bound.get(id) || 0) + 1);
    }
    for (const p of visit.participants || []) {
      const found = person(p.name, p.studentNumber);
      const mine = [...bound.entries()]
        .filter(([id]) => personKey(galleryById.get(id)?.author?.name, galleryById.get(id)?.author?.studentNumber) === found.key)
        .map(([id, count]) => ({ id, count, title: tx(galleryById.get(id).title) }));
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

function weekBlock(entry) {
  const row = entry.rows[0];
  const works = entry.works.map(work => {
    if (work.kind === 'awaited') return `<li class="dnevnik-awaited"><b>${esc(work.title)}</b> <span class="dnevnik-note">${tr('photographs still to come', 'fotografije tek stižu')}</span>${work.reason ? `<br><span class="dnevnik-note">${esc(work.reason)}</span>` : ''}</li>`;
    if (work.kind === 'item') return `<li><b>${esc(work.title)}</b> <small>${photoCount(work.photos)}</small> <a href="prototipovi.html#${esc(work.id)}">${tr('in the register', 'u registru')} ↗</a></li>`;
    return `<li><b>${esc(work.title)}</b> <small>${photoCount(work.photos)}</small> <a href="galerija-${esc(work.id)}.html">${tr('open the work', 'otvori rad')} ↗</a></li>`;
  }).join('');
  const listLink = row && row.page ? ` · <a href="${esc(row.page)}${row.kotva ? '#' + esc(row.kotva) : ''}">${tr('entry', 'zapis')} ${row.rb}</a>` : '';
  const note = row && row.napomena ? `<p class="dnevnik-note">${esc(row.napomena)}</p>` : '';
  const empty = !works ? `<p class="dnevnik-note">${tr('Attendance recorded, no photographed work this week.', 'Prisustvo zavedeno, bez fotografisanog rada te nedelje.')}</p>` : '';
  return `<div class="dnevnik-week"><p class="dnevnik-week-head">${tr('Week', 'Nedelja')} ${entry.week}${row && row.odrzan ? ` · <time datetime="${esc(row.odrzan)}">${esc(srDate(row.odrzan))}.</time>` : ''}${listLink}</p>${works ? `<ul class="dnevnik-works">${works}</ul>` : ''}${empty}${note}</div>`;
}

function visitBlock(v) {
  // A visit whose frames were never bound to works says nothing about any one person —
  // „no frame of theirs was recognised” would read as a finding where none was made.
  const works = v.works.length
    ? v.works.map(w => `<a href="${esc(v.page)}#poseta-${esc(w.id)}">${esc(w.title)} · ${plural(w.count, 'kadar', 'kadra', 'kadrova')}</a>`).join(' · ')
    : v.bound
      ? `<span class="dnevnik-note">${tr('present; no frame of their own work was recognised that day', 'prisutan/na; tog dana nije prepoznat nijedan kadar njihovog rada')}</span>`
      : `<span class="dnevnik-note">${tr('present; the frames of that visit are not tied to single works', 'prisutan/na; kadrovi te posete nisu vezani za pojedinačne radove')}</span>`;
  return `<div class="dnevnik-visit"><p class="dnevnik-week-head">${tr('Association visit', 'Poseta udruženju')} · <time datetime="${esc(v.occurredOn)}">${esc(srDate(v.occurredOn))}.</time> · <a href="${esc(v.page)}">${tr('the visit', 'poseta')} ↗</a></p><p>${works}</p></div>`;
}

export function renderDnevnik(people, { weeks = [] } = {}) {
  const withWork = people.filter(p => [...p.weeks.values()].some(w => w.works.some(x => x.kind !== 'awaited')));
  const photos = people.reduce((sum, p) => sum + [...p.weeks.values()].reduce((s, w) => s + w.works.reduce((a, x) => a + x.photos, 0), 0), 0);

  const card = p => {
    const weeksSorted = [...p.weeks.values()].sort((a, b) => b.week - a.week);
    const visits = [...p.visits].sort((a, b) => String(b.occurredOn).localeCompare(String(a.occurredOn)));
    const total = weeksSorted.reduce((s, w) => s + w.works.reduce((a, x) => a + x.photos, 0), 0);
    const spans = weeksSorted.map(w => w.week);
    const summary = tr(
      `${spans.length} week${spans.length === 1 ? '' : 's'} · ${total} photograph${total === 1 ? '' : 's'} · ${visits.length} visit${visits.length === 1 ? '' : 's'}`,
      `${plural(spans.length, 'nedelja', 'nedelje', 'nedelja')} · ${plural(total, 'fotografija', 'fotografije', 'fotografija')} · ${plural(visits.length, 'poseta', 'posete', 'poseta')}`);
    const conflict = p.problems.length ? `<p class="dnevnik-note dnevnik-open">${tr('The same name also stands under another student number', 'Isto ime stoji i pod drugim brojem indeksa')}: ${p.problems.map(esc).join(', ')} — ${tr('two records for one person; confirmed in class', 'dva zapisa za jednu osobu; potvrđuje se na času')}.</p>` : '';
    const noNumber = !p.studentNumber ? `<p class="dnevnik-note dnevnik-open">${tr('No student number recorded — the record stands on the name alone.', 'Broj indeksa nije zaveden — zapis stoji samo na imenu.')}</p>` : '';
    const joined = p.spojenoPoImenu ? `<p class="dnevnik-note">${tr('A list row without a student number was joined to this record by the name alone; the number comes from the register of works.', 'Red spiska bez broja indeksa spojen je sa ovim zapisom samo po imenu; broj dolazi iz registra radova.')}</p>` : '';
    return `<article class="dnevnik-student" id="dnevnik-${esc(p.key.replace(/[^a-z0-9]+/gi, '-').toLowerCase())}">
  <header data-dnevnik-student="${esc(p.studentNumber || p.name || '')}"><h3><span data-author-name>${esc(p.name || '—')}</span><span data-author-number>${esc(p.studentNumber || '—')}</span></h3></header>
  <p class="dnevnik-summary">${summary}</p>${conflict}${noNumber}${joined}
  ${weeksSorted.map(weekBlock).join('')}${visits.map(visitBlock).join('')}
</article>`;
  };

  return `<div class="page-top flow-intro"><div><p class="eyebrow">${tr('Journal', 'Dnevnik')}</p>
  <h1>${tr('Every name, and everything that stands beside it.', 'Svako ime, i sve što stoji uz njega.')}</h1></div>
  <p class="lede">${tr(`${people.length} people appear in the registers of this course: ${withWork.length} with a photographed work, ${photos} photographs in all. Each record joins the class lists, the register of works and the association visits — open a name and the whole history stands under it.`, `${number(people.length)} osoba pojavljuje se u registrima ovog predmeta: ${number(withWork.length)} sa fotografisanim radom, ukupno ${number(photos)} fotografija. Svaki zapis spaja spiskove časova, registar radova i posete udruženju — otvoriš ime i ispod njega stoji cela istorija.`)}</p></div>
<p class="notice">${tr('This is not a roll-call. Attendance at the lecture has not been kept, so the journal says who appears in a register — on a class list, in the register of works, on a visit — never who was in the room. If your record is wrong or missing, say so in class.', 'Ovo nije prozivka. Evidencija prisustva na predavanju nije vođena, pa dnevnik govori ko se pojavljuje u registru — na spisku časa, u registru radova, na poseti — a ne ko je bio u sali. Ako je tvoj zapis pogrešan ili ga nema, javi na času.')}</p>
<section aria-labelledby="dnevnik-list-title"><div class="section-heading"><div><p class="eyebrow">${tr('By student number', 'Po broju indeksa')}</p><h2 id="dnevnik-list-title">${tr('The records', 'Zapisi')}</h2></div><p>${tr(`Weeks covered: ${weeks.join(', ')}. Each record is newest week first.`, `Obuhvaćene nedelje: ${weeks.join(', ')}. Svaki zapis ide od najnovije nedelje unazad.`)}</p></div>
  <div class="dnevnik-list">${people.map(card).join('')}</div>
</section>
<aside class="prototype-context"><h2>${tr('Sources of this page', 'Izvori ove strane')}</h2><p>${tr('The journal creates no record of its own. It joins the class lists (data/cas-NN/spisak.json), the register of works (data/prototipovi.json) and the visit registers (data/poseta-*.json) on the student number; each of those carries its own source and date.', 'Dnevnik ne stvara nijedan svoj zapis. On spaja spiskove časova (data/cas-NN/spisak.json), registar radova (data/prototipovi.json) i registre poseta (data/poseta-*.json) po broju indeksa; svaki od njih nosi svoj izvor i datum.')}</p></aside>`;
}
