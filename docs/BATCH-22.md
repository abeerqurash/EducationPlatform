# Batch 22 — Database-Resolved Publication Actor

Batch 22 removes the remaining client-trust boundary from publication authorization.

The new actor resolver reads permission keys through the real PostgreSQL RBAC graph:

`user_roles → role_permissions → permissions`

The authenticated publication service now accepts only:
- a server-authenticated user ID;
- target tool ID;
- requested action;
- optional audit reason;
- trusted server-owned resolver options.

It resolves permission keys from PostgreSQL and then uses Batch 21 to resolve editorial state from PostgreSQL before the publication workflow and atomic persistence transaction run.

Security rules:
- never accept permission keys from browser request data;
- never accept a role name as proof of authorization;
- never accept verification/review status from browser request data;
- authenticated users with no matching publication permission are denied;
- duplicate permissions inherited through multiple roles are deduplicated;
- no role or permission is invented;
- no calculator is automatically verified or published.

The Next.js route/server-action adapter should obtain `authenticatedUserId` from the Auth.js server session. That adapter is intentionally the next boundary rather than mixing HTTP/session concerns into the database package.
