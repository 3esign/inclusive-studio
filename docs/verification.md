# Verification — 1 October 2026

This is a bounded implementation check, not WCAG certification or a claim of educational validation.

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
