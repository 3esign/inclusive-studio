# Evidencija predmeta — šta je zatvoreno, šta nemamo (presek 23.10.2026, dopunjen uveče)

Pregled svega što je nastavnik dostavio do danas, upoređeno red po red: spisak trećeg časa
(izvor 18.10.2026), spisak četvrtog časa (izvor 23.10.2026), registar posete 23.10, registar
radova i tok predmeta. Imena i brojevi indeksa nisu u ovom dokumentu — po pravilu sajta stoje
samo u registrima i u redovima spiska. Ovde se govori brojem reda.

## Zatvoreno 23.10.2026

Prvi talas, popodne:

- **Razdvajanje fotografija, treći čas, redovi 17–20.** Sva tri niza fotografija pripisana su
  imenima iz sledećeg reda. Tri rada vraćena u galeriju, revizije v37–v39 nose before/after.
- **Prezime autora reda 19 (treći čas)** potvrđeno; revizija v40.
- **Broj indeksa reda 27 (četvrti čas)** ispravljen: delovi su bili zamenjeni, godište je 2024.
- **Dva preimenovanja** zavedena (red 9 i red 25 četvrtog časa).

Drugi talas, uveče (izvor `teacher-2026-10-23-dopuna`):

- **Naziv rada reda 4 četvrtog časa** je **„putanja”**. Pitanje zatvoreno.
- **Naziv „brza putanja”** pripisan je radu **reda 20 trećeg časa** — jedinom redu koji je posle
  razdvajanja ostao bez rada. Uslovno, bez fotografije; potvrda se i dalje traži od studentkinje.
- **Broj indeksa reda 18 trećeg časa / reda 8 četvrtog** razrešen: važi onaj iz spiska od 18.10.
  Razlika zapisana 23.10. bila je omaška u prepisu, ne prijava studentkinje. Revizija v41.
- **Godišta van generacije 2024** (redovi 7, 19 i 26 trećeg časa, red 24 četvrtog) potvrđena su
  kao ispravna: predmet slušaju i studenti koji nisu položili godinu. Tri pitanja zatvorena,
  revizija v42 za red 19.
- **„starlight 6 + 3”** su **dva rada istog autora**, ne jedan niz od devet fotografija.
  Revizija v43; razdvajanje kadrova čeka prenos fotografija.
- **Autorstvo „kubismo”** nije sporno; otvoren je ostao samo naziv (vidi stavku 3 ispod).
- **Poseta udruženju 23.10.** zavedena kao zaseban registar: `data/poseta-2026-10-23.json`,
  17 imena, redom kako ih je nastavnik zapisao. Prikazuje se na strani četvrtog časa.
- **Prisustvo na predavanju do sada nije vođeno** — zapisano kao granica evidencije, ne kao
  propust koji se krije. Spiskovi zavode one koji su se pojavili u spisku radova i na poseti.

## Nemamo — podatak koji se traži od studenta ili nastavnika

| # | Šta nije jasno | Gde stoji otvoreno |
|---|---|---|
| 1 | **Rad reda 20 trećeg časa.** „brza putanja” mu je pripisana kao najverovatnije rešenje, bez fotografije. Je li to njen rad i je li bio donet? | `cas-03.html` → `miljana-brza-putanja` |
| 2 | **Naziv rada bez zapisa:** redovi 15 i 26 četvrtog časa; redovi 1, 2 i 26 trećeg. | oba spiska |
| 3 | **„kubismo” ili „Lego4ll”** — autor je poznat, naziv nije. Fotografije pokazuju dva različita artefakta (prototip i CAD crtež), pa je verovatno isto kao „starlight”: dva rada. | `cas-03.html` → `kubismo-ili-lego4all` |
| 4 | **Red 29 trećeg časa bez broja indeksa.** | `cas-03.html` → `castle-bez-indeksa` |
| 5 | **Jedno ime je bilo na poseti udruženju, a nije u spisku radova četvrtog časa** — osamnaesto prisustvo tog dana, bez zavedenog rada. | `cas-04.html` → `copic-van-spiska` |
| 6 | **Nema spiska upisanih studenata.** Dok ga nema, „prisutan / nije prisutan” se ne može izračunati — samo „pojavio se u evidenciji”. Nastavnik je potvrdio da prozivku nije vodio. | `cas-04.html` → `prisustvo-nije-prozivka` |
| 7 | **Prvi i drugi čas nemaju spisak prisustva.** Održani su (02.10. i 09.10.); evidencija za njih ima radove prvog talasa i spisak posete od 09.10. | `data/tok.json` |
| 8 | **Veza kadra i rada nije potvrđena gledanjem.** Pregled fotografija 23.10. (`docs/ANALIZA-FOTOGRAFIJA-2026-10-23.md`) našao je foldere u kojima dva kadra prikazuju dva različita predmeta — rez niza je verovatno promašen i izvan redova 17–20. | taj dokument, odeljak 1 |

## Nemamo — materijal koji je kod nastavnika ili na arhivskom telu

1. **87 fotografija četvrtog časa** (prototipi, pa udruženje) su još na telefonu. Kad se prenesu:
   `data/cas-04/slike/<rb>-<slug>/`, pa `node tools/cas-prihvat.mjs 04` — alat uporedi nađeno sa
   brojem iz spiska i prijavi odstupanje, registar ne dira.
2. **44 od 86 fotografija trećeg časa nisu u ovom repou.** Registar objavljuje 42; ostatak je
   20.10. arhiviran na telo 3izajn (tar SHA proveren na oba kraja) i lokalna kopija je obrisana.
   Posledica: redovi 1 i 2 trećeg časa nemaju ni jednu objavljenu fotografiju ni zapis u galeriji,
   iako spisak za njih navodi dvanaest fotografija. **Ovaj niz treba vratiti ceo** — bez njega se
   rezovi iz stavke 8 ne mogu ispraviti.
3. **23 fotografije posete udruženju** (09.10.) stoje povučene iz objave dok nastavnik ne
   potvrdi natpise. Poseta od 23.10. još nema nijednu fotografiju.
4. **Peti čas nije upisan** (`tok.json → sledeci: []`), a kalendar je `unconfirmed` bez ijednog
   događaja. Datum i naziv dolaze od nastavnika.

## Brojevi preseka

- Održano: četiri časa (02.10, 09.10, 16.10, 23.10) i dve posete udruženju (09.10, 23.10).
- Treći čas: 29 redova, 86 fotografija po spisku, 42 objavljene.
- Četvrti čas: 27 redova, 21 fotografisan rad, 87 fotografija — nijedna još prenesena.
- Poseta 23.10: 17 zavedenih imena, 0 fotografija u registru.
- Galerija radova: 34 rada, 64 fotografije, 43 revizije.
- Otvorenih pitanja na stranama: treći čas 4, četvrti čas 5.
- Baterija: 237 testova, 233 prolaza, 0 padova, 4 preskočena (sirovi prijem nije u ovoj kopiji).
