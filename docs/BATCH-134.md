# Batch 134 — Deadline-grouped goal workspace

- Adds a list/grouped display toggle to the existing study goal workspace, without a native select element.
- Grouped mode partitions the **current paginated page** into overdue, due today, next seven days, later, no deadline and completed sections.
- Section headers include counts and target-minute totals. Goals retain the user's existing sorting order within each section.
- Existing search, filters, pagination, selection, editing, export, and bulk actions continue to use the same source of goals.
- Pure UTC-date grouping helper and seven tests cover boundaries, ordering, completed goals, totals, empty results, and invalid dates.
- No new migrations or dependencies. No existing database data is changed.

## Validate locally

`npm run test --workspace=@education/database`

`npm run test --workspace=@education/calculators`

`npm run typecheck`

`npm run lint`

`npm run build`
