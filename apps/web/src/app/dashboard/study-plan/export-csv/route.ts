import { filterStudyGoalExport, parseGoalExportStatus } from "../export-filter";
import { auth } from "@/auth";
import { getStudyGoalExport } from "@education/database";
import { NextResponse } from "next/server";
import { formatStudyGoalsCsv } from "../export-format";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const session = await auth();
  const userId = session?.user?.id?.trim();
  if (!session?.user || !userId) return NextResponse.json({ error: "Authentication required" }, { status: 401, headers: { "Cache-Control": "private, no-store" } });
  const rows = await getStudyGoalExport(userId);
  return new Response(formatStudyGoalsCsv(filterStudyGoalExport(rows, parseGoalExportStatus(new URL(request.url).searchParams.get("status")))), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="educationplatform-study-goals.csv"',
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
