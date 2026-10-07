# Batch 52 — Stale Confirmation Reset

Batch 52 closes inline publication confirmations when the trusted server
response reports `state_conflict` or `not_found`, before refreshing the Admin
route.

Why:
- those responses mean the confirmation snapshot is stale;
- keeping the old confirmation open after a route refresh could invite a retry
  against assumptions that are no longer current.

The entered action reason remains preserved because the mutation did not
succeed. The operator can review the refreshed persisted state and deliberately
open a new confirmation if the action is still appropriate.

Successful mutations, transition blockers, unexpected request failures and the
secured server boundary retain their existing behavior.

No database schema, publication eligibility policy, RBAC permission,
verification requirement, review/source/formula record, or persisted
publication state is changed.
