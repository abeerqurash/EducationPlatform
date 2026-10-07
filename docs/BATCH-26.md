# Batch 26 — Admin Publication Management Foundation

Batch 26 introduces the first protected Admin publication-management screen at `/admin/publication`.

The page calls Auth.js `auth()` on the server, resolves the authenticated user through persisted RBAC, redirects unauthenticated users to login, and redirects authenticated users without publication permissions to the normal dashboard.

The screen is deliberately read-only in this batch. It shows the tool, category, current version, calculator verification state, publication status and last-review date. It does not yet expose mutation buttons.

The next batch can connect permission-aware Submit for Review / Publish controls to the secured Server Action from Batch 24.

No verification, approval or publication state is changed by Batch 26.
