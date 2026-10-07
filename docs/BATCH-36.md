# Batch 36 — Publication Cache Revalidation

Batch 36 hardens the successful publication mutation boundary.

After a secured publication transition succeeds, the server action now
revalidates both the publication queue and the affected publication-detail
route. This complements the existing client refresh and prevents later
server-rendered navigation from depending on stale cached publication data.

Revalidation happens only after the trusted publication service reports a
successful transition. Invalid, unauthenticated, forbidden, blocked or failed
actions do not trigger it.

No publication policy, RBAC permission, editorial gate, verification state,
review record, source record or database schema is changed.
