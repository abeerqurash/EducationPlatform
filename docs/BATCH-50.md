# Batch 50 — Automatic Stale Publication Refresh

Batch 50 completes conflict recovery by refreshing the current Admin route when
the trusted server response reports either `state_conflict` or `not_found`.

Why:
- a state conflict means the rendered publication snapshot is stale;
- a not-found response means the current target no longer matches persisted
  state.

The safe error message is still set first. The entered action reason is
preserved because these are unsuccessful mutations, allowing the operator to
review the refreshed state and retry without retyping context when appropriate.

Successful mutations continue to clear the reason and refresh as before.
Unexpected thrown requests do not trigger an automatic refresh.

No database schema, publication eligibility policy, RBAC permission,
verification requirement, review/source/formula record or persisted
publication state is changed.
