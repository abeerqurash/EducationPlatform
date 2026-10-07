# Batch 32 — Admin Publication Queue Sorting & Pagination

Batch 32 extends the protected publication-management queue without changing
editorial state.

`/admin/publication` now adds:

- server-rendered sorting by recently updated, tool name, publication status,
  or calculator verification;
- deterministic 10-item pagination;
- previous/next navigation;
- current-page and total-page context;
- query-string preservation across pagination;
- safe normalization of invalid or out-of-range page values.

Search, publication-status filters and verification filters from Batch 31 remain
in place. Pagination links preserve those filters and the selected sort order.

The default `updated` order preserves the database repository's
`tools.updatedAt DESC` ordering.

No publication mutation, RBAC, editorial verification, review, formula, source,
or database state is changed by this batch.
