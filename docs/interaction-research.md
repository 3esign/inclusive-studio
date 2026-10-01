# Interaction research and next experiments

Checked 1 October 2026. These are design decisions supported by current primary sources, not claims of universal accessibility or best-in-class performance.

## Implemented in this release

- Native controls, keyboard focus, a simple reading view and paired calendar/list remain the foundation. Larger text and stronger contrast are explicit user choices; operating-system forced colors remains in control. Test spacing and reflow rather than imposing one supposed disability font. [W3C text spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html), [MDN forced colors](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/forced-colors).
- A short haptic test is opt-in for every activation. It does not run on save, typing or focus. Safari/iOS lacks this API; some browsers can accept a request without producing vibration. The response describes a request, never success. The current W3C draft itself discusses the lack of implementation consensus. [W3C Vibration API](https://www.w3.org/TR/vibration/), [MDN compatibility](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/vibrate).
- Architectural material pairs an image with a visible structured description, source and unknowns. A concise alt attribute alone cannot communicate a plan's scale, circulation and design argument. [W3C complex images](https://www.w3.org/WAI/tutorials/images/complex/).
- Public contribution is a deliberate GitHub handoff. The site explains storage and immediate attachment uploading, keeps the source tab open, and exports/imports text copies. It does not claim a course login or private submission service. [Storage model](storage.md).

## Useful studio experiments

| Exercise | Evidence and question | Output |
|---|---|---|
| DeafSpace | How do sightlines, proximity, light and acoustics shape conversation? [Gallaudet](https://gallaudet.edu/campus-design-facilities/campus-design-and-planning/deafspace/) | A revised plan and section, checked with coauthors rather than a deafness simulation |
| Route choices | Which slope, curb, surface or rest trade-off matters to a particular journey? [UW AccessMap](https://tcat.cs.washington.edu/accessmap/) | Two described routes and a table of measurements, methods and unknowns |
| Tactile map | Which landmarks can participants distinguish and use? [TactIcons, CHI 2023](https://arxiv.org/html/2407.20674v1) | A relief prototype, recognition observations and revised symbols; archive deposit 2024 is not publication year |
| Accessible field clip | Can the same design question be answered with captions, visual description and transcript? [W3C media guidance](https://www.w3.org/WAI/media/av/) | A reviewed short clip with alternatives, no autoplay and an explicit publication agreement |

## Next, after the course owner connects storage

1. Catalogue originals, agree permissions, and select short teachable moments. Retain a restricted original and a separately reviewed public derivative; do not make a raw folder public.
2. Give each case a problem, activity, evidence, design change, limitation, student task and coauthor response. An image gallery alone is not a case study.
3. Provide a supported contribution recipient and acknowledgement for people who do not use GitHub. Authentication must support ordinary password managers and paste; test the provider journey. [W3C accessible authentication](https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html).
4. Evaluate real tasks with willing participants: finding a task, interpreting an image through its description, preparing work, understanding what becomes public, recovering a draft and giving feedback that changes a design. Record blockers, assistance, recovery, understanding and participant choice. User evaluation complements conformance checks. [W3C involving users](https://www.w3.org/WAI/test-evaluate/involving-users/).

Do not add automatic vibration/sound, decorative motion, inaccessible drag-only interactions, accessibility overlays or a single “accessible for everyone” score. Prioritize a useful architectural decision and an understandable route through the work.
