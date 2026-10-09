# Batch 155 — planned study versus historical activity

Adds a reusable UTC-based comparison of a proposed weekly schedule with actual account-scoped recorded daily activity already retrieved by the progress dashboard. Includes weekday history averages, normalized historical weekly minutes, a day-by-day table, TXT/CSV exports, and ten unit tests. No new database queries, migrations, dependencies, or persistent writes. The proposed plan is not marked completed. Date comparison uses UTC and counts each unique reporting date once.

Validation commands: `npm run test --workspace=@education/database`, `npm run test --workspace=@education/calculators`, `npm run typecheck`, `npm run lint`, `npm run build`.
