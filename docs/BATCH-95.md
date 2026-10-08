# Batch 95 — Test-prep dashboard

Replaces the generic test-prep placeholder with an authenticated, persisted-data dashboard. Counts all saved SAT/ACT calculator results for the signed-in account, displays the 30 most recent, and links to published test-prep tools and study-plan/progress workflows. Shows exam-related goals from the existing capped 20-goal workspace; does not imply this is a global count. No schema or migration changes.

Exam results are recognized by hyphen-delimited `sat` or `act` tokens in `toolSlug`. Historical results with other naming conventions will not appear. The page does not claim practice-test attempts or score improvement; those require dedicated persisted models in a future batch.

Validation: database tests, calculator tests, typecheck, lint, build, then visit `/dashboard/test-prep` as signed-in and signed-out users. The repository test is structural; live PostgreSQL integration should be added later.
