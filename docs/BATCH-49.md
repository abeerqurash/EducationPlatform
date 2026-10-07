# Batch 49 — Publication Conflict Recovery Guidance

Batch 49 completes the Admin-side handling for the typed persistence responses
introduced in Batch 48.

The publication client now gives explicit recovery guidance for:
- `state_conflict`: refresh the detail page and review the latest persisted
  state before retrying;
- `not_found`: refresh the publication queue because the target is no longer
  available.

The existing structured blocker list remains reserved for trusted
`transition_blocked` responses. Generic failures continue to use their normal
server-provided safe message, and unexpected thrown requests continue to use
the Batch 47 fallback.

No database schema, publication eligibility policy, RBAC permission,
verification requirement, review/source/formula record or persisted
publication state is changed.
