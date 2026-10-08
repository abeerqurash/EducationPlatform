import { getStudyMonthlyTrend } from "@education/database";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { formatProgressCsv } from "../export-format";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id?.trim();
  if (!session?.user || !userId) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401, headers: { "Cache-Control": "private, no-store" } });
  }
  const progress = await getStudyMonthlyTrend(userId);
  return new Response(formatProgressCsv(progress), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="educationplatform-study-progress-30-day.csv"',
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
