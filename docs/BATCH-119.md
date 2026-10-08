# Batch 119 — 30-day study progress exports

- Adds authenticated CSV and JSON downloads of the 30 UTC calendar-day progress aggregate already shown on the dashboard.
- Includes zero-activity days, daily recorded minutes, activity counts, and aggregate totals in JSON.
- Exports only current signed-in account data, with no-store and nosniff headers.
- Adds accessible themed export actions to `/dashboard/progress`.
- Adds four source-contract regression tests. No migrations or dependencies.
- Built cumulatively from Batch 118. Do not overwrite newer local or GitHub modifications without reviewing the diff.
