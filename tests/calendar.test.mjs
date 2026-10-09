import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// The website is dependency-free and has no package.json; load its browser ES module directly.
const source = await readFile(new URL('../assets/calendar.js', import.meta.url), 'utf8');
const { validateSchedule, formatDate, createICS, teachingDayText } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const event = (overrides = {}) => ({
  id: 'studio-1', stage: 1, title: 'Observe a shared place',
  start: '2026-10-01T10:00', end: '2026-10-01T12:00', location: '',
  status: 'confirmed', kind: 'studio', ...overrides,
});
const schedule = (events = [], overrides = {}) => ({
  status: 'unconfirmed', institution: '', course: '', term: '', timezone: 'Europe/Belgrade', events, ...overrides,
});
const unfold = text => text.replace(/\r\n /g, '');

test('the published schedule names the course but invents no dates', async () => {
  const data = JSON.parse(await readFile(new URL('../data/schedule.json', import.meta.url), 'utf8'));
  // Timed events remain unavailable; a teacher-confirmed Friday rhythm is distinct.
  assert.equal(data.status, 'unconfirmed');
  assert.equal(data.timezone, 'Europe/Belgrade');
  assert.match(data.institution, /Union . Nikola Tesla/);
  assert.match(data.course, /Principi univerzalnog dizajna/);
  assert.ok(data.term.startsWith('2026/2027'), data.term);
  assert.deepEqual(data.events, []);
  assert.deepEqual(validateSchedule(data), []);
  assert.equal(data.regularTeachingDay.weekday, 5);
  assert.match(teachingDayText(data, 'sr'), /petkom/);
  assert.match(teachingDayText(data, 'en'), /Fridays/);
});

test('a regular teaching day needs a source and never manufactures timed events for export', () => {
  for (const weekday of [0, 8, 2.5, '5']) assert.ok(validateSchedule(schedule([], {regularTeachingDay:{weekday, source:'Teacher'}})).length);
  assert.ok(validateSchedule(schedule([], {regularTeachingDay:{weekday:5, source:''}})).length);
  const data = schedule([], {regularTeachingDay:{weekday:5, source:'Teacher'}});
  assert.deepEqual(validateSchedule(data), []);
  assert.doesNotMatch(createICS(data.events), /BEGIN:VEVENT/);
  assert.equal(teachingDayText(schedule()), '');
});

test('valid leap days and real month lengths are enforced', () => {
  assert.deepEqual(validateSchedule(schedule([event({ start: '2028-02-29T10:00', end: '2028-02-29T11:00' })])), []);
  for (const value of ['2026-02-29T10:00', '2100-02-29T10:00', '2026-04-31T10:00', '2026-13-01T10:00', '2026-00-01T10:00', '2026-01-00T10:00', '2026-01-01T24:00', '2026-01-01T10:60', '2026-1-01T10:00', '2026-01-01T10:00Z', '0000-01-01T10:00']) {
    assert.ok(validateSchedule(schedule([event({ start: value })])).some(error => error.includes('start:')), value);
  }
});

test('durations, identity, stages and controlled values are validated', () => {
  assert.ok(validateSchedule(schedule([event(), event()])).some(error => error.includes('duplicate')));
  for (const override of [
    { end: '2026-10-01T10:00' }, { end: '2026-09-30T10:00' }, { stage: 0 }, { stage: 7 }, { stage: 1.5 },
    { kind: 'lecture' }, { status: 'cancelled' }, { id: '' }, { id: 'bad\nid' }, { title: '  ' }, { title: '\0' }, { location: null },
  ]) assert.ok(validateSchedule(schedule([event(override)])).length, JSON.stringify(override));
  assert.ok(validateSchedule(schedule([], { timezone: 'MadeUp/City' })).length);
  assert.ok(validateSchedule(schedule([], { timezone: '+02:00' })).length);
  assert.ok(validateSchedule(null).length);
  assert.ok(validateSchedule(schedule(null)).length);
  assert.ok(validateSchedule(schedule([null])).length);
});

test('winter and summer events export with their real Belgrade UTC offsets', () => {
  const winter = createICS([event({ start: '2026-01-15T10:00', end: '2026-01-15T12:00' })]);
  assert.match(winter, /DTSTART:20260115T090000Z\r\n/);
  assert.match(winter, /DTEND:20260115T110000Z\r\n/);
  const summer = createICS([event({ start: '2026-07-15T10:00', end: '2026-07-15T12:00' })]);
  assert.match(summer, /DTSTART:20260715T080000Z\r\n/);
  assert.match(summer, /DTEND:20260715T100000Z\r\n/);
});

test('events spanning a daylight saving transition retain their true duration', () => {
  const ics = createICS([event({ start: '2026-03-29T01:30', end: '2026-03-29T03:30' })]);
  assert.match(ics, /DTSTART:20260329T003000Z\r\n/);
  assert.match(ics, /DTEND:20260329T013000Z\r\n/);
});

test('missing and ambiguous wall times are rejected instead of guessed', () => {
  for (const start of ['2026-03-29T02:30', '2026-10-25T02:30']) {
    const sample = event({ start, end: `${start.slice(0, 10)}T04:00` });
    assert.ok(validateSchedule(schedule([sample])).some(error => /clock change/.test(error)));
    assert.throws(() => createICS([sample]), /clock change/);
  }
});

test('UTC and other supported course timezones are respected', () => {
  const utc = createICS([event()], 'UTC');
  assert.match(utc, /DTSTART:20261001T100000Z\r\n/);
  const newYork = createICS([event()], 'America/New_York');
  assert.match(newYork, /DTSTART:20261001T140000Z\r\n/);
});

test('half-hour DST changes and skipped calendar days are never silently shifted', () => {
  for (const start of ['2026-10-04T02:15', '2026-04-05T01:45']) {
    const sample = event({ start, end: `${start.slice(0, 10)}T04:00` });
    assert.throws(() => createICS([sample], 'Australia/Lord_Howe'), /clock change/);
  }
  assert.throws(() => createICS([event({
    start: '2011-12-30T10:00', end: '2011-12-30T12:00',
  })], 'Pacific/Apia'), /clock change/);
  const ics = createICS([event({
    start: '2026-10-04T01:30', end: '2026-10-04T03:00',
  })], 'Australia/Lord_Howe');
  assert.match(ics, /DTSTART:20261003T150000Z\r\n/);
  assert.match(ics, /DTEND:20261003T160000Z\r\n/);
});

test('course events are independent of design stages and allow several sessions per stage', () => {
  const events = [
    event({ id: 'first', kind: 'fieldwork' }),
    event({ id: 'second', start: '2026-10-02T10:00', end: '2026-10-02T12:00' }),
    event({ id: 'third', kind: 'review', stage: null }),
    event({ id: 'fourth', kind: 'deadline', stage: undefined }),
    event({ id: 'fifth', kind: 'break', stage: null }),
  ];
  assert.deepEqual(validateSchedule(schedule(events)), []);
  const ics = createICS(events);
  assert.equal((ics.match(/BEGIN:VEVENT/g) || []).length, events.length);
  for (const kind of ['FIELDWORK', 'STUDIO', 'REVIEW', 'DEADLINE', 'BREAK']) {
    assert.ok(ics.includes(`CATEGORIES:${kind}\r\n`));
  }
});

test('proposals never become calendar commitments; confirmed breaks are retained', () => {
  const ics = createICS([
    event({ id: 'proposal', status: 'proposed', title: 'Tentative', start: 'not a date' }),
    event({ id: 'break', kind: 'break', title: 'No studio' }),
  ]);
  assert.doesNotMatch(ics, /Tentative|proposal/);
  assert.match(ics, /SUMMARY:No studio\r\n/);
  assert.match(ics, /CATEGORIES:BREAK\r\n/);
  assert.equal((ics.match(/BEGIN:VEVENT/g) || []).length, 1);
  assert.doesNotMatch(createICS([]), /BEGIN:VEVENT/);
});

test('bad confirmed events and duplicate UIDs stop export', () => {
  assert.throws(() => createICS([event({ start: '2026-02-30T10:00' })]), /Invalid calendar date/);
  assert.throws(() => createICS([event(), event()]), /duplicate/);
  assert.throws(() => createICS([], 'MadeUp/Zone'), /timezone/);
  assert.throws(() => createICS(null), /array/);
});

test('Serbian Unicode text folds to at most 75 UTF-8 octets without broken characters', () => {
  const title = 'Čačak, učešće; đaci i šetnja — žuta skica 🏛️ '.repeat(8);
  const ics = createICS([event({ title })]);
  for (const line of ics.split('\r\n')) assert.ok(Buffer.byteLength(line, 'utf8') <= 75, line);
  assert.ok(ics.includes('\r\n '));
  assert.doesNotMatch(ics, /\uFFFD/);
  const expected = title.replace(/;/g, '\\;').replace(/,/g, '\\,');
  assert.ok(unfold(ics).includes(`SUMMARY:${expected}\r\n`));
});

test('newlines and ICS punctuation are escaped without allowing event injection', () => {
  const ics = createICS([event({
    title: 'Sketch\\notes, room; one\r\nEND:VEVENT\nBEGIN:VEVENT\rInjected',
    location: 'Studio\r\nATTENDEE:evil@example.com',
  })]);
  const text = unfold(ics);
  assert.equal((text.match(/^BEGIN:VEVENT$/gm) || []).length, 1);
  assert.match(text, /SUMMARY:Sketch\\\\notes\\, room\\; one\\nEND:VEVENT\\nBEGIN:VEVENT\\nInjected/);
  assert.match(text, /LOCATION:Studio\\nATTENDEE:evil@example.com/);
  assert.doesNotMatch(text, /^ATTENDEE:/m);
  assert.doesNotMatch(ics.replace(/\r\n/g, ''), /[\r\n]/);
  assert.ok(ics.endsWith('END:VCALENDAR\r\n'));
});

test('date labels preserve the calendar day and use Serbian Latin when requested', () => {
  assert.equal(formatDate('2026-10-01'), '1 October 2026');
  assert.equal(formatDate('2026-10-01T00:00'), '1 October 2026');
  assert.match(formatDate('2026-10-01', 'sr'), /oktobar/);
  assert.throws(() => formatDate('2026-02-29'), /Invalid calendar date/);
});
