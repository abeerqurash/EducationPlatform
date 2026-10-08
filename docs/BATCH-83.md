# Batch 83 — Controlled admin bootstrap + operational RBAC

The first dedicated platform administrator can now be bootstrapped exactly once
from an already-authorized publication-compatible account, after the dedicated
role/permission definitions have been seeded. No email, user ID, or account is
guessed or silently elevated.

Dedicated platform administrators can assign/remove persisted RBAC roles and
activate/deactivate accounts. Every privilege mutation requires a reason and is
written to the existing audit log.

Safety boundaries prevent self-deactivation, self-removal of platform-admin,
removal of the final platform admin, deactivation of the final platform admin,
and role assignment to inactive accounts. Compatibility admins become read-only
after dedicated administration exists.

No schema migration is introduced.

Seed the role/permission definitions explicitly before testing bootstrap:
`npx tsx packages/database/src/seeds/run-platform-admin-rbac.ts`

The seed creates definitions only; it assigns no user.
