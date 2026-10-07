"use server";

import { revalidatePath } from "next/cache";

import {
  archiveStudyGoal,
  createStudyGoal,
  saveStudentProfile,
  setStudyGoalCompleted,
} from "@education/database";

import { auth } from "@/auth";

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
    (targetDate && !/^\d{4}-\d{2}-\d{2}$/.test(targetDate)) ||
    (targetMinutes !== null &&
      (!Number.isInteger(targetMinutes) ||
       targetMinutes < 1 ||
       targetMinutes > 100000))
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
    timezone.length < 1 ||
    timezone.length > 80 ||
    !Number.isInteger(minutes) ||
    minutes < 0 ||
    minutes > 10080
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

