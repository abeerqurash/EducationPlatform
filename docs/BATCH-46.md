# Batch 46 — Action-Specific Pending State

Batch 46 makes the Admin publication mutation state explicit.

The client now records whether `submit_for_review` or `publish` is the action
currently in flight. Loading copy is tied to that exact action, and the action
marker is cleared in `finally` after the secured server request settles.

The existing duplicate-request guard and disabled controls remain in place.

This is UI state hardening only. Server-side authentication, RBAC, editorial
policy, workflow validation and persistence remain authoritative.

No database schema, publication policy, permission, verification, review,
source, formula or persisted publication state is changed.
