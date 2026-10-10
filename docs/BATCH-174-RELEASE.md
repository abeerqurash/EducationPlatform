# Batch 174 — public discovery, learning guides and planning tools

Baseline: `7e36536e664775894b9094f398c3313c46d01eca`, verified against GitHub HEAD on 10 October 2026. The local working tree was clean before this batch. Source changes are already applied in the connected workspace; no commit or push was made.

## What is working

- `/tools`: searchable directory with category/access filters, result count, reset and no-results state. Discovery includes implemented pages, including previously omitted weighted-average and percentage-change tools. Unsupported catalog records do not generate broken links.
- `/guides`: searchable topic-filtered directory and 12 original articles with formulas, worked examples or review procedures, contextual tool links, related articles and safe Article structured data.
- `/tools/study/study-time-planner`: relative-priority allocation of 15–10,080 weekly minutes across 1–12 subjects. Whole-minute allocation preserves the budget. Edits clear stale results; plans download as text.
- `/tools/admissions/application-checklist`: eight preparation steps, completion count, explicit optional browser saving/loading, corruption handling, clearing and text download. It does not calculate admission probabilities. Local saving is separate from an account and does not sync between devices.
- Public test-prep, practice, admissions, resources, pricing, about, contact and help pages connect existing features. Privacy, cookies, accessibility and usage pages describe current implementation and operator configuration gaps.
- `/blog` redirects to original guides. Older SAT and college-chance links redirect to the implemented calculator and checklist.
- Canonical URLs, local crawl blocking, a public-only sitemap, filtered-directory noindex and private account/auth/admin noindex layouts.

## Install and verify

The cumulative ZIP includes the previous tracked project plus this batch. The changes-only ZIP is intended for the exact baseline above. Preserve `.env.local`, dependencies and uploaded data when copying. Those files are excluded from the ZIPs.

No dependency installation, schema migration or seed is introduced by Batch 174. Batch 173's migration and roles remain prerequisites for its question-library features; this batch does not repeat or change them.

```powershell
Set-Location C:\xampp\htdocs\EducationPlatform
powershell -ExecutionPolicy Bypass -File .\scripts\verify-batch-174.ps1
npm run dev
```

If TypeScript reports an error exclusively in old `.next/dev/types` after copying new routes, stop the development server and regenerate its ignored build cache before repeating checks. Do not delete source or database files. The tested tree used regenerated Next.js route types.

Optional HTTP acceptance, with the application already running:

```powershell
$env:PUBLIC_TEST_BASE_URL = 'http://localhost:3000'
npx tsx scripts/verify-public-routes.mts
```

Optional browser acceptance requires your installed Playwright module and Chromium. Set `PLAYWRIGHT_MODULE` to a module URL and, if needed, `CHROMIUM_EXECUTABLE` to its binary path; then run `node scripts/verify-batch-174-browser.mjs` from the repository root. It starts and stops a local production server on port 3019, after a build. It does not register accounts or change application database records.

## Configure before hosting

- Set `NEXT_PUBLIC_SITE_URL` to the deployed HTTPS origin, such as `https://your-domain.example`, before building. Paths, credentials, query strings and fragments are rejected. Localhost/HTTP configurations emit an empty sitemap and disallow crawling. Staging environments should also block indexing at the hosting layer.
- Set server-side `SUPPORT_EMAIL` to a real operator-owned address before building if you want a public email contact link. Without it, contact honestly states that an address is not configured. This is a mail link, not a delivered contact form or helpdesk.
- Review the operational privacy/usage notices and supply actual operator identity, jurisdiction-specific service terms, retention and data-request arrangements before a public launch. The pages do not establish these missing arrangements or promise automated account deletion.
- Paid checkout, automated recovery email, official scaled-score practice, parent/educator/school products and advanced monetization remain unfinished. Current pricing states the available free features and does not offer a fake checkout.

## Rollback

Restore the code from the baseline if needed and rebuild. This batch adds no database schema changes. A saved browser checklist remains under `ep-admissions-checklist-v1`; users can remove it using Clear checklist or browser site-data settings. Downloaded files remain under the user's control.
