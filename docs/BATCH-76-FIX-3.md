# Batch 76 Fix 3 — Publication page prop forwarding

The Admin publication page content function accepts `PublicationPageProps`,
whose shape is `{ searchParams: Promise<...> }`.

Fix 2 forwarded only the Promise itself. This fix forwards the complete props
object:

`AdminPublicationPageContent({ searchParams })`

No UI, workflow, RBAC, persistence, schema, migration, calculator policy,
audit behavior, or publication semantics are changed.
