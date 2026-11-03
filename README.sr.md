# Inclusive Studio

## Smer rada · 04.10.2026

Nastavnik određuje glavni tok tema, održana predavanja i zadate zadatke. Postojeće banke ideja i izvora ostaju otvorene zbirke. Nova stavka nije automatski zadatak; [istraživačke beleške](docs/research-roadmap.md) vode do dopune.

Lokalni zapis u w01 navodi održan čas 02.10. i zadat prototip za sledeći susret. W02 je objavljena priprema; w03–w15 su nacrti. Objavljeno nije isto što i održano. Zabeležena poseta predstavnika udruženja Živimo zajedno ne potvrđuje buduće terenske termine ni dalje dogovore.

**Principi univerzalnog dizajna** · Univerzitet „Union — Nikola Tesla”, Beograd · Fakultet za graditeljski menadžment
docent, doktor nauka · 2026/2027, prvi (zimski) semestar · treća godina
Studijski programi: Arhitektura i urbanizam 2023 (`22.OA0068`, 5 ESPB) i 2016 (`OAIPUD`, 4 ESPB)

**Jedno mesto, šest faza, zajedničke arhitektonske odluke.**

[Otvori studio](https://3esign.github.io/inclusive-studio/) · [English](README.md)

Radni prostor za studente treće godine arhitekture i koautore iz udruženja osoba sa invaliditetom. Identifikacioni podaci predmeta i programa potiču iz dosijea. Plan od petnaest nedelja je radna verzija; fond časova, budući termini, sala i obim daljih dogovora ostaju za potvrdu.

Studio povezuje konkretne zadatke, arhitektonske rezultate, proveru rada, kalendar, biblioteku i Atelje ideja. Šest faza nije šest nastavnih nedelja. Jedna faza može imati više susreta, konsultacija i rokova.

Studentima nisu potrebni ni prijava ni GitHub nalog. Svaka nastavna nedelja vodi do jednog fizičkog A3 lista: student ga donosi na čas, razgovara sa nastavnikom i na papiru dobija potpis. Sajt daje uputstva, gradivo i alate; ne vodi prisustvo, ocene niti digitalne predaje. GitHub tabla je samo neobavezan javni prostor za ideje i odobrene reference projekata.

Sajt ima interfejs na engleskom i srpskom, jednostavan prikaz, podršku za tastaturu, vidljiv fokus, listu događaja uz kalendar i tekstualni put nezavisan od crtanja. WCAG 2.2 AA je cilj; provera sa korisnicima asistivnih tehnologija još predstoji. Sajt nije oflajn aplikacija.

Stvarni termini unose se u [data/schedule.json](data/schedule.json), prema [uputstvu](docs/calendar.md). Nepotvrđeni datumi se ne izmišljaju. Tehničke pojedinosti i ograničenja su u engleskom README-u.

Biblioteka sada ima 17 izvora, četiri arhitektonske vežbe i jednu pregledanu skicu iz zbirke „Živimo zajedno”, sa opisom i označenim nepoznatim podacima. Atelje ideja povezuje nedovršene zamisli i pretvara ih u mali proverljiv potez na A3 listu; beleška ostaje samo u pregledaču dok je korisnik ne preuzme. Dostupni su veći tekst, jači kontrast i neobavezan haptički ogled sa tekstualnim odgovorom. [Gde sadržaj živi](docs/storage.md).

## Kako je sajt uređen

Prva strana je **tok predmeta**: zacementirani časovi redom — svaki sa svojom građom i A3 listom
nedelje ka radnoj svesci za ispit — pa pilot za sledeći čas, pa oblak ideja. Svaka nedelja
završava se jednim A3 listom, razgovorom i potpisom na papiru. Traka toka u zaglavlju svake strane
drži tri police na dohvat. Sve ostalo — predmet, kalendar, projekat, vežbe, biblioteka, Atelje
ideja i faze — stoji iza nje.

- **Tok predmeta** (`index.html`) — landing: tri police iz `data/tok.json`, pri čemu zacementirani
  časovi pokazuju i A3 list nedelje izvučen iz `data/material/wNN.json`. Duboka veza
  (`index.html?w=N`) otvara nedelju: naslov, cilj, šta se donosi i građa časa.
  Nema fajla, nema nedelje: strana to kaže umesto da izmisli čas.
- **Predavanje** (`predavanje.html`) — ista građa isečena na slajdove na svakom naslovu. Strelice,
  Space, Home, End; na telefonu i prevlačenje. Ništa se ne pomera samo.
- **Laboratorija** (`laboratorija.html`) — osam kratkih ogleda: čitač ekrana nad tvojim kodom; put
  tastaturom kroz formu sa zamkom fokusa i bez nje; jedan prekidač sa automatskim skeniranjem;
  kontrast, veličina dodirne mete i prelom prema WCAG 2.2; ko ne dobija alarm; osnova na mreži od 10 cm po
  čl. 14, 17, 18 i 19 Pravilnika; proračun savladavanja visinske razlike od 22,5 m; i odbrojavanje nad administrativnom
  rečenicom. Svaki ogled daje broj i onda traži projektantsku odluku.
- **Zadatak** (`zadatak.html`) — sačuvana vežba aplikacije za jednu osobu i neobavezno platno u veličini telefona. Dnevnik je premešta u nacrt osme nedelje. Na zabeleženom prvom času rađeni su koncepti igračaka; sledeći zadati korak je prototip.
- **Atelje ideja** (`ideja.html`) — odvojen prostor za istraživanje i povezivanje zamisli. Nije
  nedelja, evidencija niti predaja; dobra veza iz ateljea može kasnije postati nedeljni zadatak.
- **Pripremi gradivo** (`uredi.html`) — nastavnik piše nedelju, alat je proverava po pravilima samog
  sajta i daje fajl za upis u repozitorijum. Uputstvo: [docs/gradivo.md](docs/gradivo.md).

**Bez simulacije invaliditeta.** Ogledi proveravaju alate, interfejse i geometriju — nikad osobu.
Posle simulacija ljudi prijavljuju više empatije, ali i više sažaljenja i nelagode, i nisu spremniji
da sa osobama sa invaliditetom rade na projektu pristupačnosti (Nario-Redmond i dr., 2017). Pomaže
strukturirana vežba sa stvarnim alatom i zajednička analiza posle vežbe; projekat menja koautor sa invaliditetom.
