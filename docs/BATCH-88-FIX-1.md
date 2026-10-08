# Batch 88 Fix 1

Corrects the direct HTML form server action signature: `updateStudyGoalAction` now returns `Promise<void>` rather than an object. The update result still controls path revalidation. No schema, UI, or permission changes.
