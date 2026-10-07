# Batch 40 — Publication Blocker Feedback

Batch 40 improves the Admin publication action feedback for blocked workflow
transitions.

When the secured server action returns `transition_blocked`, the client now:
- keeps the existing high-level error message;
- safely reads workflow issues only when they are returned as an array;
- displays string issues directly;
- displays object issues only when they expose a string `message`;
- ignores unknown issue shapes rather than rendering unsafe or meaningless
  values.

The UI clears stale blocker details before a new action or confirmation.

This does not move publication policy into the browser. The server remains the
source of truth for whether a transition is allowed and for the blocker data
returned to the UI.

No database schema, RBAC permission, publication policy, verification status,
review record, source record, formula or persisted publication state is
changed by this batch.
