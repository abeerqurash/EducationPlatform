# Batch 23 — Auth.js Session Publication Boundary

Batch 23 adds the server-only bridge between the authenticated Auth.js session and the secure publication application service.

The boundary accepts a session-shaped object and publication request. The actor identity is derived exclusively from `session.user.id`.

Security properties:
- request data has no actor/user ID field;
- missing session identity fails closed;
- permission keys remain database-resolved by Batch 22;
- editorial verification/review state remains database-resolved by Batch 21;
- the browser cannot choose the audit actor;
- the browser cannot grant itself permissions;
- the browser cannot assert verification or approval state;
- no calculator is automatically verified or published.

This batch intentionally does not expose a public API route or Admin button yet. The next adapter can call `auth()` on the server and pass that returned session into `executeSessionPublicationAction`.
