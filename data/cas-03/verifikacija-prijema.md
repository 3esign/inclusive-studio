# Verifikacija prijema fotografija — treći čas (16.10.2026)

Provereno: 2026-10-19, posle popune `slike/` (paralelni um, prijem završen ~00:03).

## Šta je mereno

`sha256sum` svih 109 fotografija 16.10. na telefonu (`/storage/emulated/0/DCIM/Camera`,
preko Termux SSH tunela — `node tools/phone_ctl.js`, Tailscale) protiv svih 109 fajlova
u `slike/` (86 po radima + 23 u `poseta-udruzenje/`), nezavisno povučenih na PC.

## Rezultat

- **109/109 heševa identično** — svaki lokalni fajl je bajt-veran original sa telefona.
- **0 duplikata** u heš-skupu — nijedna fotografija nije dodeljena dvaput.
- **86 = zbir po `spisak.json`** — svi redovi osim rb 20 (bez fotografija po spisku; ime se vodi samo u registru).
- **Hronologija bez rupa i preklapanja:** rb1 08:46 → rb2 do 11:03 → rb3–rb29
  12:22–13:28 → `poseta-udruzenje/` 13:29–14:06. Redosled slikanja monoton kroz ceo niz.
- `prihvat.json`: 86 slika čita dimenzije, 0 nečitljivih. `predlog-registra.json`: 28 stavki.

## Otvoreno za nastavnika

1. **`poseta-udruzenje/` (23 fotografije, 13:29–14:06)** — van brojanja spiska. Ako treba
   na stranu posete/analize, traži svoj zapis i izvore po pravilima sajta.
2. **rb 20** — bez fotografija po spisku; ostaje „čeka potvrdu”.
3. Spisak beleži redosled slikanja prema jutarnjim fotografijama za rb 1–2 (08:46–11:03) —
   potvrđeno vremenom nastanka fajlova, ali atribucija i dalje ide kroz predlog registra,
   ne automatski.

Registar `data/prototipovi.json` NIJE diran — spajanje ide pregledom `predlog-registra.json`.
