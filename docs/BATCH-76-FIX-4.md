# Batch 76 Fix 4 — Auth UI + public-site button language

Visual corrections:
- Login/register and the rest of the `(auth)` route group now receive a real
  branded, responsive auth layout without replacing the existing auth forms or
  submission behavior.
- Existing semantic auth inputs/buttons are styled through route-scoped CSS.
- Generated customer/admin dashboard CTAs now use the same near-black,
  fully-pill-shaped button language as the public website's Get started CTA.
- Application logo remains Education Platform rather than a separate product
  identity.
- Public website header/button implementation itself is not changed.

No auth API, credential validation, session behavior, publication workflow,
RBAC, persistence, schema, migration, calculator policy or audit behavior is
changed.
