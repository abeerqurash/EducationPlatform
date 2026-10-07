# Batch 29 — Fix 1

The Batch 29 production implementation typechecked, linted and built successfully.
The only failure was the new database source-contract test resolving the web
files one directory above the repository root.

From `packages/database/src/publication/`, the repository root is four parent
directories away. This fix corrects both test fixture URLs accordingly.

No production code, request validation, RBAC, publication policy, UI or database
behavior is changed.
