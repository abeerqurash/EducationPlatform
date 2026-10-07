# Batch 72 — Admin Filter Form Semantics

Batch 72 continues the accelerated grouped hardening of the confirmed Admin
publication queue.

- The search control now has a stable ID and a real associated label, while
  preserving the existing visual design through an `sr-only` label.
- The existing accessible search name remains intact for compatibility.
- The filter/search submit button is explicitly `type="submit"` when present,
  preventing future form composition from changing its intent.
- Existing empty-result UI receives status semantics when the confirmed markup
  exposes that state.
- Existing live result feedback, canonical reset, normalized query handling,
  search bounds, strict page parsing, page cap, filter allowlists, sorting,
  range feedback, and page clamping remain unchanged.

No schema, migration, RBAC, publication workflow, calculator policy, repository
API, or persisted state changes.
