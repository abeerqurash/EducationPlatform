# Batch 41 Fix 1 — Complete UX Hardening Application

The Batch 41 gate exposed that its contract test was updated but the generated
client artifact did not contain all intended Batch 41 implementation changes.

Fix 1 corrects the implementation rather than weakening the test:

- clears `reason` only after a successful publication transition;
- preserves `reason` after blocked or failed transitions;
- adds the stable tool-specific textarea id and explicit label association;
- links the character counter with `aria-describedby`;
- adds the polite live-region character counter.

No publication policy, RBAC permission, editorial gate, verification status,
review record, source, formula, database schema or persistence rule changes.
