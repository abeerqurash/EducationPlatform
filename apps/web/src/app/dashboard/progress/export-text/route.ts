import { parseProgressExportDays } from "../export-window";
import { getStudyProgressExportWindow } from "@education/database";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { formatProgressText } from "../export-format";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const days = parseProgressExportDays(new URL(request.url).searchParams.get("days"));
  const session = await auth();
  const userId = session?.user?.id?.trim();
  if (!session?.user || !userId) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401, headers: { "Cache-Control": "private, no-store" } });
  }
  const records = await getStudyProgressExportWindow(userId, days);
  return new Response(formatProgressText(records), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="educationplatform-study-progress-${days}-day.txt"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
