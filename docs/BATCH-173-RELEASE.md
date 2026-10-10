# Batch 173 - editorial question bank, reviewed practice and recovery bundle

Baseline: `48b98f83c57856df45adac98b2c896ebac131392`, the latest matching local/GitHub
commit checked on 10 October 2026. This combines the previously proposed question-bank
foundation, admin editorial workflow, student integration and answer-draft recovery
into one release. It does not claim that the full long-term platform is finished.

## Delivered workflows

- Question entries and immutable revisions with exam, topic, difficulty, choices,
  answer, explanation and provenance. Changes create a new revision rather than
  rewriting previously used content.
- Scoped Question Author/Question Reviewer roles, database-resolved permissions,
  independent review, draft/submit/publish/reject/retire transitions and audit records.
- Admin list/search/state filters/pagination, author form, preview, review feedback,
  publishing controls and idempotent import of the existing 24 original starter items.
- Student library loads up to ten currently published revisions by exam/topic,
  withholding answer keys until completion. Empty selections explain that reviewed
  content must be published first.
- Server-owned start/expiry and grading, one open session per account, saved answer
  drafts, resume, abandon, private attempt storage and duplicate-safe submissions.
- Question snapshots preserve historical explanations and answers across later changes.
  Completed-result deletion cannot be undone by replaying the old submission.
- Existing static quiz/lab/calculator workflows remain available. No new dependency.

## Installation in your current folder

The code is already applied in this workspace. The supplied ZIP is cumulative and can
be used as a backup/delivery copy. It excludes local .env files/secrets, dependencies,
builds, uploads, .git and temporary test databases. Do not re-extract over newer or
unrelated changes. Review `git status --short` and preserve a backup first.

**Migration 0006 is required before running this updated application against your
database**, including existing saved-attempt detail pages which now select snapshots.
Back up the application database, stop the dev/server process and rehearse migration
on staging before production. The application database has NOT been migrated by Codex.

```powershell
Set-Location C:\xampp\htdocs\EducationPlatform
git status --short
git rev-parse HEAD
# Only if installing the ZIP into a different matching checkout:
# Expand-Archive -LiteralPath 'C:\path\EducationPlatform-Batch-173.zip' -DestinationPath . -Force
npm run db:migrate
if ($LASTEXITCODE -ne 0) { throw 'Migration failed; do not start the updated application' }
npm run seed:questions --workspace=@education/database
if ($LASTEXITCODE -ne 0) { throw 'Question role seed failed' }
powershell -ExecutionPolicy Bypass -File .\scripts\verify-batch-173.ps1
npm run dev
```

The role seed creates only scoped roles/permissions; it grants no users access and
does not elevate existing platform admins automatically. In `/admin/users`, an
authorized platform administrator must assign **Question Author** to the author
account and **Question Reviewer** to a different reviewer account. The same person
may hold both roles, but still cannot publish their own revision.

Author path: `/admin/question-bank` -> create question/import starter drafts ->
open revision -> submit. Reviewer path: open submitted revision, validate source and
answer/explanation, add an editorial note -> approve/publish or reject. Students then
use `/dashboard/test-prep/practice/library`. Import does not auto-publish anything.

## Migration and rollback considerations

- `0006_question_bank.sql` is additive, journaled and includes database constraints
  and a trigger protecting immutable revision content and valid state transitions.
- Editorial author/reviewer foreign keys use RESTRICT to preserve attribution.
  Accounts referenced by editorial history cannot be physically deleted until an
  approved anonymization/reassignment policy exists; deactivate them instead.
- Retired questions are removed from future sessions; sessions already issued still
  grade against their pinned version. Saved attempts carry independent snapshots.
- Avoid `db:push` for this release: it does not install the custom immutability trigger.
  Retain the hand-authored migration and review future generated diffs carefully.
- To roll back application code, restore your pre-batch source backup. Keep the new
  additive tables/column until data retention/export is resolved; older source ignores
  them. Do not drop historical question or attempt data as a routine rollback step.
- Draft sessions expire after four hours. Automatic cleanup/retention scheduling is
  not included; expired drafts cannot be resumed or submitted.

## Optional repeatable PostgreSQL acceptance

Use a **separate disposable test database**, never your application database. The
scripts reject a connection matching the application database. The migration-only
runner creates a temporary schema and rolls it back. The full workflow runner requires
an EMPTY database, applies all journaled migrations and leaves dummy fixtures there.

```powershell
$env:QUESTION_BANK_TEST_DATABASE_URL = 'postgresql://test-user:test-password@127.0.0.1:5432/education_disposable_test'
npm run test:questions:postgres --workspace=@education/database
npm run test:questions:workflow --workspace=@education/database
Remove-Item Env:QUESTION_BANK_TEST_DATABASE_URL
```

The test database URL must refer to a separate database, not a different schema on the
same application database. The scripts do not automatically create a test database.
No paid service, new package installation or changes to .env.local are required.

## Acceptance checklist

1. Verify migration/role seed and account role assignments on your own environment.
2. Create/import, submit with author, publish with a different reviewer; test self-review denial.
3. Start student practice, save answers, reload/return and verify the draft restores.
4. Submit once and retry; verify one saved attempt and its explanations in history.
5. Publish a changed revision; verify old attempts keep their original content/key.
6. Verify student denial of admin access and private attempts scoped to the owner.
7. Test keyboard navigation and phone/tablet/desktop; inspect error and empty states.
8. Re-run the automated script and complete production monitoring/backup checks.
