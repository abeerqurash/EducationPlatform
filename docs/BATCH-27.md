# Batch 27 — Admin Publication Actions UI

Batch 27 connects the protected Admin publication table to the secured server
mutation boundary introduced earlier.

The browser sends only:
- tool ID;
- allow-listed publication action;
- an audit reason.

It does not send authenticated user identity, roles, permission keys,
verification/review state, or publication-policy overrides.

The UI exposes Submit for Review only when the current status can move toward
review, and Publish only while the tool is in review. These are convenience
controls only: the server remains authoritative and re-checks Auth.js identity,
database RBAC, editorial state and the publication gate before committing.

Successful actions refresh the server-rendered table. Blocked/forbidden actions
surface the safe response returned by the server action.

No client-side control can bypass the server publication gate.
