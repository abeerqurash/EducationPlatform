# Batch 47 — Unexpected Request Failure Feedback

Batch 47 hardens the Admin publication client against unexpected request
failures such as a rejected server-action promise or transient transport/runtime
failure.

The existing structured publication response path remains unchanged. If the
request throws before a normal response is available, the operator now receives
a clear error message instead of an unhandled client failure. Blocker details
are cleared because no trusted structured blocker response was received.

The action-specific pending marker is still cleared in `finally`, so controls
do not remain stuck after an unexpected failure. The entered action reason is
preserved for retry because it is cleared only after a successful mutation.

No database schema, publication policy, RBAC permission, editorial gate,
verification state, review record, source, formula or persisted publication
state is changed.
