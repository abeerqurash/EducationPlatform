# Batch 125 — Goal health and deadline intelligence

- Study Plan now summarizes non-archived goals into open/completed totals, completion percentage, overdue/due-today/upcoming counts, unscheduled goals and total planned minutes.
- UTC date comparison avoids browser locale drift; next-seven-day deadline counts include the seventh day.
- Accessible completion progress indicator and expandable list of the eight earliest open deadlines.
- Four unit tests cover empty goals, deadline windows, completed-goal exclusion and preview limit.
- No migrations, external services or additional dependencies. Existing themed export selectors remain unchanged.

## Validate
`npm run test --workspace=@education/database && npm run test --workspace=@education/calculators && npm run typecheck && npm run lint && npm run build`
