# Batch 130 Fix 1

Corrects the bulk study-goal completion update to pass a YYYY-MM-DD string to the Drizzle `date(..., { mode: "string" })` column. Reopening still sets null, and archiving remains unchanged. No migration or new dependency.
