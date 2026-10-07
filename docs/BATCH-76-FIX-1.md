# Batch 76 Fix 1

The Batch 76 automated publication-shell wrapper matched the first `return (`
in each source file rather than the page component's final JSX return. That
inserted JSX into helper functions and broke parsing.

This fix completely removes those unsafe wrapper insertions from both
established publication pages. The new Admin overview, reusable AdminShell and
AuthShell remain in Batch 76.

The publication queue/detail remain on their previously passed UI for now.
They will only be migrated into the shared shell when their exact component
boundary is handled structurally rather than by a broad text anchor.

No publication workflow, request boundary, RBAC, database, schema, migration,
calculator policy, audit behavior, or persisted state is changed.
