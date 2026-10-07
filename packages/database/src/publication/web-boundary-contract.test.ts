import {
  describe,
  expect,
  it,
} from "vitest";

import {
  readFileSync,
} from "node:fs";

import {
  fileURLToPath,
} from "node:url";

const actionsSource =
  readFileSync(
    fileURLToPath(
      new URL(
        "../../../../apps/web/src/app/admin/publication/actions.ts",
        import.meta.url,
      ),
    ),
    "utf8",
  );

const clientSource =
  readFileSync(
    fileURLToPath(
      new URL(
        "../../../../apps/web/src/app/admin/publication/publication-actions.tsx",
        import.meta.url,
      ),
    ),
    "utf8",
  );

describe(
  "publication web boundary contract",
  () => {
    it(
      "strictly allow-lists request fields",
      () => {
        expect(actionsSource).toContain(
          '"toolId"',
        );
        expect(actionsSource).toContain(
          '"action"',
        );
        expect(actionsSource).toContain(
          '"reason"',
        );
        expect(actionsSource).toContain(
          "Object.keys(input)",
        );
        expect(actionsSource).toContain(
          "!allowedKeys.has(key)",
        );
        expect(actionsSource).toContain(
          "unknownKeys.length > 0",
        );
      },
    );

    it(
      "does not accept browser supplied identity or policy fields",
      () => {
        expect(clientSource).not.toMatch(
          /\buserId\s*:/,
        );
        expect(clientSource).not.toMatch(
          /\bpermissionKeys\s*:/,
        );
        expect(clientSource).not.toMatch(
          /\bresolverOptions\s*:/,
        );
        expect(clientSource).not.toMatch(
          /\brequireFormula\s*:/,
        );
        expect(clientSource).not.toMatch(
          /\brequireVerifiedSource\s*:/,
        );
        expect(actionsSource).not.toContain(
          "publication/atomic-persistence",
        );
        expect(actionsSource).toContain(
          "@/lib/publication/session-boundary",
        );
        expect(clientSource).toContain(
          "confirmPublish",
        );
        expect(clientSource).toContain(
          "confirmSubmit",
        );
        expect(clientSource).toContain(
          "Confirm submission",
        );
        expect(clientSource).toContain(
          "Confirm publish",
        );
        expect(clientSource).toContain(
          "Action reason",
        );
        expect(clientSource).toContain(
          "maxLength={1000}",
        );
        expect(clientSource).toContain(
          "reason.trim()",
        );
        expect(clientSource).toContain(
          'setReason("")',
        );
        expect(clientSource).toContain(
          "publication-reason-${toolId}",
        );
        expect(clientSource).toContain(
          'aria-live="polite"',
        );
        expect(clientSource).toContain(
          "reasonCharactersRemaining",
        );
        expect(clientSource).toContain(
          "normalizedReason",
        );
        expect(clientSource).toContain(
          "confirmationOpen",
        );
        expect(clientSource).toContain(
          "actionControlsLocked",
        );
        expect(clientSource).toContain(
          "if (pending)",
        );
        expect(clientSource).toContain(
          "pendingAction",
        );
        expect(clientSource).toContain(
          "setPendingAction(action)",
        );
        expect(clientSource).toContain(
          "setPendingAction(null)",
        );
        expect(clientSource).toContain(
          "} catch {",
        );
        expect(clientSource).toContain(
          "The publication request could not be completed. Please try again.",
        );
        expect(clientSource).toContain(
          "aria-disabled={pending}",
        );
        expect(clientSource).toContain(
          "Cancel the confirmation to edit the reason.",
        );
        expect(clientSource).toContain(
          "characters remaining",
        );
        expect(clientSource).toContain(
          "aria-busy={pending}",
        );
        expect(clientSource).toContain(
          '"state_conflict"',
        );
        expect(clientSource).toContain(
          '"not_found"',
        );
        expect(clientSource).toContain(
          "Refresh the page and review the latest state before trying again.",
        );
        expect(clientSource).toContain(
          "Refresh the publication queue before continuing.",
        );
        expect(clientSource).toContain(
          'result.code ===',
        );
        expect(clientSource).toContain(
          '"state_conflict" ||',
        );
        expect(clientSource).toContain(
          '"not_found"',
        );
        expect(clientSource).toContain(
          '"transition_blocked"',
        );
        expect(clientSource).toContain(
          "router.refresh()",
        );
        expect(clientSource).toContain(
          "setConfirmSubmit(false)",
        );
        expect(clientSource).toContain(
          "setConfirmPublish(false)",
        );
        expect(clientSource).toContain(
          "setBlockers([])",
        );
        expect(
          clientSource.match(
            /setConfirmSubmit\(/g,
          )?.length ?? 0,
        ).toBeGreaterThanOrEqual(4);
        expect(
          clientSource.match(
            /setConfirmPublish\(/g,
          )?.length ?? 0,
        ).toBeGreaterThanOrEqual(4);
        expect(clientSource).toContain(
          "issueMessages",
        );
        expect(clientSource).toContain(
          '"transition_blocked"',
        );
        expect(clientSource).toContain(
          "Array.isArray",
        );
        expect(clientSource).toContain(
          'execute("publish")',
        );
      },
    );

    it(
      "revalidates publication views after a successful mutation",
      () => {
        expect(actionsSource).toContain(
          'from "next/cache"',
        );
        expect(actionsSource).toContain(
          'revalidatePath(\n      "/admin/publication",',
        );
        expect(actionsSource).toContain(
          "revalidatePath(\n      `/admin/publication/${result.toolId}`,",
        );

        const revalidationIndex =
          actionsSource.indexOf(
            'revalidatePath(\n      "/admin/publication",',
          );
        const blockedIndex =
          actionsSource.indexOf(
            '"transition_blocked"',
          );

        expect(
          revalidationIndex,
        ).toBeGreaterThan(
          blockedIndex,
        );
      },
    );
  },
);
