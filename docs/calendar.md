# Calendar source and publication

The only live timetable source is data/schedule.json. The initial empty timetable is intentional. Obtain the institution, course, term, teaching times, holidays, deadlines, venue and partner availability before filling it. Use the course's IANA timezone.

The top-level fields are status (unconfirmed or confirmed), institution, course, term, timezone and events. Every event has a stable id, title, kind (studio, fieldwork, review, deadline or break), status (proposed or confirmed), start, end and location. stage is optional or null for course-wide events; otherwise it is an integer from 1 to 6.

start and end use YYYY-MM-DDTHH:mm in the course timezone. The end is exclusive. A break ending at 00:00 on a date excludes that date. Nonexistent or ambiguous DST local times are rejected; choose an unambiguous time. Do not substitute an example date for an actual scheduled event.

Several events may refer to the same stage; stages may overlap. Reviews, course-wide deadlines and breaks need not refer to a stage. Proposed events are labelled in the month grid and event list. Only confirmed events enter the ICS export.

After editing, run node --test tests/calendar.test.mjs and open the calendar page. Confirm the month, all event labels, local timezone, end dates and the exported events against the actual course agreement. GitHub Pages publication follows the existing main branch deployment.

This is a published schedule, not a calendar editor or a synced attendance/grade system. Updating an imported ICS file is not a subscription; participants must import the revised file themselves.
