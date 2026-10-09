# Batch 136 — Selected study goal exports and group display controls

- Adds selected-only CSV, JSON and TXT exports to the study goal bulk toolbar.
- Exports selected goals across pagination pages, preserving the currently filtered and sorted order.
- Ignores stale IDs, deduplicates selection and respects the 50-record safety limit.
- Reuses existing CSV spreadsheet-formula escaping and adds `exportScope: "selected"` to JSON exports.
- Adds expand-all/collapse-all controls for the deadline-grouped view.
- Adds seven Vitest tests for selection, serialization, injection defense, and filenames.
- No migrations, package dependencies or changes to `.env.local`.

## Validate

```powershell
npm run test --workspace=@education/database
npm run test --workspace=@education/calculators
npm run typecheck
npm run lint
npm run build
```
