# Batch 29 — Publication Request Boundary Hardening

Batch 29 hardens the Admin publication Server Action boundary before expanding
the editorial-management surface.

The action now rejects any request containing fields outside the explicit
allow-list:

- `toolId`
- `action`
- `reason`

This means extra browser-supplied fields are rejected rather than silently
ignored. Identity, roles, permission keys, editorial verification state and
publication-policy overrides remain server-owned.

The existing UUID, action and reason validation remains in place. No database
publication semantics, RBAC permissions, editorial gate rules or UI design are
changed by this batch.

A source-contract test also protects the boundary from accidentally accepting
identity or policy fields in future changes.
