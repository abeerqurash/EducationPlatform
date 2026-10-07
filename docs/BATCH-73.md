# Batch 73 — Publication Detail Semantic Regions

Batch 73 moves beyond the queue and groups accessibility hardening across the
confirmed publication-detail screen.

- The publication status-card group now has an accessible region name.
- Editorial readiness, latest review, and linked evidence are explicitly
  associated with their visible headings through `aria-labelledby`.
- Those headings receive stable unique IDs.
- The Ready/Blocked editorial-gate badge is exposed as polite atomic status
  feedback without changing the visual design.
- A standalone contract protects the complete semantic structure.

No database query, schema, migration, RBAC, publication workflow, calculator
policy, action behavior, or persisted state changes.
