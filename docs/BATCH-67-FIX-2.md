# Batch 67 Fix 2 — Overlay-Safe Stale Test Replacement

Fix 1 removed the invalid pagination contract from the ZIP, but applying these
batches as overlays cannot delete a file that already exists in the local
project. The stale test therefore remained on disk and Vitest continued to run
it.

Fix 2 explicitly includes that exact path and replaces the stale assertions
with a contract matching the repository that actually exists:
`listAdminPublicationTools()` has no repository-level pagination/offset and
orders the current queue by `tools.updatedAt DESC`.

Production/runtime code is unchanged.

No schema, migration, RBAC, publication policy, queue behavior, or persisted
data is changed.
