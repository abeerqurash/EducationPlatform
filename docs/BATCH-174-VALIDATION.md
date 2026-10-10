# Batch 174 executed validation

## Automated release checks

Run using `scripts/verify-batch-174.ps1` against the final source:

- Database package: 198 test files, 917 passing tests, including 33 new planning/storage/SEO behavior cases.
- Calculator package: 12 test files, 99 passing tests.
- Root TypeScript check, ESLint and production build passed.
- Production build generates 74 static pages, including 12 guide paths and the new public routes.

The root TypeScript command checks the web workspace. It does not mean the previously identified 254 strict database-workspace diagnostics were fixed. No full standalone database-workspace cleanup is included.

## HTTP acceptance

`scripts/verify-public-routes.mts` against a temporary local production server:

- All 44 declared public URLs returned HTTP 200 with a main heading and canonical metadata.
- Unknown guide, tool and category returned HTTP 404.
- Sitemap and robots endpoints returned HTTP 200; private routes were absent from sitemap output.
- Unit cases separately execute the real sitemap/robots functions for a configured HTTPS origin and for localhost. Local crawl blocking is expected, not a deployment sitemap failure.

## Browser acceptance

Chromium, production server, desktop 1366 × 900 and mobile 375 × 812:

- 300-minute 3:2 priority allocation produced 180/120 minutes.
- Study plan download emitted the intended filename; changed input removed the stale result.
- Checklist wrote no storage automatically. Explicit save, reload, load, corrupted-data rejection and clear worked.
- Guide search filtered to the intended guide; filtered metadata contained noindex.
- Guide Article JSON parsed correctly; legacy SAT route resolved to the implemented Digital SAT calculator.
- 44 unique rendered public links from directories and shared navigation returned successful responses, including auth redirects.
- Five key public pages had no horizontal overflow; no JavaScript page errors occurred.
- Guide and checklist mobile screenshots were visually inspected.

No accounts were created, no application database records were written, no email was delivered and no payment was initiated. The local production servers were stopped after checks. No exhaustive screen-reader, cross-browser, security, Lighthouse or deployment certification is claimed.

## Packaging

The manifest records changed files and source hashes. Cumulative and changes-only ZIPs are checked for CRC integrity and every entry is compared with its local source hash. The verification JSON records archive hashes and counts. Environment files, ignored dependencies/builds, uploaded data and scratch test databases are excluded.
