import {
  describe,
  expect,
  it,
} from "vitest";

import {
  publicationPermissions,
} from "../publication/authorization";

import {
  publicationPermissionDefinitions,
  publicationRolePolicy,
} from "./publication-rbac";

describe(
  "publication RBAC policy",
  () => {
    it(
      "defines both publication permissions exactly once",
      () => {
        const keys =
          publicationPermissionDefinitions.map(
            (item) =>
              item.key,
          );

        expect(
          new Set(keys).size,
        ).toBe(
          keys.length,
        );

        expect(
          keys,
        ).toContain(
          publicationPermissions
            .submitForReview,
        );

        expect(
          keys,
        ).toContain(
          publicationPermissions
            .publish,
        );
      },
    );

    it(
      "allows editor to submit but not publish",
      () => {
        expect(
          publicationRolePolicy
            .editor,
        ).toContain(
          publicationPermissions
            .submitForReview,
        );

        expect(
          publicationRolePolicy
            .editor,
        ).not.toContain(
          publicationPermissions
            .publish,
        );
      },
    );

    it(
      "allows admin to submit and publish",
      () => {
        expect(
          publicationRolePolicy
            .admin,
        ).toEqual(
          expect.arrayContaining(
            [
              publicationPermissions
                .submitForReview,

              publicationPermissions
                .publish,
            ],
          ),
        );
      },
    );

    it(
      "allows owner to submit and publish",
      () => {
        expect(
          publicationRolePolicy
            .owner,
        ).toEqual(
          expect.arrayContaining(
            [
              publicationPermissions
                .submitForReview,

              publicationPermissions
                .publish,
            ],
          ),
        );
      },
    );

    it(
      "does not grant publication permissions to support or customer roles",
      () => {
        expect(
          Object.keys(
            publicationRolePolicy,
          ),
        ).not.toContain(
          "support",
        );

        expect(
          Object.keys(
            publicationRolePolicy,
          ),
        ).not.toContain(
          "customer",
        );
      },
    );
  },
);
