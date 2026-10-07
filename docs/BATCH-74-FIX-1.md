# Batch 74 Fix 1

The Batch 74 gate exposed a contract mismatch, not a broken production
label/control association.

The current action component already uses a stronger per-tool dynamic pair:
`htmlFor={publication-reason-${toolId}}` and
`id={publication-reason-${toolId}}`. The contract now protects that actual
implementation instead of expecting a nonexistent static ID.

This fix also corrects Batch 74 feedback semantics: the existing outer
error/success container remains the single live region. Errors retain
`role="alert"` with assertive announcement; successful feedback retains
`role="status"` with polite announcement. The nested status role introduced
by Batch 74 is removed, avoiding suppression of the stronger error semantic.

The redundant textarea aria-label introduced by Batch 74 is also removed
because the existing visible label is already correctly associated.

No workflow, payload, server validation, RBAC, database, migration,
calculator-policy, audit, or persisted-state behavior changes.
