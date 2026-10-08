"use server";

import { revalidatePath } from "next/cache";

import {
  archiveStudyGoal,
  restoreStudyGoal,
  deleteManualStudySession,
  createStudyGoal,
  updateStudyGoal,
  recordStudyActivity,
  saveStudentProfile,
  setStudyGoalCompleted,
} from "@education/database";

import { auth } from "@/auth";
import { validCalendarDate, validIanaTimezone, validStudyMinutes } from "@/lib/study-input-validation";

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function userId() {
  const session = await auth();
  const id = session?.user?.id?.trim();
  return id && UUID.test(id) ? id : null;
}

export async function createStudyGoalAction(formData: FormData) {
  const id = await userId();
  if (!id) return;

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const targetDate = String(formData.get("targetDate") ?? "").trim();
  const rawMinutes = String(formData.get("targetMinutes") ?? "").trim();
  const targetMinutes = rawMinutes ? Number(rawMinutes) : null;

  if (
    title.length < 2 ||
    title.length > 160 ||
    description.length > 1000 ||
    (targetDate && !validCalendarDate(targetDate)) ||
    (targetMinutes !== null &&
      (!validStudyMinutes(targetMinutes, 100000) || targetMinutes === 0))
  ) {
    return;
  }

  await createStudyGoal({
    userId: id,
    title,
    description: description || null,
    targetDate: targetDate || null,
    targetMinutes,
  });

  revalidatePath("/dashboard/study-plan");
  revalidatePath("/dashboard/progress");
}

export async function updateStudyGoalAction(formData: FormData) {
  const id = await userId();
  const goalId = String(formData.get("goalId") ?? "").trim();
  if (!id || !UUID.test(goalId)) return;

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const targetDate = String(formData.get("targetDate") ?? "").trim();
  const rawMinutes = String(formData.get("targetMinutes") ?? "").trim();
  const targetMinutes = rawMinutes ? Number(rawMinutes) : null;
  if (
    title.length < 2 || title.length > 160 ||
    description.length > 1000 ||
    (targetDate && !validCalendarDate(targetDate)) ||
    (targetMinutes !== null &&
      (!validStudyMinutes(targetMinutes, 100000) || targetMinutes === 0))
  ) return;

  const ok = await updateStudyGoal({
    userId: id,
    goalId,
    title,
    description: description || null,
    targetDate: targetDate || null,
    targetMinutes,
  });
  if (ok) {
    revalidatePath("/dashboard/study-plan");
    revalidatePath("/dashboard/progress");
  }
  return;
}

export async function toggleStudyGoalAction(goalId: string, completed: boolean) {
  const id = await userId();
  if (!id || !UUID.test(goalId)) return { ok: false };
  const ok = await setStudyGoalCompleted(id, goalId, completed);
  revalidatePath("/dashboard/study-plan");
  revalidatePath("/dashboard/progress");
  return { ok };
}

export async function archiveStudyGoalAction(goalId: string) {
  const id = await userId();
  if (!id || !UUID.test(goalId)) return { ok: false };
  const ok = await archiveStudyGoal(id, goalId);
  revalidatePath("/dashboard/study-plan");
  return { ok };
}

export async function saveStudentProfileAction(formData: FormData) {
  const id = await userId();
  if (!id) return;

  const timezone = String(formData.get("timezone") ?? "UTC").trim();
  const minutes = Number(formData.get("weeklyStudyTargetMinutes"));
  const reminders = formData.get("emailStudyReminders") === "on";

  if (
    !validIanaTimezone(timezone) ||
    !validStudyMinutes(minutes, 10080)
  ) {
    return;
  }

  await saveStudentProfile({
    userId: id,
    timezone,
    weeklyStudyTargetMinutes: minutes,
    emailStudyReminders: reminders,
  });

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard/progress");
}


/** Record an actual, completed study session; no timer or time claim is inferred. */
export async function recordStudySessionAction(formData: FormData): Promise<void> {
  const id = await userId();
  if (!id) return;
  const titleValue = formData.get("title");
  const minutesValue = formData.get("durationMinutes");
  if (typeof titleValue !== "string" || typeof minutesValue !== "string") return;
  const title = titleValue.trim();
  const rawMinutes = minutesValue.trim();
  const durationMinutes = Number(rawMinutes);
  if (
    title.length < 2 || title.length > 180 ||
    !rawMinutes || !validStudyMinutes(durationMinutes, 720) || durationMinutes === 0
  ) return;

  await recordStudyActivity({
    userId: id,
    activityType: "study_session",
    title,
    durationMinutes,
    metadata: { source: "manual_study_log" },
  });
  revalidatePath("/dashboard/progress");
  revalidatePath("/dashboard");
}

/** A user may undo their own manual entry, never a calculator-generated event. */
export async function deleteManualStudySessionAction(formData: FormData): Promise<void> {
  const id = await userId();
  const activityId = String(formData.get("activityId") ?? "").trim();
  if (!id || !UUID.test(activityId)) return;
  const deleted = await deleteManualStudySession(id, activityId);
  if (!deleted) return;
  revalidatePath("/dashboard/progress");
  revalidatePath("/dashboard");
}

export async function restoreStudyGoalAction(formData: FormData): Promise<void> {
  const id = await userId();
  const goalId = String(formData.get("goalId") ?? "").trim();
  if (!id || !UUID.test(goalId)) return;
  if (!await restoreStudyGoal(id, goalId)) return;
  revalidatePath("/dashboard/study-plan");
  revalidatePath("/dashboard/progress");
}
