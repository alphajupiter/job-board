# Features

A walkthrough of everything the board does, and the reasoning behind each piece.

## 1. The board (job list)

The core view is a list styled after a split-flap departures board rather than a card grid. On desktop each row shows, left to right: a monospace reference **code** (e.g. `ENG-014`), the **role and company**, **location**, **salary range**, a color-coded **status flag**, and **time posted**. On mobile the same information reflows into a two-line card without losing any data — nothing is hidden behind a "see more."

- Rows are keyboard-accessible (`tabindex`, `Enter`/`Space` to open) and have visible focus outlines.
- New/updated rows animate in with a brief settle transition; the effect is skipped entirely for anyone with `prefers-reduced-motion` set.

## 2. Search

A single search box filters across **job title, company name, and tags** simultaneously (e.g. typing "react" surfaces roles tagged React even if the title doesn't mention it). Search is client-side and updates the list instantly as you type — no submit button, no debounce lag.

## 3. Filters

Four independent filters, combinable:

- **Job type** — Full-time / Part-time / Contract / Internship
- **Experience level** — Entry / Mid / Senior / Lead
- **Remote only** — a toggle chip, not a dropdown, since it's binary and used often
- **Saved only** — shows just the jobs you've bookmarked

An active-filter count badge appears on the mobile "Filters" button, and a "Clear filters" action appears whenever any filter is active, so it's always obvious how to get back to the full list.

## 4. Sorting

Three sort modes: **Newest** (default), **Salary: high to low**, **Salary: low to high**. Sorting is independent of filtering, so you can sort a filtered subset.

## 5. Live result count

A small split-flap counter above the list shows how many roles currently match your search/filters, and animates each time the count changes — a direct nod to the departures-board concept, and a lightweight way to confirm "yes, your filter did something" without scanning the whole list.

## 6. Job detail panel

Clicking a row opens a slide-over panel (not a full page navigation) with:

- Full description, responsibilities, and requirements
- Salary, type, level, tags, location, and time posted
- **Save** and **Apply now** actions

The panel is a proper dialog: it traps focus on open, returns focus to the trigger on close, and closes on `Escape` or on clicking outside. Positions marked **Filled** show a disabled "Position filled" state instead of an enabled Apply button, so users don't waste time applying to a closed role.

## 7. Save / bookmark jobs

Every row and the detail panel have a bookmark toggle. Saved jobs persist in `localStorage` and can be filtered into their own view via the **Saved** quick filter — useful for someone comparing a shortlist across sessions without creating an account.

## 8. Apply to a job

The **Apply now** button opens a form (name, email, resume/portfolio link, optional note). It validates:

- Name is required
- Email must match a basic email pattern
- A resume/portfolio link is required

On submit, the application is stored (see [Data model](#data-model) below), a confirmation toast appears, and both the apply form and the detail panel close — so the user lands back on the board, not stuck in a modal.

## 9. Post a job

The **Post a job** button (top right, always visible) opens a form to publish a new listing: title, company, location or remote toggle, job type, experience level, salary range, comma-separated tags, and description.

- New listings are validated (title, company, a location or remote flag, a valid salary range, and a description are all required).
- On submit, the job is generated with a fresh reference code, marked with an `NEW` status, timestamped `now`, and prepended to the top of the board — so posting a job has an immediate, visible effect instead of vanishing into a queue.

## 10. Status flags

Every job carries one status, shown as a color-coded chip:

| Status | Meaning |
|---|---|
| `NEW` | Just posted (includes anything posted through the "Post a job" form) |
| `OPEN` | Actively accepting applications |
| `URGENT HIRE` | Actively accepting applications, flagged as a priority fill |
| `FILLED` | Closed — kept visible for transparency, but Apply is disabled |

## 11. Light / dim board toggle

A theme toggle in the header switches between a light "paper" board and a dim board, both built from the same token set (so status colors, contrast, and the mono/display type pairing hold up in both modes). The preference is remembered across visits.

## 12. Toast notifications

Saving a job, submitting an application, and posting a new listing all trigger a small toast confirmation in the corner of the screen, auto-dismissing after ~3 seconds or dismissible manually. This gives feedback for actions that don't otherwise navigate anywhere (e.g. saving a job from the list doesn't open anything, so without a toast it would feel like nothing happened).

## 13. Empty states

If a search/filter combination matches nothing, the board shows an explicit empty state ("No roles match this search") with a one-click "Clear filters" action, rather than a blank list.

## 14. Responsive design

The layout is built mobile-first: the filter rail collapses into a "Filters" sheet with an active-count badge on small screens, the board rows reflow from a six-column grid to a stacked two-line layout, and the detail panel becomes full-width on narrow viewports.

## 15. Accessibility notes

- All interactive elements are reachable by keyboard, with visible focus states.
- Modals and the detail panel trap and restore focus, and close on `Escape`.
- Status is conveyed with both color and text/icon (not color alone).
- Animations respect `prefers-reduced-motion`.
- Form errors are associated with their fields and announced inline rather than only via a summary banner.

## Data model

Two localStorage-backed collections:

- `board:custom-jobs` — jobs created via "Post a job" (prepended ahead of the seed data in `src/data/jobs.ts`)
- `board:applications` — submitted applications, keyed to a `jobId`
- `board:saved` — an array of saved job IDs
- `board:dim` — the current theme preference

There is no server, so applications and postings are local to the browser they were created in. A production version would replace the `BoardContext` persistence layer with real API calls (see below) without needing to change any component — the context boundary was deliberately kept as the only place that knows about storage.

## What a production version would add

This is a front-end demo scoped to be deployable with zero infrastructure. Turning it into a real product would mean:

- A backend (e.g. a Postgres database behind a small API) so postings and applications are shared across users, not per-browser
- Authentication, so "my saved jobs" and "my postings" are tied to an account rather than a browser
- Resume file upload instead of a link field
- Employer-side dashboard to manage applicants per listing
- Server-side pagination once the job count is large enough that shipping the whole list client-side stops making sense
