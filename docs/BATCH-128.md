# Batch 128 — Study goal workspace pagination

Adds accessible, client-side pagination to the already account-scoped and filtered study goal list. The selected 10/20/50 page size uses the reusable themed dropdown; filtering/search/sorting/page-size changes reset the current page. Previous/Next buttons are disabled at bounds. Pagination never changes goal exports or mutates persisted data.

No schema migrations, dependency changes, or configuration changes. Run database tests, calculator tests, typecheck, lint, and build after extracting. Preserve `.env.local`.
