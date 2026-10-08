# Batch 130 — Bulk study goal management

- Multi-select goals on the current page or individually, preserving selection while paging and filtering.
- Apply one of three actions: complete, reopen, archive. All operations require explicit confirmation.
- Hard cap of 50 selected goals; UUID validation and duplicate rejection on the server.
- One atomic account-scoped database UPDATE, excluding archived records; no new migration.
- Accessible selection controls and status feedback; uses existing themed action selector.
- Adds five unit tests. Run database/calculator tests, typecheck, lint, build locally.
- No environment files included; do not overwrite your local `.env.local`.
