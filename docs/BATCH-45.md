# Batch 45 — Duplicate Submission Guard

Batch 45 adds an additional client-side duplicate-request safeguard to the
protected Admin publication controls.

Changes:
- `execute()` exits immediately when the React transition is already pending;
- confirmation buttons continue to use native `disabled`;
- confirmation controls now also expose `aria-disabled` while pending.

This reduces accidental duplicate Submit for review or Publish requests caused
by repeated activation while a mutation is already in flight.

This is not a concurrency or authorization boundary. Server-side session
authorization, persisted RBAC, workflow validation and publication persistence
remain authoritative.

No database schema, publication policy, RBAC permission, verification status,
review record, source record, formula or persisted publication state is
changed by this batch.
