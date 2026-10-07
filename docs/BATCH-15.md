# Batch 15 — ACT Public Calculator Integration

Adds:
- Public ACT calculator component.
- Exact public route: `/tools/test-prep/act-score-calculator`.
- Complete calculator registry replacement with `enhancedAct`.
- Metadata, canonical, Open Graph metadata, methodology, details and FAQs.

Important architecture choice:
The ACT database record from Batch 14 remains `draft`. This public route therefore uses the already-approved public ToolPageShell and the calculator package directly instead of falsely presenting the draft database record as reviewed/verified. The next publication workflow batch can move the database record through review/verification before the generic database runtime becomes authoritative.

The calculator accepts scaled 1–36 section scores only. It does not invent a universal raw-answer conversion.
