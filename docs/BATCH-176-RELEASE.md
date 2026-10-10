# Batch 176 — classrooms, assignments, parent sharing, support, and privacy choices

Baseline: `8e4d4b92a6a37bafd92d2f21b561280eb1a86988`, matching local and remote GitHub HEAD. Changes are already in the connected folder. No commit, push, application migration, user grant, real email, or payment operation was performed. Payments remain disabled as requested.

## Install and verify

Back up your database and preserve `.env.local`. Stop your existing dev server before replacing files. Extract the full ZIP over the project without deleting your environment, uploads, or local dependencies; alternatively use the Changes-Only ZIP against the baseline above. The full ZIP contains cumulative project source, not dependencies or build output. No new dependencies were added.

```powershell
Set-Location C:\xampp\htdocs\EducationPlatform
npm run db:migrate
if ($LASTEXITCODE -ne 0) { throw 'Migration failed; do not start the app.' }
npm run seed:workspaces --workspace=@education/database
if ($LASTEXITCODE -ne 0) { throw 'Role seed failed.' }
npm run workspaces:doctor --workspace=@education/database
if ($LASTEXITCODE -ne 0) { throw 'Workspace tables are missing.' }
powershell -ExecutionPolicy Bypass -File .\scripts\verify-batch-176.ps1
```

Migration `0008_learning_workspaces.sql` adds eight tables. It does not alter old migrations, existing passwords, or old question versions. Use `db:migrate`; do not use `db:push` to replace migration history. If your existing dependencies are absent, restore them with `npm ci` first. Start only one dev server after checks pass.

The role seed adds `educator_workspace` → `classrooms.manage` and `support_workspace` → `support.manage`; it never grants anyone a role. An authorized administrator assigns these roles through `/admin/users`. A general teacher/support enum value or a client-side staff flag alone grants no access.

## Start using the release

1. Verify educator and learner emails using Batch 175's account-security workflow. For local development, follow its documented `EMAIL_TRANSPORT=file` capture setup and worker. Payment preferences do not change email configuration. No email is sent for workspace invitations.
2. Visit `/dashboard/workspaces` as an educator with the scoped role, create a classroom, and create an email-bound invitation. Copy the code shown once and share it privately yourself.
3. The intended learner enters the code under **Accept invitation** while signed in with the matching verified email. Codes expire after seven days and are single-use.
4. An author can import **66 expansion drafts** at `/admin/question-bank`. Imported questions remain drafts. Submit and independently review each revision before publishing. An author cannot approve their own question.
5. In the educator classroom, select 1–20 published questions, an exam, and a due date. Learners explicitly start a four-hour session, save drafts, and submit. Scores are practice percent correct, not official scaled scores. The educator can download the assigned gradebook.
6. Under **Parent sharing**, the student invites a verified recipient to a read-only 30-day summary. The student can stop sharing, and the recipient can disconnect. No answers, unrelated private records, or editing rights are shared.
7. Customers open private support tickets under Workspaces. Scoped staff use the staff inbox; replies appear in the application. Ticket owners can close/reopen and download conversations. Email notifications and attachments are disabled.
8. Public browser privacy preferences offer explicit optional choices, defaulting off. There are no optional tracking services loaded by this release. Preferences persist for 180 days in that browser and are available through the footer/settings.

## Maintenance

```powershell
npm run workspaces:cleanup --workspace=@education/database
```

This explicit command deletes expired, used, or revoked invitation records older than 30 days. It does not delete class rosters, assignments, support messages, or parent connections. Scheduling remains an operator task.

See `BATCH-176-VALIDATION.md`, `BATCH-176-ACCESS-MODEL.md`, and `BATCH-176-COMPLETION-ROADMAP.md` for evidence and limits. The manifest lists every changed file and its SHA-256. This release advances several working modules; it does not claim the entire master specification is complete.
