# Batch 158 — Four-week goal workload forecast

Cumulative on Batch 157. Adds a read-only forecast to `/dashboard/study-plan` using account-scoped open goals already loaded for the page.

- Deadline buckets: overdue, days 0–6, 7–13, 14–20, 21–27, later (day 28+), unscheduled. UI labels are intended as relative planning windows; no dates are changed.
- Configurable weekly study capacity and overload warnings.
- Goal previews, copyable TXT report, CSV export.
- UTC date validation, capped goal target minutes, no database writes or migrations.
- Regression tests in `study-goal-workload.test.ts`.

Run database/calculator tests, typecheck, lint and production build locally. The ZIP does not include `.env.local` or overwrite root configuration.
