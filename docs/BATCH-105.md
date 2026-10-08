# Batch 105 — Saved test-prep history pagination clarity

- Displays the one-based visible result range for the current page, with a distinct empty-results message.
- Adds First page and Last page navigation only when meaningful.
- Reuses the existing filter-preserving history URL builder, keeping exam, date, sorting and page size.
- Clamps invalid page and page-size values in the presentation helper; does not alter repository validation or SQL.
- Adds regression tests for partial last pages, empty results and boundary navigation.
- No migrations, dependency changes or configuration changes.
