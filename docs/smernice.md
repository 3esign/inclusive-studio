# Smernice — kako se ovaj sajt pravi i održava

> Jedna rečenica: sajt predmeta govori istinu o toku nastave — šta je održano, šta se priprema, šta je tek ideja — na jednom jeziku, bez imena, i to dokazuje testovima.
> Ovaj fajl je veza između tog zakona i veština Svemira iz kojih je izveden. Ako se smernica i veština razilaze, popravi ovde — ili tamo, svesno.

## Površina i jezik

| Smernica | Zašto | Ko brani |
|---|---|---|
| Jedan jezik na površini: srpski („sr-Latn"). Engleski samo iza vidljivog prekidača. | Prvi pogled ne sme da bude mešavina; ljuska, naslovi, traka, podnožje i statični osnovac su svi na istom jeziku. | `tests/shell.test.mjs` (lang, naslovi, natpisi navigacije, brend, podnožje), `tests/recnik.test.mjs` |
| Statični osnovac svake strane radi bez skripte i kaže ono što kaže i živi prikaz. | Čitalac bez JavaScript-a nije čitalac drugog reda; ni pretraga nije. | `tests/shell.test.mjs`, `tests/tok.test.mjs` (osnovci triju strana toka) |
| Struktura se zove ono što jeste: održano, sledeći čas, oblak ideja. Bez metafora („zacementirano", „pilot", „polica"). | Rečnik strane je način mišljenja; žargon metafora sakriva stanje stvari. Citat tuđeg naslova sme da zadrži svoje reči. | `tests/recnik.test.mjs` (skener celog HTML-a + modula koji renderuju ljusku) |
| Nivo: prva godina fakulteta — akademski, ne telegrafski, ne kič. | Ovo je visoko obrazovanje; rečenica nosi misao, broj nosi izvor. | pregled + recenzija LOG-a |

## Istina toka (data/tok.json, šema v2)

| Smernica | Zašto |
|---|---|
| Održano znači: održano + upisani rezultati sa izvorima. Bez rezultata — nije završeno. | „Održano bez upisanih rezultata nije završeno." |
| Priprema (sledeći) mora da kaže šta čeka (`ceka`) i ne sme da nosi datum održavanja ni rezultate. | Pripremljeno nije održano. |
| Ideja nema nedelju — samo izvor i datum; nedelju dobija ulaskom u pripremu. | Oblak je red čekanja, ne raspored. |
| Svaka stavka nosi izvor i datum; preseci delova su zabranjeni; validator je zajednički stranicama, testovima i `tools/shells.mjs`. | Istina se izvodi, ne prepričava. — `assets/tok-core.js` |

## Tri strane toka

- **Održano (`index.html`)** — samo održani časovi: rezultati, izvori, A3 list nedelje, i materijal koji pomaže. Ništa viška.
- **Sledeći čas (`sledeci.html`)** — bogata priprema naslonjena na prethodni čas: odakle polazimo, šta se donosi, plan redom, listovi koje čas ostavlja, protokol sa korisnicima, šta strana čeka.
- **Oblak ideja (`oblak.html`)** — sve što nije u prva dva, redom po datumu.

Traka toka u zaglavlju svake strane štampa brojeve iz `data/tok.json` — generiše je `tools/shells.mjs`, nikad ručno.

## Čovek u centru

| Smernica | Zašto | Ko brani |
|---|---|---|
| Bez ličnih imena i bez ičega što traži saglasnost — sve je samo interfejs. | Objavljena površina ne sme da zavisi od tuđeg odobrenja; uloga („direktor udruženja") nosi značenje, ime nosi rizik. | `tests/interfejs.test.mjs` (89 fajlova) |
| Bez simulacije invaliditeta; osoba se ne ocenjuje; prekid u svakom trenutku; objava samo uz izričitu saglasnost. | Pravila u „Kako sarađujemo" i protokolu udruženja su obaveza, ne ukras. | `tests/udruzenje.test.mjs` (strana ih izriče), `docs/probavanje-u-udruzenju.md` (izvor) |

## Veštine Svemira iz kojih smernice izlaze

- **[svemir-lepota](../../skills/svemir-lepota/SKILL.md)** — zakon i kapija: istina pre ukrasa, jedna rečenica po artefaktu, vidljiva struktura, ekonomija pažnje (jedna porodica pisma, `--signal` kao jedini akcenat), 150–300 ms, DOM je ugovor a canvas prostor, rad bez mreže. Svakom izveštaju o artefaktu: sedam pitanja kapije.
- **[svemir-design → Academic course sites](../../skills/svemir-design/references/implementation/academic-course-sites.md)** — ruta za predmetne sajtove: ugovor sadržaja (autoritet/održano/publika), pet odredišta (naslovna, održano gradivo, sledeći čas, oblak, izvori), čitljiva staza, osam merljivih grupa pristupačnosti, dokaz nad stvarnim artefaktom.
- **[svemir-3esign](../../skills/svemir-3esign/SKILL.md)** — tri pitanja svakog nacrta: mera, veza, život. Gradivo o merama i tolerancijama (EN 71-1, ⌀ 31,7 mm, ≤ 220 mm) odgovara na njih istim redom.
- **[svemir-provereno-pisanje](../../skills/svemir-provereno-pisanje/SKILL.md)** — tvrdnja nosi izvor i datum; izdvojeno opaženo / izvedeno / predloženo / nepoznato.
- **[univerzitet](../../skills/univerzitet/SKILL.md)** — institucionalne granice: šta je zvanično, šta nastavničko, šta radna hipoteza.

## Kako se menja sajt

1. Podaci prvo: `data/tok.json` (šema v2) i `data/material/wNN.json`; validator mora proći.
2. `node tools/shells.mjs` — ljuska (navigacija, traka, brend, podnožje, naslovi) se regeneriše, nikad ne piše ručno.
3. `node --test` — 163 testa; promena testa se pregleda: ništa se ne labavi bez razloga.
4. Dokaz nad stvarnim prikazom: 390/768/1440, bez horizontalnog prelivanja, konzola čista, slike učitane.
5. `data/verzije.json` (nove stavke `istorija` + registar strana), `LOG.md` (append), `docs/smernice.md` ako se smernica promenila.
6. Objava: commit → push → Pages build → živi dokaz na 3esign.github.io.

## Kapija pre objave (iz svemir-lepota)

Rečenica · Laž · Oduzimanje · Hijerarhija · Kretanje · Test golog ekrana · Ko može.
Ako bilo koje pitanje nema odgovora — nije gotovo.
