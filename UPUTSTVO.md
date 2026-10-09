# inclusive-studio — Uputstvo za izradu

Ovo je projektni rails: kako se TAČNO ovaj projekat pravi i kako novi agent nastavlja bez nagađanja. Gradi se kroz rad: svaka nova tehnika ili pravilo izrade ide ovde.

## Kako agent ulazi

1. Pročitaj `README.md` za smisao i status.
2. Pročitaj ovaj `UPUTSTVO.md` za pravila izrade.
3. Pročitaj poslednje redove `LOG.md` za tok rada.
4. Pročitaj `RECNIK.jsonl` za pojmove i komentare.
5. Pročitaj `KNOWLEDGE.md` za greške, iskustva, izvore, veštine i odluke.

## Kako se popunjava LOG.md

- Upisuje se svaka stvarna promena ili provera: vreme · um · radnja · rezultat.
- Ne prepravljaj stare redove; korekcija je novi red.
- Rezultat treba da kaže `ok`, `fail` ili `partial`, uz kratak razlog kad nije jasno.
- Ako je nešto provereno testom, napiši koji test.

## Kako se popunjava RECNIK.jsonl

- Jedan red je jedan JSON objekat.
- Koristi pojmove koje projekat stvarno ponavlja: keyword, lokalno značenje, komentar i izvor.
- Minimalno: `{"term":"pojam","definition":"značenje u ovom projektu","source":"README.md","at":"ISO vreme"}`.
- Ako je pojam komentar, ne odluka, stavi to u `definition` jasno: `komentar: ...`.
- Ne dupliraj isti pojam; ako se značenje promeni, dodaj novo objašnjenje u `KNOWLEDGE.md` ili odluku.

## Kako se popunjava KNOWLEDGE.md

- Greška ide u `# Greske`: uzrok i lek u jednoj ili dve rečenice.
- Iskustvo ide u `# Iskustva`: šta bi sledeći agent inače morao ponovo da otkrije.
- Izvor ide u `# Izvori`: link, fajl ili merenje iz kog tvrdnja dolazi.
- Odluka ide u `# Odluke`: šta je izabrano i zašto.

## Pravila izrade

- Pre rada pročitaj kanonske veštine `C:/Svemir/skills/univerzitet/SKILL.md`, `C:/Svemir/skills/svemir-design/SKILL.md` i `C:/Svemir/skills/svemir-provereno-pisanje/SKILL.md`; za ovaj sajt prati design referencu za akademske predmete. Sačuvaj odobrenu naslovnu kompoziciju, razdvoji predavanja, pripremu, ideje i izvore.
- Pre izmene sačuvaj tačan početni Git commit i kontrolnu tačku kroz `tools/course-checkpoint.mjs`; detalji i povratak u zasebnu kopiju su u `docs/checkpoints.md`. Store ide van javnog stabla. Prvi snimak čuva postojeće stanje, ne potvrđuje njegov kvalitet niti nastavničko odobrenje.
- Posle izmene pokreni `npm run verify:course -- --base <početni-puni-Git-SHA> --store <privatna-apsolutna-putanja-van-sajta>`. Komanda proverava istoriju prethodno objavljenog materijala, vraća snapshot u novu zasebnu kopiju i tamo pokreće sve testove. Proverava identičnost te kopije i da izvor nije promenjen tokom provere, pa ostavlja receipt uz snapshot. Ako padne, nema tvrdnje da je verzija spremna. Za eksplicitno odobrene putanje dodaj `--official <manifest> --official-sha <nezavisno-proveren-SHA>`.
- Status `published` nije dokaz konačnog gradiva. `data/course-publication.json` razlikuje materijal održanog časa od izričito finalizovanog materijala; nijedan nacrt se ne proglašava završenim. Prvi zapis čuva postojeći materijal prvog održanog časa, bez naknadnog proglašavanja svih njegovih tvrdnji zvanično odobrenim. Promena heša nije rutinska „popravka testa”: zahteva pregled sadržaja i stvarni izvor odluke.
- `predavanje.html?preview=1&w=N` je jasno označen radni pregled, dostupan i kad registar objave nije dostupan. Običan link proverava status i identičnost fajla gradiva. Ovaj heš ne zamrzava banke vežbi/slike/render; za potpunu verziju koristi ceo checkpoint i proveru zavisnosti iz `docs/checkpoints.md`.
- Pre predaje vizuelno proveri stvarne stranice na 320 px i desktopu: prelom, srpski/engleski režim, slike, tastaturu i smanjeno kretanje. Testovi ne zamenjuju taj pregled. Ne unosi implementacione putanje i razvojni žargon u studentska uputstva kada studentu ne pomažu.
- Provera i checkpoint sami ne objavljuju sajt. Aktuelni glavni um koordinira imenovane putanje, proverava tačne bajtove iz receipt-a i postojeće ovlašćenje za objavu; povratak ne radi preko destruktivnog resetovanja tuđeg rada. Remote zaštita grane nije automatski uključena ovim lokalnim alatom.

## Faze

- (definisati kroz `phase next`)
