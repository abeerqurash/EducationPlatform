# Batch 82 Fix 3

The previous fixes targeted a long project-relative users-route string, while
the actual application route contract uses paths relative to the app root:
`admin/users/page.tsx`.

This fix reconstructs the admin route contract exactly:
- generic placeholder routes continue to require `AdminSectionPage`
- `admin/users/page.tsx` is excluded from that generic loop
- the operational Users & Access route has its own explicit `AdminShell`,
  access-control, repository, and audit assertions

No runtime application code changes.
No database migration.
No RBAC behavior, calculator logic, publication logic, or UI changes.
