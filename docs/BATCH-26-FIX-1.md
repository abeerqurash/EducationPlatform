# Batch 26 — Fix 1

The Batch 26 database tests and lint passed, but the new Admin page used a
repository-relative import path that was one directory too shallow.

`apps/web/src/app/admin/publication/page.tsx` is nested at:

`apps/web/src/app/admin/publication/`

Reaching the monorepo root from that directory requires six parent traversals,
not five.

This fix updates only the three database publication imports in that page:

- actor-resolver
- authorization
- admin-repository

No publication logic, RBAC policy, database state, UI behavior, or mutation
behavior is changed.
