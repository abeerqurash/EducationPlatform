# Batch 21 — Trusted Publication State Resolver

Batch 21 removes client-supplied editorial state from the secure publication path.

The resolver reads directly from PostgreSQL:
- tool status and current version;
- matching active calculator version;
- calculator verification status;
- active formula verification status when applicable;
- all calculator-version source verification statuses;
- latest calculator-version editorial review and reviewed timestamp.

The secure service authorizes the actor first, resolves the trusted state from the database, then invokes the Batch 18 transactional persistence layer.

Security boundary:
A browser/admin form may request an action and provide the target tool ID/reason, but it must never be trusted to declare that a calculator, formula, source or review is verified/approved.

Dataset-driven calculators remain explicit through server-owned `requireFormula: false`. This option must be chosen by trusted server configuration, not a public form field.

No schema migration is required. No tool is automatically verified or published.
