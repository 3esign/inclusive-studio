# Inclusive Studio — ulaz za sledeći rad

Ovo je sajt predmeta Principi univerzalnog dizajna, ne opšti portal niti evidencija ocena. U Svemir radnom prostoru prvo poštuj njegov kanon; ovaj fajl dodaje projektne granice. Pre izmene pročitaj [smernice](docs/smernice.md), [checkpoint ugovor](docs/checkpoints.md), poslednje relevantne stavke `LOG.md` i podatke koje menjaš. Stariji opis u README-u nije izvor novih nastavnih činjenica.

## Šta ostaje stabilno

- Pet sadržinskih odredišta su **naslovna, održano gradivo, sledeći čas, oblak ideja i izvori**. Sačuvaj odobrenu naslovnu, njihovu namenu i vidljivu navigaciju, uključujući postojeću vezu Udruženje; ovo nije nalog za promenu grupa menija. Dodatak gradivu nije povod za novi raspored celog sajta.
- Nastavnik određuje redosled, završno izdanje gradiva i šta je stvarno održano. `data/tok.json`, `data/material/wNN.json` i `data/course-publication.json` imaju različite uloge. Objavljeno, doneto, predstavljeno, odobreno i ispitano nisu sinonimi.
- Prototipovi su deo nastavnog gradiva: podaci u `data/prototipovi.json`, zajednička provera/prikaz u `assets/prototipovi-core.js`, stranica `prototipovi.html`. Postojeće stranice povezuju isti registar; ne održavaj posebne kopije imena, indeksa, statusa i natpisa u više HTML/JS fajlova.

## Pet prototipova · nalog 09.10.2026.

Semir je izričito tražio javnu atribuciju **imena i indeksa uz pet dostavljenih radova/fotografija**. To je konkretan izuzetak od ranijeg opšteg pravila „bez imena“, ne dozvola da se objave svi studentski ili drugi lični podaci. Zadrži tačno potvrđenu vezu autor–indeks–rad–fotografija i zapis o obimu naloga u podacima. Ne izvodi identitet iz lica, rukopisa ili susednog fajla; ne dodaj kontakte, ocene, evidenciju dolazaka ili druge osobe. Nalog za atribuciju nije dokaz zasebne saglasnosti svake fotografisane osobe.

Status **doneto/predstavljeno** dolazi iz tog naloga. Datum objave, naziv datoteke ili fotografija ne određuju datum drugog časa. Ne tvrdi da je prototip uspešan, bezbedan ili testiran u udruženju bez tog zasebnog dokaza. Buduće slike/provere u udruženju predstavljaju novi evidencioni događaj vezan za postojeći rad; ne prepisuju prvobitnu prezentaciju. Primer sledeće dopune i granice atribucije su u [smernicama](docs/smernice.md#prototipovi-kao-gradivo--09102026).

## Kako bezbedno dopuniti

1. Proveri HEAD, imenovane izmene i aktivnog vlasnika fajlova. U zajedničkom radu usaglasi putanje pre pisanja; ne pregazi tuđ rad.
2. Sačuvaj početni puni Git SHA i checkpoint pre izmene, van sajta. Komande i ograničenja su u `docs/checkpoints.md`; obnova ide u novu odvojenu putanju.
3. Menjaj izvorne podatke, ne generisane kopije. Sačuvaj stabilne ID-jeve, poreklo fotografije, status i istoriju. Ispravka prototipa dobija `revizije` zapis sa izvorom i celim `before`/`after` itemom; prethodni izvori, događaji, revizije i bajtovi slika ostaju sačuvani. Izmenjeno objavljeno `wNN` gradivo zahteva novu reviziju; staro izdanje ne postaje nacrt radi zaobilaženja provere.
4. Pokreni relevantne provere i postojeće generatore koje promena zahteva; dopuni `data/verzije.json` i `LOG.md`. Zatim nad konačnim mirnim stablom pokreni `npm run verify:course -- --base <početni-puni-Git-SHA> --store <privatni-store-van-sajta>`.
5. Pregledaj stvarnu stranicu: fotografija i tačna atribucija, put do gradiva i nazad, 320 px i veći ekran, SR/EN, tastatura, bez JavaScript-a, učitane slike i konzola. Za promenu posle uspešne provere ponovi zahvaćene provere i konačni gate; ne objavljuj drugačije bajtove pod starim dokazom.
6. Predaj imenovane izmene, dokaz i preostale granice. Objava mora biti u ovlašćenom obimu; lokalni test ili checkpoint sami ne predstavljaju objavu ni odobrenje nastavnika.

Nema novih npm zavisnosti, spoljnih fontova/trakera niti novog paralelnog registra. Koristi postojeće projektne testove i dizajn/akademske reference navedene u smernicama. Checkpoint i provere smanjuju rizik i otkrivaju određene promene; ne garantuju da greška nije moguća niti sprečavaju proces sa istim pravima da zaobiđe alat.

## Dopuna registra · 09.10.2026.

U sledećoj izričitoj nastavnikovoj dopuni dodat je šesti rad **Upadalica**, sa potvrđenom atribucijom, jednom originalnom fotografijom i izvorom `teacher-2026-10-09-upadalica`. Atribucija se čita iz registra rada. Raniji opis pet radova označava prvu isporuku; postojeći postupak i granice važe i za novu dopunu.

## Potvrđena nedelja dokumentovanja · 09.10.2026.

Nastavnik je naknadno potvrdio: svih šest radova i najavljeni naredni krug fotografija pripadaju **nedelji 2**, održanoj **u petak, 09.10.2026.** Nastava je petkom. `originWeek: 1` označava početak izrade; `documentedWeek: 2` označava nedelju dokumentovanja i vodi ka njenom gradivu. Nisu isto polje. Šest before/after revizija čuva prethodno stanje; izvor je `teacher-2026-10-09-week-02`. Nove fotografije iz ovog najavljenog kruga vezati za nedelju 2 i odgovarajući rad, uz proveru stvarnog konteksta. Ovo nije trajno pravilo za sve buduće radove. Zapažanja iz udruženja ostaju zasebni događaji.

Drugi čas sada pripada `odrzano`, a naredni čas je treća nedelja, čiji plan ostaje priprema. Datum održavanja nije datum konačnog odobrenja čitavog gradiva. Redovan petak ne određuje satnicu, trajanje ni tačan termin susreta u udruženju.

Prikaz sledećeg časa deli `assets/next-class.js` sa generatorom `tools/next-baseline.mjs`. Posle pomeranja nedelje regenerisati njegov statični prikaz i školjke; ne prepisivati teme, zadatke i veze ručno sa prethodnog časa. Tačan redosled provera nalazi se u smernicama.

## Različite vrste rada i nove nedelje · 09.10.2026.

Zbirka sada obuhvata i tehnički crtež Lego4ll i nastavnikov prototip zvečke sa četiri fotografije. Oba pripadaju dokumentovanoj nedelji 2. `kind` razdvaja `technical-drawing` i `prototype` (izostavljeno na starim zapisima znači postojeći prototip); `authorRole` može biti `student` ili `teacher`; `status: documented` ne tvrdi donošenje ili testiranje. `medium: drawing` je crtež. `author` sadrži ime i samo dostavljeni indeks, a `attribution.fields` tačno prisutna lična polja. Ne nagađati indeks niti `originWeek`: za nova dva rada nisu dostavljeni. Četiri slike zvečke pripadaju jednom radu.

Originalna fotografija tehničkog crteža ostaje nepromenjena; `photos[].rotation: -90` okreće samo prikaz preko zajedničkog renderer-a i CSS-a. Podržane su -90, 90 i 180 stepeni, bajtovi/SHA i originalne dimenzije ostaju izvorni. Generativna rekonstrukcija se ne koristi kao tehnička dokumentacija. Zapažanja iz udruženja i dalje su zaseban događaj uz potvrđen izvor.

Pregled održanih časova i birač radnih nedelja prikazuju najnovije prvo; ne unositi ručno obrnut HTML niti menjati pedagoški redosled faza A/B/C semestralnog plana. Redosled proveriti sa najmanje tri izmešane nedelje.
