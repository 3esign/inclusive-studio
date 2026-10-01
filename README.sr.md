# Inclusive Studio

**Principi univerzalnog dizajna** · Univerzitet „Union — Nikola Tesla”, Beograd · Fakultet za graditeljski menadžment
doc. dr Semir Poturak · 2026/2027, prvi (zimski) semestar · treća godina
Studijski programi: Arhitektura i urbanizam 2023 (`22.OA0068`, 5 ESPB) i 2016 (`OAIPUD`, 4 ESPB)

**Jedno mesto, šest faza, zajedničke arhitektonske odluke.**

[Otvori studio](https://3esign.github.io/inclusive-studio/) · [English](README.md)

Radni prostor za studente treće godine arhitekture i koautore iz udruženja osoba sa invaliditetom. Pilot je predlog; fakultet, predmet, udruženje, lokacija, raspored, bodovi i zvanično ocenjivanje još nisu potvrđeni.

Studio povezuje konkretne zadatke, arhitektonske rezultate, proveru rada, kalendar, biblioteku i javnu tablu. Šest faza nije šest nastavnih nedelja. Jedna faza može imati više susreta, konsultacija i rokova.

Tekst nacrta čuva se u pregledaču kada je to dozvoljeno. Slike i skice se ne čuvaju automatski. Izbor fajla daje lokalni pregled; fajl ili preuzetu PNG skicu samostalno prilažeš u GitHub nacrt. GitHub nalog je potreban za javnu objavu teksta. Fajl dodat u GitHub editor šalje se odmah, pre objave teksta, i javno je dostupan. Objavljivanje ne registruje zvaničnu predaju na predmetu ni ocenu. Kontakt za podržanu predaju još treba imenovati.

Engleski i srpski interfejs, jednostavan prikaz, tastatura, vidljiv fokus, lista događaja uz kalendar i tekstualni put nezavisan od crtanja. WCAG 2.2 AA je cilj; provera sa korisnicima asistivnih tehnologija još predstoji. Sajt nije oflajn aplikacija.

Stvarni termini unose se u [data/schedule.json](data/schedule.json), prema [uputstvu](docs/calendar.md). Nepotvrđeni datumi se ne izmišljaju. Tehničke pojedinosti i ograničenja su u engleskom README-u.

Biblioteka sada ima 17 izvora, četiri arhitektonske vežbe i jednu pregledanu skicu iz zbirke „Živimo zajedno”, sa opisom i označenim nepoznatim podacima. Tekstualni nacrt može da se preuzme i ponovo uveze kao JSON. Dostupni su veći tekst, jači kontrast i neobavezan haptički ogled sa tekstualnim odgovorom. [Čuvanje i prijava](docs/storage.md).

## Kako je sajt uređen

Prva strana je **radna nedelja**: građa koju je nastavnik uneo za taj čas, zadatak i ogledi na koje
upućuje. Sve ostalo — predmet, kalendar, projekat, vežbe, biblioteka, tabla, faze — stoji iza nje.

- **Nedelja** (`index.html`) — naslov, cilj, šta se donosi i građa časa, iz `data/material/wNN.json`.
  Nema fajla, nema nedelje: strana to kaže umesto da izmisli čas.
- **Predavanje** (`predavanje.html`) — ista građa isečena na slajdove na svakom naslovu. Strelice,
  Space, Home, End; na telefonu i prevlačenje. Ništa se ne pomera samo.
- **Laboratorija** (`laboratorija.html`) — osam kratkih ogleda: čitač ekrana nad tvojim kodom; put
  tastaturom kroz formu sa zamkom fokusa i bez nje; jedan prekidač sa automatskim skeniranjem;
  kontrast, veličina cilja i prelom po WCAG 2.2; ko ne dobija alarm; osnova na mreži od 10 cm po
  čl. 14, 17, 18 i 19 Pravilnika; aritmetika 22,5 m visine; i odbrojavanje nad administrativnom
  rečenicom. Svaki ogled daje broj i onda traži projektantsku odluku.
- **Zadatak** (`zadatak.html`) — prvi dan: aplikacija za jednu osobu, rukom, uz izvučenu karticu
  ograničenja i neobavezno platno u veličini telefona koje stalno pokazuje stvarne minimume.
- **Pripremi gradivo** (`uredi.html`) — nastavnik piše nedelju, alat je proverava po pravilima samog
  sajta i predaje fajl za upis. Uputstvo: [docs/gradivo.md](docs/gradivo.md).

**Bez simulacije invaliditeta.** Ogledi proveravaju alate, interfejse i geometriju — nikad osobu.
Posle simulacija ljudi prijavljuju više empatije, ali i više sažaljenja i nelagode, i nisu spremniji
da sa osobama sa invaliditetom rade na projektu pristupačnosti (Nario-Redmond i dr., 2017). Pomaže
strukturirana vežba sa stvarnim alatom i debrif; projekat menja koautor sa invaliditetom.
