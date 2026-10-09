/** A pure, deterministic retention policy planner; deletion must be explicitly scheduled. */
export function practiceRetentionCutoff(now: Date, retentionDays: number): Date {
  if (!Number.isInteger(retentionDays) || retentionDays < 1 || retentionDays > 36500 ||
      !Number.isFinite(now.getTime())) throw new Error("Invalid retention policy");
  return new Date(now.getTime() - retentionDays * 86_400_000);
}
export function practiceDataPolicy() {
  return {
    purpose: "Student-owned practice history and progress",
    collected: ["exam", "question IDs", "selected answers", "computed score", "duration", "topic breakdown"],
    excluded: ["email", "name", "IP address", "raw free-text responses"],
    access: "Authenticated account owner only",
    deletion: "Owner-initiated deletion supported by repository; retention automation not yet enabled",
  } as const;
}
