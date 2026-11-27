# Where the course data comes from

Everything the site publishes about the course is traceable to a source held in the course dossier
`!Projekti/Univerzitet/nastava/beograd-unt-fgm/pud/`. Read on 1 October 2026. This file exists so a
later reader can tell a verified fact from a working proposal without opening the dossier.

## Verified — from the faculty examination record, 27 August 2026

| Fact | Value | Where it comes from |
|---|---|---|
| Institution | Univerzitet „Union — Nikola Tesla”, Fakultet za graditeljski menadžment, Beograd | examination record |
| Teacher | docent, PhD — the name stays in the faculty's record, not on the site | examination record |
| Programme 2023 | Arhitektura i urbanizam, code `22.OA0068`, semester 5, 5 ECTS, elective | examination record |
| Programme 2016 | Arhitektura i urbanizam, code `OAIPUD`, semester 6, 4 ECTS, elective | examination record |
| Grading scale | 51–60 = 6 · 61–70 = 7 · 71–80 = 8 · 81–90 = 9 · 91–100 = 10 | examination record |
| Teaching system | `iteacher.unt.edu.rs` | examination record |

The course the teacher holds in **2026/2027, first (winter) semester, third year** is the fifth-semester
programme (`22.OA0068`). The sixth-semester programme sits in the same teaching.

## Verified — measured from source files, 30 September 2026

The site „Živimo zajedno”: 151 points recorded on 24 November 2025 between 13:28 and 13:36.
Height difference **22,5 m** over **151 m** of straight line (**14,9 %**), elevations 137,2–159,7 m,
extent ≈ 129 × 131 m, steepest measured segment 63 % over 4,1 m, projection EPSG:32634. The figures
were recomputed from `zivimo zajedno_Visine.csv` by `data/brain/scratch/pud_teren.js`, which is
repeatable.

**The limit of that base, published next to every figure:** declared device accuracy is 1,5–2,5 m
horizontal and 2–3 m vertical. The total of 22,5 m is reliable; a single spot height is not.

## Working proposal — not yet an approved syllabus

The fifteen-week plan, the learning outcomes, the hand-in requirements, the point allocation and the
project criteria come from `SILABUS.md` and `PROJEKTNI_ZADATAK.md` in the dossier, both compiled on
30 September 2026 from consolidated course material. They are a considered working version, not the
accreditation text. The site says so on the course page, in its own words, where a student will read it.

## Not known, and declared as not known

1. **Contact hours per week.** Not stated in the examination record. To be confirmed from the
   accreditation booklet.
2. **Teaching dates, room, field visit date.** Not published. `data/schedule.json` therefore carries
   the course identity and an empty event list; `tests/calendar.test.mjs` fails if a date is ever
   invented there.
3. **The association.** No partner organisation has been agreed for the pilot.

## The teacher's record

`about` in `assets/course.js` is arithmetic from a census of the archive drive taken on
16 August 2026 (file counts per era), cross-checked against `grad/ARC.md` and `grad/THEORY.md`.
File dates give the shape of a period, not a biography, and the page says so. The dissertation title
*Insecurity. Architecture. Architect* (*Güvensizlik. Mimarlık. Mimar.*) is a finding of record from
that same survey.

## What a later editor must not do

- Do not fill `data/schedule.json` with an example date to make the calendar look alive.
- Do not delete an entry from `course.unconfirmed` without the document that confirms it.
- Do not quote a spot height from the reconnaissance base to the centimetre, anywhere.
