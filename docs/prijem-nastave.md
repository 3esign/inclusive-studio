# Prijem materijala sa časa — postupak koji sledeći talas slaže sam

Presek 21.10.2026. Ovaj postupak je napisan iz greške koja se tri puta vraćala: spisak radova
i niz fotografija poklapaju se **samo ako se zna gde niz počinje**, a to se ne vidi iz imena
foldera ni iz zbira brojeva.

## 1. Sačuvaj izvor pre bilo čega

Originalni kadrovi idu u arhivu na telu sa prostorom (`D:\Svemir\archive\<predmet>-<cas>-<datum>`),
sa svojim vremenima izmene. **Vremena su dokaz i ne smeju se izgubiti kopiranjem bez `-p`.**
Optimizovane kopije za sajt nemaju EXIF; arhiva je jedino mesto gde se vreme snimanja čita.

## 2. Popiši priloge po izvoru, ne po folderu

Kamera, WhatsApp i upload su različiti izvori i stižu u različito vreme. Folder u arhivi je
pretpostavka nekog ranijeg uma, ne činjenica. Castle je dva puta bio pogrešan jer je ime
foldera prihvaćeno kao nalaz: tri prave fotografije bile su u WhatsApp-u, a tri susedna kadra
sa telefona su Erazmus slajdovi.

## 3. Nađi početak niza gledanjem, pa ga potvrdi vremenom

Nastavnikov spisak počinje od prvog rada. Pre njega u rolni može stajati bilo šta — 16.10.2026.
stajalo je dvanaest kadrova: pantalone koje je kamera uhvatila i diplomske prezentacije.
Primena spiska od prvog kadra pomerila je svaki rad za dvanaest mesta i dala jednom predmetu
imena više studenata. Početak se nalazi tako što se otvori prvi kadar koji prikazuje rad, pa
se vreme tog kadra uporedi sa ostalima: niz rada je gust (minuti), ono ispred njega je retko.

## 4. Čitaj niz kroz sve prostorije

Snimanje se ne prekida na vratima učionice. 16.10.2026. niz teče 12:22–13:28 u učionici pa
13:29–14:06 na praktičnim vežbama u udruženju, bez prekida — poslednjih sedam radova sa spiska
slikano je tamo. Folder je bio nazvan „poseta-udruzenje” i vezan za raniji datum; vremena su
to opovrgla. **Ako spisku „nedostaju” kadrovi, pretpostavka je pogrešna pre nego što su kadrovi
izgubljeni.**

## 5. Zatvori zbir

Ukupno primljeno = ono ispred niza + zbir svih radova sa spiska + kadrovi probanja na kraju.
Dok zbir ne zatvori **bez ostatka**, presek nije gotov. 16.10.2026: 12 + 86 + 11 = 109.

## 6. Veži sliku za rad sa tri potvrde

Veza fotografije i rada drži kad se slože **sve tri**:

1. predmet prepoznat na kadru (gleda se, ne pretpostavlja),
2. broj kadrova jednak broju sa spiska,
3. vreme koje pada u očekivani deo niza.

Jedna potvrda sama nije dokaz. Broj kadrova je najslabija — po njemu su nastale sve dosadašnje
greške. Ako se tri potvrde ne slažu, red ostaje imenovan i označen kao da čeka; ne popunjava se
najbližim slobodnim kadrom.

## 7. Razdvoji rad od probanja

Kadrovi koji prikazuju predmet su rad. Kadrovi koji prikazuju ljude kako rad isprobavaju su
zapažanje: idu kao tekst uz rad, sa datumom i izvorom, a slike ostaju van serviranja dok za
njih ne postoji zasebna saglasnost. Nijedan opis interakcije ne sme biti napisan sa kadra na
kome je više radova odjednom — tako je nastala „Pogodilica” koju nijedna fotografija ne pokazuje.

## 8. Objavi tek posle gledanja

`npm test` i `npm run verify:course` hvataju strukturu, ne sadržaj. Pre objave se otvara stvarna
stranica: naziv, indeks i ime uz rad, broj slika, mobilni prikaz, SR/EN. Zeleni testovi nisu
potvrda da je slika kod pravog studenta.

## 9. Povlačenje se zapisuje

Zapis koji izlazi iz registra ide u `povuceno` sa celim sadržajem, datumom, izvorom i razlogom.
Provera osnovne linije odbija brisanje bez takvog zapisa. Pravilo nije „ništa se ne briše”, nego
**ništa ne nestaje nemo**.
