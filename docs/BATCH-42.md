# Batch 42 — Publication Action Accessibility Feedback

Batch 42 continues hardening the protected Admin publication controls.

Changes:
- the reason helper now reports explicit remaining characters instead of only
  showing a terse current/max count;
- the existing polite live region announces that feedback to assistive
  technology;
- the publication action region exposes `aria-busy` while its secured server
  mutation is pending.

The existing browser `maxLength={1000}` remains a usability constraint only.
The server action continues to independently enforce the 1000-character
maximum.

No publication policy, RBAC permission, editorial gate, verification state,
review record, source, formula, database schema or persisted publication state
is changed by this batch.
