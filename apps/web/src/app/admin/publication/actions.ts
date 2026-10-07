"use server";

import { revalidatePath } from "next/cache";

import {
  auth,
} from "@/auth";

import {
  executeSessionPublicationAction,
  PublicationAuthenticationError,
  PublicationStateConflictError,
  PublicationTargetNotFoundError,
} from "@/lib/publication/session-boundary";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const MAX_REASON_LENGTH =
  1000;

type PublicationActionName =
  | "submit_for_review"
  | "publish";

export type PublicationActionRequest = {
  toolId: string;
  action: PublicationActionName;
  reason?: string;
};

export type PublicationActionResponse =
  | {
      ok: true;
      status: 200;
      toolId: string;
      fromStatus: string;
      toStatus: string;
      lastReviewedAt:
        string | null;
    }
  | {
      ok: false;
      status: 400 | 401 | 403 | 404 | 409 | 500;
      code:
        | "invalid_request"
        | "unauthenticated"
        | "forbidden"
        | "not_found"
        | "state_conflict"
        | "transition_blocked"
        | "internal_error";
      message: string;
      issues?: unknown;
    };

function validateRequest(
  input: PublicationActionRequest,
):
  | {
      ok: true;
      value: PublicationActionRequest;
    }
  | {
      ok: false;
      message: string;
    } {
  if (
    !input ||
    typeof input !== "object" ||
    Array.isArray(input)
  ) {
    return {
      ok: false,
      message:
        "Invalid publication request.",
    };
  }

  const allowedKeys =
    new Set([
      "toolId",
      "action",
      "reason",
    ]);

  const unknownKeys =
    Object.keys(input).filter(
      (key) =>
        !allowedKeys.has(key),
    );

  if (unknownKeys.length > 0) {
    return {
      ok: false,
      message:
        "Publication request contains unsupported fields.",
    };
  }

  const toolId =
    typeof input.toolId === "string"
      ? input.toolId.trim()
      : "";

  if (
    !UUID_PATTERN.test(toolId)
  ) {
    return {
      ok: false,
      message:
        "toolId must be a valid UUID.",
    };
  }

  if (
    input.action !==
      "submit_for_review" &&
    input.action !==
      "publish"
  ) {
    return {
      ok: false,
      message:
        "Unsupported publication action.",
    };
  }

  if (
    input.reason !== undefined &&
    typeof input.reason !== "string"
  ) {
    return {
      ok: false,
      message:
        "reason must be a string.",
    };
  }

  const reason =
    input.reason?.trim();

  if (
    reason &&
    reason.length >
      MAX_REASON_LENGTH
  ) {
    return {
      ok: false,
      message:
        `reason must not exceed ${MAX_REASON_LENGTH} characters.`,
    };
  }

  return {
    ok: true,
    value: {
      toolId,
      action:
        input.action,
      ...(reason
        ? {
            reason,
          }
        : {}),
    },
  };
}

export async function runPublicationAction(
  input: PublicationActionRequest,
): Promise<PublicationActionResponse> {
  const validated =
    validateRequest(input);

  if (!validated.ok) {
    return {
      ok: false,
      status: 400,
      code:
        "invalid_request",
      message:
        validated.message,
    };
  }

  try {
    const session =
      await auth();

    const result =
      await executeSessionPublicationAction(
        session,
        validated.value,
      );

    if (!result.success) {
      if (
        "authorizationError" in
        result
      ) {
        return {
          ok: false,
          status: 403,
          code:
            "forbidden",
          message:
            result
              .authorizationError
              .message,
        };
      }

      return {
        ok: false,
        status: 409,
        code:
          "transition_blocked",
        message:
          "The requested publication transition is not currently allowed.",
        issues:
          result.issues,
      };
    }

    revalidatePath(
      "/admin/publication",
    );
    revalidatePath(
      `/admin/publication/${result.toolId}`,
    );

    return {
      ok: true,
      status: 200,
      toolId:
        result.toolId,
      fromStatus:
        result.fromStatus,
      toStatus:
        result.toStatus,
      lastReviewedAt:
        result.lastReviewedAt
          ? result.lastReviewedAt.toISOString()
          : null,
    };
  } catch (error) {
    if (
      error instanceof
      PublicationAuthenticationError
    ) {
      return {
        ok: false,
        status: 401,
        code:
          "unauthenticated",
        message:
          "Authentication is required.",
      };
    }

    if (
      error instanceof
      PublicationTargetNotFoundError
    ) {
      return {
        ok: false,
        status: 404,
        code:
          "not_found",
        message:
          "The publication target was not found.",
      };
    }

    if (
      error instanceof
      PublicationStateConflictError
    ) {
      return {
        ok: false,
        status: 409,
        code:
          "state_conflict",
        message:
          "The publication state changed before the action completed. Refresh and try again.",
      };
    }

    /*
     * Do not leak database, schema, stack, or policy internals to the
     * browser. Server-side observability can record the original error
     * when the platform logging layer is introduced.
     */
    console.error(
      "Publication action failed.",
      error,
    );

    return {
      ok: false,
      status: 500,
      code:
        "internal_error",
      message:
        "The publication action could not be completed.",
    };
  }
}
