import { getStudentWorkspace } from "@education/database";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createGoalHealthReport, formatGoalHealthCsv } from "../health-report";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id?.trim();
  if (!session?.user || !userId) return NextResponse.json({ error: "Authentication required" }, { status: 401, headers: { "Cache-Control": "private, no-store" } });
  const workspace = await getStudentWorkspace(userId);
  const todayUtc = new Date().toISOString().slice(0, 10);
  const report = createGoalHealthReport(workspace.goals, todayUtc);
  return new Response(formatGoalHealthCsv(report), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="educationplatform-goal-health.csv"',
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
