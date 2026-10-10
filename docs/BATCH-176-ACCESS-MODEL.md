# Workspace authorization and privacy model

Every service starts by locking the active account and comparing the persisted authentication version with the session. UUIDs are validated before queries. Mutation requests require authenticated same-origin bounded JSON; the existing account HTTP abuse limit applies. Forms render plain text rather than HTML from user content.

## Classrooms

A scoped educator creates an organization and an owner membership for each classroom. Management requires all of: the educator permission, classroom ownership, active owner membership, and active/non-archived organization. Learner access requires a persisted classroom membership and an active classroom/organization. Cross-tenant identifiers and forged flags do not bypass these checks.

This release supports one owner per classroom. Multi-teacher delegation, organization provisioning/SSO, institution contracts, paid seat management, and school-wide reporting remain future work. Capacity is 25 classrooms per owner, 100 learners per classroom, and 100 assignments per classroom. Each assignment contains 1–20 reviewed questions; the selection UI shows the most recent 200 published revisions. Archived classrooms remain in the owner's listing but cannot be reopened through this UI.

Invitations contain a cryptographically random 256-bit code whose SHA-256 hash is stored. Codes are visible only in the creation response, not list responses. The verified recipient email must match. Acceptance locks and rechecks the invitation. Creation is capped at 20 per creator per hour. Archive revokes unused invitations; explicit revocation blocks acceptance. The creator must still be active, and classroom permission is rechecked at acceptance.

Assignments pin revision IDs. Published content versions are immutable under the existing database question-version trigger, so later editorial retirement does not change the assignment. Only student-safe questions are returned before submission. The explicit start action creates work; a read does not start a timer. The server owns start, deadline, and submission timestamps. Expired unsubmitted sessions can explicitly restart with drafts cleared. Closing an assignment or removing the learner blocks new work. Concurrent submission retries produce one saved attempt and one score. Deleting the practice review does not recreate an attempt or erase the classroom score.

The educator receives only roster identities and assigned-work status/percent correct. No general student history, answers, passwords, or parent summaries are exposed. Removed learners disappear from roster reports; re-inviting the same account restores access to its previous classroom work. Exported gradebook cells escape CSV quotes and spreadsheet formula prefixes.

## Parent sharing

The student initiates every connection; both accounts verify email. This is an explicit account-sharing feature, not verification of a legal guardian or an age/parental-consent system. Connections are limited to five recipients per student. Summary reads lock the sharing grant during the transaction; a later read after disconnection returns no shared data. Recipient dashboards show up to 100 connected student summaries.

The summary includes the student's display name, saved practice count, average practice percent correct, and logged study minutes during the last 30 days. It excludes student email, question prompts/answers, profile goals, and unrelated records. Deleting saved practice naturally changes the aggregate. No practice produces a zero count without inventing performance. Either side can disconnect. Pending invitations are separately revocable; stopping an existing connection does not cancel other invitation codes.

## Support

Owners can access only their own tickets. Staff must hold `support.manage` for staff reads and writes. Educator and general administrator labels do not automatically grant this permission. Latest 100 tickets are listed; conversations are capped at 200 messages, with 10–4000 characters per message. Owners may create five tickets per day; authors may post 30 messages per hour. Closed conversations require reopening before a reply. No attachments, email forwarding, public comments, or notification delivery are implemented.

Successful sensitive mutations append existing audit-log records in the same transaction. Workspace audit metadata contains operation names and opaque identifiers; it excludes invitation codes, emails, answers, and support message text. This is not a log of denied requests or a complete enterprise audit product.

## Browser choices

Optional choices fail closed when missing, malformed, future-dated, or older than 180 days. Required authentication storage is unaffected. The consent accessor is available for future integrations; no analytics/ad network is installed by this batch. This local preference control is not a certified CMP, global consent record, or proof of legal compliance. Any future tracking integration requires its own documented consent wiring and acceptance tests.
