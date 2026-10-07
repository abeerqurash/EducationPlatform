# Batch 69 — Admin Queue Query Resilience

Batch 69 builds on the confirmed current Admin publication page rather than
assuming repository pagination.

The existing page already clamps a requested page to the final available page.
This batch preserves that behavior and groups additional boundary hardening:

- The 100-character Admin search limit is promoted to a named server-owned
  constant.
- A maximum accepted page number is introduced (`10,000`) so extremely large
  but otherwise safe integers are rejected before list processing.
- Existing strict positive-integer parsing, normalized search propagation,
  current-page clamping, filtering, sorting, and pagination remain intact.
- The UI contract now protects these confirmed behaviors.

No schema, migration, RBAC, publication workflow, calculator policy, repository
API, or persisted state changes.
