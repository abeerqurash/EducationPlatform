import { getStudentWorkspace } from "@education/database";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createGoalHealthReport, formatGoalHealthText } from "../health-report";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id?.trim();
  if (!session?.user || !userId) return NextResponse.json({ error: "Authentication required" }, { status: 401, headers: { "Cache-Control": "private, no-store" } });
  const workspace = await getStudentWorkspace(userId);
  const todayUtc = new Date().toISOString().slice(0, 10);
  const report = createGoalHealthReport(workspace.goals, todayUtc);
  return new Response(formatGoalHealthText(report), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": 'attachment; filename="educationplatform-goal-health.txt"',
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
