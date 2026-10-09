# Batch 157 — Goal priority queue

Cumulative from Batch 156. Adds a read-only, deadline-driven priority queue to the authenticated study plan, using existing account-scoped goals without additional database queries. Filter by deadline urgency; view totals and download or copy a portable TXT report. Adds 11 Vitest cases for ordering, UTC dates, validation, completion exclusion, caps, and formatting. No dependencies, schema changes, or migrations. Keep `.env.local` when extracting.

Validate locally: `npm run test --workspace=@education/database`, `npm run test --workspace=@education/calculators`, `npm run typecheck`, `npm run lint`, `npm run build`.
