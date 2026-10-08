# Batch 87 — Student input integrity and archived-goal safety

- Validate actual calendar dates (including month lengths and leap years) for study-goal deadlines.
- Validate timezone names using the runtime IANA timezone registry.
- Require safe integer study targets within existing supported limits.
- Prevent completion changes and redundant archive operations on archived goals.
- Preserve existing direct-form action signatures, public UI, schema, and database migrations.
- Add regression contracts for the validation and ownership boundaries.

No database migration or seed required.
