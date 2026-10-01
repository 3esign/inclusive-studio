# Verification — 1 October 2026

This is a bounded implementation check, not WCAG certification or a claim of educational validation.

## The working week, the laboratory, day one and mobile — 2026-10-01T21:18:03.204Z

- **137/137 headless-Chrome checks passed** across **fourteen pages at 320, 360, 768 and 1440 CSS pixels**: one `h1` and a complete navigation per page, no horizontal scroll at any of the four widths, every visible control at least 24 × 24 px on a 360 px phone (WCAG 2.2 — 2.5.8; links inside prose are exempt and were excluded), the Serbian switch across shell and material, simple view, reduced motion, and the no-JavaScript baseline on the three new pages. No uncaught exception anywhere.
- **70/70 Node tests passed** (`node --test tests/*.test.mjs`): the week format and the files on disk (14), the lab arithmetic against WCAG 2.2 and Pravilnik RS 22/2015 (17), the calendar (14), portable drafts (6), the course record (8) and the consistency of the fourteen page shells (11).
- **The labs are measured, not asserted.** Contrast is checked against the known extremes (21:1 black on white, 4,54:1 for #767676 on white); target size against 24 px and the spacing exception; the plan geometry reports an exact 90 cm pinch on its 10 cm grid, refuses a sealed room as unreachable rather than narrow, and only passes when the route exists, the narrowest point holds and a 150 cm circle fits where you arrive; the ramp arithmetic reproduces 450 m of run and 49 landings for 22,5 m at 5 %.
- **The editor enforces the site's own rules in the browser:** an image block without a description disables the commit button and names the reason; a valid week is shown as the file that will be committed and previewed exactly as the room will see it.
- **Weight and memory, measured over local HTTP without compression, with every dynamic import settled:**

| Page | Transferred | JS heap |
|---|---|---|
| `standard.html` | 224.5 kB | 4.0 MB |
| `program.html` | 224.4 kB | 4.0 MB |
| `predmet.html` | 224.4 kB | 3.5 MB |
| `studio.html` | 224.2 kB | 3.1 MB |
| `resources.html` | 224.1 kB | 4.9 MB |
| `pristupacnost.html` | 224.1 kB | 5.9 MB |
| `etika.html` | 224.1 kB | 5.5 MB |
| `ucestvuj.html` | 224.1 kB | 5.0 MB |
| `vezbe.html` | 223.9 kB | 4.5 MB |
| `index.html` | 144.3 kB | 1.3 MB |
| `uredi.html` | 143.0 kB | 2.4 MB |
| `predavanje.html` | 141.9 kB | 1.8 MB |
| `laboratorija.html` | 138.5 kB | 1.4 MB |
| `zadatak.html` | 75.0 kB | 1.9 MB |

  The four rebuilt pages share `assets/core.js` and load one view module; the nine inherited pages still load the legacy bundle. A week pulls the exercise bank or the lab engine only when its material references one — which week 1 does.

### Defects the checks found, which inspection had not

- The editor threw on first paint: the shell is drawn before the week file is read, and `view()` dereferenced a null week. The page now says it is opening the material.
- Changing the "add entry" selector re-rendered the editor and threw the choice away. That control no longer triggers a re-render.
- Checkboxes were 21 × 21 px and footer links 22 px high — both below the 24 px minimum. Both corrected, and the check now runs on every page at 360 px.
- The task page had no links in its static markup, so without JavaScript it was a dead end. The page generator now guarantees a way onward on every page.

### Still not checked

A real screen reader (NVDA, JAWS, VoiceOver, TalkBack), a real switch device, a real student hand-in,
the accreditation booklet, and any session with disabled coauthors. The labs reproduce what a tool
does to an interface; they are not evidence about anybody's experience, and the site says so on
every lab page. Serbian regulation values were read on 01.10.2026 from the legal database
paragraf.rs, not from Službeni glasnik itself; week 4 cross-checks them against the official text.

## Course identity, course page, exercise bank and week plan — 2026-10-01T19:48:25.286Z

- **111/111 isolated Chrome checks passed** in the existing suite (now covering nine pages, including the two new ones), plus **67/67 new checks** in `verify-course-pages.cjs`: the course band and document title on every page, the official programme table, the unverified-items notice, the teacher record, the link groups, the Serbian switch, the sixteen exercise cards each with hand-in and check, the fifteen numbered weeks with milestones, the measured site figures with their reconnaissance caveat, both programmes totalling 100 points on screen, reflow at 1440/1024/768/390/320 CSS pixels, enlarged text at 320, heading order and table semantics. No JavaScript exceptions.
- **28/28 Node tests passed**: 14 calendar cases, six draft/URL cases, eight new course-data cases (`tests/course.test.mjs`) asserting the programme codes, that the unverified caveats cannot be deleted silently, fifteen weeks in three blocks, every exercise bound to a real week with a hand-in and a check, the site figures against the problem statement, both programmes summing to 100, the four compulsory hand-in items, and bilingual completeness of outcomes, themes, eras, ideas and links.
- **A real defect was found and fixed by the checks, not by inspection:** the brief page overflowed horizontally at 390 and 320 CSS pixels because a wide table inside a grid track pushed the document to 564 px. Grid items are now `min-width: 0` and the table scrolls inside its own wrapper.
- `data/schedule.json` now carries the course identity from the examination record and still carries **no events**. The calendar test was rewritten to assert exactly that: the course may be named, the dates may not be invented.
- Screenshots inspected: course page desktop, course page in Serbian, course page mobile, exercises desktop and mobile, week plan, brief with site facts.

### What is published as verified, and what as proposed

- **Verified:** institution, teacher, both programme codes with semester and ECTS, grading scale (faculty examination record, 27.08.2026); the site measurements of 22,5 m over 151 m and the declared device accuracy (recomputed from source files, 30.09.2026); the teacher's file counts per era (archive census, 16.08.2026).
- **Proposed:** the fifteen-week plan, outcomes, hand-in requirements, points and criteria — the course dossier working version, labelled as such on the page itself.
- **Declared unknown:** contact hours, teaching dates, room, field visit, and the partner association.

### Not checked in this round

Real screen-reader use, a real student submission, and the accreditation booklet. The accessibility statement remains a claim about intent and implementation, not evidence from assistive-technology users.

## Accessibility, material and storage update — 2026-10-01T17:43:50.601Z

- **99/99 isolated Chrome checks passed**, including the previous routes and new template handoff, no privileged label URL parameter, reviewed text import, stale-import races, image-description synchronization, enlarged-text reflow at 320 CSS pixels in English and Serbian, forced-colors selection outline, text-spacing override, haptic fallback and explicit-request semantics. No JavaScript exceptions recorded.
- **20/20 Node tests passed**: 14 calendar cases plus six draft/URL/validation cases. Git whitespace and JavaScript syntax checks passed. No dependency added.
- Desktop field-material, enlarged mobile library, contrast-theme and spacing screenshots were inspected. The 1000 × 563 source sketch is unaltered, 140475 bytes, with visible description, unknown units/date/author and a separate rights statement.
- An independent code review found an asynchronous import race and stale image alt text; both were repaired and covered in the browser checks. Enlarged text exposed a library select overflow, which was corrected and retested.
- Primary sources support the accessibility experiments and corrected GitHub storage model. The library now has 17 references and four proposed architectural exercises. See [research decisions](interaction-research.md), [storage](storage.md) and [image provenance](field-material.json).

### Honest verdict for this update

1. **Sentence:** turn a source observation into an accessible, evidence-based architectural conversation.
2. **Truth:** GitHub is a public handoff, not a course login; local preview is not upload; the haptic message reports a request, not a physical result.
3. **Reduction:** removed privileged URL labels, the submit-only attachment claim and unsupported WebP preview promise; no automatic sound/vibration or unreviewed photo gallery.
4. **Hierarchy:** stage task → prepared contribution → explicit public handoff; library → source material → exercise and test.
5. **Motion:** no new animation; one 25 ms vibration only when deliberately requested, with a text response in every case.
6. **Bare screen:** inspected typography, flat-color controls, the source image and structured text; content remains legible without decorative effects and in forced colors.
7. **Access:** bounded software and screenshot checks passed. Haptics was tested with API fixtures, not a physical actuator. No full screen-reader/switch-user session, native Safari/device test, full accessibility certification or end-to-end ordinary-participant GitHub login/upload/post was performed. The connected user-browser tool reported no available browser. The isolated test browser did not use personal accounts or publish test content.

The 59 photos and 17 videos in the wider archive were inventoried locally; only selected stills were inspected and no video was watched in this update. People/recordings remain outside the public repo. Drive/Gmail, institutional accounts, exact teaching dates, official hand-in and supported-submission ownership remain unconfigured.

## Previous rebuild verification

- 14 Node calendar tests passed: real dates, leap years, durations, IDs, optional stages, controlled statuses/kinds, UTC offsets, daylight-saving transitions including half-hour changes and skipped dates, confirmed-only exports, Unicode folding and calendar text injection.
- 74 checks passed in an isolated headless Chrome session. Seven pages rendered, with no horizontal overflow at 1440, 1024, 768, 390 and 320 CSS pixels. Checked bilingual switching, all stage controls, partner role, simple view, invalid stage query, empty and populated calendar, library filtering, draft restoration, review consent gate, reversible clearing, blocked browser storage, malformed checklist storage, skip-link keyboard use, reduced motion and static fallback. No JavaScript exceptions were recorded.
- Desktop and mobile screenshots were visually inspected. The composition retains legible text, a process rail and a focused work sheet without decorative effects.
- All ten reading-list descriptions were matched to primary-source content: nine original URLs and an official OHCHR replacement. This was content verification through a web reader, not a guarantee of external-site accessibility or future availability.
- JavaScript syntax and git whitespace checks passed. No dependencies were added.

## Honest verdict

1. **Sentence:** turn an everyday place into a shared, evidenced architectural proposal.
2. **Truth:** real functions are separated from proposed course arrangements; no invented teaching dates, grades, student work or direct upload service.
3. **Reduction:** removed brochure repetition, fixed six-week/ECTS claims, unowned support promises and the superseded script. History preserves the previous version.
4. **Hierarchy:** project purpose, selected working stage and action, then calendar and reference context.
5. **Motion:** only small control feedback; no autoplay or decorative animation.
6. **Bare screen:** checked screenshots use typography, lines and flat color; no shadows, gradients or blur are needed to convey structure.
7. **Access:** tested narrow layouts, simple view, language, native forms, skip-link keyboard path and reduced motion. Full assistive-technology sessions, exhaustive keyboard traversal, real mobile hardware, complete WCAG audit and teaching-partner review remain pending. Freehand drawing requires a pointer. Live public posting requires GitHub; network-free first use is unavailable.

Real institutional dates, assessment rules, accommodations, coauthor compensation and a supported-submission contact remain unconfirmed. These are required to run the actual pilot, although the interface and calendar machinery are implemented.
