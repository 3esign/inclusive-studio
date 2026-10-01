# Inclusive Studio

**One place, six stages, shared architectural decisions.**

[Open the studio](https://3esign.github.io/inclusive-studio/) · [Srpski](README.sr.md)

A working environment for third-year architecture students and disability association coauthors. The pilot is a proposal: institution, course, partner, site, teaching dates, credits and official assessment have not yet been agreed.

## Work in the studio

- **Studio:** six project stages with student/coauthor tasks, architectural deliverables, private checklists, critique prompts and optional AI guidance.
- **Calendar:** explicitly dated meetings, fieldwork, reviews, deadlines and breaks; month and list views; confirmed-event ICS export. A stage can contain several meetings. Stages are not assumed to be weeks.
- **The brief:** purpose, learning outcomes, connected spatial scales and a proposed evidence-based review rubric.
- **Library:** seventeen selected primary-source entries, searchable and related to stages.
- **Pinboard:** local text drafts, optional file preview and freehand sketch, text/PNG download, review and deliberate public sharing through GitHub.
- **Working together / Accessibility:** participation agreement, consent, known platform limitations and ways to use the interface.

## Publishing and privacy

The site has no server-side submission service. Text drafts remain in the current browser when storage is permitted. Selected files and sketches remain in memory and are not automatically saved. A file preview is not an upload. Attach the selected file or downloaded PNG yourself in GitHub. For long drafts the interface requests downloaded text to be pasted into GitHub.

The final link opens an editable GitHub draft; issue text is published when submitted on GitHub. Files added to its editor upload immediately and are publicly accessible. GitHub requires an account. Public posting does not register an official course hand-in or a grade. Never publish private interview material or a contributor's identifying information without specific permission. Supported submission through a course contact still needs an appointed owner.

## Configure the real timetable

Edit [data/schedule.json](data/schedule.json); see [the schedule guide](docs/calendar.md). Keep dates absent until confirmed. The site validates date reality, timezone/DST, unique identifiers, event kinds, statuses and start/end order. Invalid data produces an explicit unavailable state, never guessed dates. ICS uses UTC timestamps and includes confirmed events only.

## Implementation and validation

Zero runtime or build dependencies: semantic HTML, CSS, JavaScript modules and optional Canvas. No fonts, trackers or media CDNs. Static bilingual introductions and direct links remain without JavaScript. This is not an offline application. A simple view, responsive layouts, visible focus, language switching, reduced motion and a calendar list support alternative ways of using the site.

Serve the repository using any static HTTP server. Open index.html through that server. Run the calendar suite with:

```sh
node --test tests/calendar.test.mjs
```

WCAG 2.2 AA is a target, not a certification claim. Assistive-technology user testing and partner review are pending. The optional canvas needs a pointer; text is an independent participation route. See [accessibility](https://3esign.github.io/inclusive-studio/pristupacnost.html).

## Design

An architectural working sheet: a quiet field, green ink, one yellow-green signal, a numbered process rail and a small journey/place/detail diagram. Work comes before supporting material. No simulated student work, invented dates, decorative motion or grade dashboards. English is the initial interface; Serbian is available throughout.

The former brochure and its research references remain recoverable in Git history at commit 0821088. The rebuilt brief removes unconfirmed credits, schedules, staffing and accreditation implications. Reference titles and descriptions were checked against primary sources on 1 October 2026; the reading list does not establish building-code compliance.

## License

Original site content: CC BY 4.0 · Code: MIT. Source media and third-party works retain their own rights. The Živimo zajedno source sketch is excluded from the general content licence; further reuse requires a separate rights check.


## New teaching and access tools

The library contains one reviewed architectural source sketch, four source-linked fieldwork exercises and a downloadable route worksheet. The access page adds larger text, stronger contrast and an explicitly triggered short vibration experiment with a complete text fallback. The pinboard explains sign-in and storage, supports versioned text-only JSON transfer and uses GitHub templates without privileged label parameters. [Storage details](docs/storage.md).
