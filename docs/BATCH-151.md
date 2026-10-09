# Batch 151 — Per-day schedule durations

Cumulative from Batch 150. Individual scheduled days can now have independent duration targets, adjusted in 15-minute increments. The default duration remains available for all days, and overrides can be reset. All schedule exports use the same computed entries, so TXT, JSON, CSV, and ICS include the customized durations. This changes planning only; it does not create study sessions or change persisted activity. Includes six regression tests. No migration or dependency changes.

Validation: run database/calculator tests, typecheck, lint, and build locally. Preserve `.env.local` when extracting.
