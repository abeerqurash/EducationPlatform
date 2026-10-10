# Original expansion pack

The optional editorial import contains 66 draft questions:

| Skill | Count | Exam applicability |
|---|---:|---|
| Linear equations | 8 | Both |
| Percent discounts | 8 | Both |
| Unit rates | 8 | Both |
| Rectangle area | 8 | Both |
| Arithmetic mean | 8 | Both |
| Counting outcomes | 8 | Both |
| English editing | 6 | Both |
| Reading evidence | 6 | Both |
| Science data interpretation | 6 | ACT |

The 48 math questions are intentionally parameterized skill variants with independently checked numeric keys. The 18 verbal/data questions are individually written illustrative exercises. Answer positions rotate across four choices. English editing is labelled English within the existing topic model; it is not a claim that this platform implements official SAT section taxonomy or adaptive test structure.

The pack contains no copied commercial/official question bank or official exam affiliation. The checked-in source includes explanations and provenance for editors. This source pack is not served to learner browsers by the import component. Learners receive questions only after the ordinary independent publication workflow and without answer keys before grading.

Import is idempotent by `expansion-*` slug. It never overwrites a revision, changes a published item, auto-submits, or auto-publishes. Use a new revision to improve an imported question. Automated checks cover shape, unique slugs/prompts, topic/exam bounds, position variation, and independently enumerated numeric keys; an editor still needs to check wording and suitability before publication. This is a practice expansion, not a complete or psychometrically validated exam bank.
