# Batch 85 — Admin directory UX and input hardening

- Search is capped at 160 characters, including on the server-side repository.
- Pagination inputs are bounded, and the displayed page is clamped to the actual result count.
- Search, role and reason inputs have accessible labels.
- Self-deactivation is disabled in the UI (server-side protection remains authoritative).
- Assign action is disabled when all available roles are already assigned.
- Adds regression contracts for these behaviors.

No schema migrations, permission grants, or public frontend design changes.
