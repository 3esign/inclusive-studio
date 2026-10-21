# Prijem nastavnog materijala · pravilo 21.10.2026.

Ova nastavnikova ispravka ima prednost nad starijim opisima spiska i redosleda. Header ostaje: Naslovna, Održano, Sledeći čas, Izvori, Oblak ideja. Održano se sortira po datumu opadajuće. Naslovna raste odabranim stvarnim radovima i sažecima. Na studentskoj površini ostaje nastavni sadržaj, ne stanje prenosa, tehnički problemi i pitanja iz obrade materijala.

## Jedan prilog, dve nezavisne veze

`data/prototipovi.json` ostaje jedini registar. `items` čuva ranije zapise i atribucije; `galleries` grupiše slike istog predmeta bez autora. Galerija ima stabilan ID, nastavnu nedelju, izvor i svaku fotografiju sa otiskom, dimenzijama i opisom. Autor se ne zaključuje iz broja slika, naziva foldera, rednog broja, datuma ili otiska. Izričita dozvola za imena nije dokaz koje ime pripada kojoj fotografiji.

Treći čas ima 20 vizuelno pregledanih galerija sa 73 fotografije. Kutija je jedna galerija od 7 slika; Touch 5; visoka staza u kutiji 6; prostorna kartonska staza 4; Castle 3 fotografije iz WhatsApp-a (rolne i plava staza). Sudoku skica ima 2 prikaza. Naslovi ostalih galerija su opisi vidljivog predmeta, ne preuzeti naslovi iz spiska. Fotografija Zmijicine skice nije pouzdano prepoznata; ne menjati je proizvoljnom slikom beležnice.

Istorijski `items` treće nedelje i `data/cas-03/spisak.json` ostaju dokaz prethodne obrade. Javna kapija ih ne koristi. Stari importer i `uloge-slika.json` nisu dozvoljeni put za novo povezivanje fotografija: globalno odbacivanje prve/poslednje slike po folderu bilo je pogrešno. `_config.yml` isključuje tu evidenciju iz Pages prikaza; ovo nije brisanje iz istorije javnog Git repozitorijuma.

## Sledeći talas

1. Pročitaj novu poruku i prethodnu važeću instrukciju. Razdvoji opšti šablon, OR i PUD; novija konkretna ispravka ima prednost. Zabeleži izvor, datum i namenu.
2. Smesti original u privatni projektni prijem. Evidentiraj bajtove i poreklo; proveri Camera i relevantne aplikacijske foldere. Ne kopiraj nepovezane fotografije u javni projekat.
3. Pregledaj svaki kadar u dovoljnoj veličini. Grupisanje zasnivaj na stvarnom predmetu i nastavnikovom objašnjenju. Kada nije jasno, zadrži pitanje u prijemu. Ne objavljuj pretpostavljenu atribuciju.
4. Dodaj galeriju u postojeći registar; ne preimenuj stare ID-jeve. Galerija nije automatski nov prototip ili novi autor. Stariji radovi i njihove slike ne menjaju nedelju uvođenjem novog talasa.
5. Napiši kratak nastavni sažetak u `tok.json`; detalje u odgovarajućem `wNN.json`, uz novu reviziju. Najava ostaje priprema dok nastavnik ne potvrdi održavanje. Ideje nisu obaveze.
6. Generiši javni izvod, pojedinačne galerije, naslovnu i tok:

   `node tools/prototipovi.mjs`

   `node tools/cover.mjs`

   `node tools/held-baseline.mjs`

   `node tools/next-baseline.mjs`

   `node tools/cas03-baseline.mjs`

   `node tools/shells.mjs`

7. Proveri identičnost statičkog i živog prikaza, foto-grupe, najnoviji čas prvi, očuvane ranije nedelje, SR/EN, telefon, tastaturu i rad bez JavaScript-a. Pokreni testove i checkpoint gate iz `docs/checkpoints.md`. Broj zelenih testova nije zamena za vizuelni pregled; test koji čuva pogrešnu pretpostavku ispravi uz izvor.
8. U ovlašćenom obimu objavi imenovane putanje. Proveri Pages build i stvarne URL-ove. Ostavi commit, dokaz, nejasnoće i sledeći korak u projektnom tragu.

## Dizajn prema sadržaju

Za ovu izmenu razmotreni su fotografska urednička naslovna i prostorna polica radova. Izabrana je prva: stvarni predmeti daju karakter, serifni naslov i mirna hijerarhija pomažu čitanju; dodatna 3D interakcija ne doprinosi ovom zadatku. Drugi zadatak može opravdati 2D alat, animaciju ili 3D prostor. Ovo nije univerzalni vizuelni šablon za OR ili ostale sajtove.
