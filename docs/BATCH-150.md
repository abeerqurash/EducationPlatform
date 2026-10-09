# Batch 150 — Weekly study schedule export enhancements

Cumulative over Batch 149 Fix 1. Adds spreadsheet-compatible CSV, one-week iCalendar export, and clipboard copying to the existing weekly schedule builder. Calendar events are tentative and explicitly represent planned rather than recorded study activity. The iCalendar download uses the next Monday–Sunday UTC week and a selectable UTC starting hour, without server calls, external integrations, new dependencies, or migrations. CSV escapes spreadsheet formula prefixes. ICS escapes content and folds lines at 75 octets. Includes 15 unit tests.

## Validate on Windows

```powershell
npm run test --workspace=@education/database
npm run test --workspace=@education/calculators
npm run typecheck
npm run lint
npm run build
```

Preserve the root `.env.local` when extracting. Do not replace other root-level configuration files. GitHub remote is not changed by this ZIP.
