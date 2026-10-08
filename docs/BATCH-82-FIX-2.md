# Batch 82 Fix 2

Fixes the final stale route-contract failure left after Fix 1.

The operational `/admin/users` module is removed from the generic
`AdminSectionPage` route array and remains covered by its explicit
`AdminShell`/repository/access contract.

Adds a regression assertion preventing the upgraded Users & Access route from
being accidentally reclassified as a generic placeholder.

No runtime code, database schema, RBAC behavior, calculator behavior,
publication behavior, or UI design changes are included.
