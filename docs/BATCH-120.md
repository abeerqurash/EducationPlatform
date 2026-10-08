# Batch 120 — Readable study data exports

Adds plain-text (`.txt`) download routes for study goals and the 30-day progress timeline, complementing CSV/JSON. Both routes are authenticated, account-scoped, read-only, and private/no-store. The study-goal export reuses the 1,000-record repository cap; progress uses the same 30 UTC calendar days shown on the dashboard. No migrations or dependencies.

## Validation

Run database and calculator Vitest suites, typecheck, lint and Next.js build. The package ZIP integrity check is not a substitute for local test execution.
