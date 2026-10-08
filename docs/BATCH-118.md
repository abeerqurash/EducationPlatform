# Batch 118 — Study-plan exports

## Features
- Authenticated CSV and JSON exports at `/dashboard/study-plan/export-csv` and `/dashboard/study-plan/export-json`.
- New study-plan dashboard export section with matching pill controls.
- Export includes both active and archived study goals, up to 1,000 newest per user, independent of dashboard preview limits.
- Read-only user-scoped query; no internal record identifiers or account details in exported payloads.
- CSV values quoted, escaped, BOM-prefixed for spreadsheet compatibility, and formula-neutralized.
- JSON includes schemaVersion 1, record count and export limit.
- Private no-store and nosniff response headers; 401 when unauthenticated.
- Four new source contract tests.

## Validation
Run database and calculator tests, typecheck, lint and build locally. No migrations or dependencies added.
