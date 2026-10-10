# Batch 173 executed acceptance - 10 October 2026

| Check | Evidence |
| --- | --- |
| Baseline | Initial tree clean; local and GitHub HEAD 48b98f83c57856df45adac98b2c896ebac131392; remote rechecked before packaging |
| Database regressions | 197 files / 884 tests passed, including 39 new question-bank behavior/repository tests |
| Calculator regressions | 12 files / 99 tests passed |
| Root TypeScript | Passed |
| Lint | Passed |
| Production build | Passed; compiled, checked TypeScript and generated 41 static pages |
| Strict database package TypeScript | 254 existing diagnostics remain; no new question-bank module diagnostics |
| Real PostgreSQL migration | PostgreSQL 18 isolated instance; 8 checks passed; migration fixtures/schema rolled back |
| Real PostgreSQL repositories | All journaled migrations applied to EMPTY disposable database; 21 workflow checks passed |
| Authenticated Chromium desktop flow | Login, author create/submit, self-review action hidden, other reviewer publish, student practice passed |
| Draft recovery | Saved answers restored after page reload |
| Server submission/history | Educational result saved and pinned question snapshot displayed in private history |
| Mobile | 375px width, no horizontal overflow; library and history screenshots captured; library screenshot visually inspected |
| Browser errors | No page runtime errors in the tested flow |
| Release verification script | Executed against final source; fails immediately on a failed npm check |
| Source diff/ZIP | Diff whitespace checked; archive entry hashes and CRC integrity checked during packaging |

The workflow checks cover unauthorized authoring/editorial reads, direct draft
publication denial, self-review denial, scoped question delivery, one open session,
draft recovery, revision replacement, concurrent duplicate submissions, immutable
history, private ownership, deleted-result replay denial, new-version selection,
cross-account submit/abandon denial, inactive users and idempotent starter import.

The real database test caught a timestamp parameter encoding problem that was corrected
using Drizzle's typed timestamp comparison before rerunning successfully. Browser setup
used the installed Chromium executable; clicking the visible styled answer labels
verified their normal interaction rather than targeting the hidden radio directly.

Tests ran against temporary PostgreSQL instances under ignored `tmp/`, with separate
connections from the application database. Each server was stopped after testing.
The application database, .env.local, real accounts and GitHub remote were not changed.
No test account password, browser session cookie or local database file is in the ZIP.

Limits: this is not a complete platform/security/accessibility certification.
Screen-reader, exhaustive keyboard/cross-browser, Lighthouse/Core Web Vitals, production
migration timing/backup restoration and large-question-bank performance remain to be
measured. Migration 0006 and role assignments must be applied to your own environment
before using the new code there. Optional PostgreSQL acceptance scripts are included.
