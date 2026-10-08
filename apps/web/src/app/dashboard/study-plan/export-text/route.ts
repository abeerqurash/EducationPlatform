import { getStudyGoalExport } from "@education/database";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { formatStudyGoalsText } from "../export-format";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id?.trim();
  if (!session?.user || !userId) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401, headers: { "Cache-Control": "private, no-store" } });
  }
  const records = await getStudyGoalExport(userId);
  return new Response(formatStudyGoalsText(records), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": 'attachment; filename="educationplatform-study-goals.txt"',
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
