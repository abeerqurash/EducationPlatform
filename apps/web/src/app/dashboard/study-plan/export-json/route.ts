import { auth } from "@/auth";
import { getStudyGoalExport } from "@education/database";
import { NextResponse } from "next/server";
import { formatStudyGoalsJson } from "../export-format";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id?.trim();
  if (!session?.user || !userId) return NextResponse.json({ error: "Authentication required" }, { status: 401, headers: { "Cache-Control": "private, no-store" } });
  const rows = await getStudyGoalExport(userId);
  return new Response(formatStudyGoalsJson(rows), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": 'attachment; filename="educationplatform-study-goals.json"',
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
