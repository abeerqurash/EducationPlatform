# Batch 79 Fix 1

Corrects the two integration defects reported by the Batch 79 gate.

1. `captureCalculator` now receives `toolName` explicitly. This fixes the
   TypeScript/build failure and keeps the result summary tied to the
   server-provided tool identity.
2. The older student-results contract now asserts the richer Batch 79
   `getStudentResultOverview` dashboard integration instead of the superseded
   Batch 78 `getStudentResultCount` call.
3. The calculator-save contract now guards the explicit tool-name dependency
   so the scope regression is caught in future changes.

No calculator formulas, result persistence semantics, database schema,
migration, publication workflow, RBAC, UI design, or button behavior changed.
