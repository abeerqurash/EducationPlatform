"use server";

import { revalidatePath } from "next/cache";

import {
  createStudentResult,
  removeStudentResult,
} from "@education/database";

import { auth } from "@/auth";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type SaveResultRequest = {
  toolSlug: string;
  toolName: string;
  summary: string;
  inputSnapshot: Record<string, unknown>;
  resultSnapshot: Record<string, unknown>;
};

type SaveResultResponse =
  | { ok: true; id: string }
  | { ok: false; message: string };

function isPlainObject(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function serializedSize(value: unknown) {
  try {
    return JSON.stringify(value).length;
  } catch {
    return Number.POSITIVE_INFINITY;
  }
}

export async function saveStudentResult(
  request: SaveResultRequest,
): Promise<SaveResultResponse> {
  const session = await auth();
  const userId = session?.user?.id?.trim();

  if (!userId || !UUID_PATTERN.test(userId)) {
    return {
      ok: false,
      message: "Sign in to save this result.",
    };
  }

  const toolSlug = request.toolSlug.trim();
  const toolName = request.toolName.trim();
  const summary = request.summary.trim();

  if (
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(toolSlug) ||
    toolSlug.length > 200 ||
    toolName.length < 1 ||
    toolName.length > 180 ||
    summary.length < 1 ||
    summary.length > 300 ||
    !isPlainObject(request.inputSnapshot) ||
    !isPlainObject(request.resultSnapshot) ||
    serializedSize(request.inputSnapshot) > 25_000 ||
    serializedSize(request.resultSnapshot) > 25_000
  ) {
    return {
      ok: false,
      message: "This result could not be saved.",
    };
  }

  const created = await createStudentResult({
    userId,
    toolSlug,
    toolName,
    summary,
    inputSnapshot: request.inputSnapshot,
    resultSnapshot: request.resultSnapshot,
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/saved");

  return {
    ok: true,
    id: created.id,
  };
}

export async function deleteStudentResult(
  resultId: string,
) {
  const session = await auth();
  const userId = session?.user?.id?.trim();

  if (
    !userId ||
    !UUID_PATTERN.test(userId) ||
    !UUID_PATTERN.test(resultId)
  ) {
    return {
      ok: false,
      message: "Unable to remove this result.",
    };
  }

  const removed = await removeStudentResult(
    userId,
    resultId,
  );

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/saved");

  return {
    ok: removed,
    message: removed
      ? "Result removed."
      : "Result was not found.",
  };
}
