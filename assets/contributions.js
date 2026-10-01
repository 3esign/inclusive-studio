// Portable text drafts and GitHub handoff. No credentials or uploads.
export const DRAFT_LIMITS = Object.freeze({ title: 120, text: 6000, description: 2000 });

export function validateDraft(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid draft');
  const { stage, kind } = value;
  if (!Number.isInteger(stage) || stage < 1 || stage > 6 || !['idea', 'submission'].includes(kind)) throw new Error('Invalid stage or kind');
  const draft = { stage, kind };
  for (const [key, limit] of Object.entries(DRAFT_LIMITS)) {
    if (typeof value[key] !== 'string' || value[key].length > limit) throw new Error('Invalid ' + key);
    draft[key] = value[key];
  }
  return draft;
}

export function exportDraft(draft) {
  return JSON.stringify({ format: 'inclusive-studio-text', version: 1, draft: validateDraft(draft) }, null, 2);
}

export function importDraft(text) {
  if (typeof text !== 'string' || text.length > 100000) throw new Error('Draft is too large');
  const data = JSON.parse(text);
  if (data.format !== 'inclusive-studio-text' || data.version !== 1) throw new Error('Unsupported draft format');
  return validateDraft(data.draft);
}

export function issueDraftLink(draft, body) {
  const d = validateDraft(draft);
  const url = new URL('https://github.com/3esign/inclusive-studio/issues/new');
  url.searchParams.set('template', d.kind === 'idea' ? 'ideja.yml' : 'predaja.yml');
  url.searchParams.set('title', '[Stage ' + String(d.stage).padStart(2, '0') + '] ' + d.title);
  // Template labels are owned by the repository; visitors need no label permission.
  const textField = d.kind === 'idea' ? 'idea' : 'evidence';
  url.searchParams.set(textField, body);
  const longDraft = url.href.length > 7000;
  if (longDraft) url.searchParams.delete(textField);
  // The project-stage dropdown is intentionally selected on GitHub; the text also records it.
  return { href: url.href, longDraft };
}
