# Inclusive Studio

**Principles of Universal Design** · Union — Nikola Tesla University, Belgrade · Faculty of Construction Management
Assist. Prof. Semir Poturak, PhD · 2026/2027, first (winter) semester · third year
Study programmes: Architecture and Urbanism 2023 (`22.OA0068`, 5 ECTS) and 2016 (`OAIPUD`, 4 ECTS)

**One working week on the front page. Eight labs that measure. One task, drawn by hand.**

[Open the studio](https://3esign.github.io/inclusive-studio/) · [Srpski](README.sr.md)

A working environment for third-year architecture students and disability association coauthors. The institution, course, programme codes, credits, grading scale and the measured site come from the faculty record and the course dossier. Still open and labelled as such on the site: contact hours, teaching dates, the room, the field visit and the partner association. The fifteen-week plan is the dossier working version, not an approved syllabus text.

## How the site is organised

The front page is **the working week**: the material the teacher put in for this session, the task
and the labs it points at. Everything else — the course, the calendar, the project, the exercises,
the library, the pinboard, the stages — sits behind it as material.

- **This week** (`index.html`) — title, aim, what to bring, and the session's material, read from
  `data/material/wNN.json`. No file, no week: the page says so instead of inventing a lesson.
- **Lecture** (`predavanje.html`) — the same material cut into slides at every heading. Arrows,
  Space, Home, End; swipe on a phone; "show everything" for reading and printing. Nothing moves on
  its own.
- **Labs** (`laboratorija.html`) — eight short labs. A screen reader reading your markup; the
  keyboard path through a form with and without a focus trap; one switch with an automatic scan;
  contrast, target size and reflow measured against WCAG 2.2; who does not get the alarm; a plan on
  a 10 cm grid checked against Art. 14, 17, 18 and 19 of the Pravilnik; the arithmetic of 22,5 m of
  height; and a countdown over an administrative sentence. Each lab produces a number and then asks
  for the design decision that follows from it.
- **Task** (`zadatak.html`) — day one: an application for one person, drawn by hand, with a drawn
  constraint card and an optional phone-sized sketchpad that keeps showing the real minimum sizes.
- **Prepare material** (`uredi.html`) — the teacher writes a week, the tool checks it against the
  site's own rules and hands over the file to commit. See [docs/gradivo.md](docs/gradivo.md).

Behind those: **the course** (official data, outcomes, house rules, the teacher's record, links),
**exercises** (sixteen, each with its week, its hand-in and its check, plus six longer works),
**the studio** (six project stages), **the calendar** (fifteen teaching weeks as a sequence, plus
dated meetings and ICS export of confirmed events), **the brief**, **the library** (seventeen
sources), **the pinboard**, and **working together / accessibility**.

### No disability simulation

The labs test tools, interfaces and geometry — never a person, and nobody is blindfolded. After
disability simulations people report more empathy but also more pity and discomfort, and they are
not more willing to work with disabled people on an accessibility project (Nario-Redmond, Gospodinov
& Cobb, *Rehabilitation Psychology*, 2017). What measurably helps is a structured exercise with the
real tool plus a debrief; what changes a project is a disabled coauthor. The labs are the warm-up.

## Publishing and privacy

The site has no server-side submission service. Text drafts remain in the current browser when storage is permitted. Selected files and sketches remain in memory and are not automatically saved. A file preview is not an upload. Attach the selected file or downloaded PNG yourself in GitHub. For long drafts the interface requests downloaded text to be pasted into GitHub.

The final link opens an editable GitHub draft; issue text is published when submitted on GitHub. Files added to its editor upload immediately and are publicly accessible. GitHub requires an account. Public posting does not register an official course hand-in or a grade. Never publish private interview material or a contributor's identifying information without specific permission. Supported submission through a course contact still needs an appointed owner.

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
| `zadatak.html` | 75 kB | 1,9 MB |
| `laboratorija.html` | 139 kB | 1,4 MB |
| `predavanje.html` | 142 kB | 1,8 MB |
| `index.html` | 144 kB | 1,3 MB |
| the nine inherited pages | 224 kB | 3,1–5,9 MB |

The labs keep that modest: one lab is mounted at a time and torn down on the way out, so no
interval, animation frame or canvas backing store survives a lab you have left; canvases cap the
device pixel ratio at 2.

Serve the repository with any static HTTP server and open `index.html` through it.

```sh
node --test tests/*.test.mjs
```

70 Node tests cover the week format, the lab arithmetic, the calendar, portable drafts, the course
record and the consistency of the fourteen page shells. A browser suite
(headless Chrome, 137 checks at 320/360/768/1440 px) covers the pages, the labs, the editor, the
language switch, the no-JavaScript baseline and the measured weight. Results:
[docs/verification.md](docs/verification.md).

WCAG 2.2 AA is a target, not a certification claim. Testing with assistive-technology users and
partner review are still pending; the optional canvas needs a pointer, and text and paper are
independent routes. See [accessibility](https://3esign.github.io/inclusive-studio/pristupacnost.html).
