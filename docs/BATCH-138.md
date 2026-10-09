# Batch 138 — Filtered Study Activity Downloads

## Scope

Adds themed CSV, JSON, and TXT download controls to the existing Progress > Recent study activity workspace. Exports use the current search, activity type, and sort, and include all matching rows in the bounded, server-provided history rather than only the current page.

## Safeguards

- Only records already fetched for the authenticated account are processed; no new public API route.
- CSV quotes every cell and prefixes spreadsheet formula-looking values with an apostrophe.
- JSON uses a versioned schema and explicit UTC timestamps.
- TXT normalizes embedded title newlines.
- Empty exports are disabled in the UI.
- No database migrations, additional dependencies, or modifications to existing server actions.

## Validation

Run database and calculator Vitest suites, web typecheck, lint, and production build. Manual smoke test: filter activities, paginate, export each format, and verify row count and ordering match filters rather than the current page. Also test no-match disabled controls.
