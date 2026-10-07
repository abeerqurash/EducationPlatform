# Batch 43 — Publication Confirmation Context

Batch 43 makes the existing review and publish confirmations more explicit.

Before either confirmed mutation, the Admin UI now shows the exact normalized
(trimmed) action reason that will be sent to the secured server action. When
the operator leaves the optional reason blank, the confirmation explicitly
states that no action reason was provided.

The same `normalizedReason` value is used for both the confirmation preview and
the request payload, avoiding a mismatch between what the operator confirms
and what the client submits.

This remains a browser UX safeguard only. Server-side request validation,
session authorization, RBAC, editorial rules and publication persistence
remain authoritative.

No database schema, publication policy, verification status, review record,
source record, formula or RBAC permission is changed.
