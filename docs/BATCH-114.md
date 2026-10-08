# Batch 114 — Browser-side saved exam result text download

Adds **Download .txt** to saved SAT/ACT result rows in `/dashboard/test-prep`, alongside existing Copy summary and Copy details actions. Uses the same owner-scoped fields already returned for the authenticated dashboard. The browser creates a UTF-8 text file and a sanitized filename; no network request, new permission, dependency, or database migration is required. Existing filters, pagination, search, highlighting, and copy actions remain unchanged.

## QA
- Database publication contract: `test-prep-download-details-contract.test.ts`
- Run database and calculator tests, typecheck, lint, and build on the local project.
- Manually verify download filename, content, browser download permission, and keyboard feedback.

This is a cumulative overlay ZIP. Preserve `.env.local` and local uncommitted changes when applying.
