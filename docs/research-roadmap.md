# Evidence and experiments for the next studio pilot

Research checkpoint: 1 October 2026. This is a proposal for the next development cycle. It does not describe newly implemented features, a confirmed timetable, or measured learning outcomes.

The central interaction should connect an observation of a place to a design decision and a coauthor's response. The next release should make that relationship easy to inspect and revise. More media or AI capability is useful only when it helps someone make, understand or contest a concrete architectural decision.

## Feature priorities

P0 means needed for a dependable pilot; P1 means a small experiment worth testing after the pilot's contribution path works; P2 means research only. These are editorial priorities, not computed effect sizes.

| Priority | Proposed feature and purpose | Acceptance evidence before release |
|---|---|---|
| P0 | **Evidence card.** Relate a drawing, image or clip to an observed activity and a question. | Each card shows source, date or unknown, author or unknown, description, permission state and interpretation. A reviewer can tell observation, measurement, hypothesis and proposed change apart. |
| P0 | **Restricted intake and receipt.** Give a participant an understandable place to submit. | An ordinary participant completes the selected provider flow. The receipt identifies the item and revision, recipient, visibility and correction route. A failed transfer produces no success receipt. No course membership is inferred from a sign-in button. |
| P0 | **Supported contribution route.** Keep participation available to someone who cannot use the selected account or interface. | A named course recipient can receive an assisted contribution, read it back for approval and acknowledge it. The public site states the real route only after an owner accepts it. |
| P0 | **Publication and withdrawal register.** Separate original, review copy and public teaching edition. | A request can be traced to response, spreadsheet row if any, file, caption/transcript and public derivative. Withdrawal marks teaching content unavailable; the explanation acknowledges that already downloaded public copies cannot be recalled. |
| P0 | **Reviewed short instructions.** Help a coauthor understand the invitation, task and sharing choice. | A willing intended reader explains the next action and how to decline or ask for help. Content is revised with that person; reviewer credit is agreed. Unreviewed summaries are not presented as a formally validated easy-to-read edition. |
| P1 | **Plan with linked notes.** Put a numbered architectural observation beside its location. | Each marker has the same named entry in an ordinary ordered list. Both paths expose the same content; no drag, hover or color-only action is necessary. Edits retain the link and version. |
| P1 | **Comparison of two routes.** Surface trade-offs for one chosen activity. | A textual route sequence accompanies a measured table. Units, method, date and missing data remain visible. Missing measurements never become zero or an accessible/safe badge. No generated turn-by-turn outdoor guidance. |
| P1 | **Design response history.** Show what a coauthor's feedback changed. | A response links a prior version, concern and revised decision. The person can disagree, leave a question unresolved or choose not to review; a majority vote cannot erase a barrier. |
| P1 | **Media companion.** Make a field clip usable for discussion. | A reviewed clip has corrected captions, relevant visual description, a readable transcript and a still/text route. All versions use the same media identifier and permission state. No autoplay. |
| P1 | **Portable fieldwork sheet.** Preserve work across weak connectivity. | A participant can export a readable draft, reopen it, identify its revision and distinguish it from submitted work. Existing text export is the baseline; broader offline behavior needs explicit version and update tests. |
| P2 | **AI plan-description workbench.** Let students inspect spatial mistakes. | Uses a permitted, non-sensitive plan and a teacher-checked reference. Output is labelled machine draft; errors in connections, direction, dimensions and omitted barriers are recorded individually. No navigation or building-compliance guarantee. |
| P2 | **Tactile and audio map study.** Explore spatial overview before a visit. | A co-designed physical or supported-device prototype is compared with a simple described map for a chosen question. Record what the person could discover, verify and control. Evidence of map learning is not evidence of safe travel. |

## Why these priorities follow from the evidence

The latest [WCAG evaluation methodology](https://www.w3.org/TR/2026/NOTE-wcag-em-2-20260723/) treats the complete process as part of an evaluation. For this pilot, the critical question is whether a person can finish a contribution, recover from an error and understand its visibility. The proposed release test therefore extends beyond our own pages into the actual selected provider journey.

The [September WCAG 3 draft](https://www.w3.org/TR/2026/WD-wcag-3.0-20260910/) is a research direction, not our conformance target. Its developing provision for adjustable haptic feedback supports keeping user control central. The existing vibration experiment is not equivalent to a tactile map or evidence of hardware support.

[Inclusion Europe's logo rules](https://easy-to-read.inclusion-europe.eu/hr/european-logo/) require the relevant easy-to-read practice and reader involvement. Our proposal is to validate task meaning with coauthors before assigning that status. A [French AI text-generation paper](https://arxiv.org/html/2510.00691v1) evaluated outputs with trained language reviewers; that does not establish comprehension among the participants of this course.

[Floorplan2Guide](https://arxiv.org/html/2512.12177v1) offers a useful plan-to-graph teaching example, but its limitations include a real-world test with one sighted user and no obstacle avoidance. [TouchingSpace](https://arxiv.org/html/2609.36404v1) studies audio-haptic pre-travel exploration with blind and low-vision participants; it does not establish safe travel. These are strong reasons to build an inspectable classroom experiment before a navigation service.

## Three proposed studio sessions

These sessions can be inserted into the existing design phases after the actual timetable is confirmed. Their duration, assessment weight and participant payment are not set here.

### Reading the same place in different forms

Use the permitted architectural sketch already selected for the pilot. Students prepare a visible long description, a sequence of spaces and a list of uncertain marks. A coauthor chooses the representation they want to use and asks a question about the space. Students record where their representation failed to answer it. The output is a revised explanation and measurement request. Do not derive dimensions from an uncalibrated photograph or simulate disability by blindfolding classmates.

### Finding a spatial mistake in an AI answer

Use a permitted plan with a small, manually checked room-connection graph. Compare a student description with a machine-produced draft if an approved model is available. The group records missing doors, invented connections, reversed directions and unsupported dimensions, then identifies what evidence would resolve each. Without a model, the teacher can prepare a clearly labelled erroneous example. The learning objective is verification, so model access is not a prerequisite.

### Showing a decision that changed

Present one barrier, the initial design and the coauthor's explanation. Students make a revision and show exactly which activity should become easier. The coauthor can accept that account, challenge it or request another trial. Retain both the concern and the unresolved question. The output is a plan or section plus a short decision history, not a satisfaction score.

## Pilot evaluation record

Use real tasks, the participant's chosen access tools and a stated support arrangement. Record task outcome, blocker, assistance, recovery and understanding of publication; collect no diagnosis simply to fill a profile. Device and AT versions belong in a restricted technical record, with only aggregate findings made public by agreement.

Proposed paths to examine: current task discovery; drawing interpretation; draft preparation and recovery; provider access; rejected file; interrupted transfer; receipt; revision; coauthor review; withdrawal. Browser automation remains useful for regression. It does not replace these observations. [APG implementation guidance](https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/) and [ARIA-AT interpretation](https://www.w3.org/WAI/ARIA/apg/about/at-support-tables/) reinforce the need to test the actual implementation.

## Open decisions

The course owner still needs to establish the authoritative syllabus and timetable, storage owner and permitted account types, intended recipients, retention and withdrawal practice, participant support and acknowledgement of coauthor work. Connection to Drive will allow checking the selected folder's real permissions. A login alone will not answer these questions.

## Honest verdict

Checked: cited primary-source passages and the existing pilot documentation. Inferred: the feature ordering and workshop design above. Not executed: the proposed implementations, new user studies, private uploads, institutional account checks or a new deployment.
