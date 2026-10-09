# Batch 137 — Themed Study Activity History

Cumulative on Batch 136 UI Fix 1. The Progress dashboard now has a client-side searchable activity list with themed activity-type, sort, and page-size dropdowns, plus pagination, accessible result feedback, empty state, and reset controls. The server still owns authentication, the seven-day activity window, and deletion authorization. Only the existing account-scoped activity records are passed into the client; filtering does not change totals or saved data.

- Search: title, case-insensitive.
- Types: all, study sessions, calculator activity.
- Sorting: newest, oldest, longest duration, title.
- Pagination: 5, 10, or 20 per page.
- Manual session delete retains existing confirmation.
- No new dependencies or migrations. No browser-default select controls.

## Validation

Run `npm run test --workspace=@education/database`, `npm run test --workspace=@education/calculators`, `npm run typecheck`, `npm run lint`, `npm run build` locally. No npm commands were run when packaging.
