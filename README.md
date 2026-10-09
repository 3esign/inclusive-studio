# Inclusive Studio

## Current direction · 4 October 2026

The teacher selects the main sequence of topics, records of delivered sessions and assigned work. The existing idea and research banks remain open collections; new entries do not become assignments automatically. [Research notes](docs/research-roadmap.md) point to the latest additions.

The local record in w01 reports the session held on 2 October and the prototype assigned for the next meeting. W02 is published preparation; w03–w15 are drafts. Publication is not evidence that a session was held. The week-one record names the visit from Živimo zajedno; this does not confirm a field visit or every future arrangement.

**Principles of Universal Design** · Union — Nikola Tesla University, Belgrade · Faculty of Construction Management
Assistant Professor, PhD · 2026/2027, first (winter) semester · third year
Study programmes: Architecture and Urbanism 2023 (`22.OA0068`, 5 ECTS) and 2016 (`OAIPUD`, 4 ECTS)

**One working week on the front page. Eight labs that measure. One task, drawn by hand.**

[Open the studio](https://3esign.github.io/inclusive-studio/) · [Srpski](README.sr.md)

A working environment for third-year architecture students and disability association coauthors. The institution, course, programme codes, credits, grading scale and the measured site come from the faculty record and the course dossier. Still open and labelled as such on the site: contact hours, future teaching dates, the room, the field visit and the scope of further partnership arrangements. The fifteen-week plan is the dossier working version, not an approved syllabus text.

## How the site is organised

The front page is **the course flow**: cemented classes in order — each with its material and its
A3 sheet of the exam workbook — then the pilot for the next class, then the cloud of ideas. Each
week ends with one physical A3 sheet, a conversation in class and the teacher's signature on paper.
A flow strip in the header of every page keeps the three shelves one tap away. Everything else —
the course, calendar, project, exercises, library, Idea Atelier and stages — sits behind it as
supporting material.

- **Course flow** (`index.html`) — the landing: three shelves from `data/tok.json`, where cemented
  classes also show the week's A3 sheet drawn from `data/material/wNN.json`. A deep link
  (`index.html?w=N`) opens the week itself: title, aim, what to bring, and the session's material.
  No file, no week: the page says so instead of inventing a lesson.
- **Lecture** (`predavanje.html`) — the same material cut into slides at every heading. Arrows,
  Space, Home, End; swipe on a phone; "show everything" for reading and printing. Nothing moves on
  its own.
- **Labs** (`laboratorija.html`) — eight short labs. A screen reader reading your markup; the
  keyboard path through a form with and without a focus trap; one switch with an automatic scan;
  contrast, target size and reflow measured against WCAG 2.2; who does not get the alarm; a plan on
  a 10 cm grid checked against Art. 14, 17, 18 and 19 of the Pravilnik; the arithmetic of 22,5 m of
  height; and a countdown over an administrative sentence. Each lab produces a number and then asks
  for the design decision that follows from it.
- **Task** (`zadatak.html`) — a reusable application-for-one-person exercise and optional phone-sized sketchpad. The project log moved this exercise to the week-eight draft. The recorded first session worked on toy concepts; its next assigned step was a prototype.
- **Idea Atelier** (`ideja.html`) — a separate space for connecting unfinished ideas and turning a
  promising connection into one small, testable move on an A3. It is not a week or a hand-in.
- **Prepare material** (`uredi.html`) — the teacher writes a week, the tool checks it against the
  site's own rules and hands over the file to commit. See [docs/gradivo.md](docs/gradivo.md).

Behind those: **the course** (official data, outcomes, house rules, the teacher's record, links),
**exercises** (sixteen, each with its week, its hand-in and its check, plus six longer works),
**the studio** (six project stages), **the calendar** (fifteen teaching weeks as a sequence, plus
dated meetings and ICS export of confirmed events), **the brief**, **the library** (seventeen
sources), **the optional public board**, and **working together / accessibility**.

### No disability simulation

The labs test tools, interfaces and geometry — never a person, and nobody is blindfolded. After
disability simulations people report more empathy but also more pity and discomfort, and they are
not more willing to work with disabled people on an accessibility project (Nario-Redmond, Gospodinov
& Cobb, *Rehabilitation Psychology*, 2017). What measurably helps is a structured exercise with the
real tool plus a debrief; what changes a project is a disabled coauthor. The labs are the warm-up.

## Course record, publishing and privacy

Students need no site account, email sign-in or GitHub account. The course record is the physical weekly A3 reviewed in class and signed by the teacher. The site does not record attendance, grades or official hand-ins.

The optional public board opens an editable GitHub draft. Anything submitted there is public and is not a course hand-in. Files added to GitHub's editor upload immediately. Never publish private interview material or identifying information without specific permission. Idea Atelier notes remain in the current browser unless downloaded; selected files and sketches are not automatically saved.

## Configure the real timetable

Edit [data/schedule.json](data/schedule.json); see [the schedule guide](docs/calendar.md). Keep dates absent until confirmed. The site validates date reality, timezone/DST, unique identifiers, event kinds, statuses and start/end order. Invalid data produces an explicit unavailable state, never guessed dates. ICS uses UTC timestamps and includes confirmed events only.

## Implementation and validation

Zero runtime and build dependencies: semantic HTML, CSS and ES modules, with optional Canvas.
No fonts, trackers or media CDNs. `package.json` declares nothing but `"type": "module"`, so Node
can run the tests against the same files the browser loads.

Every page loads `assets/core.js` — the one shell: navigation, language, comfort settings, storage
— plus its own view module. A week pulls the exercise bank or the lab engine only if its material
references one. Measured over local HTTP, uncompressed, with every dynamic import settled:

| Page | Transferred | JS heap |
|---|---|---|
| `zadatak.html` | 81,2 kB | 1,9 MB |
| `ideja.html` | 91,7 kB | 5,1 MB |
| `laboratorija.html` | 144,7 kB | 1,4 MB |
| `predavanje.html` | 148,3 kB | 1,8 MB |
| `index.html` | 152,3 kB | 1,3 MB |
| heaviest inherited page | 231,9 kB | 4,0 MB |

The labs keep that modest: one lab is mounted at a time and torn down on the way out, so no
interval, animation frame or canvas backing store survives a lab you have left; canvases cap the
device pixel ratio at 2.

Serve the repository with any static HTTP server and open `index.html` through it.

```sh
node --test tests/*.test.mjs
```

77 Node tests cover the week format, the lab arithmetic, the calendar, portable drafts, the course
record, the A3/signature workflow, the Idea Atelier and the consistency of the fifteen page shells. A browser suite
(headless Chrome, 147 checks at 320/360/768/1440 px) covers the pages, the labs, the editor, the Atelier, the
language switch, the no-JavaScript baseline and the measured weight. Results:
[docs/verification.md](docs/verification.md).

WCAG 2.2 AA is a target, not a certification claim. Testing with assistive-technology users and
partner review are still pending; the optional canvas needs a pointer, and text and paper are
independent routes. See [accessibility](https://3esign.github.io/inclusive-studio/pristupacnost.html).
