# Batch 14 — Enhanced ACT Database & Provenance

Adds an idempotent ACT database seed and runner.

The tool is intentionally kept `draft` in this batch. The engine exists, but public publication should happen only after the public ACT UI is installed and the editorial verification workflow has reviewed the calculator/version/sources.

Official ACT sources are inserted as `pending` on first creation. Existing source verification states are preserved on reruns, so a later editorial `verified` state is not downgraded.

No universal raw-correct-answer conversion is stored. The current calculator accepts already-scaled ACT section scores (1–36).
