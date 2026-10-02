// One renderer for the week's material, used by the working week, the lecture and the editor preview.
// References to labs and exercises are resolved by loading those modules only when a block needs them.

import { esc, tr, tx, lang, arrow } from './core.js';
import { safeHref } from './material.js';

// Loads lab-core / exercises only if the week actually points at one. Nothing else pays for it.
export async function resolveRefs(blocks) {
  const map = { lab: {}, exercise: {} };
  const list = Array.isArray(blocks) ? blocks : [];
  if (list.some(block => block.kind === 'lab')) {
    try {
      const { labById } = await import('./lab-core.js');
      for (const block of list.filter(b => b.kind === 'lab')) {
        const lab = labById(block.ref);
        if (lab) map.lab[block.ref] = { title: lab.title, aim: lab.aim, minutes: lab.minutes, href: 'laboratorija.html?lab=' + encodeURIComponent(lab.id) };
      }
    } catch { /* the reference degrades to a plain link */ }
  }
  if (list.some(block => block.kind === 'exercise')) {
    try {
      const { exercises } = await import('./exercises.js');
      for (const block of list.filter(b => b.kind === 'exercise')) {
        const exercise = exercises.find(item => item.id === block.ref);
        if (exercise) map.exercise[block.ref] = { title: exercise.title, aim: exercise.task, href: 'vezbe.html#ex-' + encodeURIComponent(exercise.id), week: exercise.week };
      }
    } catch { /* same */ }
  }
  return map;
}

const text = value => esc(tx(value));

export function renderBlock(block, refs = { lab: {}, exercise: {} }) {
  switch (block.kind) {
    case 'heading':
      return `<h2 class="material-heading">${text(block.text)}</h2>`;
    case 'text':
      return `<p>${text(block.text)}</p>`;
    case 'list':
      return `<ul class="material-list">${block.items.map(item => `<li>${text(item)}</li>`).join('')}</ul>`;
    case 'question':
      return `<div class="material-questions"><p class="meta-label">${tr('Questions for the room', 'Pitanja za salu')}</p><ol>${block.items.map(item => `<li>${text(item)}</li>`).join('')}</ol></div>`;
    case 'quote':
      return `<blockquote class="material-quote"><p>${text(block.text)}</p><cite>${esc(block.source || '')}</cite></blockquote>`;
    case 'measure':
      return `<dl class="material-measure"><dt>${text(block.text)}</dt><dd class="value">${esc(block.value)}</dd><dd class="instrument">${tr('Instrument', 'Instrument')}: ${text(block.instrument)}</dd></dl>`;
    case 'image': {
      const src = safeHref(block.src);
      if (!src) return '';
      return `<figure class="material-figure"><img src="${esc(src)}" alt="${text(block.alt)}" loading="lazy" decoding="async">${block.caption ? `<figcaption>${text(block.caption)}</figcaption>` : ''}</figure>`;
    }
    case 'link': {
      const href = safeHref(block.href);
      if (!href) return '';
      const external = /^https?:/i.test(href);
      return `<p class="material-link"><a href="${esc(href)}"${external ? ' target="_blank" rel="noopener"' : ''}>${text(block.text)}${external ? ' ' + arrow : ''}</a></p>`;
    }
    case 'file': {
      const href = safeHref(block.href);
      if (!href) return '';
      return `<p class="material-file"><a href="${esc(href)}" download>${text(block.text)}${block.bytes ? ` <span class="muted small">(${Math.round(block.bytes / 1024)} kB)</span>` : ''}</a></p>`;
    }
    case 'lab': {
      const lab = refs.lab[block.ref];
      const href = lab ? lab.href : 'laboratorija.html?lab=' + encodeURIComponent(block.ref);
      return `<a class="material-card lab" href="${esc(href)}"><span class="meta-label">${tr('Laboratory', 'Laboratorija')}${lab ? ` · ${lab.minutes} ${tr('min', 'min')}` : ''}</span><strong>${lab ? text(lab.title) : esc(block.ref)}</strong><span>${block.text ? text(block.text) : lab ? text(lab.aim) : ''}</span></a>`;
    }
    case 'exercise': {
      const exercise = refs.exercise[block.ref];
      const href = exercise ? exercise.href : 'vezbe.html';
      // Two exercises have a page of their own; the rest open in the exercise bank.
      const own = { 'toy-for-coordination': 'igracka.html', 'app-for-one': 'zadatak.html' }[block.ref];
      return `<a class="material-card exercise" href="${own || esc(href)}"><span class="meta-label">${tr('Task', 'Zadatak')}${exercise ? ` · ${tr('week', 'nedelja')} ${exercise.week}` : ''}</span><strong>${exercise ? text(exercise.title) : esc(block.ref)}</strong><span>${block.text ? text(block.text) : exercise ? text(exercise.aim) : ''}</span></a>`;
    }
    case 'decision':
      return `<div class="material-decision"><p class="meta-label">${tr('Recorded today', 'Danas se upisuje')}</p><p>${text(block.text)}</p></div>`;
    default:
      return '';
  }
}

export function renderBlocks(blocks, refs) {
  return (Array.isArray(blocks) ? blocks : []).map(block => renderBlock(block, refs)).join('');
}

// The week header, shared by the working week and the lecture.
export function weekLine(week) {
  const parts = [`${tr('Week', 'Nedelja')} ${week.n}`];
  if (week.date) {
    const date = new Date(week.date + 'T00:00');
    const formatted = date.toLocaleDateString(lang === 'sr' ? 'sr-RS' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    parts.push(week.dateStatus === 'confirmed' ? formatted : `${formatted} — ${tr('proposed', 'predlog')}`);
  } else parts.push(tr('the teaching date is not confirmed', 'termin nastave nije potvrđen'));
  if (week.state === 'draft') parts.push(tr('draft', 'nacrt'));
  return parts.join(' · ');
}
