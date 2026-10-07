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
  "database publication actor contract",
  () => {
    it(
      "deduplicated persisted permission keys remain sufficient for authorization",
      () => {
        const persistedKeys =
          Array.from(
            new Set([
              publicationPermissions
                .publish,

              publicationPermissions
                .publish,
            ]),
          );

        expect(
          authorizePublicationAction(
            {
              userId:
                "00000000-0000-4000-8000-000000000001",

              permissionKeys:
                persistedKeys,
            },
            "publish",
          ).allowed,
        ).toBe(true);
      },
    );

    it(
      "an authenticated user with no persisted publication permission is denied",
      () => {
        expect(
          authorizePublicationAction(
            {
              userId:
                "00000000-0000-4000-8000-000000000001",

              permissionKeys: [],
            },
            "publish",
          ).allowed,
        ).toBe(false);
      },
    );
  },
);
