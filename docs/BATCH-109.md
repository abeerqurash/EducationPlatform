# Batch 109 — Saved test-prep result keyword search

- Server-side, owner-scoped case-insensitive substring search across calculator name and result summary.
- Keyword length capped at 80 characters; whitespace normalized and SQL LIKE metacharacters escaped.
- Accessible, 50px-high search control matching shared form height guidance.
- Search is preserved across exam/date/sort/size filters, custom calendar dates, numbered/page-jump navigation, and CSV export.
- Active search chip and independent clear-search action.
- No schema migrations or dependency changes.
- Run all database and calculator tests, TypeScript, lint, and production build locally.
