import {
  describe,
  expect,
  it,
} from "vitest";

import {
  authorizePublicationAction,
  publicationPermissions,
} from "./authorization";

describe(
  "publication authorization",
  () => {
    it(
      "allows a reviewer to submit when the submit permission exists",
      () => {
        const result =
          authorizePublicationAction(
            {
              userId:
                "00000000-0000-4000-8000-000000000001",

              permissionKeys: [
                publicationPermissions
                  .submitForReview,
              ],
            },
            "submit_for_review",
          );

        expect(
          result.allowed,
        ).toBe(true);
      },
    );

    it(
      "does not let review permission publish",
      () => {
        const result =
          authorizePublicationAction(
            {
              userId:
                "00000000-0000-4000-8000-000000000001",

              permissionKeys: [
                publicationPermissions
                  .submitForReview,
              ],
            },
            "publish",
          );

        expect(
          result.allowed,
        ).toBe(false);

        expect(
          result.requiredPermission,
        ).toBe(
          publicationPermissions
            .publish,
        );
      },
    );

    it(
      "allows publishing only with the publish permission",
      () => {
        const result =
          authorizePublicationAction(
            {
              userId:
                "00000000-0000-4000-8000-000000000001",

              permissionKeys: [
                publicationPermissions
                  .publish,
              ],
            },
            "publish",
          );

        expect(
          result.allowed,
        ).toBe(true);
      },
    );
  },
);
