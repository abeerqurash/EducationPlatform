# Executed validation - Batch 172

Checks executed on this Windows workspace on 10 October 2026.

| Check | Result |
| --- | --- |
| Initial local/remote baseline | Clean local tree; matching HEAD 816e2252ed74bd76509ebec29029c3daef9a4990 |
| Baseline database tests | 194 files, 834 tests passed |
| Calculator tests | 12 files, 99 tests passed; calculator code unchanged by 172 |
| Batch 172 database tests | 195 files, 845 tests passed |
| New report tests after strict test-type correction | 1 file, 11 tests passed |
| Root npm run typecheck | Passed |
| npm run lint | Passed |
| npm run build | Passed; compiled, TypeScript checked, generated 40 static pages |
| git diff --check | Passed after removing an extra final blank line |
| Verification PowerShell script | Parser returned no syntax errors |
| Production HTTP smoke test | Signed-out readiness rendered a Next.js streaming login redirect; login rendered HTTP 200 |
| Extra database standalone typecheck | FAILED: 254 diagnostics remain in unchanged source/test files; no diagnostics in new report files |
| Authenticated browser, mobile, screen reader, Lighthouse | Not run; acceptance checklist provided |
| Live database migrations and integration | Not run; no new migration or database mutation |

The stricter database check is `npm run typecheck --workspace=@education/database`.
It enables checks that root web TypeScript does not apply to all database tests/seeds.
Observed existing failures include unchecked indexed access in calendar/insights,
practice retry and seed modules. Raw local diagnostics are in ignored
`tmp/database-typecheck-final.txt`. This batch does not claim that every workspace
passes standalone type checking.

Normal sandbox execution failed before launching processes. Approved escalated shell
execution was used for the reads and checks. No environment values or account secrets
were printed or bundled. Build output reports loading .env.local but not its values.

Archive integrity and hashes are independently checked during packaging and recorded
in the sibling archive verification JSON. Archive integrity is not a browser test.
