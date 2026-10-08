# Batch 124 — Study consistency and detailed progress

- Adds UTC-period study streaks, weekly activity groups, and a complete accessible daily table to the student Progress dashboard.
- Reuses the existing 7/30/90-day custom dropdown and account-scoped bounded progress query.
- No schema changes, new dependencies, or additional data fetches.
- The current streak is measured at the end of the selected UTC window; if the latest day is inactive it is zero. Groups are consecutive seven-day blocks beginning at the window start, not ISO calendar weeks.
- Adds four unit tests for the pure summary logic.
- Existing dashboard and export actions are preserved.
