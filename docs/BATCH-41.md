# Batch 41 — Publication Action UX Hardening

Batch 41 hardens the operator-entered publication reason flow introduced in
Batch 39.

Changes:
- the reason is cleared only after a successful persisted transition;
- failed or blocked actions preserve the entered reason for correction/retry;
- the textarea now has a stable tool-specific id and explicit label
  association;
- the character counter is linked with `aria-describedby`;
- the counter uses a polite live region for assistive technology.

The existing 1000-character browser limit and independent server-side
validation remain unchanged.

No database schema, publication policy, RBAC permission, editorial gate,
verification status, review record, source record, formula or persisted
publication state is changed by this batch.
