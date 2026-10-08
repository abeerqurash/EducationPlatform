# Batch 92 — 30-day study analytics

Adds an independent, SQL-aggregated 30-day UTC study trend with exact minute,
activity, and distinct active-day totals. Zero-activity dates are represented
explicitly; future-dated rows are excluded. The Progress page displays a
responsive accessible daily chart and summary. No schema migration, seed,
new package, calculator change, or RBAC change.
