import {
  describe,
  expect,
  it,
} from "vitest";

import {
  getAuthenticatedPublicationUserId,
  PublicationAuthenticationError,
} from "./session-boundary";

describe(
  "publication Auth.js session boundary",
  () => {
    it(
      "uses the authenticated session user id",
      () => {
        expect(
          getAuthenticatedPublicationUserId(
            {
              user: {
                id:
                  "00000000-0000-4000-8000-000000000001",
              },
            },
          ),
        ).toBe(
          "00000000-0000-4000-8000-000000000001",
        );
      },
    );

    it.each([
      null,
      {},
      {
        user: null,
      },
      {
        user: {},
      },
      {
        user: {
          id: "",
        },
      },
      {
        user: {
          id: "   ",
        },
      },
    ])(
      "rejects a missing authenticated identity",
      (session) => {
        expect(
          () =>
            getAuthenticatedPublicationUserId(
              session,
            ),
        ).toThrow(
          PublicationAuthenticationError,
        );
      },
    );
  },
);
