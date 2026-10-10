# Executed validation

- Final release script passed: database 206 test files / 976 tests; calculator regression 12 files / 99 tests; root TypeScript, lint and production build. The build generated 82 static pages with no warnings.
- Eight focused account suites cover token format, expiry/replay, session versions, authenticated encryption, configuration, templates, mocked provider delivery, opaque rate keys and bounded same-origin requests. No mock provider test sends live mail.
- Isolated PostgreSQL: 34 executed checks after applying every journaled migration to a fresh disposable database. Registration, concurrent verification/reset, stored token hashes, encrypted payloads, replacement links, password changes, session invalidation, active-account checks, persisted rate limits, worker retry/scrubbing, cleanup and SQL constraints passed.
- Authenticated Chromium production-server journey: registration, local capture, verification confirmation, fragment removal, replay denial, private status/export, recovery, revocation of a second browser session, password change, sign-out of all sessions, unauthenticated mutation denial and cross-origin rejection passed.
- Mobile 375 × 812 checks cover registration/recovery/verification/reset and the account security page. Screenshots are inspected after waiting for the streamed page to load. No comprehensive assistive-technology/cross-browser audit is claimed.
- Redacted `security:doctor` passed on the disposable database with live email disabled.
- Standalone database strict typecheck still reports 258 diagnostics in existing non-account code; the new account-security modules/tests have no diagnostics. Root/web typecheck passing is not a claim that package-wide strict debt is resolved.

Tests used a separate local database and explicit local file capture; application records, environment files and GitHub were unchanged. Temporary servers are stopped after validation. A real Resend sender, inbox receipt, external scheduling and public deployment remain operator acceptance tasks.

ZIP integrity is checked by CRC and entry-by-entry SHA-256 comparison with the tested source. Captures, environment secrets, dependencies, build output, uploads and test databases are excluded.
