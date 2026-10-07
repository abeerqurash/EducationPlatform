# Batch 31 — Admin Publication Queue Filters

Batch 31 improves the publication-management queue without changing editorial
state.

`/admin/publication` now provides server-rendered:
- tool/name/category search;
- publication-status filtering;
- calculator-verification filtering;
- publication-state counts;
- visible/total result counts;
- a reset path;
- a clear empty-filter result state.

Filters are represented in the URL query string, so the view remains
shareable/bookmarkable and does not require client-side state or extra
JavaScript.

The existing protected route, database RBAC checks, readiness links and secured
publication actions remain unchanged.
