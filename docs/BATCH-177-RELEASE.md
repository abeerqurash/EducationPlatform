# Batch 177 — support operations and classroom restoration

Baseline: `9fb7419eca8ad021336d412de55d214b57058d79`, clean checkout matching GitHub HEAD. This is a focused release sized around the user's remaining allowance. Changes are applied locally, with full and changes-only ZIPs. No Git commit/push, application database mutation, real email, or payment operation was performed. Payments remain disabled.

## Delivered

- Subject search treats `%`, `_`, and backslashes literally. Owner search and counts remain private; the staff inbox requires the persisted support permission.
- Filters for status, category, priority, and sorting. Staff also have **mine** and **unassigned** queues.
- Twenty-five tickets per page, bounded page input, previous/next links preserving filters, real totals, and deterministic UUID tie-breaking. Listing count and results use a repeatable-read transaction. Updates between separate page requests can change which page a ticket appears on.
- Priority values low/normal/high, with a database constraint and indexes. Existing tickets default to normal priority.
- Staff can claim a ticket, keep its assignment, or release their own assignment. Concurrent claims have one winner. Another active authorized operator's claim cannot be stolen or released. A ticket assigned to an inactive account or someone who lost support permission can be reclaimed. Priority updates remain available to authorized support staff; assignment is a workflow aid, not a separate ticket visibility rule.
- Successful triage appends redacted audit metadata in the same transaction.
- Owners can restore archived classrooms from Workspaces. Their educator permission, active organization, owner membership, and classroom ownership are rechecked. Existing roster access returns; revoked invitations stay revoked, and assignment deadlines/closed states remain unchanged.
- Workspace doctor now checks both the workspace tables and the new support columns.

## Install

Back up your database and preserve `.env.local`. Stop the existing dev server before replacing source. Extract the full bundle over the project, or use Changes-Only against the baseline above. No new dependencies were added.

```powershell
Set-Location C:\xampp\htdocs\EducationPlatform
npm run db:migrate
if ($LASTEXITCODE -ne 0) { throw 'Migration failed; do not start the app.' }
npm run workspaces:doctor --workspace=@education/database
if ($LASTEXITCODE -ne 0) { throw 'Required workspace schema is missing.' }
powershell -ExecutionPolicy Bypass -File .\scripts\verify-batch-177.ps1
```

Migration `0009_support_triage.sql` is additive. Earlier migrations remain untouched. Do not use `db:push` to replace migration history. Existing Batch 176 roles continue to apply; no new grants or role seeds are required for an already installed Batch 176. If starting from older source, follow the earlier role setup instructions too.

Staff use `/dashboard/workspaces/staff-support`; customers use `/dashboard/workspaces/support`. Open a conversation as staff to update triage. Archived classroom restore controls appear only in the educator's owned listing.

## Limits and remaining work

Ticket search currently covers subjects, not message text. The conversation limit and abuse controls from Batch 176 remain in force. No attachments, escalation emails, automated SLA enforcement, new provider integration, or paid plan activation are introduced. Institution-wide/multiple-owner classroom administration remains future work. The existing standalone database strict-type debt is not resolved by this release.
