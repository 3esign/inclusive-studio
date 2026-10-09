# Smernice — kako se ovaj sajt pravi i održava

> Jedna rečenica: sajt predmeta govori istinu o toku nastave — šta je održano, šta se priprema, šta je tek ideja — na jednom jeziku, sa samo izričito odobrenom javnom atribucijom, uz proveru sadržaja, testova i stvarnog prikaza.
> Ovaj fajl je veza između tog zakona i veština Svemira iz kojih je izveden. Ako se smernica i veština razilaze, popravi ovde — ili tamo, svesno.

Ulaz za novi um je [AGENTS.md](../AGENTS.md). Ove smernice su živi ugovor; stariji broj testova ili raniji opis navigacije nije dokaz trenutnog stanja.

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

## Pet stabilnih odredišta i tok nastave

- **Naslovna (`naslovna.html`)** — odobrena uvodna kompozicija i ulaz u predmet; nova nastavna građa ne zahteva njeno ponovno osmišljavanje.
- **Održano (`index.html`)** — samo održani časovi: rezultati, izvori, A3 list nedelje, i materijal koji pomaže. Ništa viška.
- **Sledeći čas (`sledeci.html`)** — bogata priprema naslonjena na prethodni čas: odakle polazimo, šta se donosi, plan redom, listovi koje čas ostavlja, protokol sa korisnicima, šta strana čeka.
- **Oblak ideja (`oblak.html`)** — sve što nije u prva dva, redom po datumu.
- **Izvori (`resources.html`)** — literatura i poreklo tvrdnji/materijala; izvor nije automatski usvojeni zaključak ili zadatak.

Traka toka u zaglavlju svake strane štampa brojeve iz `data/tok.json` — generiše je `tools/shells.mjs`, nikad ručno.

Ovo su sadržinska odredišta; njihov spisak nije nalog da se menjaju postojeće grupe navigacije ili ukloni veza Udruženje. Prototipovi i druge zbirke gradiva su povezane podstranice, a ne novi paralelni tok nastave. Objavljen zapis rada ne menja sam status časa, pripreme ili završnog nastavničkog izdanja.

## Čovek u centru

| Smernica | Zašto | Ko brani |
|---|---|---|
| Podrazumevano koristiti uloge umesto identiteta. Izuzetak mora imati izričit nalog, tačan obim podataka i vezu sa konkretnim radom; ovde je odobrena atribucija pet prototipova, opisana ispod. | Ime i indeks uz odobreni rad nisu dozvola za druge identifikatore, kontakte, ocene ili tuđe privatne materijale. | `tests/interfejs.test.mjs` i provera registra prototipova; tačan obuhvat potvrđuje tekući testni izveštaj |
| Bez simulacije invaliditeta; osoba se ne ocenjuje; prekid u svakom trenutku; objava samo uz izričitu saglasnost. | Pravila u „Kako sarađujemo" i protokolu udruženja su obaveza, ne ukras. | `tests/udruzenje.test.mjs` (strana ih izriče), `docs/probavanje-u-udruzenju.md` (izvor) |

## Veštine Svemira iz kojih smernice izlaze

- **[svemir-lepota](../../../skills/svemir-lepota/SKILL.md)** — zakon i kapija: istina pre ukrasa, jedna rečenica po artefaktu, vidljiva struktura, ekonomija pažnje (jedna porodica pisma, `--signal` kao jedini akcenat), 150–300 ms, DOM je ugovor a canvas prostor, rad bez mreže. Svakom izveštaju o artefaktu: sedam pitanja kapije.
- **[svemir-design → Academic course sites](../../../skills/svemir-design/references/implementation/academic-course-sites.md)** — ruta za predmetne sajtove: ugovor sadržaja (autoritet/održano/publika), pet odredišta (naslovna, održano gradivo, sledeći čas, oblak, izvori), čitljiva staza, osam merljivih grupa pristupačnosti, dokaz nad stvarnim artefaktom.
- **[svemir-3esign](../../../skills/svemir-3esign/SKILL.md)** — tri pitanja svakog nacrta: mera, veza, život. Gradivo o merama i tolerancijama (EN 71-1, ⌀ 31,7 mm, ≤ 220 mm) odgovara na njih istim redom.
- **[svemir-provereno-pisanje](../../../skills/svemir-provereno-pisanje/SKILL.md)** — tvrdnja nosi izvor i datum; izdvojeno opaženo / izvedeno / predloženo / nepoznato.
- **[univerzitet](../../../skills/univerzitet/SKILL.md)** — institucionalne granice: šta je zvanično, šta nastavničko, šta radna hipoteza.

Veze ka veštinama su lokalni radni lokatori u verifikovanom Svemir workspace-u, ne javne stranice ovog sajta. U samostalnom klonu prvo pronaći aktivni workspace, pa njegov `skills/`; ne kopirati privatni sadržaj da bi lokalna veza proradila.

## Kako se menja sajt

1. Pre izmene proveriti vlasništvo/imenovani diff, zabeležiti početni puni Git SHA i napraviti checkpoint: `node tools/course-checkpoint.mjs capture --root <SITE> --store <PRIVATE_STORE>`. Store je van sajta; [ugovor i ograničenja](checkpoints.md) određuju dozvoljene putanje i zasebnu obnovu.
2. Podaci prvo: relevantni `data/tok.json` (šema v2), `data/material/wNN.json` ili `data/prototipovi.json`; koristiti zajednički validator. Ne menjati nepovezane izvornike da bi nova kompozicija prošla. Za promenu objavljenog nedeljnog gradiva dodati reviziju, čuvajući prethodnu istoriju i njegov zaseban status odobrenja.
3. Regenerisati zahvaćeni statični sadržaj postojećim alatima. Za održano: `node tools/held-baseline.mjs`; za prototipove: `node tools/prototipovi.mjs`, pa `node tools/prototipovi.mjs --check` (provera bez upisa). Posle njih po potrebi `node tools/shells.mjs` za ljusku (navigacija, traka, brend, podnožje, naslovi). Novi tip sadržaja koristi svoj zajednički renderer za živi i statični prikaz; ne održavati drugu zbirku podataka ručno.
4. Pre konačne provere dopuniti `data/verzije.json` (istorija + registar strana), `LOG.md` (append) i ove smernice ako je promenjen ugovor. Na mirnom konačnom stablu: `npm run verify:course -- --base <početni-puni-Git-SHA> --store <privatni-store-van-sajta>`. Alat snima konačan checkpoint, testira zasebnu vraćenu kopiju i proverava da se ni ona ni izvor nisu promenili. Sačuvati stvarni receipt; izmena testa mora biti opravdana, ne utišavanje pada.
5. Dokaz nad istim stvarnim prikazom: 320/390/768/1440, SR/EN, bez horizontalnog prelivanja, tastatura, bez JavaScript-a, uvećan tekst, konzola čista, slike učitane i tačan autor vezan za tačan rad. Svaka naknadna izmena bajtova zahteva nov odgovarajući dokaz; prethodni receipt ne pokriva novu verziju.
6. U ovlašćenom obimu objave: pregled imenovanog diff-a → commit tačnih proverenih putanja → push → Pages build → živi dokaz na 3esign.github.io. Lokalni PASS nije završen deploy. Checkpoint nije autentifikacija nastavnika ili apsolutna zaštita od drugog procesa sa istim pravima.

## Kapija pre objave (iz svemir-lepota)

Rečenica · Laž · Oduzimanje · Hijerarhija · Kretanje · Test golog ekrana · Ko može.
Ako bilo koje pitanje nema odgovora — nije gotovo.

## Slika kao deo gradiva · 09.10.2026.

Prikaz PUD-a je dokumentarna radna sveska: mirna svetla podloga, tamnozelena struktura, boje stvarnih predmeta na fotografijama. Naslovi pojedinačnih lekcija koriste sistemsko serifno pismo, a tekst i kontrole čitljiv sans-serif. Ove dve uloge su namerna projektna odluka; nijedan novi font se ne preuzima. Dobra postojeća 3D naslovna se čuva.

Fotografija gradiva nije proizvoljna dekoracija niti dokaz da je fotografisana na času. Prikazuje se uz originalni opis i natpis, sa vezom ka celom gradivu. Portretni kadar predmeta se čuva bez odsecanja mehanizma. Prva relevantna fotografija ima prednost pri učitavanju. Na telefonu dolazi posle kratke identifikacije časa, pre dugih izveštaja i administrativnih objašnjenja. Postojanje slike na disku ili HTTP 200 ne potvrđuje da je student stvarno vidi.

`assets/held-record.js` izvodi pregled održanog časa iz već postojećih podataka i fotografija. `node tools/held-baseline.mjs` osvežava srpski statični prikaz istim rendererom; zatim se po potrebi pokreće `tools/shells.mjs`. Izvornici `wNN.json` se zbog promene kompozicije ne prepravljaju. Novi datum održavanja se ne izvodi iz današnje objave sajta.

Proveriti stvarni put: početna strana → vidljiva fotografija i njen opis → gradivo → povratak; zasebno proveriti pripremu i označeni radni pregled. Provera uključuje 320 px, srpski i engleski, ugašen JavaScript i uvećan tekst. Tehnički lokatori ostaju u proširivom zapisu izvora; vodeći studentski tekst koristi razumljive nazive.

## Prototipovi kao gradivo · 09.10.2026.

Pet dostavljenih fotografija dokumentuje studentske radove koji su **doneti/predstavljeni**, prema izričitom korisnikovom nalogu. Njime je tražena i javna atribucija imena i indeksa uz baš te radove. Ta precizna iznimka zamenjuje raniju apsolutnu zabranu imena; ne menja podrazumevanu zaštitu drugih ličnih podataka. Ne zaključivati identitet iz lica, rukopisa, naziva slike ili položaja priloga. Nalog za prikaz imena/indeksa nije dokaz zasebne saglasnosti svih fotografisanih osoba.

Registar je `data/prototipovi.json`, šema `course-prototypes/v1`; prikaz i provera dele `assets/prototipovi-core.js` (`validatePrototypes`). `assets/prototipovi.js` povezuje podatke sa stranicom `prototipovi.html`. Ta stranica pripada meniju Materijal, uz prečice iz Održanog i Sledećeg časa. Fotografije i atribucije se ne prepisuju u paralelne registre stranica.

| Polje | Uloga i granica |
|---|---|
| `sources[].id`, `recordedOn`, `description.sr/en` | Stabilan izvor i datum upisa u registar. Datum upisa nije datum časa, fotografisanja niti testiranja. Javni sažetak ne iznosi sirov privatni razgovor. |
| `items[].id`, `title`, `description.sr/en` | Stabilan identitet rada i sadržaj koji potvrđeni izvor podržava. Naslov i opis ne izmišljaju performanse ili odobrenje. |
| `author.name`, `author.studentNumber` | Tačan zapis autora i indeksa iz naloga, povezan sa tačnim radom. Indeks se čuva kao tekst; ne gubiti prefikse, kose crte ili početne nule. |
| `attribution.sourceId`, `fields` | Poziv na izričit nalog i tačno dozvoljena polja `['name', 'studentNumber']`. Nije globalni prekidač za sve osobe ili sve buduće radove. |
| `originWeek: 1`, `medium`, `status: 'brought'`, `sourceId` | Poreklo zadatka je prvi čas; medij je `physical` ili `digital`, prema izvoru. Status znači doneto/predstavljeno, ne testirano ili ocenjeno. Poreklo zadatka ne potvrđuje datum sledećeg časa. |
| `photos[]` | Svaka fotografija ima jedinstveni `id`, stvarni `src`, `sha256`, `width`, `height`, `alt.sr/en`, `caption.sr/en` i `sourceId`. Hash potvrđuje bajtove, ne identitet, vreme, dozvolu ili kvalitet rada. |
| `observations` | Odvojeni evidencioni događaji. Sadašnji prazan niz ne dokazuje da je probavanje obavljeno. Budući događaj u udruženju zahteva svoj izvor, stvarni datum i fotografije; njegovu šemu/renderer/test dopuniti zajedno pre upisa. |
| `revizije` | Dnevnik ispravki: `{v, datum, sta:{sr,en}, sourceId, prototypeId, before, after}`. `before` čuva ceo prethodni zapis rada, `after` novi. Datum je datum ispravke, ne nagađani datum događaja. |

Za ispravku autora, indeksa, opisa, fotografije ili drugog potvrđenog podatka sačuvati ceo stari item u novoj reviziji i navesti izvor korekcije. Ne brisati prethodne `sources`, `observations` ili `revizije`, niti prepisati stare bajtove slike novom fotografijom pod istim lokatorom. Novi važeći prikaz i istorija ispravke imaju različite uloge; stari pogrešan podatak nije drugi aktuelni autor.

Ne prebacivati `w02` u održano zbog galerije ili današnje objave. Ne dodavati datum drugog časa bez potvrde. Buduće probavanje u udruženju može povezati postojeći rad sa novim događajem; ne menja prvobitnu atribuciju, status prezentacije ili istoriju izvora. Opažanje, tumačenje i predlog poboljšanja ostaju različite tvrdnje. Nova fotografija nije sama po sebi dokaz uspešne provere, bezbednosti ili zadovoljstva korisnika.

### Primer sledeće dopune

Primer postupka, **nije podatak za automatski upis**: stigne druga fotografija jednog od ovih pet radova, uz opis nastavnika.

1. Pronaći njegov postojeći `items[].id`; ne otvarati duplikat rada. Proveriti da nova fotografija zaista pripada njemu i šta novi nalog dopušta.
2. Dodati novi `sources[]` zapis sa stvarnim datumom registracije i sažetkom porekla. Sačuvati raniji izvor i prvobitnu atribuciju.
3. Dopuniti samo njegov `photos[]` novim ID-jem, tačnom lokalnom putanjom, punim hash-om, stvarnim dimenzijama i sadržinski usklađenim SR/EN opisima. Ne upisivati probne vrednosti, preuzeti hash druge slike ili nagađati identitet.
4. Ako je to fotografija kasnijeg rada u udruženju, povezati je sa zasebnim potvrđenim događajem u `observations`; ne predstaviti je kao prvobitno donošenje. Ako je događaj još nepoznat, tako ga i označiti u radnoj evidenciji, bez lažne javne tvrdnje.
5. Pokrenuti `node tools/prototipovi.mjs`, `node tools/prototipovi.mjs --check`, pa potrebnu regeneraciju ljuske i konačni gate redom iz odeljka „Kako se menja sajt“. Pregledati atribuciju i sliku u punoj galeriji i oba pregleda, sa uključenim i isključenim JavaScript-om.

Za šesti rad dodaje se novi `items[]` sa svim potvrđenim podacima i zasebnim odgovarajućim nalogom za atribuciju. Odobrenje ovih pet nije trajna dozvola za svakog budućeg autora. Ako potreban podatak nije poznat, sačuvati ga kao otvoren posao u postojećoj radnoj evidenciji umesto izmišljanja polja koje validator prihvata.
