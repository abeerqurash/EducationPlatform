# Batch 133 — Filtered study goal insights

Adds live summary metrics to the Study Goal workspace using only currently matching goals (across all pages), including completion rate, open goals, planned and remaining target time, next scheduled deadline, and deadline buckets. Quick-filter buttons focus overdue/today/next-seven-days/unscheduled open goals and reset bulk selections for safety. The metrics reflect the same client-side filtering as existing exports, and do not alter database persistence or introduce migrations/dependencies.

## Verification

Run `npm run test --workspace=@education/database`, `npm run test --workspace=@education/calculators`, `npm run typecheck`, `npm run lint`, and `npm run build` locally. These commands were not run while packaging.
