# Batch 115 — Saved Result JSON Download

Adds a browser-only structured JSON export alongside Copy summary, Copy details, and Download .txt. The schema is versioned (`schemaVersion: 1`) and contains only the already-displayed calculator name, summary, UTC saved date, and optional version. No API, database migration, external dependency, or GitHub write is required. Filenames reuse the existing sanitized basename. The browser-generated Blob URL is revoked after download initiation. Three source-contract tests added.

This ZIP is a cumulative source overlay based on Batch 114; preserve existing root files, dependencies and `.env.local`.
