# Batch 148 — Personal study action plan

## Scope
- Added a reusable deterministic study action-plan formatter and structured JSON model.
- Added a client-side dashboard workspace with selectable suggestions, configurable daily benchmark, preview, copy, and TXT/JSON download.
- Uses only the already-authorized reporting-period aggregates; the plan contains no personal identity fields or individual study records.
- Uses the existing themed listbox and accessible custom-styled checkbox controls.
- Includes 12 Vitest regression tests for selection, date ordering, invalid benchmarks, privacy of the export shape, text formatting, and filenames.

## Notes
- Plan selections are ephemeral and not saved to the server.
- Export files are generated locally in the browser.
- No migrations or new dependencies.
- Run database tests, calculator tests, typecheck, lint, and build on the full local repository.
