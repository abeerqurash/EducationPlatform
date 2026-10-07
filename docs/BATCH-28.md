# Batch 28 — Admin Publication Detail & Review Readiness

Adds a protected per-tool publication detail route:

`/admin/publication/[toolId]`

The page derives its display from persisted calculator editorial data and shows:
- publication status;
- active calculator verification status;
- active formula verification status;
- latest calculator-version review status;
- linked source verification states;
- exact editorial-gate blocking issues;
- the existing permission-aware publication controls.

The detail repository is read-only. It uses the same strict formula/source requirements currently enforced by the atomic publication transaction. The server mutation path remains authoritative; readiness shown in the UI is informational and is recalculated again during mutation.

No editorial state is invented or changed by loading the detail page.
