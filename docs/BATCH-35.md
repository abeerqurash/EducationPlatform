# Batch 35 — Admin Evidence & Review Traceability

Batch 35 improves the protected publication-detail screen with additional
read-only traceability.

The detail repository now exposes:
- the persisted latest review record ID;
- total linked source count;
- verified linked source count.

The Admin detail UI shows:
- total, verified and not-verified evidence counts;
- the latest review record identifier alongside its persisted status, reviewer,
  date and notes.

These additions make it easier to understand which persisted editorial records
are supporting or blocking publication without creating any new editorial
state.

No publication action, RBAC permission, verification status, review status,
source record, formula record or database state is changed by this batch.
