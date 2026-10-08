import {
  and,
  desc,
  asc,
  eq,
  inArray,
  gte,
  lt,
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

export async function updateStudyGoal(input: {
  userId: string;
  goalId: string;
  title: string;
  description: string | null;
  targetDate: string | null;
  targetMinutes: number | null;
}) {
  const [updated] = await db.update(studyGoals)
    .set({
      title: input.title,
      description: input.description,
      targetDate: input.targetDate,
      targetMinutes: input.targetMinutes,
      updatedAt: new Date(),
    })
    .where(and(
      eq(studyGoals.id, input.goalId),
      eq(studyGoals.userId, input.userId),
      eq(studyGoals.isArchived, false),
    ))
    .returning({ id: studyGoals.id });
  return Boolean(updated);
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
      eq(studyGoals.isArchived, false),
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
      eq(studyGoals.isArchived, false),
    ))
    .returning({ id: studyGoals.id });
  return Boolean(updated);
}

/** Restore only a goal owned by the current user. */
export async function restoreStudyGoal(userId: string, goalId: string) {
  const [restored] = await db.update(studyGoals)
    .set({ isArchived: false, updatedAt: new Date() })
    .where(and(
      eq(studyGoals.id, goalId),
      eq(studyGoals.userId, userId),
      eq(studyGoals.isArchived, true),
    ))
    .returning({ id: studyGoals.id });
  return Boolean(restored);
}

/** Remove only manually entered sessions; calculator events are immutable here. */
export async function deleteManualStudySession(userId: string, activityId: string) {
  const [deleted] = await db.delete(studyActivities)
    .where(and(
      eq(studyActivities.id, activityId),
      eq(studyActivities.userId, userId),
      eq(studyActivities.activityType, "study_session"),
      sql`${studyActivities.metadata} ->> 'source' = 'manual_study_log'`,
    ))
    .returning({ id: studyActivities.id });
  return Boolean(deleted);
}

/** Archive history, newest first; caller identity is always required. */
export async function getArchivedStudyGoals(userId: string) {
  return db.select().from(studyGoals)
    .where(and(eq(studyGoals.userId, userId), eq(studyGoals.isArchived, true)))
    .orderBy(desc(studyGoals.updatedAt), asc(studyGoals.id))
    .limit(50);
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
  const until = new Date();
  until.setUTCHours(0, 0, 0, 0);
  until.setUTCDate(until.getUTCDate() + 1);

  const [recent, totals, dailyRows] = await Promise.all([
    db.select().from(studyActivities)
      .where(and(
        eq(studyActivities.userId, userId),
        gte(studyActivities.createdAt, since),
        lt(studyActivities.createdAt, until),
      ))
      .orderBy(desc(studyActivities.createdAt))
      .limit(100),
    db.select({
      totalMinutes: sql<number>`coalesce(sum(${studyActivities.durationMinutes}), 0)::int`,
      activityCount: sql<number>`count(*)::int`,
    }).from(studyActivities)
      .where(and(
        eq(studyActivities.userId, userId),
        gte(studyActivities.createdAt, since),
        lt(studyActivities.createdAt, until),
      )),
    db.select({
      day: sql<string>`(date(${studyActivities.createdAt} at time zone 'UTC'))::text`,
      minutes: sql<number>`coalesce(sum(${studyActivities.durationMinutes}), 0)::int`,
      count: sql<number>`count(*)::int`,
    }).from(studyActivities)
      .where(and(
        eq(studyActivities.userId, userId),
        gte(studyActivities.createdAt, since),
        lt(studyActivities.createdAt, until),
      ))
      .groupBy(sql`date(${studyActivities.createdAt} at time zone 'UTC')`)
      .orderBy(sql`date(${studyActivities.createdAt} at time zone 'UTC')`),
  ]);

  const dayTotals = new Map(dailyRows.map((row) => [row.day, row]));
  const daily = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(since);
    date.setUTCDate(since.getUTCDate() + index);
    const day = date.toISOString().slice(0, 10);
    const found = dayTotals.get(day);
    return { day, minutes: found?.minutes ?? 0, count: found?.count ?? 0 };
  });

  return {
    activities: recent,
    daily,
    activeDays: daily.filter((day) => day.count > 0).length,
    totalMinutes: totals[0]?.totalMinutes ?? 0,
    activityCount: totals[0]?.activityCount ?? 0,
  };
}

export async function getStudyGoalSummary(userId: string) {
  const [summary] = await db.select({
    activeGoals: sql<number>`count(*) filter (where ${studyGoals.completedAt} is null)::int`,
    completedGoals: sql<number>`count(*) filter (where ${studyGoals.completedAt} is not null)::int`,
    totalGoals: sql<number>`count(*)::int`,
  }).from(studyGoals)
    .where(and(
      eq(studyGoals.userId, userId),
      eq(studyGoals.isArchived, false),
    ));

  return summary ?? { activeGoals: 0, completedGoals: 0, totalGoals: 0 };
}

/** Last 30 complete-or-current UTC calendar days; no client-supplied dates. */
export async function getStudyMonthlyTrend(userId: string) {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const since = new Date(today);
  since.setUTCDate(since.getUTCDate() - 29);
  const until = new Date(today);
  until.setUTCDate(until.getUTCDate() + 1);

  const [summary, rows] = await Promise.all([
    db.select({
      minutes: sql<number>`coalesce(sum(${studyActivities.durationMinutes}), 0)::int`,
      activities: sql<number>`count(*)::int`,
      activeDays: sql<number>`count(distinct date(${studyActivities.createdAt} at time zone 'UTC'))::int`,
    }).from(studyActivities).where(and(
      eq(studyActivities.userId, userId),
      gte(studyActivities.createdAt, since),
      lt(studyActivities.createdAt, until),
    )),
    db.select({
      day: sql<string>`(date(${studyActivities.createdAt} at time zone 'UTC'))::text`,
      minutes: sql<number>`coalesce(sum(${studyActivities.durationMinutes}), 0)::int`,
      activities: sql<number>`count(*)::int`,
    }).from(studyActivities).where(and(
      eq(studyActivities.userId, userId),
      gte(studyActivities.createdAt, since),
      lt(studyActivities.createdAt, until),
    )).groupBy(sql`date(${studyActivities.createdAt} at time zone 'UTC')`)
      .orderBy(sql`date(${studyActivities.createdAt} at time zone 'UTC')`),
  ]);

  const byDay = new Map(rows.map((row) => [row.day, row]));
  const daily = Array.from({ length: 30 }, (_, offset) => {
    const date = new Date(since);
    date.setUTCDate(since.getUTCDate() + offset);
    const day = date.toISOString().slice(0, 10);
    const value = byDay.get(day);
    return { day, minutes: value?.minutes ?? 0, activities: value?.activities ?? 0 };
  });
  return {
    daily,
    totalMinutes: summary[0]?.minutes ?? 0,
    activityCount: summary[0]?.activities ?? 0,
    activeDays: summary[0]?.activeDays ?? 0,
  };
}


/** Bounded, account-scoped UTC export windows; dashboard charts retain their 30-day source. */
export async function getStudyProgressExportWindow(userId: string, days: 7 | 30 | 90) {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const since = new Date(today);
  since.setUTCDate(since.getUTCDate() - (days - 1));
  const until = new Date(today);
  until.setUTCDate(until.getUTCDate() + 1);

  const [summary, rows] = await Promise.all([
    db.select({
      minutes: sql<number>`coalesce(sum(${studyActivities.durationMinutes}), 0)::int`,
      activities: sql<number>`count(*)::int`,
      activeDays: sql<number>`count(distinct date(${studyActivities.createdAt} at time zone 'UTC'))::int`,
    }).from(studyActivities).where(and(
      eq(studyActivities.userId, userId),
      gte(studyActivities.createdAt, since),
      lt(studyActivities.createdAt, until),
    )),
    db.select({
      day: sql<string>`(date(${studyActivities.createdAt} at time zone 'UTC'))::text`,
      minutes: sql<number>`coalesce(sum(${studyActivities.durationMinutes}), 0)::int`,
      activities: sql<number>`count(*)::int`,
    }).from(studyActivities).where(and(
      eq(studyActivities.userId, userId),
      gte(studyActivities.createdAt, since),
      lt(studyActivities.createdAt, until),
    )).groupBy(sql`date(${studyActivities.createdAt} at time zone 'UTC')`)
      .orderBy(sql`date(${studyActivities.createdAt} at time zone 'UTC')`),
  ]);

  const byDay = new Map(rows.map((row) => [row.day, row]));
  const daily = Array.from({ length: days }, (_, offset) => {
    const date = new Date(since);
    date.setUTCDate(since.getUTCDate() + offset);
    const day = date.toISOString().slice(0, 10);
    const value = byDay.get(day);
    return { day, minutes: value?.minutes ?? 0, activities: value?.activities ?? 0 };
  });
  return {
    daily,
    totalMinutes: summary[0]?.minutes ?? 0,
    activityCount: summary[0]?.activities ?? 0,
    activeDays: summary[0]?.activeDays ?? 0,
  };
}

/** Atomic account-scoped bulk mutation. Never modifies archived goals. */
export async function bulkUpdateStudyGoals(userId: string, goalIds: string[], operation: "complete" | "reopen" | "archive") {
  if (!goalIds.length || goalIds.length > 50) return 0;
  const values = operation === "archive"
    ? { isArchived: true, updatedAt: new Date() }
    : { completedAt: operation === "complete" ? new Date().toISOString().slice(0, 10) : null, updatedAt: new Date() };
  const changed = await db.update(studyGoals).set(values).where(and(
    eq(studyGoals.userId, userId), eq(studyGoals.isArchived, false), inArray(studyGoals.id, goalIds),
  )).returning({ id: studyGoals.id });
  return changed.length;
}
