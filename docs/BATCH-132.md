# Batch 132 — Cross-page study goal selection

- Select up to 50 matching goals across all pages in current filter/sort order; selection does not require navigating page-by-page.
- Warn when more than 50 goals match, explaining that remaining records are not affected.
- Add accessible page-jump control with integer and bounds validation.
- Preserve current filter-reset selection clearing, review previews, confirmation, and server-side ownership enforcement.
- Add seven tests for cross-page selection, duplicates, caps, and stale selection.
- No new migrations, packages, or native dropdowns.

Validation on your Windows machine: database/calculator tests, typecheck, lint, build.
