/** Calendar facts and export. Local meeting times are interpreted in the course timezone. */
const EVENT_KINDS = new Set(['studio', 'fieldwork', 'review', 'deadline', 'break']);
const EVENT_STATUSES = new Set(['confirmed', 'proposed']);
const formatters = new Map();

function dateParts(value) {
  if (typeof value !== 'string') throw new TypeError('A date must be a string.');
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);
  if (!match) throw new RangeError(`Invalid date and time: ${value}. Use YYYY-MM-DDTHH:mm.`);
  const [year, month, day, hour, minute] = match.slice(1).map(Number);
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (year < 1 || month < 1 || month > 12 || day < 1 || day > days[month - 1] || hour > 23 || minute > 59) {
    throw new RangeError(`Invalid calendar date or time: ${value}.`);
  }
  return { year, month, day, hour, minute, second: 0 };
}

function timestamp(parts) {
  // Date.UTC treats years 0–99 as 1900–1999; setUTCFullYear preserves the supplied year.
  const date = new Date(0);
  date.setUTCFullYear(parts.year, parts.month - 1, parts.day);
  date.setUTCHours(parts.hour, parts.minute, parts.second || 0, 0);
  return date.getTime();
}

function zoneFormatter(timezone) {
  if (typeof timezone !== 'string' || !timezone || /^[+-]/.test(timezone)) {
    throw new RangeError('Use a supported IANA timezone, such as Europe/Belgrade.');
  }
  if (!formatters.has(timezone)) {
    try {
      formatters.set(timezone, new Intl.DateTimeFormat('en-GB', {
        timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
      }));
    } catch {
      throw new RangeError(`Unsupported IANA timezone: ${timezone}.`);
    }
  }
  return formatters.get(timezone);
}

function localParts(instant, formatter) {
  const result = {};
  for (const part of formatter.formatToParts(new Date(instant))) {
    if (part.type !== 'literal') result[part.type] = Number(part.value);
  }
  return result;
}

function toInstant(value, timezone) {
  const parts = dateParts(value);
  const local = timestamp(parts);
  const formatter = zoneFormatter(timezone);
  const offsets = new Set();
  // Both offsets around a clock change must be considered, including half-hour changes.
  for (const hours of [-48, -24, -12, 0, 12, 24, 48]) {
    const sample = local + hours * 3_600_000;
    offsets.add(timestamp(localParts(sample, formatter)) - sample);
  }
  const candidates = [...offsets].map(offset => local - offset).filter(instant => {
    const actual = localParts(instant, formatter);
    return Object.keys(parts).every(key => actual[key] === parts[key]);
  });
  if (candidates.length === 0) throw new RangeError(`${value} does not exist in ${timezone} because of a clock change.`);
  if (candidates.length !== 1) throw new RangeError(`${value} is ambiguous in ${timezone} because of a clock change.`);
  return candidates[0];
}

function validText(value) {
  return typeof value === 'string' && !/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value);
}

/** Return actionable validation errors. An empty list means the document is valid. */
export function validateSchedule(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return ['Schedule must be an object.'];
  const errors = [];
  if (!['unconfirmed', 'confirmed'].includes(data.status)) errors.push('Schedule status must be unconfirmed or confirmed.');
  for (const field of ['institution', 'course', 'term']) {
    if (!validText(data[field])) errors.push(`Schedule ${field} must be text.`);
  }
  if (data.regularTeachingDay !== undefined) {
    const day = data.regularTeachingDay;
    if (!day || !Number.isInteger(day.weekday) || day.weekday < 1 || day.weekday > 7 || !validText(day.source) || !day.source.trim()) errors.push('Regular teaching day needs an ISO weekday (1–7) and its source.');
  }
  let timezoneValid = true;
  try { zoneFormatter(data.timezone); } catch (error) { errors.push(error.message); timezoneValid = false; }
  if (!Array.isArray(data.events)) return [...errors, 'Schedule events must be an array.'];
  const ids = new Set();
  data.events.forEach((event, index) => {
    const label = `Event ${index + 1}`;
    if (!event || typeof event !== 'object' || Array.isArray(event)) {
      errors.push(`${label} must be an object.`);
      return;
    }
    if (!validText(event.id) || !event.id.trim() || /[\r\n\t]/.test(event.id)) {
      errors.push(`${label} needs a nonempty, single-line id.`);
    } else if (ids.has(event.id)) errors.push(`${label} has a duplicate id: ${event.id}.`);
    else ids.add(event.id);
    // A course-wide break, review or deadline need not belong to a design stage.
    if (event.stage != null && (!Number.isInteger(event.stage) || event.stage < 1 || event.stage > 6)) {
      errors.push(`${label} stage must be an integer from 1 to 6 when supplied.`);
    }
    if (!validText(event.title) || !event.title.trim()) errors.push(`${label} needs a title.`);
    if (!validText(event.location)) errors.push(`${label} location must be text.`);
    if (!EVENT_STATUSES.has(event.status)) errors.push(`${label} status must be confirmed or proposed.`);
    if (!EVENT_KINDS.has(event.kind)) errors.push(`${label} has an unsupported kind.`);
    const instants = {};
    for (const field of ['start', 'end']) {
      try {
        const parts = dateParts(event[field]);
        instants[field] = timezoneValid ? toInstant(event[field], data.timezone) : timestamp(parts);
      } catch (error) { errors.push(`${label} ${field}: ${error.message}`); }
    }
    if (Number.isFinite(instants.start) && Number.isFinite(instants.end) && instants.end <= instants.start) {
      errors.push(`${label} must end after it starts.`);
    }
  });
  return errors;
}

/** A confirmed weekly rhythm does not invent meeting times or calendar events. */
export function teachingDayText(data, lang = 'en') {
  const day = data?.regularTeachingDay?.weekday;
  if (!Number.isInteger(day) || day < 1 || day > 7) return '';
  const names = lang.startsWith('sr') ? ['ponedeljkom', 'utorkom', 'sredom', 'četvrtkom', 'petkom', 'subotom', 'nedeljom'] : ['Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays', 'Sundays'];
  return lang.startsWith('sr') ? `Nastava je ${names[day - 1]}. Satnica nije zabeležena.` : `Classes meet on ${names[day - 1]}. The meeting time has not been recorded.`;
}

/** Format a calendar date without shifting it through the visitor's local timezone. */
export function formatDate(iso, lang = 'en') {
  const value = typeof iso === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(iso) ? `${iso}T12:00` : iso;
  const date = new Date(timestamp(dateParts(value)));
  return new Intl.DateTimeFormat(lang === 'sr' || lang.startsWith('sr-') ? 'sr-Latn-RS' : 'en-GB', {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
  }).format(date);
}

function escapeText(value) {
  return value.replace(/\\/g, '\\\\').replace(/\r\n|\r|\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,');
}

function utcStamp(instant) {
  return new Date(instant).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

function foldLine(line) {
  const encoder = new TextEncoder();
  const rows = [];
  let row = '';
  let bytes = 0;
  for (const character of line) {
    const size = encoder.encode(character).length;
    if (bytes + size > 75) { rows.push(row); row = ' '; bytes = 1; }
    row += character;
    bytes += size;
  }
  rows.push(row);
  return rows.join('\r\n');
}

/** Export confirmed events only. UTC instants carry the course timezone's actual DST offset. */
export function createICS(events, timezone = 'Europe/Belgrade') {
  if (!Array.isArray(events)) throw new TypeError('Calendar events must be an array.');
  const confirmed = events.filter(event => event?.status === 'confirmed');
  const errors = validateSchedule({ status: 'confirmed', institution: '', course: '', term: '', timezone, events: confirmed });
  if (errors.length) throw new RangeError(errors.join('\n'));
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Inclusive Studio//Course calendar//EN',
    'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'X-WR-CALNAME:Inclusive Studio',
    `X-WR-TIMEZONE:${escapeText(timezone)}`,
  ];
  const generated = utcStamp(Date.now());
  for (const event of confirmed) {
    lines.push(
      'BEGIN:VEVENT', `UID:${encodeURIComponent(event.id)}@inclusive-studio`, `DTSTAMP:${generated}`,
      `DTSTART:${utcStamp(toInstant(event.start, timezone))}`,
      `DTEND:${utcStamp(toInstant(event.end, timezone))}`,
      `SUMMARY:${escapeText(event.title)}`, `LOCATION:${escapeText(event.location)}`,
      `CATEGORIES:${event.kind.toUpperCase()}`, 'STATUS:CONFIRMED', 'END:VEVENT',
    );
  }
  lines.push('END:VCALENDAR');
  return `${lines.map(foldLine).join('\r\n')}\r\n`;
}
