import { asc, desc, eq } from "drizzle-orm";
import { db } from "../client";
import { studyGoals } from "../schema";

/** Bounded, user-owned export independent of the dashboard's 20/50 row previews. */
export async function getStudyGoalExport(userId: string) {
  if (!userId.trim()) throw new Error("Authenticated user required");
  return db.select({
    title: studyGoals.title,
    description: studyGoals.description,
    targetDate: studyGoals.targetDate,
    targetMinutes: studyGoals.targetMinutes,
    completedAt: studyGoals.completedAt,
    isArchived: studyGoals.isArchived,
    createdAt: studyGoals.createdAt,
    updatedAt: studyGoals.updatedAt,
  }).from(studyGoals)
    .where(eq(studyGoals.userId, userId))
    .orderBy(desc(studyGoals.createdAt), asc(studyGoals.id))
    .limit(1000);
}
