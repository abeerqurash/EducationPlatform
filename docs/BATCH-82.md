# Batch 82 — Operational platform-admin access

Batch 82 turns the Batch 81 dedicated admin permission foundation into a real
protected access-management workflow.

## Delivered
- account directory with search and pagination
- persisted RBAC role visibility
- dedicated platform-admin count
- audited platform-admin grant/revoke repository operations
- server actions that require `platform.admin.access`
- self-revocation prevention
- final-platform-admin removal prevention
- inactive-account grant protection
- permission-change audit history
- read-only Users & Access view for legacy publication-compatibility admins
- explicit platform-admin RBAC seed runner

## Bootstrap safety
No user is silently elevated. Existing publication administrators retain
read-only compatibility access to the Users & Access page, but they cannot
grant/revoke platform administrator privileges.

Before privilege management can be used, an operator must seed the dedicated
role/permission and deliberately assign the first trusted platform admin. The
automatic batch does not guess which account should receive that authority.

## Database
No schema migration is introduced. Existing roles, permissions, user_roles and
audit_logs tables are used.
