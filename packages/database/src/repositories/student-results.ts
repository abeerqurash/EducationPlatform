import {
  and,
  count,
  desc,
  eq,
} from "drizzle-orm";

import { db } from "../client";
import {
  studentCalculatorResults,
  tools,
  type StudentResultPayload,
} from "../schema";

export type CreateStudentResultInput = {
  userId: string;
  toolSlug: string;
  toolName: string;
  calculatorVersion?: string | null;
  inputSnapshot: StudentResultPayload;
  resultSnapshot: StudentResultPayload;
  summary: string;
};

export async function createStudentResult(
  input: CreateStudentResultInput,
) {
  const [tool] = await db
    .select({
      id: tools.id,
      currentVersion: tools.currentVersion,
    })
    .from(tools)
    .where(eq(tools.slug, input.toolSlug))
    .limit(1);

  const [created] = await db
    .insert(studentCalculatorResults)
    .values({
      userId: input.userId,
      toolId: tool?.id ?? null,
      toolSlug: input.toolSlug,
      toolName: input.toolName,
      calculatorVersion:
        input.calculatorVersion ??
        tool?.currentVersion ??
        null,
      inputSnapshot: input.inputSnapshot,
      resultSnapshot: input.resultSnapshot,
      summary: input.summary,
      isSaved: true,
    })
    .returning({
      id: studentCalculatorResults.id,
      createdAt:
        studentCalculatorResults.createdAt,
    });

  return created;
}

export async function listStudentResults(
  userId: string,
  limit = 20,
) {
  const safeLimit = Math.min(
    Math.max(Math.trunc(limit), 1),
    50,
  );

  return db
    .select({
      id: studentCalculatorResults.id,
      toolSlug:
        studentCalculatorResults.toolSlug,
      toolName:
        studentCalculatorResults.toolName,
      summary: studentCalculatorResults.summary,
      resultSnapshot:
        studentCalculatorResults.resultSnapshot,
      calculatorVersion:
        studentCalculatorResults.calculatorVersion,
      createdAt:
        studentCalculatorResults.createdAt,
    })
    .from(studentCalculatorResults)
    .where(
      and(
        eq(
          studentCalculatorResults.userId,
          userId,
        ),
        eq(
          studentCalculatorResults.isSaved,
          true,
        ),
      ),
    )
    .orderBy(
      desc(studentCalculatorResults.createdAt),
      desc(studentCalculatorResults.id),
    )
    .limit(safeLimit);
}

export async function getStudentResultCount(
  userId: string,
) {
  const [row] = await db
    .select({
      value: count(),
    })
    .from(studentCalculatorResults)
    .where(
      and(
        eq(
          studentCalculatorResults.userId,
          userId,
        ),
        eq(
          studentCalculatorResults.isSaved,
          true,
        ),
      ),
    );

  return Number(row?.value ?? 0);
}

export async function removeStudentResult(
  userId: string,
  resultId: string,
) {
  const [removed] = await db
    .delete(studentCalculatorResults)
    .where(
      and(
        eq(
          studentCalculatorResults.id,
          resultId,
        ),
        eq(
          studentCalculatorResults.userId,
          userId,
        ),
      ),
    )
    .returning({
      id: studentCalculatorResults.id,
    });

  return Boolean(removed);
}


export async function getStudentResultOverview(
  userId: string,
) {
  const results =
    await listStudentResults(
      userId,
      5,
    );

  const allSaved =
    await db
      .select({
        toolSlug:
          studentCalculatorResults.toolSlug,
      })
      .from(studentCalculatorResults)
      .where(
        and(
          eq(
            studentCalculatorResults.userId,
            userId,
          ),
          eq(
            studentCalculatorResults.isSaved,
            true,
          ),
        ),
      );

  return {
    savedResultCount:
      allSaved.length,
    toolsUsed:
      new Set(
        allSaved.map(
          (row) => row.toolSlug,
        ),
      ).size,
    recentResults: results,
  };
}
