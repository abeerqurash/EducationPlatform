# Batch 24 — Auth.js Server Action Publication Adapter

Batch 24 connects the actual Auth.js `auth()` server call to the publication security chain.

New server action:
`apps/web/src/app/admin/publication/actions.ts`

The action:
- calls `auth()` on the server for every mutation;
- never accepts actor ID, role names, permission keys, review state, verification state, or publication policy from the browser;
- validates tool UUID, action allow-list, and audit reason length;
- returns explicit 400/401/403/409/500-safe result envelopes;
- does not leak database/internal errors;
- serializes Date values before crossing the Server Action boundary.

Batch 24 also hardens the Batch 23 session request type by removing `resolverOptions` from the request-facing boundary. Publication policy options therefore cannot be supplied by a client through this path.

No Admin publication UI is added in this batch. The mutation boundary is ready for the Admin UI to consume after the gate passes.
