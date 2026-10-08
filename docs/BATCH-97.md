# Batch 97 — Exam history date filters and CSV export

- Student-scoped UTC date range filtering for saved SAT/ACT result history.
- Filtered CSV export endpoint with session authentication, bounded 1,000-row output, private no-store headers, UTF-8 BOM, and spreadsheet formula injection escaping.
- Preserves exam/date filters during pagination and export.
- Corrects out-of-range pagination to the last available page.
- No schema migration or new package dependency.
- Run database/calculator tests, typecheck, lint, and production build locally before marking this batch passed.
