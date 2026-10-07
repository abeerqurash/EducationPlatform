# Batch 25 — Atomic Trusted Publication Transaction

Batch 25 hardens the publication path before any Admin publication controls are exposed.

The previous path reconstructed editorial state before opening the write transaction. Batch 25 introduces `atomic-persistence.ts`, which reconstructs the tool/current calculator/formula/sources/latest review and performs the status mutation, audit log, and change-history write inside one PostgreSQL transaction.

Additional hardening:
- the final tool UPDATE predicates on both tool ID and the expected prior status;
- publication policy is strict and server-owned (`requireFormula` and `requireVerifiedSource` are true);
- resolver/policy override options are removed from the secure and authenticated service inputs;
- request/session boundaries still cannot supply actor permissions, editorial state, or policy overrides;
- no verification or approval state is invented.

The older resolver/persistence modules remain for their lower-level contracts and tests, but the authenticated production path now uses the atomic trusted adapter.

A future server-owned calculator policy registry can introduce audited exceptions for genuinely dataset-driven calculators. Such exceptions must not come from browser input.
