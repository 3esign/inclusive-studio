// The cloud of ideas: everything that still has no week. Ordered by date, each idea carries
// its source; when an idea is pulled into the preparation for the next class, it says so —
// but it keeps no week here. Data: data/tok.json — nothing is retold by hand.
// The markup comes from cloud-core.js, shared with tools/cloud-baseline.mjs, so the static
// page and the live view print the same thing.

import { $, tr, loadJSON, mount, announce } from './core.js';
import { validateTok } from './tok-core.js';
import { cloudView } from './cloud-core.js';

let tok = null;

async function load() {
  try {
    const data = await loadJSON('data/tok.json');
    const problems = validateTok(data);
    if (problems.length) throw new Error(problems[0]);
    tok = data;
    announce(tr('The cloud of ideas is loaded.', 'Oblak ideja je učitan.'));
  } catch (error) {
    announce(tr('The cloud could not be fetched — the ideas on this page stay as written.', 'Oblak nije mogao da se dohvati — ideje na ovoj strani ostaju kako su upisane.'));
    console.warn(error);
  }
  const host = $('#cloud-view');
  if (tok && host) host.innerHTML = cloudView(tok);
}

mount({ view: 'cloud', render: () => {}, title: () => tr('Cloud of ideas', 'Oblak ideja') });
load();
