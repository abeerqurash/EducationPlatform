# Batch 18 — Transactional PostgreSQL Publication Persistence

Adds the real PostgreSQL persistence adapter for the Batch 16/17 publication workflow.

Atomic transaction:
1. Re-read the target tool.
2. Reject stale workflow state before mutation.
3. Update tool status and `lastReviewedAt` when publishing.
4. Insert the audit log using the authenticated actor supplied by the caller.
5. Insert the change-history snapshot.
6. Commit all three writes together, or roll all of them back if any write fails.

Safety properties:
- no actor identity is invented;
- UUID-shaped tool/actor identifiers are rejected before database work;
- blocked editorial transitions perform no database mutation;
- stale status is detected before the update;
- existing `currentVersion` is captured in audit/change history;
- no migration/schema change is required;
- ACT remains unverified/draft until a real reviewer/admin workflow supplies the required verification and approval state.

The included unit test covers the persistence contract without touching the developer database. A later isolated PostgreSQL integration-test layer should test rollback behavior against a disposable test database rather than mutating the development database during normal unit tests.
