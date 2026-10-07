# Batch 16 — Editorial Publication Gate

This batch adds the strict, testable editorial gate that will sit between calculator implementation and database publication.

It intentionally does not auto-approve ACT, SAT, sources, formulas or reviews.

A calculator can pass the gate only when:
- the tool has entered `review`;
- the active calculator version is `verified`;
- its formula is verified when that calculator requires a formula;
- at least one linked source is verified when source verification is required;
- the latest editorial review is `approved`;
- that approved review has a real `reviewedAt` timestamp.

Dataset-driven calculators can explicitly set `requireFormula: false`.

Why this batch exists:
The ACT database seed is intentionally draft/pending. We should not turn official-source links into `verified` or manufacture an approved human review from a seed. Batch 16 creates the reusable safety gate first. The later Admin/Reviewer workflow will call this gate before committing a publication transition.
