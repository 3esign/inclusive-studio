# Verzije — kako stranica predmeta raste uz predmet

> How a subject site is versioned alongside the subject it serves. Serbian first; an English summary follows.

Stranica predmeta nije prostor koji se jednom objavi, nego živi dokument koji se vodi **paralelno sa predmetom**: menja se, dopunjuje i dodaje. Nedelja se preusmeri, zadatak se dopuni, datum se potvrdi. To mora da ostane vidljivo — i studentu (šta je novo) i nastavniku (šta je već rečeno) i svakom sledećem umu koji preuzima rad.

## Tri sloja verzija

| Sloj | Gde živi | Šta nosi |
|---|---|---|
| **Revizije gradiva** | `data/material/wNN.json` → `revizije` | Šta se promenilo u nedelji, kada i na čiju reč. Prikazuju se na strani nedelje („Kako je ovaj list nastajao”). |
| **Manifest predmeta** | `data/verzije.json` | Identifikacija predmeta, **format ispita kao podatak**, registar stranica i šta je izvor istine za svaku, istorija sajta u velikim potezima. |
| **Dnevnik rada** | `LOG.md` (append-only) | Ko je šta radio, kojim redom, sa kojim rezultatom provere. |

Git istorija čuva sve, ali git ne čita se iz predavaonice: revizije i manifest su vidljivi i na sajtu.

## Pravila (provodi ih validator i testovi, nisu preporuka)

| Pravilo | Zašto |
|---|---|
| Objavljena nedelja mora imati `revizije` | Gradivo koje tvrdi da se nikad nije menjalo nije pošteno prema sali. |
| `revizije` idu `v1..vN` redom, svaka sa `datum` (YYYY-MM-DD) i `sta` (šta se promenilo) | Istorija bez reda i datuma je anegdota, ne verzija. |
| `updated` mora biti jednak datumu poslednje revizije | Red „Dopunjeno” u zaglavlju govori istinu. |
| Nacrt (`draft`) sme i bez revizija | Neobjavljeno gradivo još nema istoriju pred salom. |
| Revizija se **dodaje**, ne prepisuje | Promena istorije je prevara, ne dopuna. |

## Kako se dodaje revizija

1. Izmeni gradivo nedelje (kroz `uredi.html` ili direktno u `wNN.json`).
2. Na kraj niza `revizije` dodaj `{ "v": <sledeći>, "datum": "<danas>", "sta": { "sr": "…", "en": "…" } }` — ukratko, šta se promenilo i zašto.
3. Postavi `updated` na isti datum.
4. Ako je promena važna za ceo sajt (nova strana, nova nedelja, preusmerenje toka) — dodaj red u `istorija` u `data/verzije.json` i zapiši u `LOG.md`.

Uređivač (`uredi.html`) čuva postojeće `revizije` pri čuvanju; novu reviziju treba dodati ručno — svesno, uz ime promene.

## Isti obrazac za svaki predmet

Ova šema nije svojina ovog sajta. Svaki sledeći predmetni sajt (npr. [Computing Studio](https://3esign.github.io/computing-studio/) za Osnove računarstva) nosi ista tri sloja:

- `revizije` u fajlovima gradiva po nedelji (ili po celini koja se drži),
- manifest `verzije.json` sa identifikacijom predmeta i **formatom ispita kao podatkom** (oblik, način, izvor spoznaje, napomene),
- append-only dnevnik.

## Landing strana: tok predmeta (tri police)

Uz slojeve verzija, predmet ima **prozor iz koga se njime upravlja — i to je glavna (landing) strana sajta** (`index.html`). Tri police odgovaraju na tri pitanja odjednom — šta je završeno, šta se sprema, odakle dolazi sledeće. Svaki održani čas stoji redom, sa materijalom te nedelje i **A3 listom nedelje** — listovi se ređaju u radnu svesku za kolokvijum/ispit (format je podatak u manifestu).

| Polica | Šta sme da sedi na njoj | Šta validator traži |
|---|---|---|
| **Zacementirano** | Čas (ili događaj) koji se **održao** i čiji su **rezultati upisani** | `odrzan` (datum) + neprazan `rezultati`, svaki rezultat sa svojim `izvor`-om; nedelja časa mora nositi bar jednu vežbu — A3 list |
| **Pilot za sledeći čas** | Ono što je pripremljeno, a još nije održano | `ceka` (šta se čeka) — i **nikako** `odrzan`/`rezultati`: pilot ne sme da izgleda gotov |
| **Oblak ideja** | Ideje kojima nedelja još nije dodeljena | `izvor` + `datum`; **bez** `nedelja` — nedelju ideja dobija tek kad postane pilot |

Podaci žive u `data/tok.json` (šema `inclusive-studio-tok`); A3 linija svake zacementirane nedelje crpi se iz `wNN.json` (vežbe nedelje), ne prepisuje ručno. Pravila provodi `assets/tok-core.js` i `tests/tok.test.mjs`; landing ima statični osnovac koji radi i bez skripte, a živi prikaz ga menja tek kad podaci prođu pravila. Duboke veze `index.html?w=N` i dalje otvaraju nedelju. Prelaz ide u jednom smeru: **ideja → pilot → zacementirano**. Pilot pamti iz koje je ideje izvučen (`izIdeje`); kad se čas održi, stavka prelazi na policu „zacementirano” sa datumom i rezultatima, a sa police „pilot” nestaje — validator odbija istu stavku na dve police.

**Traka toka u zaglavlju svake strane**: „zacementirano · sledeći čas (nedelja N) · oblak ideja (M)” — isti raspored dostupan uvek tokom navigacije. Generiše je `node tools/shells.mjs` direktno iz `data/tok.json` (brojevi su istiniti i bez skripte); posle svake promene toka pusti ponovo alat.

Ritual posle održanog časa: (1) upiši rezultate u `wNN.json` („Zapisano posle časa”) + revizija; (2) prebaci stavku u `data/tok.json` iz `pilot` u `cem`; (3) `node tools/shells.mjs`; (4) testovi. To je ceo prelaz.

Načelo: **pripremljeno nije održano; održano bez upisanih rezultata nije zacementirano; ideja nema nedelju dok ne postane pilot.**

Kod novog predmeta manifest se prvi put popuni iz dosijea predmeta; nepoznato se upiše kao nepotvrđeno, ne izmisli se. Dosije predmeta (u `!Projekti/Univerzitet/nastava/…`) ostaje arhiva i poreklo; sajt je živi sloj.

## Naslovna i strane uživo (pilot prostori)

Uz tok su otvorena i dva nova oblika strane — oba se registruju u manifestu (`stranice` + red u `istorija`), oba su **dodata, ne zamena**:

| Strana | Pravilo |
|---|---|
| **Naslovna** (`naslovna.html`) | Prva vrata, ali tok ostaje landing: duboke veze `index.html?w=N` i police ne diraju se. Brojevi na naslovnoj štampa `tools/shells.mjs` iz `data/tok.json` — istiniti i bez skripte. Scena (vendorevani three.js, heševi u `assets/vendor/README.md`) je samo dopuna: SVG osnova bez WebGL-a, mirovanje uz `prefers-reduced-motion`. Štampa se kao naslovni list radne sveske. |
| **Pilot prostor** (`udruzenje.html`) | Sadržaj **samo** iz protokola (`docs/probavanje-u-udruzenju.md`), srpski prvi, bez ličnih podataka; što nije dogovoreno — otvoreno piše da nije dogovoreno. Alati (kapija bezbednosti) rade u pregledaču, ništa ne šalju; presuda se izvodi iz provera, ne bira. |

Spoljni kod se ne dodaje preko npm-a ni CDN-a: vendoring sa upisanim heševima, i to samo kad DOM nosi sadržaj bez njega.

---

## English summary

A subject site is versioned in three layers: per-week `revizije` in `data/material/wNN.json` (what changed, when, on whose word — shown on the week page), a subject manifest `data/verzije.json` (identity, the **exam format as data**, a registry of pages and their sources of truth, site-level history), and the append-only `LOG.md`. The validator and the test suite enforce the rules: a published week must carry revisions, they run `v1..vN` in order, each with a date and a statement of change, and the header's “Updated” line must equal the last revision's date. Revisions are appended, never rewritten. The same three-layer pattern applies to every subject site, starting with Computing Studio.

Alongside the layers, each subject gets a **steering flow as its landing page** (`index.html`, data in `data/tok.json`): three shelves — cemented classes in order, each with its material and its A3 sheet of the exam workbook; pilot for the next class (must name what it waits for, must not look finished); and the cloud of ideas (no week, a source and a date only). A flow strip in the header of every page (cemented · next class · cloud) is generated from the same data by `node tools/shells.mjs`, so it works without scripting. Items move one way — idea → pilot → cemented — and the validator refuses a held item without results, a pilot that carries results, and an idea with a week. Prepared is not held; held without recorded results is not cemented. A subject site gains this flow with its first held class, not before.
