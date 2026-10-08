# Batch 123 — Interactive Study Progress Insights

Adds a server-rendered, account-scoped 7/30/90-day insights panel to `/dashboard/progress`.

- Custom `ThemedExportSelect` (no native browser dropdown) submits `trendDays` through GET.
- Reuses the same strict `parseProgressExportDays` allowlist and bounded database query as progress exports.
- Shows total recorded minutes, average across all days (including inactive), active-day percentage, busiest day, activity count and an accessible daily bar series.
- The previous weekly/30-day charts, session actions and CSV/TXT/JSON exports are unchanged.
- No migrations, environment changes or dependencies.

Run the database and calculator Vitest suites, typecheck, lint and production build before release. The ZIP does not contain `.env.local`.
