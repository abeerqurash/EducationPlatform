import {
  and,
  desc,
  eq,
  gte,
  sql,
} from "drizzle-orm";

import { db } from "../client";
import {
  studentProfiles,
  studyActivities,
  studyGoals,
} from "../schema";

export async function getStudentWorkspace(userId: string) {
  const [profile, goals, activities] = await Promise.all([
    db.select().from(studentProfiles)
      .where(eq(studentProfiles.userId, userId)).limit(1),
    db.select().from(studyGoals)
      .where(and(
        eq(studyGoals.userId, userId),
        eq(studyGoals.isArchived, false),
      ))
      .orderBy(desc(studyGoals.createdAt))
      .limit(20),
    db.select().from(studyActivities)
      .where(eq(studyActivities.userId, userId))
      .orderBy(desc(studyActivities.createdAt))
      .limit(50),
  ]);

  return {
    profile: profile[0] ?? null,
    goals,
    activities,
  };
}

export async function createStudyGoal(input: {
  userId: string;
  title: string;
  description?: string | null;
  targetDate?: string | null;
  targetMinutes?: number | null;
}) {
  const [created] = await db.insert(studyGoals).values(input).returning();
  return created;
}

export async function setStudyGoalCompleted(
  userId: string,
  goalId: string,
  completed: boolean,
) {
  const [updated] = await db.update(studyGoals)
    .set({
      completedAt: completed
        ? new Date().toISOString().slice(0, 10)
        : null,
      updatedAt: new Date(),
    })
    .where(and(
      eq(studyGoals.id, goalId),
      eq(studyGoals.userId, userId),
    ))
    .returning({ id: studyGoals.id });
  return Boolean(updated);
}

export async function archiveStudyGoal(userId: string, goalId: string) {
  const [updated] = await db.update(studyGoals)
    .set({ isArchived: true, updatedAt: new Date() })
    .where(and(
      eq(studyGoals.id, goalId),
      eq(studyGoals.userId, userId),
    ))
    .returning({ id: studyGoals.id });
  return Boolean(updated);
}

export async function saveStudentProfile(input: {
  userId: string;
  timezone: string;
  weeklyStudyTargetMinutes: number;
  emailStudyReminders: boolean;
}) {
  const [profile] = await db.insert(studentProfiles)
    .values(input)
    .onConflictDoUpdate({
      target: studentProfiles.userId,
      set: {
        timezone: input.timezone,
        weeklyStudyTargetMinutes: input.weeklyStudyTargetMinutes,
        emailStudyReminders: input.emailStudyReminders,
        updatedAt: new Date(),
      },
    })
    .returning();
  return profile;
}

export async function recordStudyActivity(input: {
  userId: string;
  activityType: string;
  title: string;
  durationMinutes?: number;
  metadata?: Record<string, unknown>;
}) {
  const [created] = await db.insert(studyActivities).values({
    ...input,
    durationMinutes: input.durationMinutes ?? 0,
    metadata: input.metadata ?? {},
  }).returning();
  return created;
}

export async function getStudyProgress(userId: string) {
  const since = new Date();
  since.setUTCDate(since.getUTCDate() - 6);
  since.setUTCHours(0, 0, 0, 0);

  const recent = await db.select().from(studyActivities)
    .where(and(
      eq(studyActivities.userId, userId),
      gte(studyActivities.createdAt, since),
    ))
    .orderBy(desc(studyActivities.createdAt))
    .limit(100);

  const totalMinutes = recent.reduce(
    (sum, item) => sum + item.durationMinutes,
    0,
  );

  return {
    activities: recent,
    totalMinutes,
    activityCount: recent.length,
  };
}
