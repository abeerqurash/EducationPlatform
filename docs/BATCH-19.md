# Batch 19 — Authorized Publication Service Boundary

Adds the application-service layer above the Batch 18 transactional persistence adapter.

Permission separation:
- `calculators.review.submit` — may submit a calculator for editorial review.
- `calculators.publish` — may publish after the strict editorial gate passes.

Flow:
authenticated route/server action
→ resolve real RBAC permission keys
→ `executePublicationAction`
→ authorization check
→ Batch 16/17 publication workflow gate
→ Batch 18 PostgreSQL transaction
→ tool update + audit log + change history

Important:
This batch defines the permission contract but does not silently seed or grant these permissions to roles. Role grants are security-sensitive and should be added explicitly to the RBAC seed after the existing role/permission mapping is reviewed. No role name is treated as an implicit bypass.

The service accepts the real authenticated user ID and permission keys. It never trusts a client-supplied role name and never invents an actor.
