# Batch 51 Fix 1 — Primary Confirmation Lock

The Batch 51 gate passed all tests, typecheck and production build, but ESLint
reported that `actionControlsLocked` was unused. The original replacement
anchors did not match the actual cumulative primary action button markup.

Fix 1 applies `actionControlsLocked` to the real Submit for review and Publish
primary buttons and mirrors that state with `aria-disabled`.

No server behavior, database schema, publication policy, RBAC, editorial gate,
verification requirement, review/source/formula record, or persisted
publication state changes.
