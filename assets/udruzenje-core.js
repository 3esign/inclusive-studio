// The association space, pure part: content constants and the safety-gate verdict.
// No DOM here, so the tests can import it directly (the same split as tok-core.js).
// Source of every statement: docs/probavanje-u-udruzenju.md — nothing is invented here.

export const GATE_ITEMS = [
  { id: 'mali-delovi', en: 'Small parts — passes the small-parts cylinder (EN 71-1)', sr: 'Mali delovi — prolazi kroz cilindar za male delove (EN 71-1)' },
  { id: 'ivice', en: 'Edges and tips — deburred, no sharp edges', sr: 'Ivice i vrhovi — obele, bez oštrih ivica' },
  { id: 'kanap', en: 'Cord and string — under the 220 mm limit, or none', sr: 'Kanap i šnura — kraći od 220 mm ili bez kanapa' },
  { id: 'cupanje', en: 'Pull test — parts hold when pulled', sr: 'Na čupanje — delovi drže kad se vuku' }
];

// The verdict is derived, never chosen: all four gates closed, or the prototype stays on the table.
export function gateVerdict(checks) {
  const closed = GATE_ITEMS.filter(item => checks?.[item.id] === true).length;
  const pass = closed === GATE_ITEMS.length;
  return {
    pass,
    closed,
    total: GATE_ITEMS.length,
    message: pass
      ? { en: 'PASSES — it may go into hands.', sr: 'PROLAZI — ide u ruke.' }
      : { en: `DOES NOT PASS (${closed}/${GATE_ITEMS.length}) — it stays on the table, for conversation only.`, sr: `NE PROLAZI (${closed}/${GATE_ITEMS.length}) — ostaje na stolu, samo za razgovor.` }
  };
}

export const STEPS = [
  { en: ['You receive the toy without explanation.', 'It comes into your hands without a word. Do with it what you want, in the order you choose.'],
    sr: ['Dobijete igračku bez objašnjenja.', 'Igračka vam stiže u ruke bez reči. Radite s njom šta hoćete, redom koji vi birate.'] },
  { en: ['The student stays quiet and observes.', 'No steering, no correcting your grip, no “try it like this”. The student takes notes.'],
    sr: ['Student ćuti i posmatra.', 'Ne usmerava se, ne ispravlja se hvat, ne kaže se „probaj ovako”. Student piše beleške.'] },
  { en: ['When you stop, a short conversation.', 'What was clear and what was not; what you would change. Your sentence goes onto the student’s sheet as a quote.'],
    sr: ['Kad stanete, kratak razgovor.', 'Šta vam je bilo jasno, a šta nije; šta biste promenili. Vaša rečenica ide na studentov list kao citat.'] },
  { en: ['The finding goes into the workbook.', 'Evidence from your hands becomes proof on the A3 sheet — part of the course material, not an occasion.'],
    sr: ['Rezultat ide u radnu svesku.', 'Nalaz iz vaših ruku postaje dokaz na A3 listu — deo gradiva, ne prigoda.'] }
];

export const RIGHTS = [
  { en: 'Taking part is <b>voluntary</b> — you may try nothing at all.', sr: 'Učešće je <b>dobrovoljno</b> — možete da ne probate ništa.' },
  { en: 'You may <b>stop at any moment</b>, without giving a reason.', sr: 'Možete da <b>stanete u svakom trenutku</b>, bez objašnjenja.' },
  { en: '<b>You are never scored</b> — the object is scored, not the person; people are never compared.', sr: '<b>Vi se ne ocenjujete</b> — ocenjuje se predmet, ne osoba; nema poređenja među ljudima.' },
  { en: '<b>No photographs, names or statements</b> until you give explicit consent (you and the association).', sr: '<b>Bez fotografija, imena ili izjava</b> dok ne date izričitu saglasnost (vi i udruženje).' },
  { en: 'Data stays in the <b>student’s workbook</b> — it does not go online without approval.', sr: 'Podaci ostaju u <b>radnoj svesci studenta</b> — ne idu na internet bez odobrenja.' }
];

export const MEASURED = [
  { what: { en: 'First action', sr: 'Prva radnja' }, how: { en: 'what the user took or tried first, without instruction', sr: 'šta je korisnik uzeo ili pokušao prvo, bez uputstva' } },
  { what: { en: 'Time to first success', sr: 'Vreme do prvog uspeha' }, how: { en: 'a stopwatch; if there is no success — “no” is written down, and that is a finding', sr: 'štoperica; ako nema uspeha — upisuje se „nije”, i to je nalaz' } },
  { what: { en: 'Where it sticks', sr: 'Gde zapinje' }, how: { en: 'photo or sketch of the place on the object, with the object for scale', sr: 'foto ili skica mesta na predmetu, sa predmetom za razmeru' } },
  { what: { en: 'What the user changed', sr: 'Šta je korisnik promenio' }, how: { en: 'the user’s own move on the object, if made — an attempted change is data too', sr: 'njegov potez na predmetu, ako ga je izveo — i pokušaj je podatak' } },
  { what: { en: 'Hand measurement (optional)', sr: 'Mera ruke (po želji korisnika)' }, how: { en: 'the five measurements of “The hand that holds it” — one of the three hands on the A3 may come from the association', sr: 'pet mera iz zadatka „Ruka koja drži” — jedna od tri ruke na A3 sme biti iz udruženja' } },
  { what: { en: 'Statement', sr: 'Izjava' }, how: { en: 'one or two sentences, quoted with a source (“a member of the association”)', sr: 'jedna-dve rečenice, citat sa izvorom („član udruženja”)' } }
];

export const NEVER = [
  { en: '<b>No disability simulation</b> — members are real users, not a prop.', sr: '<b>Bez simulacije invaliditeta</b> — članovi su stvarni korisnici, ne rekvizit.' },
  { en: '<b>No scoring of persons</b> and no comparing users with each other.', sr: '<b>Bez ocenjivanja osoba</b> i bez poređenja korisnika međusobno.' },
  { en: '<b>No pressure</b> — participation is voluntary, stopping is allowed at any moment.', sr: '<b>Bez pritiska</b> — učešće dobrovoljno, prekid u svakom trenutku.' },
  { en: '<b>No publishing</b> of photographs, names or statements without explicit consent.', sr: '<b>Bez objave</b> fotografija, imena ili izjava bez izričite saglasnosti.' }
];
