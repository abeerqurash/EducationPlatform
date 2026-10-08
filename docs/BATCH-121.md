# Batch 121 — Study goal export status filtering

- Added shared status filter for CSV, JSON and TXT study-goal downloads.
- Status values: all, active (not archived or completed), completed (not archived), archived (regardless of completion).
- Invalid/missing status falls back to all. All three routes continue to authenticate and use the bounded, account-scoped query.
- Filters apply to the **1,000 most recent goals** fetched by the existing repository; they do not query older goals.
- Added accessible labeled status selector and three submit buttons in the existing dashboard export panel.
- Added three regression source-contract tests. No new dependencies, migrations or environment variables.
- Local validation: database/calculator tests, typecheck, lint and build.
