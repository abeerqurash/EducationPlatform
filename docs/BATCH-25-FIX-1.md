# Batch 25 — Fix 1

The Batch 25 implementation was correct, but two contract tests used brittle exact whitespace matching.

The failing log confirms that:
- the final update predicates on `tools.status` and `plan.fromStatus`;
- `requireFormula` is `true`;
- `requireVerifiedSource` is `true`.

This fix changes only those source-contract assertions to whitespace-tolerant regular expressions. Production publication logic is unchanged.
