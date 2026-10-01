import test from 'node:test';
import assert from 'node:assert/strict';
import { exportDraft, importDraft, issueDraftLink } from '../assets/contributions.js';
const draft = {stage: 3, kind: 'idea', title: 'Prag & izbor', text: 'Širina: nepoznata. <script>not executable</script>', description: ''};
test('portable draft round trip keeps Unicode, selected stage and literal text', () => assert.deepEqual(importDraft(exportDraft(draft)), draft));
test('import accepts only the versioned text format', () => {for (const s of ['{}', 'null', '{"format":"inclusive-studio-text","version":2}', 'not json']) assert.throws(()=>importDraft(s));});
test('import validates fields, types, size and stage without merging arbitrary properties', () => {
  for(const update of [{stage:0},{stage:1.5},{kind:'admin'},{text:[]},{text:'a'.repeat(6001)}]) assert.throws(()=>exportDraft({...draft,...update}));
  assert.throws(()=>importDraft(' '.repeat(100001)));
  assert.deepEqual(importDraft(exportDraft({...draft, token:'never exported'})),draft);
});
test('idea handoff uses repository template and custom field without privileged parameters', () => {
  const u = new URL(issueDraftLink(draft,draft.text).href);
  assert.equal(u.searchParams.get('template'),'ideja.yml');assert.equal(u.searchParams.get('idea'),draft.text);
  for (const key of ['labels','assignees','milestone','projects','body']) assert.equal(u.searchParams.has(key),false);
});
test('project handoff uses evidence field and preserves stage in title', () => {
  const u = new URL(issueDraftLink({...draft,kind:'submission'},draft.text).href);
  assert.equal(u.searchParams.get('template'),'predaja.yml');assert.equal(u.searchParams.get('evidence'),draft.text);assert.match(u.searchParams.get('title'),/Stage 03/);
});
test('long non-ASCII drafts produce a short URL and a paste-required state', () => {
  const r=issueDraftLink({...draft,text:'č'.repeat(5000)},'č'.repeat(5000));assert.equal(r.longDraft,true);assert.ok(r.href.length<1000);assert.equal(new URL(r.href).searchParams.has('idea'),false);
});
