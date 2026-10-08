# Batch 126 — Goal health report downloads

Adds authenticated CSV, JSON and TXT report endpoints under `/dashboard/study-plan/health-*`.

Reports use existing account-scoped workspace data and UTC deadline calculations, without migrations or dependencies. Metrics exclude archived goals. The deadline preview is limited to eight open scheduled goals, as in the dashboard.

Five Vitest unit tests cover report metrics, CSV quoting, JSON structure, TXT formatting and empty state.

Local verification: `npm run test --workspace=@education/database`, `npm run test --workspace=@education/calculators`, `npm run typecheck`, `npm run lint`, `npm run build`.
