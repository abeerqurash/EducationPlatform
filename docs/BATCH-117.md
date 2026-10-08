# Batch 117 — Filtered saved exam history JSON export

- Adds authenticated `/dashboard/test-prep/export-json` GET endpoint.
- Reuses existing normalized, owner-scoped, 1,000-row bounded history export query, with exam, keyword, UTC date, and sort filters.
- Exports a versioned JSON document with filter metadata, result count, and displayed saved result fields; no internal result IDs.
- Adds `Export filtered JSON` alongside the existing CSV link.
- No migration, dependencies, or `.env.local` changes. Previous batches retained.
- Local gate: `npm run test --workspace=@education/database`, `npm run test --workspace=@education/calculators`, `npm run typecheck`, `npm run lint`, `npm run build`.
