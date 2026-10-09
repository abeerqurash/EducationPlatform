# Batch 160 — Original SAT/ACT practice questions

Cumulative release from Batch 159. Adds an authenticated practice route at `/dashboard/test-prep/practice`, accessible from the Test Prep dashboard. Original, illustrative questions in Math, Reading, English, and ACT Science; topic/exam filters; accessible answer controls; deterministic grading; explanations; TXT and clipboard reports; restart. Questions are not official and the percentage is not an official scaled score. Results stay in the browser session and are not persisted.

The question bank is intentionally a small foundation (24 items), not a complete exam preparation product. Future modules should add editorially reviewed question banks, versioning, passage/data stimulus support, adaptive assignments, persistence, and test-taking accessibility audits. No dependencies or migrations.

Validate on local monorepo: database tests, calculator tests, typecheck, lint, build. The source archive excludes the monorepo root configuration, so local validation is required.
