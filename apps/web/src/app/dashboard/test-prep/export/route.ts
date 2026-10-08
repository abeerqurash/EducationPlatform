import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getStudentTestPrepExport, normalizeTestPrepHistoryQuery } from "@education/database";

export const dynamic = "force-dynamic";

/** Prevent spreadsheet formulas and preserve CSV quoting for user-provided text. */
export function csvCell(value: unknown): string {
  let text = String(value ?? "");
  if (/^[\s\u0000-\u001f]*[=+@\-]/u.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

export async function GET(request: Request) {
  const session = await auth();
  const userId = session?.user?.id?.trim();
  if (!session?.user || !userId) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  const url = new URL(request.url);
  const query = normalizeTestPrepHistoryQuery({
    exam: url.searchParams.get("exam") ?? undefined,
    q: url.searchParams.get("q") ?? undefined,
    sort: url.searchParams.get("sort") ?? undefined,
    from: url.searchParams.get("from") ?? undefined,
    to: url.searchParams.get("to") ?? undefined,
  });
  const rows = await getStudentTestPrepExport(userId, query);
  const header = ["Date (UTC)", "Exam", "Tool", "Summary", "Calculator version"];
  const body = rows.map((row) => [
    row.createdAt.toISOString(),
    /(^|-)sat(-|$)/.test(row.toolSlug) ? "SAT" : "ACT",
    row.toolName,
    row.summary,
    row.calculatorVersion ?? "",
  ]);
  const csv = "\uFEFF" + [header, ...body].map((line) => line.map(csvCell).join(",")).join("\r\n") + "\r\n";
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="educationplatform-exam-results.csv"',
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
