# Batch 175 — account lifecycle, security controls and email delivery

Baseline: `bb7173f2c827cf2390af273cb0085b7cedbdd7b0`, clean local checkout matching GitHub HEAD when this batch began. Source is applied to the connected folder. No Git commit/push or application-database migration was performed.

## Delivered features

- Registration queues a verification email when delivery is configured and never returns a raw verification token. Duplicate registration receives the same generic result without changing the account.
- Email verification with explicit confirmation, resend requests, 24-hour expiry and single-use consumption.
- Password recovery with generic request responses, 30-minute links, validated password confirmation and atomic single-use consumption.
- Password change requiring the current password; invalidates outstanding resets and all existing sessions.
- Sign out every session, requiring the current password. Revocation applies on the next authenticated request, including the initiating browser.
- Persisted session versions are checked with the active account. Inactive accounts and older sessions are rejected. Existing pre-batch sessions do not contain a version and must sign in again.
- Private `/dashboard/settings/security` status/history and JSON download for the current account only. This export contains account status and the latest 50 successful security events, not a complete personal-data export.
- Database-backed request limits, same-origin JSON checks and an 8 KiB streamed-body limit. No email link is consumed by a GET request.
- Encrypted durable email queue, explicit local capture adapter, configurable Resend adapter, retries, row-lock worker coordination, stable provider idempotency keys and payload removal after terminal processing.
- Redacted configuration diagnostics and expired-counter/token cleanup commands.

## Installation order — required

Back up the application database. Stop your existing development server with Ctrl+C in the terminal that owns it before installing/migrating; do not start a second dev server. The new user column is read by authentication and other user queries, so apply the migration before serving the updated app.

```powershell
Set-Location C:\xampp\htdocs\EducationPlatform
npm run db:migrate
if ($LASTEXITCODE -ne 0) { throw 'Migration failed; do not start the app.' }
powershell -ExecutionPolicy Bypass -File .\scripts\verify-batch-175.ps1
npm run security:doctor --workspace=@education/database
```

Migration `0007_account_security.sql` adds `users.auth_version`, security events, abuse counters and an email outbox. It does not mark old accounts verified or change their passwords. It is additive; previous migrations are unchanged. Use migrations rather than regenerating the whole database.

No new npm dependencies or role seeds are required.

## Local verification/recovery setup

In your existing `.env.local`, preserve your values and configure:

```dotenv
EMAIL_TRANSPORT=file
AUTH_EMAIL_ORIGIN=http://localhost:3000
```

Use your actual app port. `AUTH_SECRET` must be a stable high-entropy value of at least 32 characters. Do not replace an existing strong secret unnecessarily. `EMAIL_OUTBOX_SECRET` is an optional separate high-entropy secret of at least 32 characters; otherwise the queue uses `AUTH_SECRET`. These values are never included in the ZIP.

```powershell
npm run dev
```

In another terminal, after requesting verification or recovery:

```powershell
Set-Location C:\xampp\htdocs\EducationPlatform
npm run email:work --workspace=@education/database
```

The worker writes local messages to ignored `tmp/account-email-capture/*.json`. Open the link in the message text and confirm the action in the app. Capture is allowed only for loopback origins; it is for local testing and does not send email. Files contain sensitive links: do not upload/share them; remove them when no longer needed. Windows file permissions depend on your user directory permissions.

Email is disabled by default. Registration and sign-in remain available with a configured strong secret, but recovery/resend requests report that delivery is unavailable when disabled. Verification records email ownership; this batch does not require every existing user to verify before using their current dashboard.

## Live email configuration

Use an operator-owned verified sender and provider key. Before building/starting on HTTPS:

```dotenv
EMAIL_TRANSPORT=resend
AUTH_EMAIL_ORIGIN=https://your-actual-domain.example
EMAIL_FROM=your-verified-sender@your-domain.example
RESEND_API_KEY=your-provider-key
```

Keep secrets outside Git. `NEXT_PUBLIC_SITE_URL` should also match the deployed HTTPS origin. The adapter follows the [Resend send-email API](https://resend.com/docs/api-reference/emails/send-email) with a stable idempotency key. Real provider delivery has not been exercised in this batch; complete a delivery/received-link smoke check using your verified sender before enabling public account recovery.

Run `email:work` through your deployment's scheduler/process manager at least once per minute; it is a finite worker, not an automatically installed service. Default batch size is 20; optional `EMAIL_WORKER_LIMIT` is 1–100. There are up to five attempts with backoff for network, 429 and 5xx failures. Permanent failures require fixing configuration and requesting a fresh link. A provider request accepted before a database rollback can be retried with the same idempotency key. This does not establish an absolute exactly-once delivery guarantee.

Queue encryption keys must remain stable while messages are pending. Changing a key invalidates pending payloads; drain the queue first or cancel/reissue links. Link tokens are carried in URL fragments, cleared from the address bar after capture, and consumed only after the user submits a form. Do not transform fragment links into query-string links.

## Abuse controls and maintenance

Email requests: three per email/operation/hour; registration: five per email/hour; sign-in: ten per email/15 minutes; password change/session revocation: five per account/15 minutes. Account HTTP endpoints also have 120 requests/hour per trusted client IP or a shared fallback bucket.

Set `ACCOUNT_TRUST_PROXY=1` only when your trusted deployment proxy removes caller-supplied forwarding headers and supplies a correct client IP. Without that setup, the application uses a shared request bucket; this is conservative but can limit legitimate concurrent users. These controls do not replace perimeter throttling or protection against distributed abuse.

```powershell
npm run security:cleanup --workspace=@education/database
```

Cleanup removes expired rate counters and tokens expired more than seven days ago, and scrubs/cancels expired pending emails. Security events and terminal delivery metadata are retained; choose an operator retention policy before public launch. Cleanup does not automatically delete local capture files.

## Rollback and remaining work

Restore the baseline code and rebuild if required; keep new database structures until any desired history/queue recovery is complete. Downgrading to old authentication removes version-based session revocation, so treat a rollback as a security-sensitive operational change.

Billing/entitlements, reviewed learning expansion, educator/parent/school workflows, complete data export/deletion, production deployment/retention arrangements and existing strict database-package type debt remain. This batch completes the implemented account lifecycle, not the whole master specification.
