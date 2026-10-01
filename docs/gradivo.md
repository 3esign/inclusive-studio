# Gradivo radne nedelje — kako se unosi

> Working material for a week — how it is added. Serbian first; an English summary follows.

Ceo sajt ima **jednu glavnu sekciju**: radnu nedelju (`index.html`). Sve ostalo — predmet, kalendar,
projekat, vežbe, biblioteka, tabla, faze — stoji iza nje kao građa. Predavanje (`predavanje.html`)
ne postoji odvojeno: ono je ista nedelja isečena na slajdove.

## Gde stoji

```
data/material/index.json     popis nedelja + koja je trenutna
data/material/w01.json       gradivo prve nedelje
data/material/w02.json       ...
```

Jedna nedelja = jedan mali fajl. Sajt prikazuje **samo ono što u tim fajlovima piše**. Ako nedelje
nema, strana to kaže; ne izmišlja čas.

## Dva načina da se unese

**1. Kroz uređivač (preporučeno):** [`uredi.html`](../uredi.html) → upiši naslov, cilj, šta se donosi
i upise (naslov, pasus, lista, citat, mera, slika, veza, fajl, ogled, vežba, pitanja, odluka) →
„Prolazi li?” pokazuje šta blokira → „Prekopiraj fajl” → „Napravi fajl na GitHubu” i upiši.
Nacrt se čuva u pregledaču dok radiš.

**2. Direktno na GitHubu:** otvori `data/material/wNN.json`, izmeni, upiši. Isti fajl, isti rezultat.

Nova nedelja traži i **jedan red u `index.json`** (`n`, `file`, `state`, `title`), a `current` se
postavlja na broj nedelje koja se trenutno drži. Uređivač ispiše tačno taj red.

## Pravila koja fajl mora da ispuni

Ova pravila sprovodi i uređivač i test (`tests/material.test.mjs`) — nisu preporuka:

| Pravilo | Zašto |
|---|---|
| Slika bez opisa ne prolazi | Slika bez opisa nije građa; mašina pročita ime fajla. |
| Mera bez instrumenta ne prolazi | Vrednost bez nesigurnosti nije mera nego utisak. |
| Citat bez izvora ne prolazi | Citat bez izvora je glasina. |
| Datum bez statusa (`confirmed` / `proposed`) ne prolazi | Nepotvrđen termin se ne prikazuje kao potvrđen. |
| `state: "draft"` se ne vidi bez `?draft=1` | Nedovršen čas ne izlazi pred salu slučajno. |
| Veza sme biti samo `http(s):`, `mailto:` ili relativna | `javascript:` i `data:` ne ulaze u stranu. |

## Kako nastaje predavanje

Svaki **naslov** (`heading`) počinje nov slajd; sve ispod njega pada na taj slajd. Građa bez
naslova je jedan slajd. Ništa se ne gubi — to proverava test. U predavanju rade strelice, Space,
Home i End, na telefonu i prevlačenje; ništa se ne pomera samo. „Prikaži sve” daje istu građu kao
jedan dokument (i za štampu).

## Slike i fajlovi

JSON nosi adresu, ne sadržaj. Dve mogućnosti:

1. Upiši fajl u `assets/material/` u repozitorijumu i koristi relativnu adresu.
2. Prevuci sliku u GitHub temu (issue), pa prekopiraj adresu koju GitHub vrati. **Fajl se na GitHub
   šalje odmah po ubacivanju u uređivač, pre nego što objaviš temu.**

Opis slike je obavezan u oba slučaja.

## Ogledi i vežbe u gradivu

Upis tipa `lab` ili `exercise` nosi samo `ref` — identifikator postojećeg ogleda
(`assets/lab-core.js`) ili vežbe (`assets/exercises.js`). Naslov i opis se povlače odatle, pa se ne
prepisuju na dva mesta. Test pada ako nedelja pokaže na ogled ili vežbu koja ne postoji.

---

## English summary

The site has one main section: the working week (`index.html`). A week is a single JSON file in
`data/material/`, listed in `data/material/index.json`. Write it either in the browser editor
(`uredi.html`, which checks it and hands you the file plus a GitHub commit link) or directly on
GitHub. The lecture view is the same material cut into slides at every heading.

The file is refused unless: images carry a description, measurements name an instrument, quotes
name a source, a date declares whether it is confirmed or proposed, and links use http(s), mailto
or a relative path. Drafts stay invisible until `?draft=1`. The same rules run in
`tests/material.test.mjs`, so a broken week fails the test suite, not the lecture.
